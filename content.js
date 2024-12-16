document.getElementById("taskForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevents form from submitting the traditional way

    // Collect form data
    let gti = document.getElementById("gti").value;
    let task_id = document.getElementById("task_id").value;

    // Prepare the data to be sent as JSON
    let data = {
        identifier: gti,
        task_id: task_id
    };

    // Send a POST request to the Flask API
    fetch("http://localhost:8080/check-identifier", {
        method: "POST",  // We are sending data
        headers: {
            "Content-Type": "application/json"  // Indicates we are sending JSON data
        },
        body: JSON.stringify(data)  // Convert JavaScript object to JSON string
    })
    .then(response => response.json())  // Parse the JSON response
    .then(result => {
        if (result.isDuplicate) {
            alert(`Duplicate found: ${result.message}. Found at row: ${result.row}`);
        } else {
            alert(`Content added: ${result.message}. Added to row: ${result.row}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred. Please check the console.");
    });
});
