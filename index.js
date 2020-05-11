const express = require('express');
const http =  require('http');
var createError = require('http-errors');
const morgan = require('morgan');
var path = require('path');
var mysql = require('mysql')
const bodyParser = require('body-parser');
const cors = require('cors');
const spot = require('./routes/spot');
var usersRouter = require('./routes/users');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config'); 
const mongoose = require('mongoose');
const hostname = 'localhost';
const port = 3000;

const User = require('./models/user') 
const url = config.mongoUrl;
var connection = mysql.createConnection(config.credentials);
connection.connect(function(err) {
  if (err) {
    console.log('error: ' + err.message);
  }
});
const connect = mongoose.connect(url);
connect.then((database) => {
  console.log('Connected correctly to the server');
  User.deleteMany({})
  .then((resp) => {
      console.log("Syncing databases");
      connection.query(`SELECT * FROM User`, function (err, rows, fields) {
        try{
          for(i = 0; i< rows.length; i++) {
            let user = rows[i];
            User.register(new User({username: user.email}), user.password);
          }
        }catch(e){
            console.log(e);
        }
      });
  })
  .catch((err) => next(err));
 
}, (err) => {console.log(err);});


const app = express();
app.connection = connection;
app.connect = connect;
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "pug");
app.use(morgan('dev'));
app.use(bodyParser.json())

app.use(passport.initialize());
app.use('/users', usersRouter);
app.use('/spot', spot);
app.use(cors());
  

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  module.exports = app;
