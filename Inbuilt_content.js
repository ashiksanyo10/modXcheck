// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    console.log("Script loaded and running...");

    // Scrape GTI
    const gtiElement = document.querySelector("td.css-18tzy6q span");
    let gti = null;

    if (gtiElement) {
        const gtiText = gtiElement.innerText;
        if (gtiText.startsWith("gti:")) {
            gti = gtiText.replace("gti:", "").trim();
        }
    }

    // Log GTI
    if (gti) {
        console.log(`GTI Found: ${gti}`);
    } else {
        console.log("GTI not found. Check the selector or structure of the page.");
    }

    // Scrape Task ID
    const taskIdElement = document.querySelector("a.css-erwrwv span.white");
    let taskId = null;

    if (taskIdElement) {
        taskId = taskIdElement.innerText.trim();
    }

    // Log Task ID
    if (taskId) {
        console.log(`Task ID Found: ${taskId}`);
    } else {
        console.log("Task ID not found. Check the selector or structure of the page.");
    }

    // Final log
    if (gti && taskId) {
        console.log("Scraping successful!");
        console.log(`GTI: ${gti}`);
        console.log(`Task ID: ${taskId}`);
    } else {
        console.warn("Scraping incomplete. One or both values were not found.");
    }
});
