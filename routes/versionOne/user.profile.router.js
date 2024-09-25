const router = require("express").Router();

const { validation } = require('../../middlewares/validation');
const isAuth = require('../../middlewares/authentication');
const userProfileController = require('../../controllers/user.profile.controller');
const {
    GET_USER
} = require('../../endpoints/user.endpoints');

router.route('/')
    .get(isAuth(GET_USER), userProfileController.getProfile);

router.route('/update')
    .put(validation(schema.userSignIn), authUserController.signIn);


module.exports = router;
