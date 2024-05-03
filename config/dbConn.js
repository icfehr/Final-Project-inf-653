const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
    });
        console.log(`MongoDB Connected`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB;