const path = require('path')
const Product = require('../models/product')


exports.getAddProduct = (req, res, next) => {
    res.render('./admin/add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true
    })
}

exports.postAddProduct = (req, res, next) => {
    let product = new Product(req.body.title)
    product.save()
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {  
  let products = Product.fetchAll((products) => {
    res.render('./shop/products-list', {
      prods: products,
      pageTitle: 'Shop',
      path: '/products-list',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    })
  })
}

exports.getCart = (req, res, next) => {
  res.render('./shop/cart', {
    pageTitle: 'My Cart',
    path: '/cart',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  })
}


exports.getAdminProducts = (req, res, next) => {
  res.render('./admin/adminProduct-list', {
    pageTitle: 'Admin Products',
    path: '/admin/adminProduct-list',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  })
}

