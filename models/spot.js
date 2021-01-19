const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Spot = new Schema({
    id: {
        type: String,
        default: ''
    },
    section: {
        type: String,
        default: ''
    },
    number: {
        type: Number,
        default: 0
    },
    isFree: {
        type: Boolean,
        default: false
    },
    isReserved: {
        type: Boolean,
        default: false
    },
}, {collection: "spot"});


module.exports = mongoose.model('Spot', Spot);