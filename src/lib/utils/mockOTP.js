// Mock OTP service for development when Twilio is not available
// This should only be used in development/testing environments

const MOCK_OTP = '123456'; // Fixed OTP for development
const MOCK_DELAY = 1000; // 1 second delay to simulate real SMS

export const mockSendOTP = async (phoneNumber) => {
  console.log(`📱 MOCK SMS: Sending OTP ${MOCK_OTP} to ${phoneNumber}`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

  console.log(`✅ MOCK SMS: OTP sent successfully to ${phoneNumber}`);

  return {
    success: true,
    message: 'OTP sent successfully (Mock)',
    otp: MOCK_OTP, // In real implementation, this would not be returned
    mockMode: true
  };
};

export const mockVerifyOTP = async (phoneNumber, otp) => {
  console.log(`🔍 MOCK VERIFY: Checking OTP ${otp} for ${phoneNumber}`);

  const isValid = otp === MOCK_OTP;

  if (isValid) {
    console.log(`✅ MOCK VERIFY: OTP ${otp} is valid for ${phoneNumber}`);
  } else {
    console.log(`❌ MOCK VERIFY: OTP ${otp} is invalid for ${phoneNumber}. Expected: ${MOCK_OTP}`);
  }

  return {
    success: isValid,
    message: isValid ? 'OTP verified successfully (Mock)' : 'Invalid OTP (Mock)',
    mockMode: true
  };
};

// Check if we should use mock mode
export const shouldUseMockOTP = () => {
  // Use mock in development or when Twilio is not properly configured
  const isDevelopment = process.env.NODE_ENV === 'development';
  const hasTwilioConfig = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN;

  return isDevelopment || !hasTwilioConfig;
};