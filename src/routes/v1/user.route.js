const express = require("express");

const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");
const auth = require('../../middlewares/auth');
const router = express.Router();

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement a route definition for `/v1/users/:userId`

router.get('/:userId', auth, 
validate(userValidation.getUser), userController.getUser);


module.exports = router;
