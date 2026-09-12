/**
 * Supabase + Web3Forms Form Handlers
 * Handles Recruitment, Contact, and Booking form submissions
 */

import { supabase } from './supabase-config.js';

// WEB3FORMS ACCESS KEY (Replace with your key from web3forms.com)
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY_HERE';
const NOTIFY_EMAIL = 'info@seehratransport.com';

/**
 * Send email notification via Web3Forms with fail-safe fallback
 */
async function sendWeb3FormsNotification(formType, data) {
  try {
    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `New ${formType} — Seehra Transport`,
      from_name: 'Seehra Transport Website',
      to: NOTIFY_EMAIL,
      cc: 'navjot.singh@5rv.digital',
      'Form Type': formType,
      'Name': data.name || 'Not provided',
      'Email': data.email || 'Not provided',
      'Phone': data.phone || 'Not provided',
      'Details': data.message || '',
      'Submission ID': data.submissionId || ''
    };

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });

    const resData = await response.json();
    if (resData.success) {
      console.log('✅ Web3Forms email notification sent successfully');
    } else {
      console.warn('⚠️ Web3Forms notification returned warning:', resData.message);
    }
  } catch (error) {
    console.warn('⚠️ Web3Forms email dispatch failed (data saved in Supabase):', error);
  }
}

/**
 * Upload CV file to Supabase Storage ('cv-uploads' bucket)
 */
async function uploadCVToSupabase(file, applicantName) {
  try {
    const safeName = (applicantName || 'applicant').replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filePath = `${safeName}_${timestamp}.${ext}`;

    const { data, error } = await supabase.storage
      .from('cv-uploads')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('cv-uploads')
      .getPublicUrl(filePath);

    console.log('✅ CV uploaded to Supabase Storage:', filePath);
    return { success: true, url: publicUrlData.publicUrl, path: filePath };
  } catch (error) {
    console.error('❌ Supabase CV upload failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Submit Contact Form
 */
export async function submitContactForm(formData) {
  try {
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company || "",
      service: formData.service || "",
      message: formData.message || "",
      status: "new",
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([payload])
      .select();

    if (error) throw error;

    const recordId = data && data[0] ? data[0].id : 'saved';
    console.log("✅ Contact form saved to Supabase:", recordId);

    // Trigger Web3Forms email
    sendWeb3FormsNotification('Contact Form', {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: `Service: ${formData.service}\nCompany: ${formData.company || 'N/A'}\n\n${formData.message}`,
      submissionId: recordId
    });

    return { success: true, id: recordId };
  } catch (error) {
    console.error("❌ Error submitting contact form to Supabase:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Submit Recruitment Form (with CV upload)
 */
export async function submitRecruitmentForm(formData, cvFile) {
  try {
    let cvData = { fileName: "Not provided", url: "", path: "" };

    if (cvFile) {
      const uploadResult = await uploadCVToSupabase(cvFile, formData.fullName || formData['full-name']);
      if (uploadResult.success) {
        cvData = {
          fileName: cvFile.name,
          url: uploadResult.url,
          path: uploadResult.path
        };
      }
    }

    const payload = {
      full_name: formData.fullName || formData['full-name'],
      email: formData.email,
      phone: formData.phone,
      address: formData.address || "",
      license_type: formData.licenseType || formData['license-type'] || "",
      license_years: parseInt(formData.licenseYears || formData['license-years'] || 0),
      experience: formData.experience || "",
      availability: formData.availability || "",
      cv_url: cvData.url,
      cv_file_name: cvData.fileName,
      additional_info: formData.additionalInfo || formData['additional-info'] || "",
      status: "pending_review",
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('recruitment_submissions')
      .insert([payload])
      .select();

    if (error) throw error;

    const recordId = data && data[0] ? data[0].id : 'saved';
    console.log("✅ Recruitment form saved to Supabase:", recordId);

    const name = formData.fullName || formData['full-name'];
    sendWeb3FormsNotification('Recruitment Application', {
      name: name,
      email: formData.email,
      phone: formData.phone,
      message: `License: ${formData.licenseType || formData['license-type']}\nExperience: ${formData.experience}\nCV: ${cvData.url || 'Not uploaded'}`,
      submissionId: recordId
    });

    return { success: true, id: recordId };
  } catch (error) {
    console.error("❌ Error submitting recruitment form to Supabase:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Submit Booking Form
 */
export async function submitBookingForm(formData) {
  try {
    const payload = {
      collection_info: formData.collection || {},
      delivery_info: formData.delivery || {},
      service_type: formData.service || "",
      package_info: formData.package || {},
      special_requirements: formData.specialRequirements || "",
      status: "pending_confirmation",
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('booking_submissions')
      .insert([payload])
      .select();

    if (error) throw error;

    const recordId = data && data[0] ? data[0].id : 'saved';
    console.log("✅ Booking form saved to Supabase:", recordId);

    sendWeb3FormsNotification('New Booking Request', {
      name: formData.collection?.name || 'Customer',
      email: formData.collection?.email || '',
      phone: formData.collection?.phone || '',
      message: `Booking for ${formData.service}\nFrom: ${formData.collection?.address?.postcode || ''}\nTo: ${formData.delivery?.address?.postcode || ''}`,
      submissionId: recordId
    });

    return { success: true, id: recordId };
  } catch (error) {
    console.error("❌ Error submitting booking to Supabase:", error);
    return { success: false, error: error.message };
  }
}
