import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

/**
 * @desc		Get all products
 * @route		GET /api/products
 * @access	public
 */
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

/**
 * @desc		Get single product
 * @route		GET /api/products/:id
 * @access	public
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

/**
 * @desc    Delete a single product
 * @route   DELETE /api/products/:id
 * @access    private/admin
 */

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne(product);
    {
      res.json({ message: "Product is deleted" });
    }
  } else {
    res.status(404);
    throw new Error("Product not Found");
  }
});

/**
 * @desc    Create a PRoduct
 * @Route   POST /api/products
 * @access  private/admin
 */

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample product",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample Brand",
    category: "Sample Category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description...",
  });

  const createProduct = await product.save();
  res.status(201).json(createProduct);
});

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  private/admin
 */

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updateProduct = await product.save();
    res.json(updateProduct);
  } else {
    res.status(404);
    throw new Error(`Product Not Found`);
  }
});

const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  // const order = await Order.find({ user: req.params.id });
  const orders = await Order.find({ user: req.user._id });

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error(`User Already Reviewed the product`);
    }

    const productPurchased = orders.find(
      (order) =>
        order.user.toString() === req.user._id.toString() &&
        order.orderItems.find(
          (o) => o.product.toString() === product._id.toString() && order.isPaid
        )
    );

    if (productPurchased) {
      res.status(201);
    } else {
      res.status(400);
      throw new Error("First buy the product");
    }

    const review = {
      name: req.user.name,
      rating: +rating, //for converting string into number precaution
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, currval) => acc + currval.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error(`Product not found`);
  }
});

export {
  getProductById,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  createReview,
};
