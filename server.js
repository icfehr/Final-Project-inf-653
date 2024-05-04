//Common Core Modules
require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

//Connect to mongo DB
connectDB();


// built-in middleware to handle urlencoded form data
app.use(express.json());

// Cross Origin Resource Sharing
app.use(cors());
//CORS
app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
})

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes

app.use('/states', require('./routes/api/states.js'));


app.use('/', require('./routes/root.js'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});


// If connected listen on port
mongoose.connection.once('open', () => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

