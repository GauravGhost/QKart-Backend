const httpStatus = require("http-status");
const { Cart, Product, User } = require("../models");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");
const { createAdd } = require("typescript");
const { http } = require("winston");


/**
 *
 * @param {User} user
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */

const getCartByUser = async (user) => {
  const cart = await Cart.findOne({ email: user.email });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
  }
  return cart;
};

/**
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */

const addProductToCart = async (user, productId, quantity) => {
  let userCart = await Cart.findOne({ email: user.email });
  if (!userCart) {
    try {
      userCart = await Cart.create({
        email: user.email,
        cartItems: []
      });
      await userCart.save();
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while creating cart")
    }
  }
  if (!userCart.cartItems.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Bad Request")
  }
  const exist = userCart.cartItems.some((item) => item.product._id.equals(productId));
  if (exist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product already in cart. Use the cart sidebar to update or remove product from cart");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product doesn't exist in database");
  }
  userCart.cartItems.push({
    product: product,
    quantity: quantity
  });
  userCart.save();
  return await userCart;

};

/**
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const updateProductInCart = async (user, productId, quantity) => {

  const userCart = await Cart.findOne({ email: user.email });
  if (!userCart) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart. Use POST to create cart and add a product")
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product doesn't exist in database");
  }

  const productExist = userCart.cartItems.find((item) => item.product._id.equals(productId));
  if (!productExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
  }
  productExist.quantity = quantity;
  userCart.save();
  return await userCart
};

/**
 *
 * @param {User} user
 * @param {string} productId
 * @throws {ApiError}
 */
const deleteProductFromCart = async (user, productId) => {
  const userCart = await Cart.findOne({ email: user.email });
  if (!userCart) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart");
  }
  const productExist = userCart.cartItems.findIndex((item) => item.product._id.equals(productId));
  if (productExist === -1) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
  }
  userCart.cartItems.splice(productExist, 1);
  userCart.save();
  return await userCart.populate({ path: 'cartItems.product' }).execPopulate();
};

// TODO: CRIO_TASK_MODULE_TEST - Implement checkout function
/**
 * @param {User} user
 * @returns {Promise}
 * @throws {ApiError} when cart is invalid
 */

const checkout = async (user) => {
  const userCart = await Cart.findOne({ email: user.email });
  if (!userCart) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
  }
  if (userCart.cartItems.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User cart is empty");
  }
  
  if (!(await user.hasSetNonDefaultAddress())) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Address is not set");
  }

  let totalCost = 0;
  userCart.cartItems.forEach((item) => {totalCost += item.product.cost * item.quantity});
 
  if (user.walletMoney < totalCost) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Wallet Balance is Insufficient");
  }

  userCart.cartItems = [];
  user.walletMoney -= totalCost;
  user.save();
  userCart.save();
  return userCart;
}





module.exports = {
  getCartByUser,
  addProductToCart,
  updateProductInCart,
  deleteProductFromCart,
  checkout
};
