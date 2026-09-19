// Vercel Serverless Function
// Sends applicant-facing transactional emails via Resend (thank-you / approved / declined)

const TEMPLATES = {
  'contact-thankyou': (name) => ({
    subject: 'Thank you for contacting Seehra Transport',
    html: `<p>Hi ${name || 'there'},</p>
      <p>Thank you for reaching out to Seehra Transport. We've received your enquiry and one of our team members will get back to you shortly.</p>
      <p>Best regards,<br>Seehra Transport</p>`
  }),
  'recruitment-thankyou': (name) => ({
    subject: 'Thank you for applying to Seehra Transport',
    html: `<p>Hi ${name || 'there'},</p>
      <p>Thank you for applying to join the Seehra Transport team. We've received your application and our recruitment team will review it shortly.</p>
      <p>Best regards,<br>Seehra Transport Recruitment</p>`
  }),
  'recruitment-approved': (name) => ({
    subject: 'Your application has been approved - Seehra Transport',
    html: `<p>Hi ${name || 'there'},</p>
      <p>Great news! Your application to join Seehra Transport has been approved. Our team will be in touch shortly with next steps.</p>
      <p>Best regards,<br>Seehra Transport Recruitment</p>`
  }),
  'recruitment-declined': (name) => ({
    subject: 'Update on your application - Seehra Transport',
    html: `<p>Hi ${name || 'there'},</p>
      <p>Thank you for your interest in joining Seehra Transport. After careful review, we won't be proceeding with your application at this time. We wish you the best in your search.</p>
      <p>Best regards,<br>Seehra Transport Recruitment</p>`
  })
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, to, name } = req.body || {};

  if (!type || !to) {
    return res.status(400).json({ error: 'Missing type or recipient' });
  }

  const buildTemplate = TEMPLATES[type];
  if (!buildTemplate) {
    return res.status(400).json({ error: 'Unknown notification type' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Seehra Transport <onboarding@resend.dev>';

  const { subject, html } = buildTemplate(name);

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    return res.status(503).json({ error: 'Email service not configured', fallbackRequired: true });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(502).json({ error: 'Failed to send email', details: data });
    }

    return res.status(200).json({ success: true, provider: 'resend', id: data.id });
  } catch (error) {
    console.error('Notification send failed:', error);
    return res.status(500).json({ error: error.message });
  }
}
