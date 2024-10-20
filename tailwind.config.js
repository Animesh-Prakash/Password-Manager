/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'below-1300': { 'max': '1300px' }, // Custom breakpoint for 1300px and below
        'below-1000':{'max':'1000px'},
      },
    },
  },
  plugins: [],
}