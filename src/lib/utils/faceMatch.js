/**
 * Simulated face matching utility for DigiLocker verification
 * This simulates face-api.js functionality for hackathon/demo purposes
 */

/**
 * Simulate face detection in an image
 * @param {string} imageUrl - URL of the image to analyze
 * @returns {Promise<Object>} - Face detection results
 */
export const detectFace = async (imageUrl) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  // Simulate face detection (90% success rate)
  const faceDetected = Math.random() > 0.1;

  if (faceDetected) {
    return {
      success: true,
      faces: [{
        box: {
          x: Math.floor(Math.random() * 100),
          y: Math.floor(Math.random() * 100),
          width: 150 + Math.floor(Math.random() * 100),
          height: 150 + Math.floor(Math.random() * 100)
        },
        confidence: 0.85 + Math.random() * 0.14, // 85-99% confidence
        landmarks: {
          leftEye: { x: 120, y: 100 },
          rightEye: { x: 180, y: 100 },
          nose: { x: 150, y: 130 },
          mouth: { x: 150, y: 170 }
        }
      }],
      message: 'Face detected successfully'
    };
  } else {
    return {
      success: false,
      faces: [],
      error: 'No face detected in the image',
      message: 'Please ensure your face is clearly visible and well-lit'
    };
  }
};

/**
 * Extract face descriptor (embedding) from detected face
 * @param {string} imageUrl - URL of the image
 * @returns {Promise<Object>} - Face descriptor
 */
export const extractFaceDescriptor = async (imageUrl) => {
  const detection = await detectFace(imageUrl);

  if (!detection.success) {
    return {
      success: false,
      error: detection.error,
      descriptor: null
    };
  }

  // Generate a simulated face descriptor (normally 128 or 512 dimensional vector)
  const descriptor = Array.from({ length: 128 }, () => Math.random() * 2 - 1);

  return {
    success: true,
    descriptor,
    confidence: detection.faces[0].confidence
  };
};

/**
 * Calculate similarity between two face descriptors
 * @param {Array} descriptor1 - First face descriptor
 * @param {Array} descriptor2 - Second face descriptor
 * @returns {number} - Similarity score (0-100)
 */
export const calculateSimilarity = (descriptor1, descriptor2) => {
  if (!descriptor1 || !descriptor2 || descriptor1.length !== descriptor2.length) {
    return 0;
  }

  // Simulate Euclidean distance calculation
  let sumSquaredDiffs = 0;
  for (let i = 0; i < descriptor1.length; i++) {
    const diff = descriptor1[i] - descriptor2[i];
    sumSquaredDiffs += diff * diff;
  }

  const euclideanDistance = Math.sqrt(sumSquaredDiffs);

  // Convert distance to similarity percentage (lower distance = higher similarity)
  // Add some randomness for demo purposes
  const baseSimilarity = Math.max(0, (2 - euclideanDistance) * 50);
  const randomVariation = (Math.random() - 0.5) * 20; // ±10% variation
  const similarity = Math.max(0, Math.min(100, baseSimilarity + randomVariation));

  return Math.round(similarity * 100) / 100; // Round to 2 decimal places
};

/**
 * Compare faces between two images
 * @param {string} selfieUrl - URL of the selfie image
 * @param {string} documentUrl - URL of the document image
 * @param {number} threshold - Similarity threshold (default: 70)
 * @returns {Promise<Object>} - Face matching results
 */
export const compareFaces = async (selfieUrl, documentUrl, threshold = 70) => {
  try {
    // Extract descriptors from both images
    console.log('Extracting face from selfie...');
    const selfieResult = await extractFaceDescriptor(selfieUrl);

    if (!selfieResult.success) {
      return {
        success: false,
        error: `Selfie face detection failed: ${selfieResult.error}`,
        similarity: 0,
        match: false
      };
    }

    console.log('Extracting face from document...');
    const docResult = await extractFaceDescriptor(documentUrl);

    if (!docResult.success) {
      return {
        success: false,
        error: `Document face detection failed: ${docResult.error}`,
        similarity: 0,
        match: false
      };
    }

    // Calculate similarity
    const similarity = calculateSimilarity(selfieResult.descriptor, docResult.descriptor);
    const match = similarity >= threshold;

    return {
      success: true,
      similarity: similarity,
      match: match,
      threshold: threshold,
      confidence: {
        selfie: selfieResult.confidence,
        document: docResult.confidence,
        overall: (selfieResult.confidence + docResult.confidence) / 2
      },
      message: match
        ? `Faces match with ${similarity}% similarity`
        : `Faces don't match (${similarity}% similarity, threshold: ${threshold}%)`
    };

  } catch (error) {
    console.error('Face comparison error:', error);
    return {
      success: false,
      error: error.message,
      similarity: 0,
      match: false
    };
  }
};

/**
 * Validate image quality for face matching
 * @param {string} imageUrl - URL of the image to validate
 * @returns {Promise<Object>} - Image quality validation results
 */
export const validateImageQuality = async (imageUrl) => {
  // Simulate image quality analysis
  await new Promise(resolve => setTimeout(resolve, 500));

  const qualityScore = 60 + Math.random() * 35; // 60-95 quality score

  const validation = {
    isValid: qualityScore >= 70,
    score: Math.round(qualityScore),
    issues: [],
    recommendations: []
  };

  if (qualityScore < 70) {
    validation.issues.push('Image quality is below recommended threshold');
  }

  if (qualityScore < 60) {
    validation.issues.push('Image appears blurry or low resolution');
    validation.recommendations.push('Take a clearer photo with better lighting');
  }

  if (Math.random() > 0.8) { // 20% chance of lighting issue
    validation.issues.push('Lighting conditions could be improved');
    validation.recommendations.push('Use natural lighting or ensure face is well-lit');
  }

  return validation;
};

/**
 * Generate mock verification results for demo purposes
 * @param {string} documentType - Type of document being verified
 * @returns {Object} - Mock verification data
 */
export const generateMockVerification = (documentType = 'aadhaar') => {
  const baseNames = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Singh', 'Vikram Gupta'];
  const name = baseNames[Math.floor(Math.random() * baseNames.length)];

  const mockData = {
    user: {
      name: name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`
    },
    verification: {
      status: 'verified',
      confidence: 85 + Math.random() * 14, // 85-99% confidence
      timestamp: new Date().toISOString(),
      documentType: documentType,
      faceMatch: {
        similarity: 75 + Math.random() * 20, // 75-95% similarity
        matched: true
      }
    }
  };

  if (documentType === 'aadhaar') {
    mockData.document = {
      aadhaarNumber: `${'*'.repeat(8)}${Math.floor(Math.random() * 9000) + 1000}`,
      dob: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/${1970 + Math.floor(Math.random() * 30)}`
    };
  } else if (documentType === 'pan') {
    mockData.document = {
      panNumber: `${String.fromCharCode(65 + Math.random() * 26).repeat(5)}${Math.floor(Math.random() * 9000) + 1000}${String.fromCharCode(65 + Math.random() * 26)}`
    };
  }

  return mockData;
};

/**
 * Simulate liveness detection (anti-spoofing)
 * @param {string} imageUrl - URL of the image to check
 * @returns {Promise<Object>} - Liveness detection results
 */
export const detectLiveness = async (imageUrl) => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const isLive = Math.random() > 0.05; // 95% success rate
  const confidence = isLive ? 0.85 + Math.random() * 0.14 : Math.random() * 0.3;

  return {
    isLive: isLive,
    confidence: confidence,
    message: isLive
      ? 'Live person detected'
      : 'Possible spoofing attempt detected',
    score: Math.round(confidence * 100)
  };
};

export default {
  detectFace,
  extractFaceDescriptor,
  calculateSimilarity,
  compareFaces,
  validateImageQuality,
  generateMockVerification,
  detectLiveness
};