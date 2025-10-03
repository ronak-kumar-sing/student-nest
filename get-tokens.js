// Get fresh authentication tokens
const BASE_URL = 'http://localhost:3000';

async function makeRequest(method, endpoint, body = null, token = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...(body && { body: JSON.stringify(body) })
  };

  const response = await fetch(url, options);
  return {
    success: response.ok,
    status: response.status,
    data: await response.json()
  };
}

async function getTokens() {
  console.log('🔐 Getting fresh authentication tokens...');

  // Login as student
  const studentLogin = await makeRequest('POST', '/api/auth/login', {
    identifier: 'student1@test.com',
    password: 'Test123@',
    role: 'student'
  });

  console.log('Full response:', JSON.stringify(studentLogin, null, 2));

  if (studentLogin.success) {
    const token = studentLogin.data?.data?.accessToken || studentLogin.data?.accessToken || studentLogin.data?.token;
    console.log('✅ Student Token:', token);
    return token;
  } else {
    console.log('❌ Student login failed:', studentLogin.data);
    return null;
  }
}

getTokens().catch(console.error);