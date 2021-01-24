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
const subsRouter = require('./routes/subscription');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config'); 
const mongoose = require('mongoose');
const hostname = 'localhost';
const port = 3000;
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
const Subscription = require('./models/subscription');
const User = require('./models/user');

const url = config.mongoUrl;
const connect = mongoose.connect(url);
connect.then((database) => {
  console.log('Connected correctly to the server');
 
}, (err) => {console.log(err);});


const app = express();
app.connect = connect;
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "pug");
app.use(morgan('dev'));
app.use(bodyParser.json())

app.use(passport.initialize());
app.use('/users', usersRouter);
app.use('/spot', spot);
app.use('/subscription', subsRouter);
app.use(cors());
  

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});

const job = new CronJob('00 00 09 * * *', async () => {
  const d = new Date();
  d.setDate(d.getDate()-3);
  const willExpire = await Subscription.find({exp_date: { $lt: d.getTime()}});
  console.log("will expire soon: ", willExpire);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
      user: 'smart.parking.nokia@gmail.com',
      pass: 'smartparking123!'
    }
  });
  
  willExpire.forEach(async (sub) => {
      const mailOptions = {
        from: 'smart.parking.nokia@gmail.com',
        to: sub.email,
        subject: 'Your parking subscription will expire soon',
        text: `Will expire` 
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    });
}, null, true);
job.start();


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
