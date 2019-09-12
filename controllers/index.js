const path = require('path')


exports.getIndex = (req, res, next) => {
    res.render('./shop/index', {
      pageTitle: 'Home',
      path: '/index',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true
    })
}
