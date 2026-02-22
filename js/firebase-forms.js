/**
 * Firebase Form Handler
 * Submits form data to Firestore database
 */

// Import Firebase
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const db = getFirestore();

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
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ Error submitting contact form:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Submit Recruitment Form
 */
async function submitRecruitmentForm(formData) {
  try {
    const docRef = await addDoc(collection(db, "recruitment_submissions"), {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      licenseType: formData.licenseType,
      licenseYears: parseInt(formData.licenseYears),
      experience: formData.experience,
      availability: formData.availability,
      cvFileName: formData.cvFileName || "Not provided",
      additionalInfo: formData.additionalInfo || "",
      submittedAt: serverTimestamp(),
      status: "pending_review",
      ip: await getClientIP()
    });
    
    console.log("✅ Recruitment form submitted:", docRef.id);
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
      price: parseFloat(formData.price),
      submittedAt: serverTimestamp(),
      status: "pending_confirmation",
      paymentStatus: "pending",
      ip: await getClientIP()
    });
    
    console.log("✅ Booking submitted:", docRef.id);
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
