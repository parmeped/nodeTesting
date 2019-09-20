const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const url = 'mongodb://127.0.0.1:27017'
const remoteUrl = 'mongodb+srv://parmegped:ztL9HiwGA8Bz7uUY@cluster0-ryeky.mongodb.net/test?retryWrites=true&w=majority'

let _db

const mongoConnection = (callback) => {
    MongoClient.connect(url, { useNewUrlParser: true })
        .then(client => {
        console.log('Connected to MongoDb')
        _db = client.db('shop') // this opens a single connection to the db. the parameter could be the db
        callback(client)
        })
        .catch(err => {
            console.log(err)
            throw err
        })
}

const getDb = () => {
    if (_db) {
        return _db
    }
    throw 'No database found!'
}

exports.mongoConnection = mongoConnection
exports.getDb = getDb