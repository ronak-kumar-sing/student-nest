#!/usr/bin/env node

/**
 * Safe Database Cleanup Script with Confirmation
 * 
 * This script removes all data from the MongoDB database after user confirmation.
 * 
 * Usage:
 *   node scripts/cleanup-database-safe.mjs
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in environment variables');
  process.exit(1);
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
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
      rl.close();
      return;
    }

    // Show what will be deleted
    console.log('⚠️  WARNING: This will delete ALL data from the following collections:');
    console.log('─'.repeat(50));
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`   📁 ${collection.name.padEnd(30)} (${count} documents)`);
    }
    console.log('─'.repeat(50));
    console.log('\n⚠️  THIS ACTION CANNOT BE UNDONE!\n');

    // Ask for confirmation
    const answer = await askQuestion('Are you sure you want to delete ALL data? Type "DELETE ALL" to confirm: ');
    
    if (answer.trim() !== 'DELETE ALL') {
      console.log('\n❌ Cleanup cancelled. No data was deleted.');
      await mongoose.connection.close();
      rl.close();
      return;
    }

    console.log('\n🗑️  Starting cleanup...\n');

    let totalDeleted = 0;
    
    for (const collection of collections) {
      const collectionName = collection.name;
      
      try {
        const result = await db.collection(collectionName).deleteMany({});
        console.log(`✅ ${collectionName.padEnd(30)} Deleted ${result.deletedCount} documents`);
        totalDeleted += result.deletedCount;
      } catch (error) {
        console.error(`❌ Error cleaning ${collectionName}:`, error.message);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✨ Cleanup complete! Total documents deleted: ${totalDeleted}`);
    console.log('='.repeat(50) + '\n');

    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    rl.close();
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    rl.close();
    process.exit(1);
  }
}

// Run the cleanup
console.log('\n🧹 Database Cleanup Script (Safe Mode)\n');
console.log('='.repeat(50));
cleanupDatabase();
