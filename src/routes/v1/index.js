const express = require("express");
const userRoute = require("./user.route");

const router = express.Router();

router.use('/users', userRoute);

module.exports = router;
