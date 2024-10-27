const collectionRepo = require('../models/collection/collection.repo');
const productRepo = require('../models/product/product.repo');
const { filterHandler, selectHandler } = require('../helpers/filterAndSelectManager');
const { paginate } = require('../utils/pagination');
const { asyncHandler } = require('../utils/asyncHandler');
const { createResponse } = require('../utils/createResponse');
const roles = require('../enums/roles')

exports.getAll = asyncHandler(async (req, res) => {
    const { limit, skip } = paginate(req.query.page * 1, req.query.size * 1);
    const { _id, role } = req.user;  
    const vendorID = (role === roles.VENDOR ? _id : req.query.vendor);
    const { collectionFilter } = filterHandler({ role, vendorID });
    const { collectionSelect, vendorSelect } = selectHandler({ role });

    const result = await collectionRepo.getList(
        collectionFilter,
        collectionSelect,
        {
            path: 'vendor', select: vendorSelect
        },
        skip,
        limit,
        { 'vendor._id': 1 }
    );

    return res.status(result.statusCode).json(
        createResponse(result.success, result.message, result.statusCode, result.error, result.data)
    )
});

exports.getProducts = asyncHandler(async (req, res) => {
    const { minPrice, maxPrice, category, name, availability, visibility } = req.query;
    const { _id, role } = req.user;  
    const { collectionID } = req.params;
    const options = { collectionID, role, minPrice, maxPrice, category, name, availability, visibility }

    const { collectionFilter,  productFilter  } = filterHandler(options);
    const { collectionSelect, productSelect, categorySelect } = selectHandler(options);

    const result = await collectionRepo.isExist(
        collectionFilter,
        collectionSelect,
        {
            path: 'products', select: productSelect, match: productFilter, populate: 
            { path: 'category', select: categorySelect }
        },
    ); 

    // Check if the vendor is the owner of the collection
    if (role === roles.VENDOR && result.success && result.data.vendor.toString() !== _id.toString()) {
        return res.status(403).json(
            createResponse(false, 'You are not authorized to view this collection', 403)
        )
    }

    return res.status(result.statusCode).json(
        createResponse(result.success, result.message, result.statusCode, result.error, result.data)
    )
});

exports.createCollection = asyncHandler(async (req, res) => {
    // Add vendor id to the request body
    req.body.vendor = req.user._id

    // Check if there is banner
    if (req.file) {
        req.body.banner = req.location
    }

    const collection = await collectionRepo.create(req.body);
    return res.status(collection.statusCode).json(
        createResponse(collection.success, collection.message, collection.statusCode, collection.data)
    )
});

exports.updateCollection = asyncHandler(async (req, res) => {
    const { collectionID } = req.params;

    const collection = await collectionRepo.isExist({ _id: collectionID }, "vendor isDeleted");

    // Check if collection exist
    if (!collection.success) {
        return res.status(collection.statusCode).json(
            createResponse(collection.success, collection.message, collection.statusCode, collection.error)
        )
    }

    // Check if vendor owner of this collection
    if (collection.data.vendor.toString() !== req.user._id.toString()) {
        return res.status(403).json(
            createResponse(false, 'You are not authorized to update this collection', 403)
        )
    }

    // Check if the collection is deleted
    if (collection.data.isDeleted) {
        return res.status(404).json(
            createResponse(false, 'This collection is deleted!', 404)
        )
    }

    // Check if there is banner
    if (req.file) {
        req.body.banner = req.location
    }

    const result = await collectionRepo.updateCollection(
        { _id: collectionID }, 
        req.body
    );
    
    return res.status(result.statusCode).json(
        createResponse(result.success, result.message, result.statusCode, result.error, result.data)
    )
});

exports.addProducts = asyncHandler(async (req, res) => {
    const products = await productRepo.getList(
        { _id: { $in: req.body.products }, vendor: req.user._id, isDeleted: false }, 
        "_id");

        // Check if there are product that does not belong to the vendor
    if (!products.success || products.data.products.length !== req.body.products.length) {
        return res.status(404).json(
            createResponse(false, "Products not found or delete.", 404)
        )
    }

    const { collectionID } = req.params;

    const collection = await collectionRepo.isExist({ _id: collectionID }, "vendor isDeleted");

    // Check if collection exist
    if (!collection.success) {
        return res.status(collection.statusCode).json(
            createResponse(collection.success, collection.message, collection.statusCode, collection.error)
        )
    }

    // Check if vendor owner of this collection
    if (collection.data.vendor.toString() !== req.user._id) {
        return res.status(403).json(
            createResponse(false, 'You are not authorized to update this collection', 403)
        )
    }

    // Check if the collection is deleted
    if (collection.data.isDeleted) {
        return res.status(404).json(
            createResponse(false, 'This collection is deleted!', 404)
        )
    }

    const result = await collectionRepo.updateCollection(
        { _id: collectionID }, 
        { $addToSet: { products: { $each: req.body.products } } }
    );

    if (!result.success) {
        return res.status(result.statusCode).json(
            createResponse(result.success, result.message, result.statusCode, result.error)
        )
    }

    return res.status(result.statusCode).json(
        createResponse(result.success, "Products Added Successfully", result.statusCode, result.error, result.data)
    )
});

exports.removeProducts = asyncHandler(async (req, res) => {
    const { collectionID } = req.params;

    const collection = await collectionRepo.isExist({ _id: collectionID }, "vendor isDeleted");

    // Check if collection exist
    if (!collection.success) {
        return res.status(collection.statusCode).json(
            createResponse(collection.success, collection.message, collection.statusCode, collection.error)
        )
    }

    // Check if vendor owner of this collection
    if (collection.data.vendor.toString() !== req.user._id) {
        return res.status(403).json(
            createResponse(false, 'You are not authorized to update this collection', 403)
        )
    }

    // Check if the collection is deleted
    if (collection.data.isDeleted) {
        return res.status(404).json(
            createResponse(false, 'This collection is deleted!', 404)
        )
    }


    const result = await collectionRepo.updateCollection(
        { _id: collectionID }, 
        { $pull: { products: { $in: req.body.products } } }
    );

    if (!result.success) {
        return res.status(result.statusCode).json(
            createResponse(result.success, result.message, result.statusCode, result.error)
        )
    }

    return res.status(result.statusCode).json(
        createResponse(result.success, "Products removed successfully", result.statusCode, result.error, result.data)
    )
});

exports.deleteCollection = asyncHandler(async (req, res) => {
    const { collectionID } = req.params;

    const collection = await collectionRepo.isExist({ _id: collectionID }, "vendor isDeleted");

    // Check if collection exist
    if (!collection.success) {
        return res.status(collection.statusCode).json(
            createResponse(collection.success, collection.message, collection.statusCode, collection.error)
        )
    }

    // Check if vendor owner of this collection
    if (req.user.role === roles.VENDOR && collection.data.vendor.toString() !== req.user._id) {
        return res.status(403).json(
            createResponse(false, 'You are not authorized to delete this collection', 403)
        )
    }

    // Check if the collection is deleted
    if (collection.data.isDeleted) {
        return res.status(404).json(
            createResponse(false, 'This collection is already deleted!', 404)
        )
    }

    const result = await collectionRepo.updateCollection(
        { _id: collectionID }, 
        { isDeleted: true }
    );

    if (!result.success) {
        return res.status(result.statusCode).json(
            createResponse(result.success, result.message, result.statusCode, result.error)
        )
    }
    
    return res.status(result.statusCode).json(
        createResponse(result.success, "Collection has been deleted successfully", result.statusCode, result.error, result.data)
    )
});

exports.restoreCollection = asyncHandler(async (req, res) => {
    const { collectionID } = req.params;

    const collection = await collectionRepo.isExist({ _id: collectionID }, "vendor isDeleted");

    // Check if collection exist
    if (!collection.success) {
        return res.status(collection.statusCode).json(
            createResponse(collection.success, collection.message, collection.statusCode, collection.error)
        )
    }

    // Check if vendor owner of this collection
    if (req.user.role === roles.VENDOR && collection.data.vendor.toString() !== req.user._id) {
        return res.status(403).json(
            createResponse(false, 'You are not authorized to restore this collection', 403)
        )
    }

    // Check if the collection is deleted
    if (!collection.data.isDeleted) {
        return res.status(404).json(
            createResponse(false, 'This collection is not deleted!', 404)
        )
    }

    const result = await collectionRepo.updateCollection(
        { _id: collectionID }, 
        { isDeleted: false }
    );

    if (!result.success) {
        return res.status(result.statusCode).json(
            createResponse(result.success, result.message, result.statusCode, result.error)
        )
    }
    
    return res.status(result.statusCode).json(
        createResponse(result.success, "Collection has been restored successfully", result.statusCode, result.error, result.data)
    )
});