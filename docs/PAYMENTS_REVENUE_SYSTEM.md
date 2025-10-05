# Payment & Revenue System - Complete Documentation

## 📋 Overview

A comprehensive payment tracking and revenue management system for both property owners and students in the StudentNest platform. Features real-time statistics, transaction history, payment status management, and visual analytics.

---

## 🎯 Features

### For Owners
- ✅ **Revenue Dashboard** - Real-time revenue tracking with period-based filters
- ✅ **Payment Statistics** - Detailed breakdowns by status, type, and trends
- ✅ **Payment Management** - View, confirm, and manage all payment transactions
- ✅ **Visual Analytics** - Charts showing revenue trends and payment distributions
- ✅ **Upcoming Payments** - Track payments due in the next 30 days
- ✅ **Overdue Alerts** - Identify and manage overdue payments
- ✅ **Export Functionality** - Download payment reports (CSV, PDF)
- ✅ **Search & Filter** - Advanced filtering by status, type, date range

### For Students
- ✅ **Payment History** - Complete transaction record
- ✅ **Upcoming Dues** - Track upcoming rent and other payments
- ✅ **Payment Status** - Real-time status updates
- ✅ **Receipt Download** - Access payment receipts
- ✅ **Payment Methods** - Multiple payment options (UPI, Card, Net Banking)

---

## 🏗️ Architecture

### Backend API Routes

#### 1. `/api/payments` (GET, POST)
**GET** - Fetch payments with filters
```typescript
Query Parameters:
- status: 'pending' | 'completed' | 'processing' | 'failed' | 'refunded'
- type: 'booking' | 'rent' | 'deposit' | 'maintenance' | 'late_fee' | 'refund'
- startDate: ISO date string
- endDate: ISO date string
- page: number (default: 1)
- limit: number (default: 20)

Response:
{
  success: true,
  data: {
    payments: Payment[],
    pagination: {
      page: number,
      limit: number,
      totalCount: number,
      totalPages: number
    },
    statistics: {
      totalAmount: number,
      totalCompleted: number,
      totalPending: number,
      completedCount: number,
      pendingCount: number
    }
  }
}
```

**POST** - Create new payment
```typescript
Body:
{
  bookingId: string,
  amount: number,
  type: 'booking' | 'rent' | 'deposit' | 'maintenance' | 'late_fee',
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cash' | 'bank_transfer',
  dueDate?: Date,
  description?: string,
  notes?: string
}

Response:
{
  success: true,
  message: string,
  data: {
    paymentId: string,
    payment: Payment
  }
}
```

#### 2. `/api/payments/[id]` (GET, PATCH)
**GET** - Get payment details
```typescript
Response:
{
  success: true,
  data: {
    payment: {
      id: string,
      booking: Booking,
      student: User,
      owner: User,
      property: Property,
      amount: number,
      type: string,
      status: string,
      paymentMethod: string,
      transactionId?: string,
      dueDate: Date,
      paidDate?: Date,
      description?: string,
      receiptUrl?: string,
      notes?: string,
      gatewayResponse?: any,
      metadata?: any,
      createdAt: Date,
      updatedAt: Date
    }
  }
}
```

**PATCH** - Update payment status (Owner only)
```typescript
Body:
{
  status: 'completed' | 'processing' | 'failed' | 'refunded',
  transactionId?: string,
  gatewayResponse?: any,
  receiptUrl?: string,
  notes?: string
}

Response:
{
  success: true,
  message: string,
  data: {
    payment: Payment
  }
}
```

#### 3. `/api/payments/statistics` (GET)
**GET** - Comprehensive payment statistics
```typescript
Query Parameters:
- period: 'month' | 'quarter' | 'year' | 'all'

Response:
{
  success: true,
  data: {
    overview: {
      totalAmount: number,
      totalCount: number,
      averageAmount: number,
      periodAmount: number,
      periodCount: number,
      periodCompleted: number,
      periodPending: number,
      overdueCount: number,
      overdueAmount: number
    },
    statusBreakdown: Array<{
      status: string,
      total: number,
      count: number,
      percentage: string
    }>,
    typeBreakdown: Array<{
      type: string,
      total: number,
      count: number,
      percentage: string
    }>,
    monthlyTrend: Array<{
      month: string,
      total: number,
      count: number,
      completed: number,
      pending: number
    }>,
    recentPayments: Payment[],
    upcomingPayments: Payment[]
  }
}
```

---

## 🗄️ Database Schema

### Payment Model
```typescript
{
  bookingId: ObjectId (ref: 'Booking'),
  studentId: ObjectId (ref: 'User'),
  ownerId: ObjectId (ref: 'User'),
  propertyId: ObjectId (ref: 'Room'),
  amount: Number,
  type: 'booking' | 'rent' | 'deposit' | 'maintenance' | 'late_fee' | 'refund',
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded',
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cash' | 'bank_transfer',
  transactionId: String,
  gatewayResponse: Mixed,
  dueDate: Date,
  paidDate: Date,
  description: String,
  receiptUrl: String,
  notes: String,
  metadata: Mixed,
  timestamps: true
}
```

### Indexes
```javascript
// For efficient queries
- { ownerId: 1, status: 1, createdAt: -1 }
- { studentId: 1, status: 1, createdAt: -1 }
- { bookingId: 1 }
- { transactionId: 1 }
- { dueDate: 1, status: 1 }
```

---

## 🎨 Frontend Components

### 1. PaymentsRevenuePage Component
Location: `/src/components/owner/PaymentsRevenuePage.tsx`

**Features:**
- Real-time revenue dashboard
- Interactive charts (Line chart for trends, Bar chart for types)
- Advanced filtering and search
- Payment status management
- Detailed payment view dialog
- Export functionality
- Responsive design

**Key Sections:**
```tsx
// Stats Cards
- Total Revenue
- Period Revenue
- Pending Payments
- Overdue Payments

// Charts
- Revenue Trend (Monthly)
- Payment Types Breakdown

// Lists
- Upcoming Payments (next 30 days)
- All Payments (with filters)

// Actions
- View payment details
- Confirm payment
- Mark as failed
- Export to CSV
```

### 2. MyPropertiesPage Component
Location: `/src/components/owner/MyPropertiesPage.tsx`

**Features:**
- Grid/List view toggle
- Property search and filtering
- Quick action menu (View, Edit, Activate/Deactivate, Delete)
- Occupancy visualization
- Status badges
- Performance stats

**Stats Displayed:**
- Total Properties
- Active Listings
- Occupied Properties
- Monthly Revenue
- Average Rating

---

## 🔧 Usage Examples

### Creating a Payment
```typescript
// Owner creates a rent payment for a booking
const createPayment = async (bookingId: string) => {
  const token = localStorage.getItem('accessToken');

  const response = await fetch('/api/payments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bookingId,
      amount: 15000,
      type: 'rent',
      paymentMethod: 'upi',
      dueDate: new Date('2025-11-01'),
      description: 'November 2025 Rent',
    }),
  });

  const result = await response.json();
  if (result.success) {
    console.log('Payment created:', result.data.paymentId);
  }
};
```

### Fetching Payment Statistics
```typescript
// Get monthly revenue statistics
const getStats = async () => {
  const token = localStorage.getItem('accessToken');

  const response = await fetch('/api/payments/statistics?period=month', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (result.success) {
    console.log('Total revenue:', result.data.overview.periodAmount);
    console.log('Pending:', result.data.overview.periodPending);
  }
};
```

### Updating Payment Status
```typescript
// Owner confirms a payment
const confirmPayment = async (paymentId: string) => {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`/api/payments/${paymentId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'completed',
      transactionId: 'TXN123456789',
      notes: 'Payment verified and confirmed',
    }),
  });

  const result = await response.json();
  if (result.success) {
    console.log('Payment confirmed');
  }
};
```

---

## 📊 Analytics & Reports

### Revenue Trend Chart
Shows monthly revenue with completed vs pending breakdown
- **X-Axis:** Months (last 6 months)
- **Y-Axis:** Revenue amount (₹)
- **Lines:** Completed (solid), Pending (dashed)

### Payment Types Chart
Bar chart showing distribution by payment type
- **Types:** Booking, Rent, Deposit, Maintenance, Late Fee
- **Metric:** Total amount per type

### Upcoming Payments Widget
- Shows payments due in next 30 days
- Sorted by due date
- Quick view of student, property, amount

---

## 🔐 Security & Authorization

### Role-Based Access
```typescript
// Owner can:
- View all payments for their properties
- Create payments for bookings
- Update payment status
- View detailed statistics

// Student can:
- View their own payments
- See payment history
- Download receipts
- Track upcoming dues
```

### Authentication
All API routes require valid JWT token:
```typescript
headers: {
  'Authorization': 'Bearer <accessToken>'
}
```

### Data Privacy
- Students only see their own payment records
- Owners only see payments for their properties
- Transaction details are encrypted
- Receipt URLs are time-limited

---

## 🎯 Best Practices

### For Owners
1. **Regular Reconciliation** - Check payment statistics weekly
2. **Prompt Confirmation** - Verify and confirm payments within 24 hours
3. **Clear Documentation** - Add notes to payments for record-keeping
4. **Track Overdue** - Monitor and follow up on overdue payments
5. **Export Reports** - Download monthly reports for accounting

### For Students
1. **Early Payment** - Pay rent at least 3 days before due date
2. **Keep Receipts** - Download and save payment receipts
3. **Verify Amounts** - Check payment details before confirming
4. **Contact Support** - Report payment issues immediately

---

## 🐛 Error Handling

### Common Errors
```typescript
// 401 Unauthorized
{
  success: false,
  error: 'Invalid or expired token'
}

// 403 Forbidden
{
  success: false,
  error: 'Unauthorized to view this payment'
}

// 404 Not Found
{
  success: false,
  error: 'Payment not found'
}

// 400 Bad Request
{
  success: false,
  error: 'Missing required fields: amount, paymentMethod'
}
```

### Error Handling Pattern
```typescript
try {
  const response = await fetch('/api/payments');
  const result = await response.json();

  if (!result.success) {
    toast.error(result.error);
    return;
  }

  // Handle success
  setPayments(result.data.payments);
} catch (error) {
  console.error('Payment error:', error);
  toast.error('Failed to load payments');
}
```

---

## 🚀 Performance Optimization

### Database Queries
- Indexed queries for fast retrieval
- Pagination for large datasets (20 items per page)
- Aggregation pipelines for statistics
- Lean queries for read-only operations

### Frontend
- Lazy loading for payment list
- Cached statistics (refetch on demand)
- Debounced search (300ms delay)
- Optimistic UI updates

### Caching Strategy
```typescript
// Statistics cached for 5 minutes
const statsCache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000 // 5 minutes
};

const getCachedStats = () => {
  if (statsCache.data &&
      Date.now() - statsCache.timestamp < statsCache.ttl) {
    return statsCache.data;
  }
  return null;
};
```

---

## 📱 Mobile Responsiveness

All components are fully responsive:
- **Desktop:** Full feature set with side-by-side layouts
- **Tablet:** Stacked layouts with collapsible sections
- **Mobile:** Single-column view with swipe gestures

### Breakpoints
```css
sm: 640px  // Small tablets
md: 768px  // Tablets
lg: 1024px // Desktops
xl: 1280px // Large desktops
```

---

## 🔄 Future Enhancements

### Planned Features
- [ ] **Payment Gateway Integration** - Razorpay, Stripe, PayPal
- [ ] **Auto-recurring Payments** - Automatic monthly rent collection
- [ ] **Late Fee Calculation** - Automatic late fee addition
- [ ] **Payment Reminders** - Email/SMS reminders before due date
- [ ] **Receipt Generation** - Auto-generated PDF receipts
- [ ] **Payment Plans** - Installment payment options
- [ ] **Refund Processing** - Automated refund workflow
- [ ] **Tax Reporting** - GST/TDS calculation and reports

### API Enhancements
- [ ] Bulk payment creation
- [ ] Scheduled payments
- [ ] Payment webhooks
- [ ] Real-time payment notifications
- [ ] Multi-currency support

---

## 📞 Support & Troubleshooting

### Common Issues

**1. Payments not showing**
```bash
# Check database connection
# Verify JWT token is valid
# Check user role permissions
```

**2. Statistics incorrect**
```bash
# Clear cache and refresh
# Re-run aggregation pipeline
# Check date range filters
```

**3. Export not working**
```bash
# Check browser download permissions
# Verify CSV generation logic
# Check file size limits
```

### Debug Mode
```typescript
// Enable debug logging
localStorage.setItem('DEBUG_PAYMENTS', 'true');

// View detailed logs in console
console.log('Payment Query:', { userId, role, filters });
```

---

## 📝 Testing

### Unit Tests
```typescript
// Test payment creation
describe('Payment API', () => {
  test('creates payment successfully', async () => {
    const payment = await createPayment({
      bookingId: 'test-booking-id',
      amount: 10000,
      type: 'rent',
      paymentMethod: 'upi'
    });

    expect(payment.success).toBe(true);
    expect(payment.data.payment.amount).toBe(10000);
  });
});
```

### Integration Tests
```typescript
// Test payment flow
test('complete payment flow', async () => {
  // 1. Create payment
  const payment = await createPayment(data);

  // 2. Update status
  const updated = await updatePayment(payment.id, {
    status: 'completed'
  });

  // 3. Verify in statistics
  const stats = await getStatistics();
  expect(stats.overview.periodCompleted).toBeGreaterThan(0);
});
```

---

## 🎉 Conclusion

The Payment & Revenue system provides a complete solution for managing financial transactions in the StudentNest platform. With real-time tracking, visual analytics, and comprehensive reporting, both owners and students have full visibility and control over their payments.

For questions or support, contact: support@studentnest.com

---

**Last Updated:** October 5, 2025
**Version:** 1.0.0
**Author:** StudentNest Development Team
