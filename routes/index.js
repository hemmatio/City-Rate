var express = require('express');
var router = express.Router();
const { generateCity, getCityDetails } = require('../lib/cityGen');
const { addRating, getRatings } = require('../lib/sqlite3');

/* GET home page. */
var cityDetails = null;
router.get('/', function(req, res, next) {
  (async () => {
    try {
      cityDetails = await generateCity();
      // console.log('City Details:', cityDetails);

      res.render('index', {
        title: 'City Rate',
        cityDetails: cityDetails,
      });
    } catch (error) {
      console.error('Error generating city:', error.message);
    }
  })();

});

// Route to handle getting ratings
router.get('/getRatings', async (req, res, next) => {
  try {
    const { cityName } = req.query;
    if (!cityName) {
      return res.status(400).send('Missing cityName in query parameters.');
    }

    const ratings = await getRatings(cityName); // Assuming getRatings returns a Promise
    console.log('Ratings:', ratings);
    res.status(200).json( ratings );
  } catch (error) {
    console.error('Error retrieving ratings:', error.message);
    res.status(500).send('Error retrieving ratings: ' + error.message);
  }
});

// Route to handle adding ratings
router.post('/addRating', async (req, res, next) => {
  try {
    const { cityName, rating } = req.body;
    if (!cityName || !rating) {
      return res.status(400).send('cityName and rating are required.');
    }

    await addRating(cityName, rating); // Assuming addRating returns a Promise
    res.status(200).send('Rating added successfully');
  } catch (error) {
    console.error('Error adding rating:', error.message);
    res.status(500).send('Error adding rating: ' + error.message);
  }
});

// GET specific city by name
router.get('/cityName=:cityName', async (req, res, next) => {
  try {
    const cityName = req.params.cityName;
    if (!cityName) {
      return res.status(400).send('City name is required.');
    }

    // Fetch city details based on the provided city name
    const cityDetails = await getCityDetails(cityName);
    if (!cityDetails) {
      return res.status(404).send(`City with name "${cityName}" not found.`);
    }

    res.render('index', {
      title: 'City Rate',
      cityDetails: cityDetails,
    });
  } catch (error) {
    console.error('Error fetching city by name:', error.message);
    res.status(500).send('Error fetching city: ' + error.message);
  }
});

module.exports = router;
