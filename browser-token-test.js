// BROWSER CONSOLE TEST - Copy and paste this into your browser console on the profile page

console.log('🔍 Frontend Token Debug Test');
console.log('==========================');

// Check if token exists in localStorage
const token = localStorage.getItem('token');
console.log('1. Token in localStorage:', token ? 'Found' : 'NOT FOUND');
if (token) {
  console.log('   Token preview:', token.substring(0, 50) + '...');
}

// Check if user data exists
const userData = localStorage.getItem('user');
console.log('2. User data in localStorage:', userData ? 'Found' : 'NOT FOUND');
if (userData) {
  try {
    const user = JSON.parse(userData);
    console.log('   User role:', user.role);
    console.log('   User type:', user.userType);
  } catch (e) {
    console.log('   User data parse error:', e.message);
  }
}

// Test API call manually
if (token) {
  console.log('\n3. Testing API call...');
  fetch('/api/profile/student', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('   API Response Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('   API Response:', data.success ? 'SUCCESS' : 'FAILED');
    if (data.success) {
      console.log('   Profile Name:', data.data?.profile?.fullName);
    } else {
      console.log('   Error:', data.error);
    }
  })
  .catch(error => {
    console.log('   API Error:', error.message);
  });
} else {
  console.log('\n3. Cannot test API - no token found');
  console.log('   You need to log in first!');
}

console.log('\n💡 If no token found, please:');
console.log('   1. Go to /login or /student/login');
console.log('   2. Log in with: priya.sharma@gmail.com / Student123!');
console.log('   3. Return to this profile page');
console.log('   4. Run this test again');