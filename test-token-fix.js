// Quick test to verify token retrieval from localStorage
// This can be run in the browser console

console.log('🔍 Testing Token Retrieval...');

// Simulate what login page stores
const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test";
localStorage.setItem('token', testToken);
console.log('✅ Stored token:', testToken);

// Test what API client retrieves
const retrievedToken = localStorage.getItem('token');
console.log('🔑 Retrieved token:', retrievedToken);

// Test API client class
class TestApiClient {
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }
}

const client = new TestApiClient();
const clientToken = client.getToken();
console.log('📡 API Client token:', clientToken);

console.log('Match:', testToken === retrievedToken && retrievedToken === clientToken ? '✅ SUCCESS' : '❌ FAILED');

// Clean up
localStorage.removeItem('token');