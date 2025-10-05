# 🏠 Property Posting System - Complete Guide

## Overview

A comprehensive property posting system with **Cloudinary integration** for image uploads, built with Next.js 15, TypeScript, and shadcn/ui components.

## 🎯 Features

### ✨ Complete Property Management
- **8-Step Wizard**: Intuitive multi-step form for property listing
- **Cloudinary Integration**: Professional image upload with validation
- **Real-time Validation**: Field-level validation with helpful error messages
- **Progress Tracking**: Visual progress indicator throughout the process
- **Auto-save**: Form data preserved during navigation

### 📸 Image Upload Features
- **Drag & Drop**: Modern drag-and-drop interface
- **Bulk Upload**: Upload up to 20 images simultaneously
- **File Validation**:
  - Supported formats: JPEG, PNG, WEBP
  - Max size: 10MB per image
  - Total limit: 20 images per property
- **Image Preview**: Preview images before uploading
- **Delete Support**: Remove unwanted images
- **Progress Indicator**: Real-time upload progress
- **Cloudinary Optimization**: Automatic image optimization and CDN delivery

### 🏢 Property Details
- **Room Types**: Single, Shared, Studio
- **Accommodation Types**: PG, Hostel, Apartment, Room
- **Complete Location**: Address, city, state, pincode with coordinates
- **Pricing**: Monthly rent, security deposit, maintenance charges
- **Features**: Area, floor, furnished, balcony, attached bathroom
- **18 Amenities**: WiFi, AC, parking, security, gym, and more
- **House Rules**: Gender preference, pets, smoking, visitors, etc.

## 📁 File Structure

```
src/
├── components/
│   └── property/
│       ├── ImageUploader.tsx       # Cloudinary image upload component
│       └── PropertyForm.tsx        # Main property posting form
├── app/
│   ├── api/
│   │   ├── upload/
│   │   │   └── route.ts           # Cloudinary upload endpoint
│   │   └── rooms/
│   │       └── route.ts           # Property CRUD endpoints
│   └── (dashboard)/
│       └── owner/
│           └── post-property/
│               └── page.tsx       # Property posting page
└── lib/
    ├── api.ts                     # API client methods
    └── cloudinary.ts              # Cloudinary configuration
```

## 🚀 Getting Started

### Prerequisites

1. **Cloudinary Account**: Sign up at [cloudinary.com](https://cloudinary.com)
2. **Environment Variables**: Add to `.env.local`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Database
MONGODB_URI=your_mongodb_uri

# JWT
JWT_SECRET=your_jwt_secret
```

### Installation

1. **Install Dependencies**:
```bash
npm install
```

2. **Install shadcn/ui Components** (if not already installed):
```bash
npx shadcn-ui@latest add button card input textarea label checkbox badge progress select separator tabs alert dialog sheet tooltip
```

3. **Run Development Server**:
```bash
npm run dev
```

4. **Access Property Posting**:
```
http://localhost:3000/owner/post-property
```

## 📝 Usage Guide

### For Developers

#### Using the PropertyForm Component

```tsx
import { PropertyForm } from '@/components/property/PropertyForm';

export default function PostPropertyPage() {
  return <PropertyForm />;
}
```

#### Using the ImageUploader Component

```tsx
import { ImageUploader } from '@/components/property/ImageUploader';

const [images, setImages] = useState([]);

<ImageUploader
  images={images}
  onImagesChange={setImages}
  propertyId="optional-property-id"
  maxImages={20}
  maxSizeMB={10}
/>
```

#### API Client Methods

```typescript
import apiClient from '@/lib/api';

// Upload single image
const result = await apiClient.uploadImage(file, {
  category: 'property',
  propertyId: 'property_123'
});

// Upload multiple images
const results = await apiClient.uploadMultipleImages(files, {
  category: 'property',
  propertyId: 'property_123'
});

// Delete image
await apiClient.deleteUploadedFile(publicId, 'image');

// Create property
const property = await apiClient.createRoom({
  title: 'Studio Apartment',
  description: 'Modern studio near university',
  price: 15000,
  images: ['https://res.cloudinary.com/...'],
  roomType: 'studio',
  accommodationType: 'apartment',
  // ... other fields
});
```

### For Property Owners

#### Step-by-Step Process

**Step 1: Property Type**
- Select room type (Single/Shared/Studio)
- Select accommodation type (PG/Hostel/Apartment/Room)
- Set max sharing capacity (for shared rooms)

**Step 2: Basic Details**
- Enter property title (max 200 characters)
- Write short description (max 500 characters)
- Optional: Add detailed description (max 2000 characters)
- Fill location details (address, city, state, pincode)

**Step 3: Pricing & Rooms**
- Set monthly rent amount
- Set security deposit
- Optional: Add maintenance charges
- Specify total rooms and available rooms
- Set availability date

**Step 4: Features**
- Enter property area (sq. ft.)
- Specify floor number and total floors
- Select features:
  - Fully Furnished
  - Balcony
  - Attached Bathroom

**Step 5: Amenities**
- Select from 18 available amenities:
  - WiFi, AC, Power Backup, Security
  - Laundry, Housekeeping, Gym, Parking
  - Lift, 24/7 Water, Mess, TV
  - Fridge, Microwave, Washing Machine
  - Geyser, CCTV, Fire Safety

**Step 6: Images**
- Upload property photos (1-20 images)
- Drag & drop or click to browse
- First image becomes primary display image
- Preview and remove images as needed

**Step 7: Rules**
- Set gender preference (Male/Female/Any)
- Configure house rules:
  - Smoking allowed/not allowed
  - Pets allowed/not allowed
  - Drinking allowed/not allowed
  - Visitors allowed/not allowed
  - Couples allowed/not allowed

**Step 8: Review & Publish**
- Review all entered information
- Make changes by clicking "Previous"
- Click "Publish Property" to go live

## 🧪 Testing

### Run Cloudinary Upload Tests

```bash
# Test with default configuration
node test-cloudinary-upload.js

# Test with custom API URL
API_BASE_URL=http://localhost:3000/api node test-cloudinary-upload.js

# Test with custom image
TEST_IMAGE_PATH=./path/to/image.jpg node test-cloudinary-upload.js
```

### Test Coverage

The test script validates:
1. ✅ Owner authentication
2. ✅ Single image upload
3. ✅ Bulk image upload (3 images)
4. ✅ Property creation with images
5. ✅ Image URL verification
6. ✅ Image deletion from Cloudinary

### Expected Output

```
╔════════════════════════════════════════════════════════════╗
║        🧪 CLOUDINARY UPLOAD INTEGRATION TESTS 🧪          ║
╚════════════════════════════════════════════════════════════╝

📝 Test 1: Login as Owner
✅ Login successful!

📤 Test 2: Upload Single Image
✅ Image uploaded successfully!
   URL: https://res.cloudinary.com/...
   Dimensions: 1200 x 800

📤 Test 3: Upload Multiple Images (Bulk)
✅ Bulk upload successful!
   Uploaded: 3
   Failed: 0

🏠 Test 4: Create Property with Uploaded Images
✅ Property created successfully!
   Property ID: 673a1b2c3d4e5f6g7h8i9j0k

🔍 Test 5: Verify Property Images
✅ Property retrieved successfully!
   Images count: 4

🗑️  Test 6: Delete Uploaded Image
✅ Image deleted successfully!

📊 TEST SUMMARY
Total Tests: 6
Passed: 6
Failed: 0
Success Rate: 100.0%

🎉 All tests passed! Cloudinary integration is working correctly.
```

## 🔧 API Endpoints

### Upload Endpoints

**POST /api/upload** - Upload single file
```json
{
  "file": "base64_encoded_file",
  "type": "image",
  "category": "property",
  "propertyId": "optional_id"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "student-nest/properties/...",
    "width": 1200,
    "height": 800,
    "format": "jpg",
    "size": 245632
  }
}
```

**PUT /api/upload** - Bulk upload (max 10 files)
```json
{
  "files": ["base64_1", "base64_2", "base64_3"],
  "type": "image",
  "category": "property"
}
```

**DELETE /api/upload?publicId=xxx&type=image** - Delete file

### Property Endpoints

**POST /api/rooms** - Create property
```json
{
  "title": "Studio Apartment",
  "description": "Modern studio",
  "price": 15000,
  "images": ["url1", "url2"],
  "roomType": "studio",
  "accommodationType": "apartment",
  "location": {
    "address": "123 Street",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001"
  },
  "securityDeposit": 30000,
  "amenities": ["wifi", "ac"],
  "features": {
    "area": 400,
    "furnished": true
  }
}
```

**GET /api/rooms** - List properties with filters
**GET /api/rooms/:id** - Get property details
**PUT /api/rooms/:id** - Update property
**DELETE /api/rooms/:id** - Delete property

## 🎨 UI Components

### ImageUploader

**Props:**
- `images`: Array of uploaded images
- `onImagesChange`: Callback when images change
- `propertyId`: Optional property ID for organization
- `maxImages`: Maximum number of images (default: 20)
- `maxSizeMB`: Maximum file size in MB (default: 10)

**Features:**
- Drag & drop support
- Multiple file selection
- Real-time upload progress
- Image preview with zoom
- Delete functionality
- File validation
- Primary image indicator

### PropertyForm

**Features:**
- 8-step wizard interface
- Step validation
- Progress tracking
- Auto-saved state
- Responsive design
- Dark mode support
- Toast notifications
- Error handling

## 🔒 Security & Validation

### Client-Side Validation
- ✅ Required fields checking
- ✅ Field length limits
- ✅ File type validation
- ✅ File size validation
- ✅ Image count limits
- ✅ Numeric range validation

### Server-Side Validation
- ✅ JWT authentication
- ✅ Owner role verification
- ✅ Image URL validation (Cloudinary only)
- ✅ Amenities whitelist
- ✅ Data sanitization
- ✅ MongoDB injection prevention

## 📊 Performance Optimizations

### Image Upload
- **Parallel Upload**: Upload multiple images simultaneously
- **Progress Tracking**: Real-time upload status
- **Error Recovery**: Graceful error handling
- **Optimistic UI**: Immediate feedback

### Cloudinary Optimizations
- **Auto Format**: Automatic format selection (WebP when supported)
- **Auto Quality**: Intelligent quality optimization
- **Responsive Images**: Different sizes for different devices
- **CDN Delivery**: Global CDN for fast loading

## 🐛 Troubleshooting

### Common Issues

**1. Images not uploading**
- Check Cloudinary credentials in `.env.local`
- Verify file size (must be < 10MB)
- Check file format (JPEG, PNG, WEBP only)
- Ensure stable internet connection

**2. Property creation fails**
- Verify all required fields are filled
- Check that images are Cloudinary URLs
- Ensure valid amenities are selected
- Check authentication token

**3. Upload progress stuck**
- Check browser console for errors
- Verify API endpoint is accessible
- Check network tab for failed requests
- Try refreshing the page

**4. TypeScript errors**
- Run `npm install` to ensure all types are installed
- Check that all imports are correct
- Verify shadcn/ui components are installed

## 🔄 Migration from Old System

If you have an existing property posting page:

1. **Backup Current Code**:
```bash
cp src/app/(dashboard)/owner/post-property/page.tsx src/app/(dashboard)/owner/post-property/page.backup.tsx
```

2. **Replace with New Component**:
```tsx
import { PropertyForm } from '@/components/property/PropertyForm';

export default function PostPropertyPage() {
  return <PropertyForm />;
}
```

3. **Update API Client**: Ensure you have the latest API methods in `src/lib/api.ts`

4. **Test Thoroughly**: Run the test script to verify everything works

## 📈 Future Enhancements

- [ ] Map integration for location selection
- [ ] Video upload support
- [ ] Virtual tour integration
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Bulk property import
- [ ] Template system for similar properties
- [ ] AI-powered description generation
- [ ] Image auto-tagging
- [ ] Property comparison tool

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is part of Student Nest platform.

## 🆘 Support

For issues or questions:
- Create an issue on GitHub
- Check existing documentation
- Run the test script for diagnostics
- Review console logs for errors

---

**Built with ❤️ using Next.js, TypeScript, shadcn/ui, and Cloudinary**
