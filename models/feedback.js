const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Feedback = new Schema({
    email: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        default: ''
    },
});


module.exports = mongoose.model('Feedback', Feedback);