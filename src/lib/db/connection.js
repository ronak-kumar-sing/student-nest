// Mock database connection for demo purposes
// In a real application, this would connect to MongoDB, PostgreSQL, etc.

import { sampleUsers } from '@/utils/sampleData';

class MockDatabase {
  constructor() {
    // Initialize with sample data
    this.users = [...sampleUsers];
    this.profiles = {};
  }

  // User operations
  getUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  getUserById(id) {
    return this.users.find(user => user.id === id);
  }

  createUser(userData) {
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...userData
    };

    this.users.push(newUser);
    return newUser;
  }

  updateUser(id, updates) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.users[userIndex];
  }

  deleteUser(id) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }

  // Profile operations
  getUserProfile(userId) {
    return this.profiles[userId];
  }

  updateUserProfile(userId, profileData) {
    this.profiles[userId] = {
      ...this.profiles[userId],
      ...profileData,
      updatedAt: new Date().toISOString()
    };

    return this.profiles[userId];
  }

  // Utility methods
  getAllUsers() {
    return this.users;
  }

  getUsersByRole(role) {
    return this.users.filter(user => user.role === role);
  }

  searchUsers(query) {
    const lowercaseQuery = query.toLowerCase();
    return this.users.filter(user =>
      user.name?.toLowerCase().includes(lowercaseQuery) ||
      user.email?.toLowerCase().includes(lowercaseQuery) ||
      user.firstName?.toLowerCase().includes(lowercaseQuery) ||
      user.lastName?.toLowerCase().includes(lowercaseQuery)
    );
  }
}

// Create a singleton instance
const db = new MockDatabase();

export default db;
