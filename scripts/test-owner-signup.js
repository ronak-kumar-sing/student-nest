const testOwnerSignup = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/owner/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: 'Test Owner',
        email: 'ronakkumar20062006@gmail.com',
        phone: '+917009097789',
        password: 'TestPassword123!',
        businessName: 'Test Property Business',
        businessType: 'company'
      })
    });

    const data = await response.json();
    console.log('📤 Owner Signup Response Status:', response.status);
    console.log('📤 Owner Signup Response Data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ Owner Signup successful!');
    } else {
      console.log('❌ Owner Signup failed:', data.error || 'Unknown error');
    }

  } catch (error) {
    console.error('🚨 Network Error:', error.message);
  }
};

testOwnerSignup();