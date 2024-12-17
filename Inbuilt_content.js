// content.js
(async () => {
    // Wait for the page to fully load
    window.addEventListener('load', async () => {
        try {
            // Extract GTI from the webpage
            const gtiElement = document.querySelector('td.css-18tzy6q > span');
            const taskIdElement = document.querySelector('a.css-erwrwv > span.white');
            
            if (!gtiElement || !taskIdElement) {
                console.log('GTI or Task ID elements not found on the page.');
                return;
            }
            
            const gti = gtiElement.textContent.trim().replace('gti:', '').trim();
            const taskId = taskIdElement.textContent.trim();

            console.log(`Extracted GTI: ${gti}`);
            console.log(`Extracted Task ID: ${taskId}`);

            // Send data to the Flask API
            const response = await fetch('http://localhost:8080/check-identifier', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier: gti,
                    task_id: taskId,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Response from server:', data);

                // Display the result as a popup
                alert(
                    data.isDuplicate
                        ? `Duplicate found: Content already reviewed.\nFound at row: ${data.row}\nTask ID: ${data.taskid}`
                        : `Content not reviewed.\nAdded to row: ${data.row}`
                );
            } else {
                console.error('Error from server:', data.message);
                alert('An error occurred while processing your request.');
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
            alert('An unexpected error occurred. Please check the console.');
        }
    });
})();
