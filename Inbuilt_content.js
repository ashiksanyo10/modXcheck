// content.js

// Function to scrape GTI and Task ID dynamically
function scrapeData() {
    let gti = null;
    let taskId = null;

    // Scrape GTI: Search in all <td> <span> elements for text starting with "gti:"
    const tdSpans = document.querySelectorAll("td span");
    tdSpans.forEach(span => {
        const textContent = span.textContent.trim();
        if (textContent.startsWith("gti:")) {
            gti = textContent.replace("gti:", "").trim(); // Extract the GTI value
            console.log(`GTI Found: ${gti}`);
        }
    });

    // Scrape Task ID: Look for the specific <a> tag structure and <span> class
    const taskIdElement = document.querySelector('a.css-erwrwv > span.white');
    if (taskIdElement) {
        taskId = taskIdElement.textContent.trim(); // Extract Task ID value
        console.log(`Task ID Found: ${taskId}`);
    }

    // Check if both values are found
    if (!gti || !taskId) {
        console.error("Unable to scrape GTI or Task ID. Ensure the page structure matches the selectors.");
        return null;
    }

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
