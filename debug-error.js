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
    data: response.ok ? await response.json() : { error: 'Request failed' }
  };
}

async function testError() {
  console.log('Testing invalid endpoint...');
  const result = await makeRequest('GET', '/api/invalid-endpoint');
  console.log('Status:', result.status);
  console.log('Success:', result.success);
  console.log('Expected: 404, Got:', result.status);
  console.log('Test passes:', result.status === 404);
}

testError();