// Admin Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();

    // Initialize dashboard
    initializeDashboard();
    loadDashboardData();
    setupEventListeners();
    startRealTimeUpdates();
});

// Authentication Check
function checkAuth() {
    const session = localStorage.getItem('adminSession') || sessionStorage.getItem('adminSession');
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    const sessionData = JSON.parse(session);
    
    // Update header with user info
    document.getElementById('userName').textContent = sessionData.name;
    document.getElementById('userRole').textContent = capitalizeRole(sessionData.selectedRole || sessionData.roles[0]);
    document.getElementById('welcomeName').textContent = sessionData.name.split(' ')[0];
    
    // Get initials
    const initials = sessionData.name.split(' ').map(n => n[0]).join('');
    document.getElementById('userInitials').textContent = initials;
}

// Capitalize Role
function capitalizeRole(role) {
    return role.charAt(0).toUpperCase() + role.slice(1);
}

// Initialize Dashboard
function initializeDashboard() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('adminSidebar');
    
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        document.body.classList.toggle('sidebar-collapsed');
    });

    // User menu toggle
    const userMenuToggle = document.getElementById('userMenuToggle');
    const userDropdown = document.getElementById('userDropdown');
    
    userMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        userDropdown.classList.remove('active');
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            switchSection(section);
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

// Switch Section
function switchSection(section) {
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(s => s.classList.remove('active'));
    
    const targetSection = document.getElementById(section + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load section-specific data
        if (section === 'orders') {
            loadAllOrders();
        }
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminSession');
        sessionStorage.removeItem('adminSession');
        window.location.href = 'login.html';
    }
}

// Load Dashboard Data
function loadDashboardData() {
    loadStats();
    loadRecentOrders();
    loadDriverStatus();
}

// Load Stats
function loadStats() {
    // In production, this would fetch from API
    const stats = {
        totalOrders: 324,
        completedToday: 87,
        activeDrivers: '24/28',
        avgDeliveryTime: '2.4h'
    };

    // Animate counters
    animateCounter('totalOrders', 0, stats.totalOrders, 1000);
    animateCounter('completedToday', 0, stats.completedToday, 1000);
    document.getElementById('activeDrivers').textContent = stats.activeDrivers;
    document.getElementById('avgDeliveryTime').textContent = stats.avgDeliveryTime;
}

// Animate Counter
function animateCounter(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Generate Demo Orders
function generateDemoOrders(count) {
    const statuses = ['pending', 'in-transit', 'delivered', 'cancelled'];
    const statusLabels = {
        'pending': 'Pending',
        'in-transit': 'In Transit',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };
    const customers = ['ABC Corp', 'XYZ Ltd', 'Tech Solutions', 'Global Traders', 'City Express'];
    const cities = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Edinburgh'];
    const drivers = ['Driver #12', 'Driver #05', 'Driver #18', 'Driver #03', 'Unassigned'];
    const services = ['Standard', 'Next Day', 'Same Day', 'Express'];
    
    const orders = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const orderDate = new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000);
        
        orders.push({
            id: 'BK-' + formatDate(orderDate, 'YYYYMMDD') + '-' + String(1000 + i).padStart(4, '0'),
            trackingNumber: 'ST' + Date.now() + Math.random().toString(36).substring(7).toUpperCase(),
            customer: customers[Math.floor(Math.random() * customers.length)],
            collectionCity: cities[Math.floor(Math.random() * cities.length)],
            destinationCity: cities[Math.floor(Math.random() * cities.length)],
            service: services[Math.floor(Math.random() * services.length)],
            status: status,
            statusLabel: statusLabels[status],
            driver: status === 'pending' ? 'Unassigned' : drivers[Math.floor(Math.random() * (drivers.length - 1))],
            created: orderDate,
            price: '£' + (50 + Math.random() * 200).toFixed(2)
        });
    }
    
    // Sort by date (newest first)
    orders.sort((a, b) => b.created - a.created);
    
    return orders;
}

// Format Date
function formatDate(date, format) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    if (format === 'YYYYMMDD') {
        return year + month + day;
    } else if (format === 'DD/MM/YYYY') {
        return day + '/' + month + '/' + year;
    } else if (format === 'DD/MM/YYYY HH:MM') {
        return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
    }
    
    return d.toLocaleDateString();
}

// Load Recent Orders
function loadRecentOrders() {
    const orders = generateDemoOrders(10);
    const tbody = document.getElementById('recentOrdersTable');
    tbody.innerHTML = '';
    
    orders.slice(0, 5).forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>${order.destinationCity}</td>
            <td><span class="status-badge status-${order.status}">${order.statusLabel}</span></td>
            <td>${order.driver}</td>
            <td>
                <button class="btn-icon" onclick="viewOrder('${order.id}')" title="View details">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </button>
                <button class="btn-icon" onclick="assignDriver('${order.id}')" title="Assign driver">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/>
                        <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Load All Orders
function loadAllOrders() {
    const orders = generateDemoOrders(50);
    const tbody = document.getElementById('allOrdersTable');
    tbody.innerHTML = '';
    
    orders.slice(0, 20).forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="checkbox" class="order-checkbox" data-order-id="${order.id}"></td>
            <td><strong>${order.id}</strong><br><small>${order.trackingNumber}</small></td>
            <td>${order.customer}</td>
            <td>${order.collectionCity}</td>
            <td>${order.destinationCity}</td>
            <td>${order.service}</td>
            <td><span class="status-badge status-${order.status}">${order.statusLabel}</span></td>
            <td>${order.driver}</td>
            <td>${formatDate(order.created, 'DD/MM/YYYY HH:MM')}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="viewOrder('${order.id}')" title="View">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                    <button class="btn-icon" onclick="editOrder('${order.id}')" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                    <button class="btn-icon" onclick="deleteOrder('${order.id}')" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Load Driver Status
function loadDriverStatus() {
    const drivers = [
        { name: 'Mike Williams', vehicle: 'VAN-123', status: 'active', orders: 8, location: 'Central London' },
        { name: 'Sarah Johnson', vehicle: 'VAN-456', status: 'active', orders: 5, location: 'West End' },
        { name: 'John Davis', vehicle: 'TRUCK-789', status: 'break', orders: 0, location: 'Depot' },
        { name: 'Emma Brown', vehicle: 'VAN-234', status: 'active', orders: 6, location: 'East London' },
        { name: 'Tom Wilson', vehicle: 'VAN-567', status: 'offline', orders: 0, location: 'Unknown' }
    ];

    const container = document.getElementById('driversList');
    container.innerHTML = '';

    drivers.forEach(driver => {
        const statusClass = driver.status === 'active' ? 'driver-status-active' : 
                          driver.status === 'break' ? 'driver-status-break' : 'driver-status-offline';
        const statusText = driver.status === 'active' ? 'Active' : 
                         driver.status === 'break' ? 'On Break' : 'Offline';

        const driverCard = document.createElement('div');
        driverCard.className = 'driver-card';
        driverCard.innerHTML = `
            <div class="driver-avatar">
                <span>${driver.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div class="driver-info">
                <div class="driver-name">${driver.name}</div>
                <div class="driver-vehicle">${driver.vehicle}</div>
            </div>
            <div class="driver-stats">
                <span class="${statusClass}">${statusText}</span>
                <span class="driver-orders">${driver.orders} orders</span>
            </div>
        `;
        container.appendChild(driverCard);
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Search functionality
    const headerSearch = document.getElementById('headerSearch');
    if (headerSearch) {
        headerSearch.addEventListener('input', (e) => {
            // Implement search logic
            console.log('Searching for:', e.target.value);
        });
    }

    // Orders filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.dataset.filter;
            filterOrders(filter);
        });
    });

    // Select all checkbox
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.order-checkbox');
            checkboxes.forEach(cb => cb.checked = e.target.checked);
        });
    }
}

// Filter Orders
function filterOrders(filter) {
    // In production, this would filter orders based on status
    console.log('Filtering orders by:', filter);
    // For now, just reload all orders
    loadAllOrders();
}

// View Order Details
window.viewOrder = function(orderId) {
    const modal = document.getElementById('orderModal');
    const modalBody = document.getElementById('orderModalBody');
    
    // Generate demo order details
    modalBody.innerHTML = `
        <div class="order-details-grid">
            <div class="order-detail-section">
                <h3>Order Information</h3>
                <div class="detail-row">
                    <span class="detail-label">Order ID:</span>
                    <span class="detail-value"><strong>${orderId}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Tracking Number:</span>
                    <span class="detail-value">ST${Date.now()}GB</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Service Type:</span>
                    <span class="detail-value">Standard Delivery</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="status-badge status-in-transit">In Transit</span>
                </div>
            </div>
            <div class="order-detail-section">
                <h3>Customer Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">John Smith</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">john.smith@example.com</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">+44 7700 900000</span>
                </div>
            </div>
            <div class="order-detail-section">
                <h3>Collection Details</h3>
                <p>123 Collection Street<br>London, E1 7AA<br>United Kingdom</p>
                <p><strong>Date:</strong> ${formatDate(new Date(), 'DD/MM/YYYY')}</p>
            </div>
            <div class="order-detail-section">
                <h3>Delivery Details</h3>
                <p>456 Delivery Avenue<br>Manchester, M1 1AA<br>United Kingdom</p>
                <p><strong>Recipient:</strong> Jane Doe</p>
            </div>
            <div class="order-detail-section">
                <h3>Package Information</h3>
                <div class="detail-row">
                    <span class="detail-label">Contents:</span>
                    <span class="detail-value">Electronics</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Weight:</span>
                    <span class="detail-value">5.2 kg</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Value:</span>
                    <span class="detail-value">£500.00</span>
                </div>
            </div>
            <div class="order-detail-section">
                <h3>Assigned Driver</h3>
                <select class="form-select">
                    <option>Mike Williams (VAN-123)</option>
                    <option>Sarah Johnson (VAN-456)</option>
                    <option>Emma Brown (VAN-234)</option>
                </select>
                <button class="btn btn-primary" style="margin-top: 1rem;">Update Driver</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
};

// Close modal
document.getElementById('closeOrderModal')?.addEventListener('click', () => {
    document.getElementById('orderModal').classList.remove('active');
});

// Edit Order
window.editOrder = function(orderId) {
    alert('Edit order: ' + orderId + '\nThis will open an edit form in the full implementation.');
};

// Delete Order
window.deleteOrder = function(orderId) {
    if (confirm('Are you sure you want to delete order ' + orderId + '?')) {
        alert('Order deleted: ' + orderId);
        // Reload orders
        loadAllOrders();
    }
};

// Assign Driver
window.assignDriver = function(orderId) {
    alert('Assign driver to order: ' + orderId + '\nThis will open a driver assignment dialog in the full implementation.');
};

// Start Real-Time Updates
function startRealTimeUpdates() {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
        // Update stats
        loadStats();
        
        // Update notification badge
        const notificationBadge = document.querySelector('.notification-badge');
        if (notificationBadge) {
            const count = parseInt(notificationBadge.textContent) + Math.floor(Math.random() * 3);
            notificationBadge.textContent = count;
        }
    }, 30000);
}
