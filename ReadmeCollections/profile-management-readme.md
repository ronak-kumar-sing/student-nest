# Student Nest - Profile Management System

A comprehensive profile management system for Students and Room Owners with verification status tracking, document management, and preference settings.

## 🚀 Profile Features

### Student Profile Management
- **Personal Information**: Full name, email, phone, college details, and bio
- **Academic Details**: College ID, year of study, course, and verification status
- **Preferences**: Room type preferences, budget range, location preferences
- **Profile Verification**: Email and phone verification badges
- **Account Settings**: Password change, notification preferences, privacy settings
- **Activity History**: Recent searches, saved properties, meeting requests

### Owner Profile Management
- **Personal Information**: Full name, email, phone, and business details
- **Identity Verification**: Aadhaar/DigiLocker verification status and documents
- **Property Management**: Listed properties count, active/inactive status
- **Business Profile**: Property owner type, experience, ratings from students
- **Account Settings**: Password change, notification preferences, payment details
- **Analytics Dashboard**: Property views, meeting requests, booking statistics

### Verification System
- **Student Verification**: College email verification, ID document upload
- **Owner Verification**: Government ID verification with status tracking
- **Verification Badges**: Visual indicators for different verification levels
- **Document Management**: Secure upload, view, and update verification documents

## 📁 Profile Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── student/
│   │   │   └── profile/
│   │   │       ├── page.jsx              # Main profile page
│   │   │       ├── edit/page.jsx         # Edit profile form
│   │   │       ├── preferences/page.jsx  # Room preferences
│   │   │       ├── verification/page.jsx # Verification status
│   │   │       └── settings/page.jsx     # Account settings
│   │   └── owner/
│   │       └── profile/
│   │           ├── page.jsx              # Main profile page
│   │           ├── edit/page.jsx         # Edit profile form
│   │           ├── verification/page.jsx # Identity verification
│   │           ├── business/page.jsx     # Business details
│   │           └── settings/page.jsx     # Account settings
│   └── api/
│       ├── profile/
│       │   ├── student/
│       │   │   ├── route.js              # GET/PUT student profile
│       │   │   ├── preferences/route.js  # Room preferences
│       │   │   └── verification/route.js # Verification status
│       │   └── owner/
│       │       ├── route.js              # GET/PUT owner profile
│       │       ├── verification/route.js # Identity verification
│       │       └── business/route.js     # Business profile
│       └── upload/
│           ├── avatar/route.js           # Profile picture upload
│           └── documents/route.js        # Verification documents
├── components/
│   ├── profile/
│   │   ├── ProfileHeader.jsx             # Profile header with avatar
│   │   ├── ProfileNavigation.jsx         # Profile section navigation
│   │   ├── VerificationBadge.jsx         # Verification status badges
│   │   ├── DocumentUpload.jsx            # Document upload component
│   │   └── ProfileStats.jsx              # Activity statistics
│   ├── forms/
│   │   ├── ProfileEditForm.jsx           # Profile editing form
│   │   ├── PreferencesForm.jsx           # Student preferences form
│   │   ├── BusinessProfileForm.jsx       # Owner business details
│   │   └── PasswordChangeForm.jsx        # Password update form
│   └── ui/
│       ├── Avatar.jsx                    # Profile avatar component
│       ├── Badge.jsx                     # Status badges
│       └── FileUpload.jsx                # File upload utility
└── lib/
    ├── validation/
    │   └── profileSchemas.js             # Profile validation schemas
    └── utils/
        ├── imageProcessing.js            # Avatar image processing
        └── fileValidation.js             # Document validation
```

## 🎨 Profile Design System

### Student Profile Theme
- **Primary Colors**: Blue gradient (`from-blue-50 to-indigo-100`)
- **Verification Colors**: Green for verified, Orange for pending, Red for rejected
- **Profile Cards**: Academic-focused layout with verification badges

### Owner Profile Theme
- **Primary Colors**: Green gradient (`from-green-50 to-emerald-100`)
- **Business Colors**: Professional color scheme with trust indicators
- **Profile Cards**: Business-focused layout with property statistics

### Verification Status Indicators
```jsx
// Verification badge examples
<VerificationBadge status="verified" type="email" />
<VerificationBadge status="pending" type="identity" />
<VerificationBadge status="rejected" type="college_id" />
```

## 🔐 Profile Database Schema

### Student Profile Table
```sql
StudentProfiles {
  id: Primary Key
  userId: Foreign Key to Users
  firstName: String
  lastName: String
  bio: Text
  avatar: String (URL)
  dateOfBirth: Date
  gender: ENUM('male', 'female', 'other', 'prefer_not_to_say')
  
  // Academic Information
  collegeId: String
  collegeName: String
  yearOfStudy: ENUM('1st', '2nd', '3rd', '4th', 'graduate')
  course: String
  
  // Verification
  emailVerified: Boolean
  phoneVerified: Boolean
  collegeIdVerified: ENUM('pending', 'verified', 'rejected')
  collegeIdDocument: String (URL)
  
  // Preferences
  roomTypePreference: Array<String>
  budgetMin: Number
  budgetMax: Number
  locationPreferences: Array<String>
  amenityPreferences: Array<String>
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Owner Profile Table
```sql
OwnerProfiles {
  id: Primary Key
  userId: Foreign Key to Users
  firstName: String
  lastName: String
  bio: Text
  avatar: String (URL)
  dateOfBirth: Date
  
  // Business Information
  businessName: String
  businessType: ENUM('individual', 'company', 'trust')
  experience: Number (years)
  totalProperties: Number
  
  // Identity Verification
  aadhaarNumber: String (encrypted)
  aadhaarVerified: ENUM('pending', 'in_review', 'verified', 'rejected')
  aadhaarDocument: String (URL)
  digilockerVerified: Boolean
  panNumber: String (encrypted)
  panDocument: String (URL)
  
  // Business Details
  gstNumber: String
  businessAddress: Text
  businessPhone: String
  businessEmail: String
  
  // Ratings & Reviews
  averageRating: Decimal(2,1)
  totalReviews: Number
  responseTime: Number (hours)
  
  createdAt: DateTime
  updatedAt: DateTime
}
```

## 🚀 API Endpoints

### Student Profile APIs
```javascript
// Get student profile
GET /api/profile/student
Response: {
  profile: StudentProfile,
  verificationStatus: {
    email: boolean,
    phone: boolean,
    collegeId: 'pending' | 'verified' | 'rejected'
  },
  activityStats: {
    savedProperties: number,
    meetingRequests: number,
    profileViews: number
  }
}

// Update student profile
PUT /api/profile/student
Body: {
  firstName: string,
  lastName: string,
  bio: string,
  collegeId: string,
  collegeName: string,
  yearOfStudy: string,
  course: string
}

// Update room preferences
PUT /api/profile/student/preferences
Body: {
  roomTypePreference: string[],
  budgetMin: number,
  budgetMax: number,
  locationPreferences: string[],
  amenityPreferences: string[]
}

// Upload college ID document
POST /api/profile/student/verification
Body: FormData with collegeIdDocument file
```

### Owner Profile APIs
```javascript
// Get owner profile
GET /api/profile/owner
Response: {
  profile: OwnerProfile,
  verificationStatus: {
    aadhaar: 'pending' | 'in_review' | 'verified' | 'rejected',
    digilocker: boolean,
    pan: 'pending' | 'verified' | 'rejected'
  },
  businessStats: {
    totalProperties: number,
    activeListings: number,
    totalBookings: number,
    averageRating: number
  }
}

// Update owner profile
PUT /api/profile/owner
Body: {
  firstName: string,
  lastName: string,
  bio: string,
  businessName: string,
  businessType: string,
  experience: number
}

// Update business details
PUT /api/profile/owner/business
Body: {
  businessAddress: string,
  businessPhone: string,
  businessEmail: string,
  gstNumber: string
}

// Upload verification documents
POST /api/profile/owner/verification
Body: FormData with document files
```

### Common Profile APIs
```javascript
// Upload profile avatar
POST /api/upload/avatar
Body: FormData with avatar image file
Response: { avatarUrl: string }

// Change password
PUT /api/profile/password
Body: {
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
}

// Update notification preferences
PUT /api/profile/settings/notifications
Body: {
  emailNotifications: boolean,
  smsNotifications: boolean,
  pushNotifications: boolean,
  marketingEmails: boolean
}
```

## 🎯 Profile Components

### ProfileHeader Component
```jsx
// components/profile/ProfileHeader.jsx
const ProfileHeader = ({ user, profile, verificationStatus }) => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-lg">
    <div className="flex items-center space-x-4">
      <Avatar size="lg" src={profile.avatar} alt={profile.firstName} />
      <div>
        <h1 className="text-2xl font-bold">
          {profile.firstName} {profile.lastName}
        </h1>
        <p className="text-gray-600">{profile.bio}</p>
        <div className="flex space-x-2 mt-2">
          <VerificationBadge 
            status={verificationStatus.email ? 'verified' : 'pending'} 
            type="email" 
          />
          <VerificationBadge 
            status={verificationStatus.phone ? 'verified' : 'pending'} 
            type="phone" 
          />
        </div>
      </div>
    </div>
  </div>
);
```

### VerificationBadge Component
```jsx
// components/profile/VerificationBadge.jsx
const VerificationBadge = ({ status, type }) => {
  const statusConfig = {
    verified: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${statusConfig[status].color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {type} {status}
    </span>
  );
};
```

### ProfileEditForm Component
```jsx
// components/forms/ProfileEditForm.jsx
const ProfileEditForm = ({ profile, onUpdate }) => {
  const form = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: profile
  });

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField name="firstName" label="First Name" />
        <FormField name="lastName" label="Last Name" />
        <FormField name="bio" label="Bio" type="textarea" className="md:col-span-2" />
        {/* Role-specific fields */}
        {profile.role === 'student' && (
          <>
            <FormField name="collegeId" label="College ID" />
            <FormField name="collegeName" label="College Name" />
          </>
        )}
        {profile.role === 'owner' && (
          <>
            <FormField name="businessName" label="Business Name" />
            <FormField name="experience" label="Years of Experience" type="number" />
          </>
        )}
      </div>
      <Button type="submit" className="mt-4">Update Profile</Button>
    </Form>
  );
};
```

## 🔒 Profile Security & Privacy

### Data Protection
- **Personal Information**: Encrypted storage for sensitive data
- **Document Security**: Secure file upload with virus scanning
- **Access Control**: Role-based access to profile sections
- **Data Retention**: Configurable data retention policies

### Privacy Controls
```jsx
// Privacy settings component
const PrivacySettings = () => (
  <div className="space-y-4">
    <Toggle 
      label="Show profile to other users" 
      description="Allow other users to view your profile information"
    />
    <Toggle 
      label="Show contact information" 
      description="Display your phone number and email to verified users"
    />
    <Toggle 
      label="Show activity status" 
      description="Let others see when you were last active"
    />
  </div>
);
```

### Verification Process
1. **Document Upload**: Secure file upload with format validation
2. **Manual Review**: Admin review for identity verification
3. **Status Updates**: Real-time notification of verification status
4. **Re-verification**: Process for updating expired documents

## 📱 Responsive Profile Design

### Mobile Optimization
- **Touch-Friendly**: Large tap targets for mobile interaction
- **Swipe Navigation**: Gesture-based navigation between profile sections
- **Compressed Layout**: Stacked layout for smaller screens
- **Quick Actions**: Easy access to frequently used profile actions

### Tablet Layout
- **Split View**: Side-by-side profile navigation and content
- **Grid Layout**: Organized sections in card-based grid
- **Enhanced Touch**: Optimized for tablet interaction patterns

### Desktop Experience
- **Full Navigation**: Complete sidebar navigation
- **Multi-Column**: Efficient use of screen real estate
- **Keyboard Shortcuts**: Quick navigation with keyboard
- **Advanced Features**: Full-featured editing and management tools

## 🚀 Profile Performance

### Image Optimization
- **Avatar Processing**: Automatic image resizing and compression
- **CDN Integration**: Fast image delivery through CDN
- **Lazy Loading**: Progressive image loading for better performance
- **Format Selection**: WebP/AVIF support with fallbacks

### Caching Strategy
- **Profile Caching**: Redis caching for frequently accessed profiles
- **Image Caching**: Browser and CDN caching for profile images
- **API Caching**: Cached responses for profile data
- **Offline Support**: Basic offline profile viewing capability

## 🎯 Profile Analytics

### User Engagement
- **Profile Completion**: Track profile completion percentage
- **Activity Metrics**: Monitor profile views and interactions
- **Verification Progress**: Track verification completion rates
- **Feature Usage**: Monitor which profile features are most used

### Business Intelligence
- **Profile Quality**: Analyze profile completeness and quality scores
- **Verification Trends**: Track verification success/failure rates
- **User Retention**: Monitor profile engagement and retention
- **Conversion Metrics**: Profile views to contact/booking conversion

This profile management system provides a comprehensive foundation for user identity, preferences, and verification within the Student Nest platform, ensuring security, usability, and scalability.