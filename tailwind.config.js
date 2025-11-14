/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media', // auto-follow system theme
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.js',
    './resources/**/*.jsx',
    './resources/**/*.ts',
    './resources/**/*.tsx',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
