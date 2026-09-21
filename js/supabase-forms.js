/**
 * Supabase + Web3Forms Form Handlers
 * Handles Recruitment, Contact, and Booking form submissions
 */

import { supabase } from './supabase-config.js';

// WEB3FORMS ACCESS KEY
const WEB3FORMS_ACCESS_KEY = 'e8ccf6b6-aca3-48fb-8cba-26a45c54c717';
const NOTIFY_EMAIL = 'info@seehratransport.com';
const RECRUITMENT_NOTIFY_EMAIL = 'recurit@seehratransport.com';
const SECONDARY_NOTIFY_EMAIL = 'navjot.singh@5rv.digital';

/**
 * Send email notification via Web3Forms with fail-safe fallback
 */
// Web3Forms default file attachment limit (Pro feature)
const WEB3FORMS_MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

async function sendWeb3FormsNotification(formType, data, recipient = NOTIFY_EMAIL) {
  try {
    const buildFields = (to, includeCc = true) => ({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `New ${formType} — Seehra Transport`,
      from_name: 'Seehra Transport Website',
      to,
      ...(includeCc ? { cc: SECONDARY_NOTIFY_EMAIL } : {}),
      'Form Type': formType,
      'Name': data.name || 'Not provided',
      'Email': data.email || 'Not provided',
      'Phone': data.phone || 'Not provided',
      ...(data.fields || {}),
      'Details': data.message || '',
      'Submission ID': data.submissionId || ''
    });

    const attachment = data.attachment && data.attachment.size <= WEB3FORMS_MAX_ATTACHMENT_BYTES
      ? data.attachment
      : null;
    if (data.attachment && !attachment) {
      console.warn('⚠️ Attachment exceeds Web3Forms 5MB limit — sending notification without it');
    }

    // Attachments require multipart/form-data; the browser sets its own Content-Type/boundary.
    const sendOne = (to, includeCc) => {
      const fields = buildFields(to, includeCc);
      if (attachment) {
        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
        formData.append('attachment', attachment, attachment.name);
        return fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
      }
      return fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(fields)
      });
    };

    const response = await sendOne(recipient, true);
    const resData = await response.json();
    if (resData.success) {
      if (formType === 'Recruitment Application' && recipient !== SECONDARY_NOTIFY_EMAIL) {
        sendOne(SECONDARY_NOTIFY_EMAIL, false)
          .catch(error => console.warn('⚠️ Secondary Web3Forms notification failed:', error));
      }
      console.log('✅ Web3Forms email notification sent successfully');
      return true;
    } else {
      console.warn('⚠️ Web3Forms notification returned warning:', resData.message);
      return false;
    }
  } catch (error) {
    console.warn('⚠️ Web3Forms email dispatch failed (data saved in Supabase):', error);
    return false;
  }
}

export async function submitBusinessEnquiryNotification(formData) {
  const sent = await sendWeb3FormsNotification('Business Enquiry', formData);
  return { success: sent, id: 'email-sent' };
}

/**
 * Send an applicant-facing notification (thank-you / approved / declined) via the
 * /api/send-notification serverless function. Fails silently so it never blocks a submission.
 */
async function sendApplicantNotification(type, to, name) {
  if (!to) return false;
  try {
    const response = await fetch('/api/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, to, name })
    });
    const result = await response.json();
    if (!response.ok) {
      return sendApplicantNotificationFallback(type, to, name, result);
    }
    if (!result.success || result.fallbackRequired) {
      return sendApplicantNotificationFallback(type, to, name, result);
    }
    console.log('✅ Applicant notification sent:', type);
    return true;
  } catch (error) {
    return sendApplicantNotificationFallback(type, to, name, error);
  }
}

const APPLICANT_NOTIFICATION_TEMPLATES = {
  'contact-thankyou': (name) => ({
    subject: 'Thank you for contacting Seehra Transport',
    message: `Hi ${name || 'there'},\n\nThank you for reaching out to Seehra Transport. We've received your enquiry and one of our team members will get back to you shortly.\n\nBest regards,\nSeehra Transport`
  }),
  'recruitment-thankyou': (name) => ({
    subject: 'Thank you for applying to Seehra Transport',
    message: `Hi ${name || 'there'},\n\nThank you for applying to join the Seehra Transport team. We've received your application and our recruitment team will review it shortly.\n\nBest regards,\nSeehra Transport Recruitment`
  }),
  'recruitment-approved': (name) => ({
    subject: 'Your application has been approved - Seehra Transport',
    message: `Hi ${name || 'there'},\n\nGreat news! Your application to join Seehra Transport has been approved. Our team will be in touch shortly with next steps.\n\nBest regards,\nSeehra Transport Recruitment`
  }),
  'recruitment-declined': (name) => ({
    subject: 'Update on your application - Seehra Transport',
    message: `Hi ${name || 'there'},\n\nThank you for your interest in joining Seehra Transport. After careful review, we won't be proceeding with your application at this time. We wish you the best in your search.\n\nBest regards,\nSeehra Transport Recruitment`
  })
};

async function sendApplicantNotificationFallback(type, to, name, reason) {
  const buildTemplate = APPLICANT_NOTIFICATION_TEMPLATES[type];
  if (!buildTemplate) return false;

  try {
    const { subject, message } = buildTemplate(name);
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject,
        from_name: 'Seehra Transport',
        to,
        email: to,
        name: name || 'Applicant',
        replyto: NOTIFY_EMAIL,
        message
      })
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      console.warn('⚠️ Applicant notification fallback failed:', result, reason);
      return false;
    }

    console.log('✅ Applicant notification sent via Web3Forms fallback:', type);
    return true;
  } catch (fallbackError) {
    console.warn('⚠️ Applicant notification dispatch failed:', fallbackError, reason);
    return false;
  }
}

function formatRecruitmentTracking(formData) {
  return [
    '',
    'Tracking Metadata:',
    `Source URL: ${formData.source_url || 'Not provided'}`,
    `UTM Source: ${formData.utm_source || 'Not provided'}`,
    `UTM Medium: ${formData.utm_medium || 'Not provided'}`,
    `UTM Campaign: ${formData.utm_campaign || 'Not provided'}`,
    `UTM Content: ${formData.utm_content || 'Not provided'}`
  ].join('\n');
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

    console.log('✅ CV uploaded to Supabase Storage:', filePath);
    return { success: true, path: filePath };
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
      .insert([payload]);

    if (error) throw error;

    const recordId = 'saved';
    console.log("✅ Contact form saved to Supabase:", recordId);

    // Trigger Web3Forms email (to staff)
    sendWeb3FormsNotification('Contact Form', {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: `Service: ${formData.service}\nCompany: ${formData.company || 'N/A'}\n\n${formData.message}`,
      submissionId: recordId
    });

    // Thank-you email to the person who submitted the enquiry
    sendApplicantNotification('contact-thankyou', formData.email, formData.name);

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
    if (!cvFile) {
      return { success: false, error: 'A CV upload is required.' };
    }

    let cvData = { fileName: "Not provided", url: "", path: "" };

    if (cvFile) {
      const uploadResult = await uploadCVToSupabase(cvFile, formData.fullName || formData['full-name']);
      if (uploadResult.success) {
        cvData = {
          fileName: cvFile.name,
          url: uploadResult.path,
          path: uploadResult.path
        };
      } else {
        return { success: false, error: 'CV upload failed. Please try again.' };
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
      additional_info: `Role: ${formData.role || "Not selected"}\n${formData.additionalInfo || formData['additional-info'] || ""}${formatRecruitmentTracking(formData)}`.trim(),
      status: "pending_review",
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('recruitment_submissions')
      .insert([payload]);

    if (error) throw error;

    const recordId = 'saved';
    console.log("✅ Recruitment form saved to Supabase:", recordId);

    const name = formData.fullName || formData['full-name'];
    const recruitmentMessage = `Additional Info: ${formData.additionalInfo || formData['additional-info'] || "Not provided"}` + formatRecruitmentTracking(formData);

    sendWeb3FormsNotification('Recruitment Application', {
      name: name,
      email: formData.email,
      phone: formData.phone,
      fields: {
        'Role': formData.role || 'Not selected',
        'Address': formData.address || 'Not provided',
        'License Type': formData.licenseType || formData['license-type'] || 'Not provided',
        'License Years': formData.licenseYears || formData['license-years'] || 'Not provided',
        'Experience': formData.experience || 'Not provided',
        'Availability': formData.availability || 'Not provided',
        'CV': cvData.fileName
      },
      message: recruitmentMessage,
      submissionId: recordId,
      attachment: cvFile
    }, RECRUITMENT_NOTIFY_EMAIL);

    // Thank-you email to the applicant
    sendApplicantNotification('recruitment-thankyou', formData.email, name);

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
      .insert([payload]);

    if (error) throw error;

    const recordId = 'saved';
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
