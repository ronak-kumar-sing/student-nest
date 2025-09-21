import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'mock';
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@studentnest.local';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

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
} else if (EMAIL_SERVICE === 'gmail' && process.env.GMAIL_USER) {
  // Gmail SMTP transporter
  transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
} else if (EMAIL_SERVICE === 'smtp') {
  // Custom SMTP transporter
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

// Enhanced email sending function
export const sendEmail = async ({ to, subject, text, html, from = null }) => {
  try {
    if (EMAIL_SERVICE === 'sendgrid' && process.env.SENDGRID_API_KEY) {
      // Use SendGrid with anti-spam headers
      await sgMail.send({
        to,
        from: from || process.env.SENDGRID_FROM_EMAIL || EMAIL_FROM,
        subject,
        text,
        html,
        // Anti-spam headers
        headers: {
          'X-Mailer': 'Student Nest Application',
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'High',
          'List-Unsubscribe': '<mailto:unsubscribe@studentnest.in>',
          'Return-Path': from || process.env.SENDGRID_FROM_EMAIL || EMAIL_FROM,
        },
        // Categories for SendGrid analytics
        categories: ['otp', 'authentication', 'student-nest'],
        // Custom arguments for tracking
        customArgs: {
          app: 'student-nest',
          environment: process.env.NODE_ENV || 'development'
        }
      });
      console.log('✅ Email sent via SendGrid to:', to);
      return { success: true, provider: 'sendgrid' };
    } else if (transporter) {
      // Use configured transporter (Gmail, SMTP, or Mock)
      const result = await transporter.sendMail({
        from: from || EMAIL_FROM,
        to,
        subject,
        text,
        html,
        // Anti-spam headers for other providers
        headers: {
          'X-Mailer': 'Student Nest Application',
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'High'
        }
      });
      console.log('✅ Email sent via', EMAIL_SERVICE, 'to:', to);
      return { success: true, messageId: result.messageId, provider: EMAIL_SERVICE };
    } else {
      throw new Error('No email service configured');
    }
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

// Send OTP email
export const sendOTPEmail = async (email, otp, purpose = 'verification') => {
  const subject = getOTPEmailSubject(purpose);
  const html = getOTPEmailTemplate(otp, purpose);

  const mailOptions = {
    to: email,
    subject,
    html,
    text: `Your OTP for ${purpose} is: ${otp}. This code will expire in 5 minutes.`
  };

  try {
    const result = await sendEmail(mailOptions);
    console.log('✅ OTP email sent successfully:', result.messageId || 'sendgrid');
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
    to: email,
    subject,
    html,
    text: `Reset your password by clicking this link: ${resetUrl}`
  };

  try {
    const result = await sendEmail(mailOptions);
    console.log('✅ Password reset email sent successfully:', result.messageId || 'sendgrid');
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
    to: email,
    subject,
    html,
    text: `Welcome to Student Nest, ${fullName}! Your ${role} account has been created successfully.`
  };

  try {
    const result = await sendEmail(mailOptions);
    console.log('✅ Welcome email sent successfully:', result.messageId || 'sendgrid');
    return result;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    // Don't throw error for welcome email, just log it
  }
};

// Send meeting notification email
export const sendMeetingNotificationEmail = async (email, type, data) => {
  let subject, html, text;

  switch (type) {
    case 'request':
      subject = 'New Meeting Request - Student Nest';
      html = getMeetingRequestEmailTemplate(data);
      text = `New meeting request from ${data.studentName} for ${data.propertyName}`;
      break;
    case 'confirmed':
      subject = 'Meeting Confirmed - Student Nest';
      html = getMeetingConfirmedEmailTemplate(data);
      text = `Meeting confirmed with ${data.ownerName} on ${data.date} at ${data.time}`;
      break;
    case 'cancelled':
      subject = 'Meeting Cancelled - Student Nest';
      html = getMeetingCancelledEmailTemplate(data);
      text = `Your meeting with ${data.otherParty} has been cancelled`;
      break;
    default:
      subject = 'Meeting Update - Student Nest';
      html = `<p>${data.message}</p>`;
      text = data.message;
  }

  const mailOptions = {
    to: email,
    subject,
    html,
    text
  };

  try {
    const result = await sendEmail(mailOptions);
    console.log('✅ Meeting notification email sent successfully:', result.messageId || 'sendgrid');
    return result;
  } catch (error) {
    console.error('❌ Error sending meeting notification email:', error);
    // Don't throw error for notifications, just log
  }
};

// Send verification status email
export const sendVerificationStatusEmail = async (email, status, fullName) => {
  const subject = 'Verification Status Update - Student Nest';
  const html = getVerificationStatusEmailTemplate(status, fullName);
  const text = `Your account verification status has been updated to: ${status}`;

  const mailOptions = {
    to: email,
    subject,
    html,
    text
  };

  try {
    const result = await sendEmail(mailOptions);
    console.log('✅ Verification status email sent successfully:', result.messageId || 'sendgrid');
    return result;
  } catch (error) {
    console.error('❌ Error sending verification status email:', error);
    // Don't throw error for notifications, just log
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
      <title>Student Nest - Email Verification</title>
      <style>
        body { margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #7c3aed; padding: 20px; text-align: center; }
        .content { padding: 40px 30px; }
        .otp-box { background-color: #f8f9ff; border: 2px solid #7c3aed; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: white; margin: 0; font-size: 24px;">Student Nest</h1>
          <p style="color: #e2e8f0; margin: 5px 0 0 0;">Connecting Students to Perfect Accommodations</p>
        </div>

        <div class="content">
          <h2 style="color: #333; margin-bottom: 20px; font-size: 20px;">Verify Your Email Address</h2>

          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Hello! We received a request to verify your email address for Student Nest.
            Please use the verification code below to complete your ${purpose}:
          </p>

          <div class="otp-box">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your Verification Code</p>
            <div style="font-size: 36px; font-weight: bold; color: #7c3aed; letter-spacing: 6px; font-family: 'Courier New', monospace;">${otp}</div>
          </div>

          <div style="background-color: #fef3cd; border: 1px solid #fecf47; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>Important:</strong> This code expires in 5 minutes and is for one-time use only.
              Never share this code with anyone. Student Nest staff will never ask for your verification code.
            </p>
          </div>

          <p style="color: #666; font-size: 14px; line-height: 1.5;">
            If you didn't request this verification, please ignore this email or contact our support team
            if you have concerns about your account security.
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 13px; margin: 0;">
              Best regards,<br>
              The Student Nest Team
            </p>
          </div>
        </div>

        <div class="footer">
          <p style="margin: 0;">© 2024 Student Nest Platform. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">This is an automated message. Please do not reply to this email.</p>
        </div>
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

// Meeting request email template
const getMeetingRequestEmailTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Meeting Request</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #7c3aed;">New Meeting Request</h2>
      <p>Hello,</p>
      <p><strong>${data.studentName}</strong> has requested a meeting to view <strong>${data.propertyName}</strong>.</p>
      <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h3>Meeting Details:</h3>
        <p><strong>Date:</strong> ${data.requestedDate}</p>
        <p><strong>Time:</strong> ${data.requestedTime}</p>
        <p><strong>Type:</strong> ${data.meetingType}</p>
        ${data.studentNotes ? `<p><strong>Notes:</strong> ${data.studentNotes}</p>` : ''}
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/owner/meetings"
           style="background-color: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Respond to Request
        </a>
      </div>
    </body>
    </html>
  `;
};

// Meeting confirmed email template
const getMeetingConfirmedEmailTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Meeting Confirmed</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #10b981;">Meeting Confirmed!</h2>
      <p>Great news! Your meeting has been confirmed.</p>
      <div style="background: #f0fdf4; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #10b981;">
        <h3>Meeting Details:</h3>
        <p><strong>With:</strong> ${data.ownerName}</p>
        <p><strong>Property:</strong> ${data.propertyName}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <p><strong>Type:</strong> ${data.meetingType}</p>
        ${data.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${data.meetingLink}">${data.meetingLink}</a></p>` : ''}
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/meetings"
           style="background-color: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Meeting Details
        </a>
      </div>
    </body>
    </html>
  `;
};

// Meeting cancelled email template
const getMeetingCancelledEmailTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Meeting Cancelled</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #ef4444;">Meeting Cancelled</h2>
      <p>We're sorry to inform you that your meeting has been cancelled.</p>
      <div style="background: #fef2f2; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ef4444;">
        <p><strong>Meeting with:</strong> ${data.otherParty}</p>
        <p><strong>Originally scheduled:</strong> ${data.originalDate} at ${data.originalTime}</p>
        ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ''}
      </div>
      <p>You can schedule a new meeting anytime from your dashboard.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
           style="background-color: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Go to Dashboard
        </a>
      </div>
    </body>
    </html>
  `;
};

// Verification status email template
const getVerificationStatusEmailTemplate = (status, fullName) => {
  const statusColors = {
    'verified': { color: '#10b981', bg: '#f0fdf4' },
    'rejected': { color: '#ef4444', bg: '#fef2f2' },
    'in-review': { color: '#f59e0b', bg: '#fffbeb' },
    'pending': { color: '#6b7280', bg: '#f9fafb' }
  };

  const statusInfo = statusColors[status] || statusColors['pending'];

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verification Status Update</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #7c3aed;">Verification Status Update</h2>
      <p>Hello ${fullName},</p>
      <p>Your account verification status has been updated.</p>
      <div style="background: ${statusInfo.bg}; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid ${statusInfo.color};">
        <h3 style="margin-top: 0; color: ${statusInfo.color};">Status: ${status.toUpperCase()}</h3>
        ${status === 'verified' ? '<p>Congratulations! Your account is now fully verified.</p>' : ''}
        ${status === 'rejected' ? '<p>Unfortunately, your verification was not successful. Please check your dashboard for details and resubmit if needed.</p>' : ''}
        ${status === 'in-review' ? '<p>Your documents are currently being reviewed. We\'ll update you once the review is complete.</p>' : ''}
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
           style="background-color: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Dashboard
        </a>
      </div>
    </body>
    </html>
  `;
};