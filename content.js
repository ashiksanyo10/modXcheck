// Function to scrape the gti (identifier) and task id from the webpage
function scrapeData() {
    const gti = document.querySelector('td.css-18tzy6q span') ? document.querySelector('td.css-18tzy6q span').textContent.split(': ')[1] : '';
    const taskid = document.querySelector('a.css-erwrwv span.white') ? document.querySelector('a.css-erwrwv span.white').textContent : '';
    return { gti, taskid };
}

// Function to check if the gti is a duplicate by calling the Flask API
async function checkDuplicate(gti) {
    const response = await fetch(`http://localhost:5000/check_identifier?gti=${gti}`);
    const data = await response.json();
    return data.isDuplicate;
}

// Function to add identifier to the database
async function addIdentifier(gti, taskid) {
    const response = await fetch('http://localhost:5000/add_identifier', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gti: gti, taskid: taskid }),
    });
    const data = await response.json();
    return data.isDuplicate;
}

// Main function to execute when the page loads or when a user interacts
async function handleIdentifier() {
    const { gti, taskid } = scrapeData();
    
    if (!gti || !taskid) {
        alert("GTI or Task ID not found on the page.");
        return;
    }

    // Check if the gti is a duplicate
    const isDuplicate = await checkDuplicate(gti);
    if (isDuplicate) {
        // Show a popup for duplicate title
        alert("This title has already been reviewed.");
    } else {
        // Add the gti and taskid to the database if it's unique
        const added = await addIdentifier(gti, taskid);
        if (!added) {
            alert("Identifier added successfully.");
        }
    }
}

// Call handleIdentifier() when the page loads
window.onload = handleIdentifier;
