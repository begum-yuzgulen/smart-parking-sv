const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config')
var authenticate = require('../authenticate');
var nodemailer = require('nodemailer');
const Spot = require("../models/spot");

const spotRouter = express.Router();
spotRouter.use(bodyParser.json());

spotRouter.route('/').get(authenticate.verifyUser, async (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    const spots = await Spot.find({});
    let freq = {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        f: 0
    }
    spots.forEach((s) => {
        freq[s.section] += s.isFree ? 1 : 0;    
    })
    res.send(freq);
});
spotRouter.route('/:sectionId').get(authenticate.verifyUser, async(req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    const sectionSpots = await Spot.find({
        section: req.params.sectionId
    });
    res.send(sectionSpots);

});

spotRouter.route('/reserve').post(authenticate.verifyUser, async(req, res, next) => {
    const spot = {
        reservedFor: req.user.username,
        reservedFrom: req.body.reservedFrom,
        reservedUntil: req.body.reservedUntil,
    }
    await Spot.findOneAndUpdate({id: req.body.id}, spot, {upsert: true}, (err, doc) => {
        if (err) return res.send(500, {error: err});
        return res.send('Succesfully reserved');
    });
});
module.exports = spotRouter;