/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#15463F',
        'primary-dark': '#0F3530',
        accent: '#C8A45A',
        'accent-soft': '#E3CC97',
        background: '#F4EFE6',
        card: '#FFFFFF'
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 20px 40px rgba(21,70,63,0.10)'
      }
    }
  },
  plugins: []
};
