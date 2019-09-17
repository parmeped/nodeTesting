const Product = require('../models/product');
const Cart = require('../models/cart')
exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });      
  })
  .catch(err => console.log(err))    
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;  
  //Product.findAll({where: {id: prodId}}).then().catch() // this returns an array, and it's an alternative to the below
  Product.findByPk(prodId)
  .then(product => {    
    res.render('shop/product-detail', {
      product: product,
      pageTitle: 'Product-detail',
      path: '/products/' + prodId
    });  
  })
  .catch(err => console.log(err))    
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });  
  })
  .catch(err => console.log(err))  
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      let cartProducts = []
      for (product of products) {
        let cartProductData = cart.products.find(prod => prod.id === product.id)
        if (cartProductData) {
          cartProducts.push({productData: product, qty: cartProductData.qty})
        }
      }
      res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: cartProducts //sent to view
    })
    });
  })
};

exports.postCart = (req, res, next) => {  
  let prodId = req.body.productId
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price)
  })
  res.redirect('/cart')
}

exports.postCartDeleteProduct = (req, res, next) => {
  let prodId = req.body.productId  
  Product.findById(prodId, product => {    
    Cart.deleteProduct(prodId, product.price)
    res.redirect('/cart')
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

