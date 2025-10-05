/**
 * Cloudinary Upload Integration Test Script
 *
 * This script tests the complete Cloudinary upload flow for property images
 * Tests: Single upload, bulk upload, delete, and property creation with images
 */

const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';
const TEST_IMAGE_PATH = process.env.TEST_IMAGE_PATH || './public/logo.png';

// Demo owner credentials (from your previous tests)
const DEMO_OWNER = {
  email: 'demo.owner@studentnest.com',
  password: 'Owner@123'
};

let authToken = '';
let propertyId = '';
let uploadedImages = [];

// Helper functions
const log = (message, type = 'info') => {
  const colors = {
    success: '\x1b[32m',
    error: '\x1b[31m',
    info: '\x1b[36m',
    warning: '\x1b[33m'
  };
  const reset = '\x1b[0m';
  console.log(`${colors[type]}${message}${reset}`);
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Convert image to base64
function imageToBase64(filePath) {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = filePath.endsWith('.png') ? 'image/png' :
                     filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') ? 'image/jpeg' :
                     'image/webp';
    return `data:${mimeType};base64,${base64Image}`;
  } catch (error) {
    throw new Error(`Failed to read image: ${error.message}`);
  }
}

// Test 1: Login as demo owner
async function loginAsOwner() {
  log('\n📝 Test 1: Login as Owner', 'info');
  log('=====================================');

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(DEMO_OWNER),
    });

    const result = await response.json();

    if (result.success && result.data.token) {
      authToken = result.data.token;
      log('✅ Login successful!', 'success');
      log(`   Token: ${authToken.substring(0, 20)}...`, 'info');
      log(`   User: ${result.data.user.name} (${result.data.user.role})`, 'info');
      return true;
    } else {
      log(`❌ Login failed: ${result.error}`, 'error');
      return false;
    }
  } catch (error) {
    log(`❌ Login error: ${error.message}`, 'error');
    return false;
  }
}

// Test 2: Upload single image
async function uploadSingleImage() {
  log('\n📤 Test 2: Upload Single Image', 'info');
  log('=====================================');

  try {
    if (!fs.existsSync(TEST_IMAGE_PATH)) {
      log(`⚠️  Test image not found at ${TEST_IMAGE_PATH}`, 'warning');
      log('   Skipping upload test...', 'warning');
      return false;
    }

    const base64Image = imageToBase64(TEST_IMAGE_PATH);
    const fileSizeKB = (base64Image.length * 3 / 4 / 1024).toFixed(2);

    log(`   File: ${path.basename(TEST_IMAGE_PATH)}`, 'info');
    log(`   Size: ${fileSizeKB} KB`, 'info');

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        file: base64Image,
        type: 'image',
        category: 'property',
        mimeType: 'image/png',
      }),
    });

    const result = await response.json();

    if (result.success && result.data) {
      uploadedImages.push(result.data);
      log('✅ Image uploaded successfully!', 'success');
      log(`   URL: ${result.data.url}`, 'info');
      log(`   Public ID: ${result.data.publicId}`, 'info');
      log(`   Dimensions: ${result.data.width} x ${result.data.height}`, 'info');
      log(`   Format: ${result.data.format}`, 'info');
      log(`   Size: ${(result.data.size / 1024).toFixed(2)} KB`, 'info');
      return true;
    } else {
      log(`❌ Upload failed: ${result.error}`, 'error');
      return false;
    }
  } catch (error) {
    log(`❌ Upload error: ${error.message}`, 'error');
    return false;
  }
}

// Test 3: Upload multiple images
async function uploadMultipleImages() {
  log('\n📤 Test 3: Upload Multiple Images (Bulk)', 'info');
  log('=====================================');

  try {
    if (!fs.existsSync(TEST_IMAGE_PATH)) {
      log('⚠️  Test image not found, skipping bulk upload', 'warning');
      return false;
    }

    const base64Image = imageToBase64(TEST_IMAGE_PATH);

    // Create array with 3 copies for testing
    const files = [base64Image, base64Image, base64Image];

    log(`   Uploading ${files.length} images...`, 'info');

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        files: files,
        type: 'image',
        category: 'property',
      }),
    });

    const result = await response.json();

    if (result.success && result.data) {
      if (result.data.uploaded) {
        uploadedImages.push(...result.data.uploaded);
        log('✅ Bulk upload successful!', 'success');
        log(`   Uploaded: ${result.data.count.uploaded}`, 'success');
        log(`   Failed: ${result.data.count.failed}`, result.data.count.failed > 0 ? 'warning' : 'info');

        result.data.uploaded.forEach((img, index) => {
          log(`   Image ${index + 1}: ${img.url}`, 'info');
        });

        return true;
      }
    } else {
      log(`❌ Bulk upload failed: ${result.error}`, 'error');
      return false;
    }
  } catch (error) {
    log(`❌ Bulk upload error: ${error.message}`, 'error');
    return false;
  }
}

// Test 4: Create property with uploaded images
async function createPropertyWithImages() {
  log('\n🏠 Test 4: Create Property with Uploaded Images', 'info');
  log('=====================================');

  if (uploadedImages.length === 0) {
    log('⚠️  No images uploaded, skipping property creation', 'warning');
    return false;
  }

  try {
    const propertyData = {
      title: 'Test Property - Cloudinary Integration',
      description: 'This is a test property created to verify Cloudinary image upload integration',
      fullDescription: 'A comprehensive test of the property posting system with Cloudinary-hosted images. This property includes multiple images uploaded through our upload API.',
      price: 15000,
      images: uploadedImages.map(img => img.url),
      roomType: 'single',
      accommodationType: 'pg',
      maxSharingCapacity: 1,
      securityDeposit: 30000,
      maintenanceCharges: 1000,
      location: {
        address: '123 Test Street, Test Area',
        fullAddress: '123 Test Street, Test Area, Near Test College',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        coordinates: {
          lat: 28.7041,
          lng: 77.1025
        },
      },
      features: {
        area: 400,
        floor: 2,
        totalFloors: 5,
        furnished: true,
        balcony: true,
        attached_bathroom: true,
      },
      amenities: ['wifi', 'ac', 'powerBackup', 'security', 'parking'],
      rules: {
        genderPreference: 'any',
        smokingAllowed: false,
        petsAllowed: false,
        drinkingAllowed: false,
        visitorsAllowed: true,
        couplesAllowed: false,
      },
      availability: {
        isAvailable: true,
        availableRooms: 1,
        availableFrom: new Date().toISOString(),
      },
      totalRooms: 1,
    };

    log(`   Creating property with ${propertyData.images.length} images...`, 'info');

    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(propertyData),
    });

    const result = await response.json();

    if (result.success && result.data) {
      propertyId = result.data.roomId;
      log('✅ Property created successfully!', 'success');
      log(`   Property ID: ${propertyId}`, 'info');
      log(`   Title: ${result.data.title}`, 'info');
      log(`   Status: ${result.data.status}`, 'info');
      log(`   Images: ${result.data.images?.length || 0}`, 'info');
      log(`   Location: ${result.data.location?.city}`, 'info');
      return true;
    } else {
      log(`❌ Property creation failed: ${result.error}`, 'error');
      if (result.details) {
        log(`   Details: ${JSON.stringify(result.details)}`, 'error');
      }
      return false;
    }
  } catch (error) {
    log(`❌ Property creation error: ${error.message}`, 'error');
    return false;
  }
}

// Test 5: Verify property images
async function verifyPropertyImages() {
  log('\n🔍 Test 5: Verify Property Images', 'info');
  log('=====================================');

  if (!propertyId) {
    log('⚠️  No property ID available, skipping verification', 'warning');
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${propertyId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const result = await response.json();

    if (result.success && result.data) {
      log('✅ Property retrieved successfully!', 'success');
      log(`   Title: ${result.data.title}`, 'info');
      log(`   Images count: ${result.data.images?.length || 0}`, 'info');

      if (result.data.images && result.data.images.length > 0) {
        log('\n   Image URLs:', 'info');
        result.data.images.forEach((url, index) => {
          const isCloudinary = url.includes('cloudinary.com');
          log(`   ${index + 1}. ${url.substring(0, 60)}... ${isCloudinary ? '✓ Cloudinary' : '✗ Not Cloudinary'}`,
              isCloudinary ? 'success' : 'warning');
        });
        return true;
      } else {
        log('⚠️  No images found in property', 'warning');
        return false;
      }
    } else {
      log(`❌ Failed to retrieve property: ${result.error}`, 'error');
      return false;
    }
  } catch (error) {
    log(`❌ Verification error: ${error.message}`, 'error');
    return false;
  }
}

// Test 6: Delete uploaded image
async function deleteUploadedImage() {
  log('\n🗑️  Test 6: Delete Uploaded Image', 'info');
  log('=====================================');

  if (uploadedImages.length === 0) {
    log('⚠️  No images to delete, skipping', 'warning');
    return false;
  }

  try {
    const imageToDelete = uploadedImages[uploadedImages.length - 1];
    log(`   Deleting image: ${imageToDelete.publicId}`, 'info');

    const response = await fetch(
      `${API_BASE_URL}/upload?publicId=${encodeURIComponent(imageToDelete.publicId)}&type=image`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      log('✅ Image deleted successfully!', 'success');
      uploadedImages.pop(); // Remove from our tracking array
      return true;
    } else {
      log(`❌ Delete failed: ${result.error}`, 'error');
      return false;
    }
  } catch (error) {
    log(`❌ Delete error: ${error.message}`, 'error');
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║        🧪 CLOUDINARY UPLOAD INTEGRATION TESTS 🧪          ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  log(`🔗 API Base URL: ${API_BASE_URL}`, 'info');
  log(`📁 Test Image: ${TEST_IMAGE_PATH}`, 'info');

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
  };

  const tests = [
    { name: 'Login as Owner', fn: loginAsOwner },
    { name: 'Upload Single Image', fn: uploadSingleImage },
    { name: 'Upload Multiple Images', fn: uploadMultipleImages },
    { name: 'Create Property with Images', fn: createPropertyWithImages },
    { name: 'Verify Property Images', fn: verifyPropertyImages },
    { name: 'Delete Uploaded Image', fn: deleteUploadedImage },
  ];

  for (const test of tests) {
    results.total++;
    const passed = await test.fn();

    if (passed) {
      results.passed++;
    } else {
      results.failed++;
    }

    await delay(500); // Small delay between tests
  }

  // Summary
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║                    📊 TEST SUMMARY                         ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  log(`Total Tests: ${results.total}`, 'info');
  log(`Passed: ${results.passed}`, 'success');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'error' : 'success');
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%\n`,
      results.failed === 0 ? 'success' : 'warning');

  if (results.failed === 0) {
    log('🎉 All tests passed! Cloudinary integration is working correctly.', 'success');
  } else {
    log('⚠️  Some tests failed. Please check the logs above.', 'warning');
  }

  // Cleanup info
  if (propertyId) {
    log(`\n📝 Test property created with ID: ${propertyId}`, 'info');
    log('   You may want to delete this test property from the database.', 'info');
  }

  if (uploadedImages.length > 0) {
    log(`\n📁 ${uploadedImages.length} images uploaded to Cloudinary:`, 'info');
    uploadedImages.forEach((img, index) => {
      log(`   ${index + 1}. ${img.publicId}`, 'info');
    });
    log('   These images can be managed from your Cloudinary dashboard.', 'info');
  }

  process.exit(results.failed === 0 ? 0 : 1);
}

// Run tests
runTests().catch(error => {
  log(`\n💥 Fatal error: ${error.message}`, 'error');
  console.error(error);
  process.exit(1);
});
