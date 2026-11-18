// Initialize school records from local storage or start with an empty array
let schoolRecords = JSON.parse(localStorage.getItem('cspSchoolRecords')) || [];
let currentActiveSchoolIndex = null;
let isDeveloperMode = false;

const form = document.getElementById('school-form');
let myChart = null;

// Function to toggle Developer Mode with a secure password
function toggleDevMode() {
    const devCheckbox = document.getElementById('dev-mode-checkbox');
    
    // If the user is trying to turn it ON
    if (devCheckbox.checked) {
        let password = prompt("Enter Developer Password:");
        
        // Change "MySecretPassword123" to whatever secret password you prefer!
        if (password === "MySecretPassword123") {
            isDeveloperMode = true;
            alert("Developer Mode Enabled Successfully.");
        } else {
            alert("Incorrect Password! Access Denied.");
            devCheckbox.checked = false; // Uncheck the box automatically
            isDeveloperMode = false;
        }
    } else {
        // Turning it off is open/allowed
        isDeveloperMode = false;
    }

    // Show/hide data input form on dashboard
    const devFormSection = document.getElementById('developer-form-section');
    if (devFormSection) {
        devFormSection.style.display = isDeveloperMode ? 'block' : 'none';
    }

    // Show/hide delete button on detail view if active
    const deleteBtn = document.getElementById('detail-delete-btn');
    if (deleteBtn) {
        deleteBtn.style.display = isDeveloperMode ? 'inline-block' : 'none';
    }
}

// Function to handle form submission for adding new records
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Double check if developer mode is active before allowing saves
        if (!isDeveloperMode) {
            alert("Access Denied. Developer Mode required to add records.");
            return;
        }

        const schoolName = document.getElementById('school-name').value;
        const totalStudents = parseInt(document.getElementById('total-students').value);
        const boysCount = parseInt(document.getElementById('boys-count').value);
        const girlsCount = parseInt(document.getElementById('girls-count').value);

        // Validation check
        if (boysCount + girlsCount !== totalStudents) {
            alert("Error: Total students must equal the sum of boys and girls.");
            return;
        }

        const newRecord = {
            name: schoolName,
            total: totalStudents,
            boys: boysCount,
            girls: girlsCount
        };

        schoolRecords.push(newRecord);
        localStorage.setItem('cspSchoolRecords', JSON.stringify(schoolRecords));
        
        alert("School record added successfully!");
        form.reset();
        
        // Refresh display if functions exist in your project
        if (typeof displayRecords === 'function') {
            displayRecords();
        }
    });
}