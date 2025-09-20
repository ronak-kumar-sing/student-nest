import nodemailer from 'nodemailer';

const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'mock';
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@studentnest.local';

// Create transporter based on environment
let transporter;

if (EMAIL_SERVICE === 'mock') {
  // Mock transporter for development
  transporter = {
    sendMail: async (mailOptions) => {
      console.log('📧 Mock Email Sent:');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('Content:', mailOptions.text || mailOptions.html);
      return { messageId: 'mock-' + Date.now() };
    }
  };
} else {
  // Real SMTP transporter
  transporter = nodemailer.createTransporter({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

// Send OTP email
export const sendOTPEmail = async (email, otp, purpose = 'verification') => {
  const subject = getOTPEmailSubject(purpose);
  const html = getOTPEmailTemplate(otp, purpose);

  const mailOptions = {
    from: EMAIL_FROM,
    to: email,
    subject,
    html,
    text: `Your OTP for ${purpose} is: ${otp}. This code will expire in 5 minutes.`
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, resetUrl) => {
  const subject = 'Reset Your Student Nest Password';
  const html = getPasswordResetEmailTemplate(resetUrl);

  const mailOptions = {
    from: EMAIL_FROM,
    to: email,
    subject,
    html,
    text: `Reset your password by visiting: ${resetUrl}`
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, fullName, role) => {
  const subject = 'Welcome to Student Nest!';
  const html = getWelcomeEmailTemplate(fullName, role);

  const mailOptions = {
    from: EMAIL_FROM,
    to: email,
    subject,
    html,
    text: `Welcome to Student Nest, ${fullName}! Your ${role} account has been created successfully.`
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    // Don't throw error for welcome email, just log it
  }
};

// Email template functions
const getOTPEmailSubject = (purpose) => {
  switch (purpose) {
    case 'signup':
    case 'verification':
      return 'Verify Your Email - Student Nest';
    case 'login':
      return 'Login Verification - Student Nest';
    case 'password_reset':
      return 'Password Reset Verification - Student Nest';
    default:
      return 'Email Verification - Student Nest';
  }
};

const getOTPEmailTemplate = (otp, purpose) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #7c3aed; margin: 0;">Student Nest</h1>
      </div>

      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
        <h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2>
        <p style="font-size: 16px; margin-bottom: 30px;">
          Your verification code for ${purpose} is:
        </p>

        <div style="background-color: white; padding: 20px; border-radius: 8px; display: inline-block; margin-bottom: 30px;">
          <span style="font-size: 32px; font-weight: bold; color: #7c3aed; letter-spacing: 8px;">${otp}</span>
        </div>

        <p style="color: #666; font-size: 14px;">
          This code will expire in 5 minutes. Don't share this code with anyone.
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
        <p>© 2024 Student Nest. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

const getPasswordResetEmailTemplate = (resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #7c3aed; margin: 0;">Student Nest</h1>
      </div>

      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
        <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
        <p style="font-size: 16px; margin-bottom: 30px;">
          We received a request to reset your password. Click the button below to reset it:
        </p>

        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${resetUrl}"
             style="background-color: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Reset Password
          </a>
        </div>

        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour. If you didn't request this, please ignore this email.
        </p>

        <p style="color: #666; font-size: 12px; word-break: break-all;">
          Or copy and paste this link: ${resetUrl}
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
        <p>© 2024 Student Nest. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

const getWelcomeEmailTemplate = (fullName, role) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Student Nest</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #7c3aed; margin: 0;">Student Nest</h1>
      </div>

      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
        <h2 style="color: #333; margin-bottom: 20px;">Welcome to Student Nest, ${fullName}!</h2>
        <p style="font-size: 16px; margin-bottom: 20px;">
          Your ${role} account has been created successfully. We're excited to have you join our community!
        </p>

        ${role === 'student' ? `
          <p style="font-size: 16px; margin-bottom: 20px;">
            You can now:
          </p>
          <ul style="margin-bottom: 20px;">
            <li>Search for accommodation</li>
            <li>Connect with property owners</li>
            <li>Schedule property visits</li>
            <li>Find roommates</li>
          </ul>
        ` : `
          <p style="font-size: 16px; margin-bottom: 20px;">
            To get started, please complete your verification process to list your properties.
          </p>
        `}

        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="background-color: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Go to Dashboard
          </a>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
        <p>© 2024 Student Nest. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};