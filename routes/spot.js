const express = require('express');
const bodyParser = require('body-parser');
var mysql = require('mysql')
const config = require('../config')

const spotRouter = express.Router();

spotRouter.use(bodyParser.json());

var connection = mysql.createConnection(config.credentials);
connection.connect(function(err) {
    if (err) {
      console.log('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
});

spotRouter.route('/').get( (req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    
    connection.query('SELECT * FROM Spot', function (err, rows, fields) {
        try{
            res.send(JSON.stringify(rows));
        }catch(e){
            console.log(e);
        }
    });
});
spotRouter.route('/:sectionId').get( (req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    
    connection.query(`SELECT * FROM Spot WHERE ID LIKE '${req.params.sectionId}%'`, function (err, rows, fields) {
        try{
            res.send(JSON.stringify(rows));
        }catch(e){
            console.log(e);
        }
    });
});

module.exports = spotRouter;