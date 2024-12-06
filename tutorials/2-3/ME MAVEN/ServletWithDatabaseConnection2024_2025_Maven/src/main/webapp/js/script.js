document.getElementById("togglePassword").addEventListener("click", function(){
    const passwordField = document.getElementById("password");
    if(passwordField.type === "password"){
        passwordField.type = "text";
        this.textContent = "Hide Password";
    }
    else{
        passwordField.type = "password";
        this.textContent = "Show Password"
    }

});

document.getElementById("toggleConfirmPassword").addEventListener("click", function(){
    const passwordField = document.getElementById("confirm_password");
    if(passwordField.type === "password"){
        passwordField.type = "text";
        this.textContent = "Hide Password";
    }
    else{
        passwordField.type = "password";
        this.textContent = "Show confirmation"
    }

});

// Username availability check
document.getElementById("username").addEventListener("blur", function() {
    const username = this.value;
    const message = document.getElementById("usernameMessage");
    const submitButton = document.getElementById("submit");

    if (username.length < 8) {
        message.textContent = "Το username πρέπει να έχει τουλάχιστον 8 χαρακτήρες.";
        message.style.color = "red";
        submitButton.disabled = true;
        return;
    }

    // AJAX request to check username availability using NewServlet
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "NewServlet", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            if (xhr.responseText === "available") {
                message.textContent = "Το username είναι διαθέσιμο.";
                message.style.color = "green";
                submitButton.disabled = false;
            } else {
                message.textContent = "Το username δεν είναι διαθέσιμο.";
                message.style.color = "red";
                submitButton.disabled = true;
            }
        }
    };
    xhr.send("username_check=true&username=" + encodeURIComponent(username));
});

// ... rest of the script.js code remains the same ...

// Password Strength and Validation
document.getElementById("password").addEventListener("input", function() {
    const password = this.value;
    const message = document.getElementById("passwordMessage");
    const submitButton = document.getElementById("submit");
    const forbiddenWords = ["fire", "fotia", "ethelontis", "volunteer"];
    let lowerCasePassword = password.toLowerCase();
    let containsForbiddenWord = false;

    // Check for forbidden words using a for loop
    for (let i = 0; i < forbiddenWords.length; i++) {
        if (lowerCasePassword.includes(forbiddenWords[i])) {
            containsForbiddenWord = true;
            break;
        }
    }

    if (containsForbiddenWord) {
        message.textContent = "Password contains forbidden words like fire, fotia, ethelontis, volunteer!";
        message.style.color = "red";
        submitButton.disabled = true;
        return;
    }

    // Count numbers using a for loop
    let numCount = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charAt(i);
        if (char >= '0' && char <= '9') {
            numCount++;
        }
    }

    if (numCount >= password.length / 2) {
        message.textContent = "Weak password: Too many numbers.";
        message.style.color = "orange";
        submitButton.disabled = true;
        return;
    }

    // Count character occurrences using a for loop
    let charCounts = {};
    let maxCharCount = 0;

    for (let i = 0; i < password.length; i++) {
        const char = password.charAt(i);
        if (charCounts[char]) {
            charCounts[char]++;
        } else {
            charCounts[char] = 1;
        }

        if (charCounts[char] > maxCharCount) {
            maxCharCount = charCounts[char];
        }
    }

    if (maxCharCount >= password.length / 2) {
        message.textContent = "Weak password: Too many repeated characters.";
        message.style.color = "orange";
        submitButton.disabled = true;
        return;
    }

    // Check character types using a for loop
    let hasUppercase = false;
    let hasLowercase = false;
    let hasNumber = false;
    let hasSymbol = false;
    const symbols = "#$%&*!?^";

    for (let i = 0; i < password.length; i++) {
        const char = password.charAt(i);

        if (char >= 'A' && char <= 'Z') {
            hasUppercase = true;
        } else if (char >= 'a' && char <= 'z') {
            hasLowercase = true;
        } else if (char >= '0' && char <= '9') {
            hasNumber = true;
        } else if (symbols.includes(char)) {
            hasSymbol = true;
        }

        // If all conditions are met, exit the loop early
        if (hasUppercase && hasLowercase && hasNumber && hasSymbol) {
            break;
        }
    }

    if (hasUppercase && hasLowercase && hasNumber && hasSymbol) {
        message.textContent = "Strong password!";
        message.style.color = "green";
        submitButton.disabled = false;
    } else {
        message.textContent = "Medium password!";
        message.style.color = "blue";
        submitButton.disabled = false;
    }
});

// Check if passwords match
document.getElementById("confirm_password").addEventListener("input", function() {
    const password = document.getElementById("password").value;
    const confirmPassword = this.value;
    const message = document.getElementById("confirmPasswordMessage");
    const submitButton = document.getElementById("submit");

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match!";
        message.style.color = "red";
        submitButton.disabled = true;
    } else {
        message.textContent = "Passwords match.";
        message.style.color = "green";
        submitButton.disabled = false;
    }
});

// Show/hide extra fields based on user type
document.getElementById("type").addEventListener("change", function() {
    const volunteerFields = document.getElementById("volunteerFields");
    const agreementLabel = document.getElementById("agreementLabel");
    const userType = this.value;

    if (userType === "Εθελοντής Πυροσβέστης") {
        volunteerFields.style.display = "block";
        agreementLabel.textContent = "Απαγορεύεται η άσκοπη χρήση της εφαρμογής. Δηλώνω υπεύθυνα ότι ανήκω στο ενεργό δυναμικό των εθελοντών πυροσβεστών.";
    } else {
        volunteerFields.style.display = "none";
        agreementLabel.textContent = "Απαγορεύεται η άσκοπη χρήση της εφαρμογής. Συμφωνώ πως η άσκοπη χρήση της θα διώκεται ποινικά.";
    }
});

// Form submission handler
document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting

    const userType = document.getElementById("type").value;

    // Age validation for volunteer firefighters
    if (userType === "Εθελοντής Πυροσβέστης") {
        const birthdate = document.getElementById("birthdate").value;
        const age = calculateAge(birthdate);
        if (age < 18 || age > 55) {
            alert("Η ηλικία του εθελοντή πυροσβέστη πρέπει να είναι μεταξύ 18 και 55 ετών.");
            return;
        }
    }

    // Collect form data
    const formData = new FormData(this);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Display form data as JSON
    const resultDiv = document.getElementById("result");
    resultDiv.textContent = JSON.stringify(data, null, 2);
    resultDiv.style.display = "block";
});

// Function to calculate age
function calculateAge(birthdate) {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}