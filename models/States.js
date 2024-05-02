const { ca } = require('date-fns/locale');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new mongoose.Schema({
    state: {
        type: String,
        required: true
    },
    stateCode: {
        type: String,
        required: true,
        unique: true
    },
    funfacts: {
        type: [String],
        required: false
    }
});

module.exports = mongoose.model('State', stateSchema);