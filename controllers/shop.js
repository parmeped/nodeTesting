const Product = require('../models/product');

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
  req.user
  .getCart()
  .then(cart => {
    return cart.getProducts() //thanks to the association, this is automatic
    .then(products => {
        res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products //sent to view
      })
    })
  })
  .catch(err => console.log(err))
};

exports.postCart = (req, res, next) => {  
  let prodId = req.body.productId
  let fetchedCart
  let newQuantity = 1
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts({where: { id: prodId }})
    })
    .then(products => {
      let product
      if (products.length > 0) {        
        product = products[0] // returns an array every time that it ends with s
      }            
      if (product) {
        let oldQuantity = product.cartItem.dataValues.quantity
        newQuantity = oldQuantity + 1
        return product
      }
      return Product.findByPk(prodId)      
      })
      .then(product => {
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity }
      })
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
  let prodId = req.body.productId  
  req.user.getCart()
  .then(cart => {
    return cart.getProducts({where: {id: prodId}})
  })
  .then(products => {
    let product = products[0]
    return product.cartItem.destroy()
  })
  .then(result => {
    res.redirect('/cart')
  })
  .catch(err => console.log(err))  
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({ include: ['products'] }) //sequelize plurilizes products. with this you can include prducts on orders. vid 168
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
  let fetchedCart
  req.user.getCart()
  .then(cart => {
    fetchedCart = cart
    return cart.getProducts()
  })
  .then(products => {
    return req.user
    .createOrder()
    .then(order => {
      return order.addProducts(products.map(product => { // this was seen on video 167. 
        product.orderItem = { quantity: product.cartItem.quantity } // this goes through each product and executes this callback function on each
        return product
      }))
    })
    .catch(err => console.log(err))
  })
  .then(result => {
    return fetchedCart.setProducts(null)
  })
  .then(result => {
    res.redirect('/orders')
  })
  .catch(err => console.log(err))
}

