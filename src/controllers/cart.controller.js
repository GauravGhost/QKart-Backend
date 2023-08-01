const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { cartService } = require("../services");

/**
 * Example response:
 * HTTP 200 OK
 * {
 *  "_id": "5f82eebd2b11f6979231653f",
 *  "email": "crio-user@gmail.com",
 *  "cartItems": [
 *      {
 *          "_id": "5f8feede75b0cc037b1bce9d",
 *          "product": {
 *              "_id": "5f71c1ca04c69a5874e9fd45",
 *              "name": "ball",
 *              "category": "Sports",
 *              "rating": 5,
 *              "cost": 20,
 *              "image": "google.com",
 *              "__v": 0
 *          },
 *          "quantity": 2
 *      }
 *  ],
 *  "paymentOption": "PAYMENT_OPTION_DEFAULT",
 *  "__v": 33
 * }
 * 
 *
 */
const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCartByUser(req.user);
  res.send(cart);
});


/**
 * Add a product to cart
 *
 */
const addProductToCart = catchAsync(async (req, res) => {
  const cart = await cartService.addProductToCart(
    req.user,
    req.body.productId,
    req.body.quantity
  );

  res.status(httpStatus.CREATED).send(cart);
});

/**
 * 
 * Example responses:
 * HTTP 200 - on successful update
 * HTTP 204 - on successful product deletion
 * 
 *
 */
const updateProductInCart = catchAsync(async (req, res) => {
  if(req.body.quantity > 0){
    const cart = await cartService.updateProductInCart(
      req.user, 
      req.body.productId, 
      req.body.quantity
      );
      return res.status(httpStatus.OK).send(cart);
  }
  if(req.body.quantity === 0){
    const cart = await cartService.deleteProductFromCart(
      req.user,
      req.body.productId
      );
      return res.status(httpStatus.NO_CONTENT).send(cart);
  }
});

const checkoutProductInCart = catchAsync(async (req, res) => {
  const user = await cartService.checkout(req.user);
  return res.status(httpStatus.NO_CONTENT).send();
})


module.exports = {
  getCart,
  addProductToCart,
  updateProductInCart,
  checkoutProductInCart
};
