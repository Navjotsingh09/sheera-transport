/**
 * Firebase Form Handler
 * Submits form data to Firestore + sends email notification via FormSubmit.co
 * CV files uploaded to Firebase Storage
 */

// Import Firebase
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

const db = getFirestore();
const storage = getStorage();

// ===== FormSubmit.co — zero-config email forwarding =====
const NOTIFY_EMAIL = 'info@seehratransport.com';
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${NOTIFY_EMAIL}`;

/**
 * Send email notification via FormSubmit.co (no signup needed)
 */
async function sendEmailNotification(formType, data) {
  try {
    await fetch(FORMSUBMIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: `New ${formType} — Seehra Transport Website`,
        _cc: 'navjot.singh@5rv.digital',
        'Form Type': formType,
        'Name': data.name || 'Not provided',
        'Email': data.email || 'Not provided',
        'Phone': data.phone || 'Not provided',
        'Details': data.message || '',
        'Submission ID': data.submissionId || '',
        _template: 'table'
      })
    });
    console.log('✅ Email notification sent');
  } catch (error) {
    console.warn('⚠️ Email notification failed:', error);
  }
}

/**
 * Upload CV file to Firebase Storage
 */
async function uploadCV(file, applicantName) {
  try {
    const safeName = applicantName.replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filePath = `cv-uploads/${safeName}_${timestamp}.${ext}`;
    const storageRef = ref(storage, filePath);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    console.log('✅ CV uploaded:', filePath);
    return { success: true, url: downloadURL, path: filePath };
  } catch (error) {
    console.error('❌ CV upload failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Submit Contact Form
 */
async function submitContactForm(formData) {
  try {
    const docRef = await addDoc(collection(db, "contact_submissions"), {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company || "",
      service: formData.service,
      message: formData.message,
      submittedAt: serverTimestamp(),
      status: "new",
      ip: await getClientIP()
    });
    
    console.log("✅ Contact form submitted:", docRef.id);

    // Send email notification
    await sendEmailNotification('Contact Form', {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: `Service: ${formData.service}\nCompany: ${formData.company || 'N/A'}\n\n${formData.message}`,
      submissionId: docRef.id
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ Error submitting contact form:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Submit Recruitment Form (with CV upload)
 */
async function submitRecruitmentForm(formData, cvFile) {
  try {
    let cvData = { fileName: "Not provided", url: "", path: "" };

    // Upload CV if provided
    if (cvFile) {
      const uploadResult = await uploadCV(cvFile, formData.fullName || formData['full-name'] || 'applicant');
      if (uploadResult.success) {
        cvData = {
          fileName: cvFile.name,
          url: uploadResult.url,
          path: uploadResult.path
        };
      }
    }

    const docRef = await addDoc(collection(db, "recruitment_submissions"), {
      fullName: formData.fullName || formData['full-name'],
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      licenseType: formData.licenseType || formData['license-type'],
      licenseYears: parseInt(formData.licenseYears || formData['license-years']),
      experience: formData.experience,
      availability: formData.availability,
      cv: cvData,
      additionalInfo: formData.additionalInfo || formData['additional-info'] || "",
      submittedAt: serverTimestamp(),
      status: "pending_review",
      ip: await getClientIP()
    });
    
    console.log("✅ Recruitment form submitted:", docRef.id);

    // Send email notification
    const name = formData.fullName || formData['full-name'];
    await sendEmailNotification('Recruitment Application', {
      name: name,
      email: formData.email,
      phone: formData.phone,
      message: `License: ${formData.licenseType || formData['license-type']}\nExperience: ${formData.experience}\nAvailability: ${formData.availability}\nCV: ${cvData.url || 'Not uploaded'}`,
      submissionId: docRef.id
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ Error submitting recruitment form:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Submit Booking Form
 */
async function submitBookingForm(formData) {
  try {
    const docRef = await addDoc(collection(db, "booking_submissions"), {
      collection: formData.collection,
      delivery: formData.delivery,
      service: formData.service,
      package: formData.package,
      specialRequirements: formData.specialRequirements || "",
      price: parseFloat(formData.price || formData.totalPrice),
      submittedAt: serverTimestamp(),
      status: "pending_confirmation",
      paymentStatus: "pending",
      ip: await getClientIP()
    });
    
    console.log("✅ Booking submitted:", docRef.id);

    // Send email notification
    await sendEmailNotification('New Booking', {
      name: formData.collection?.name || 'Customer',
      email: formData.collection?.email || '',
      phone: formData.collection?.phone || '',
      message: `Service: ${formData.service}\nFrom: ${formData.collection?.address?.postcode || ''}\nTo: ${formData.delivery?.address?.postcode || ''}\nPrice: £${formData.price || formData.totalPrice}`,
      submissionId: docRef.id
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ Error submitting booking:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get client IP (optional tracking)
 */
async function getClientIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return "unknown";
  }
}

export { submitContactForm, submitRecruitmentForm, submitBookingForm };
