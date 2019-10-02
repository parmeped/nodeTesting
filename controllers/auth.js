const User = require('../models/user');
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  let email = req.body.email
  let password = req.body.password
  User.findOne({
    email: email
  })
    .then(user => {
      if (!user) {
        return res.redirect('/login')
      }
      bcrypt.compare(password, user.password)
      .then(doMatch => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => { // this needs to be returned otherwise it would redirect to login
            console.log(err);
            return res.redirect('/')            
          });
        }
        res.redirect('login')
      })
      .catch(err => {
        console.log(err)
        res.redirect('/login')
      })
      
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  let email= req.body.email
  let password = req.body.password
  let confirmPassword = req.body.confirmPassword
  User.findOne({
    email: email
  })
  .then(userDoc => {
    if (userDoc) {
      return res.redirect('/signup')      
    }
    return bcrypt.hash(password, 12)    
    .then(hashedPassword => {
      let user = new User({
        email: email, 
        password: hashedPassword,
        cart: { items: [] }
      })
      return user.save()
    })
    .then(result => {
      res.redirect('/login')
    })
  })  
  .catch(err => {
    console.log(err)
  })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
