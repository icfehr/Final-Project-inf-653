const express = require('express');
const router = express.Router();
const State = require('../../models/States'); // Import the State model

// Endpoint to return all state data
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

// Endpoint to return data for a specific state
router.get('/states/:state', async (req, res) => {
    const { state } = req.params;
    let stateData = require('../data/states.json').find(s => s.code === state);

  // Attach fun facts from MongoDB
    if (stateData) {
        const dbState = await State.findOne({ code: stateData.code });
        if (dbState) {
            stateData.funfacts = dbState.funfacts;
        }
    }

    if (stateData) {
        res.json(stateData);
    } else {
        res.status(404).send(`State '${state}' not found`);
    }
});

// Endpoint to return a random fun fact for a specific state
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

// Endpoints to return specific state data (capital, nickname, population, admission)
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












