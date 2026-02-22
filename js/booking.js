/* ===== BOOKING FORM MULTI-STEP ===== */

let currentStep = 1;

// Set minimum date to tomorrow
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('collection-date');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    // Update price when service type changes
    const serviceSelect = document.getElementById('service-selection');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', updatePrice);
    }

    // Update insurance when package value changes
    const valueInput = document.getElementById('package-value');
    if (valueInput) {
        valueInput.addEventListener('input', updatePrice);
    }
});

function nextStep(step) {
    // Validate current step
    if (!validateStep(currentStep)) {
        return;
    }

    // Hide current step
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.querySelector(`.booking-step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.booking-step[data-step="${currentStep}"]`).classList.add('completed');

    // Show next step
    currentStep = step;
    document.getElementById(`step-${currentStep}`).classList.add('active');
    document.querySelector(`.booking-step[data-step="${currentStep}"]`).classList.add('active');

    // If step 3, populate summary
    if (currentStep === 3) {
        populateSummary();
        updatePrice();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    // Hide current step
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.querySelector(`.booking-step[data-step="${currentStep}"]`).classList.remove('active');

    // Show previous step
    currentStep = step;
    document.getElementById(`step-${currentStep}`).classList.add('active');
    document.querySelector(`.booking-step[data-step="${currentStep}"]`).classList.add('active');
    document.querySelector(`.booking-step[data-step="${currentStep}"]`).classList.remove('completed');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep(step) {
    const stepElement = document.getElementById(`step-${step}`);
    const requiredInputs = stepElement.querySelectorAll('[required]');
    let valid = true;

    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            valid = false;
            input.classList.add('input-error');
            
            // Remove error class on input
            input.addEventListener('input', function() {
                this.classList.remove('input-error');
            }, { once: true });
        }
    });

    if (!valid) {
        alert('Please fill in all required fields');
    }

    return valid;
}

function populateSummary() {
    // Collection Summary
    const collectionSummary = `
        <p><strong>${document.getElementById('collection-name').value}</strong></p>
        <p>${document.getElementById('collection-phone').value}</p>
        <p>${document.getElementById('collection-email').value}</p>
        <p>${document.getElementById('collection-address-line1').value}${document.getElementById('collection-address-line2').value ? ', ' + document.getElementById('collection-address-line2').value : ''}</p>
        <p>${document.getElementById('collection-city').value}, ${document.getElementById('collection-postcode').value}</p>
        <p><strong>Date:</strong> ${formatDate(document.getElementById('collection-date').value)}</p>
        <p><strong>Time:</strong> ${document.getElementById('collection-time').value}</p>
        ${document.getElementById('collection-notes').value ? '<p><strong>Notes:</strong> ' + document.getElementById('collection-notes').value + '</p>' : ''}
    `;
    document.getElementById('summary-collection').innerHTML = collectionSummary;

    // Delivery Summary
    const deliverySummary = `
        <p><strong>${document.getElementById('delivery-name').value}</strong></p>
        <p>${document.getElementById('delivery-phone').value}</p>
        <p>${document.getElementById('delivery-address-line1').value}${document.getElementById('delivery-address-line2').value ? ', ' + document.getElementById('delivery-address-line2').value : ''}</p>
        <p>${document.getElementById('delivery-city').value}, ${document.getElementById('delivery-postcode').value}</p>
        ${document.getElementById('delivery-instructions').value ? '<p><strong>Instructions:</strong> ' + document.getElementById('delivery-instructions').value + '</p>' : ''}
    `;
    document.getElementById('summary-delivery').innerHTML = deliverySummary;

    // Package Summary
    const fragile = document.getElementById('package-fragile').checked ? ' ⚠️ <strong>FRAGILE</strong>' : '';
    const packageSummary = `
        <p><strong>Contents:</strong> ${document.getElementById('package-contents').value}</p>
        <p><strong>Value:</strong> £${parseFloat(document.getElementById('package-value').value).toFixed(2)}</p>
        <p><strong>Weight:</strong> ${document.getElementById('package-weight').value} kg</p>
        <p><strong>Dimensions:</strong> ${document.getElementById('package-dimensions').value} cm</p>
        ${fragile}
    `;
    document.getElementById('summary-package').innerHTML = packageSummary;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
}

function updatePrice() {
    const serviceType = document.getElementById('service-selection').value;
    const packageValue = parseFloat(document.getElementById('package-value').value) || 0;

    // Base prices
    const prices = {
        'standard': 6.99,
        'next-day': 12.99,
        'same-day': 24.99
    };

    const basePrice = prices[serviceType] || prices['next-day'];
    
    // Calculate insurance (2% of package value, minimum £1, maximum £10)
    let insurance = Math.max(1, Math.min(10, packageValue * 0.02));
    if (packageValue === 0) insurance = 1;

    const total = basePrice + insurance;

    // Update display
    document.getElementById('price-base').textContent = '£' + basePrice.toFixed(2);
    document.getElementById('price-insurance').textContent = '£' + insurance.toFixed(2);
    document.getElementById('price-total').textContent = '£' + total.toFixed(2);
    document.getElementById('final-price').textContent = total.toFixed(2);
}

// Form submission
document.getElementById('booking-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate terms acceptance
    if (!document.getElementById('accept-terms-booking').checked) {
        alert('Please accept the terms and conditions');
        return;
    }

    // Collect all form data
    const bookingData = {
        collection: {
            name: document.getElementById('collection-name').value,
            phone: document.getElementById('collection-phone').value,
            email: document.getElementById('collection-email').value,
            address: {
                line1: document.getElementById('collection-address-line1').value,
                line2: document.getElementById('collection-address-line2').value,
                city: document.getElementById('collection-city').value,
                postcode: document.getElementById('collection-postcode').value
            },
            date: document.getElementById('collection-date').value,
            timeWindow: document.getElementById('collection-time').value,
            notes: document.getElementById('collection-notes').value
        },
        delivery: {
            name: document.getElementById('delivery-name').value,
            phone: document.getElementById('delivery-phone').value,
            address: {
                line1: document.getElementById('delivery-address-line1').value,
                line2: document.getElementById('delivery-address-line2').value,
                city: document.getElementById('delivery-city').value,
                postcode: document.getElementById('delivery-postcode').value
            },
            instructions: document.getElementById('delivery-instructions').value
        },
        package: {
            contents: document.getElementById('package-contents').value,
            value: parseFloat(document.getElementById('package-value').value),
            weight: parseFloat(document.getElementById('package-weight').value),
            dimensions: document.getElementById('package-dimensions').value,
            fragile: document.getElementById('package-fragile').checked
        },
        service: document.getElementById('service-selection').value,
        paymentMethod: document.querySelector('input[name="payment-method"]:checked').value,
        totalPrice: parseFloat(document.getElementById('final-price').textContent)
    };

    console.log('Booking Data:', bookingData);

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Processing...</span>';

    try {
        // Submit to Firebase
        const { submitBookingForm } = await import('./firebase-forms.js');
        const result = await submitBookingForm(bookingData);

        if (result && result.success) {
            // Generate tracking number
            const trackingNumber = 'ST' + Date.now().toString().slice(-9) + 'GB';
            const bookingId = result.id;

            // Store booking data in localStorage
            localStorage.setItem('lastBooking', JSON.stringify({
                ...bookingData,
                bookingId,
                trackingNumber,
                bookingDate: new Date().toISOString(),
                status: 'confirmed'
            }));

            // Redirect to confirmation page
            setTimeout(() => {
                window.location.href = `confirmation.html?booking=${bookingId}&tracking=${trackingNumber}`;
            }, 1500);
        } else {
            throw new Error('Booking submission failed');
        }
    } catch (error) {
        console.error('Booking error:', error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        alert('❌ Error submitting booking. Please try again.\n\n' + error.message);
    }
});
