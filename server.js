//const http = require('http') no need in express

const express = require('express')

const productAdd = require('./routes/add-product')
const shop = require('./routes/shop')

const routes = require('./routes')

const body_parser = require('body-parser')

const app = express()

app.use(body_parser.urlencoded()) //this calls automatically next() at the end. 
// first parameter is for routes starting with product
app.use('/product', productAdd)
app.use(shop)
/*
app.use works for all http methods. but you can't make it listen only to 
get or post req's. Using app.get and app.post enables filtering
When using app.use, its not for an exact match. Get and post, are. 
*/

// 404 not found!
app.use((req, res, next) => {
    res.status(404).send('<h1>Page not found!</h1>')
})


//const server = http.createServer(app) this is done automatically in express
console.log(routes.description)

app.listen(3000)