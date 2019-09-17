const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')

const app = express();



app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

/*
db.execute('SELECT * FROM products')
.then(result => {
    console.log(result)
})
.catch(err => {
    console.log(err)
})
*/

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => { // middleWare registered for incoming reqs
    User.findByPk(1)
    .then(user => { // first parameter is the returned value from before
        req.user = user
        next() // continues the execution
    })
    .catch(err => console.log(err))
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
}) // refer to Sequelize documentation
User.hasMany(Product) // both directions definition


sequelize
    //.sync({force: true}) // force: overrides data. DONT USE ON PROD
    .sync()
    .then(result => {
        return User.findByPk(1)
    })
    .then(user => {
        if (!user) {
            return User.create({name: 'Pedro', email: 'this@mail.com'})
        }
        return Promise.resolve(user) // this is to explicitly return a promise as to remain consistent
    })
    .then(user => {
        console.log(user)
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    })
