document.getElementById("validateAddressBtn").addEventListener("click", function() {
    console.log("Button clicked");

    // Get values from the form
    const country = document.getElementById("country").value;
    const municipality = document.getElementById("municipality").value;
    const address = document.getElementById("address").value;

    // Check if all fields are filled
    if (!country || !municipality || !address) {
        document.getElementById("resultMessage").innerText = "Παρακαλώ συμπληρώστε όλα τα πεδία για τη διεύθυνση.";
        return;
    }

    document.getElementById("resultMessage").innerText = "";

    const fullAddress = `${address}, ${municipality}, ${country}`;
    console.log("Full Address:", fullAddress);

    const xhr = new XMLHttpRequest();
    const addressFields = ["country", "municipality", "address"];

    addressFields.forEach(fieldId => {
        document.getElementById(fieldId).addEventListener("input", function() {

            // Hide the map and clear the iframe
            document.getElementById("mapContainer").style.display = "none";
            document.querySelector("#mapContainer iframe").src = "";
            // You can also disable the button if needed
        });
    });

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log("XHR request completed");
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                console.log("API Response:", response);

                if (response && response.length > 0) {
                    const location = response[0];
                    const latitude = location.lat;
                    const longitude = location.lon;
                    const displayName = location.display_name;

                    if (displayName.includes("Κρήτη") || displayName.includes("Crete")) {
                        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                        document.getElementById("mapContainer").style.display = "block";
                        document.querySelector("#mapContainer iframe").src = `OSM_MAPS.html?lat=${latitude}&lon=${longitude}`;
                        document.getElementById("resultMessage").innerText = "Η διεύθυνση βρέθηκε.";

                        // Set latitude and longitude to hidden input fields
                        document.getElementById("lat").value = latitude;
                        document.getElementById("lon").value = longitude;
                    } else {
                        document.getElementById("resultMessage").innerText = "Η υπηρεσία είναι διαθέσιμη μόνο στην Κρήτη αυτή τη στιγμή.";
                    }
                } else {
                    document.getElementById("resultMessage").innerText = "Η διεύθυνση δεν βρέθηκε. Παρακαλώ ελέγξτε τα στοιχεία σας.";
                }
            } else {
                console.error("Error with the request:", xhr.statusText);
                document.getElementById("resultMessage").innerText = "Προέκυψε σφάλμα κατά την επικοινωνία με τον διακομιστή.";
            }
        }
    };

    const encodedAddress = encodeURIComponent(fullAddress);
    xhr.open("GET", `https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=${encodedAddress}&accept-language=en&polygon_threshold=0.0`);
    xhr.setRequestHeader("x-rapidapi-host", "forward-reverse-geocoding.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "YOUR_RAPIDAPI_KEY_HERE");

    xhr.send(null);
});
