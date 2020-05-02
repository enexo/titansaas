//packages
const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const pool = mysql.createPool({
    connectionLimit: 10,
    host     : 'localhost',
    user     : 'root',
    password : 'root43026',
    database : 'transpere'
});

// Initialize Express
const app = express();

// Tell Express we want to use packages
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
});

// This is the loggin on submit call.  Commented out because it is broken.  Come back to this.  5/2/20
// app.post('/auth', function(request, response) {
//     const username = request.body.username;
//     const password = request.body.password;
//     if (username && password) {
//         pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
//             if (results.length > 0) {
//                 console.log('I am here');
//                 request.session.loggedin = true;
//                 request.session.username = username;
//                 response.redirect('/home');
//             } else {
//                 response.send('Incorrect Username and/or Password!');
//             }
//             response.end();
//         });
//     } else {
//         response.send('Please enter Username and Password!');
//         response.end();
//     }
// });


// home doesn't work as the loggin is down.  5/2/20
// app.get('/home', function(request, response) {
//     if (request.session.loggedin) {
//         return response.render('titan');
//     } else {
//         response.send('Please login to view this page!');
//     }
//     response.end();
// });

// Products Routes
// .get gets a resource from the server where post sends a resource to the server

app.get('/products', (req, res) => {
    return res.render('products');
});

app.post('/products-entered', (req, res)=> {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
            let sql = "INSERT INTO products (manufacturer, type, grade, model, short_description, size, serial_number, comment, proc_model, proc_speed, ram, hdd_size, hdd_type, webcam, optical, coa, battery)" +
                "VALUES ('"+req.body.manufacturer+"', '"+req.body.pets+"', '"+req.body.grade+"', '"+req.body.model+"', '"+req.body.short_description+"', '"+req.body.size+"', '"+req.body.serial+"', '"+req.body.comment+"', '"+req.body.proc_model+"', '"+req.body.proc_speed+"', '"+req.body.ram+"', '"+req.body.hdd+"', '"+req.body.hdd_type+"', '"+req.body.webcam+"', '"+req.body.optical+"', '"+req.body.coa+"', '"+req.body.battery+"')";
             connection.query(sql, [],);
        res.render('products-entered')
             connection.release();
    });
});

// Home Page Route
app.get('/', (req, res) => {
    return res.render('titan');
});

// Kroger Dashboard Route
app.get('/kroger', (req, res) => {
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        // Use the connection
        // Getting all data when the client starts with 'k'
        connection.query('SELECT * FROM products WHERE client LIKE \'k%\'', function (error, results, fields) {
            console.log("results");
            // When done with the connection, release it.
            //connection.release();
            // Handle error after the release.
            if (error) throw error;
            // Don't use the connection here, it has been returned to the pool.
        });
    });

    return res.render('kroger');
});

// API's need to be predictable.  Every API request is handled separately.



app.listen(3000);



