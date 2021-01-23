var express = require('express');
const bodyParser = require('body-parser')
var User = require('../models/user');
var passport = require('passport');
var mysql = require('mysql')
var authenticate = require('../authenticate');
const config = require('../config')
var nodemailer = require('nodemailer');
var MongoClient = require('mongodb').MongoClient;

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', async (req, res, next) => {
  const emailExists = await User.find({email: req.body.email});
  if (emailExists > 0) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: "The provided email is already in use."});
    return;
  }
  const newUser = {
    username: req.body.email,
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  }
  User.register(new User(newUser), req.body.password, (err, user) => {

    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err:err});
    }
    else {
      if(req.body.firstname)
        user.firstname = req.body.firstname;
      if(req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err:err});
          return;
        }
        passport.authenticate('local')(req,res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});   
        });
      })
    }
  })
});

router.post('/login', passport.authenticate('local'), (req, res) => { 
  const token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token,  status: 'You are successfully logged in!'});
});

router.post('/forgotPassword', async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
      user: 'smart.parking.nokia@gmail.com',
      pass: 'smartparking123!'
    }
  });
  
  const user = await User.find({email: req.body.email});
  if(user.length > 0) {
    const mailOptions = {
      from: 'smart.parking.nokia@gmail.com',
      to: `${req.body.email}`,
      subject: 'Password - Smart Parking System @ Nokia',
      text: `This is your password: ${rows[0].password}. If it wasn't you who requested this message, please contact us.` 
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'aplication/json');
    res.json({statusCode:200, message: "Email sent"});
  }
  else{
    const err = new Error(`No registered user with email: ${req.body.email}`);
    err.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.json({statusCode:err.statusCode, message: err.message});
    return;
  }
});

router.get('/logout', (req, res) => {
  if(req.session) {
    req.session.destroy();
    res.clearCookie('session-id')
    res.redirect('/')
  }
  else{
    var err = new Error('You are not logged in!');
    err.statusCode = 402;
    res.setHeader('Content-Type', 'application/json');
    res.json({err:err});
    return;
  }
});
module.exports = router;
