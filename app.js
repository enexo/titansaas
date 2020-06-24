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

// Home Page Route
app.get('/', (req, res) => {
    return res.render('home');
});

app.get('/about', (req, res) => {
    return res.render('about');
});

app.get('/pricing', (req, res) => {
    return res.render('pricing');
});

app.get('/demo', (req, res) => {
    return res.render('titan');
});

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

app.get('/client-entry', (req, res, next) => {
    res.render('client-entry');
});

app.get('/client', (req, res, next) => {
    let sql = `select * from products where client LIKE 'k%'`;
    let query = pool.query(sql, (err, result) => {
        if (err) throw err;
        res.render('client', {result: result});
    });


});

app.get('/client/:id', (req, res, next) => {
    let sql = `SELECT * FROM products WHERE client LIKE \'k%\' AND id = ${req.params.id}`;
    let query = pool.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});
app.get('/dashboardapi', (req, res, next) => {
    let sql = 'SELECT manufacturer, COUNT(manufacturer) AS CountByMan FROM products WHERE client LIKE \'k%\' GROUP BY manufacturer;' +
        'SELECT proc_model, COUNT(proc_model) AS ProcModel FROM products WHERE client="Kroger" AND type="Laptop" GROUP BY proc_model;' +
        'SELECT type, COUNT(type) AS TYPE FROM products WHERE client LIKE \'k%\' GROUP BY type;';
    let query = pool.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(result));
    });
});

// Getting rid of CORS console.log err.  * allows you to lock down domains that can pull json data
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.listen(3000);



