# Database Cleanup Scripts

This directory contains scripts to clean up the MongoDB database.

## Available Scripts

### 1. Quick Cleanup (No Confirmation) ⚡
**File:** `quick-cleanup.mjs`

Deletes all data from the database immediately without asking for confirmation.

```bash
node scripts/quick-cleanup.mjs
```

**Use when:**
- Development environment
- You want to quickly reset the database
- Testing new features

**Output:**
```
🔌 Connecting to MongoDB...
✅ Connected

🗑️  Cleaning 8 collections...

✅ users: 15 deleted
✅ properties: 23 deleted
✅ bookings: 12 deleted
✅ otps: 45 deleted
✅ meetings: 8 deleted
✅ messages: 156 deleted
✅ payments: 5 deleted
✅ notifications: 67 deleted

✨ Done! Deleted 331 documents total
```

---

### 2. Safe Cleanup (With Confirmation) 🔒
**File:** `cleanup-database-safe.mjs`

Shows what will be deleted and asks for confirmation before proceeding.

```bash
node scripts/cleanup-database-safe.mjs
```

**Use when:**
- Shared development environment
- You want to see what will be deleted first
- Production-like environment

**Interaction:**
```
📊 Found 8 collections

⚠️  WARNING: This will delete ALL data from the following collections:
──────────────────────────────────────────────────
   📁 users                          (15 documents)
   📁 properties                     (23 documents)
   📁 bookings                       (12 documents)
   📁 otps                           (45 documents)
   📁 meetings                       (8 documents)
   📁 messages                       (156 documents)
   📁 payments                       (5 documents)
   📁 notifications                  (67 documents)
──────────────────────────────────────────────────

⚠️  THIS ACTION CANNOT BE UNDONE!

Are you sure you want to delete ALL data? Type "DELETE ALL" to confirm:
```

You must type exactly `DELETE ALL` to proceed.

---

### 3. Advanced Cleanup (Detailed)
**File:** `cleanup-database.mjs`

Similar to quick cleanup but with more detailed logging.

```bash
node scripts/cleanup-database.mjs
```

---

## Prerequisites

Make sure you have:
1. Node.js installed (v18 or higher)
2. MongoDB connection string in `.env.local`
3. Required dependencies installed:
   ```bash
   npm install mongoose dotenv
   ```

---

## Environment Setup

Your `.env.local` file should contain:
```env
MONGODB_URI=mongodb://localhost:27017/studentnest
# or
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studentnest
```

---

## Common Use Cases

### Reset Database for Testing
```bash
node scripts/quick-cleanup.mjs
```

### Clean Database Before Demo
```bash
node scripts/cleanup-database-safe.mjs
# Type "DELETE ALL" when prompted
```

### Check What Will Be Deleted
```bash
node scripts/cleanup-database-safe.mjs
# Just view the list, press Ctrl+C to cancel
```

---

## What Gets Deleted

These scripts will delete ALL documents from ALL collections, including:

- 👥 **Users** (Students and Owners)
- 🏠 **Properties** (Room listings)
- 📅 **Bookings** (All reservations)
- 🔐 **OTPs** (Verification codes)
- 📆 **Meetings** (Visit requests)
- 💬 **Messages** (Chat history)
- 💳 **Payments** (Payment records)
- 🔔 **Notifications**
- And any other collections in the database

---

## Safety Tips

⚠️ **IMPORTANT:**
- These scripts delete data **permanently**
- There is **no undo** operation
- **Always backup** important data before running
- Use **safe cleanup** in shared environments
- Use **quick cleanup** only in your local development

---

## Backup Before Cleanup (Optional)

If you want to backup before cleaning:

```bash
# MongoDB dump
mongodump --uri="your-mongodb-uri" --out=./backup-$(date +%Y%m%d)

# Or export specific collection
mongoexport --uri="your-mongodb-uri" --collection=users --out=users-backup.json
```

---

## Troubleshooting

### Error: MONGODB_URI not found
**Solution:** Make sure `.env.local` exists and contains `MONGODB_URI`

### Error: Connection timeout
**Solution:**
- Check if MongoDB is running
- Verify the connection string is correct
- Check network/firewall settings

### Error: Permission denied
**Solution:** Make sure the database user has delete permissions

### Script hangs on "Connecting to MongoDB..."
**Solution:**
- Press Ctrl+C to cancel
- Check MongoDB URI is correct
- Ensure MongoDB server is accessible

---

## After Cleanup

After running cleanup, you may want to:

1. **Reseed demo data:**
   ```bash
   node scripts/seed-demo-data.js
   ```

2. **Create test users:**
   ```bash
   node scripts/create-demo-student.js
   node scripts/create-demo-owner.js
   ```

3. **Restart the application:**
   ```bash
   npm run dev
   ```

---

## Script Comparison

| Feature | Quick Cleanup | Safe Cleanup | Advanced Cleanup |
|---------|--------------|--------------|------------------|
| Confirmation Required | ❌ No | ✅ Yes | ❌ No |
| Shows Collection Names | ✅ Yes | ✅ Yes | ✅ Yes |
| Shows Document Counts | ❌ No | ✅ Yes | ❌ No |
| Detailed Logging | ⚠️ Medium | ✅ High | ✅ High |
| Best For | Dev | Shared Dev | Dev/Testing |
| Speed | ⚡ Fast | 🐢 Slower | ⚡ Fast |

---

## Examples

### Example 1: Quick Daily Reset
```bash
# Morning: Clean database
node scripts/quick-cleanup.mjs

# Seed with fresh demo data
node scripts/seed-demo-data.js

# Start development
npm run dev
```

### Example 2: Safe Team Environment
```bash
# Show what's in the database
node scripts/cleanup-database-safe.mjs
# Review the list, then type "DELETE ALL" if needed
```

### Example 3: Integration Testing
```bash
# Before test suite
node scripts/quick-cleanup.mjs

# Run tests
npm test

# After tests (optional cleanup)
node scripts/quick-cleanup.mjs
```

---

## Need Help?

If you encounter issues:
1. Check `.env.local` has correct `MONGODB_URI`
2. Ensure MongoDB is running
3. Check console logs for specific errors
4. Try the safe cleanup script to see detailed info

---

**Last Updated:** October 5, 2025
**Scripts Version:** 1.0.0
