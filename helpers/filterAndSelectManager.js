const ObjectId = require('mongoose').Types.ObjectId;
const roles = require('../enums/roles');
const { visibility } = require('../enums/collection');
const { status } = require('../enums/vendor');

exports.filterHandler = (options) => {
    const collectionFilter = {
        ...(options.collectionID ? { _id: new ObjectId(options.collectionID) } : {}),
        ...(options.vendorID ? { vendor: new ObjectId(options.vendorID) } : {}),
        ...(options.role === roles.USER ? { isDeleted: false} : {}),
        ...(options.role === roles.USER ? { visibility: visibility.PUBLIC} : {}),
        ...(options.role !== roles.USER && options.visibility ? { visibility: options.visibility } : {}),
    }

    let productFilter = {
        ...(options.vendorID ? { vendor: new ObjectId(options.vendorID) } : {}),
        ...(options.name ? { 'name': { $regex: options.name , $options: 'i' } } : {}),
        ...(options.category ? { 'category': options.category } : {}),
        ...(options.role === roles.USER ? { 'isDeleted': false} : {}),
    };

    if (options.availability || options.minPrice || options.maxPrice) {
        productFilter.productDetails = {
            $elemMatch: {
                ...(options.availability ? { quantity: { $gt: 0 } } : options.availability === false ? { quantity: 0 } : {}),
                ...(options.minPrice || options.maxPrice ? {
                    price: {
                      ...(options.minPrice ? { $gte: options.minPrice } : {}),
                      ...(options.maxPrice ? { $lte: options.maxPrice } : {})
                    }
                } : {})
            }
        }
    }

    const vendorFilter = {
        ...(options.role === roles.VENDOR || options.role === roles.USER ? { status: status.ACTIVE, isDeleted: false } : {}),
    };

    const categoryFilter = {
        ...(options.role === roles.USER || options.role === roles.VENDOR ? { depth:1, isDeleted: false } : {}),
    };

    const subcategoriesFilter = {
       ...(options.role === roles.USER || options.role === roles.VENDOR ? { isDeleted: false } : {}),
    };

    const userFilter = {
        ...(options.name ? { 'name': { $regex: options.name , $options: 'i' } } : {}),
        ...(options.isDeleted !== undefined ? { 'isDeleted': options.isDeleted } : {}),
        ...(options.country ? { 'country': options.country } : {}),
        ...(options.city ? { 'city': options.city } : {}),
        ...(options.region ? { 'region': options.region } : {}),
        ...(options.role === roles.VENDOR || options.role === roles.USER ? { isDeleted: false } : {}),
    }

    const reviewFilter = {
       ...(options.productID ? { product: new ObjectId(options.productID) } : {}),
       ...(options.role === roles.USER || options.role === roles.VENDOR ? { isDeleted: false } : {}),
       ...(options.isVerified !== undefined ? { isVerified: options.isVerified } : {}),
       ...(options.search ? { $or: [{ 'title': { $regex: options.search , $options: 'i' } }, { 'description': { $regex: options.search , $options: 'i' } }] } : {}),
       ...(options.filterByStar ? { 'rating': options.filterByStar } : {}),
    }

    return { 
        collectionFilter, 
        productFilter, 
        vendorFilter, 
        categoryFilter, 
        subcategoriesFilter, 
        userFilter, 
        reviewFilter 
    };
}


exports.selectHandler = (options) => {
    let collectionSelect = "_id name description banner vendor";
    let productSelect = "_id name description Images video averageRating productDetails material discountType discountValue category";
    let vendorSelect = "_id name email profileImage coverImage primaryPhone secondaryPhone country city region gender";
    let categorySelect = "_id name";
    let subcategoriesSelect = "_id name parent";
    let userSelect = "_id name country city region phone image";
    let reviewSelect = "_id author title description rating isVerified voteCount upVotes downVotes replies";

    if (options.role !== roles.USER) {
        productSelect += " isDeleted";
        collectionSelect += " visibility isDeleted";
        vendorSelect += " status isDeleted createdBy";
        categorySelect = (options.role !== roles.VENDOR ? categorySelect + " isDeleted": categorySelect);
        subcategoriesSelect = (options.role !== roles.VENDOR ? subcategoriesSelect + " isDeleted": subcategoriesSelect);
        userSelect = (options.role !== roles.VENDOR && userSelect !== roles.USER ? userSelect + "email userName isDeleted": userSelect);
        reviewSelect += " isDeleted";
    }

    return { collectionSelect, productSelect, vendorSelect, categorySelect, subcategoriesSelect, userSelect, reviewSelect };
}