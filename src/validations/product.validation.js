const Joi = require("joi");
const { objectId } = require("./custom.validation");

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getProduct,
};
