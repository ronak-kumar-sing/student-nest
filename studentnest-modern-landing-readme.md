# StudentNest - Modern Landing Page with Custom Components

A stunning, dark-themed landing page inspired by Blitzit's design with custom interactive components and smooth animations.

## 🎨 Design System

### Dark Theme Color Palette
```css
/* Background Colors */
--bg-primary: #0a0a0b;           /* Main dark background */
--bg-secondary: #1a1a1b;         /* Card backgrounds */
--bg-tertiary: #2a2a2b;          /* Elevated elements */

/* Accent Colors */
--accent-purple: #7c3aed;        /* Primary purple */
--accent-blue: #3b82f6;          /* Secondary blue */
--accent-green: #10b981;         /* Success/CTA green */

/* Text Colors */
--text-primary: #ffffff;         /* Main text */
--text-secondary: #a1a1aa;       /* Secondary text */
--text-muted: #71717a;           /* Muted text */

/* Gradient */
--hero-gradient: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);
--card-gradient: linear-gradient(145deg, #1a1a1b 0%, #2a2a2b 100%);
```

### Typography
- **Headlines**: Inter, 700-800 weight with gradient text
- **Body**: Inter, 400-500 weight for readability
- **Accent Text**: 600 weight with purple gradient

## 🧩 Custom Components Integration

### 1. CardSwap Component (Hero Section)
Position: **Top of landing page**

the component provided in reference

### CardSwap Images (3 Screenshots)
```
📁 public/screenshots/
├── dashboard-view.jpg          # Student dashboard with saved properties
├── room-search.jpg            # Property search with filters
└── property-details.jpg       # Detailed property page with amenities
```

**Image Specifications:**
- **Resolution**: 800x600px minimum
- **Format**: JPG/PNG optimized for web
- **Content**:
  - Dashboard showing saved properties and recent searches
  - Search interface with location and budget filters
  - Property details with photos, amenities, and contact info

### 2. Folder Component (Features Section)
Position: **After hero section**

the component provided in reference

### 3. TiltedCard Component (How It Works)
Position: **After features section**

the component provided in reference

### 4. ScrollStack Component (Social Proof/Stats)
Position: **After how it works section**
the component provided in reference

## 📱 Responsive Design

### Mobile Optimizations
```css
/* Mobile-first responsive design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
    line-height: 1.2;
  }

  .card-swap {
    max-width: 90vw;
    margin: 0 auto;
  }

  .tilted-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .scroll-stack {
    max-width: 90vw;
  }
}

/* Tablet optimizations */
@media (min-width: 768px) and (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .tilted-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

## 🎭 Animation Configuration

### Component Animation Settings
```jsx
// CardSwap settings
const cardSwapConfig = {
  interval: 4000,
  transition: "fade",
  autoPlay: true,
  pauseOnHover: true
};

// TiltedCard settings
const tiltedCardConfig = {
  maxTilt: 15,
  perspective: 1000,
  scale: 1.02,
  speed: 400,
  glare: true,
  maxGlare: 0.2
};

// ScrollStack settings
const scrollStackConfig = {
  direction: "up",
  speed: "slow", // 20px per second
  pauseOnHover: true,
  gap: 24
};

// Folder settings
const folderConfig = {
  animation: "fadeInUp",
  stagger: 100,
  duration: 600,
  easing: "easeOutCubic"
};
```

## 🚀 Performance Optimizations

### Image Optimization
```jsx
// Optimized image loading for CardSwap
const optimizedImages = [
  {
    src: "/screenshots/dashboard-view.webp",
    alt: "Student dashboard showing saved properties",
    width: 800,
    height: 600,
    priority: true
  },
  {
    src: "/screenshots/room-search.webp",
    alt: "Property search with smart filters",
    width: 800,
    height: 600,
    loading: "lazy"
  },
  {
    src: "/screenshots/property-details.webp",
    alt: "Detailed property information page",
    width: 800,
    height: 600,
    loading: "lazy"
  }
];
```

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Total Blocking Time**: < 200ms

## 🎨 Color Usage Guide

### Primary Colors
- **Background**: #0a0a0b (deepest dark)
- **Cards**: #1a1a1b (elevated dark)
- **Borders**: #2a2a2b (subtle contrast)

### Accent Colors
- **Purple**: #7c3aed (primary brand)
- **Blue**: #3b82f6 (secondary brand)
- **Green**: #10b981 (success/CTA)

### Text Hierarchy
- **Primary**: #ffffff (main headings)
- **Secondary**: #a1a1aa (body text)
- **Muted**: #71717a (captions)

## 📊 Component Spacing

### Layout Grid
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section {
  padding: 6rem 0; /* 96px */
}

.component-spacing {
  margin-bottom: 4rem; /* 64px between components */
}

.card-gap {
  gap: 2rem; /* 32px between cards */
}
```

This landing page structure creates a stunning, cohesive experience that matches Blitzit's professional dark theme while showcasing StudentNest's unique features through custom interactive components.