const path = require('path')
const rootDir = require('../helpers/path')
const express = require('express')
const router = express.Router()
const productData = require('./add-product')

// executed for every incoming req. 
router.get('/',(req, res, next) => {
    console.log('Home page visited')
    console.log(productData.products)
    res.sendFile(path.join(rootDir ,"views", "shop.html"))
    
    //next()// without calling next, it wouldn't go forward. 
}) 

module.exports = router