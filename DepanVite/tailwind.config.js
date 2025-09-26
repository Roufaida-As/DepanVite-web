/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#FFC120',
            light: '#FFF4D2'
          },
          dark: '#11141A',
          light: '#F6F6F6',
          danger: '#D53235'
        },
        fontFamily: {
          'poppins': ['Poppins', 'sans-serif'],
        }
      },
    },
    plugins: [],
  }