# Quick Reference Guide - StudentNest

## 🚀 Quick Start

```bash
# Start development server
npm run dev

# Seed demo data
npm run seed-demo

# Build for production
npm run build
```

---

## 🔑 Demo Login Credentials

**All passwords: `Demo@123`**

### Students (5):
- priya.sharma@demo.com
- rahul.kumar@demo.com
- ananya.patel@demo.com
- arjun.singh@demo.com
- sneha.gupta@demo.com

### Owners (3):
- rajesh.kumar@demo.com
- sunita.verma@demo.com
- vikram.mehta@demo.com

---

## 📍 Important Routes

### Dashboards:
- `/owner/dashboard` - Owner dashboard with stats
- `/student/dashboard` - Student dashboard with stats

### Verification:
- `/student/profile/verification` - Student ID verification
- `/owner/profile/verification` - Owner property verification

### Room Features:
- `/dashboard/rooms` - Room browser with filters
- `/dashboard/rooms/[id]` - Room detail page

---

## 🎛️ Room Browser Filters

### 8 Filter Types:
1. **Price Range**: ₹2,000 - ₹25,000 (slider)
2. **Area Range**: 50 - 500 sq ft (slider)
3. **Availability**: Now / Next Month (checkboxes)
4. **Room Type**: Single, Shared, PG, Hostel, Apartment, Studio
5. **Amenities**: WiFi, Parking, Security, Kitchen, Laundry, Gym, AC, Heating
6. **Location**: Search by city, address, university
7. **Rating**: 0, 3+, 3.5+, 4+, 4.5+ stars
8. **Sort By**: Newest, Price (Low/High), Rating, Area

### Filter Logic:
- **Auto-applies** on any change
- **AND logic** for amenities (all must be present)
- **OR logic** for room types (any can match)
- **Clear All** button resets everything

---

## 🗄️ Demo Data Created

### Overview:
- **5 Students** with verified profiles
- **3 Owners** with verified profiles
- **6 Rooms** with varied prices, types, locations
- **~10 Bookings** with different statuses
- **~15 Reviews** with realistic ratings

### Room Data:
| Room | Price | Type | Location |
|------|-------|------|----------|
| Cozy Single | ₹12,000 | Single/PG | Noida Sector 15 |
| Shared Room | ₹7,000 | Shared/PG | Greater Noida |
| Premium Studio | ₹25,000 | Studio/Apt | South Delhi |
| PG for Girls | ₹8,500 | Shared/PG | Noida Sector 62 |
| Modern Single | ₹15,000 | Single/PG | Central Delhi |
| Budget Hostel | ₹5,000 | Shared/Hostel | Mukherjee Nagar |

---

## 🔧 API Endpoints

### Owner Dashboard:
```bash
GET /api/dashboard/owner/stats

Response:
{
  "success": true,
  "data": {
    "activeListings": 5,
    "monthlyRevenue": { "amount": 45000, "change": 12 },
    "pendingVisits": 7,
    "messages": { "total": 12, "unread": 5 },
    "analytics": { "occupancyRate": 85, "averageRating": 4.6 },
    "recentActivity": [...]
  }
}
```

### Student Dashboard:
```bash
GET /api/dashboard/student/stats

Response:
{
  "success": true,
  "data": {
    "savedProperties": 12,
    "applications": 3,
    "messages": { "total": 8, "unread": 2 },
    "scheduledVisits": 2,
    "featuredProperties": [...],
    "recentActivity": [...]
  }
}
```

---

## 📝 Testing Checklist

### Quick Smoke Test:
```bash
# 1. Seed data
npm run seed-demo

# 2. Start server
npm run dev

# 3. Test login
# - Go to login page
# - Use: priya.sharma@demo.com / Demo@123
# - Should redirect to student dashboard

# 4. Test room browser
# - Navigate to /dashboard/rooms
# - Try price filter: ₹5,000 - ₹10,000
# - Should show 2 rooms (Budget Hostel, Shared Room)

# 5. Test room detail
# - Click any room card
# - Verify all sections load
# - Check image gallery works
```

---

## 🎨 Component Usage

### FilterComponent:
```tsx
import FilterComponent from '@/components/filters/FilterComponent';

<FilterComponent
  priceRange={priceRange}
  setPriceRange={setPriceRange}
  availabilityFilter={availabilityFilter}
  setAvailabilityFilter={setAvailabilityFilter}
  // ... other props
  onClearFilters={clearAllFilters}
  activeFiltersCount={getActiveFiltersCount()}
/>
```

### RoomBrowser:
```tsx
import RoomBrowser from '@/components/room/RoomBrowser';

<RoomBrowser />
// No props needed - self-contained
```

---

## 🐛 Troubleshooting

### Seed Script Fails:
```bash
# Check MongoDB connection
# Verify .env has MONGODB_URI

# Check models import paths
# Ensure all models exist in /src/lib/models/
```

### Filters Not Working:
```bash
# Check useEffect dependencies
# Verify all filter states are in dependency array

# Check filter logic
# Console.log filtered array at each step
```

### TypeScript Errors:
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

---

## 📊 File Structure Quick Reference

```
src/
├── app/
│   ├── api/dashboard/
│   │   ├── owner/stats/route.ts          # Owner stats API
│   │   └── student/stats/route.ts        # Student stats API
│   ├── (dashboard)/dashboard/
│   │   ├── owner/dashboard/page.tsx      # Owner dashboard UI
│   │   └── rooms/[id]/page.tsx           # Room detail page
│   ├── owner/profile/verification/       # Owner verification
│   └── student/profile/verification/     # Student verification
├── components/
│   ├── filters/FilterComponent.tsx       # Filter sidebar
│   ├── room/RoomBrowser.tsx              # Room grid + filters
│   └── ui/slider.tsx                     # Range slider
scripts/
└── seed-demo-data.mjs                    # Demo data generator
```

---

## 🔍 Quick Debug Commands

```bash
# Check database connection
node -e "import('./src/lib/db.js').then(db => db.default())"

# Count demo users
mongosh "your-db-url" --eval "db.users.countDocuments({email: /@demo.com/})"

# List all rooms
mongosh "your-db-url" --eval "db.rooms.find().pretty()"

# Clear demo data manually
mongosh "your-db-url" --eval "db.users.deleteMany({email: /@demo.com/})"
```

---

## 📖 Documentation Files

1. **COMPLETE_STATUS_REPORT.md** - Full project overview
2. **ROOM_BROWSER_ENHANCEMENT.md** - Filter system details
3. **DASHBOARD_IMPLEMENTATION_STATUS.md** - Dashboard progress
4. **IMPLEMENTATION_GUIDE.md** - Step-by-step testing
5. **QUICK_REFERENCE.md** - This file

---

## ⚡ Common Tasks

### Add New Filter:
1. Add state in RoomBrowser.tsx
2. Add prop to FilterComponent.tsx
3. Add UI in FilterComponent.tsx
4. Add logic in `applyFilters()` function
5. Add to useEffect dependencies
6. Add to `clearAllFilters()` function
7. Add to `getActiveFiltersCount()` function

### Add New Room:
```bash
# Edit scripts/seed-demo-data.mjs
# Add to demoRooms array
# Run: npm run seed-demo
```

### Modify API Response:
1. Edit `/api/dashboard/{owner|student}/stats/route.ts`
2. Update TypeScript interface in dashboard page
3. Update UI to display new fields

---

## 🎯 Success Metrics

✅ **Zero TypeScript errors**
✅ **All filters working**
✅ **Seed script runs successfully**
✅ **Demo logins work**
✅ **Room detail page loads**
✅ **Responsive on mobile**

---

## 📞 Need Help?

Check documentation in order:
1. QUICK_REFERENCE.md (this file) - Common tasks
2. IMPLEMENTATION_GUIDE.md - Testing steps
3. ROOM_BROWSER_ENHANCEMENT.md - Filter details
4. COMPLETE_STATUS_REPORT.md - Full overview

---

**Last Updated**: December 2024
**Version**: 1.0
**Status**: Production Ready ✅
