
exports.getLogin = (req, res, next) => {       
    const isLoggedIn = req.session.isLoggedIn              
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Your Login',
        isLoggedIn: isLoggedIn
    });   
  };


exports.postLogin = (req, res, next) => {   
    req.session.isLoggedIn = true
    res.redirect('/')
};

exports.postLogout = (req, res, next) => {   
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
};
  