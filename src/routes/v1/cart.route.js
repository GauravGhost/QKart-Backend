const express = require("express");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const cartValidation = require("../../validations/cart.validation");
const { cartController } = require("../../controllers/");

const router = express.Router();

router.get("/", auth, cartController.getCart);

router.post(
  "/",
  auth,
  validate(cartValidation.addProductToCart),
  cartController.addProductToCart
);

router.put(
  "/",
  auth,
  validate(cartValidation.addProductToCart),
  cartController.updateProductInCart
);


module.exports = router;
