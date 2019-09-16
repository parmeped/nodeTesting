const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, price) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id)
      const existingProduct = cart.products[existingProductIndex]
      let updatedProduct
      if (existingProduct) {
        updatedProduct = {...existingProduct} // copy object into a new one
        updatedProduct.qty ++
        cart.products = [...cart.products]
        cart.products[existingProductIndex] = updatedProduct
      } else {
          updatedProduct = { id: id, qty: 1 }
          cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice += Number(price)
      fs.writeFile(p, JSON.stringify(cart), err => {
          console.log(err)
      })
    });
  }
  
  static deleteProduct(id, productPrice) {    
    fs.readFile(p, (err, fileContent) => {      
      if (err) {
        return
      }      
      let updatedCart = JSON.parse(fileContent)      
      let productIndex = updatedCart.products.findIndex(prod => prod.id === id)      
      let product = updatedCart.products[productIndex]
      if (!product) {
        return
      }
      let productQty = product.qty
      console.log(productQty)
      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id)      
      updatedCart.totalPrice = updatedCart.totalPrice - (productPrice * productQty)
      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err)
    })
    }
  )}

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {      
      let cart = JSON.parse(fileContent)
      if (!err) {
        cb(cart) //no need to write "return" on oneLiners
      }
      else {
        cb(null)
      }
    })    
  }
};

