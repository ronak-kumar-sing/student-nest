#!/bin/bash

# Property Posting System - Quick Start Script
# This script helps you set up and test the property posting system

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║     🏠 Property Posting System - Quick Start 🏠           ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${RED}✗ .env.local file not found!${NC}"
    echo ""
    echo "Creating .env.local template..."

    cat > .env.local << 'EOF'
# Database
MONGODB_URI=your_mongodb_uri_here

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# API Base URL (for development)
NEXT_PUBLIC_API_URL=http://localhost:3000
EOF

    echo -e "${GREEN}✓ Created .env.local template${NC}"
    echo -e "${YELLOW}⚠ Please edit .env.local and add your credentials${NC}"
    echo ""
    exit 1
fi

# Check Cloudinary credentials
if ! grep -q "CLOUDINARY_CLOUD_NAME=" .env.local || \
   ! grep -q "CLOUDINARY_API_KEY=" .env.local || \
   ! grep -q "CLOUDINARY_API_SECRET=" .env.local; then
    echo -e "${YELLOW}⚠ Cloudinary credentials not configured in .env.local${NC}"
    echo ""
    echo "Please add the following to your .env.local file:"
    echo ""
    echo "CLOUDINARY_CLOUD_NAME=your_cloud_name"
    echo "CLOUDINARY_API_KEY=your_api_key"
    echo "CLOUDINARY_API_SECRET=your_api_secret"
    echo ""
    echo -e "${BLUE}ℹ Get your credentials from: https://cloudinary.com/console${NC}"
    echo ""
fi

echo -e "${BLUE}Checking dependencies...${NC}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠ Dependencies not installed${NC}"
    echo -e "${BLUE}Installing dependencies...${NC}"
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Dependencies installed${NC}"
    else
        echo -e "${RED}✗ Failed to install dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Dependencies installed${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Available Commands"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "1. Start Development Server"
echo "   ${GREEN}npm run dev${NC}"
echo ""
echo "2. Test Cloudinary Upload"
echo "   ${GREEN}node test-cloudinary-upload.js${NC}"
echo ""
echo "3. Access Property Posting Page"
echo "   ${BLUE}http://localhost:3000/owner/post-property${NC}"
echo ""
echo "4. View API Documentation"
echo "   ${BLUE}cat PROPERTY_POSTING_GUIDE.md${NC}"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

# Ask what to do
echo "What would you like to do?"
echo ""
echo "  ${GREEN}1${NC}) Start development server"
echo "  ${YELLOW}2${NC}) Run Cloudinary upload tests"
echo "  ${BLUE}3${NC}) View property posting guide"
echo "  ${RED}4${NC}) Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo -e "${GREEN}Starting development server...${NC}"
        echo -e "${BLUE}Access the app at: http://localhost:3000${NC}"
        echo -e "${BLUE}Property posting: http://localhost:3000/owner/post-property${NC}"
        echo ""
        npm run dev
        ;;
    2)
        echo ""
        echo -e "${YELLOW}Running Cloudinary upload tests...${NC}"
        echo ""

        # Check if demo owner exists
        if ! grep -q "demo.owner@studentnest.com" .env.local 2>/dev/null; then
            echo -e "${YELLOW}⚠ Make sure you have a demo owner account created${NC}"
            echo "Email: demo.owner@studentnest.com"
            echo "Password: Owner@123"
            echo ""
        fi

        node test-cloudinary-upload.js
        ;;
    3)
        echo ""
        if [ -f "PROPERTY_POSTING_GUIDE.md" ]; then
            if command -v less &> /dev/null; then
                less PROPERTY_POSTING_GUIDE.md
            else
                cat PROPERTY_POSTING_GUIDE.md
            fi
        else
            echo -e "${RED}✗ PROPERTY_POSTING_GUIDE.md not found${NC}"
        fi
        ;;
    4)
        echo ""
        echo "Goodbye! 👋"
        echo ""
        exit 0
        ;;
    *)
        echo ""
        echo -e "${RED}Invalid choice. Please run the script again.${NC}"
        echo ""
        exit 1
        ;;
esac
