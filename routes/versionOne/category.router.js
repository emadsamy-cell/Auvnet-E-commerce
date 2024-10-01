const router = require("express").Router();
const schema = require('../../validation/category.validation');
const { validation } = require('../../middlewares/validation');
const isAuth = require('../../middlewares/auth');
const categoryController = require('../../controllers/category.controller');

// Category Endpoints
const {
    GET_CATEGORY,
    CREATE_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY
} = require('../../endpoints/category.endpoints');

// CRUD Operations
router.route('/').get(validation(schema.getCategories), isAuth(GET_CATEGORY), categoryController.getCategories);
router.route('/create').post(validation(schema.createCategory), isAuth(CREATE_CATEGORY), categoryController.createCategory);
router.route('/update/:id').patch(validation(schema.updateCategory), isAuth(UPDATE_CATEGORY), categoryController.updateCategory);
router.route('/delete/:id').delete(validation(schema.deleteCategory), isAuth(DELETE_CATEGORY), categoryController.deleteCategory);

module.exports = router;
