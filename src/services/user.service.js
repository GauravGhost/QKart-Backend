const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");
const { generateAuthTokens } = require('./token.service')


/**
 * Get User by id
 * @param {String} id
 * @returns {Promise<User>}
 */
async function getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User not found")
    }

    return user;
}


async function getUserAddressById(id, q) {
    const user = await User.findOne({ _id: id }, { address: 1, email: 1 });
    if (q) {
        return { address: user.address }
    }

    return { _id: id, address: user.address, email: user.email };
}


async function setAddress(userId, address) {
    if (!address) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Address field is required!");
    }
    if (address.length < 20) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Address shouldn't be less than 20 characters");
    }
    const user = await User.findById(userId);
    user.address = address;

    return user;
}


/**
 * Get user by email

 * @param {string} email
 * @returns {Promise<User>}
 */

async function getUserByEmail(email) {
    const user = await User.findOne({ email });
    return user;
}



/**
 * Create a user
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
    createUser,
    getUserAddressById,
    setAddress
}


