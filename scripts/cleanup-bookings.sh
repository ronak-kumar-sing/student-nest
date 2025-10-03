#!/bin/bash

# Cron job script to clean up expired bookings
# This should be run every hour or daily depending on your needs
# Add to crontab: 0 * * * * /path/to/cleanup-bookings.sh

# Replace with your actual API endpoint
API_ENDPOINT="http://localhost:3000/api/bookings/cleanup-expired"

echo "$(date): Starting booking cleanup..."

# Call the cleanup endpoint
response=$(curl -s -X POST "$API_ENDPOINT")

# Log the response
echo "$(date): Cleanup response: $response"

# Check if cleanup was successful
if echo "$response" | grep -q '"success":true'; then
    echo "$(date): Booking cleanup completed successfully"
else
    echo "$(date): Booking cleanup failed"
fi

echo "$(date): Booking cleanup finished"