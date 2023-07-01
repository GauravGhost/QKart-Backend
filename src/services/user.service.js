const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");
const {generateAuthTokens} = require('./token.service')

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserById(id)
/**
 * Get User by id
 * - Fetch user object from Mongo using the "_id" field and return user object
 * @param {String} id
 * @returns {Promise<User>}
 */
async function getUserById(id) {
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new ApiError(httpStatus.BAD_REQUEST, "User not found")
        }
        return user;
    } catch (error) {
        throw error;
    }
}



// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserByEmail(email)
/**
 * Get user by email
 * - Fetch user object from Mongo using the "email" field and return user object
 * @param {string} email
 * @returns {Promise<User>}
 */
async function getUserByEmail(email) {
    try {
        const user = await User.findOne({email});
        return user;
    } catch (error) {
        throw error;
    }
}



// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement createUser(user)
/**
 * Create a user
 *  - check if the user with the email already exists using `User.isEmailTaken()` method
 *  - If so throw an error using the `ApiError` class. Pass two arguments to the constructor,
 *    1. “200 OK status code using `http-status` library
 *    2. An error message, “Email already taken”
 *  - Otherwise, create and return a new User object
 *
 * @param {Object} userBody
 * @returns {Promise<User>}
 * @throws {ApiError}
 *
 * userBody example:
 * {
 *  "name": "crio-users",
 *  "email": "crio-user@gmail.com",
 *  "password": "usersPasswordHashed"
 * }
 *
 * 200 status code on duplicate email - https://stackoverflow.com/a/53144807
 */

async function createUser(user) {
        const isExist = await User.isEmailTaken(user.email);
        if (isExist) {
            throw new ApiError(httpStatus.OK, "Email already taken");
        }
        const newUser = await User.create(user);     
        return newUser;  
}

module.exports = {
    getUserByEmail,
    getUserById,
    createUser
}


