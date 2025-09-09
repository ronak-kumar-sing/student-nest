// Mock User model for demo purposes
// In a real application, this would use an ORM like Prisma, Mongoose, etc.

export class User {
  constructor(userData) {
    this.id = userData.id;
    this.email = userData.email;
    this.password = userData.password; // In real app, this would be hashed
    this.role = userData.role || 'student';
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.name = userData.name || `${userData.firstName} ${userData.lastName}`;
    this.phone = userData.phone;
    this.avatar = userData.avatar;
    this.isActive = userData.isActive ?? true;
    this.emailVerified = userData.emailVerified ?? false;
    this.phoneVerified = userData.phoneVerified ?? false;
    this.createdAt = userData.createdAt || new Date().toISOString();
    this.updatedAt = userData.updatedAt || new Date().toISOString();

    // Role-specific data
    if (userData.profile) {
      this.profile = userData.profile;
    }

    if (userData.verification) {
      this.verification = userData.verification;
    }

    // Student-specific fields
    if (this.role === 'student') {
      this.college = userData.college;
      this.yearOfStudy = userData.yearOfStudy;
      this.course = userData.course;
      this.savedProperties = userData.savedProperties || 0;
      this.meetingRequests = userData.meetingRequests || 0;
      this.profileCompleteness = userData.profileCompleteness || 0;
    }

    // Owner-specific fields
    if (this.role === 'owner') {
      this.businessName = userData.businessName;
      this.businessType = userData.businessType;
      this.experience = userData.experience || 0;
      this.totalProperties = userData.totalProperties || 0;
      this.totalBookings = userData.totalBookings || 0;
      this.averageRating = userData.averageRating || 0;
      this.responseTime = userData.responseTime || 0;
    }
  }

  // Validation method
  static validate(userData) {
    const errors = [];

    // Required fields
    if (!userData.email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(userData.email)) {
      errors.push('Invalid email format');
    }

    if (!userData.password) {
      errors.push('Password is required');
    } else if (userData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (!userData.firstName) {
      errors.push('First name is required');
    }

    if (!userData.lastName) {
      errors.push('Last name is required');
    }

    if (!userData.role || !['student', 'owner'].includes(userData.role)) {
      errors.push('Valid role (student or owner) is required');
    }

    // Phone validation if provided
    if (userData.phone && !this.isValidPhone(userData.phone)) {
      errors.push('Invalid phone number format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Email validation
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone validation
  static isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s|-|\(|\)/g, ''));
  }

  // Convert to JSON (remove sensitive data)
  toJSON() {
    const userData = { ...this };
    delete userData.password; // Never send password to client
    return userData;
  }

  // Get public profile (even more limited data)
  toPublicProfile() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      name: this.name,
      avatar: this.avatar,
      role: this.role,
      isActive: this.isActive,
      emailVerified: this.emailVerified,
      phoneVerified: this.phoneVerified,
      createdAt: this.createdAt,

      // Role-specific public data
      ...(this.role === 'student' && {
        college: this.college,
        yearOfStudy: this.yearOfStudy,
        course: this.course
      }),

      ...(this.role === 'owner' && {
        businessName: this.businessName,
        businessType: this.businessType,
        experience: this.experience,
        averageRating: this.averageRating,
        totalProperties: this.totalProperties
      })
    };
  }

  // Update user data
  update(updates) {
    // Only allow certain fields to be updated
    const allowedUpdates = [
      'firstName', 'lastName', 'name', 'phone', 'avatar',
      'college', 'yearOfStudy', 'course', 'businessName',
      'businessType', 'experience', 'profile', 'verification'
    ];

    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        this[field] = updates[field];
      }
    });

    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Check if user has specific verification
  hasVerification(type) {
    if (!this.verification) return false;

    switch (type) {
      case 'email':
        return this.emailVerified;
      case 'phone':
        return this.phoneVerified;
      case 'college':
        return this.verification.collegeId === 'verified';
      case 'aadhaar':
        return this.verification.aadhaar === 'verified';
      case 'pan':
        return this.verification.pan === 'verified';
      case 'digilocker':
        return this.verification.digilocker === true;
      default:
        return false;
    }
  }

  // Calculate profile completeness percentage
  getProfileCompleteness() {
    const requiredFields = this.role === 'student'
      ? ['firstName', 'lastName', 'email', 'phone', 'college', 'yearOfStudy', 'course']
      : ['firstName', 'lastName', 'email', 'phone', 'businessName', 'businessType'];

    const completedFields = requiredFields.filter(field => this[field]);
    return Math.round((completedFields.length / requiredFields.length) * 100);
  }
}

export default User;
