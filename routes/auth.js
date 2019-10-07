const express = require('express');

const authController = require('../controllers/auth');

const { check, body } = require('express-validator')

const User = require('../models/user')

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', 
  [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
    body('password', 'Password has to be valid')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim() //extra white space remover
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email address is forbidden");
        // }
        // return true;

        //  !!!!! Async validation !!!!!
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject("Mail exists already, pick another one");
          }
        });
      })
      .normalizeEmail(),
    body("password", "Password invalid!").isLength({ min: 5 }).isAlphanumeric().trim(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!!");
      }
      return true
    })
    .trim()
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword); //:token, how the params variable will be named and passed forward

router.post('/new-password', authController.postNewPassword); //:token, how the params variable will be named and passed forward


module.exports = router;