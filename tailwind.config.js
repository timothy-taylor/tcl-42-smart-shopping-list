module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Comfortaa', 'sans serif'],
      serif: ['IBM Plex Serif', 'serif'],
    },
    extend: {
      colors: {
        primary: '#0a2342',
        secondary: '#96c5a8',
        neutral: '#d6ba73',
        soon: '#48e5c2',
        'kinda-soon': '#a09be7',
        'not-soon': '#e77474',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
