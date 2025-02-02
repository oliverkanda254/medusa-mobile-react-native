/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        background: 'var(--color-background)',
        'background-secondary': 'var(--color-background-secondary)',
        content: 'var(--color-content)',
        'content-secondary': 'var(--color-content-secondary)',
      },
      fontFamily: {
        display: 'Audiowide-Regular',
        content: 'Lato-Regular',
        'content-thin': 'Lato-Thin',
        'content-bold': 'Lato-Bold',
      },
    },
  },
  plugins: [],
};
