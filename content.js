// This will check if the URL matches the pattern
if (window.location.href.includes('md.dev/task/')) {
    // Scrape the identifier (gti)
    const gtiElement = document.querySelector('td.css-18tzy6q span');
    const taskIdElement = document.querySelector('a.css-erwrwv span.white');
    
    if (gtiElement && taskIdElement) {
        const gti = gtiElement.textContent.replace('gti: ', '').trim();
        const taskId = taskIdElement.textContent.trim();
        
        // Send the scraped data to the Flask backend for duplicate checking
        fetch('http://localhost:5000/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gti: gti,
                taskId: taskId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.isDuplicate) {
                // Show the duplicate message
                alert('This title has already been reviewed.');
            } else {
                // If not a duplicate, proceed to add to database (optional)
                alert('This title is new and will be added to the database.');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}
