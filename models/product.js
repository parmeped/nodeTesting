const getDb = require('../util/database').getDb
const productCollection = 'products'
let ObjectId = require('mongodb').ObjectID

class Product {
  constructor(            
      title,
      price,
      description,
      imageUrl
    ) {      
      this.title = title
      this.price = price
      this.description = description
      this.imageUrl = imageUrl
  }

  save() {
    const db = getDb()
    return db.collection(productCollection) 
    .insertOne(this)
    .then(result => console.log(result))
    .catch(err => console.log(err))
  }
  
  static fetchAll() {
    const db = getDb()
    return db.collection('products')
    .find()
    .toArray() // this can be used only when there's a limited quantity of objects. 
    .then(products => {      
      return products
    })
    .catch(err => console.log(err))
  }

  static fetchById(prodId) {
    const db = getDb()    
    return db.collection('products')
    .findOne({
      _id : new ObjectId(prodId)
    })
    .then(product => {      
      console.log(product)      
      return product
    })
    .catch(err => console.log(err))
  }

}


module.exports = Product