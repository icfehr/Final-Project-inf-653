const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new mongoose.Schema({
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