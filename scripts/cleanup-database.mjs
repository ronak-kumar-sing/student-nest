#!/usr/bin/env node

/**
 * Database Cleanup Script
 *
 * This script removes all data from the MongoDB database.
 * USE WITH CAUTION - This will delete ALL data!
 *
 * Usage:
 *   node scripts/cleanup-database.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function cleanupDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collections\n`);

    if (collections.length === 0) {
      console.log('✨ Database is already empty!');
      await mongoose.connection.close();
      return;
    }

    // Confirm deletion
    console.log('⚠️  WARNING: This will delete ALL data from the following collections:');
    collections.forEach((collection) => {
      console.log(`   - ${collection.name}`);
    });
    console.log('\n');

    // In a real scenario, you might want to add a confirmation prompt here
    // For now, we'll proceed with deletion

    console.log('🗑️  Starting cleanup...\n');

    let totalDeleted = 0;

    for (const collection of collections) {
      const collectionName = collection.name;

      try {
        const result = await db.collection(collectionName).deleteMany({});
        console.log(`✅ ${collectionName}: Deleted ${result.deletedCount} documents`);
        totalDeleted += result.deletedCount;
      } catch (error) {
        console.error(`❌ Error cleaning ${collectionName}:`, error.message);
      }
    }

    console.log(`\n✨ Cleanup complete! Total documents deleted: ${totalDeleted}`);

    await mongoose.connection.close();
    console.log('🔌 Database connection closed');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

// Run the cleanup
console.log('🧹 Database Cleanup Script\n');
console.log('=' .repeat(50));
cleanupDatabase();
