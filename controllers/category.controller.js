const categoryRepo = require('../models/category/category.repo');
const { paginate } = require('../utils/pagination');
const { asyncHandler } = require('../utils/asyncHandler');
const { createResponse } = require('../utils/createResponse');

exports.getCategories = asyncHandler(async (req, res, next) => {
    const { limit, skip } = paginate(req.query.page, req.query.size);

    const result = await categoryRepo.getList(
        { depth: 1 },
        '-__v -depth -parent',
        { 
            path: 'subCategories', select: '-__v -depth', populate: { 
            path: 'subCategories', select: '-__v -depth' } 
        },
        skip,
        limit,
        { createdAt: -1 }
    );

    res.status(result.statusCode).json(
        createResponse(result.success, result.message, result.statusCode, result.error, result.data)
    );
});

exports.createCategory = asyncHandler(async (req, res, next) => {
    // Find the parent category
    const result = await categoryRepo.isExist({ _id: req.body.parent }, 'depth');

    // Check if the parent category exist
    if(!result.success && req.body.parent !== null) {
        return res.status(400).json(
            createResponse(result.success, "Parent Category not found", 400)
        );
    }

    // Add depth and createdBy to the request body
    req.body.depth = result.success ? result.data.depth + 1 : 1;
    req.body.createdBy = req.user._id;

    // Check depth of the category
    if(req.body.depth > 3) {
        return res.status(400).json(
            createResponse(false, 400, "Category reached the limit of multi-level hierarchy", "Category depth can't be more than 3", null)
        );
    }

    // Create the category
    const category = await categoryRepo.create(req.body);

    res.status(category.statusCode).json(
        createResponse(category.success, category.message, category.statusCode, category.error, category.data)
    );
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
    // Check if the parent is the children
    if(req.params.id === req.body.parent) {
        return res.status(400).json(
            createResponse(false, 400, "Category can't be the Subcategory of itself", "Category can't be the children of itself", null)
        );
    }

    // Find the category and parent category
    const [ category, parentCategory ] = await Promise.all([
        categoryRepo.isExist({ _id: req.params.id }, 'depth'),
        categoryRepo.isExist({ _id: req.body.parent }, 'depth')
    ]);

    // Check if the category exist
    if(!category.success) {
        return res.status(category.statusCode).json(
            createResponse(category.success, category.message, category.statusCode, category.error, category.data)
        );
    }

    // Add depth to the request body
    req.body.depth = req.body.parent === null ? 1: parentCategory.success ? parentCategory.data.depth + 1 : category.data.depth;

    // Check depth of the category
    if(req.body.depth > 3) {
        return res.status(400).json(
            createResponse(false, 400, "Category reached the limit of multi-level hierarchy", "Category depth can't be more than 3", null)
        );
    }

    // Update the category
    await categoryRepo.updateCategory(
        { _id: req.params.id }, 
        req.body
    );

    res.status(200).json(
        createResponse(true, "Category has been updated successfully", 200, null, null)
    );
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
    // list of categories to delete
    let categoriesID = [req.params.id];

    // list of parent categories 
    let parentCategoriesID = [req.params.id];

    // get all subcategories of the category
    for (let depth = 1; depth < 3; depth++) {
        const categories = await categoryRepo.getList({ parent: { $in: parentCategoriesID } }, '_id');

        if(categories.data.categories.length === 0) {
            break;
        }

        parentCategoriesID = categories.data.categories.map(category => category._id);
        categoriesID = categoriesID.concat(parentCategoriesID);
    }
    console.log(categoriesID)
    const result = await categoryRepo.deleteCategories({ _id: { $in: categoriesID } });

    res.status(result.statusCode).json(
        createResponse(result.success, result.message, result.statusCode, result.error, result.data)
    );
});