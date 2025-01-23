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
        content: 'var(--color-content)',
        'content-inverse': 'var(--color-content-inverse)',
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
