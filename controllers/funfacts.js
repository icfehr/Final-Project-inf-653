const State = require('../model/States');
const states = require('../model/states.json');

const addFunFacts = async (req, res) => {
const stateCode = req.params.state;
const funFacts = req.body.funfacts;

    try {
        const state = await State.findOne({ stateCode });

        if (!state) {
            return res.status(404).json({ error: 'State not found' });
        }

        if (!Array.isArray(funFacts)) {
            return res.status(400).json({ error: 'Fun facts must be an array' });
        }

        state.funfacts = state.funfacts || []; // Ensure funfacts array exists

        state.funfacts.push(...funFacts);

        await state.save();

        return res.status(201).json(state);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = addFunFacts;
