const categoryRepo = require('../models/category/category.repo');
const { paginate } = require('../utils/pagination');
const { asyncHandler } = require('../utils/asyncHandler');
const { createResponse } = require('../utils/createResponse');
const { filterHandler, selectHandler } = require('../helpers/filterAndSelectManager');

exports.getCategories = asyncHandler(async (req, res, next) => {
    const { limit, skip } = paginate(req.query.page, req.query.size);

    const { categoryFilter, subcategoriesFilter } = filterHandler({ role: req.user.role });
    const { categorySelect, subcategoriesSelect } = selectHandler({ role: req.user.role });

    const result = await categoryRepo.getList(
        categoryFilter,
        categorySelect,
        { 
            path: 'subCategories', select: subcategoriesSelect, match: subcategoriesFilter, populate: { 
            path: 'subCategories', select: subcategoriesSelect, match: subcategoriesFilter }
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
    if (req.body.parent !== null) {
        // Find the parent category
        const result = await categoryRepo.isExist({ _id: req.body.parent, isDeleted: false }, 'depth');
        
        // Check if the parent category exist
        if(!result.success) {
            return res.status(404).json(
                createResponse(result.success, "Parent Category not found or deleted", 404)
            );
        }

        req.body.depth = result.data.depth + 1;
    }


    req.body.depth = req.body.depth ? req.body.depth : 1;
    req.body.createdBy = req.user._id;

    // Check depth of the category
    if(req.body.depth > 3) {
        return res.status(422).json(
            createResponse(false, "Category reached the limit of multi-level hierarchy", 422, "Category depth can't be more than 3", null)
        );
    }

    // Create the category
    const category = await categoryRepo.create(req.body);

    res.status(category.statusCode).json(
        createResponse(category.success, category.message, category.statusCode, category.error, category.data)
    );
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
    // Update the category
    const result = await categoryRepo.updateCategory(
        { _id: req.params.id }, 
        req.body
    );

    res.status(result.statusCode).json(
        createResponse(result.success, result.message, result.statusCode, result.error, result.data)
    );
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
    // Check if the Category exist
    const isExist = await categoryRepo.isExist({ _id: req.params.id, isDeleted: false }, '_id depth');

    if(!isExist.success) {
        return res.status(404).json(
            createResponse(isExist.success, "Category not found", 404)
        );
    }
    
    // list of categories to delete
    let categoriesID = [req.params.id];

    // list of parent categories 
    let parentCategoriesID = [req.params.id];

    // get all subcategories of the category
    for (let depth = isExist.data.depth + 1; depth <= 3; depth++) {
        const categories = await categoryRepo.getList({ depth, parent: { $in: parentCategoriesID } }, '_id');

        if(categories.data.categories.length === 0) {
            break;
        }

        parentCategoriesID = categories.data.categories.map(category => category._id);
        categoriesID = categoriesID.concat(parentCategoriesID);
    }

    const result = await categoryRepo.updateCategories(
        { _id: { $in: categoriesID } },
        {  isDeleted: true }
    );

    res.status(204).json(
        createResponse(result.success, "Category and its sub categories has been deleted Successfully", 204)
    );
});

exports.restoreCategory = asyncHandler(async (req, res, next) => {
    // Check if the Category exist
    const isExist = await categoryRepo.isExist({ _id: req.params.id, isDeleted: true }, '_id parent depth');

    if(!isExist.success) {
        return res.status(404).json(
            createResponse(isExist.success, "Category not found", 404)
        );
    }
    
    // Check if the parent is deleted
    const parentCategory = await categoryRepo.isExist(
        { _id: isExist.data.parent, isDeleted: true }, 
        '_id'
    );

    if (parentCategory.success && isExist.data.parent !== null) {
        return res.status(422).json(
            createResponse(false, "Subcategory can't be restored as the category is deleted!", 422, "Parent Category is deleted")
        );
    }

    // list of categories to restore
    let categoriesID = [req.params.id];

    // list of parent categories 
    let parentCategoriesID = [req.params.id];

    // get all subcategories of the category
    for (let depth = isExist.data.depth + 1; depth <= 3; depth++) {
        const categories = await categoryRepo.getList({ depth, parent: { $in: parentCategoriesID } }, '_id');

        if(categories.data.categories.length === 0) {
            break;
        }

        parentCategoriesID = categories.data.categories.map(category => category._id);
        categoriesID = categoriesID.concat(parentCategoriesID);
    }

    const result = await categoryRepo.updateCategories(
        { _id: { $in: categoriesID } },
        {  isDeleted: false }
    );

    res.status(result.statusCode).json(
        createResponse(result.success, "Category has been restored and its subcategories", result.statusCode, result.error, result.data)
    );
});