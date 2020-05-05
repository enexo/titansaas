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
    database : 'transpere',
    multipleStatements: true
});

// Initialize Express
const app = express();

// Tell Express we want to use body-parser
app.use(bodyParser.urlencoded({extended : true}));  // x-www-form-urleconded <form>
app.use(bodyParser.json());  // application/json - needed for API

// Tell Express we want to use path and ejs
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
            req.end();
    });
});

// Home Page Route
app.get('/', (req, res) => {
    return res.render('titan');
});


// Kroger Dashboard Route

// SELECT array is as follows
// 0. Count of all kroger products  1514
// 1. Count by Manufacturer

app.get('/kroger', (req, res, next) => {

    // let sql = 'SELECT COUNT(client) FROM products WHERE client LIKE \'k%\';' +
    //     'SELECT manufacturer, COUNT(manufacturer) FROM products WHERE client LIKE \'k%\' GROUP BY manufacturer;' +
    //     'SELECT manufacturer, COUNT(manufacturer) FROM products WHERE client LIKE \'k%\' GROUP BY manufacturer';
    // let query = pool.query(sql, [3, 2, 1], function(error, results, fields) {
    //     if (error) {
    //         throw error;
    //     }
    //     const myObj = res.JSON();
    //     console.log(results[0]);
    //     console.log(results[1]);
    //     console.log(results[2]);
    //     res.end(JSON.stringify(myObj));
    //     //res.send(results);
        res.render('Kroger');
        // Should result in 912
   // });
});

app.get('/kroger/:id', (req, res, next) => {
    let sql = `SELECT * FROM products WHERE client LIKE \'k%\' AND id = ${req.params.id}`;
    let query = pool.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

// app.get('/krogers/counts', (req, res, next) => {
//     let krogerCounts = 'SELECT COUNT(client) FROM products WHERE client LIKE \'k%\'';
//     let query = pool.query(krogerCounts, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Data Fetched');
//         // Should result in 1514, PG = 1512
//     });
// });

// app.get('/krogers/dell', (req, res, next) => {
//     let krogerDell = 'SELECT COUNT(client) FROM products WHERE client LIKE \'k%\' AND manufacturer LIKE \'dell%\'';
//     let query = pool.query(krogerDell, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Data Fetched');
//         // Should result in 912
//     });
// });


app.get('/dashboardapi', (req, res, next) => {
    let krogerManGroupBy = 'SELECT manufacturer, COUNT(manufacturer) AS CountByMan FROM products WHERE client LIKE \'k%\' GROUP BY manufacturer';
    let query = pool.query(krogerManGroupBy, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(result));

        // Should result in 912
    });
});





// API's need to be predictable.  Every API request is handled separately.



// Getting rid of CORS console.log err.  * allows you to lock down domains that can pull json data
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.listen(3000);



