/**
 * Supabase + Web3Forms Form Handlers
 * Handles Recruitment, Contact, and Booking form submissions
 */

import { supabase } from './supabase-config.js';

// Each Web3Forms access key is tied to a fixed destination inbox set in that form's dashboard Settings
const WEB3FORMS_ACCESS_KEY = '54f6a9cb-96e4-45f0-9e1d-6bf90b0bf179'; // "Sheera Transport General Enquiry" -> info@
const RECRUITMENT_WEB3FORMS_ACCESS_KEY = 'e8ccf6b6-aca3-48fb-8cba-26a45c54c717'; // "Sheera Transport Recruitment" -> recruit@
const NOTIFY_EMAIL = 'info@seehratransport.com';
const RECRUITMENT_NOTIFY_EMAIL = 'recruit@seehratransport.com';
const SECONDARY_NOTIFY_EMAIL = 'navjot.singh@5rv.digital';

/**
 * Send email notification via Web3Forms with fail-safe fallback
 */
// Web3Forms default file attachment limit (Pro feature)
const WEB3FORMS_MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

async function sendWeb3FormsNotification(formType, data, recipient = NOTIFY_EMAIL, accessKey = WEB3FORMS_ACCESS_KEY) {
  try {
    const buildFields = (to, includeCc = true) => ({
      access_key: accessKey,
      subject: `New ${formType} — Seehra Transport`,
      from_name: 'Seehra Transport Website',
      to,
      ...(includeCc ? { ccemail: SECONDARY_NOTIFY_EMAIL } : {}),
      'Form Type': formType,
      'name': data.name || 'Not provided',
      'email': data.email || 'Not provided',
      'phone': data.phone || 'Not provided',
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
 * /api/send-notification serverless function (Resend). On failure, records the failure
 * on the submission row instead of misrouting through Web3Forms (which can't target
 * an arbitrary customer address — see repo notes).
 */
async function sendApplicantNotification(type, to, name, table, recordId) {
  if (!to) return false;
  try {
    const response = await fetch('/api/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, to, name })
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      await markThankYouEmailFailed(table, recordId, result);
      return false;
    }
    console.log('✅ Applicant notification sent:', type);
    return true;
  } catch (error) {
    await markThankYouEmailFailed(table, recordId, error);
    return false;
  }
}

// Surfaces a failed thank-you email on the submission row for staff follow-up (requires
// a `thankyou_email_status` column — see repo notes for the SQL to add it).
async function markThankYouEmailFailed(table, recordId, reason) {
  console.warn('⚠️ Applicant thank-you email failed:', reason);
  if (!table || !recordId) return;
  try {
    await supabase.from(table).update({ thankyou_email_status: 'failed' }).eq('id', recordId);
  } catch (updateError) {
    console.warn('⚠️ Could not record thank-you email failure status:', updateError);
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

// Tracking metadata as its own group of Web3Forms fields, separate from Details/Additional Info.
function buildTrackingFields(formData) {
  return {
    'Tracking: Source URL': formData.source_url || 'Not provided',
    'Tracking: UTM Source': formData.utm_source || 'Not provided',
    'Tracking: UTM Medium': formData.utm_medium || 'Not provided',
    'Tracking: UTM Campaign': formData.utm_campaign || 'Not provided',
    'Tracking: UTM Content': formData.utm_content || 'Not provided'
  };
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
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    const recordId = data.id;
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
    sendApplicantNotification('contact-thankyou', formData.email, formData.name, 'contact_submissions', recordId);

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
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    const recordId = data.id;
    console.log("✅ Recruitment form saved to Supabase:", recordId);

    const name = formData.fullName || formData['full-name'];
    const recruitmentMessage = `Additional Info: ${formData.additionalInfo || formData['additional-info'] || "Not provided"}`;

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
        'CV': cvData.fileName,
        ...buildTrackingFields(formData)
      },
      message: recruitmentMessage,
      submissionId: recordId,
      attachment: cvFile
    }, RECRUITMENT_NOTIFY_EMAIL, RECRUITMENT_WEB3FORMS_ACCESS_KEY);

    // Thank-you email to the applicant
    sendApplicantNotification('recruitment-thankyou', formData.email, name, 'recruitment_submissions', recordId);

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
      .select()
      .single();

    if (error) throw error;

    const recordId = data.id;
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
