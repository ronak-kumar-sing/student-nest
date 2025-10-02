#!/usr/bin/env node

const axios = require('axios');

async function testDemoLogin() {
  console.log('=== TESTING DEMO ACCOUNT LOGINS ===\n');

  const baseURL = 'http://localhost:3000';

  // Test student login
  console.log('🎓 Testing Student Demo Login:');
  try {
    const studentResponse = await axios.post(`${baseURL}/api/auth/login`, {
      identifier: 'demo@student.test',
      password: 'DemoStudent123!',
      role: 'student'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (studentResponse.data.success) {
      console.log('✅ Student login successful!');
      console.log('User:', studentResponse.data.user.fullName || studentResponse.data.user.firstName);
      console.log('Role:', studentResponse.data.user.role);
      console.log('Token exists:', !!studentResponse.data.accessToken);
    }
  } catch (error) {
    console.log('❌ Student login failed:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data?.error || error.message);
    console.log('Message:', error.response?.data?.message);
  }

  console.log('\n🏠 Testing Owner Demo Login:');
  try {
    const ownerResponse = await axios.post(`${baseURL}/api/auth/login`, {
      identifier: 'demo@owner.test',
      password: 'DemoOwner123!',
      role: 'owner'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (ownerResponse.data.success) {
      console.log('✅ Owner login successful!');
      console.log('User:', ownerResponse.data.user.fullName || ownerResponse.data.user.firstName);
      console.log('Role:', ownerResponse.data.user.role);
      console.log('Token exists:', !!ownerResponse.data.accessToken);
    }
  } catch (error) {
    console.log('❌ Owner login failed:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data?.error || error.message);
    console.log('Message:', error.response?.data?.message);
  }

  // Test login without role specification
  console.log('\n👤 Testing Student Login (no role specified):');
  try {
    const noRoleResponse = await axios.post(`${baseURL}/api/auth/login`, {
      identifier: 'demo@student.test',
      password: 'DemoStudent123!'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (noRoleResponse.data.success) {
      console.log('✅ Student login successful without role!');
      console.log('User:', noRoleResponse.data.user.fullName || noRoleResponse.data.user.firstName);
      console.log('Role:', noRoleResponse.data.user.role);
    }
  } catch (error) {
    console.log('❌ Student login failed without role:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data?.error || error.message);
    console.log('Message:', error.response?.data?.message);
  }
}

// Run the test
testDemoLogin().catch(console.error);