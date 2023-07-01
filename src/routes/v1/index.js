const express = require("express");
const userRoute = require("./user.route");
const authRoute = require('./auth.route');
const productRoute = require('./product.route');
const router = express.Router();

router.use('/users', userRoute);
router.use('/auth', authRoute);
router.use('/products', productRoute);
module.exports = router;
