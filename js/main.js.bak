/* ===== MOBILE MENU TOGGLE ===== */
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

// Show menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

// Hide menu
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// Close menu when clicking nav links
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
});

/* ===== STICKY HEADER ON SCROLL ===== */
const header = document.getElementById('header');

function scrollHeader() {
    if (window.scrollY >= 50) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
}

window.addEventListener('scroll', scrollHeader);

/* ===== ACTIVE SECTION HIGHLIGHTING ===== */
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector('.nav-link[href*=' + sectionId + ']');

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', scrollActive);

/* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
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

/* ===== FORM VALIDATION & SUBMISSION ===== */
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form elements
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        // Clear previous errors
        form.querySelectorAll('.error-message').forEach(error => error.remove());
        form.querySelectorAll('.input-error').forEach(input => input.classList.remove('input-error'));
        
        // Validate each required field
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('input-error');
                
                const errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                errorMsg.style.color = '#FF6B35';
                errorMsg.style.fontSize = '0.875rem';
                errorMsg.style.display = 'block';
                errorMsg.style.marginTop = '0.25rem';
                
                input.parentNode.appendChild(errorMsg);
            }
            
            // Email validation
            if (input.type === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    input.classList.add('input-error');
                    
                    const errorMsg = document.createElement('span');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Please enter a valid email address';
                    errorMsg.style.color = '#FF6B35';
                    errorMsg.style.fontSize = '0.875rem';
                    errorMsg.style.display = 'block';
                    errorMsg.style.marginTop = '0.25rem';
                    
                    input.parentNode.appendChild(errorMsg);
                }
            }
            
            // Phone validation
            if (input.type === 'tel' && input.value.trim()) {
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(input.value) || input.value.length < 10) {
                    isValid = false;
                    input.classList.add('input-error');
                    
                    const errorMsg = document.createElement('span');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Please enter a valid phone number';
                    errorMsg.style.color = '#FF6B35';
                    errorMsg.style.fontSize = '0.875rem';
                    errorMsg.style.display = 'block';
                    errorMsg.style.marginTop = '0.25rem';
                    
                    input.parentNode.appendChild(errorMsg);
                }
            }
        });
        
        if (isValid) {
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.innerHTML = `
                <p style="color: #10b981; font-weight: 600; text-align: center; padding: 1rem; background-color: rgba(16, 185, 129, 0.1); border-radius: 4px; margin-top: 1rem;">
                    ✓ Thank you! Your message has been sent successfully. We'll be in touch soon.
                </p>
            `;
            
            form.appendChild(successMsg);
            form.reset();
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMsg.remove();
            }, 5000);
            
            // Here you would typically send the form data to your backend
            // For now, we'll just log it
            const formData = new FormData(form);
            console.log('Form submitted:', Object.fromEntries(formData));
        } else {
            // Scroll to first error
            const firstError = form.querySelector('.input-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// Initialize form validation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    validateForm('contact-form');
    validateForm('recruitment-form');
});

/* ===== SCROLL REVEAL ANIMATION ===== */
function revealOnScroll() {
    const reveals = document.querySelectorAll('.service-card, .feature-item, .stat-item, .cta-card');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100;
        
        if (elementTop < windowHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Set initial state for reveal elements
document.addEventListener('DOMContentLoaded', function() {
    const reveals = document.querySelectorAll('.service-card, .feature-item, .stat-item, .cta-card');
    reveals.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    revealOnScroll();
});

window.addEventListener('scroll', revealOnScroll);

/* ===== IMAGE LAZY LOADING ===== */
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

/* ===== FILE UPLOAD HANDLING (for recruitment form) ===== */
function handleFileUpload() {
    const fileInput = document.getElementById('cv-upload');
    if (!fileInput) return;
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const fileLabel = document.querySelector('.file-label');
        
        if (file) {
            const fileSize = (file.size / 1024 / 1024).toFixed(2); // MB
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            
            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a PDF or Word document');
                fileInput.value = '';
                return;
            }
            
            if (fileSize > 5) {
                alert('File size must be less than 5MB');
                fileInput.value = '';
                return;
            }
            
            if (fileLabel) {
                fileLabel.textContent = `✓ ${file.name} (${fileSize}MB)`;
                fileLabel.style.color = '#10b981';
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', handleFileUpload);
