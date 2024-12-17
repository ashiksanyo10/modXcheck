// content.js

// Function to scrape GTI and Task ID from the website
function scrapeData() {
    // Replace these with the actual selectors for GTI and Task ID on the target website
    const gtiElement = document.querySelector(".gti-class"); // Update with correct class or ID
    const taskIdElement = document.querySelector(".task-id-class"); // Update with correct class or ID

    if (!gtiElement || !taskIdElement) {
        console.error("Unable to find GTI or Task ID elements on the page.");
        return null;
    }

    const gti = gtiElement.textContent.trim();
    const taskId = taskIdElement.textContent.trim();

    console.log(`Scraped Data: GTI = ${gti}, Task ID = ${taskId}`);
    return { gti, taskId };
}

// Function to send data to Flask API and handle the response
async function sendDataToAPI(gti, taskId) {
    try {
        const response = await fetch('http://localhost:8080/check-identifier', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identifier: gti, task_id: taskId })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Display results in a popup on the same website
        if (data.isDuplicate) {
            alert(`Duplicate found: Content already reviewed\nFound at row: ${data.row}\nTask-id: ${data.taskid}`);
        } else {
            alert(`New content added\nRow ID: ${data.row}\nTask ID: ${data.taskid}`);
        }

        console.log(data);
    } catch (error) {
        console.error("Error communicating with API:", error);
        alert("An error occurred while communicating with the API. Check console for details.");
    }
}

// Main function to run on page load
function main() {
    const scrapedData = scrapeData();
    if (scrapedData) {
        const { gti, taskId } = scrapedData;
        sendDataToAPI(gti, taskId);
    }
}

// Run the main function when the page loads
window.addEventListener("load", main);
