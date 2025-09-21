const testStudentSignup = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/student/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: 'Test Student',
        email: 'ronakkumar20062006@gmail.com',
        phone: '+917009097789',
        password: 'TestPassword123!',
        collegeId: 'COLLEGE001',
        collegeName: 'Test College'
      })
    });

    const data = await response.json();
    console.log('📤 Student Signup Response Status:', response.status);
    console.log('📤 Student Signup Response Data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ Student Signup successful!');
    } else {
      console.log('❌ Student Signup failed:', data.error || 'Unknown error');
    }

  } catch (error) {
    console.error('🚨 Network Error:', error.message);
  }
};

testStudentSignup();