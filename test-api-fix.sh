#!/bin/bash

echo "🧪 Testing StudentNest API Endpoints..."
echo ""

# Test rooms API
echo "1️⃣ Testing Rooms API..."
curl -s "http://localhost:3000/api/rooms" | jq -r '.success, .data.rooms | length'
echo ""

# Test if student can access dashboard
echo "2️⃣ Testing Dashboard Access..."
curl -s -I "http://localhost:3000/dashboard" | grep -E "HTTP|Location"
echo ""

echo "✅ Basic API test complete!"
echo ""
echo "🔍 To test in browser:"
echo "   1. Go to http://localhost:3000/dashboard"
echo "   2. Login as student (student1@test.com)"
echo "   3. Check if rooms are displayed"
echo "   4. Monitor console for API calls"