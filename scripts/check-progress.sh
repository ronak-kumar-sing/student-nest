#!/bin/bash

echo "🚀 StudentNest Development Progress Checker"
echo "==========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the project root directory"
    exit 1
fi

echo ""
echo "📁 PROJECT STRUCTURE CHECK"
echo "--------------------------"

# Check core directories
directories=(
    "src/lib/models"
    "src/lib/db"
    "src/app/api"
)

for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir exists"
    else
        echo "❌ $dir missing"
    fi
done

echo ""
echo "🗄️ DATABASE MODELS CHECK"
echo "-----------------------"

# Check model files
models=(
    "src/lib/models/User.js"
    "src/lib/models/Room.js"
    "src/lib/models/Booking.js"
    "src/lib/models/Meeting.js"
    "src/lib/models/Review.js"
    "src/lib/models/RoomShare.js"
)

for model in "${models[@]}"; do
    if [ -f "$model" ]; then
        echo "✅ $(basename $model) - $(wc -l < "$model") lines"
    else
        echo "❌ $(basename $model) missing"
    fi
done

echo ""
echo "🌐 API ENDPOINTS CHECK"
echo "--------------------"

# Check API files
apis=(
    "src/app/api/rooms/route.js"
    "src/app/api/rooms/[id]/route.js"
    "src/app/api/dashboard/route.js"
    "src/app/api/meetings/route.js"
    "src/app/api/meetings/[id]/route.js"
    "src/app/api/bookings/route.js"
    "src/app/api/bookings/[id]/route.js"
    "src/app/api/reviews/route.js"
    "src/app/api/reviews/[id]/route.js"
    "src/app/api/room-sharing/route.js"
    "src/app/api/room-sharing/[id]/route.js"
)

for api in "${apis[@]}"; do
    if [ -f "$api" ]; then
        endpoint=$(echo $api | sed 's|src/app/api||' | sed 's|/route.js||')
        echo "✅ $endpoint - $(wc -l < "$api") lines"
    else
        endpoint=$(echo $api | sed 's|src/app/api||' | sed 's|/route.js||')
        echo "❌ $endpoint missing"
    fi
done

echo ""
echo "📋 DEVELOPMENT PHASES COMPLETION STATUS"
echo "======================================="

phase1_complete=0
phase1_total=8
phase2_complete=0
phase2_total=6
phase3_complete=0
phase3_total=4

echo "🏗️ PHASE 1: Core Backend Setup"
if [ -f "src/lib/db/connection.js" ]; then
    echo "✅ Database connection setup"
    ((phase1_complete++))
else
    echo "❌ Database connection setup"
fi

if [ -f "src/lib/models/User.js" ]; then
    echo "✅ User model implemented"
    ((phase1_complete++))
else
    echo "❌ User model implemented"
fi

if [ -f "src/lib/models/Room.js" ]; then
    echo "✅ Room model implemented"
    ((phase1_complete++))
else
    echo "❌ Room model implemented"
fi

if [ -f "src/lib/models/Booking.js" ]; then
    echo "✅ Booking model implemented"
    ((phase1_complete++))
else
    echo "❌ Booking model implemented"
fi

if [ -f "src/lib/models/Meeting.js" ]; then
    echo "✅ Meeting model implemented"
    ((phase1_complete++))
else
    echo "❌ Meeting model implemented"
fi

if [ -f "src/lib/models/Review.js" ]; then
    echo "✅ Review model implemented"
    ((phase1_complete++))
else
    echo "❌ Review model implemented"
fi

if [ -f "src/app/api/rooms/route.js" ]; then
    echo "✅ Room listing API implemented"
    ((phase1_complete++))
else
    echo "❌ Room listing API implemented"
fi

if [ -f "src/app/api/dashboard/route.js" ]; then
    echo "✅ Dashboard API implemented"
    ((phase1_complete++))
else
    echo "❌ Dashboard API implemented"
fi

echo ""
echo "🏢 PHASE 2: Booking & Reviews System"
if [ -f "src/app/api/bookings/route.js" ]; then
    echo "✅ Booking creation API implemented"
    ((phase2_complete++))
else
    echo "❌ Booking creation API implemented"
fi

if [ -f "src/app/api/bookings/[id]/route.js" ]; then
    echo "✅ Booking management API implemented"
    ((phase2_complete++))
else
    echo "❌ Booking management API implemented"
fi

if [ -f "src/app/api/reviews/route.js" ]; then
    echo "✅ Review submission API implemented"
    ((phase2_complete++))
else
    echo "❌ Review submission API implemented"
fi

if [ -f "src/app/api/reviews/[id]/route.js" ]; then
    echo "✅ Review management API implemented"
    ((phase2_complete++))
else
    echo "❌ Review management API implemented"
fi

if [ -f "src/app/api/meetings/route.js" ]; then
    echo "✅ Meeting scheduling API implemented"
    ((phase2_complete++))
else
    echo "❌ Meeting scheduling API implemented"
fi

if [ -f "src/app/api/meetings/[id]/route.js" ]; then
    echo "✅ Meeting management API implemented"
    ((phase2_complete++))
else
    echo "❌ Meeting management API implemented"
fi

echo ""
echo "🏠 PHASE 3: Room Sharing & Advanced Features"
if [ -f "src/lib/models/RoomShare.js" ]; then
    echo "✅ RoomShare model implemented"
    ((phase3_complete++))
else
    echo "❌ RoomShare model implemented"
fi

if [ -f "src/app/api/room-sharing/route.js" ]; then
    echo "✅ Room sharing creation API implemented"
    ((phase3_complete++))
else
    echo "❌ Room sharing creation API implemented"
fi

if [ -f "src/app/api/room-sharing/[id]/route.js" ]; then
    echo "✅ Room sharing management API implemented"
    ((phase3_complete++))
else
    echo "❌ Room sharing management API implemented"
fi

if [ -f "ENVIRONMENT_SETUP.md" ]; then
    echo "✅ Environment setup guide created"
    ((phase3_complete++))
else
    echo "❌ Environment setup guide created"
fi

phase1_percentage=$((phase1_complete * 100 / phase1_total))
phase2_percentage=$((phase2_complete * 100 / phase2_total))
phase3_percentage=$((phase3_complete * 100 / phase3_total))
total_percentage=$(((phase1_complete + phase2_complete + phase3_complete) * 100 / (phase1_total + phase2_total + phase3_total)))

echo ""
echo "📊 PHASE 1 PROGRESS: $phase1_complete/$phase1_total ($phase1_percentage%)"
echo "📊 PHASE 2 PROGRESS: $phase2_complete/$phase2_total ($phase2_percentage%)"
echo "📊 PHASE 3 PROGRESS: $phase3_complete/$phase3_total ($phase3_percentage%)"
echo "📊 TOTAL PROGRESS: $((phase1_complete + phase2_complete + phase3_complete))/$((phase1_total + phase2_total + phase3_total)) ($total_percentage%)"

if [ $total_percentage -ge 95 ]; then
    echo "🎉 CONGRATULATIONS! Backend implementation is complete!"
    echo "🚀 Ready for production deployment and testing."
elif [ $total_percentage -ge 80 ]; then
    echo "� Excellent progress! Almost ready for deployment."
elif [ $total_percentage -ge 60 ]; then
    echo "� Great progress! Continue with remaining tasks."
else
    echo "⚠️  Continue working on current phase."
fi

echo ""
echo "🔄 NEXT STEPS"
echo "-----------"
echo "1. Complete remaining Phase 1 tasks if any"
echo "2. Set up environment variables (.env.local)"
echo "3. Test API endpoints"
echo "4. Move to Phase 2: Booking & Reviews APIs"
echo ""
echo "💡 TO TEST APIS:"
echo "1. npm run dev"
echo "2. Test GET /api/rooms"
echo "3. Test POST /api/meetings (with auth token)"
echo "4. Test GET /api/dashboard (with auth token)"