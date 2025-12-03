// Farm and Orchard Management System JavaScript

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Initialize charts
    initializeCharts();
    
    // Initialize weather data
    initializeWeatherData();
    
    // Initialize inventory tabs
    initializeInventoryTabs();

    // Initialize admin auth / panel depending on page
    initializeAdminRouting();

    // Initialize button handlers
    initializeActionButtons();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Hero section functions
function showDashboard() {
    document.getElementById('dashboard').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Chart initialization
let yieldChartInstance;
let revenueChartInstance;
let costChartInstance;
let yieldComparisonChartInstance;

function getChartSettings() {
    const stored = localStorage.getItem('farmChartSettings');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            // ignore
        }
    }
    return {
        yieldType: 'line',
        revenueType: 'bar',
        costScenario: 'baseline',
        yieldScenario: 'normal'
    };
}

function initializeCharts() {
    const settings = getChartSettings();

    // Yield Prediction Chart
    const yieldCtx = document.getElementById('yieldChart');
    if (yieldCtx) {
        if (yieldChartInstance) yieldChartInstance.destroy();
        const isArea = settings.yieldType === 'area';
        yieldChartInstance = new Chart(yieldCtx, {
            type: isArea ? 'line' : settings.yieldType,
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Expected Yield (tons)',
                    data: [12, 19, 3, 5, 2, 3, 8, 15, 25, 30, 28, 20],
                    borderColor: '#2d7d32',
                    backgroundColor: isArea ? 'rgba(45, 125, 50, 0.25)' : 'rgba(45, 125, 50, 0.1)',
                    tension: 0.4,
                    fill: isArea
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }
            }
        });
    }

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        if (revenueChartInstance) revenueChartInstance.destroy();
        revenueChartInstance = new Chart(revenueCtx, {
            type: settings.revenueType || 'bar',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [{
                    label: 'Revenue ($)',
                    data: [25000, 35000, 40000, 30000],
                    backgroundColor: settings.revenueType === 'line' ? 'rgba(45, 125, 50, 0.15)' : '#2d7d32',
                    borderColor: '#2d7d32',
                    borderWidth: 2,
                    borderRadius: settings.revenueType === 'bar' ? 8 : 0,
                    fill: settings.revenueType === 'line'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 1.5,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }
            }
        });
    }

    // Cost Chart
    const costCtx = document.getElementById('costChart');
    if (costCtx) {
        if (costChartInstance) costChartInstance.destroy();
        const costData = getCostScenarioData(settings.costScenario || 'baseline');
        costChartInstance = new Chart(costCtx, {
            type: 'doughnut',
            data: {
                labels: ['Labor', 'Seeds', 'Fertilizer', 'Equipment', 'Other'],
                datasets: [{
                    data: costData,
                    backgroundColor: [
                        '#2d7d32',
                        '#4caf50',
                        '#66bb6a',
                        '#81c784',
                        '#a5d6a7'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 1,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    // Yield Comparison Chart
    const yieldComparisonCtx = document.getElementById('yieldComparisonChart');
    if (yieldComparisonCtx) {
        if (yieldComparisonChartInstance) yieldComparisonChartInstance.destroy();
        const { currentYear, previousYear } = getYieldScenarioData(settings.yieldScenario || 'normal');
        yieldComparisonChartInstance = new Chart(yieldComparisonCtx, {
            type: 'radar',
            data: {
                labels: ['Corn', 'Wheat', 'Soybeans', 'Tomatoes', 'Apples'],
                datasets: [{
                    label: 'Current Year',
                    data: currentYear,
                    borderColor: '#2d7d32',
                    backgroundColor: 'rgba(45, 125, 50, 0.2)',
                    pointBackgroundColor: '#2d7d32'
                }, {
                    label: 'Previous Year',
                    data: previousYear,
                    borderColor: '#ffa726',
                    backgroundColor: 'rgba(255, 167, 38, 0.2)',
                    pointBackgroundColor: '#ffa726'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 1,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }
}

function getCostScenarioData(scenario) {
    switch (scenario) {
        case 'fertilizerIncrease':
            return [25, 18, 30, 17, 10]; // more cost in fertilizer
        case 'laborIncrease':
            return [40, 15, 15, 20, 10]; // more cost in labor
        case 'baseline':
        default:
            return [30, 20, 15, 25, 10];
    }
}

function getYieldScenarioData(scenario) {
    switch (scenario) {
        case 'drought':
            return {
                currentYear: [55, 45, 40, 60, 50],
                previousYear: [75, 65, 55, 80, 70]
            };
        case 'bumper':
            return {
                currentYear: [95, 90, 85, 98, 92],
                previousYear: [85, 70, 60, 90, 75]
            };
        case 'normal':
        default:
            return {
                currentYear: [85, 70, 60, 90, 75],
                previousYear: [75, 65, 55, 80, 70]
            };
    }
}

// Weather data initialization
function initializeWeatherData() {
    // Simulate real-time weather updates
    updateWeatherData();
    setInterval(updateWeatherData, 300000); // Update every 5 minutes
}

function updateWeatherData() {
    // Simulate weather data updates
    const temperature = document.querySelector('.temperature');
    const condition = document.querySelector('.condition');
    
    if (temperature && condition) {
        // Simulate temperature variation
        const baseTemp = 24;
        const variation = Math.floor(Math.random() * 6) - 3;
        const newTemp = baseTemp + variation;
        
        temperature.textContent = `${newTemp}°C`;
        
        // Simulate condition changes
        const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        condition.textContent = randomCondition;
    }
}

// Inventory tab functionality
function initializeInventoryTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.inventory-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.textContent.toLowerCase().replace(' ', '');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

function showInventoryTab(tabName) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.inventory-content');
    
    // Remove active class from all buttons and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to target tab
    const targetButton = Array.from(tabButtons).find(btn => 
        btn.textContent.toLowerCase().includes(tabName)
    );
    const targetContent = document.getElementById(tabName);
    
    if (targetButton) targetButton.classList.add('active');
    if (targetContent) targetContent.classList.add('active');
}

// Real-time data simulation
function simulateRealTimeData() {
    // Update soil moisture levels
    const moistureBars = document.querySelectorAll('.moisture-fill');
    moistureBars.forEach(bar => {
        const currentWidth = parseInt(bar.style.width);
        const variation = Math.floor(Math.random() * 6) - 3;
        const newWidth = Math.max(20, Math.min(100, currentWidth + variation));
        bar.style.width = `${newWidth}%`;
        
        // Update percentage text
        const percentageElement = bar.parentElement.nextElementSibling;
        if (percentageElement) {
            percentageElement.textContent = `${newWidth}%`;
        }
    });
    
    // Update field status
    updateFieldStatus();
}

function updateFieldStatus() {
    const statusValues = document.querySelectorAll('.status-value');
    const statuses = [
        { class: 'healthy', text: 'Healthy' },
        { class: 'warning', text: 'Needs Water' },
        { class: 'healthy', text: 'Ready for Harvest' },
        { class: 'warning', text: 'Pest Alert' }
    ];
    
    statusValues.forEach((status, index) => {
        if (Math.random() < 0.1) { // 10% chance to change status
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            status.className = `status-value ${randomStatus.class}`;
            status.textContent = randomStatus.text;
        }
    });
}

// Initialize real-time updates
setInterval(simulateRealTimeData, 10000); // Update every 10 seconds

// Add new activity function
function addActivity(title, icon) {
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        const newActivity = document.createElement('div');
        newActivity.className = 'activity-item';
        newActivity.innerHTML = `
            <i class="fas ${icon}"></i>
            <div class="activity-content">
                <span class="activity-title">${title}</span>
                <span class="activity-time">Just now</span>
            </div>
        `;
        activityList.insertBefore(newActivity, activityList.firstChild);
        
        // Remove oldest activity if more than 5
        const activities = activityList.querySelectorAll('.activity-item');
        if (activities.length > 5) {
            activities[activities.length - 1].remove();
        }
    }
}

// Simulate random activities
function simulateActivities() {
    const activities = [
        { title: 'Soil test completed in Field A', icon: 'fa-flask' },
        { title: 'Irrigation system maintenance', icon: 'fa-tools' },
        { title: 'New crop planted in Field B', icon: 'fa-seedling' },
        { title: 'Weather alert received', icon: 'fa-exclamation-triangle' },
        { title: 'Harvest recorded for tomatoes', icon: 'fa-apple-alt' }
    ];
    
    if (Math.random() < 0.3) { // 30% chance to add new activity
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        addActivity(randomActivity.title, randomActivity.icon);
    }
}

// Initialize activity simulation
setInterval(simulateActivities, 30000); // Check every 30 seconds

// Export data functionality
function exportData(type) {
    const data = {
        timestamp: new Date().toISOString(),
        type: type,
        data: generateExportData(type)
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farm-data-${type}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generateExportData(type) {
    switch(type) {
        case 'crops':
            return {
                fields: [
                    { name: 'Field A', crop: 'Corn', status: 'Growing', plantingDate: '2025-03-15' },
                    { name: 'Field B', crop: 'Wheat', status: 'Harvested', plantingDate: '2025-02-01' },
                    { name: 'Field C', crop: 'Soybeans', status: 'Planting', plantingDate: '2025-04-01' }
                ]
            };
        case 'inventory':
            return {
                items: [
                    { name: 'Corn Seeds', quantity: 15, status: 'Low Stock' },
                    { name: 'Fertilizer', quantity: 50, status: 'Good Stock' },
                    { name: 'Equipment', quantity: 8, status: 'Maintenance Due' }
                ]
            };
        case 'analytics':
            return {
                revenue: 125400,
                costs: 78200,
                profit: 47200,
                roi: 60.4
            };
        default:
            return {};
    }
}

// ---------- Modal helpers ----------
function openModal(title, bodyHtml) {
    const modal = document.getElementById('app-modal');
    const titleEl = document.getElementById('app-modal-title');
    const bodyEl = document.getElementById('app-modal-body');

    if (!modal || !titleEl || !bodyEl) return;

    titleEl.textContent = title;
    bodyEl.innerHTML = bodyHtml;
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('app-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking on backdrop
document.addEventListener('click', (e) => {
    const modal = document.getElementById('app-modal');
    if (!modal) return;
    if (e.target.classList.contains('app-modal-backdrop')) {
        closeModal();
    }
});

// ---------- Button handlers ----------
function initializeActionButtons() {
    // Crop action buttons
    document.querySelectorAll('.crop-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const crop = btn.dataset.crop || 'Crop';
            handleCropAction(action, crop);
        });
    });

    // Inventory reorder buttons
    document.querySelectorAll('.inventory-reorder-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.dataset.item || 'Item';
            const body = `
                <p>You are creating a reorder request for <strong>${item}</strong>.</p>
                <form onsubmit="event.preventDefault(); closeModal();">
                    <div class="form-group">
                        <label>Requested Quantity</label>
                        <input type="number" min="1" value="10" required>
                    </div>
                    <div class="form-group">
                        <label>Target Delivery Date</label>
                        <input type="date" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit Reorder Request</button>
                </form>
            `;
            openModal('Reorder Inventory', body);
        });
    });

    // Equipment maintenance buttons
    document.querySelectorAll('.equipment-maintenance-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const equipment = btn.dataset.equipment || 'Equipment';
            const body = `
                <p>Log maintenance for <strong>${equipment}</strong>.</p>
                <form onsubmit="event.preventDefault(); closeModal();">
                    <div class="form-group">
                        <label>Maintenance Performed</label>
                        <input type="text" placeholder="Oil change, filter replacement..." required>
                    </div>
                    <div class="form-group">
                        <label>Technician / Staff</label>
                        <input type="text" required>
                    </div>
                    <div class="form-group">
                        <label>Next Service Date</label>
                        <input type="date" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Maintenance Log</button>
                </form>
            `;
            openModal('Equipment Maintenance', body);
        });
    });
}

function handleCropAction(action, crop) {
    switch (action) {
        case 'view-details':
            openModal(
                `${crop} - Details`,
                `<p>This panel summarizes the latest information for <strong>${crop}</strong>.</p>
                 <ul>
                    <li>Health status, growth stage, and soil moisture.</li>
                    <li>Last field operations and upcoming tasks.</li>
                    <li>Yield expectations based on current conditions.</li>
                 </ul>`
            );
            break;
        case 'add-note':
            openModal(
                `${crop} - Add Note`,
                `<form onsubmit="event.preventDefault(); closeModal();">
                    <div class="form-group">
                        <label>Field Note</label>
                        <textarea rows="4" placeholder="Scouting notes, issues observed, actions taken..." required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Note</button>
                 </form>`
            );
            break;
        case 'schedule-spray':
            openModal(
                `${crop} - Schedule Spray`,
                `<form onsubmit="event.preventDefault(); closeModal();">
                    <div class="form-group">
                        <label>Product</label>
                        <input type="text" placeholder="Fungicide / Insecticide / Foliar feed" required>
                    </div>
                    <div class="form-group">
                        <label>Application Date</label>
                        <input type="date" required>
                    </div>
                    <div class="form-group">
                        <label>Notes</label>
                        <textarea rows="3" placeholder="Rates, safety notes, weather conditions"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Schedule Application</button>
                 </form>`
            );
            break;
        case 'record-harvest':
            openModal(
                `${crop} - Record Harvest`,
                `<form onsubmit="event.preventDefault(); closeModal();">
                    <div class="form-group">
                        <label>Harvest Date</label>
                        <input type="date" required>
                    </div>
                    <div class="form-group">
                        <label>Quantity Harvested (kg / lbs)</label>
                        <input type="number" min="0" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label>Quality Notes</label>
                        <textarea rows="3" placeholder="Grade, size, defects"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Harvest Record</button>
                 </form>`
            );
            break;
        default:
            openModal(crop, '<p>No action defined.</p>');
    }
}

// ---------- Admin portal / routing ----------
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

const ADMIN_AUTH_KEY = 'farmAdminAuthenticated';
const DASH_VIS_KEY = 'farmDashboardVisibility';
const METRICS_KEY = 'farmMetrics';
const INVENTORY_KEY = 'farmInventoryItems';
const ACTIVITIES_KEY = 'farmAdminActivities';
const CHARTS_KEY = 'farmChartSettings';
const CONTENT_KEY = 'farmContentSettings';

function initializeAdminRouting() {
    const path = window.location.pathname.toLowerCase();
    const isAdminPage = path.endsWith('admin.html');

    if (isAdminPage) {
        // Protect admin page
        const authed = localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
        if (!authed) {
            window.location.href = 'index.html#admin';
            return;
        }
        initializeAdminPanel();
        applyDashboardVisibilityPreview();
        loadAdminMetricsForm();
        loadAdminContentForm();
        initializeAdminLogout();
    } else {
        initializeAdminLogin();
        applyDashboardVisibilityToMain();
        applyMetricsToMain();
        applyContentToMain();
        applyAdminInventoryToMain();
        applyAdminActivitiesToMain();
    }
}

function initializeAdminLogin() {
    const loginForm = document.getElementById('admin-login-form');
    const loginError = document.getElementById('admin-login-error');
    const adminLogin = document.getElementById('admin-login');
    if (!loginForm || !adminLogin) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('admin-username').value.trim();
        const password = document.getElementById('admin-password').value.trim();

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            localStorage.setItem(ADMIN_AUTH_KEY, 'true');
            if (loginError) loginError.style.display = 'none';
            window.location.href = 'admin.html';
        } else {
            if (loginError) loginError.style.display = 'block';
        }
    });
}

function initializeAdminLogout() {
    const logoutBtn = document.getElementById('admin-logout');
    if (!logoutBtn) return;
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem(ADMIN_AUTH_KEY);
        window.location.href = 'index.html';
    });
}

function initializeAdminPanel() {
    // Dashboard visibility toggles -> save to localStorage
    document.querySelectorAll('.admin-toggle').forEach(toggle => {
        toggle.addEventListener('change', () => {
            const key = toggle.dataset.key;
            if (!key) return;
            const settings = getDashboardVisibilitySettings();
            settings[key] = toggle.checked;
            localStorage.setItem(DASH_VIS_KEY, JSON.stringify(settings));
            applyDashboardVisibilityPreview();
        });
    });

    // Chart settings
    const chartsForm = document.getElementById('admin-charts-form');
    if (chartsForm) {
        // preload from storage
        const current = getChartSettings();
        const yieldType = document.getElementById('chart-yield-type');
        const revenueType = document.getElementById('chart-revenue-type');
        const costScenario = document.getElementById('chart-cost-scenario');
        const yieldScenario = document.getElementById('chart-yield-scenario');
        if (yieldType && current.yieldType) yieldType.value = current.yieldType === 'line' || current.yieldType === 'bar' ? current.yieldType : 'area';
        if (revenueType && current.revenueType) revenueType.value = current.revenueType;
        if (costScenario && current.costScenario) costScenario.value = current.costScenario;
        if (yieldScenario && current.yieldScenario) yieldScenario.value = current.yieldScenario;

        chartsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newSettings = {
                yieldType: yieldType ? yieldType.value : 'line',
                revenueType: revenueType ? revenueType.value : 'bar',
                costScenario: costScenario ? costScenario.value : 'baseline',
                yieldScenario: yieldScenario ? yieldScenario.value : 'normal'
            };
            localStorage.setItem(CHARTS_KEY, JSON.stringify(newSettings));
        });
    }

    // Inventory data entry (store in localStorage)
    const invForm = document.getElementById('admin-inventory-form');
    if (invForm) {
        invForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const category = document.getElementById('inv-category').value;
            const name = document.getElementById('inv-name').value.trim();
            const quantity = document.getElementById('inv-quantity').value.trim();
            const status = document.getElementById('inv-status').value.trim();
            if (!category || !name) return;

            const items = getStoredInventoryItems();
            items.push({
                id: Date.now(),
                category,
                name,
                quantity,
                status,
                added: new Date().toISOString()
            });
            localStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
            invForm.reset();
        });
    }

    // Metrics update (store in localStorage)
    const metricsForm = document.getElementById('admin-metrics-form');
    if (metricsForm) {
        metricsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const revenue = document.getElementById('metric-revenue').value;
            const costs = document.getElementById('metric-costs').value;
            const profit = document.getElementById('metric-profit').value;
            const roi = document.getElementById('metric-roi').value;

            const metrics = { revenue, costs, profit, roi };
            localStorage.setItem(METRICS_KEY, JSON.stringify(metrics));
        });
    }

    // Activity log (store in localStorage)
    const activityForm = document.getElementById('admin-activity-form');
    if (activityForm) {
        activityForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('activity-title').value.trim();
            const icon = document.getElementById('activity-icon').value;
            if (!title) return;
            const activities = getStoredActivities();
            activities.unshift({
                id: Date.now(),
                title,
                icon
            });
            localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
            activityForm.reset();
        });
    }
}

// ----- Shared helpers for dashboard visibility & metrics -----
function getDashboardVisibilitySettings() {
    const stored = localStorage.getItem(DASH_VIS_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            // ignore parse errors
        }
    }
    return {
        yield: true,
        revenue: true,
        cost: true,
        yieldComparison: true
    };
}

function applyDashboardVisibilityPreview() {
    const settings = getDashboardVisibilitySettings();
    document.querySelectorAll('.admin-toggle').forEach(toggle => {
        const key = toggle.dataset.key;
        if (!key) return;
        toggle.checked = settings[key] !== false;
    });
}

function applyDashboardVisibilityToMain() {
    const settings = getDashboardVisibilitySettings();
    const map = {
        yield: 'yield-card',
        revenue: 'revenue-card',
        cost: 'cost-card',
        yieldComparison: 'yield-comparison-card'
    };
    Object.keys(map).forEach(key => {
        const id = map[key];
        const el = document.getElementById(id);
        if (el) {
            el.style.display = settings[key] === false ? 'none' : '';
        }
    });
}

function applyMetricsToMain() {
    const stored = localStorage.getItem(METRICS_KEY);
    if (!stored) return;
    let metrics;
    try {
        metrics = JSON.parse(stored);
    } catch {
        return;
    }
    if (!metrics) return;

    const metricValues = document.querySelectorAll('.metrics-grid .metric-item .metric-value');
    if (metricValues.length >= 4) {
        if (metrics.revenue !== undefined) metricValues[0].textContent = `$${Number(metrics.revenue).toLocaleString()}`;
        if (metrics.costs !== undefined) metricValues[1].textContent = `$${Number(metrics.costs).toLocaleString()}`;
        if (metrics.profit !== undefined) metricValues[2].textContent = `$${Number(metrics.profit).toLocaleString()}`;
        if (metrics.roi !== undefined) metricValues[3].textContent = `${metrics.roi}%`;
    }
}

function loadAdminMetricsForm() {
    const stored = localStorage.getItem(METRICS_KEY);
    if (!stored) return;
    let metrics;
    try {
        metrics = JSON.parse(stored);
    } catch {
        return;
    }
    if (!metrics) return;
    const revenue = document.getElementById('metric-revenue');
    const costs = document.getElementById('metric-costs');
    const profit = document.getElementById('metric-profit');
    const roi = document.getElementById('metric-roi');
    if (revenue && metrics.revenue !== undefined) revenue.value = metrics.revenue;
    if (costs && metrics.costs !== undefined) costs.value = metrics.costs;
    if (profit && metrics.profit !== undefined) profit.value = metrics.profit;
    if (roi && metrics.roi !== undefined) roi.value = metrics.roi;
}

// ----- Editable content -----
function getContentSettings() {
    const stored = localStorage.getItem(CONTENT_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            // ignore
        }
    }
    return {};
}

function applyContentToMain() {
    const content = getContentSettings();
    if (content.heroTitle) {
        const el = document.getElementById('hero-title');
        if (el) el.textContent = content.heroTitle;
    }
    if (content.heroSubtitle) {
        const el = document.getElementById('hero-subtitle');
        if (el) el.textContent = content.heroSubtitle;
    }
    if (content.cornHarvest) {
        const el = document.getElementById('corn-harvest');
        if (el) el.textContent = content.cornHarvest;
    }
    if (content.applePestAlert) {
        const el = document.getElementById('apple-pest-alert');
        if (el) el.textContent = content.applePestAlert;
    }
    if (content.footerTagline) {
        const el = document.getElementById('footer-tagline');
        if (el) el.textContent = content.footerTagline;
    }
}

function loadAdminContentForm() {
    const form = document.getElementById('admin-content-form');
    if (!form) return;
    const content = getContentSettings();

    const heroTitle = document.getElementById('content-hero-title');
    const heroSubtitle = document.getElementById('content-hero-subtitle');
    const cornHarvest = document.getElementById('content-corn-harvest');
    const applePest = document.getElementById('content-apple-pest');
    const footerTagline = document.getElementById('content-footer-tagline');

    if (heroTitle && content.heroTitle) heroTitle.value = content.heroTitle;
    if (heroSubtitle && content.heroSubtitle) heroSubtitle.value = content.heroSubtitle;
    if (cornHarvest && content.cornHarvest) cornHarvest.value = content.cornHarvest;
    if (applePest && content.applePestAlert) applePest.value = content.applePestAlert;
    if (footerTagline && content.footerTagline) footerTagline.value = content.footerTagline;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newContent = {
            heroTitle: heroTitle ? heroTitle.value : '',
            heroSubtitle: heroSubtitle ? heroSubtitle.value : '',
            cornHarvest: cornHarvest ? cornHarvest.value : '',
            applePestAlert: applePest ? applePest.value : '',
            footerTagline: footerTagline ? footerTagline.value : ''
        };
        localStorage.setItem(CONTENT_KEY, JSON.stringify(newContent));
    });
}

// ----- Inventory and activities sync to main page -----
function getStoredInventoryItems() {
    const stored = localStorage.getItem(INVENTORY_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored) || [];
    } catch {
        return [];
    }
}

function applyAdminInventoryToMain() {
    const items = getStoredInventoryItems();
    if (!items.length) return;
    items.forEach(item => {
        const container = document.getElementById(item.category);
        if (!container) return;
        const grid = container.querySelector('.inventory-grid');
        if (!grid) return;
        const div = document.createElement('div');
        div.className = 'inventory-item';
        div.innerHTML = `
            <div class="item-header">
                <h4>${item.name}</h4>
                <span class="stock-level">${item.status}</span>
            </div>
            <div class="item-details">
                <p>Quantity / Units: ${item.quantity}</p>
                <p>Added: ${new Date(item.added).toLocaleDateString()}</p>
            </div>
            <button class="btn btn-small inventory-reorder-btn" data-item="${item.name}">Reorder</button>
        `;
        grid.appendChild(div);
    });
    // ensure new reorder buttons work
    initializeActionButtons();
}

function getStoredActivities() {
    const stored = localStorage.getItem(ACTIVITIES_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored) || [];
    } catch {
        return [];
    }
}

function applyAdminActivitiesToMain() {
    const activities = getStoredActivities();
    if (!activities.length) return;
    activities.forEach(act => {
        addActivity(act.title, act.icon || 'fa-seedling');
    });
}

// Mobile responsiveness helpers
function handleResize() {
    const isMobile = window.innerWidth <= 768;
    const navMenu = document.querySelector('.nav-menu');
    
    if (!isMobile && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
}

window.addEventListener('resize', handleResize);

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    const scrolled = window.pageYOffset;
    const navbar = document.querySelector('.navbar');
    
    if (scrolled > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
    }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Farm Management System initialized successfully');
    
    // Add some initial activities
    setTimeout(() => {
        addActivity('System initialized successfully', 'fa-check-circle');
    }, 1000);
});

