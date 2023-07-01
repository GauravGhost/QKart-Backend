const { Product } = require("../models");

/**
 * Get Product by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getProductById = async (id) => {
  console.log(id);
  const product = await Product.findById(id);
  return product;
};

/**
 * Fetch all products
 * @returns {Promise<List<Products>>}
 */
const getProducts = async () => {
  const products = await Product.find({});
  return products;
};

module.exports = {
  getProductById,
  getProducts,
};
