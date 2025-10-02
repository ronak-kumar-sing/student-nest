#!/bin/bash

# Cloudinary Setup Script for Student Nest
# This script helps set up Cloudinary configuration and test the integration

echo "🚀 Cloudinary Integration Setup for Student Nest"
echo "=================================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local file first."
    exit 1
fi

# Check for Cloudinary environment variables
echo "🔍 Checking Cloudinary configuration..."

MISSING_VARS=()

if ! grep -q "CLOUDINARY_CLOUD_NAME=" .env.local; then
    MISSING_VARS+=("CLOUDINARY_CLOUD_NAME")
fi

if ! grep -q "CLOUDINARY_API_KEY=" .env.local; then
    MISSING_VARS+=("CLOUDINARY_API_KEY")
fi

if ! grep -q "CLOUDINARY_API_SECRET=" .env.local; then
    MISSING_VARS+=("CLOUDINARY_API_SECRET")
fi

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo "❌ Missing Cloudinary environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Please add these to your .env.local file:"
    echo "CLOUDINARY_CLOUD_NAME=your-cloud-name"
    echo "CLOUDINARY_API_KEY=your-api-key"
    echo "CLOUDINARY_API_SECRET=your-api-secret"
    echo "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name"
    echo ""
    echo "Get these from: https://console.cloudinary.com/"
    exit 1
fi

echo "✅ Cloudinary environment variables found!"

# Check if dependencies are installed
echo "🔍 Checking dependencies..."

if ! npm list cloudinary &> /dev/null; then
    echo "📦 Installing Cloudinary SDK..."
    npm install cloudinary
else
    echo "✅ Cloudinary SDK is installed"
fi

if ! npm list multer &> /dev/null; then
    echo "📦 Installing Multer..."
    npm install multer
else
    echo "✅ Multer is installed"
fi

# Test Cloudinary connection
echo "🔍 Testing Cloudinary connection..."

# Create a simple test script
cat > /tmp/cloudinary-test.js << 'EOF'
require('dotenv').config({ path: '.env.local' });
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test connection by getting account info
cloudinary.api.ping()
  .then((result) => {
    console.log('✅ Cloudinary connection successful!');
    console.log('Status:', result.status);

    // Get account usage info
    return cloudinary.api.usage();
  })
  .then((usage) => {
    console.log('\n📊 Account Usage:');
    console.log(`Storage: ${(usage.storage.used_bytes / 1024 / 1024).toFixed(2)}MB / ${(usage.storage.limit / 1024 / 1024).toFixed(0)}MB`);
    console.log(`Bandwidth: ${(usage.bandwidth.used_bytes / 1024 / 1024).toFixed(2)}MB / ${(usage.bandwidth.limit / 1024 / 1024).toFixed(0)}MB`);
    console.log(`Transformations: ${usage.transformations.usage} / ${usage.transformations.limit}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Cloudinary connection failed:', error.message);
    process.exit(1);
  });
EOF

# Run the test
if node /tmp/cloudinary-test.js; then
    echo ""
    echo "🎉 Cloudinary setup complete!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Start your development server: npm run dev"
    echo "2. Visit: http://localhost:3000/test-uploads"
    echo "3. Login to test file uploads"
    echo ""
    echo "📖 Documentation: ./CLOUDINARY_INTEGRATION_README.md"
    echo ""
    echo "🔧 Available Endpoints:"
    echo "   - POST /api/upload (general files)"
    echo "   - POST /api/upload/avatar (profile pictures)"
    echo "   - POST /api/upload/property (property media)"
    echo ""
    echo "💡 Free Tier Limits:"
    echo "   - 25GB storage"
    echo "   - 25GB monthly bandwidth"
    echo "   - 25,000 monthly transformations"
    echo "   - Images: 10MB max"
    echo "   - Videos: 100MB max"
else
    echo ""
    echo "❌ Setup failed. Please check your Cloudinary credentials."
    echo "Visit: https://console.cloudinary.com/ to get your credentials"
fi

# Cleanup
rm -f /tmp/cloudinary-test.js

echo ""
echo "=================================================="