const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session)
const MONGODB_URI = 'mongodb://localhost:27017/shop'

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions' // where should sessions be stored? here you can assign also time to live of sessions
})


const appStart = () => {
  console.log('----------------------')
  console.log('---//Starting App//---')
  console.log('----------------------')
}

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(session({
  secret: 'this value should be long, could be a string',
  resave: false, // will not be saved unless there's a change
  saveUninitialized: false,
  store: store
  //cookie: {} // this way you can setup a cookie!
}))

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5d8bd7c14e8cfc1cc0e65716')
    .then(user => {
      req.user = user
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
      MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(result => {
    User.findOne()
    .then(user => {
      if (!user) {
        const user = new User({
          name: 'Pedro',
          email: 'pedro@mail.com',
          cart: {
            items: []
          }
        })
        user.save()
      }
    })
    appStart()
    app.listen(3000);
  })
  .catch(err => {
    console.log(err)
  });

