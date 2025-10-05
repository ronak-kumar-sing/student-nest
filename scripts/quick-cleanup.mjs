#!/usr/bin/env node

/**
 * Quick Database Cleanup Script (No Confirmation)
 * 
 * This script removes all data from the MongoDB database without confirmation.
 * USE ONLY IN DEVELOPMENT!
 * 
 * Usage:
 *   node scripts/quick-cleanup.mjs
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

async function quickCleanup() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected\n');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    if (collections.length === 0) {
      console.log('✨ Database is already empty!');
      await mongoose.connection.close();
      return;
    }

    console.log(`🗑️  Cleaning ${collections.length} collections...\n`);

    let totalDeleted = 0;
    
    for (const collection of collections) {
      const collectionName = collection.name;
      const result = await db.collection(collectionName).deleteMany({});
      console.log(`✅ ${collectionName}: ${result.deletedCount} deleted`);
      totalDeleted += result.deletedCount;
    }

    console.log(`\n✨ Done! Deleted ${totalDeleted} documents total\n`);

    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

quickCleanup();
