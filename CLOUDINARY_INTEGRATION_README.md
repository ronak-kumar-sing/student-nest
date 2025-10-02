# Cloudinary Integration for Student Nest

## Overview
This document outlines the complete Cloudinary integration for handling image and video uploads in the Student Nest application, optimized for the **Cloudinary free tier**.

## Free Tier Limits
- **Storage**: 25GB
- **Monthly Bandwidth**: 25GB
- **Monthly Transformations**: 25,000
- **Auto-backup**: 1,000/month
- **Max File Sizes**:
  - Images: 10MB
  - Videos: 100MB
  - Raw files: 1MB

## Configuration

### Environment Variables
Add these to your `.env.local`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# File Upload Limits
MAX_FILE_SIZE=10485760       # 10MB for images
MAX_VIDEO_SIZE=104857600     # 100MB for videos
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp,image/gif
ALLOWED_VIDEO_TYPES=video/mp4,video/webm,video/quicktime
```

## Installation

```bash
npm install cloudinary multer
```

## API Endpoints

### 1. General Upload API
**Endpoint**: `POST /api/upload`
**Authentication**: Required (Bearer token)

**Form Data**:
- `file`: File to upload
- `type`: 'image' or 'video'
- `folder`: Folder name (optional, default: 'general')
- `width`: Target width (optional)
- `height`: Target height (optional)

**Response**:
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "student-nest/general/user123/abc123",
    "width": 800,
    "height": 600,
    "format": "jpg",
    "size": 245760
  }
}
```

### 2. Avatar Upload API
**Endpoint**: `POST /api/upload/avatar`
**Authentication**: Required (Bearer token)

**Form Data**:
- `avatar`: Image file

**Features**:
- Auto-optimized to 300x300px
- Face-detection cropping
- Previous avatar cleanup
- Updates user profile

### 3. Property Media API
**Endpoint**: `POST /api/upload/property`
**Authentication**: Required (Owner role only)

**Form Data**:
- `file`: Image or video file
- `propertyId`: Property identifier
- `mediaType`: 'image' or 'video'

**Features**:
- Property images: 1200x800px optimization
- Property videos: 1920x1080px limit
- Organized by property folders

## React Components

### 1. FileUpload Component
```jsx
import FileUpload from '@/components/ui/FileUpload';

<FileUpload
  acceptedTypes="image/*"
  maxFileSize={10}
  uploadType="image"
  folder="general"
  token={userToken}
  onUploadComplete={(result) => console.log(result)}
  onUploadError={(error) => console.error(error)}
  multiple={false}
/>
```

### 2. AvatarUpload Component
```jsx
import AvatarUpload from '@/components/ui/AvatarUpload';

<AvatarUpload
  currentAvatar={user.avatar}
  onUploadComplete={(result) => setUser({...user, avatar: result.url})}
  onUploadError={(error) => toast.error(error)}
  token={userToken}
  size="lg"
/>
```

## React Hook

### useFileUpload Hook
```jsx
import { useFileUpload } from '@/hooks/useFileUpload';

const { uploading, progress, error, uploadFile, uploadAvatar } = useFileUpload();

// Upload any file
const result = await uploadFile(file, {
  type: 'image',
  folder: 'general',
  token: userToken
});

// Upload avatar
const avatarResult = await uploadAvatar(file, userToken);
```

## Folder Structure
Cloudinary organizes files in these folders:

```
student-nest/
├── avatars/
│   └── {userId}/
│       └── avatar-optimized.jpg
├── properties/
│   └── {propertyId}/
│       ├── image1.jpg
│       ├── image2.jpg
│       └── videos/
│           └── tour.mp4
├── images/
│   └── {userId}/
│       └── general-uploads/
└── documents/
    └── {userId}/
        └── verification-docs/
```

## Transformations

### Avatar Images
- **Size**: 300x300px
- **Crop**: Fill with face detection
- **Quality**: Auto
- **Format**: Auto (WebP when supported)

### Property Images
- **Size**: 1200x800px max
- **Crop**: Limit (maintain aspect ratio)
- **Quality**: Auto
- **Format**: Auto

### Property Videos
- **Size**: 1920x1080px max
- **Quality**: Auto
- **Format**: Auto optimization

## Usage Examples

### Basic Image Upload
```jsx
const handleImageUpload = async (file) => {
  try {
    const result = await uploadFile(file, {
      type: 'image',
      folder: 'property-photos',
      width: 1200,
      height: 800,
      token: authToken
    });

    setImageUrl(result.url);
  } catch (error) {
    toast.error(error.message);
  }
};
```

### Video Upload with Progress
```jsx
const handleVideoUpload = async (file) => {
  try {
    const result = await uploadFile(file, {
      type: 'video',
      folder: 'property-tours',
      token: authToken,
      onProgress: (progress) => setUploadProgress(progress)
    });

    setVideoUrl(result.url);
  } catch (error) {
    toast.error(error.message);
  }
};
```

### Property Media Upload
```jsx
const uploadPropertyImage = async (file, propertyId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('propertyId', propertyId);
  formData.append('mediaType', 'image');

  const response = await fetch('/api/upload/property', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const result = await response.json();
  return result.data;
};
```

## Error Handling

### Common Errors
1. **File too large**: Check size limits
2. **Invalid file type**: Verify accepted formats
3. **Authentication failed**: Check JWT token
4. **Cloudinary quota exceeded**: Monitor usage
5. **Network timeout**: Implement retry logic

### Error Response Format
```json
{
  "success": false,
  "error": "File size must be less than 10MB"
}
```

## Security Features

### File Validation
- File type verification
- Size limit enforcement
- Malicious file detection

### Access Control
- JWT authentication required
- User-specific folder isolation
- Role-based upload permissions

### Cloudinary Security
- Signed uploads (optional)
- Access control lists
- Transformation restrictions

## Performance Optimization

### Client-Side
- Image compression before upload
- Progress indicators
- Cancel upload functionality
- Retry failed uploads

### Server-Side
- Async processing
- Error logging
- Rate limiting
- Cleanup of old files

## Testing

### Test Upload Functionality
Visit: `http://localhost:3000/test-uploads`

This page provides:
- Avatar upload testing
- General file upload testing
- Property media upload (owners only)
- Upload result display
- Error handling demonstration

## Monitoring & Analytics

### Usage Tracking
Monitor these metrics:
- Upload success/failure rates
- File sizes and types
- Bandwidth usage
- Transformation usage

### Cloudinary Dashboard
Access your Cloudinary dashboard to monitor:
- Storage usage
- Bandwidth consumption
- Transformation credits
- API call counts

## Best Practices

### File Management
1. **Clean up old files**: Implement automatic cleanup
2. **Optimize images**: Use appropriate transformations
3. **Progressive loading**: Implement lazy loading
4. **CDN benefits**: Leverage Cloudinary's global CDN

### User Experience
1. **Progress indicators**: Show upload progress
2. **Error handling**: Clear error messages
3. **Preview functionality**: Show image previews
4. **Drag & drop**: Intuitive file selection

### Performance
1. **Image optimization**: Use auto quality and format
2. **Responsive images**: Serve appropriate sizes
3. **Caching**: Leverage browser caching
4. **Lazy loading**: Load images when needed

## Troubleshooting

### Common Issues

1. **"Cloud name not found"**
   - Check CLOUDINARY_CLOUD_NAME in environment

2. **"Invalid signature"**
   - Verify API key and secret
   - Check timestamp synchronization

3. **"Upload failed"**
   - Check file size limits
   - Verify file type permissions
   - Monitor Cloudinary quota

4. **"Network error"**
   - Check internet connectivity
   - Verify API endpoints
   - Check CORS settings

### Debug Mode
Enable debug logging:
```javascript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  // ... your config
  secure: true,
  api_proxy: 'http://proxy.server.com' // if needed
});
```

## Migration from Local Storage

If migrating from local file storage:

1. **Backup existing files**
2. **Update database URLs**
3. **Test upload functionality**
4. **Implement gradual migration**

## Support & Resources

- **Cloudinary Documentation**: https://cloudinary.com/documentation
- **Node.js SDK**: https://cloudinary.com/documentation/node_integration
- **React Components**: https://cloudinary.com/documentation/react_integration
- **Transformation Reference**: https://cloudinary.com/documentation/image_transformation_reference

## Conclusion

This Cloudinary integration provides a robust, scalable file upload solution optimized for the free tier limits while maintaining excellent performance and user experience. The modular design allows for easy expansion as your application grows.