//const http = require('http') no need in express
const path = require('path')
const express = require('express')
const rootDir = require('./helpers/path.js')

const productAdd = require('./routes/add-product')
const shop = require('./routes/shop')

//const routes = require('./routes')

const body_parser = require('body-parser')

const app = express()


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(body_parser.urlencoded()) //this calls automatically next() at the end. 
app.use(express.static(path.join(rootDir, 'public')))
// first parameter is for routes starting with product
app.use('/product', productAdd.routes)
app.use(shop)
/*
app.use works for all http methods. but you can't make it listen only to 
get or post req's. Using app.get and app.post enables filtering
When using app.use, its not for an exact match. Get and post, are. 
*/

// 404 not found!
app.use((req, res, next) => {
    res.status(404).render('404NotFound', { pageTitle: 'Page Not Found'})
})


//const server = http.createServer(app) this is done automatically in express
//console.log(routes.description)

app.listen(3000)