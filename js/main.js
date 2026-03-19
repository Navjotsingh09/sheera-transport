/* ===== MOBILE MENU ===== */
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

let menuScrollY = 0;
if (navToggle) navToggle.addEventListener('click', () => {
    menuScrollY = window.scrollY;
    document.body.style.top = `-${menuScrollY}px`;
    navMenu.classList.add('show-menu');
    document.body.classList.add('menu-open');
    document.documentElement.classList.add('menu-open');
});
if (navClose) navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
    document.body.classList.remove('menu-open');
    document.documentElement.classList.remove('menu-open');
    document.body.style.top = '';
    window.scrollTo(0, menuScrollY);
});
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
        document.body.classList.remove('menu-open');
        document.documentElement.classList.remove('menu-open');
        document.body.style.top = '';
        window.scrollTo(0, menuScrollY);
    });
});


/* ===== ACTIVE NAV LINK ===== */
(function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
})();

/* ===== HEADROOM HEADER ===== */
const header = document.getElementById('header');
let lastScrollY = 0, ticking = false;

function updateHeader() {
    const y = window.scrollY;
    header.classList.toggle('scroll-header', y > 50);
    header.classList.toggle('header-hidden', y > lastScrollY && y > 200);
    lastScrollY = y;
    ticking = false;
}
window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateHeader); ticking = true; }
});

/* ===== HERO PARALLAX ===== */
(function heroParallax() {
    const heroBg = document.querySelector('.hero-bg img, .hero-bg video');
    if (!heroBg) return;
    let rafId;
    function onScroll() {
        const y = window.scrollY;
        const heroH = document.querySelector('.hero')?.offsetHeight || window.innerHeight;
        if (y < heroH) {
            heroBg.style.transform = 'translateY(' + (y * 0.15) + 'px) scale(1.05)';
        }
    }
    window.addEventListener('scroll', () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(onScroll);
    }, { passive: true });
})();

/* ===== INTERSECTION OBSERVER – REVEAL ===== */
document.addEventListener('DOMContentLoaded', () => {
    /* Auto-tag elements that should animate in */
    const autoSelectors = [
        '.service-card', '.feature-item', '.stat-item',
        '.cta-card', '.value-card', '.requirement-card',
        '.reason-item', '.gallery-item', '.contact-info-item',
        '.service-detail', '.section-title', '.section-subtitle',
        '.block-text-centered', '.recruitment-intro',
        '.about-text', '.about-image',
        '.section-tag', '.section-title-red',
        '.news-card', '.directory-card', '.industry-stat',
        '.community-cta', '.video-cta-content',
        '.stay-connected-inner', '.footer-contact-block',
        '.footer-watermark'
    ];
    autoSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach((el, i) => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
                el.classList.add('reveal-delay-' + Math.min(i + 1, 6));
            }
        });
    });

    /* Create observer */
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('revealed');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal, .hr-reveal, .footer-hr').forEach(el => obs.observe(el));
    } else {
        document.querySelectorAll('.reveal, .hr-reveal, .footer-hr').forEach(el => el.classList.add('revealed'));
    }
});

/* ===== MARQUEE DUPLICATION ===== */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.marquee-track').forEach(track => {
        const clone = track.innerHTML;
        track.innerHTML += clone;
    });
});

/* ===== COUNTER ANIMATION (used by both .stat-number and .stat-counter) ===== */
document.addEventListener('DOMContentLoaded', () => {
    if (!('IntersectionObserver' in window)) return;
    const counters = document.querySelectorAll('[data-count], .stat-counter');
    const counterObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const end = el.getAttribute('data-count') || el.textContent;
            const suffix = el.getAttribute('data-suffix') || '';
            const prefix = el.getAttribute('data-prefix') || '';
            const num = parseInt(end.replace(/\D/g, ''), 10);
            if (isNaN(num)) { counterObs.unobserve(el); return; }
            let start = 0;
            const duration = 2000;
            const step = ts => {
                if (!start) start = ts;
                const progress = Math.min((ts - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * num);
                el.textContent = prefix + current.toLocaleString() + suffix;
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            counterObs.unobserve(el);
        });
    }, { threshold: 0.3 });
    counters.forEach(c => counterObs.observe(c));
});

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const t = document.querySelector(this.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

/* ===== FORM VALIDATION WITH FIREBASE ===== */
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let valid = true;
        form.querySelectorAll('.error-message').forEach(x => x.remove());
        form.querySelectorAll('.input-error').forEach(x => x.classList.remove('input-error'));

        inputs.forEach(input => {
            let msg = '';
            if (!input.value.trim()) msg = 'This field is required';
            else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) msg = 'Please enter a valid email';
            else if (input.type === 'tel' && (!/^[\d\s\-\+\(\)]+$/.test(input.value) || input.value.length < 10)) msg = 'Please enter a valid phone number';
            if (msg) {
                valid = false;
                input.classList.add('input-error');
                const span = document.createElement('span');
                span.className = 'error-message';
                span.textContent = msg;
                span.style.cssText = 'color:var(--error,#C30A0A);font-size:0.75rem;display:block;margin-top:0.25rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;';
                input.parentNode.appendChild(span);
            }
        });

        if (valid) {
            try {
                // Collect form data
                let formData = {};
                inputs.forEach(input => {
                    formData[input.name] = input.value;
                });

                // Submit to Firebase
                let result;
                if (formId === 'contact-form') {
                    const { submitContactForm } = await import('./firebase-forms.js');
                    result = await submitContactForm(formData);
                } else if (formId === 'recruitment-form') {
                    const { submitRecruitmentForm } = await import('./firebase-forms.js');
                    const cvInput = document.getElementById('cv-upload');
                    const cvFile = cvInput && cvInput.files.length > 0 ? cvInput.files[0] : null;
                    result = await submitRecruitmentForm(formData, cvFile);
                }

                if (result && result.success) {
                    const s = document.createElement('div');
                    s.className = 'success-message';
                    s.innerHTML = '<p style="color:var(--success,#1D6F35);font-weight:700;text-align:center;padding:1rem;background:rgba(29,111,53,0.08);border-radius:8px;margin-top:1rem;text-transform:uppercase;font-size:0.875rem;letter-spacing:0.02em;">✅ Thank you! Your submission (ID: ' + result.id.substring(0, 8) + '...) has been saved.</p>';
                    form.appendChild(s);
                    form.reset();
                    setTimeout(() => s.remove(), 10000);
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                const s = document.createElement('div');
                s.className = 'error-message';
                s.innerHTML = '<p style="color:var(--error,#C30A0A);font-weight:700;text-align:center;padding:1rem;background:rgba(195,10,10,0.08);border-radius:8px;margin-top:1rem;text-transform:uppercase;font-size:0.875rem;letter-spacing:0.02em;">⚠️ Error submitting form. Please try again.</p>';
                form.appendChild(s);
            }
        } else {
            const first = form.querySelector('.input-error');
            if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    validateForm('contact-form');
    validateForm('recruitment-form');
});

/* ===== FILE UPLOAD ===== */
document.addEventListener('DOMContentLoaded', () => {
    const fi = document.getElementById('cv-upload');
    if (!fi) return;
    fi.addEventListener('change', e => {
        const f = e.target.files[0];
        const lbl = document.querySelector('.file-label');
        if (!f) return;
        const mb = (f.size / 1024 / 1024).toFixed(2);
        const ok = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!ok.includes(f.type)) { alert('Please upload a PDF or Word document'); fi.value=''; return; }
        if (mb > 5) { alert('File must be under 5 MB'); fi.value=''; return; }
        if (lbl) { lbl.textContent = f.name + ' (' + mb + ' MB)'; lbl.style.color='var(--success)'; lbl.style.borderColor='var(--success)'; }
    });
});

/* ===== QUOTE REQUEST FORM ===== */
document.addEventListener('DOMContentLoaded', () => {
    const quoteForm = document.getElementById('quote-form');
    const quoteResult = document.getElementById('quote-result');
    const resetBtn = document.getElementById('reset-quote');

    if (!quoteForm) return;

    quoteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('quote-submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const data = {
            _subject: 'New Quote Request — Seehra Transport Website',
            _cc: 'navjot.singh@5rv.digital',
            _template: 'table',
            'Name': document.getElementById('quote-name').value.trim(),
            'Email': document.getElementById('quote-email').value.trim(),
            'Phone': (document.getElementById('quote-phone').value || '').trim() || 'Not provided',
            'Collection Postcode': document.getElementById('from-postcode').value.trim(),
            'Delivery Postcode': document.getElementById('to-postcode').value.trim(),
            'Service Type': document.getElementById('service-type').value,
            'Package Weight': document.getElementById('package-weight').value,
            'Additional Details': (document.getElementById('quote-details').value || '').trim() || 'None'
        };

        try {
            const response = await fetch('https://formsubmit.co/ajax/info@seehratransport.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                quoteForm.style.display = 'none';
                quoteResult.style.display = 'block';
                quoteResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                throw new Error('Server error');
            }
        } catch (error) {
            console.error('Quote submission failed:', error);
            alert('Sorry, something went wrong. Please try again or email us at info@seehratransport.com');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            quoteForm.reset();
            quoteForm.style.display = 'block';
            quoteResult.style.display = 'none';
            quoteForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
});
