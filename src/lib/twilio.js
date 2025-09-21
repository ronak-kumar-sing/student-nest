import twilio from 'twilio';

// Initialize Twilio client
const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export default client;

// Twilio service configurations
export const TWILIO_CONFIG = {
  SMS_FROM: process.env.TWILIO_PHONE_NUMBER,
  WHATSAPP_FROM: process.env.TWILIO_WHATSAPP_NUMBER,
  VERIFY_SID: process.env.TWILIO_VERIFY_SID,

  // Message templates
  OTP_MESSAGE: (otp) => `Your ${process.env.NEXT_PUBLIC_APP_NAME || 'Student Nest'} verification code is: ${otp}. Valid for 5 minutes.`,
  WELCOME_MESSAGE: (name) => `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || 'Student Nest'}, ${name}! Your account has been created successfully.`,
  MEETING_REQUEST: (studentName, propertyName) => `New meeting request from ${studentName} for ${propertyName}. Check your dashboard to respond.`,
  MEETING_CONFIRMED: (ownerName, date, time) => `Meeting confirmed with ${ownerName} on ${date} at ${time}. Details in your dashboard.`,
  VERIFICATION_STATUS: (status) => `Your account verification status has been updated to: ${status}. Check your dashboard for details.`,
};

// Helper function to format phone number for Twilio
export const formatPhoneNumber = (phone) => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Add country code if missing (assuming India +91)
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  // Add + if missing
  if (!phone.startsWith('+')) {
    return `+${cleaned}`;
  }

  return phone;
};

// SMS service wrapper
export const sendSMS = async (to, message, from = null) => {
  if (!client) {
    throw new Error('Twilio client not configured');
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: from || TWILIO_CONFIG.SMS_FROM,
      to: formatPhoneNumber(to)
    });

    return {
      success: true,
      messageSid: result.sid,
      status: result.status
    };
  } catch (error) {
    console.error('Twilio SMS Error:', error);
    throw new Error(`SMS sending failed: ${error.message}`);
  }
};

// WhatsApp service wrapper
export const sendWhatsApp = async (to, message) => {
  if (!client) {
    throw new Error('Twilio client not configured');
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: TWILIO_CONFIG.WHATSAPP_FROM,
      to: `whatsapp:${formatPhoneNumber(to)}`
    });

    return {
      success: true,
      messageSid: result.sid,
      status: result.status
    };
  } catch (error) {
    console.error('Twilio WhatsApp Error:', error);
    throw new Error(`WhatsApp sending failed: ${error.message}`);
  }
};

// Service health check
export const checkTwilioHealth = async () => {
  if (!client) {
    return { healthy: false, error: 'Client not configured' };
  }

  try {
    await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    return { healthy: true };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
};