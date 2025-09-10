# Student Nest - Room Browsing Integration

This project integrates the room browsing functionality from the original studentnest project into the Next.js student-nest project using shadcn/ui components.

## Features Implemented

### 🏠 Room Browsing System
- **RoomCard Component**: Modern, responsive cards with hover effects and animations
- **Room Details Page**: Comprehensive view with image gallery, amenities, and owner information
- **Advanced Filtering**: Price range, location, amenities, room type, and availability filters
- **Sample Data**: Realistic room data for testing and development

### 🎨 Design Components
- **SplitText Animations**: GSAP-powered text animations with scroll triggers
- **ShinyText**: Animated gradient text effects for pricing
- **Dark Theme**: Consistent dark theme across all components
- **Glass Morphism**: Modern backdrop blur effects

### 🧩 shadcn/ui Integration
- Card, Button, Badge, Input, Label, Checkbox components
- Slider for price/area range selection
- Select dropdown for sorting and filtering
- Separator for visual organization
- Consistent theming and styling

### 📱 Responsive Design
- Mobile-first approach
- Adaptive grid layouts
- Sticky filter sidebar
- Optimized for all screen sizes

## Key Components

### Room Components
- `src/components/room/RoomCard.jsx` - Individual room card display
- `src/components/room/RoomBrowser.jsx` - Main room browsing interface
- `src/components/filters/FilterComponent.jsx` - Advanced filtering system

### Animation Components
- `src/components/animations/SplitText.jsx` - Scroll-triggered text animations
- `src/components/animations/SplitTextImmediate.jsx` - Immediate text animations
- `src/components/animations/ShinyText.jsx` - Gradient text effects

### Pages
- `src/app/(dashboard)/dashboard/page.jsx` - Main dashboard with room browser
- `src/app/(dashboard)/dashboard/rooms/[id]/page.jsx` - Room details page

### Data & Utils
- `src/utils/constants.js` - Amenities and room type definitions
- `src/utils/sampleData.js` - Sample room data for development

## Styling Features

### Custom CSS Classes
- `.animate-shimmer` - Shimmer effect for text
- `.animate-float` - Floating animation
- `.animate-pulse-glow` - Pulsing glow effect
- `.glass-effect` - Glass morphism styling
- `.gradient-text` - Gradient text coloring

### Dark Theme
- Consistent dark color scheme
- Gray-800/50 backgrounds with backdrop blur
- Proper contrast ratios for accessibility
- Custom scrollbar styling

## Navigation Flow

1. **Dashboard Landing** - Shows room browser for students, stats for owners
2. **Room Browsing** - Grid view with filtering sidebar
3. **Room Details** - Comprehensive view with booking options
4. **Interactive Features** - Save favorites, contact owners, schedule visits

## Technical Stack

- **Next.js 15** - React framework with app directory
- **shadcn/ui** - Modern UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Animation library for text effects
- **Framer Motion** - React animation library
- **Lucide React** - Icon library

## Getting Started

1. Install dependencies:
   ```bash
   npm install gsap framer-motion lucide-react
   ```

2. Add shadcn/ui components:
   ```bash
   npx shadcn@latest add slider select
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000/dashboard` to see the room browser

## User Experience

### For Students
- Browse available rooms with rich filtering options
- View detailed room information and amenities
- Save favorite properties
- Contact property owners
- Schedule property visits

### For Owners
- View dashboard with property statistics
- Manage property listings
- Handle booking requests
- Track revenue and analytics

## Future Enhancements

- Integration with backend API
- Real-time chat functionality
- Payment processing
- Virtual tours
- Map integration
- Review and rating system
- Advanced search with AI recommendations

## Performance Features

- Lazy loading for images
- Optimized animations with GSAP
- Responsive design patterns
- Efficient filtering algorithms
- Smooth scrolling and transitions
