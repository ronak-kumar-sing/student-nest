#!/bin/bash

# Manual Room Sharing API Test
# Quick tests for all endpoints

BASE_URL="http://localhost:3000/api"

echo "=========================================="
echo "Room Sharing API - Manual Test"
echo "=========================================="
echo ""

# Step 1: Login
echo "1. Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "teststudent@example.com",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq '.'

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken // .accessToken // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Login failed. Trying different password..."

  # Try common passwords
  for pwd in "Test@123" "test123" "student123" "password" "123456"; do
    echo "Trying password: $pwd"
    LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
      -H "Content-Type: application/json" \
      -d "{\"identifier\": \"teststudent@example.com\", \"password\": \"$pwd\"}")

    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken // .accessToken // empty')

    if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
      echo "✅ Login successful with password: $pwd"
      break
    fi
  done
fi

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Could not login. Testing public endpoints only..."
  echo ""

  # Test public endpoints
  echo "2. Testing GET /room-sharing (public)"
  curl -s "${BASE_URL}/room-sharing?page=1&limit=5" | jq '.'
  echo ""

  echo "3. Testing GET /room-sharing/statistics (public)"
  curl -s "${BASE_URL}/room-sharing/statistics" | jq '.'
  echo ""

  exit 0
fi

echo "✅ Login successful!"
echo "Token: ${TOKEN:0:30}..."
echo ""

# Test authenticated endpoints
echo "2. Testing GET /room-sharing/assessment"
curl -s "${BASE_URL}/room-sharing/assessment" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

echo "3. Testing POST /room-sharing/assessment"
curl -s -X POST "${BASE_URL}/room-sharing/assessment" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sleepSchedule": "early_bird",
    "cleanliness": "very_clean",
    "studyHabits": "quiet",
    "socialLevel": "moderately_social",
    "cookingFrequency": "often",
    "musicPreference": "low_volume",
    "guestPolicy": "occasional_guests",
    "smokingTolerance": "no_smoking",
    "petFriendly": "okay_with_pets",
    "workSchedule": "student_only",
    "sharingPreferences": ["cooking", "cleaning"],
    "dealBreakers": ["smoking"]
  }' | jq '.'
echo ""

echo "4. Testing GET /room-sharing (browse)"
curl -s "${BASE_URL}/room-sharing?page=1&limit=5" | jq '.data.total, .data.page'
echo ""

echo "5. Testing GET /room-sharing/my-shares"
curl -s "${BASE_URL}/room-sharing/my-shares" \
  -H "Authorization: Bearer $TOKEN" | jq '.data.stats'
echo ""

echo "6. Testing GET /room-sharing/statistics"
curl -s "${BASE_URL}/room-sharing/statistics" \
  -H "Authorization: Bearer $TOKEN" | jq '.data.platform | {totalShares, activeShares, totalParticipants}'
echo ""

echo "7. Testing GET /room-sharing/interest"
curl -s "${BASE_URL}/room-sharing/interest" \
  -H "Authorization: Bearer $TOKEN" | jq '.count'
echo ""

echo "=========================================="
echo "✅ API Tests Complete!"
echo "=========================================="
