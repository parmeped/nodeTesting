// on the video, this is admin.js
const express = require('express')

const router = express.Router()




router.get('/add-product',(req, res, next) => {
    console.log('adding product page visited')
    res.send(
        '<form action="/product/add-product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>'
        )
    //res.send('<h1>This is the Product Adding page</h1>')
    //next()// without calling next, it wouldn't go forward. 
}) 


router.post('/add-product', (req, res, next) => {
    console.log(req.body.title)
    res.redirect('/')
})


module.exports = router