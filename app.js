//packages
const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root43026',
    database : 'transpere'
});

// Initialize Express
const app = express();

// Tell Express we want to use packages
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// Imported from products
app.use(express.static(path.join(__dirname+"/public")));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

// Init Routers
const router = require('./routes/clients');

app.use(router);

// Routes


// Display Login.html to client
app.get('/login', function(req, res) {
    return res.render('login');
    //response.sendFile(path.join(__dirname + '/login.html'));  // don't think I need this any more.
});

// How to handle POST request
app.post('/auth', function(request, response) {
    const username = request.body.username;
    const password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/home');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

// Handle GET Request
app.get('/home', function(request, response) {
    if (request.session.loggedin) {
        return response.render('titan');
        //response.send('Welcome back, ' + request.session.username + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

// Nate's Products Routes
app.get('/products', (req, res) => {
    return res.render('products');
});

app.post('/products-entered', (req, res) => {
    let sql = "INSERT INTO products (manufacturer, type, grade, model, short_description, size, serial_number, comment, proc_model, proc_speed, ram, hdd_size, hdd_type, webcam, optical, coa, battery)" +
        "VALUES ('"+req.body.manufacturer+"', '"+req.body.pets+"', '"+req.body.grade+"', '"+req.body.model+"', '"+req.body.short_description+"', '"+req.body.size+"', '"+req.body.serial+"', '"+req.body.comment+"', '"+req.body.proc_model+"', '"+req.body.proc_speed+"', '"+req.body.ram+"', '"+req.body.hdd+"', '"+req.body.hdd_type+"', '"+req.body.webcam+"', '"+req.body.optical+"', '"+req.body.coa+"', '"+req.body.battery+"')";
    connection.query(sql,(err, result) => {
        if (err) throw err;
        console.log(result);
        res.render('products-entered')
    });
});








app.listen(3000);



