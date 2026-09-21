// Admin Login Functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('adminLoginForm');
    const roleSelection = document.getElementById('roleSelection');
    const loginError = document.getElementById('loginError');
    const loginBtn = document.getElementById('loginBtn');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    // Toggle Password Visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        const eyeOpen = this.querySelector('.eye-open');
        const eyeClosed = this.querySelector('.eye-closed');
        
        if (type === 'password') {
            eyeOpen.style.display = 'block';
            eyeClosed.style.display = 'none';
        } else {
            eyeOpen.style.display = 'none';
            eyeClosed.style.display = 'block';
        }
    });

    // Form Submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const employeeId = document.getElementById('employeeId').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Clear previous errors
        loginError.style.display = 'none';
        loginError.textContent = '';

        // Validate inputs
        if (!employeeId || !password) {
            showError('Please enter both Employee ID and Password');
            return;
        }

        // Show loading state
        toggleLoadingState(true);

        // Credentials are verified server-side against the recruitment API -
        // no valid password is ever shipped in this file.
        try {
            const response = await fetch('/api/recruitment-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'login', email: employeeId, password })
            });

            if (response.ok) {
                const sessionData = {
                    employeeId: employeeId,
                    name: 'Administrator',
                    roles: ['admin'],
                    loginTime: new Date().toISOString(),
                    rememberMe: rememberMe
                };

                // Store in session storage (or local storage if remember me is checked)
                if (rememberMe) {
                    localStorage.setItem('adminSession', JSON.stringify(sessionData));
                } else {
                    sessionStorage.setItem('adminSession', JSON.stringify(sessionData));
                }

                redirectToDashboard('admin');
            } else {
                showError('Invalid Employee ID or Password');
                toggleLoadingState(false);
            }
        } catch (error) {
            showError('Unable to reach the server. Please try again.');
            toggleLoadingState(false);
        }
    });

    // Show Error Message
    function showError(message) {
        loginError.textContent = message;
        loginError.style.display = 'block';
        loginError.classList.add('shake');
        setTimeout(() => {
            loginError.classList.remove('shake');
        }, 500);
    }

    // Toggle Loading State
    function toggleLoadingState(isLoading) {
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoading = loginBtn.querySelector('.btn-loading');
        
        if (isLoading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            loginBtn.disabled = true;
        } else {
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            loginBtn.disabled = false;
        }
    }

    // Show Role Selection
    function showRoleSelection(availableRoles) {
        loginForm.style.display = 'none';
        roleSelection.style.display = 'block';

        // Filter role cards to show only available roles
        const roleCards = roleSelection.querySelectorAll('.role-card');
        roleCards.forEach(card => {
            const role = card.dataset.role;
            if (availableRoles.includes(role)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Handle role selection
        roleCards.forEach(card => {
            const btn = card.querySelector('button');
            btn.addEventListener('click', () => {
                const selectedRole = card.dataset.role;
                redirectToDashboard(selectedRole);
            });
        });
    }

    // Redirect to Dashboard
    function redirectToDashboard(role) {
        // Update session with selected role
        const sessionKey = localStorage.getItem('adminSession') ? 'adminSession' : 'adminSession';
        const storage = localStorage.getItem('adminSession') ? localStorage : sessionStorage;
        const sessionData = JSON.parse(storage.getItem(sessionKey));
        sessionData.selectedRole = role;
        storage.setItem(sessionKey, JSON.stringify(sessionData));

        window.location.href = 'forms.html';
    }

    // Check if user is already logged in
    const existingSession = localStorage.getItem('adminSession') || sessionStorage.getItem('adminSession');
    if (existingSession) {
        const sessionData = JSON.parse(existingSession);
        // Check if session is still valid (e.g., within 24 hours for remembered sessions)
        const loginTime = new Date(sessionData.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        
        if (sessionData.rememberMe && hoursDiff < 720) { // 30 days
            window.location.href = 'forms.html';
        } else if (!sessionData.rememberMe && hoursDiff < 8) { // 8 hours
            window.location.href = 'forms.html';
        } else {
            // Session expired, clear it
            localStorage.removeItem('adminSession');
            sessionStorage.removeItem('adminSession');
        }
    }

    // Forgot Password Handler
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Password reset functionality will be available in the backend implementation.\n\nFor demo purposes, use these credentials:\n\nAdmin: admin001 / admin123\nDispatcher: disp001 / disp123\nDriver: driver001 / driver123');
        });
    }
});
