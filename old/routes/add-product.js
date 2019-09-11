// on the video, this is admin.js
const path = require('path')
const express = require('express')
const rootDir = require('../helpers/path.js')

const router = express.Router()
const products = []


router.get('/add-product',(req, res, next) => {
    console.log('adding product page visited')
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'))    
    //res.send('<h1>This is the Product Adding page</h1>')
    //next()// without calling next, it wouldn't go forward. 
}) 


router.post('/add-product', (req, res, next) => {
    console.log(req.body.title)
    products.push({title: req.body.title})
    res.redirect('/')
})

exports.routes = router
exports.products = products