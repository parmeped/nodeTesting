const express = require('express')
const router = express.Router()

// executed for every incoming req. 
router.get('/',(req, res, next) => {
    console.log('Home page visited')
    res.sendFile("../views/shop.html")
    
    //next()// without calling next, it wouldn't go forward. 
}) 

module.exports = router