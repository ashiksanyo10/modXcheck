// Function to fetch the identifier and task id from the page
function scrapeData() {
    console.log('Extension is running and attempting to scrape data...');
    
    // Get the identifier (gti) from the specific HTML element
    const identifierElement = document.querySelector('td.css-18tzy6q span');
    const taskIdElement = document.querySelector('a[aria-current="page"] span.white');
    
    if (identifierElement && taskIdElement) {
        const identifier = identifierElement.textContent.replace('gti: ', '');
        const taskId = taskIdElement.textContent;
        
        console.log('Found GTI:', identifier);
        console.log('Found Task ID:', taskId);
        
        // Send the data to the Flask server for checking
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
            // Log the server response
            console.log('Server Response:', data);
            
            if (data.isDuplicate) {
                alert(`Duplicate content! It was found at row ${data.row}`);
            } else {
                alert(`Content not reviewed! It was added at row ${data.row}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        console.log('Could not find the GTI or Task ID tags on the page.');
    }
}

// Scrape data when the page is loaded
window.addEventListener('load', scrapeData);
