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
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'      
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  let editMode = req.query.edit  
  if (!editMode) {
    return res.redirect('/')
  }
  let prodId = req.params.productId  
  Product.findById(prodId, product => {
    if (!product){
      res.redirect('/')
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',    
      product: product,
      editing: true
    });
  })
};

exports.postEditProduct = (req, res, next) => {
  let prodId = req.body.productId;
  let updatedTitle = req.body.title;
  let updatedPrice = req.body.price;
  let updatedImageUrl = req.body.imageUrl;
  let updatedDesc = req.body.description;
  let updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  );
  updatedProduct.save();
  res.redirect('/admin/products')
};

//there should be no reason not to find the object, since it would always get here through an object id
exports.deleteProduct = (req, res, next) => {
  let prodId = req.body.productId
  Product.deleteById(prodId)
  res.redirect('/admin/products')
}