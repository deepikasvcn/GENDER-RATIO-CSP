// Initialize school records with robust default mock data if empty
let schoolRecords = JSON.parse(localStorage.getItem('cspSchoolRecords')) || [
    { name: "ZPHS Guntur Main", total: 320, boys: 160, girls: 160, attendance: "94%", transfer: "2%", dropout: "1%", summary: "ZPHS Guntur Main demonstrates exemplary gender parity with an equal distribution of male and female students across all academic streams. The institution maintains robust community engagement initiatives that actively encourage female retention in higher secondary grades. Regular health and nutritional support programs have contributed significantly to stable daily attendance records. Academic infrastructure is well-supported by state-sponsored digital classrooms and laboratory facilities. Remedial coaching classes are systematically organized for students needing extra scholastic support. Faculty members actively participate in gender-sensitization workshops to foster an inclusive learning environment. Overall, the school serves as a benchmark for educational equity and rural scholastic development." },
    { name: "M.P.P. School Mangalagiri", total: 210, boys: 110, girls: 100, attendance: "91%", transfer: "3%", dropout: "2%", summary: "M.P.P. School Mangalagiri provides foundational primary education with a strong emphasis on early childhood learning outcomes. The enrollment metrics reflect a healthy gender balance, supported by active parental counseling campaigns. Mid-day meal distribution operates with high standards of hygiene, directly boosting student retention and daily attendance. Special scholarship advisories are regularly communicated to families to promote girl child education. Basic digital literacy tools have been successfully integrated into early grade classrooms. The school collaborates closely with local panchayat committees to address infrastructural needs promptly. Dedicated educators focus on holistic development through co-curricular and sports activities." }
];
localStorage.setItem('cspSchoolRecords', JSON.stringify(schoolRecords));

let isDeveloperMode = false;

// Function to toggle Developer Mode with secure password
function toggleDevMode() {
    if (!isDeveloperMode) {
        let password = prompt("Enter Developer Password:");
        if (password === "MySecretPassword123") {
            isDeveloperMode = true;
            alert("Developer Mode Enabled.");
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
}

// Render School Cards on Dashboard with Search Filter
function renderDashboardSchools(filter = "") {
    const container = document.getElementById('school-list-container');
    if (!container) return;

    container.innerHTML = '';
    
    const filtered = schoolRecords.filter(school => 
        school.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align:center; color: #777;">No schools found matching your search.</p>`;
        return;
    }

    filtered.forEach((school, index) => {
        const actualIndex = schoolRecords.indexOf(school);
        const card = document.createElement('div');
        card.className = 'school-item-card';
        card.innerHTML = `
            <h3>🏫 ${school.name}</h3>
            <p><strong>Total Students:</strong> ${school.total} (Boys: ${school.boys}, Girls: ${school.girls})</p>
            <button class="primary-btn" onclick="openSchoolProfile(${actualIndex})">View Detailed Report →</button>
        `;
        container.appendChild(card);
    });
}

// Search bar handler
function filterSchools() {
    const query = document.getElementById('school-search-input').value;
    renderDashboardSchools(query);
}

// Navigate to detail page with selected school index
function openSchoolProfile(index) {
    localStorage.setItem('activeSchoolIndex', index);
    window.location.href = 'school.html';
}

// Form submission for adding records in Developer Mode
const form = document.getElementById('school-form');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!isDeveloperMode) {
            alert("Developer Mode required to add records.");
            return;
        }

        const name = document.getElementById('school-name').value;
        const total = parseInt(document.getElementById('total-students').value);
        const boys = parseInt(document.getElementById('boys-count').value);
        const girls = parseInt(document.getElementById('girls-count').value);

        if (boys + girls !== total) {
            alert("Total students must equal boys + girls count.");
            return;
        }

        const newSchool = {
            name, total, boys, girls,
            attendance: "92%", transfer: "2%", dropout: "1%",
            summary: `${name} is an active participant in community educational equity tracking. The institution demonstrates consistent enrollment patterns across demographics. Regular scholastic and health monitoring ensures steady student attendance. Faculty members maintain active engagement with parents to sustain low dropout figures. State-backed scholarship schemes are actively disbursed to eligible students. Extracurricular integration supports comprehensive youth development. The school continues to uphold robust standards of inclusive education.`
        };

        schoolRecords.push(newSchool);
        localStorage.setItem('cspSchoolRecords', JSON.stringify(schoolRecords));
        alert("School record added successfully!");
        form.reset();
        renderDashboardSchools();
    });
}

// Initialize School Detail Page if on school.html
function initSchoolProfilePage() {
    const activeIndex = localStorage.getItem('activeSchoolIndex');
    if (activeIndex === null) return;

    const school = schoolRecords[activeIndex];
    if (!school) return;

    document.getElementById('page-school-title').innerText = `📊 ${school.name}`;
    document.getElementById('school-summary-text').innerText = school.summary;
    document.getElementById('metric-attendance').innerText = school.attendance || "93%";
    document.getElementById('metric-transfer').innerText = school.transfer || "2%";
    document.getElementById('metric-dropout').innerText = school.dropout || "1%";
    
    const ratio = ((school.girls / school.boys) * 100).toFixed(1);
    document.getElementById('metric-ratio').innerText = `${ratio} / 100`;

    // Populate Scholarships & Opportunities
    const oppList = document.getElementById('opportunities-list');
    if (oppList) {
        oppList.innerHTML = `
            <li>🎓 <strong>National Means-cum-Merit Scholarship (NMMS):</strong> Financial support for meritorious students entering secondary grades.</li>
            <li>📚 <strong>Jagananna Amma Vodi / State Free Textbook & Uniform Schemes:</strong> Direct benefit transfers and material incentives ensuring zero financial barrier for girl child education.</li>
            <li>🚴 <strong>State Bicycle Distribution Scheme:</strong> Free bicycle provision for girl students residing in outlying rural habitations to improve retention.</li>
            <li>💻 <strong>Digital Literacy & Skill Development Camps:</strong> Special weekend coding and foundational computer training modules.</li>
        `;
    }

    // Render Real Bar Chart
    const ctx = document.getElementById('schoolDetailChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Total Students', 'Boys Enrolled', 'Girls Enrolled'],
                datasets: [{
                    label: 'Count',
                    data: [school.total, school.boys, school.girls],
                    backgroundColor: ['#4f46e5', '#3b82f6', '#ec4899'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

// Individual School Download Report Function
function downloadSchoolReport() {
    const activeIndex = localStorage.getItem('activeSchoolIndex');
    const school = schoolRecords[activeIndex];
    if (!school) return;

    const reportContent = `=== SCHOOL ANALYTIC REPORT ===\n` +
                          `School Name: ${school.name}\n` +
                          `Total Students: ${school.total}\n` +
                          `Boys: ${school.boys} | Girls: ${school.girls}\n` +
                          `Attendance Rate: ${school.attendance || '93%'}\n` +
                          `Transfer Rate: ${school.transfer || '2%'}\n` +
                          `Dropout Rate: ${school.dropout || '1%'}\n` +
                          `Gender Ratio (Girls per 100 Boys): ${((school.girls / school.boys) * 100).toFixed(1)}\n\n` +
                          `=== SUMMARY ===\n${school.summary}\n\n` +
                          `=== SCHEMES & SCHOLARSHIPS ===\n- NMMS Scholarship\n- Amma Vodi / State Support Schemes\n- Free Bicycle Distribution Scheme`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${school.name.replace(/\s+/g, '_')}_Report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Page Router Initialization
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('school-list-container')) {
        renderDashboardSchools();
    }
    if (document.getElementById('school-summary-text')) {
        initSchoolProfilePage();
    }
});