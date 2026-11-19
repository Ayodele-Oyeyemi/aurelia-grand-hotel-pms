/**
 * Auth Routes — OTP Email Verification
 * POST /api/auth/send-code
 * POST /api/auth/verify-code
 * POST /api/auth/logout
 */
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory OTP store: { email -> { code, expiresAt, userData } }
const otpStore = new Map();
// In-memory session store: { token -> { user } }
const sessionStore = new Map();

// Sandboxed dev code map — always works for testing
const DEV_SANDBOX_CODE = '123456';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendEmailOTP(email, code, userName) {
  const nodemailer = require('nodemailer');
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return { sent: false, reason: 'SMTP not configured' };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: { user: smtpUser, pass: smtpPass }
  });

  await transporter.sendMail({
    from: `"The Aurelia Grand & Suites" <${smtpUser}>`,
    to: email,
    subject: 'Your Aurelia Grand Verification Code',
    html: `
      <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; background: #0A0D14; color: #F5F5F5; padding: 40px; border-radius: 12px;">
        <h2 style="color: #D4AF37; font-size: 24px; margin-bottom: 8px;">THE AURELIA GRAND & SUITES</h2>
        <p style="color: #9CA3AF; font-size: 13px; margin-bottom: 32px;">Victoria Island, Lagos • Five-Star Hospitality</p>
        <p style="font-size: 15px;">Dear ${userName || 'Valued Guest'},</p>
        <p style="font-size: 14px; color: #9CA3AF;">Your 6-digit email verification code is:</p>
        <div style="background: #121722; border: 1px solid #D4AF37; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #D4AF37;">${code}</span>
        </div>
        <p style="font-size: 13px; color: #9CA3AF;">This code expires in 10 minutes. Do not share it.</p>
      </div>
    `
  });

  return { sent: true };
}

// POST /api/auth/send-code
router.post('/send-code', async (req, res) => {
  try {
    const { email, name, phone, password, mode } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const code = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore.set(email.toLowerCase(), { code, expiresAt, userData: { email, name, phone, password, mode } });

    // Try to send real email
    let emailResult = { sent: false };
    try {
      emailResult = await sendEmailOTP(email, code, name);
    } catch (e) {
      console.warn('[Auth] Email send failed:', e.message);
    }

    // Always return sandbox code in development
    const isDev = process.env.NODE_ENV !== 'production';
    
    res.json({
      success: true,
      message: emailResult.sent
        ? `Verification code sent to ${email}`
        : `Email delivery not configured. Use developer sandbox code.`,
      emailSent: emailResult.sent,
      sandboxCode: isDev ? code : undefined, // expose in dev for testing
      sandboxNote: !emailResult.sent ? 'Developer Sandbox: Use the code shown in the toast notification below.' : undefined,
      expiresInMinutes: 10
    });
  } catch (err) {
    console.error('[Auth] send-code error:', err);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// POST /api/auth/verify-code
router.post('/verify-code', (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

    const record = otpStore.get(email.toLowerCase());
    if (!record) return res.status(400).json({ error: 'No verification code found for this email. Please request a new code.' });
    if (Date.now() > record.expiresAt) {
      otpStore.delete(email.toLowerCase());
      return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
    }
    if (record.code !== code.toString()) {
      return res.status(400).json({ error: 'Invalid verification code. Please try again.' });
    }

    // Code correct — create session
    const token = uuidv4();
    const userData = record.userData || {};
    const user = {
      id: uuidv4(),
      name: userData.name || email.split('@')[0],
      email: email.toLowerCase(),
      phone: userData.phone || null,
      vip_tier: 'member',
      created_at: new Date().toISOString()
    };
    sessionStore.set(token, { user, createdAt: Date.now() });
    otpStore.delete(email.toLowerCase());

    res.json({
      success: true,
      message: 'Email verified successfully. Welcome to The Aurelia Grand!',
      token,
      user
    });
  } catch (err) {
    console.error('[Auth] verify-code error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) sessionStore.delete(token);
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !sessionStore.has(token)) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { user } = sessionStore.get(token);
  res.json({ success: true, user });
});

module.exports = router;
