# Simulated DigiLocker User Verification System

A hackathon-ready user verification system that simulates DigiLocker authentication with selfie matching and document verification features.

## 🚀 Features

- **Simulated DigiLocker Flow**: Mock DigiLocker authentication process
- **Document Upload & OCR**: Extract text from government ID documents
- **Selfie Verification**: Face matching between uploaded selfie and ID photo
- **Email/OTP Authentication**: Basic user verification via email
- **Real-time Status Updates**: Live verification status tracking
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React.js / Next.js
- **Backend**: Node.js / Express
- **OCR**: Tesseract.js for text extraction
- **Face Detection**: face-api.js or MediaPipe
- **File Upload**: Multer / Cloudinary
- **Email Service**: Nodemailer / SendGrid
- **Database**: MongoDB / PostgreSQL
- **Styling**: Tailwind CSS / Material-UI

## 📁 Project Structure

```
simulated-digilocker/
├── client/
│   ├── components/
│   │   ├── DigiLockerLogin.jsx
│   │   ├── DocumentUpload.jsx
│   │   ├── SelfieCapture.jsx
│   │   └── VerificationStatus.jsx
│   ├── pages/
│   │   ├── auth.jsx
│   │   ├── verify.jsx
│   │   └── dashboard.jsx
│   └── utils/
│       ├── ocr.js
│       └── faceMatch.js
├── server/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── verify.js
│   │   └── upload.js
│   ├── middleware/
│   │   └── validation.js
│   └── models/
│       └── User.js
└── README.md
```

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/simulated-digilocker.git
cd simulated-digilocker
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Environment Variables**
Create `.env` files in both client and server directories:

**Server (.env)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/digilocker-sim
JWT_SECRET=your-jwt-secret
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Client (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

4. **Start the development servers**
```bash
# Start server
cd server
npm run dev

# Start client (in another terminal)
cd client
npm run dev
```

## 🔄 Verification Flow

### 1. Initial Registration
- User enters basic details (name, email, phone)
- Email verification with OTP

### 2. DigiLocker Simulation
```javascript
// Mock DigiLocker login flow
const simulateDigiLockerAuth = async (userData) => {
  // Show DigiLocker-like login interface
  // Simulate Aadhaar OTP verification
  // Return mock authentication status
  return {
    authenticated: true,
    userConsent: true,
    documentsAvailable: ['aadhaar', 'pan']
  };
};
```

### 3. Document Upload & OCR
- User uploads government ID (Aadhaar, PAN, etc.)
- OCR extracts text information
- Validates document format and details

```javascript
// OCR Implementation
import Tesseract from 'tesseract.js';

const extractTextFromDocument = async (imageFile) => {
  const result = await Tesseract.recognize(imageFile, 'eng');
  return {
    text: result.data.text,
    confidence: result.data.confidence,
    extractedData: parseGovernmentID(result.data.text)
  };
};
```

### 4. Selfie Capture & Face Matching
- User captures live selfie
- Compare with photo from uploaded document
- Calculate similarity score

```javascript
// Face matching implementation
import * as faceapi from 'face-api.js';

const compareFaces = async (selfieImage, documentImage) => {
  const descriptor1 = await faceapi.computeFaceDescriptor(selfieImage);
  const descriptor2 = await faceapi.computeFaceDescriptor(documentImage);
  
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  const similarity = Math.max(0, (1 - distance) * 100);
  
  return {
    similarity: similarity.toFixed(2),
    match: similarity > 70 // Threshold for match
  };
};
```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/login` - User login

### Verification
- `POST /api/verify/digilocker` - Simulate DigiLocker auth
- `POST /api/verify/upload-document` - Document upload
- `POST /api/verify/upload-selfie` - Selfie upload
- `GET /api/verify/status` - Get verification status

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/verification-history` - Get verification history

## 🎨 UI Components

### DigiLocker Login Modal
```jsx
const DigiLockerLogin = ({ onSuccess }) => {
  const handleDigiLockerAuth = async () => {
    // Simulate DigiLocker authentication
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setVerificationStatus({
      authenticated: true,
      message: "Successfully authenticated with DigiLocker",
      documents: ["Aadhaar Card", "PAN Card"]
    });
    
    onSuccess();
  };

  return (
    <div className="digilocker-modal">
      <h3>Verify with DigiLocker</h3>
      <p>Secure document verification powered by Government of India</p>
      <button onClick={handleDigiLockerAuth}>
        {loading ? "Authenticating..." : "Login with DigiLocker"}
      </button>
    </div>
  );
};
```

### Document Upload Component
```jsx
const DocumentUpload = ({ onUpload }) => {
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('document', file);
    
    const response = await fetch('/api/verify/upload-document', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    onUpload(result);
  };

  return (
    <div className="document-upload">
      <input 
        type="file" 
        accept="image/*,application/pdf"
        onChange={(e) => handleFileUpload(e.target.files[0])}
      />
      <p>Upload Aadhaar, PAN, or other government ID</p>
    </div>
  );
};
```

## 🔒 Security Features

- **Data Encryption**: All sensitive data encrypted at rest
- **Secure File Upload**: File type validation and size limits
- **JWT Authentication**: Secure user sessions
- **Input Sanitization**: Prevent XSS and injection attacks
- **Rate Limiting**: Prevent API abuse

## 📊 Verification Levels

| Level | Requirements | Badge |
|-------|-------------|-------|
| **Basic** | Email + Phone verification | ✅ Email Verified |
| **Standard** | Basic + Document upload | 🆔 ID Verified |
| **Premium** | Standard + Selfie match | ✅ DigiLocker Verified |
| **Full** | Premium + Additional docs | 🏆 Fully Verified |

## 🎯 Demo Features for Hackathon

### Mock Data Generator
```javascript
// Generate realistic demo data
const generateMockVerification = () => ({
  user: {
    name: "Rahul Sharma",
    aadhaar: "XXXX-XXXX-1234",
    pan: "ABCDE1234F",
    dob: "1995-06-15"
  },
  verification: {
    status: "verified",
    confidence: 95.8,
    timestamp: new Date().toISOString()
  }
});
```

### Admin Dashboard
- View all verification requests
- Manual approval/rejection
- Analytics and statistics
- User management

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Future Enhancements

- [ ] Blockchain-based verification certificates
- [ ] Integration with real DigiLocker APIs (post-hackathon)
- [ ] Advanced ML models for document fraud detection
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Enterprise dashboard
- [ ] API rate limiting and usage analytics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## ⚠️ Hackathon Disclaimer

**For Demo Purposes Only**: This is a simulated DigiLocker implementation for hackathon/educational purposes. Real DigiLocker integration requires official government API access and proper licensing.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Developer**: [Your Name]
- **Backend Developer**: [Team Member]
- **UI/UX Designer**: [Team Member]

## 📞 Support

For hackathon queries or technical support:
- Email: team@yourproject.com
- GitHub Issues: [Create Issue](https://github.com/your-username/simulated-digilocker/issues)

---

**Built with ❤️ for Hackathon 2025**