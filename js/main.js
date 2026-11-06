// Price per day for each lair (RM)
const PRICE_BASIC = 150;
const PRICE_STANDARD = 350;
const PRICE_PREMIUM = 800;

// Validate the kiosk form. Returns true only if everything is OK.
function validateKiosk() {
    // 1. Clear old error messages
    const errorIds = ['fullNameError', 'emailError', 'daysError', 'groupSizeError', 'securityError', 'styleError'];
    for (let i = 0; i < errorIds.length; i++) {
        document.getElementById(errorIds[i]).innerHTML = "";
    }

    // 2. Read values from the form
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const days = document.getElementById('days').value;
    const groupSize = document.getElementById('groupSize').value;
    const security = document.getElementById('security').value;
    const style = document.querySelector('input[name="style"]:checked');

    let isValid = true;

    // 3. Check each field
    if (fullName.trim() === "") {
        document.getElementById('fullNameError').innerHTML = "Name is required.";
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() === "") {
        document.getElementById('emailError').innerHTML = "Email is required.";
        isValid = false;
    } else if (!emailPattern.test(email.trim())) {
        document.getElementById('emailError').innerHTML = "Enter a valid email, like you@example.com.";
        isValid = false;
    }

    if (days === "" || isNaN(days) || Number(days) < 1 || Number(days) > 30 || !Number.isInteger(Number(days))) {
        document.getElementById('daysError').innerHTML = "Enter a whole number from 1 to 30.";
        isValid = false;
    }

    if (groupSize === "" || isNaN(groupSize) || Number(groupSize) < 1 || Number(groupSize) > 20 || !Number.isInteger(Number(groupSize))) {
        document.getElementById('groupSizeError').innerHTML = "Enter a whole number from 1 to 20.";
        isValid = false;
    }

    if (security === "") {
        document.getElementById('securityError').innerHTML = "Choose a security level.";
        isValid = false;
    }

    if (!style) {
        document.getElementById('styleError').innerHTML = "Choose a lair style.";
        isValid = false;
    }

    // 4. Tell the user if something is wrong
    if (!isValid) {
        alert("Oops, the details are missing. Every villain needs to fill this in first.");
    }
    return isValid;
}

// Work out the recommended lair and show the result
function recommendPackage() {
    if (!validateKiosk()) {
        return false; // stop here, nothing is calculated
    }

    // Read values and convert numbers
    const fullName = document.getElementById('fullName').value.trim();
    const days = parseInt(document.getElementById('days').value);
    const groupSize = parseInt(document.getElementById('groupSize').value);
    const security = parseInt(document.getElementById('security').value);
    const style = document.querySelector('input[name="style"]:checked').value;
    const extras = document.querySelectorAll('input[name="extras"]:checked');

    // Points for days
    let dayPoints = 0;
    if (days <= 3) {
        dayPoints = 1;
    } else if (days <= 7) {
        dayPoints = 2;
    } else {
        dayPoints = 3;
    }

    // Points for group size
    let groupPoints = 0;
    if (groupSize <= 3) {
        groupPoints = 1;
    } else if (groupSize <= 8) {
        groupPoints = 2;
    } else {
        groupPoints = 3;
    }

    // Points for extras (1 each)
    const extraPoints = extras.length;
    let extraNames = [];
    for (let i = 0; i < extras.length; i++) {
        extraNames.push(extras[i].value);
    }

    // Total score
    const score = dayPoints + groupPoints + security + extraPoints;

    // Decide the package
    let packageName = "";
    let pricePerDay = 0;
    let packageImage = "";
    if (score <= 6) {
        packageName = "Eddie's Hideout";
        pricePerDay = PRICE_BASIC;
        packageImage = "images/eddies-hideout(l).jfif";
    } else if (score <= 9) {
        packageName = "Symbiote Den";
        pricePerDay = PRICE_STANDARD;
        packageImage = "images/symbiote-den.jfif";
    } else {
        packageName = "Klyntar Fortress";
        pricePerDay = PRICE_PREMIUM;
        packageImage = "images/klyntar-fortress.jfif";
    }

    const total = pricePerDay * days;

    // Show the result on the page
    const resultBox = document.getElementById('result');
    resultBox.innerHTML =
        "<img src='" + packageImage + "' alt='" + packageName + "' class='result-img'>" +
        "<h3>Your lair: " + packageName + "</h3>" +
        "<p>Thanks, " + fullName + ". Here is what you told us:</p>" +
        "<ul>" +
        "<li>Days: " + days + " (" + dayPoints + " pts)</li>" +
        "<li>Group size: " + groupSize + " (" + groupPoints + " pts)</li>" +
        "<li>Security level: " + security + " (" + security + " pts)</li>" +
        "<li>Lair style: " + style + "</li>" +
        "<li>Extras: " + (extraNames.length > 0 ? extraNames.join(", ") : "None") + " (" + extraPoints + " pts)</li>" +
        "</ul>" +
        "<p>Score: " + score + " out of 12. Price per day: RM" + pricePerDay.toFixed(2) + "</p>" +
        "<p class='total mb-0'>Total: RM" + total.toFixed(2) + "</p>";
    resultBox.classList.remove('d-none');
    resultBox.scrollIntoView({ behavior: 'smooth' });

    alert("Recommendation complete!");
    return false; // stay on the page
}
