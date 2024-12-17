(async () => {
    // Wait for the DOM to fully load
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            // Find GTI and Task ID elements
            const gtiElement = document.querySelector('td.css-18tzy6q > span');
            const taskIdElement = document.querySelector('a.css-erwrwv > span.white');

            if (!gtiElement || !taskIdElement) {
                console.error('GTI or Task ID elements not found.');
                return;
            }

            const gti = gtiElement.textContent.trim().replace('gti:', '').trim();
            const taskId = taskIdElement.textContent.trim();

            console.log(`Extracted GTI: ${gti}`);
            console.log(`Extracted Task ID: ${taskId}`);

            // Send the data to Flask API
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

            if (!response.ok) {
                console.error('Failed to fetch from Flask API:', response.statusText);
                alert('An error occurred while contacting the server.');
                return;
            }

            const data = await response.json();

            // Show the result in a popup
            alert(
                data.isDuplicate
                    ? `Duplicate found: Content already reviewed.\nFound at row: ${data.row}\nTask ID: ${data.taskid}`
                    : `Content not reviewed.\nAdded to row: ${data.row}`
            );
        } catch (error) {
            console.error('An unexpected error occurred:', error);
            alert('An unexpected error occurred. Please check the console for details.');
        }
    });
})();
