import { createHmac, timingSafeEqual } from 'node:crypto';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://othoelbkughxozgamynr.supabase.co';
const SESSION_COOKIE = 'seehra_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 8;

function isConfigured() {
  return Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY
    && process.env.STAFF_ADMIN_EMAIL
    && process.env.STAFF_ADMIN_PASSWORD
  );
}

function encodeSession(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function signSession(payload) {
  return createHmac('sha256', process.env.STAFF_ADMIN_PASSWORD).update(payload).digest('base64url');
}

function createSession(email) {
  const payload = encodeSession({ email, expiresAt: Date.now() + SESSION_MAX_AGE * 1000 });
  return `${payload}.${signSession(payload)}`;
}

function getSession(req) {
  const cookie = String(req.headers.cookie || '').split(';').map(value => value.trim())
    .find(value => value.startsWith(`${SESSION_COOKIE}=`));
  if (!cookie) return null;

  const [payload, signature] = cookie.slice(SESSION_COOKIE.length + 1).split('.');
  if (!payload || !signature) return null;

  const expected = Buffer.from(signSession(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return session.expiresAt > Date.now() && session.email === process.env.STAFF_ADMIN_EMAIL ? session : null;
  } catch {
    return null;
  }
}

function setSessionCookie(res, email) {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${createSession(email)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_MAX_AGE}`);
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
}

function serviceHeaders() {
  return {
    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json'
  };
}

export default async function handler(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({ error: 'Recruitment data service is not configured.' });
  }

  if (req.method === 'POST' && req.body?.action === 'login') {
    const { email, password } = req.body;
    if (email?.toLowerCase() !== process.env.STAFF_ADMIN_EMAIL.toLowerCase()
      || password !== process.env.STAFF_ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    setSessionCookie(res, process.env.STAFF_ADMIN_EMAIL);
    return res.status(200).json({ success: true, email: process.env.STAFF_ADMIN_EMAIL });
  }

  if (req.method === 'POST' && req.body?.action === 'logout') {
    clearSessionCookie(res);
    return res.status(200).json({ success: true });
  }

  const session = getSession(req);
  if (!session) return res.status(401).json({ error: 'Unauthorised' });

  if (req.method === 'GET' && req.query.session) {
    return res.status(200).json({ email: session.email });
  }

  if (req.method === 'GET' && req.query.cv) {
    const application = await fetch(`${SUPABASE_URL}/rest/v1/recruitment_submissions?cv_url=eq.${encodeURIComponent(req.query.cv)}&select=id&limit=1`, {
      headers: serviceHeaders()
    });
    const applications = await application.json();
    if (!application.ok || !applications.length) return res.status(404).json({ error: 'CV not found.' });

    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/cv-uploads`, {
      method: 'POST',
      headers: serviceHeaders(),
      body: JSON.stringify({ expiresIn: 300, paths: [req.query.cv] })
    });
    const result = await response.json();
    const signed = result?.[0]?.signedURL || result?.[0]?.signedUrl;
    if (!response.ok || !signed) return res.status(404).json({ error: 'CV not found.' });
    return res.redirect(`${SUPABASE_URL}/storage/v1${signed}`);
  }

  if (req.method === 'GET') {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/recruitment_submissions?select=*&order=created_at.desc`, {
      headers: serviceHeaders()
    });
    return res.status(response.status).json(await response.json());
  }

  if (req.method === 'PATCH') {
    const { id, status } = req.body || {};
    if (!id || !['approved', 'declined', 'pending_review'].includes(status)) {
      return res.status(400).json({ error: 'Invalid application update.' });
    }
    const response = await fetch(`${SUPABASE_URL}/rest/v1/recruitment_submissions?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { ...serviceHeaders(), Prefer: 'return=minimal' },
      body: JSON.stringify({ status })
    });
    return res.status(response.status).json({ success: response.ok });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}