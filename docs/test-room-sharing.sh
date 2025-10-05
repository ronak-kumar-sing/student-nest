#!/bin/bash

# Room Sharing API Test Script
# Tests all enhanced room sharing endpoints

BASE_URL="http://localhost:3000/api"
TOKEN="your-jwt-token-here"

echo "=========================================="
echo "Room Sharing API Test Suite"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to make API calls
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4

    echo -e "${YELLOW}Testing: ${description}${NC}"
    echo "Method: $method"
    echo "Endpoint: ${BASE_URL}${endpoint}"

    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            "${BASE_URL}${endpoint}")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "${BASE_URL}${endpoint}")
    fi

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ Success (Status: $http_code)${NC}"
    else
        echo -e "${RED}✗ Failed (Status: $http_code)${NC}"
    fi

    echo "Response: $body" | jq '.' 2>/dev/null || echo "$body"
    echo ""
}

echo "=========================================="
echo "1. Compatibility Assessment Tests"
echo "=========================================="
echo ""

# Submit compatibility assessment
test_endpoint "POST" "/room-sharing/assessment" '{
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
  "sharingPreferences": ["cooking", "cleaning together"],
  "dealBreakers": ["smoking", "loud music"]
}' "Submit Compatibility Assessment"

# Get compatibility assessment
test_endpoint "GET" "/room-sharing/assessment" "" "Get Compatibility Assessment"

# Update compatibility assessment
test_endpoint "PUT" "/room-sharing/assessment" '{
  "sleepSchedule": "flexible",
  "musicPreference": "moderate"
}' "Update Compatibility Assessment"

echo "=========================================="
echo "2. Room Share CRUD Tests"
echo "=========================================="
echo ""

# Get all room shares
test_endpoint "GET" "/room-sharing?page=1&limit=10" "" "Browse Room Shares (No Filters)"

# Get with filters
test_endpoint "GET" "/room-sharing?gender=any&minPrice=5000&maxPrice=15000&city=Bangalore" "" "Browse Room Shares (With Filters)"

# Create room share (replace property_id with actual ID)
# test_endpoint "POST" "/room-sharing" '{
#   "property": "property_id_here",
#   "maxParticipants": 3,
#   "description": "Looking for 2 clean and quiet roommates",
#   "requirements": {
#     "gender": "any",
#     "ageRange": { "min": 18, "max": 30 }
#   },
#   "costSharing": {
#     "totalRent": 30000,
#     "rentPerPerson": 10000,
#     "securityDeposit": 20000,
#     "advanceMonths": 2
#   }
# }' "Create Room Share"

# Get room share details (replace share_id with actual ID)
# test_endpoint "GET" "/room-sharing/share_id_here" "" "Get Room Share Details"

# Update room share (replace share_id with actual ID)
# test_endpoint "PUT" "/room-sharing/share_id_here" '{
#   "description": "Updated description - Looking for quiet roommates",
#   "houseRules": ["No smoking", "No loud music after 10 PM"]
# }' "Update Room Share"

echo "=========================================="
echo "3. Application Tests"
echo "=========================================="
echo ""

# Apply to room share (replace share_id with actual ID)
# test_endpoint "POST" "/room-sharing/share_id_here/apply" '{
#   "message": "Hi, I am interested in joining. I am a clean and quiet person."
# }' "Apply to Room Share"

# Withdraw application (replace share_id with actual ID)
# test_endpoint "DELETE" "/room-sharing/share_id_here/apply" "" "Withdraw Application"

# Respond to application (replace share_id and applicant_id with actual IDs)
# test_endpoint "POST" "/room-sharing/share_id_here/respond" '{
#   "applicantId": "applicant_id_here",
#   "status": "accepted",
#   "message": "Welcome! Please contact me to discuss move-in details."
# }' "Respond to Application"

echo "=========================================="
echo "4. User Dashboard Tests"
echo "=========================================="
echo ""

# Get all categories
test_endpoint "GET" "/room-sharing/my-shares" "" "Get All My Shares (No Filter)"

# Get created shares
test_endpoint "GET" "/room-sharing/my-shares?type=created" "" "Get My Created Shares"

# Get joined shares
test_endpoint "GET" "/room-sharing/my-shares?type=joined" "" "Get My Joined Shares"

# Get applied shares
test_endpoint "GET" "/room-sharing/my-shares?type=applied" "" "Get My Applied Shares"

echo "=========================================="
echo "5. Statistics Tests"
echo "=========================================="
echo ""

# Get platform statistics
test_endpoint "GET" "/room-sharing/statistics" "" "Get Platform Statistics"

echo "=========================================="
echo "6. Interest/Bookmark Tests"
echo "=========================================="
echo ""

# Get all bookmarks
test_endpoint "GET" "/room-sharing/interest" "" "Get All Bookmarked Shares"

# Add bookmark (replace share_id with actual ID)
# test_endpoint "POST" "/room-sharing/interest" '{
#   "shareId": "share_id_here"
# }' "Add Bookmark"

# Remove bookmark (replace share_id with actual ID)
# test_endpoint "DELETE" "/room-sharing/interest" '{
#   "shareId": "share_id_here"
# }' "Remove Bookmark"

echo "=========================================="
echo "Test Suite Complete"
echo "=========================================="
echo ""
echo "Note: Commented tests require actual IDs"
echo "1. Create a room share first to get share_id"
echo "2. Apply to get applicant_id"
echo "3. Then uncomment and run specific tests"
echo ""
echo "To run with your token:"
echo "  1. Get JWT token from login"
echo "  2. Replace 'your-jwt-token-here' at top of script"
echo "  3. Make script executable: chmod +x test-room-sharing.sh"
echo "  4. Run: ./test-room-sharing.sh"
