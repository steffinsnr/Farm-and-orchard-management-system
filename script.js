// Farm and Orchard Management System JavaScript

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

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
function initializeCharts() {
    // Yield Prediction Chart
    const yieldCtx = document.getElementById('yieldChart');
    if (yieldCtx) {
        new Chart(yieldCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Expected Yield (tons)',
                    data: [12, 19, 3, 5, 2, 3, 8, 15, 25, 30, 28, 20],
                    borderColor: '#2d7d32',
                    backgroundColor: 'rgba(45, 125, 50, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
        new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [{
                    label: 'Revenue ($)',
                    data: [25000, 35000, 40000, 30000],
                    backgroundColor: '#2d7d32',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
        new Chart(costCtx, {
            type: 'doughnut',
            data: {
                labels: ['Labor', 'Seeds', 'Fertilizer', 'Equipment', 'Other'],
                datasets: [{
                    data: [30, 20, 15, 25, 10],
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
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    // Yield Comparison Chart
    const yieldComparisonCtx = document.getElementById('yieldComparisonChart');
    if (yieldComparisonCtx) {
        new Chart(yieldComparisonCtx, {
            type: 'radar',
            data: {
                labels: ['Corn', 'Wheat', 'Soybeans', 'Tomatoes', 'Apples'],
                datasets: [{
                    label: 'Current Year',
                    data: [85, 70, 60, 90, 75],
                    borderColor: '#2d7d32',
                    backgroundColor: 'rgba(45, 125, 50, 0.2)',
                    pointBackgroundColor: '#2d7d32'
                }, {
                    label: 'Previous Year',
                    data: [75, 65, 55, 80, 70],
                    borderColor: '#ffa726',
                    backgroundColor: 'rgba(255, 167, 38, 0.2)',
                    pointBackgroundColor: '#ffa726'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
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
                    { name: 'Field A', crop: 'Corn', status: 'Growing', plantingDate: '2024-03-15' },
                    { name: 'Field B', crop: 'Wheat', status: 'Harvested', plantingDate: '2024-02-01' },
                    { name: 'Field C', crop: 'Soybeans', status: 'Planting', plantingDate: '2024-04-01' }
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
