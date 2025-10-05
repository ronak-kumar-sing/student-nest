// Simple test script to check verification API
// Run this in the browser console on any page with user logged in

async function testVerificationAPI() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  console.log('=== Verification API Test ===');
  console.log('Token:', token ? 'Present (' + token.length + ' chars)' : 'Missing');
  console.log('User:', user ? 'Present' : 'Missing');

  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log('User data:', userData);
    } catch (e) {
      console.log('User data parse error:', e);
    }
  }

  if (!token) {
    console.log('❌ No token found - user not logged in');
    return;
  }

  try {
    // Test the requirements API
    console.log('\n--- Testing /api/verify/requirements ---');
    const response = await fetch('/api/verify/requirements', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('Response data:', data);

    if (data.success) {
      console.log('✅ Verification API working correctly');
      console.log('User role:', data.data.user.role);
      console.log('Verification required:', data.data.requirements.verificationRequired);
      console.log('Is verified:', data.data.user.isIdentityVerified);
    } else {
      console.log('❌ API returned error:', data.error);
    }

  } catch (error) {
    console.log('❌ Network error:', error);
  }
}

// Auto-run the test
testVerificationAPI();