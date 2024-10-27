const router = require("express").Router();

const schema = require('../../validation/collection.validation');
const collectionController = require('../../controllers/collection.controller');
const isAuth = require('../../middlewares/auth');
const { uploadSingleFile } = require('../../middlewares/upload')
const { validation } = require('../../middlewares/validation'); 
const { GET_COLLECTION, CREATE_COLLECTION, UPDATE_COLLECTION, DELETE_COLLECTION } = require('../../endpoints/collection.endpoints')

// GET
router.route('/all').get(isAuth(GET_COLLECTION), validation(schema.getAll), collectionController.getAll);
router.route('/:collectionID/products').get(isAuth(GET_COLLECTION), validation(schema.getProducts), collectionController.getProducts);
// CREATE
router.route('/create').post(uploadSingleFile('image', 'banner'), validation(schema.createCollection), isAuth(CREATE_COLLECTION), collectionController.createCollection);
// UPDATE
router.route('/update/:collectionID').patch(uploadSingleFile('image', 'banner'), isAuth(UPDATE_COLLECTION), validation(schema.updateCollection), collectionController.updateCollection);
router.route('/add-products/:collectionID').patch(isAuth(UPDATE_COLLECTION), validation(schema.addProducts), collectionController.addProducts);
router.route('/remove-products/:collectionID').patch(isAuth(UPDATE_COLLECTION), validation(schema.removeProducts), collectionController.removeProducts);
// DELETE
router.route('/delete/:collectionID').patch(isAuth(DELETE_COLLECTION), validation(schema.deleteCollection), collectionController.deleteCollection);
router.route('/restore/:collectionID').patch(isAuth(DELETE_COLLECTION), validation(schema.restoreCollection), collectionController.restoreCollection);



module.exports = router;
