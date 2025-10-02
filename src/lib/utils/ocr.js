/**
 * Extract text from document image using OCR
 * For demo purposes, this uses simulated OCR extraction
 * In production, you would integrate with Google Cloud Vision API, AWS Textract, or similar service
 * @param {string|Buffer} imageSource - Image file path or buffer
 * @returns {Promise<Object>} - OCR results with extracted text and confidence
 */
export const extractTextFromDocument = async (imageSource) => {
  try {
    console.log('Starting OCR text extraction...');

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Use simulated OCR extraction for demo purposes
    console.log('Using simulated OCR extraction for demo...');
    return simulateOCRExtraction(imageSource);

  } catch (error) {
    console.error('OCR extraction error:', error);
    return {
      success: false,
      error: error.message,
      text: '',
      confidence: 0
    };
  }
};

/**
 * Simulate OCR extraction for demo purposes
 * This generates realistic sample text based on document type detection
 * @param {string} imageSource - Image source
 * @returns {Object} - Simulated OCR results
 */
const simulateOCRExtraction = (imageSource) => {
  console.log('Processing document with simulated OCR...');

  // Generate realistic sample text based on document type
  const sampleTexts = {
    aadhaar: `
      Government of India
      आधार
      AADHAAR
      Ronak Kumar Singh
      DOB: 15/08/1995
      Male
      1234 5678 9012
      Address: 123 Sample Street, Mumbai, Maharashtra - 400001
      Issue Date: 15/02/2018
      Issued by: Government of India
    `,
    pan: `
      INCOME TAX DEPARTMENT
      GOVT OF INDIA
      Permanent Account Number Card
      Name: RONAK KUMAR SINGH
      Father's Name: RAMESH KUMAR SINGH
      Date of Birth: 15/08/1995
      PAN: ABCPK1234F
      Signature: [Signature Image]
    `,
    driving_license: `
      DRIVING LICENSE
      Transport Department
      License No: DL-1420110012345
      Name: RONAK KUMAR SINGH
      S/o: RAMESH KUMAR SINGH
      Date of Birth: 15/08/1995
      Blood Group: B+
      Address: 123 Sample Street, Mumbai, Maharashtra - 400001
      Issue Date: 15/02/2020
      Valid Upto: 14/02/2040
      Class of Vehicle: LMV
    `,
    passport: `
      REPUBLIC OF INDIA
      PASSPORT
      Passport No: Z1234567
      Type: P
      Country Code: IND
      Surname: SINGH
      Given Names: RONAK KUMAR
      Date of Birth: 15/08/1995
      Place of Birth: MUMBAI
      Date of Issue: 15/02/2020
      Date of Expiry: 14/02/2030
      Place of Issue: MUMBAI
    `,
    voter_id: `
      ELECTION COMMISSION OF INDIA
      ELECTORAL PHOTO IDENTITY CARD
      Name: Ronak Kumar Singh
      Father's Name: Ramesh Kumar Singh
      House No: 123
      Age: 28
      Gender: Male
      EPIC No: ABC1234567
      Constituency: Mumbai South
      Part No: 123
      Serial No: 456
    `
  };

  // Enhanced heuristic to determine document type from image URL or filename
  const source = typeof imageSource === 'string' ? imageSource.toLowerCase() : 'default';
  let documentText;
  let documentType = 'aadhaar'; // default

  // Check for document type in URL parameter first
  const typeMatch = source.match(/[?&]type=([^&]+)/);
  if (typeMatch) {
    documentType = typeMatch[1];
  } else {
    // Fallback to filename/URL analysis
    if (source.includes('aadhaar') || source.includes('aadhar')) {
      documentType = 'aadhaar';
    } else if (source.includes('pan')) {
      documentType = 'pan';
    } else if (source.includes('driving') || source.includes('license') || source.includes('dl')) {
      documentType = 'driving_license';
    } else if (source.includes('passport')) {
      documentType = 'passport';
    } else if (source.includes('voter') || source.includes('election')) {
      documentType = 'voter_id';
    }
  }

  // Use the appropriate sample text for the document type
  documentText = sampleTexts[documentType] || sampleTexts.aadhaar;

  console.log(`Processing ${documentType} document with simulated OCR`);

  // Add some random variation to confidence
  const confidence = Math.floor(Math.random() * 10) + 90; // 90-99% confidence for better results

  return {
    success: true,
    text: documentText.trim(),
    confidence: confidence,
    words: [],
    lines: [],
    detectedType: documentType
  };
};

/**
 * Parse Aadhaar card information from OCR text
 * @param {string} text - Raw OCR text
 * @returns {Object} - Parsed Aadhaar data
 */
export const parseAadhaarCard = (text) => {
  const data = {
    type: 'aadhaar',
    name: null,
    aadhaarNumber: null,
    dateOfBirth: null,
    gender: null,
    address: null,
    confidence: 0
  };

  try {
    // Clean up text
    const cleanText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

    // Extract Aadhaar number (12 digits, often with spaces)
    const aadhaarMatch = cleanText.match(/(\d{4}\s*\d{4}\s*\d{4}|\d{12})/);
    if (aadhaarMatch) {
      data.aadhaarNumber = aadhaarMatch[1].replace(/\s/g, '');
      data.confidence += 30;
    }

    // Enhanced name extraction patterns
    const namePatterns = [
      // After Government of India and before DOB
      /(?:Government of India|भारत सरकार|AADHAAR)[\s\S]*?([A-Z][A-Za-z\s]{2,30}?)(?:\s*DOB|Date of Birth|\d{2}[-\/]\d{2}[-\/]\d{4})/i,
      // Direct name line
      /(?:Name[:\s]*)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})(?:\s*DOB|\s*Male|\s*Female|$)/i,
      // After AADHAAR header
      /AADHAAR[\s\S]*?([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i
    ];

    for (const pattern of namePatterns) {
      const nameMatch = cleanText.match(pattern);
      if (nameMatch) {
        const extractedName = nameMatch[1].trim();
        // Validate name (should not contain numbers or special chars)
        if (!/\d/.test(extractedName) && extractedName.length >= 3) {
          data.name = extractedName;
          data.confidence += 25;
          break;
        }
      }
    }

    // Extract date of birth
    const dobMatch = cleanText.match(/DOB[:\s]*(\d{2}[-\/]\d{2}[-\/]\d{4})|(\d{2}[-\/]\d{2}[-\/]\d{4})/i);
    if (dobMatch) {
      data.dateOfBirth = dobMatch[1] || dobMatch[2];
      data.confidence += 20;
    }

    // Extract gender
    const genderMatch = cleanText.match(/(Male|Female|पुरुष|महिला)/i);
    if (genderMatch) {
      data.gender = genderMatch[1].toLowerCase();
      data.confidence += 10;
    }

    // Extract address (usually after Address: or before postal code)
    const addressPatterns = [
      /Address[:\s]*(.*?)(?:\s*-\s*\d{6}|\s*PIN[:\s]*\d{6}|Issue Date|$)/i,
      /(?:Male|Female)[\s\S]*?(\d+[^0-9]*(?:Street|Road|Lane|Area|Nagar|Colony)[^0-9]*\d{6})/i
    ];

    for (const pattern of addressPatterns) {
      const addressMatch = cleanText.match(pattern);
      if (addressMatch) {
        const extractedAddress = addressMatch[1].trim();
        if (extractedAddress.length > 10) {
          data.address = extractedAddress;
          data.confidence += 15;
          break;
        }
      }
    }

  } catch (error) {
    console.error('Aadhaar parsing error:', error);
  }

  return data;
};

/**
 * Parse PAN card information from OCR text
 * @param {string} text - Raw OCR text
 * @returns {Object} - Parsed PAN data
 */
export const parsePANCard = (text) => {
  const data = {
    type: 'pan',
    name: null,
    panNumber: null,
    fatherName: null,
    dateOfBirth: null,
    confidence: 0
  };

  try {
    const cleanText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

    // Extract PAN number (format: ABCDE1234F)
    const panMatch = cleanText.match(/(?:PAN[:\s]*)?([A-Z]{5}\d{4}[A-Z])/i);
    if (panMatch) {
      data.panNumber = panMatch[1];
      data.confidence += 40;
    }

    // Enhanced name extraction patterns
    const namePatterns = [
      // After "Name:" label
      /Name[:\s]*([A-Z][A-Z\s]{2,30}?)(?:\s*Father|\s*Date of Birth|$)/i,
      // Direct capital letter names
      /(?:INDIA|DEPARTMENT)[\s\S]*?([A-Z]{2,}\s+[A-Z]{2,}(?:\s+[A-Z]{2,})?)\s*(?:Father|Date)/i,
      // After card header
      /Permanent Account Number Card[\s\S]*?([A-Z][A-Z\s]{5,30}?)(?:\s*Father|$)/i
    ];

    for (const pattern of namePatterns) {
      const nameMatch = cleanText.match(pattern);
      if (nameMatch) {
        const extractedName = nameMatch[1].trim();
        // Validate name
        if (!/\d/.test(extractedName) && extractedName.length >= 5) {
          data.name = extractedName;
          data.confidence += 25;
          break;
        }
      }
    }

    // Enhanced father's name extraction
    const fatherPatterns = [
      /Father['\s]*s?\s*Name[:\s]*([A-Z][A-Z\s]{2,30}?)(?:\s*Date|\s*\d{2}[-\/]|$)/i,
      /(?:Name[:\s]*[A-Z\s]+)[\s]*Father['\s]*s?\s*Name[:\s]*([A-Z][A-Z\s]{2,30}?)(?:\s*Date|$)/i
    ];

    for (const pattern of fatherPatterns) {
      const fatherMatch = cleanText.match(pattern);
      if (fatherMatch) {
        const extractedFatherName = fatherMatch[1].trim();
        if (!/\d/.test(extractedFatherName) && extractedFatherName.length >= 5) {
          data.fatherName = extractedFatherName;
          data.confidence += 20;
          break;
        }
      }
    }

    // Extract date of birth
    const dobPatterns = [
      /Date of Birth[:\s]*(\d{2}[-\/]\d{2}[-\/]\d{4})/i,
      /DOB[:\s]*(\d{2}[-\/]\d{2}[-\/]\d{4})/i,
      /(\d{2}[-\/]\d{2}[-\/]\d{4})/
    ];

    for (const pattern of dobPatterns) {
      const dobMatch = cleanText.match(pattern);
      if (dobMatch) {
        data.dateOfBirth = dobMatch[1];
        data.confidence += 15;
        break;
      }
    }

  } catch (error) {
    console.error('PAN parsing error:', error);
  }

  return data;
};

/**
 * Parse driving license information from OCR text
 * @param {string} text - Raw OCR text
 * @returns {Object} - Parsed license data
 */
export const parseDrivingLicense = (text) => {
  const data = {
    type: 'driving_license',
    name: null,
    licenseNumber: null,
    dateOfBirth: null,
    issueDate: null,
    validUpto: null,
    address: null,
    confidence: 0
  };

  try {
    const cleanText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

    // Extract license number (various formats)
    const licenseMatch = cleanText.match(/(?:DL|License)\s*No[.:\s]*([A-Z0-9\-\/\s]{10,20})/i);
    if (licenseMatch) {
      data.licenseNumber = licenseMatch[1].trim();
      data.confidence += 30;
    }

    // Extract name
    const nameMatch = cleanText.match(/Name[:\s]*([A-Z][A-Za-z\s]{2,30}?)(?:\s*S\/o|DOB|Date)/i);
    if (nameMatch) {
      data.name = nameMatch[1].trim();
      data.confidence += 25;
    }

    // Extract dates
    const dateMatches = cleanText.match(/(\d{2}[-\/]\d{2}[-\/]\d{4})/g);
    if (dateMatches && dateMatches.length >= 2) {
      data.dateOfBirth = dateMatches[0];
      data.issueDate = dateMatches[1];
      if (dateMatches.length >= 3) {
        data.validUpto = dateMatches[2];
      }
      data.confidence += 20;
    }

    // Extract address
    const addressMatch = cleanText.match(/Address[:\s]*(.*?)(?:Pin|$)/i);
    if (addressMatch) {
      data.address = addressMatch[1].trim();
      data.confidence += 15;
    }

  } catch (error) {
    console.error('Driving license parsing error:', error);
  }

  return data;
};

/**
 * Auto-detect document type and parse accordingly
 * @param {string} text - Raw OCR text
 * @returns {Object} - Parsed document data
 */
export const parseGovernmentID = (text) => {
  const cleanText = text.toLowerCase();

  // Detect document type based on keywords
  if (cleanText.includes('aadhaar') || cleanText.includes('आधार') || /\d{4}\s*\d{4}\s*\d{4}/.test(text)) {
    return parseAadhaarCard(text);
  } else if (cleanText.includes('income tax') || cleanText.includes('pan') || /[A-Z]{5}\d{4}[A-Z]/.test(text)) {
    return parsePANCard(text);
  } else if (cleanText.includes('driving') || cleanText.includes('license') || cleanText.includes('transport')) {
    return parseDrivingLicense(text);
  } else {
    // Generic parsing for unknown document types
    return {
      type: 'unknown',
      rawText: text,
      confidence: 10,
      name: null,
      documentNumber: null
    };
  }
};

/**
 * Validate extracted document data
 * @param {Object} data - Parsed document data
 * @returns {Object} - Validation results
 */
export const validateDocumentData = (data) => {
  const validation = {
    isValid: false,
    errors: [],
    warnings: [],
    score: 0
  };

  if (!data.type || data.type === 'unknown') {
    validation.errors.push('Could not determine document type');
  }

  if (!data.name || data.name.length < 2) {
    validation.errors.push('Name not found or invalid');
  } else {
    validation.score += 25;
  }

  if (data.type === 'aadhaar') {
    if (!data.aadhaarNumber || !/^\d{12}$/.test(data.aadhaarNumber)) {
      validation.errors.push('Invalid Aadhaar number format');
    } else {
      validation.score += 35;
    }
  }

  if (data.type === 'pan') {
    if (!data.panNumber || !/^[A-Z]{5}\d{4}[A-Z]$/.test(data.panNumber)) {
      validation.errors.push('Invalid PAN number format');
    } else {
      validation.score += 35;
    }
  }

  if (!data.dateOfBirth) {
    validation.warnings.push('Date of birth not found');
  } else {
    validation.score += 20;
  }

  if (data.confidence < 50) {
    validation.warnings.push('Low OCR confidence - document may be unclear');
  }

  validation.isValid = validation.errors.length === 0 && validation.score >= 60;

  return validation;
};

export default {
  extractTextFromDocument,
  parseAadhaarCard,
  parsePANCard,
  parseDrivingLicense,
  parseGovernmentID,
  validateDocumentData
};