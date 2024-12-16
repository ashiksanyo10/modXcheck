// Function to fetch the identifier and task id from the page
function scrapeData() {
    // Get the identifier (gti) from the specific HTML element
    const identifier = document.querySelector('td.css-18tzy6q span') ? document.querySelector('td.css-18tzy6q span').textContent.replace('gti: ', '') : null;

    // Get the task id from the specific HTML element
    const taskId = document.querySelector('a[aria-current="page"] span.white') ? document.querySelector('a[aria-current="page"] span.white').textContent : null;

    // If identifier and task id are found, send them to the Flask server for checking
    if (identifier && taskId) {
        fetch('http://localhost:8080/check-identifier', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                identifier: identifier,
                task_id: taskId
            })
        })
        .then(response => response.json())
        .then(data => {
            // Show a pop-up based on the response from the server
            if (data.isDuplicate) {
                alert(`Duplicate content! It was found at row ${data.row}`);
            } else {
                alert(`Content not reviewed! It was added at row ${data.row}`);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

// Scrape data when the page is loaded
window.addEventListener('load', scrapeData);
