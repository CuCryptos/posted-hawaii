import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        asphalt: '#2C2C2E',
        coral: '#C4705A',
        teal: '#2B6B7F',
        cream: '#F5F1EC',
        palm: '#4A6741',
        'deep-ocean': '#1A4A5A',
        'sunset-gold': '#D4944C',
        'warm-sand': '#E8DDD3',
        lava: '#8B2500',
      },
      fontFamily: {
        display: ['var(--font-dm-sans)', 'sans-serif'],
        body: ['var(--font-lora)', 'Georgia', 'serif'],
      },
      fontSize: {
        'hero': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'section': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'product': ['1.25rem', { lineHeight: '1.3' }],
      },
      spacing: {
        'section': '6rem',
        'section-sm': '3rem',
      },
      borderRadius: {
        'brand': '2px',
      },
    },
  },
  plugins: [],
}

export default config
