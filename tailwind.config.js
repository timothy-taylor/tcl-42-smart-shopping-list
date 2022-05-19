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
        soon: '#90f1ef',
        'kinda-soon': '#ffd6e0',
        'not-soon': '#ffef9f',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
