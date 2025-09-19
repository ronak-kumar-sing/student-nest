const PHONE_SERVICE = process.env.PHONE_SERVICE || 'mock';
const PHONE_OTP_SENDER_ID = process.env.PHONE_OTP_SENDER_ID || 'STDNST';

// Mock SMS service for development
const mockSMSService = {
  sendSMS: async (phone, message) => {
    console.log('📱 Mock SMS Sent:');
    console.log('To:', phone);
    console.log('Message:', message);
    return { messageId: 'mock-sms-' + Date.now(), success: true };
  }
};

// Send OTP via SMS
export const sendOTPSMS = async (phone, otp, purpose = 'verification') => {
  const message = getOTPSMSMessage(otp, purpose);

  try {
    let result;

    if (PHONE_SERVICE === 'mock') {
      result = await mockSMSService.sendSMS(phone, message);
    } else {
      // Implement real SMS service here (Twilio, AWS SNS, etc.)
      // For now, using mock service
      result = await mockSMSService.sendSMS(phone, message);
    }

    console.log('✅ OTP SMS sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Error sending OTP SMS:', error);
    throw new Error('Failed to send OTP SMS');
  }
};

// Send welcome SMS
export const sendWelcomeSMS = async (phone, fullName, role) => {
  const message = `Welcome to Student Nest, ${fullName}! Your ${role} account is ready. Start exploring accommodation options now.`;

  try {
    let result;

    if (PHONE_SERVICE === 'mock') {
      result = await mockSMSService.sendSMS(phone, message);
    } else {
      // Implement real SMS service here
      result = await mockSMSService.sendSMS(phone, message);
    }

    console.log('✅ Welcome SMS sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Error sending welcome SMS:', error);
    // Don't throw error for welcome SMS, just log it
  }
};

// SMS message templates
const getOTPSMSMessage = (otp, purpose) => {
  switch (purpose) {
    case 'signup':
      return `Your Student Nest signup OTP is ${otp}. Valid for 5 minutes. Don't share this code.`;
    case 'login':
      return `Your Student Nest login OTP is ${otp}. Valid for 5 minutes. Don't share this code.`;
    case 'password-reset':
      return `Your Student Nest password reset OTP is ${otp}. Valid for 5 minutes. Don't share this code.`;
    default:
      return `Your Student Nest verification OTP is ${otp}. Valid for 5 minutes. Don't share this code.`;
  }
};

// Validate phone number format
export const validatePhoneNumber = (phone) => {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Check if it's a valid Indian mobile number
  const indianMobileRegex = /^(\+91|91)?[6-9]\d{9}$/;

  return indianMobileRegex.test(cleaned);
};

// Format phone number for display
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/[^\d+]/g, '');

  if (cleaned.startsWith('+91')) {
    const number = cleaned.substring(3);
    return `+91 ${number.substring(0, 5)} ${number.substring(5)}`;
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    const number = cleaned.substring(2);
    return `+91 ${number.substring(0, 5)} ${number.substring(5)}`;
  } else if (cleaned.length === 10) {
    return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
  }

  return phone;
};