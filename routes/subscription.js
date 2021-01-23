const express = require('express');
const bodyParser = require('body-parser')
const authenticate = require('../authenticate');
const Subscription = require('../models/subscription');

const subsRouter = express.Router();
subsRouter.use(bodyParser.json());

subsRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

subsRouter.route('/').get(authenticate.verifyUser, async (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  const subscriptions = await Subscription.find({});
  res.send(subscriptions)
});

subsRouter.route('/profile').get(authenticate.verifyUser, async (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  const subscriptions = await Subscription.find({email: req.user.username});
  res.send(subscriptions)
});

subsRouter.route('/').post(authenticate.verifyUser, async (req, res, next) => {
  const sub = {
    email: req.body.email,
    cardId: req.body.cardId,
    mat_number: req.body.matNumber,
    exp_date: req.body.expDate,
    reservedSpot: req.body.reservedSpot
  }
  const subscription = new Subscription(sub);
  await subscription.save((err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: "Failed to add subscription"});
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'Subscription added succesfully!'});
  })
});

subsRouter.route('/extend').post(authenticate.verifyUser, async (req, res, next) => {
  const result = await Subscription.updateMany(
    {email: req.params.email}, 
    {exp_date: req.params.expDate}
  );
  if (result.nModified > 0) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'Subscription extended succesfully!'});
  }
});

module.exports = subsRouter;
