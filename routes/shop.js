const path = require('path')
const express = require('express');

const productsController = require('../controllers/products')
const indexController = require('../controllers/index')

const router = express.Router();

router.get('/index', indexController.getIndex)

router.get('/products-list', productsController.getProducts);

router.get('/cart', productsController.getCart);


module.exports = router;
