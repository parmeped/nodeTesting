const getDb = require('../util/database').getDb
const productsCollection = 'products'
const ObjectId = require('mongodb').ObjectID

class Product {
  constructor(            
      title,
      price,
      description,
      imageUrl,
      id,
      userId
    ) {      
      this.title = title
      this.price = price
      this.description = description
      this.imageUrl = imageUrl
      this._id = id ? new ObjectId(id) : null
      this.userId = userId
  }

  save() {
    const db = getDb()
    let dbOp
    if (this._id) { // if product is updating
      dbOp = db
      .collection(productsCollection)
      .updateOne({ 
        _id: ObjectId(this._id) // looking for doc whose _id matches ours
       },
       {
        $set: this        
       })
    } else {
      dbOp = db
      .collection(productsCollection) 
      .insertOne(this)
    }
    return dbOp      
    .then(result => console.log(result))
    .catch(err => console.log(err))
  }

  
  static fetchAll() {
    const db = getDb()
    return db
    .collection(productsCollection)
    .find()
    .toArray() // this can be used only when there's a limited quantity of objects. 
    .then(products => {      
      return products
    })
    .catch(err => console.log(err))
  }

  static fetchByPk(prodId) {
    const db = getDb()    
    return db
    .collection(productsCollection)
    .findOne({
      _id : new ObjectId(prodId)
    })
    .then(product => {            
      return product
    })
    .catch(err => console.log(err))
  }

  static deleteByPk(prodId) {
    const db = getDb()
    return db
    .collection(productsCollection)
    .deleteOne({
      _id: new ObjectId(prodId)
    })
    .then(result => console.log('Product Deleted'))
    .catch(err => console.log(err))
  }

}


module.exports = Product