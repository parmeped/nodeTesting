const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnection = require('./util/database').mongoConnection

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
/*     User.findByPk(1)
    .then(user => { // first parameter is the returned value from before
        req.user = user
        next() // continues the execution
    })
    .catch(err => console.log(err)) */
    next()
})


app.use('/admin', adminRoutes);

app.use(shopRoutes); 

app.use(errorController.get404);

mongoConnection(() => {    
    app.listen(3000)
})