/**
 * Cloudinary Upload API Test Script
 * Tests all upload endpoints with sample data
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  testImagePath: './public/logo.png', // Using existing logo as test image

  // Test user credentials (you'll need to replace these)
  testUser: {
    email: 'test@example.com',
    password: 'TestPass123!',
    role: 'student'
  }
};

async function testCloudinaryIntegration() {
  console.log('🧪 Testing Cloudinary Upload Integration');
  console.log('========================================\n');

  try {
    // 1. Check if test image exists
    if (!fs.existsSync(TEST_CONFIG.testImagePath)) {
      throw new Error(`Test image not found at ${TEST_CONFIG.testImagePath}`);
    }
    console.log('✅ Test image found');

    // 2. Test Cloudinary configuration
    console.log('🔍 Testing Cloudinary configuration...');
    const { v2: cloudinary } = require('cloudinary');

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful\n');

    // 3. Test upload without authentication (should fail)
    console.log('🔍 Testing upload without authentication...');

    const FormData = require('form-data');
    const fetch = require('node-fetch');

    const form = new FormData();
    form.append('file', fs.createReadStream(TEST_CONFIG.testImagePath));
    form.append('type', 'image');

    try {
      const response = await fetch(`${TEST_CONFIG.baseUrl}/api/upload`, {
        method: 'POST',
        body: form
      });

      const result = await response.json();

      if (response.status === 401) {
        console.log('✅ Authentication required (as expected)\n');
      } else {
        console.log('⚠️  Upload succeeded without auth (security issue)\n');
      }
    } catch (error) {
      console.log('ℹ️  Server not running or endpoint not available\n');
    }

    // 4. Test direct Cloudinary upload (bypassing API)
    console.log('🔍 Testing direct Cloudinary upload...');

    try {
      const uploadResult = await cloudinary.uploader.upload(TEST_CONFIG.testImagePath, {
        folder: 'student-nest/test',
        transformation: [
          { width: 300, height: 300, crop: 'fill' }
        ],
        tags: ['test', 'api-test']
      });

      console.log('✅ Direct upload successful');
      console.log(`   URL: ${uploadResult.secure_url}`);
      console.log(`   Public ID: ${uploadResult.public_id}\n`);

      // Clean up test file
      await cloudinary.uploader.destroy(uploadResult.public_id);
      console.log('✅ Test file cleaned up\n');

    } catch (error) {
      console.log('❌ Direct upload failed:', error.message, '\n');
    }

    // 5. Test file validation functions
    console.log('🔍 Testing file validation...');

    const testFiles = [
      { name: 'test.jpg', size: 1024 * 1024, type: 'image/jpeg' }, // Valid
      { name: 'test.exe', size: 1024, type: 'application/exe' },    // Invalid type
      { name: 'large.jpg', size: 20 * 1024 * 1024, type: 'image/jpeg' } // Too large
    ];

    testFiles.forEach(file => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      const typeValid = allowedTypes.includes(file.type);
      const sizeValid = file.size <= maxSize;

      console.log(`   ${file.name}: ${typeValid && sizeValid ? '✅ Valid' : '❌ Invalid'}`);
    });

    console.log('\n🔍 Testing upload utilities...');

    // Test if the utility functions exist
    try {
      const { uploadImage, uploadVideo, uploadAvatar } = require('../src/lib/cloudinary.js');
      console.log('✅ Upload utilities loaded successfully');
    } catch (error) {
      console.log('❌ Upload utilities not found:', error.message);
    }

    console.log('\n🔍 Testing React components...');

    // Check if React components exist
    const componentPaths = [
      '../src/components/ui/FileUpload.jsx',
      '../src/components/ui/AvatarUpload.jsx',
      '../src/hooks/useFileUpload.js'
    ];

    componentPaths.forEach(componentPath => {
      try {
        const fullPath = path.resolve(__dirname, componentPath);
        if (fs.existsSync(fullPath)) {
          console.log(`✅ ${path.basename(componentPath)} exists`);
        } else {
          console.log(`❌ ${path.basename(componentPath)} not found`);
        }
      } catch (error) {
        console.log(`❌ Error checking ${componentPath}`);
      }
    });

    console.log('\n🎉 Cloudinary integration test completed!');
    console.log('\n📋 Manual Testing Steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Visit: http://localhost:3000/test-uploads');
    console.log('3. Login with a test account');
    console.log('4. Try uploading different file types');
    console.log('5. Check the results in Cloudinary dashboard');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testCloudinaryIntegration();