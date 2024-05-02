const express = require('express');
const router = express.Router();   // Import the express router
const State = require('../../models/States'); // Import the State model

//get all states
router.get('/',async (req, res) => {
    try {
        const states = await State.find();
        res.json(states);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



//get one state
router.get('/:state', async (req, res) => {
    try {
        const stateName = req.params.state;
        const state = await State.findOne({ state: stateName });

        if (!state) {
            return res.status(404).json({ message: 'State not found' });
        }

        res.json(state);
    } catch (err) {
        res.status(500).json({ message: err.message });
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

        // Save the updated state record
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
router.patch('/:state', (req, res) => {
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
