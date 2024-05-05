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

    // Check if the contig query parameter is provided
    if (req.query.contig !== undefined) {
      const contig = req.query.contig === 'true';
      const filteredData = mergedData.filter((state) => {
        if (contig) {
          // Exclude AK and HI for contig=true
          return state.code !== 'AK' && state.code !== 'HI';
        } else {
          // Include only AK and HI for contig=false
          return state.code === 'AK' || state.code === 'HI';
        }
      });
      res.json(filteredData);
    } else {
      // If contig is not provided, return the full list
      res.json(mergedData);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// GET ONE
router.get("/:state", async (req, res) => {
  try {
    // ensure that nY and Ny can be read as NY as the state code
    const stateCode = req.params.state.toUpperCase();

    // Read the JSON file
    const data = fs.readFileSync(
      path.join(__dirname, "../../models/statesData.json")
    );

    // Parse data
    const statesData = JSON.parse(data);

    // Find the corresponding state in the JSON data
    const stateData = statesData.find(state => state.code === stateCode);

    // for passing test
    if (!stateData) {
      return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    // Get the data from MongoDB where the abbreviation is keyed as stateCode
    const stateFromDB = await State.findOne({ stateCode: stateCode });

    // Merge the data from both databases
    if (stateFromDB && stateFromDB.funfacts) {
      stateData.funfacts = stateFromDB.funfacts;
    }

    // present the data as a json object
    res.json(stateData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// GET FUNFACTS
router.get("/:state/funfact", async (req, res) => {
  try {
    // ensure that nY and Ny can be read as NY as the state code
    const stateCode = req.params.state.toUpperCase();

    // Read the JSON file
    const data = fs.readFileSync(
      path.join(__dirname, "../../models/statesData.json")
    );

    // Parse data
    const statesData = JSON.parse(data);

    // Find the corresponding state in the JSON data
    const stateData = statesData.find(state => state.code === stateCode);

    // If the state is not found in the JSON data, return an error message
    if (!stateData) {
      return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    // Get the data from MongoDB where the abbreviation is keyed as stateCode
    const stateFromDB = await State.findOne({ stateCode: stateCode.toUpperCase() });

    // If the state is not found in the MongoDB or it doesn't have a funfact, return an error message
    if (!stateFromDB || !stateFromDB.funfacts || stateFromDB.funfacts.length === 0) {
      return res.status(404).json({ message: `No Fun Facts found for ${stateData.state}` });
    }

    // Return the funfacts as a json object
    res.json({ funfacts: stateFromDB.funfacts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get CAPITAL

router.get("/:state/capital", async (req, res) => {
  try {
    // ensure that nY and Ny can be read as NY as the state code
    const stateCode = req.params.state.toUpperCase();

    // Read the JSON file
    const data = fs.readFileSync(
      path.join(__dirname, "../../models/statesData.json")
    );

    // Parse data
    const statesData = JSON.parse(data);

    // Find the corresponding state in the JSON data
    const stateData = statesData.find(state => state.code === stateCode);

    // If the state is not found in the JSON data, return an error message
    if (!stateData) {
      return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    // Get the data from MongoDB where the abbreviation is keyed as stateCode
    const stateFromDB = await State.findOne({ stateCode: stateCode });

    // If the state is not found in the MongoDB, return an error message
    if (!stateFromDB) {
      return res.status(404).json({ message: `No data found for ${stateData.state}` });
    }

    // Return the state and capital as a json object
    res.json({ state: stateData.state, capital: stateData.capital_city });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});



//nickname
router.get("/:state/nickname", async (req, res) => {
  try {
    const stateCode = req.params.state.toUpperCase();
    const data = fs.readFileSync(path.join(__dirname, "../../models/statesData.json"));
    const statesData = JSON.parse(data);
    const stateData = statesData.find(state => state.code === stateCode);

    if (!stateData) {
      return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    res.json({ state: stateData.state, nickname: stateData.nickname });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//population
router.get("/:state/population", async (req, res) => {
  try {
    const stateCode = req.params.state.toUpperCase();
    const data = fs.readFileSync(path.join(__dirname, "../../models/statesData.json"));
    const statesData = JSON.parse(data);
    const stateData = statesData.find(state => state.code === stateCode);

    if (!stateData) {
      return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    res.json({ state: stateData.state, population: stateData.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


//admission
router.get("/:state/admission", async (req, res) => {
  try {
    const stateCode = req.params.state.toUpperCase();
    const data = fs.readFileSync(path.join(__dirname, "../../models/statesData.json"));
    const statesData = JSON.parse(data);
    const stateData = statesData.find(state => state.code === stateCode);

    if (!stateData) {
      return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    res.json({ state: stateData.state, admitted: stateData.admission_date });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});




///// POST REQUEST
//funfacts post update
router.post("/:state/funfact", async (req, res) => {
  const { state } = req.params;
  const { funfacts } = req.body;

  // Check if funfacts is provided
  if (funfacts === undefined) {
    return res.status(400).json({ message: 'State fun facts value required' });
  }

  // Check if funfacts is an array
  if (!Array.isArray(funfacts)) {
    return res.status(400).json({ message: 'State fun facts value must be an array' });
  }

  try {
    // Find the state in the database
    let stateData = await State.findOne({ stateCode: state });

    // If the state doesn't exist, create a new one
    if (!stateData) {
      stateData = new State({
        stateCode: state,
        funfacts: funfacts,
      });
    } else {
      // If the state exists, add the new fun facts
      stateData.funfacts = [...stateData.funfacts, ...funfacts];
    }

    // Save the state data
    await stateData.save();

    res.json(stateData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});










//PATCH REQUEST

router.patch("/:state/funfact", async (req, res) => {
  const { state } = req.params;
  const { index, funfact } = req.body;

  // Check if index and funfact are provided
  if (index === undefined) {
    return res.status(400).json({ message: 'State fun fact index value required' });
  }
  if (!funfact || typeof funfact !== 'string') {
    return res.status(400).json({ message: 'State fun fact value required' });
  }

  try {
    // ensure that nY and Ny can be read as NY as the state code
    const stateCode = state.toUpperCase();

    // Read the JSON file
    const data = fs.readFileSync(
      path.join(__dirname, "../../models/statesData.json")
    );

    // Parse data
    const statesData = JSON.parse(data);

    // Find the corresponding state in the JSON data
    const stateData = statesData.find(state => state.code === stateCode);

    // If the state is not found in the JSON data, return an error message
    if (!stateData) {
      return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    // Find the state in the database
    let stateFromDB = await State.findOne({ stateCode: stateCode });

    // If the state doesn't exist or it doesn't have funfacts, return an error message
    if (!stateFromDB || !stateFromDB.funfacts || stateFromDB.funfacts.length === 0) {
      return res.status(404).json({ message: `No Fun Facts found for ${stateData.state}` });
    }

    // If no fun fact exists at the provided index, return an error message
    if (!stateFromDB.funfacts[index - 1]) {
      return res.status(404).json({ message: `No Fun Fact found at that index for ${stateData.state}` });
    }

    // Update the fun fact at the provided index
    stateFromDB.funfacts[index - 1] = funfact;

    // Save the state data
    await stateFromDB.save();

    res.json(stateFromDB);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// DELETE
// Delete funfact of a state
router.delete("/:state/funfact", async (req, res) => {
  const { state } = req.params;
  const { index } = req.body;

  // Check if index is provided
  if (index === undefined) {
    return res.status(400).json({ message: 'State fun fact index value required' });
  }

  try {
    // ensure that nY and Ny can be read as NY as the state code
    const stateCode = state.toUpperCase();

    // Read the JSON file
    const data = fs.readFileSync(
      path.join(__dirname, "../../models/statesData.json")
    );

    // Parse data
    const statesData = JSON.parse(data);

    // Find the corresponding state in the JSON data
    const stateData = statesData.find(state => state.code === stateCode);

    // If the state is not found in the JSON data, return an error message
    if (!stateData) {
      return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    // Find the state in the database
    let stateFromDB = await State.findOne({ stateCode: stateCode });

    // If the state doesn't exist or it doesn't have funfacts, return an error message
    if (!stateFromDB || !stateFromDB.funfacts || stateFromDB.funfacts.length === 0) {
      return res.status(404).json({ message: `No Fun Facts found for ${stateData.state}` });
    }

    // If no fun fact exists at the provided index, return an error message
    if (!stateFromDB.funfacts[index - 1]) {
      return res.status(404).json({ message: `No Fun Fact found at that index for ${stateData.state}` });
    }

    // Delete the fun fact at the provided index
    stateFromDB.funfacts.splice(index - 1, 1);

    // Save the state data
    await stateFromDB.save();

    res.json(stateFromDB);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});



module.exports = router;
