const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router(); // Import the express router
const State = require("../../models/States");
///const Controller = require('../../controllers/stateController');

//START NEW

// @route   GET /states
// @desc    Get All States
router.get("/", async (req, res) => {
  try {
    // Read the JSON file
    const data = fs.readFileSync(
      path.join(__dirname, "../../models/statesData.json")
    );
    const statesData = JSON.parse(data);

    // Get the data from MongoDB
    const statesFromDB = await State.find();

    // Merge the data
    const mergedData = statesData.map((state) => {
      const stateFromDB = statesFromDB.find((s) => s.stateCode === state.code);
      if (stateFromDB) {
        return {
          ...state,
          funfacts: stateFromDB.funfacts,
        };
      } else {
        return state;
      }
    });

    res.json(mergedData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET ONE
router.get("/states/:name", async (req, res) => {
  const { name } = req.params;

  try {
    // Read the JSON file
    const data = fs.readFileSync(
      path.join(__dirname, "../../models/statesData.json")
    );
    const statesData = JSON.parse(data);

    // Find the state in the JSON data
    const stateData = statesData.find((state) => state.code === name);

    // If the state doesn't exist in the JSON data, return an error
    if (!stateData) {
      return res.status(404).json({ error: "State not found" });
    }

    // Get the state data from MongoDB
    const stateFromDB = await State.findOne({ stateCode: name });

    // If the state exists in the MongoDB data, merge the fun facts
    if (stateFromDB) {
      stateData.funfacts = stateFromDB.funfacts;
    }

    res.json(stateData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

///POST REQUESTS
// @route   POST /states/:state/funfact
// @desc    Add fun fact to a state
router.post("/:state/funfact", async (req, res) => {
  const { state } = req.params;
  const { funfact } = req.body;

  try {
    // Find the state in the database
    let stateData = await State.findOne({ stateCode: state });

    // If the state doesn't exist, create a new one
    if (!stateData) {
      stateData = new State({
        stateCode: state,
        funfacts: [funfact],
      });
    } else {
      // If the state exists, add the new fun fact
      stateData.funfacts.push(funfact);
    }

    // Save the state data
    await stateData.save();

    res.json(stateData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PATCH /states/:state/funfact
// @desc    Update a fun fact of a state
router.patch("/:state/funfact", async (req, res) => {
  const { state } = req.params;
  const { index, funfact } = req.body;

  try {
    // Find the state in the database
    let stateData = await State.findOne({ stateCode: state });

    // If the state doesn't exist, return an error
    if (!stateData) {
      return res.status(404).json({ error: "State not found" });
    }

    // If the index is not provided or is not a number, return an error
    if (!index || typeof index !== "number") {
      return res.status(400).json({ error: "Invalid index" });
    }

    // If the fun fact is not provided or is not a string, return an error
    if (!funfact || typeof funfact !== "string") {
      return res.status(400).json({ error: "Invalid fun fact" });
    }

    // Update the fun fact
    stateData.funfacts[index - 1] = funfact;

    // Save the state data
    await stateData.save();

    res.json(stateData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /states/:state/funfact
// @desc    Delete a fun fact of a state
router.delete("/:state/funfact", async (req, res) => {
  const { state } = req.params;
  const { index } = req.body;

  try {
    // Find the state in the database
    let stateData = await State.findOne({ stateCode: state });

    // If the state doesn't exist, return an error
    if (!stateData) {
      return res.status(404).json({ error: "State not found" });
    }

    // If the index is not provided or is not a number, return an error
    if (!index || typeof index !== "number") {
      return res.status(400).json({ error: "Invalid index" });
    }

    // Delete the fun fact
    stateData.funfacts.splice(index - 1, 1);

    // Save the state data
    await stateData.save();

    res.json(stateData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
