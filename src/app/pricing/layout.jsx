export const metadata = {
  title: 'Pricing - StudentNest | Affordable Student Housing Platform',
  description: 'Transparent pricing for students and property owners. Free for students, ₹99 for property listings. No hidden fees, no surprises.',
  keywords: 'student housing pricing, property listing fees, affordable accommodation, student-friendly pricing, PG pricing',
  openGraph: {
    title: 'StudentNest Pricing - Transparent & Student-Friendly',
    description: 'Free for students, affordable for property owners. Join thousands using StudentNest.',
    images: ['/og/pricing-page.jpg'],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudentNest Pricing - Transparent & Student-Friendly',
    description: 'Free for students, affordable for property owners. Join thousands using StudentNest.'
  }
};

export default function PricingLayout({ children }) {
  return children;
}
