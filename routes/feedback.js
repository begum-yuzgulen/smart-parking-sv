const express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
const Feedback = require("../models/feedback");

const feedbackRouter = express.Router();
feedbackRouter.use(bodyParser.json());

feedbackRouter.route('/').post(async (req, res, next) => {

    const fb = new Feedback({email: req.body.email, message: req.body.message});
    await fb.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: "Failed to add feedback"});
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Feedback added succesfully!'});
      })

});
module.exports = feedbackRouter;