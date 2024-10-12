const ObjectId = require('mongoose').Types.ObjectId;

exports.filterHandler = (options) => {
    const collectionFilter = {
        ...(options.collectionID ? { _id: new ObjectId(options.collectionID) } : {}),
        ...(options.vendorID ? { vendor: new ObjectId(options.vendorID) } : {}),
        ...(options.role === 'user' ? { isDeleted: false} : {}),
        ...(options.role === 'user' ? { visibility: 'public'} : {}),
    }

    let productFilter = {
        ...(options.vendorID ? { vendor: new ObjectId(options.vendorID) } : {}),
        ...(options.name ? { 'name': { $regex: options.name , $options: 'i' } } : {}),
        ...(options.category ? { 'category': options.category } : {}),
        ...(options.role === 'user' ? { 'isDeleted': false} : {}),
    };

    if (options.availability || options.minPrice || options.maxPrice) {
        productFilter.productDetails = {
            $elemMatch: {
                ...(options.availability ? { quantity: { $gt: 0 } } : {}),
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
        ...(options.role === 'vendor' || options.role === 'user' ? { status: 'active', isDeleted: false } : {}),
    };

    return { collectionFilter, productFilter, vendorFilter };
}


exports.selectHandler = (options) => {
    let collectionSelect = "_id name description banner vendor";
    let productSelect = "_id name description Images video averageRating productDetails material discountType discountValue category";
    let vendorSelect = "_id name email profileImage coverImage primaryPhone secondaryPhone country city region gender";
    let categorySelect = "_id name";

    if (options.role !== 'user') {
        productSelect += " isDeleted";
        categorySelect += " isDeleted";
        collectionSelect += " visibility isDeleted";
        vendorSelect += " status isDeleted createdBy";
    }

    return { collectionSelect, productSelect, vendorSelect, categorySelect };
}