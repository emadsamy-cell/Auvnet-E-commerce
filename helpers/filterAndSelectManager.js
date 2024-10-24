const ObjectId = require('mongoose').Types.ObjectId;
const roles = require('../enums/roles');
const couponEnum = require('../enums/coupon');

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

    const voucherFilter = {
        ...(options.voucherId? { _id: new ObjectId(options.voucherId) } : {}),
        ...(options.status ? { status: options.status } : {}),
        ...(options.code ? { code: { $regex: options.code, $options: 'i' } } : {}),
        ...(options.date ? { expireAt: { $lte: new Date(options.date) } } : {}),

        ...(options.role === roles.USER ? { isDeleted: false } : {}),
        ...(options.role === roles.USER ? {
            $or: [
                { 'termsAndConditions.audienceLocation.type': 'country', 'termsAndConditions.audienceLocation.location': { $regex: new RegExp(options.userCountry, 'i') } },
                { 'termsAndConditions.audienceLocation.type': 'region', 'termsAndConditions.audienceLocation.location': { $regex: new RegExp(options.userRegion, 'i') } },
                { 'termsAndConditions.audienceLocation.type': 'city', 'termsAndConditions.audienceLocation.location': { $regex: new RegExp(options.userCity, 'i') } },
                { 'termsAndConditions.audienceLocation': { $exists: false } }
            ]
        } : {}),
    }

    const couponFilter = {
        ...(options.couponId? { _id: new ObjectId(options.couponId) } : {}),
        ...(options.status ? { status: options.status } : {}),
        ...(options.code ? { code: { $regex: options.code, $options: 'i' } } : {}),
        ...(options.date ? { expireAt: { $lte: new Date(options.date) } } : {}),

        ...(options.role === roles.VENDOR ? { vendor: options.userId } : {}),
        ...(options.role === roles.USER ? { isDeleted: false } : {}),
        ...(options.role === roles.USER ? {
            $or: [
                { 'termsAndConditions.audienceLocation.type': 'country', 'termsAndConditions.audienceLocation.location': { $regex: new RegExp(options.userCountry, 'i') } },
                { 'termsAndConditions.audienceLocation.type': 'region', 'termsAndConditions.audienceLocation.location': { $regex: new RegExp(options.userRegion, 'i') } },
                { 'termsAndConditions.audienceLocation.type': 'city', 'termsAndConditions.audienceLocation.location': { $regex: new RegExp(options.userCity, 'i') } },
                { couponType: couponEnum.couponType.GLOBAL },
            ]
        } : {}),
    }

    return { collectionFilter, productFilter, vendorFilter, voucherFilter, couponFilter };
}

exports.selectHandler = (options) => {
    let collectionSelect = "_id name description banner vendor";
    let productSelect = "_id name description Images video averageRating productDetails material discountType discountValue category";
    let vendorSelect = "_id name email profileImage coverImage primaryPhone secondaryPhone country city region gender";
    let categorySelect = "_id name";
    let voucherSelect = "code description offerType status expireAt";
    let couponSelect = "couponType code discountType expireAt status"

    if (options.role !== 'user') {
        productSelect += " isDeleted";
        categorySelect += " isDeleted";
        collectionSelect += " visibility isDeleted";
        vendorSelect += " status isDeleted createdBy";
        voucherSelect += " isDeleted";
        couponSelect += " isDeleted vendor admin";
    }

    return { collectionSelect, productSelect, vendorSelect, categorySelect, voucherSelect, couponSelect };
}