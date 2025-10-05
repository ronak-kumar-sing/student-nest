#!/bin/bash

echo "Testing API Routes..."
echo ""

echo "1. Testing /api/owner/analytics?period=all"
curl -s http://localhost:3000/api/owner/analytics?period=all | jq '.success' || echo "Failed"
echo ""

echo "2. Testing /api/owner/analytics?period=revenue"
curl -s http://localhost:3000/api/owner/analytics?period=revenue | jq '.success' || echo "Failed"
echo ""

echo "3. Testing /api/room-sharing"
curl -s http://localhost:3000/api/room-sharing | jq '.success' || echo "Failed"
echo ""

echo "All tests completed!"
