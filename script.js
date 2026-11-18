let schoolRecords = JSON.parse(localStorage.getItem('cspSchoolRecords')) || [];
let currentActiveSchoolIndex = null;
let isDeveloperMode = false;

const form = document.getElementById('school-form');
let myChart = null;

// Function to toggle Developer Mode (shows/hides data input form & delete button)
function toggleDevMode() {
    isDeveloperMode = document.getElementById('dev-mode-checkbox').checked;
    
    // Show/hide form on dashboard
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

// Function to switch between views
function switchTab(tabName, schoolIndex = null) {
    const welcomeView = document.getElementById('welcome-view');
    const dashboardView = document.getElementById('dashboard-view');
    const detailView = document.getElementById('school-detail-view');
    
    const navWelcome = document.getElementById('nav-welcome');
    const navDashboard = document.getElementById('nav-dashboard');

    welcomeView.style.display = 'none';
    dashboardView.style.display = 'none';
    detailView.style.display = 'none';
    navWelcome.classList.remove('active');
    navDashboard.classList.remove('active');

    if (tabName === 'welcome') {
        welcomeView.style.display = 'block';
        navWelcome.classList.add('active');
    } else if (tabName === 'dashboard') {
        dashboardView.style.display = 'block';
        navDashboard.classList.add('active');
        updateDashboard();
    } else if (tabName === 'detail' && schoolIndex !== null) {
        currentActiveSchoolIndex = schoolIndex;
        detailView.style.display = 'block';
        loadSchoolDetails(schoolIndex);
    }
    window.scrollTo(0, 0);
}

// Update dashboard metrics and render interactive school cards
function updateDashboard() {
    let totalBoys = 0;
    let totalGirls = 0;
    let totalDropouts = 0;
    const listContainer = document.getElementById('school-list-container');
    listContainer.innerHTML = '';

    if (schoolRecords.length === 0) {
        listContainer.innerHTML = '<p style="color: #D3C5BC;">No schools registered yet. Toggle <b>Developer Mode</b> above to add survey data records.</p>';
    }

    schoolRecords.forEach((record, index) => {
        totalBoys += record.boys;
        totalGirls += record.girls;
        totalDropouts += (record.boysDropouts + record.girlsDropouts);

        const cardItem = document.createElement('div');
        cardItem.className = 'school-card-item';
        cardItem.onclick = () => switchTab('detail', index);
        cardItem.innerHTML = `
            <h3>🏫 ${record.school}</h3>
            <p>📍 Village: ${record.village}</p>
            <p>👥 Total Enrolled: ${record.boys + record.girls} Students</p>
        `;
        listContainer.appendChild(cardItem);
    });

    document.getElementById('total-boys').innerText = totalBoys;
    document.getElementById('total-girls').innerText = totalGirls;
    document.getElementById('total-students').innerText = totalBoys + totalGirls;
    document.getElementById('total-dropouts').innerText = totalDropouts;
    document.getElementById('total-schools').innerText = schoolRecords.length;

    renderChart();
}

// Rich School Detail View Generation
function loadSchoolDetails(index) {
    const record = schoolRecords[index];
    if (!record) return;

    document.getElementById('detail-school-title').innerText = record.school;
    document.getElementById('detail-village-subtitle').innerText = `Village Location: ${record.village}`;
    document.getElementById('det-boys').innerText = record.boys;
    document.getElementById('det-girls').innerText = record.girls;
    document.getElementById('det-total').innerText = record.boys + record.girls;

    document.getElementById('det-b-att').innerText = record.boysAttendance;
    document.getElementById('det-g-att').innerText = record.girlsAttendance;
    document.getElementById('det-b-drop').innerText = record.boysDropouts;
    document.getElementById('det-g-drop').innerText = record.girlsDropouts;

    const totalStudents = record.boys + record.girls;
    const totalDrops = record.boysDropouts + record.girlsDropouts;
    const totalWithDrops = totalStudents + totalDrops;
    const dropoutRate = totalWithDrops > 0 ? ((totalDrops / totalWithDrops) * 100).toFixed(1) + '%' : '0%';
    document.getElementById('det-drop-rate').innerText = dropoutRate;

    // Narrative Description & Equal Opportunities Analysis
    const narrativeElement = document.getElementById('school-narrative-description');
    let equalityCommentary = "";
    if (record.girls > record.boys) {
        equalityCommentary = "Female student enrollment exceeds male student enrollment at this institution, demonstrating strong engagement in schooling.";
    } else if (record.girls < record.boys) {
        equalityCommentary = "Male student enrollment is currently higher than female enrollment, indicating a need to focus on encouraging female participation and retention.";
    } else {
        equalityCommentary = "This institution exhibits a perfectly balanced 1:1 numerical parity between male and female student enrollments.";
    }

    narrativeElement.innerHTML = `
        This school survey report for <strong>${record.school}</strong> located in <strong>${record.village}</strong> evaluates community educational trends. 
        Out of a total student population of <strong>${totalStudents}</strong>, there are <strong>${record.boys} boys</strong> and <strong>${record.girls} girls</strong> registered. 
        ${equalityCommentary} Furthermore, daily attendance metrics (Boys: <strong>${record.boysAttendance}%</strong>, Girls: <strong>${record.girlsAttendance}%</strong>) 
        help monitor whether equal educational opportunities are actively maintained throughout the academic term.
    `;

    // Advanced Gender Ratio Calculation & Step-by-Step Breakdown
    const ratio = record.boys > 0 ? ((record.girls / record.boys) * 100).toFixed(2) : '0.00';
    
    const breakdownHTML = `
        <p><strong>Step-by-Step Formula Application:</strong></p>
        <ul style="margin: 5px 0 15px 20px; line-height: 1.6;">
            <li>Number of Enrolled Girls ($G$) = ${record.girls}</li>
            <li>Number of Enrolled Boys ($B$) = ${record.boys}</li>
            <li>Division Step: $\\frac{G}{B} = \\frac{${record.girls}}{${record.boys}} = ${(record.boys > 0 ? (record.girls / record.boys).toFixed(4) : 0)}$</li>
            <li>Multiplication Step: ${ (record.boys > 0 ? (record.girls / record.boys).toFixed(4) : 0) } $\\times 100 = $ <strong>${ratio}</strong></li>
        </ul>
        <p>This means for every 100 boys enrolled at ${record.school}, there are approximately <strong>${ratio} girls</strong> actively pursuing education.</p>
    `;
    document.getElementById('detailed-breakdown-explanation').innerHTML = breakdownHTML;

    // Equity Status Badge Evaluation
    const badgeElement = document.getElementById('equity-status-badge');
    let badgeText = "";
    if (ratio >= 95 && ratio <= 105) {
        badgeText = `🟢 Excellent Parity: ${ratio} Girls per 100 Boys (Balanced Educational Opportunity)`;
    } else if (ratio > 105) {
        badgeText = `🔵 Female-Leaning Ratio: ${ratio} Girls per 100 Boys`;
    } else {
        badgeText = `🟠 Male-Leaning Ratio: ${ratio} Girls per 100 Boys (Requires Equity Focus)`;
    }
    badgeElement.innerText = badgeText;

    // Developer delete button configuration
    const deleteBtn = document.getElementById('detail-delete-btn');
    deleteBtn.onclick = () => deleteRecord(index);
    deleteBtn.style.display = isDeveloperMode ? 'inline-block' : 'none';
}

// Developer record deletion
function deleteRecord(index) {
    if (confirm("Are you sure you want to permanently delete this school record? [Developer Restricted Action]")) {
        schoolRecords.splice(index, 1);
        localStorage.setItem('cspSchoolRecords', JSON.stringify(schoolRecords));
        switchTab('dashboard');
    }
}

// Form submission handler (Developer Only)
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const village = document.getElementById('village-name').value.trim();
    const school = document.getElementById('school-name').value.trim();
    const boys = parseInt(document.getElementById('boys-count').value);
    const girls = parseInt(document.getElementById('girls-count').value);
    const boysAttendance = parseFloat(document.getElementById('boys-attendance').value);
    const girlsAttendance = parseFloat(document.getElementById('girls-attendance').value);
    const boysDropouts = parseInt(document.getElementById('boys-dropouts').value);
    const girlsDropouts = parseInt(document.getElementById('girls-dropouts').value);

    schoolRecords.push({ 
        village, 
        school, 
        boys, 
        girls, 
        boysAttendance, 
        girlsAttendance, 
        boysDropouts, 
        girlsDropouts 
    });
    
    localStorage.setItem('cspSchoolRecords', JSON.stringify(schoolRecords));
    updateDashboard();
    form.reset();
    alert("School record added successfully!");
});

// Render Chart.js
function renderChart() {
    const ctx = document.getElementById('enrollmentChart');
    if (!ctx) return;

    const labels = schoolRecords.map(r => `${r.school} (${r.village})`);
    const boysData = schoolRecords.map(r => r.boys);
    const girlsData = schoolRecords.map(r => r.girls);

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.length > 0 ? labels : ['No Data Added'],
            datasets: [
                {
                    label: 'Boys Enrolled',
                    data: labels.length > 0 ? boysData : [0],
                    backgroundColor: '#D4A373'
                },
                {
                    label: 'Girls Enrolled',
                    data: labels.length > 0 ? girlsData : [0],
                    backgroundColor: '#8E5572'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: '#4A574C' }, ticks: { color: '#F4ECE1' } },
                x: { grid: { color: '#4A574C' }, ticks: { color: '#F4ECE1' } }
            },
            plugins: {
                legend: { labels: { color: '#F4ECE1' } }
            }
        }
    });
}

// Download report for individual school
function downloadSingleSchoolCSV() {
    if (currentActiveSchoolIndex === null) return;
    const r = schoolRecords[currentActiveSchoolIndex];
    
    let csvContent = "data:text/csv;charset=utf-8,Village,School,Boys,Girls,Total,Boys Attendance,Girls Attendance,Boys Dropouts,Girls Dropouts\n";
    const total = r.boys + r.girls;
    csvContent += `"${r.village}","${r.school}",${r.boys},${r.girls},${total},${r.boysAttendance}%,${r.girlsAttendance}%,${r.boysDropouts},${r.girlsDropouts}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${r.school.replace(/\s+/g, '_')}_detailed_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

updateDashboard();