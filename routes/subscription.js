const express = require('express');
const bodyParser = require('body-parser')
const authenticate = require('../authenticate');
const Subscription = require('../models/subscription');

const subsRouter = express.Router();
subsRouter.use(bodyParser.json());

subsRouter.route('/').get(authenticate.verifyUser, async (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  const subscriptions = await Subscription.find({});
  res.send(subscriptions)
});

subsRouter.route('/add').post(authenticate.verifyUser, async (req, res, next) => {
  if (await Subscription.find({email: req.user.username}) > 0 ){
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: "A subscription for the provided email already exists."});
    return;
  }
  const sub = {
    email: req.user.username,
    cardId: req.body.cardId,
    mat_number: req.body.mat_number,
    exp_date: req.body.exp_date,
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

subsRouter.route('/profile').get(authenticate.verifyUser, async (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  const subscriptions = await Subscription.find({email: req.user.username});
  if (subscriptions.length === 0) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: "You currently don't have a subscription."});
    return;
  }
  res.send(subscriptions[0]);
});

subsRouter.route('/extend').post(authenticate.verifyUser, async (req, res, next) => {
  const result = await Subscription.updateMany(
    {email: req.body.email}, 
    {exp_date: req.body.extend}
  );
  if (result.nModified > 0) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'Subscription extended succesfully!'});
  }
  else {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'Failed to extend subscription'});
  }
});

subsRouter.route('/edit').put(authenticate.verifyUser, async (req, res, next) => {
  const result = await Subscription.findOneAndUpdate(
    {email: req.body.email},
    req.body 
  );
  if (result !== undefined) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'Subscription cancelled succesfully!'});
  }
  else {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'Failed to cancel subscription'});
  }
});

subsRouter.route('/').delete(authenticate.verifyUser, async (req, res, next) => {
  const result = await Subscription.findOneAndDelete(
    {email: req.body.email}, 
  );
  if (result !== undefined) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'Subscription cancelled succesfully!'});
  }
  else {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: 'Failed to cancel subscription'});
  }
});

module.exports = subsRouter;
