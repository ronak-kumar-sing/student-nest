/**
 * Test script for optimized OTP endpoints
 * Tests all OTP send and verify endpoints
 */

const API_BASE = 'http://localhost:3000/api/otp';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test email OTP send
const testEmailSend = async () => {
  console.log('🧪 Testing email OTP send...');
  try {
    const response = await fetch(`${API_BASE}/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        value: 'test@example.com',
        purpose: 'verification'
      })
    });

    const data = await response.json();
    console.log(`✅ Email send: ${response.status}`, data);
    return response.ok;
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return false;
  }
};

// Test phone OTP send
const testPhoneSend = async () => {
  console.log('🧪 Testing phone OTP send...');
  try {
    const response = await fetch(`${API_BASE}/phone/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        value: '9876543210', // Should auto-transform to +919876543210
        purpose: 'verification'
      })
    });

    const data = await response.json();
    console.log(`✅ Phone send: ${response.status}`, data);
    return response.ok;
  } catch (error) {
    console.error('❌ Phone send error:', error.message);
    return false;
  }
};

// Test unified OTP send
const testUnifiedSend = async () => {
  console.log('🧪 Testing unified OTP send...');
  try {
    const emailResponse = await fetch(`${API_BASE}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'test@example.com',
        type: 'email',
        purpose: 'verification'
      })
    });

    const emailData = await emailResponse.json();
    console.log(`✅ Unified email send: ${emailResponse.status}`, emailData);

    await delay(1000);

    const phoneResponse = await fetch(`${API_BASE}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: '+919876543210',
        type: 'sms',
        purpose: 'verification'
      })
    });

    const phoneData = await phoneResponse.json();
    console.log(`✅ Unified phone send: ${phoneResponse.status}`, phoneData);

    return emailResponse.ok && phoneResponse.ok;
  } catch (error) {
    console.error('❌ Unified send error:', error.message);
    return false;
  }
};

// Test OTP verification with invalid code
const testOTPVerification = async () => {
  console.log('🧪 Testing OTP verification (should fail with invalid code)...');
  try {
    const response = await fetch(`${API_BASE}/email/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        value: 'test@example.com',
        code: '123456' // Invalid code
      })
    });

    const data = await response.json();
    console.log(`✅ Email verify (invalid): ${response.status}`, data);

    // Should return 400 for invalid OTP
    return response.status === 400;
  } catch (error) {
    console.error('❌ Email verify error:', error.message);
    return false;
  }
};

// Test validation errors
const testValidationErrors = async () => {
  console.log('🧪 Testing validation errors...');
  try {
    const response = await fetch(`${API_BASE}/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        value: 'invalid-email', // Invalid email
        purpose: 'verification'
      })
    });

    const data = await response.json();
    console.log(`✅ Validation error test: ${response.status}`, data);

    // Should return 400 for validation error
    return response.status === 400;
  } catch (error) {
    console.error('❌ Validation error test failed:', error.message);
    return false;
  }
};

// Main test function
const runTests = async () => {
  console.log('🚀 Starting OTP endpoint tests...\n');

  const results = {
    emailSend: await testEmailSend(),
    phoneSend: await testPhoneSend(),
    unifiedSend: await testUnifiedSend(),
    verification: await testOTPVerification(),
    validation: await testValidationErrors()
  };

  console.log('\n📊 Test Results:');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });

  const allPassed = Object.values(results).every(result => result);
  console.log(`\n${allPassed ? '🎉' : '💥'} Overall: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
};

runTests();