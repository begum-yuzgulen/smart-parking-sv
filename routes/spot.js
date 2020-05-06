const express = require('express');
const bodyParser = require('body-parser');
var mysql = require('mysql')
const config = require('../config')
var authenticate = require('../authenticate');

const spotRouter = express.Router();

spotRouter.use(bodyParser.json());

var connection = mysql.createConnection(config.credentials);
connection.connect(function(err) {
    if (err) {
      console.log('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
});

spotRouter.route('/').get(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    
    connection.query('SELECT * FROM Spot', function (err, rows, fields) {
        try{
            let result = JSON.stringify(rows);
            let freq = {
                a: 0,
                b: 0,
                c: 0,
                d: 0,
                e:0
            }
            for(i = 0; i< rows.length; i++) {
               let obj = rows[i];
                switch(obj.ID.slice(0,1)){
                    case 'a':
                        freq.a += obj.isFree;
                        break;
                    case 'b':
                        freq.b += obj.isFree;
                        break;
                    case 'c':
                        freq.c += obj.isFree;
                        break;
                    case 'd':
                        freq.d += obj.isFree;
                        break;
                    case 'e':
                        freq.e += obj.isFree;
                        break;
                    default:
                        console.log(obj.ID[0]);
                }     
           }
            res.send(freq);
        }catch(e){
            console.log(e);
        }
    });
});
spotRouter.route('/:sectionId').get(authenticate.verifyUser, (req,res,next) => {
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