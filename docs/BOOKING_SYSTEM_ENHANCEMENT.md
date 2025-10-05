# Booking System Enhancement Documentation

## Overview

The StudentNest booking system has been significantly enhanced with comprehensive analytics, workflow management, and advanced features for both students and owners. This document provides complete details of all enhancements.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [API Endpoints](#api-endpoints)
3. [Data Model](#data-model)
4. [Workflows](#workflows)
5. [API Client Methods](#api-client-methods)
6. [Frontend Integration](#frontend-integration)
7. [Testing Guide](#testing-guide)

---

## System Architecture

### Core Features

**For Students:**
- View booking statistics and history
- Request booking extensions
- Cancel bookings with refunds
- Track payment status
- View favorite locations
- Get expiring booking alerts

**For Owners:**
- Comprehensive property analytics
- Approve/reject bookings
- Manage check-ins and check-outs
- Track occupancy rates
- Monitor renewal rates
- Handle extension requests
- View top performing properties

### Booking Lifecycle

```
1. Create → pending
2. Approve/Reject → confirmed/rejected (Owner)
3. Check-in → active (Owner)
4. Extension Request → (Student)
5. Extension Approve/Reject → (Owner)
6. Check-out → completed (Owner)
7. Cancel → cancelled (Student/Owner)
```

---

## API Endpoints

### 1. GET /api/bookings/statistics

Get comprehensive booking statistics and analytics.

#### Query Parameters
- `timeframe` (optional): 'week' | 'month' | 'year' | 'all' (default: 'month')

#### Response Structure

```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 45,
      "pending": 3,
      "confirmed": 5,
      "active": 8,
      "completed": 25,
      "cancelled": 4,
      "rejected": 0
    },
    "payment": {
      "totalRevenue": 450000,
      "totalPaid": 380000,
      "pendingPayments": 70000,
      "paidCount": 38,
      "pendingCount": 7
    },
    "upcoming": [
      {
        "_id": "booking_id",
        "room": { "title": "Cozy Room", "location": "Mumbai" },
        "moveInDate": "2024-02-01",
        "monthlyRent": 15000
      }
    ],
    "ongoing": [...],
    "expiringSoon": [...],
    "recentActivity": [...],
    "monthlyTrend": [
      {
        "month": "2024-01",
        "totalBookings": 5,
        "revenue": 75000,
        "confirmed": 3,
        "cancelled": 1
      }
    ],
    "student": {
      "hasActiveBooking": true,
      "currentBooking": {...},
      "totalSpent": 90000,
      "averageStayDuration": 6,
      "favoriteLocations": [
        { "city": "Mumbai", "bookings": 3 },
        { "city": "Pune", "bookings": 2 }
      ]
    },
    "owner": {
      "totalStudents": 35,
      "totalProperties": 12,
      "occupancyRate": 75.5,
      "avgBookingDuration": 8.5,
      "totalEarnings": 850000,
      "pendingApprovals": 3,
      "activeTenants": 8,
      "topPerformingProperty": {
        "room": {...},
        "totalRevenue": 180000,
        "totalBookings": 12
      },
      "renewalRate": 65.5
    }
  }
}
```

#### Example Usage

```typescript
// Get monthly statistics
const stats = await api.getBookingStatistics('month');

// Get all-time statistics
const allStats = await api.getBookingStatistics('all');
```

---

### 2. GET /api/bookings/my-bookings

Get user's bookings organized by categories.

#### Query Parameters
- `type` (optional): 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'upcoming' | 'expiring' | 'overdue_payment' | 'all' (default: 'all')

#### Response Structure

```json
{
  "success": true,
  "data": {
    "pending": [...],
    "confirmed": [...],
    "active": [
      {
        "_id": "booking_id",
        "room": {...},
        "student": {...},
        "owner": {...},
        "moveInDate": "2024-01-15",
        "moveOutDate": "2024-07-15",
        "status": "active",
        "daysUntilMoveOut": 45,
        "canExtend": true,
        "canCancel": false,
        "canReview": false,
        "extensionRequests": [...]
      }
    ],
    "completed": [...],
    "cancelled": [...],
    "stats": {
      "pending": 2,
      "confirmed": 3,
      "active": 5,
      "completed": 15,
      "cancelled": 2,
      "total": 27
    }
  },
  "userRole": "student"
}
```

#### Helper Fields

Each booking includes:
- `daysUntilMoveIn`: Days remaining until move-in
- `daysUntilMoveOut`: Days remaining until move-out
- `isOverdue`: Payment overdue flag (>7 days)
- `canExtend`: Can request extension (active & <30 days to expiry)
- `canCancel`: Can cancel (pending or confirmed status)
- `canReview`: Can submit review (completed & not reviewed)

#### Example Usage

```typescript
// Get all bookings
const allBookings = await api.getMyBookings('all');

// Get only active bookings
const active = await api.getMyBookings('active');

// Get bookings expiring soon
const expiring = await api.getMyBookings('expiring');

// Get bookings with pending payment
const overdue = await api.getMyBookings('overdue_payment');
```

---

### 3. POST /api/bookings/:id/actions

Perform various booking actions based on user role and booking status.

#### Request Body Structure

```json
{
  "action": "approve",
  "notes": "Welcome! Looking forward to hosting you.",
  "reason": "Optional reason for rejection/cancellation",
  "extensionDuration": 3,
  "extensionId": "extension_request_id",
  "refundAmount": 5000,
  "meterReadings": {
    "electricity": 1234,
    "water": 567,
    "gas": 89
  },
  "roomCondition": "Excellent condition, all items intact",
  "photos": ["url1", "url2"],
  "damageCharges": 0,
  "cleaningCharges": 500,
  "utilityCharges": 1200
}
```

#### Available Actions

**Owner Actions:**
1. `approve` - Approve pending booking
2. `reject` - Reject pending booking (requires reason)
3. `activate` - Check-in student (confirmed → active)
4. `complete` - Check-out student (active → completed)
5. `approve_extension` - Approve extension request
6. `reject_extension` - Reject extension request (requires reason)

**Student Actions:**
1. `request_extension` - Request booking extension
2. `cancel` - Cancel booking (requires reason)

#### Action Examples

**1. Approve Booking (Owner)**
```typescript
await api.approveBooking(bookingId, "Welcome to our property!");

// Or using performBookingAction
await api.performBookingAction(bookingId, {
  action: 'approve',
  notes: 'Looking forward to hosting you!'
});
```

**2. Reject Booking (Owner)**
```typescript
await api.rejectBooking(bookingId, "Room no longer available");
```

**3. Check-In Student (Owner)**
```typescript
await api.checkInStudent(bookingId, {
  notes: 'Student checked in successfully',
  meterReadings: {
    electricity: 1234,
    water: 567,
    gas: 89
  },
  roomCondition: 'All items in good condition',
  photos: ['check-in-photo-1.jpg', 'check-in-photo-2.jpg']
});
```

**4. Check-Out Student (Owner)**
```typescript
await api.checkOutStudent(bookingId, {
  notes: 'Smooth checkout process',
  meterReadings: {
    electricity: 2456,
    water: 892,
    gas: 145
  },
  roomCondition: 'Minor wear and tear',
  photos: ['check-out-photo.jpg'],
  damageCharges: 0,
  cleaningCharges: 500,
  utilityCharges: 1200
});
```

**5. Request Extension (Student)**
```typescript
await api.requestBookingExtension(
  bookingId,
  3, // months
  'Need to extend due to semester extension'
);
```

**6. Approve Extension (Owner)**
```typescript
await api.approveExtension(bookingId, extensionId);
```

**7. Reject Extension (Owner)**
```typescript
await api.rejectExtension(
  bookingId,
  extensionId,
  'Room already booked for next period'
);
```

**8. Cancel Booking (Student or Owner)**
```typescript
await api.cancelBooking(
  bookingId,
  'Plans changed',
  5000 // optional refund amount
);
```

---

## Data Model

### Booking Schema Enhancements

```typescript
{
  // ... existing fields ...

  // Refund tracking
  refundStatus: 'pending' | 'processing' | 'completed' | 'failed',

  // Check-in details
  checkInDetails: {
    checkedInAt: Date,
    checkedInBy: ObjectId,
    notes: string,
    meterReadings: {
      electricity: number,
      water: number,
      gas: number
    },
    roomCondition: string,
    photos: string[]
  },

  // Check-out details
  checkOutDetails: {
    checkedOutAt: Date,
    checkedOutBy: ObjectId,
    notes: string,
    meterReadings: {
      electricity: number,
      water: number,
      gas: number
    },
    roomCondition: string,
    photos: string[],
    damageCharges: number,
    cleaningCharges: number,
    utilityCharges: number,
    finalSettlement: number
  },

  // Extension requests
  extensionRequests: [{
    requestedBy: ObjectId,
    requestedAt: Date,
    extensionMonths: number,
    reason: string,
    newMoveOutDate: Date,
    status: 'pending' | 'approved' | 'rejected',
    respondedBy: ObjectId,
    respondedAt: Date,
    rejectionReason: string
  }],

  // Review tracking
  studentReviewSubmitted: boolean,
  ownerReviewSubmitted: boolean
}
```

---

## Workflows

### 1. Booking Approval Workflow

```
Student creates booking
       ↓
Status: PENDING
       ↓
Owner reviews → Approve/Reject
       ↓              ↓
Status: CONFIRMED   Status: REJECTED
(Room availability  (Room availability
 decreased)          restored)
```

### 2. Check-In/Check-Out Workflow

```
Booking confirmed
       ↓
Move-in date arrives
       ↓
Owner performs check-in
- Records meter readings
- Documents room condition
- Takes photos
       ↓
Status: ACTIVE
       ↓
Move-out date arrives
       ↓
Owner performs check-out
- Records final meter readings
- Documents room condition
- Calculates charges (damage/cleaning/utility)
- Takes photos
       ↓
Status: COMPLETED
(Room availability restored)
```

### 3. Extension Request Workflow

```
Student in ACTIVE booking
       ↓
30 days before expiry
       ↓
Student requests extension
- Specifies duration (1-12 months)
- Provides reason
       ↓
Extension Request: PENDING
       ↓
Owner reviews → Approve/Reject
       ↓              ↓
Status: APPROVED   Status: REJECTED
(Booking duration  (Extension declined)
 extended)
```

### 4. Cancellation Workflow

```
Student/Owner initiates cancellation
       ↓
Provides reason
       ↓
Optional: Specifies refund amount
       ↓
Status: CANCELLED
       ↓
Room availability restored
       ↓
Refund processed (if applicable)
```

---

## API Client Methods

### Available Methods

```typescript
// Statistics
api.getBookingStatistics(timeframe?: 'week' | 'month' | 'year' | 'all')

// My Bookings
api.getMyBookings(type?: 'pending' | 'confirmed' | 'active' | ...)

// Actions - Owner
api.approveBooking(bookingId, notes?)
api.rejectBooking(bookingId, reason)
api.checkInStudent(bookingId, details?)
api.checkOutStudent(bookingId, details?)
api.approveExtension(bookingId, extensionId)
api.rejectExtension(bookingId, extensionId, reason)

// Actions - Student
api.requestBookingExtension(bookingId, months, reason?)
api.cancelBooking(bookingId, reason, refundAmount?)

// Generic
api.performBookingAction(bookingId, actionData)
```

### Import and Usage

```typescript
import { api } from '@/lib/api';

// Get statistics
const stats = await api.getBookingStatistics('month');

// Approve booking
const result = await api.approveBooking('booking_id', 'Welcome!');

// Request extension
await api.requestBookingExtension('booking_id', 3, 'Need more time');
```

---

## Frontend Integration

### Student Dashboard Components

#### 1. BookingStatisticsWidget

```tsx
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export function BookingStatisticsWidget() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadStats() {
      const response = await api.getBookingStatistics('month');
      if (response.success) {
        setStats(response.data);
      }
    }
    loadStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Current Booking */}
      {stats.student?.hasActiveBooking && (
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold">Current Booking</h3>
          <p>{stats.student.currentBooking.room.title}</p>
          <p className="text-sm text-gray-600">
            ₹{stats.student.currentBooking.monthlyRent}/month
          </p>
        </div>
      )}

      {/* Total Spent */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold">Total Spent</h3>
        <p className="text-2xl font-bold">
          ₹{stats.student?.totalSpent?.toLocaleString()}
        </p>
      </div>

      {/* Average Stay */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold">Average Stay</h3>
        <p className="text-2xl font-bold">
          {stats.student?.averageStayDuration} months
        </p>
      </div>
    </div>
  );
}
```

#### 2. ExtensionRequestForm

```tsx
import { useState } from 'react';
import { api } from '@/lib/api';

export function ExtensionRequestForm({ bookingId, onSuccess }) {
  const [months, setMonths] = useState(1);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.requestBookingExtension(
        bookingId,
        months,
        reason
      );

      if (response.success) {
        onSuccess?.();
        alert('Extension request submitted successfully!');
      }
    } catch (error) {
      alert('Failed to submit extension request');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Extension Duration (months)</label>
        <select
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          className="w-full p-2 border rounded"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
            <option key={m} value={m}>{m} month{m > 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Reason</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded"
      >
        {loading ? 'Submitting...' : 'Request Extension'}
      </button>
    </form>
  );
}
```

### Owner Dashboard Components

#### 1. OwnerAnalyticsWidget

```tsx
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export function OwnerAnalyticsWidget() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadStats() {
      const response = await api.getBookingStatistics('month');
      if (response.success) {
        setStats(response.data);
      }
    }
    loadStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-sm text-gray-600">Occupancy Rate</h3>
        <p className="text-2xl font-bold">
          {stats.owner?.occupancyRate?.toFixed(1)}%
        </p>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-sm text-gray-600">Total Earnings</h3>
        <p className="text-2xl font-bold">
          ₹{stats.owner?.totalEarnings?.toLocaleString()}
        </p>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-sm text-gray-600">Active Tenants</h3>
        <p className="text-2xl font-bold">
          {stats.owner?.activeTenants}
        </p>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-sm text-gray-600">Renewal Rate</h3>
        <p className="text-2xl font-bold">
          {stats.owner?.renewalRate?.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
```

#### 2. BookingActionButtons

```tsx
import { api } from '@/lib/api';

export function BookingActionButtons({ booking, onSuccess }) {
  async function handleApprove() {
    if (confirm('Approve this booking?')) {
      const response = await api.approveBooking(booking._id);
      if (response.success) {
        onSuccess?.();
        alert('Booking approved!');
      }
    }
  }

  async function handleReject() {
    const reason = prompt('Reason for rejection:');
    if (reason) {
      const response = await api.rejectBooking(booking._id, reason);
      if (response.success) {
        onSuccess?.();
        alert('Booking rejected');
      }
    }
  }

  async function handleCheckIn() {
    const notes = prompt('Check-in notes (optional):');
    const response = await api.checkInStudent(booking._id, { notes });
    if (response.success) {
      onSuccess?.();
      alert('Student checked in successfully!');
    }
  }

  async function handleCheckOut() {
    // Show modal/form for detailed check-out
    const notes = prompt('Check-out notes (optional):');
    const response = await api.checkOutStudent(booking._id, { notes });
    if (response.success) {
      onSuccess?.();
      alert('Student checked out successfully!');
    }
  }

  return (
    <div className="flex gap-2">
      {booking.status === 'pending' && (
        <>
          <button
            onClick={handleApprove}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Approve
          </button>
          <button
            onClick={handleReject}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Reject
          </button>
        </>
      )}

      {booking.status === 'confirmed' && (
        <button
          onClick={handleCheckIn}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Check In
        </button>
      )}

      {booking.status === 'active' && (
        <button
          onClick={handleCheckOut}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Check Out
        </button>
      )}
    </div>
  );
}
```

---

## Testing Guide

### 1. Test Booking Statistics

```bash
# Get monthly statistics
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/bookings/statistics?timeframe=month

# Get all-time statistics
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/bookings/statistics?timeframe=all
```

### 2. Test My Bookings

```bash
# Get all bookings
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/bookings/my-bookings?type=all

# Get expiring bookings
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/bookings/my-bookings?type=expiring
```

### 3. Test Booking Actions

```bash
# Approve booking
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"approve","notes":"Welcome!"}' \
  http://localhost:3000/api/bookings/BOOKING_ID/actions

# Request extension
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"request_extension","extensionDuration":3,"reason":"Need more time"}' \
  http://localhost:3000/api/bookings/BOOKING_ID/actions
```

### Node.js Test Script

Create `test-booking-enhancements.js`:

```javascript
const API_BASE = 'http://localhost:3000/api';
let token = 'YOUR_TOKEN';

async function testBookingEnhancements() {
  // Test 1: Get statistics
  console.log('\n=== Testing Booking Statistics ===');
  const stats = await fetch(`${API_BASE}/bookings/statistics?timeframe=month`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('Statistics:', await stats.json());

  // Test 2: Get my bookings
  console.log('\n=== Testing My Bookings ===');
  const myBookings = await fetch(`${API_BASE}/bookings/my-bookings?type=all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('My Bookings:', await myBookings.json());

  // Test 3: Approve booking
  console.log('\n=== Testing Booking Approval ===');
  const approve = await fetch(`${API_BASE}/bookings/BOOKING_ID/actions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'approve',
      notes: 'Welcome to our property!'
    })
  });
  console.log('Approval Result:', await approve.json());
}

testBookingEnhancements();
```

---

## Summary of Enhancements

### New Endpoints (3)
1. `/api/bookings/statistics` - Comprehensive analytics
2. `/api/bookings/my-bookings` - Categorized bookings
3. `/api/bookings/:id/actions` - Workflow management

### New API Methods (12)
1. `getBookingStatistics()`
2. `getMyBookings()`
3. `performBookingAction()`
4. `approveBooking()`
5. `rejectBooking()`
6. `cancelBooking()`
7. `checkInStudent()`
8. `checkOutStudent()`
9. `requestBookingExtension()`
10. `approveExtension()`
11. `rejectExtension()`

### New Model Fields
- `refundStatus`
- `checkInDetails` (with meter readings, photos, condition)
- `checkOutDetails` (with charges, settlement)
- `extensionRequests` (full workflow tracking)
- `studentReviewSubmitted` / `ownerReviewSubmitted`

### Key Features
- ✅ Real-time statistics and analytics
- ✅ Role-based dashboard data
- ✅ Extension request workflow
- ✅ Check-in/check-out management
- ✅ Occupancy rate tracking
- ✅ Renewal rate calculation
- ✅ Payment status monitoring
- ✅ Expiring booking alerts
- ✅ Top property identification
- ✅ Favorite location tracking

---

## Next Steps

1. **Frontend Implementation**
   - Create booking dashboard pages
   - Build analytics visualization charts
   - Add extension request UI
   - Implement check-in/check-out forms

2. **Payment Integration**
   - Add payment gateway endpoints
   - Implement payment tracking
   - Create refund processing system

3. **Notifications**
   - Email notifications for actions
   - SMS alerts for important events
   - In-app notification system

4. **Advanced Features**
   - Automatic renewal suggestions
   - Predictive analytics
   - Maintenance request integration
   - Document management system

---

**Documentation Version:** 1.0
**Last Updated:** January 2024
**Author:** StudentNest Development Team
