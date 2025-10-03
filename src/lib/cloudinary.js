import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {Buffer|string} file - File buffer or base64 string
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Cloudinary response
 */
export const uploadImage = async (file, options = {}) => {
  try {
    const defaultOptions = {
      resource_type: 'image',
      folder: options.folder || 'student-nest/images',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        { width: options.width || 800, height: options.height || 600, crop: 'limit' }
      ],
      tags: options.tags || ['student-nest'],
    };

    const uploadOptions = { ...defaultOptions, ...options };

    // Convert Buffer to base64 data URI for Cloudinary
    let uploadData = file;
    if (Buffer.isBuffer(file)) {
      uploadData = `data:image/jpeg;base64,${file.toString('base64')}`;
    }

    const result = await cloudinary.uploader.upload(uploadData, uploadOptions);

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
    };
  } catch (error) {
    console.error('Cloudinary image upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Upload video to Cloudinary
 * @param {Buffer|string} file - File buffer or base64 string
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Cloudinary response
 */
export const uploadVideo = async (file, options = {}) => {
  try {
    const defaultOptions = {
      resource_type: 'video',
      folder: options.folder || 'student-nest/videos',
      transformation: [
        { quality: 'auto' },
        { width: options.width || 1280, height: options.height || 720, crop: 'limit' }
      ],
      tags: options.tags || ['student-nest'],
    };

    const uploadOptions = { ...defaultOptions, ...options };

    const result = await cloudinary.uploader.upload(file, uploadOptions);

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      duration: result.duration,
      size: result.bytes,
    };
  } catch (error) {
    console.error('Cloudinary video upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};



/**
 * Upload room property image
 * @param {Buffer|string} file - File buffer or base64 string
 * @param {string} propertyId - Property ID for folder organization
 * @returns {Promise<Object>} - Cloudinary response
 */
export const uploadPropertyImage = async (file, propertyId) => {
  return uploadImage(file, {
    folder: `student-nest/properties/${propertyId}`,
    width: 1200,
    height: 800,
    crop: 'fill',
    tags: ['property', 'student-nest'],
  });
};

/**
 * Upload room property video
 * @param {Buffer|string} file - File buffer or base64 string
 * @param {string} propertyId - Property ID for folder organization
 * @returns {Promise<Object>} - Cloudinary response
 */
export const uploadPropertyVideo = async (file, propertyId) => {
  return uploadVideo(file, {
    folder: `student-nest/properties/${propertyId}/videos`,
    width: 1920,
    height: 1080,
    crop: 'limit',
    tags: ['property-video', 'student-nest'],
  });
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - 'image' or 'video'
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });

    return {
      success: result.result === 'ok',
      result: result.result,
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Generate optimized URL with transformations
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} transformations - Transformation options
 * @returns {string} - Optimized URL
 */
export const generateOptimizedUrl = (publicId, transformations = {}) => {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    ...transformations,
  });
};

/**
 * Get file info from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - 'image' or 'video'
 * @returns {Promise<Object>} - File information
 */
export const getFileInfo = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType
    });

    return {
      success: true,
      info: result,
    };
  } catch (error) {
    console.error('Cloudinary get file info error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default cloudinary;