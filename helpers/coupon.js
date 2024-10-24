const roles = require("../enums/roles");
const productRepo = require("../models/product/product.repo");
const categoryRepo = require("../models/category/category.repo");

exports.checkProductsOwnership = async (req) => {
    const filter = req.user.role === roles.VENDOR ? { _id: { $in: req.body.products }, vendor: req.user._id, isDeleted: false } : { _id: { $in: req.body.products }, isDeleted: false };
    const products = await productRepo.getList(filter, "_id");
    return products.data.products.length === req.body.products.length;
}

exports.checkCategoriesExistence = async (req) => {
    const categories = await categoryRepo.getList({ _id: { $in: req.body.categories }, isDeleted: false }, "_id");
    return categories.data.categories.length === req.body.categories.length;
}