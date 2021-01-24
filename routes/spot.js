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
        section: req.params.sectionId, 
        isFree: true
    });
    res.send(sectionSpots);

});

spotRouter.route('/:sectionId/reserved').get(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    connection.query(`SELECT reserved FROM Card `, function (err, rows, fields) {
        try {
            res.send(JSON.stringify(rows));
        } catch (e) {
            console.log(e);
        }
    });

});
spotRouter.route('/:sectionId/profile').get(authenticate.verifyUser, (req, res, next) => {
    let profile = {
        email: req.user.username,
        cardId: "",
        mat_number: "",
        exp_date: "",
        reserved: ""
    }
    console.log('Username:', req.user.username);
    console.log('Email:', req.user.email);
    connection.query(`SELECT * FROM User WHERE email = '${req.user.username}'`, function (err, rows, fields) {
        try {
            if (rows.length > 0) {

                profile.cardId = rows[0].cardId;
                connection.query(`SELECT * FROM Card WHERE cardId = '${profile.cardId}'`, function (err, rows, fields) {
                    try {
                        profile.mat_number = rows[0].mat_number;
                        profile.exp_date = rows[0].exp_date;
                        profile.reserved = rows[0].reserved;
                        console.log(profile);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.send(profile);
                    } catch (e) {
                        console.log(e);
                    }
                });

            }
            else {
                console.log("No user found");
            }
        } catch (e) {
            console.log(e);
        }
    });



});
module.exports = spotRouter;