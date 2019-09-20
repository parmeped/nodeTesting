const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',    
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, price, description, imageUrl)
  product
  .save()
  .then(result => {
    console.log('Product Created')
    res.redirect('/admin/products')
    })
  .catch(err => console.log(err))
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()  
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'      
    });
  })
  .catch(err => console.log(err))  
};
/*
exports.getEditProduct = (req, res, next) => {
  let editMode = req.query.edit  
  if (!editMode) {
    return res.redirect('/')
  }
  let prodId = req.params.productId  
  req.user.getProducts({ // this returns an array!
    where: {id: prodId}
  })
  Product.findByPk(prodId)  
  .then(products => {
      let product = products[0]
        if (!product){
        return res.redirect('/')
      }
        res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',    
        product: product,
        editing: true
      });  
    })
    .catch(err => console.log(err))
};

exports.postEditProduct = (req, res, next) => {
  let prodId = req.body.productId;
  let updatedTitle = req.body.title;
  let updatedPrice = req.body.price;
  let updatedImageUrl = req.body.imageUrl;
  let updatedDesc = req.body.description;
  Product.findByPk(prodId)
  .then(product => {
    product.title = updatedTitle
    product.price = updatedPrice
    product.imageUrl = updatedImageUrl
    product.description = updatedDesc
    return product.save() //method provided by sequelize. it saves automatically or create a new one.
  })
  .then(result => {
    console.log('Updated Product')
    res.redirect('/admin/products')
  })
  .catch(err => console.log(err))
};

//there should be no reason not to find the object, since it would always get here through an object id
exports.deleteProduct = (req, res, next) => {
  let prodId = req.body.productId
  Product.findByPk(prodId)
  .then(product => {
    return product.destroy()
  })
  .then(result => {
    console.log('Destroyed Product') //this double .then, gets executed AFTER the first one finishes. Async!
    res.redirect('/admin/products')
  })
  .catch(err => {
    console.log(err)
  })   
} */