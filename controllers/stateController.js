const express = require('express');
const router = express.Router();   // Import the express router
const State = require('../../models/States'); // Import the State model

/// GET REQUESTS
//get all states
router.get('/states', async (req, res) => {
    const { contig } = req.query;
    let statesData = require('../data/states.json'); // load state data from JSON file

    if (contig === 'true') {
      // Filter for contiguous states
        statesData = statesData.filter(state => state.contiguous);
    } else if (contig === 'false') {
      // Filter for non-contiguous states
        statesData = statesData.filter(state => !state.contiguous);
    }

    // Attach fun facts from MongoDB
    for (const state of statesData) {
        const dbState = await State.findOne({ code: state.code });
        if (dbState) {
        state.funfacts = dbState.funfacts;
        }
    }

    res.json(statesData);
});

//get one state
router.get('/states/:name', async (req, res) => {
    try {
        // Find one state record in your MongoDB collection
        const state = await State.findOne({ name: req.params.name });

        // If the state doesn't exist, return a 404 error
        if (!state) {
            return res.status(404).json({ error: 'State not found' });
        }

        // Return the state record as JSON data
        return res.json(state);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.get('/states/:state/funfact', async (req, res) => {
    const { state } = req.params;
    let stateData = require('../data/states.json').find(s => s.code === state);

    // Attach fun facts from MongoDB and select a random one
    if (stateData) {
        const dbState = await State.findOne({ code: stateData.code });
        if (dbState && dbState.funfacts.length > 0) {
            const randomIndex = Math.floor(Math.random() * dbState.funfacts.length);
            const randomFact = dbState.funfacts[randomIndex];
            res.json({ funfact: randomFact });
            return;
        }
    }
    res.status(404).send(`No fun facts found for state '${state}'`);
});

router.get('/states/:state/capital', (req, res) => {
    const { state } = req.params;
    const stateData = require('../data/states.json').find(s => s.code === state);
    if (stateData) {
        res.json({ state: stateData.name, capital: stateData.capital });
    } else {
        res.status(404).send(`State '${state}' not found`);
    }
});

router.get('/states/:state/nickname', (req, res) => {
    const { state } = req.params;
    const stateData = require('../data/states.json').find(s => s.code === state);
    if (stateData) {
        res.json({ state: stateData.name, nickname: stateData.nickname });
    } else {
        res.status(404).send(`State '${state}' not found`);
    }
});







//create a new state
router.post('/', async (req, res) => {
    const state = new State({
        name: req.body.name,
        abbreviation: req.body.abbreviation
    });
    res.send('Create a new state');
});


router.post('/states/:state/funfact', async (req, res) => {
    try {
        const stateCode = req.params.state;
        const funFacts = req.body.funfacts;
    
        // Verify that funfacts data is provided as an array
        if (!Array.isArray(funFacts)) {
            return res.status(400).json({ message: 'Fun facts must be provided as an array' });
        }

        // Find the requested state in your MongoDB collection
        let state = await State.findOne({ stateCode });

        if (state) {
            // If the state already has some fun facts, add the new fun facts to them
            state.funfacts = [...state.funfacts, ...funFacts];
        } else {
            // If the state has no pre-existing fun facts, create a new record in your MongoDB collection
            state = new State({ stateCode, funfacts: funFacts });
        }

        // Save the updated funfacts data to your MongoDB collection
        await state.save();
    
        return res.json(state);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error FUNFACT' });
    }
});


router.post('/states/:state/capital', async (req, res) => {
    try{
        const stateCode = req.params.state;
        const capital = req.body.capital;
        const state = await State.findOne({ state: stateCode });

        if (!state) {
            return res.status(404).json({ message: 'State not found' });
        }

        state.capital = capital;
        await state.save();

        res.json(state);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error CAPITAL' });
    }
});

router.post('/states/:state/nickname', async (req, res) => {
    try{
        const stateCode = req.params.state;
        const nickname = req.body.nickname;
        const state = await State.findOne({ state: stateCode });

        if (!state) {
            return res.status(404).json({ message: 'State not found' });
        }
        state.nickname = nickname;
        await state.save();
        res.json(state);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error NICKNAME' });
    }
});

router.post('/states/:state/population', async (req, res) => {
    try{
        const stateCode = req.params.state;
        const population = req.body.population;
        const state = await State.findOne({ state: stateCode })

        if (!state) {
            return res.status(404).json({ message: 'State not found' });
        }
        state.population = population;
        await state.save();
        res.json(state);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error POPULATION' });
    }
});

router.post('/states/:state/admission', async (req, res) => {
    try{
        const stateCode = req.params.state;
        const admission = req.body.admission;
        const state = await State.findOne   ({ state: stateCode });

        if (!state) {
            return res.status(404).json({ message: 'State not found' });
        }
        state.admission = admission;
        await state.save();
        res.json(state);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error ADMISSION' });
    }
});



//update a state
router.patch('/:states', (req, res) => {
    res.send('Update a state');
});

//delete a state should be unused
router.delete('/:id', (req, res) => {
    res.send('Delete a state');
});

router.delete('/:state/funfacts/:funfactPosition', async (req, res) => {
    try {
        const state = await State.findOne({ stateCode: req.params.state });
        if (!state) {
            return res.status(404).json({ message: 'State not found' });
        }
        const position = parseInt(req.params.funfactPosition, 10);
        if (isNaN(position) || position < 0 || position >= state.funfacts.length) {
            return res.status(400).json({ message: 'Invalid funfact position' });
        }
        state.funfacts.splice(position, 1);
        await state.save();
        res.json({ message: 'Funfact deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;            // Export the router
