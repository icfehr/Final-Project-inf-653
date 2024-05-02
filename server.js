//Common Core Modules
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

//Connect to mongo DB
connectDB();


// custom middleware logger
app.use(logger);


// built-in middleware to handle urlencoded form data
app.use(express.json());

// Cross Origin Resource Sharing
app.use(cors(corsOptions));
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
app.use('/', require('./routes/root.js'));

app.use(verifyJWT);
app.use('/statesData', require('./routes/api/states'));

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


// post request to add fun facts to a state
app.post('/states/:state/funfact', async (req, res) => {
    try {
        const stateCode = req.params.state;
        const funFacts = req.body.funfacts;

      // Verify if funfacts property exists and is an array
        if (!funFacts || !Array.isArray(funFacts)) {
        return res.status(400).json({ error: 'Invalid funfacts data' });
    }

    // Find the state in the MongoDB collection
        const state = await State.findOne({ stateCode });

        if (state) {
        // State already exists, add the new fun facts to the existing ones
        state.funfacts.push(...funFacts);
    } else {
        // State doesn't exist, create a new record
        const newState = new State({
        stateCode,
        funfacts: funFacts,
        });
        await newState.save();
    }

    return res.json({ message: 'Fun facts added successfully' });
    } catch (error) {
    console.error('Error processing POST request:', error);
    return res.status(500).json({ error: 'Internal server error' });
    }
});


// Error handler
app.use(errorHandler);

// If connected listen on port
mongoose.connection.once('open', () => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});



app.listen(80, function () {
    console.log('CORS-enabled web server listening on port 80')
})