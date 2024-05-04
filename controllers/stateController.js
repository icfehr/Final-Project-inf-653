const State = require("../models/statesData.json");

//get all states
const getAllStates = async (req, res) => {
    let states;
    try {
        if (req.query.contig === "true") {
        states = await State.find({ stateCode: { $nin: ["AK", "HI"] } })
            .sort({ state: 1 })
            .exec();
        } else if (req.query.contig === "false") {
            states = await State.find({ stateCode: { $in: ["AK", "HI"] } })
            .sort({ state: 1 })
            .exec();
        } else {
            states = await State.find().sort({ state: 1 }).exec();
        }
    }  catch (err) {
        res.status(500).json({ message: err.message });
        }
    if (!states) {
        res.status(404).json({ message: "Error No states found" });
    }
    res.json(states);
};

//get one state

const getOneState = async (req, res) => {
    const state = await State.findOne({ stateCode: req.params.stateCode }).exec();
    if (!state) {
        res.status(404).json({ message: "Error No state found" });
    }
    res.json(state);
};

// Add fun facts to a state

const updateState = async (req, res) => {
    const state = await State.findOne({ stateCode: req.params.stateCode }).exec();
    if (!state) {
        res.status(404).json({ message: "Error No state found" });
    }
    if (req.body.funfact && !state.funfacts.includes(req.body.funfact)) {
        state.funfacts.push(req.body.funfact);
    }
    await state.save();
    res.json(state);
};

//get all contiguous states (Not AK or HI)
const getContiguousStates = async (req, res) => {
    const states = await State.find({ stateCode: { $nin: ["AK", "HI"] } }).exec();
    if (!states) {
        res.status(404).json({ message: "Error No states found" });
    }
    res.json(states);
};

//get all non-contiguous states (AK, HI)
const getNonContiguousStates = async (req, res) => {
    const states = await State.find({ stateCode: { $in: ["AK", "HI"] } }).exec();
    if (!states) {
        res.status(404).json({ message: "Error No states found" });
    }
    res.json(states);
};



const addFunFacts = async (req, res) => {
    const stateCode = req.params.state;
    const funFacts = req.body.funfacts;
    try {
        const state = await State.findOne({ stateCode });
        if (!state) {
        return res.status(404).json({ error: "State not found" });
        }
        if (!Array.isArray(funFacts)) {
        return res.status(400).json({ error: "Fun facts must be an array" });
        }
        state.funFacts.push(...funFacts);
        await state.save();
        return res.status(201).json(state);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

const updateFunFact = async (req, res) => {
    const stateCode = req.params.state;
    const { index, funfact } = req.body;
    try {
        const state = await State.findOne({ stateCode });
        if (!state) {
        return res.status(404).json({ error: "State not found" });
        }
        if (!index || !funfact) {
        return res
            .status(400)
            .json({ error: "Index and fun fact are    quired" });
        }
        const funFacts = state.funFacts;
        if (!funFacts[index - 1]) {
        return res.status(404).json({ error: "Fun fact not found at     dex" });
        }
        funFacts[index - 1] = funfact;
        await state.save();
        return res.status(200).json(state);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

const deleteFunFact = async (req, res) => {
    const stateCode = req.params.state;
    const { index } = req.body;
    try {
        const state = await State.findOne({ stateCode });
        if (!state) {
        return res.status(404).json({ error: "State not found" });
        }
        const funFacts = state.funFacts.filter((fact, i) => i !== index - 1);
        if (funFacts.length === state.funFacts.length) {
        return res.status(404).json({ error: "Fun fact not found at     dex" });
        }
        state.funFacts = funFacts;
        await state.save();
        return res.status(200).json(state);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

// Export the functions Get all states, Get one state, Update state, Get contiguous states, Get non-contiguous states, Delete fun fact
//Unsure if I should change update state to updatefun fact but someone might need to change a website or facebook link or something so I guess it should stay as update state
module.exports = {
    getAllStates,
    getOneState,
    updateState,
    getContiguousStates,
    getNonContiguousStates,
    addFunFacts,
    getContiguousStates,
    getNonContiguousStates,
    deleteFunFact,
    updateFunFact,
};
