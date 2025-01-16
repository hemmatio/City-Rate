const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');


/**
 * Fetches a random city name from the random city API.
 * @returns {Promise<string>} The name of the random city.
 */
async function getRandomCity() {
    return new Promise((resolve, reject) => {
        const cities = [];

        fs.createReadStream('../data/worldcities.csv')
            .pipe(csv())
            .on('data', (row) => {
                cities.push(row['city']);
            })
            .on('end', () => {
                if (cities.length === 0) {
                    return reject(new Error('No cities found in the CSV file.'));
                }
                const randomIndex = Math.floor(Math.random() * cities.length);
                resolve(cities[randomIndex]);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

/**
 * Fetches city details from Wikipedia API.
 * @param {string} cityName - The name of the city.
 * @returns {Promise<Object|null>} The city details if found, or null if not found.
 */
async function getCityDetails(cityName) {
    try {
        const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null; // No Wikipedia page found for the city
        } else {
            console.error('Failed to fetch city details:', error.message);
            throw new Error('Could not fetch city details.');
        }
    }
}

/**
 * Fetches a random city with Wikipedia details. Retries until a valid city is found.
 * @returns {Promise<Object>} The details of a city with a Wikipedia page.
 */
async function generateCity() {
    while (true) {
        try {
            const cityName = await getRandomCity();
            // console.log(`Checking details for city: ${cityName}`);

            // Check if the city has Wikipedia details
            const cityDetails = await getCityDetails(cityName);

            if (cityDetails) {
                if (cityDetails.originalimage) {
                    // console.log(`Found details for city: ${cityName}`);
                    return cityDetails;
                } else {
                    // console.log(`No image found for city: ${cityName}, trying another...`);
                }
            }
            // console.log(`No Wikipedia page found for city: ${cityName}, trying another...`);
        } catch (error) {
            console.error('Error during city generation:', error.message);
        }
    }
}

module.exports = { generateCity, getCityDetails };
