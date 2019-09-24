const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnection = require('./util/database').mongoConnection

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
    User.findByPk("5d8a61c53f48d336ccc9b243")    
    .then(user => { // first parameter is the returned value from before
        req.user = new User(user.name, user.email, user.cart, user._id) // this stores the user on all requests.         
        console.log(user)
        next() // continues the execution
    })
    .catch(err => console.log(err))    
})


app.use('/admin', adminRoutes);

app.use(shopRoutes); 

app.use(errorController.get404);

mongoConnection(() => {        
    app.listen(3000)
})