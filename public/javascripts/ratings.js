const cityName = document.getElementById("city-name").innerText;

// Check if the user has already voted for this city
function hasVoted(cityName) {
    return localStorage.getItem(`voted-${cityName}`) === "true";
}

// Mark the city as voted
function markAsVoted(cityName) {
    localStorage.setItem(`voted-${cityName}`, "true");
}

// Disable all voting buttons
function disableVotingButtons() {
    const buttons = document.querySelectorAll("#stars button");
    buttons.forEach(button => button.disabled = true);
}

function renderStars(rating) {
    const fullStars = Math.floor(rating); // Full stars
    const fractionalStar = rating - fullStars; // Fractional part
    const stars = "⭐".repeat(fullStars); // Render full stars

    // Add a fractional star representation if needed
    if (fractionalStar > 0) {
        const fractionalWidth = Math.round(fractionalStar * 100) / 100; // Keep precision
        return `${stars}<span id="star" style="display: inline-flex; width: ${fractionalWidth * 20}px; overflow: hidden;">⭐</span>`;
    }

    return stars;
}


async function updateAverageRating() {
    try {
        console.log("updateAverageRating: Fetching average rating...");
        const response = await fetch(`/getRatings?cityName=${encodeURIComponent(cityName)}`);
        if (!response.ok) {
            console.error("Failed to fetch ratings:", response.status, response.statusText);
            return;
        }
        const data = await response.json();
        console.log("Received data:", data);

        const averageRatingElement = document.getElementById("average-rating");

        // Check if ratings exist and calculate average
        if (data.ratings && Array.isArray(data.ratings) && data.ratings.length > 0) {
            const averageRating = data.ratings.reduce((sum, val) => sum + val, 0) / data.ratings.length;
            console.log("updateAverageRating: Calculated average rating:", averageRating.toFixed(2));

            averageRatingElement.innerHTML = `Average Rating: ${renderStars(averageRating)} (${averageRating.toFixed(2)})`;
            averageRatingElement.style.display = "block"; // Show the rating
        } else {
            console.log("updateAverageRating: No ratings found");
            averageRatingElement.style.display = "none"; // Hide the rating
        }
    } catch (error) {
        console.error("updateAverageRating: Error occurred:", error);
    }
}

async function rateCity(stars) {
    try {
        if (hasVoted(cityName)) {
            console.log("rateCity: User has already voted for this city.");
            alert("You have already rated this city!");
            return;
        }

        console.log(`rateCity: Sending rating (${stars} stars) for city:`, cityName);

        const response = await fetch(`/addRating`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ cityName, rating: stars }),
        });

        console.log("rateCity: Response from server:", response);

        if (response.ok) {
            console.log("rateCity: Rating added successfully, updating average rating...");
            markAsVoted(cityName); // Mark as voted
            disableVotingButtons(); // Disable voting buttons
            updateAverageRating();
        } else {
            console.error("rateCity: Failed to add rating, response status:", response.status);
        }
    } catch (error) {
        console.error("rateCity: Error occurred:", error);
    }
}

// Initial setup: Disable voting buttons if user has already voted
if (hasVoted(cityName)) {
    disableVotingButtons();
}

// Initial call to update the average rating
updateAverageRating();
