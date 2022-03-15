const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({
    name: String,
    attende: String,
    date: {
        type: Date,
        default: Date.now()
    },
}, {timestamps: true});

const Mail = mongoose.model("Mail", mailSchema);

module.exports = Mail;