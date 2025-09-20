#!/usr/bin/env node

// Simple API status checker
const API_BASE = 'http://localhost:3000';

async function checkEndpoint(url, method = 'GET', headers = {}, body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const isJSON = response.headers.get('content-type')?.includes('application/json');

    let data;
    if (isJSON) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text.substring(0, 200) + (text.length > 200 ? '...' : '');
    }

    return {
      url,
      status: response.status,
      success: response.ok,
      isJSON,
      data
    };
  } catch (error) {
    return {
      url,
      status: 'ERROR',
      success: false,
      error: error.message
    };
  }
}

async function main() {
  console.log('🔍 Checking API Endpoints Status\n');

  // Test login first
  console.log('1. Testing Authentication...');
  const loginResult = await checkEndpoint(`${API_BASE}/api/auth/login`, 'POST', {}, {
    identifier: 'priya.sharma@gmail.com',
    password: 'Student123!',
    role: 'student'
  });

  console.log(`   Login: ${loginResult.success ? '✅' : '❌'} (${loginResult.status})`);

  if (!loginResult.success) {
    console.log('   ❌ Cannot proceed without authentication');
    return;
  }

  const token = loginResult.data.accessToken;
  console.log('   🔑 JWT Token obtained');

  // Test profile endpoints
  console.log('\n2. Testing Profile Endpoints...');

  const endpoints = [
    { url: `${API_BASE}/api/profile/student`, method: 'GET', name: 'Get Student Profile' },
    { url: `${API_BASE}/api/profile/student`, method: 'PUT', name: 'Update Student Profile', body: { bio: 'Test bio update' } },
    { url: `${API_BASE}/api/profile/student/preferences`, method: 'GET', name: 'Get Student Preferences' },
    { url: `${API_BASE}/api/profile/student/preferences`, method: 'PUT', name: 'Update Student Preferences',
      body: { roomType: 'private', budget: { min: 5000, max: 10000 } } },
    { url: `${API_BASE}/api/profile/student/verification`, method: 'GET', name: 'Get Student Verification' }
  ];

  for (const endpoint of endpoints) {
    const result = await checkEndpoint(
      endpoint.url,
      endpoint.method,
      { Authorization: `Bearer ${token}` },
      endpoint.body
    );

    console.log(`   ${endpoint.name}: ${result.success ? '✅' : '❌'} (${result.status})`);

    if (!result.success && !result.isJSON) {
      console.log(`      ⚠️  Non-JSON response detected (likely HTML error page)`);
    }

    if (result.error) {
      console.log(`      ❌ Error: ${result.error}`);
    }
  }

  // Test owner endpoints
  console.log('\n3. Testing Owner Login...');
  const ownerLoginResult = await checkEndpoint(`${API_BASE}/api/auth/login`, 'POST', {}, {
    identifier: 'vikram.patel@gmail.com',
    password: 'Owner123!',
    role: 'owner'
  });

  console.log(`   Owner Login: ${ownerLoginResult.success ? '✅' : '❌'} (${ownerLoginResult.status})`);

  if (ownerLoginResult.success) {
    const ownerToken = ownerLoginResult.data.accessToken;

    console.log('\n4. Testing Owner Profile Endpoints...');
    const ownerEndpoints = [
      { url: `${API_BASE}/api/profile/owner`, method: 'GET', name: 'Get Owner Profile' },
      { url: `${API_BASE}/api/profile/owner`, method: 'PUT', name: 'Update Owner Profile', body: { bio: 'Test owner bio' } },
      { url: `${API_BASE}/api/profile/owner/verification`, method: 'GET', name: 'Get Owner Verification' }
    ];

    for (const endpoint of ownerEndpoints) {
      const result = await checkEndpoint(
        endpoint.url,
        endpoint.method,
        { Authorization: `Bearer ${ownerToken}` },
        endpoint.body
      );

      console.log(`   ${endpoint.name}: ${result.success ? '✅' : '❌'} (${result.status})`);

      if (!result.success && !result.isJSON) {
        console.log(`      ⚠️  Non-JSON response detected (likely HTML error page)`);
      }
    }
  }

  console.log('\n📊 API Status Check Complete!');
}

main().catch(console.error);