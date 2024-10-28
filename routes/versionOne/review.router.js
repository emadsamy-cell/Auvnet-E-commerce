const router = require("express").Router();

const reviewController = require('../../controllers/review.controller');
const schema = require('../../validation/review.validation');
const isAuth = require('../../middlewares/auth');
const { validation } = require('../../middlewares/validation'); 
const { GET_REVIEWS, CREATE_REVIEW, CREATE_REPLY, UPDATE_REVIEW, DELETE_REVIEW } = require('../../endpoints/review.endpoints');

// GET
router.route('/:productID').get(isAuth(GET_REVIEWS), validation(schema.get), reviewController.get);
// CREATE
router.route('/:productID').post(isAuth(CREATE_REVIEW), validation(schema.create), reviewController.create);
router.route('/:reviewID/reply').patch(isAuth(CREATE_REPLY), validation(schema.reply), reviewController.reply);
// UPDATE
router.route('/:reviewID').patch(isAuth(UPDATE_REVIEW), validation(schema.update), reviewController.update);
router.route('/:reviewID/up-vote').patch(isAuth(UPDATE_REVIEW), validation(schema.parameterID), reviewController.upVote);
router.route('/:reviewID/down-vote').patch(isAuth(UPDATE_REVIEW), validation(schema.parameterID), reviewController.downVote);
router.route('/:reviewID/delete-vote').patch(isAuth(UPDATE_REVIEW), validation(schema.parameterID), reviewController.deleteVote);
// DELETE
router.route('/:reviewID/delete').patch(isAuth(DELETE_REVIEW), validation(schema.parameterID), reviewController.delete);



module.exports = router;
