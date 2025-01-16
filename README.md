# City Rate

<img width="1470" alt="image" src="https://github.com/user-attachments/assets/ea967cf0-87b7-4a3c-974f-01de665feb67" />


City Rate is an Express.js application that displays a random city from a CSV file (enhanced by Wikipedia details) and allows users to rate the city. Ratings are stored in a local SQLite database.

## Table of Contents

1. [Features](#features)  
2. [Installation](#installation)  
3. [Usage](#usage)  
4. [API Endpoints](#api-endpoints)  

---

## Features

- **Random City Generation**: Pulls a random city from a CSV file and fetches relevant Wikipedia details such as a title, summary, and image.  
- **Rating System**: Allows users to assign star ratings to the displayed city.  
- **SQLite Database**: Stores and retrieves city ratings locally using SQLite.  
- **Express.js**: Utilizes a simple Node + Express server for RESTful routes.  

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **(Optional) Create/Update the `worldcities.csv` file**:  
   - The app reads city names from a CSV file (in `../data/worldcities.csv` relative to `cityGen.js`).  
   - Ensure that the CSV contains a column named `city` for the city names.

4. **Start the server**:
   ```bash
   npm start
   ```
   The server should be running at `http://localhost:3000`.

---

## Usage

1. **Open your web browser** and navigate to `http://localhost:3000`.  
2. A **random city** will be displayed, pulled from your `worldcities.csv` file and enriched with Wikipedia data.  
3. **Rate the city** using the star buttons. Your rating will be saved to the SQLite database.  
4. Click **"Get another city"** to fetch a new random city.

#### Custom City
- To directly fetch details for a specific city, navigate to `http://localhost:3000/cityName=<CityName>`.
- Replace `<CityName>` with the desired city name. The application will attempt to fetch and display its Wikipedia details, if available.

---

## API Endpoints

1. **`GET /`**  
   - Renders the random city page.

2. **`GET /getRatings?cityName=CITY_NAME`**  
   - Retrieves stored ratings for `CITY_NAME`.

3. **`POST /addRating`**  
   - Body Parameters:
     - `cityName`: The name of the city to rate.
     - `rating`: The numeric rating (1 to 5).
   - Adds a rating to the database.

4. **`GET /cityName=:cityName`**  
   - Fetches and displays details for the given city name directly, if it exists in Wikipedia.
