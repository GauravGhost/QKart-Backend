const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");

/**
 * 
 * Response - 
 * {
 *     "walletMoney": 500,
 *     "address": "ADDRESS_NOT_SET",
 *     "_id": "6010008e6c3477697e8eaba3",
 *     "name": "crio-users",
 *     "email": "crio-user@gmail.com",
 *     "password": "criouser123",
 *     "createdAt": "2021-01-26T11:44:14.544Z",
 *     "updatedAt": "2021-01-26T11:44:14.544Z",
 *     "__v": 0
 * }
 * 
 *
 * Example response status codes:
 * HTTP 200 - If request successfully completes
 * HTTP 404 - If user entity not found in DB
 * 
 * @returns {User | {address: String}}
 *
 */
const getUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { q } = req.query;
  let user = await userService.getUserById(userId);

  if (userId != req.user._id) {
    throw new ApiError(403, "You are not authorized");
  }

  if (q) {
    user = await userService.getUserAddressById(userId, q);
    return res.status(httpStatus.OK).send(user);
  }
  return res.status(200).send(user);
});



/**
 * @returns {address: String}
 */


const setAddress = catchAsync(async (req, res) => {
  const {userId} = req.params;
  const user = await userService.setAddress(userId, req.body.address);
  return res.status(httpStatus.OK).send(user);
})



module.exports = {
  getUser,
  setAddress
};
