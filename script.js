// Initialize school records from local storage or start with an empty array
let schoolRecords = JSON.parse(localStorage.getItem('cspSchoolRecords')) || [];
let currentActiveSchoolIndex = null;
let isDeveloperMode = false;

const form = document.getElementById('school-form');
let myChart = null;

// Function to handle "Explore School Dashboard" navigation
function showDashboard() {
    const welcomeSection = document.getElementById('welcome-section');
    const dashboardSection = document.getElementById('dashboard-section');

    if (welcomeSection && dashboardSection) {
        welcomeSection.style.display = 'none';
        dashboardSection.style.display = 'block';
    } else {
        // Fallback if sections use class names or page redirection
        console.warn("Dashboard sections not found by ID. Checking alternative navigation...");
    }
}

// Function to toggle Developer Mode with a secure password via button click
function toggleDevMode() {
    //If developer mode is currently OFF, ask for password to turn it ON
    if (!isDeveloperMode) {
        let password = prompt("Enter Developer Password:");
        
        // Change "MySecretPassword123" to your preferred secure password
        if (password === "MySecretPassword123") {
            isDeveloperMode = true;
            alert("Developer Mode Enabled Successfully.");
        } else {
            alert("Incorrect Password! Access Denied.");
            return;
        }
    } else {
        isDeveloperMode = false;
        alert("Developer Mode Disabled.");
    }

    const devFormSection = document.getElementById('developer-form-section');
    if (devFormSection) {
        devFormSection.style.display = isDeveloperMode ? 'block' : 'none';
    }

    const deleteBtn = document.getElementById('detail-delete-btn');
    if (deleteBtn) {
        deleteBtn.style.display = isDeveloperMode ? 'inline-block' : 'none';
    }
}

// Function to display records safely
function displayRecords() {
    const tableBody = document.getElementById('records-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    schoolRecords.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.name}</td>
            <td>${record.total}</td>
            <td>${record.boys}</td>
            <td>${record.girls}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Handle form submission for adding new records
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!isDeveloperMode) {
            alert("Access Denied. Developer Mode required to add records.");
            return;
        }

        const schoolName = document.getElementById('school-name').value;
        const totalStudents = parseInt(document.getElementById('total-students').value);
        const boysCount = parseInt(document.getElementById('boys-count').value);
        const girlsCount = parseInt(document.getElementById('girls-count').value);

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
        displayRecords();
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    displayRecords();
});
function showWelcome() {
    const welcomeSection = document.getElementById('welcome-section');
    const dashboardSection = document.getElementById('dashboard-section');

    if (welcomeSection && dashboardSection) {
        dashboardSection.style.display = 'none';
        welcomeSection.style.display = 'block';
    }
}