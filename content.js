document.getElementById('checkIdentifier').addEventListener('click', () => {
    // Example: Scraping an identifier from a specific HTML element
    const identifierElement = document.querySelector('.unique-identifier');
    const identifier = identifierElement ? identifierElement.textContent : "unknown";

    // Send the identifier to the local backend for checking
    fetch("http://127.0.0.1:8000/check-and-add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier })
    })
    .then(response => response.json())
    .then(data => {
        const resultElement = document.getElementById('result');
        if (data.isDuplicate) {
            resultElement.textContent = "Duplicate identifier: " + identifier;
        } else {
            resultElement.textContent = "Identifier added: " + identifier;
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
});
