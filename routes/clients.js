// will contain all client based routes

const express = require('express');
const mysql = require('mysql');

// Call connection to database
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root43026',
    database : 'transpere'
});

const router = express.Router();
router.get('/client-entry', (req, res) => {
    return res.render('client-entry');
});

router.post('/client-entered', (req, res) => {
    let sql = "INSERT INTO clients (clientType, com_name, fac_street, fac_city, fac_state, fac_zip, fac_phone, con_fname, con_lname, con_email, con_phone)" +
        "VALUES ('"+req.body.clientType+"', '"+req.body.com_name+"', '"+req.body.fac_street+"', '"+req.body.fac_city+"', '"+req.body.fac_state+"', '"+req.body.fac_zip+"', '"+req.body.fac_phone+"', '"+req.body.con_fname+"', '"+req.body.con_lname+"', '"+req.body.con_email+"', '"+req.body.con_phone+"')";
    connection.query(sql,(err, result) => {
        if (err) throw err;
        console.log(result);
        res.render('client-entered')
    });
});


// export this router
module.exports = router;