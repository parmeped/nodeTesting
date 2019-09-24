const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(products => {
    console.log(products)    
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
  Product.fetchById(prodId)
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
  Product.fetchAll()
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
  req.user
  .getCart()
  .then(products => {
    res
      .render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products //sent to view
      })
      .catch(err => console.log(err));
  });
};

exports.postCart = (req, res, next) => {  
  let prodId = req.body.productId
  Product.fetchByPk(prodId)
  .then(product => {
    return req.user.addToCart(product)
  })
  .then(result => {
    console.log(result)
    res.redirect('/products')    
  })
  .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
  let prodId = req.body.productId  
  req.user
  .deleteItemFromCart(prodId)  
  .then(result => {
    res.redirect('/cart')
  })
  .catch(err => console.log(err))  
}

exports.getOrders = (req, res, next) => {
  req.user
  .getOrders() //sequelize plurilizes products. with this you can include prducts on orders. vid 168
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders : orders    
    });
  })
  .catch(err => console.log(err))
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.postOrder = (req, res, next) => {  
  req.user
  .addOrder()
  .then(result => {
    res.redirect('/orders')
  })
 
}

