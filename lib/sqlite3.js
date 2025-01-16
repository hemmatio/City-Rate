const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create or open the database file
const dbPath = path.resolve(__dirname, 'cities.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err);
        return;
    }
    console.log('Connected to SQLite database');
});

// Create the table if it doesn't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS cities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cityName TEXT NOT NULL UNIQUE,
            ratings TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Table created or already exists');
        }
    });
});

// Function to add or update a city with a new rating
function addRating(cityName, rating) {
    db.get(`SELECT * FROM cities WHERE cityName = ?`, [cityName], (err, row) => {
        if (err) {
            console.error('Error querying city:', err);
            return;
        }

        if (row) {
            // City exists, update ratings
            const currentRatings = JSON.parse(row.ratings);
            currentRatings.push(rating);
            const updatedRatings = JSON.stringify(currentRatings);
            db.run(`UPDATE cities SET ratings = ? WHERE cityName = ?`, [updatedRatings, cityName], (err) => {
                if (err) {
                    console.error('Error updating ratings:', err);
                } else {
                    console.log(`Updated ratings for city '${cityName}'`);
                }
            });
        } else {
            // City does not exist, create it
            const ratingsJSON = JSON.stringify([rating]);
            db.run(`INSERT INTO cities (cityName, ratings) VALUES (?, ?)`, [cityName, ratingsJSON], function (err) {
                if (err) {
                    console.error('Error inserting city:', err);
                } else {
                    console.log(`City '${cityName}' added with ID: ${this.lastID}`);
                }
            });
        }
    });
}

// Function to get ratings for a city
function getRatings(cityName) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM cities WHERE cityName = ?`, [cityName], (err, row) => {
            if (err) {
                console.error('Error querying city:', err);
                reject(err);
                return;
            }
            if (row) {
                console.log('City found:', row);
                resolve({
                    ratings: JSON.parse(row.ratings)
                });
            } else {
                resolve(null);
            }
        });
    });
}


// Close the database connection when the process ends
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});

module.exports = { addRating, getRatings };
