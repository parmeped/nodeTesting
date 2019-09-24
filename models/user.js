const getDb = require('../util/database').getDb
const usersCollection = 'users'
const ObjectId = require('mongodb').ObjectId


class User {
  constructor(
    username,
    email,
    cart,
    id
    ) {
      this.username = username
      this.email = email
      this.cart = cart
      this._id = id ? new ObjectId(id) : null
  }

  save() {
    const db = getDb
    let dbOp
    if (this._id) { // if user is updating
      dbOp = db
      .collection(usersCollection)
      .updateOne({ 
        _id: ObjectId(this._id) // looking for doc whose _id matches ours
       },
       {
        $set: this        
       })
    } else {
      dbOp = db
      .collection(usersCollection) 
      .insertOne(this)
    }
    return dbOp      
    .then(result => console.log(result))
    .catch(err => console.log(err))
  }

  addToCart(product) {
    let cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString()
    })
    let newQuantity = 1
    let updatedCartItems = [...this.cart.items]
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1
      updatedCartItems[cartProductIndex].quantity = newQuantity
    }  else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity
      })  
    }
    let updatedCart = {
      items: updatedCartItems // [...product] with spread, I can copy the produuct object and later on add another attribute. In this case, a quantity 
    }
    console.log(product)
    let db = getDb()
    return db
    .collection(usersCollection)
    .updateOne(
      {
        _id: new ObjectId(this._id)
      },
      { $set: { cart: updatedCart } }
    );
  }

  getCart() { // this is how he's manually matching two fields. 
    const db = getDb()
    const productIds = this.cart.items.map(i => { // this extracts all ids from cart.items, map executes a function for each one. 
      return i.productId
    })
    return db
    .collection('products')
    .find({_id: {
      $in: productIds // this is a mongo query. it will return all elements whose ids are on the productsId array
    }}) 
    .toArray()
    .then(products => {
      return products.map(p => {
        return {...p, quantity: this.cart.items.find(i => {  // the ...p is to copy and keep all properties of the retrieved item
          return i.productId.toString() === p._id.toString()
          }).quantity
        }
      })
    })
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString() //returns all items which do NOT match productId
    })
    let db = getDb()
    return db
    .collection(usersCollection)
    .updateOne(
      {
        _id: new ObjectId(this._id)
      },
      { $set: { cart: {items: updatedCartItems} } } //cart.items: updatedCartItems
    );
  }

  addOrder() {
    const db = getDb()
    return this
    .getCart()
    .then(products => {
      let order = {
        items: products,
        user: {
          _id: new ObjectId(this._id),
          username: this.username        
        }
      }
      return db
      .collection('orders')
      .insertOne(order)
    })
    .then(result => {
      this.cart = {items: []}
      return db
      .collection(usersCollection)
      .updateOne(
        {
          _id: new ObjectId(this._id)
        },
        { $set: { cart: {items: [] } } }
      );
    })
    .catch(err => console.log(err))
  }

  getOrders() {
    const db = getDb()
    return db
    .collection('orders')
    .find({ 'user._id': new ObjectId(this._id) }) // with ' ' you can specify the route to the property. 
    .toArray()
  }


  static findByPk(userId) {
    const db = getDb()    
    return db
    .collection(usersCollection)
    .findOne({
      _id : new ObjectId(userId)
    })
    .then(user => {            
      return user
    })
    .catch(err => console.log(err))    
  }
}
module.exports = User
