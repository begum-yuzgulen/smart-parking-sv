const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Subscription = new Schema({
    email: {
        type: String,
        default: ''
    },
    cardId: {
        type: String,
        default: ''
    },
    mat_number: {
        type: String,
        default: ''
    },
    exp_date: {
        type: Date,
    },
    reservedSpot: {
        type: String,
    },
});


module.exports = mongoose.model('Subscription', Subscription);