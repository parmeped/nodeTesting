const crypto = require('crypto') // creates random secure values, built in into node
const User = require('../models/user');
const bcrypt = require('bcryptjs')
const nodeMailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator')
const mailApi = require('../middleware/mailApi')


const transporter = nodeMailer.createTransport(sendgridTransport({
  auth: {
    api_key: mailApi // this key binds the program to www.sendgrid.com, through which we send mails
  }
})) // this is for the email configuration


const getError= (req) => {
  let message = req.flash('error')
  if (message.length > 0) {
    return message[0]
  } else {
    return null
  }
}

exports.getLogin = (req, res, next) => {
  let message = getError(req)
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = getError(req)
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmedPassword: ""
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  let email = req.body.email
  let password = req.body.password
  
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422)
    .render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg
    });
  }

  User.findOne({
    email: email
  })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.')
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
        req.flash('error', 'Invalid email or password.')
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
  let confirmedPassword = req.body.confirmedPassword

  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422)
    .render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmedPassword: confirmedPassword
      },
      validationErrors: errors.array()
    });
  }

  bcrypt
  .hash(password, 12)    
  .then(hashedPassword => {
    let user = new User({
      email: email, 
      password: hashedPassword,
      cart: { items: [] }
    })
    console.log(user)
    return user.save()
  })
  .then(result => {
    res.redirect('/login')
    console.log("Sending signUp mail to " + email)
    return transporter.sendMail({
      to: email,
      from: 'hola@amor.com',
      subject: 'PedroTesting',
      html: '<h1>Pedro testeando cosas!</h1>'
    })
  })
  .catch(err => console.log(err))   
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = getError(req)
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  })
}


// ♥ this can also be used to validate mail!!! ♥
exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => { // 
    if (err) {
      console.log(err)
      return res.redirect('/reset')
    }
    let token = buffer.toString('hex') //hexa
    User.findOne({
      email: req.body.email
    })
    .then(user => {      
      if (!user) {
        req.flash('error', 'No account with that email found')
        return res.redirect('/reset')
      }
      user.resetToken = token
      user.resetTokenExpiration = Date.now() + 3600000      
      return user.save()
    })
    .then(result => {
      res.redirect('/')
      console.log("Sending reset mail to " + req.body.email)
      return transporter.sendMail({
        to: req.body.email,
        from: 'shop@node-complete.com',
        subject: 'Password reset',
        html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new password</p>
        `
      })
    })
    .catch(err => console.log(err))
  })
}

exports.getNewPassword = (req, res, next) => {
  let token = req.params.token
  User.findOne({
    resetToken: token,
    resetTokenExpiration: {$gt: Date.now()} // greater than date.now
  })
  .then(user => {
    let message = getError(req)  
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token
    }) 
  })
  .catch(err => console.log(err))
}

exports.postNewPassword = (req, res, next) => {
  let newPassword = req.body.password
  let userId = req.body.userId
  let token = req.body.passwordToken
  let returnedUser

  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
  .then(user => {
    returnedUser = user
    return bcrypt.hash(newPassword, 12)
  })
  .then(hashedPassword => {
    returnedUser.password = hashedPassword
    returnedUser.resetTokenExpiration = undefined
    returnedUser.resetToken = undefined
    return returnedUser.save()
  })
  .then(result => {
    res.redirect('/login')
  })
  .catch(err => console.log(err))
}