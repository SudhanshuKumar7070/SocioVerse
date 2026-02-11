/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@ferrucc-io/emoji-picker/dist/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#1d4ed8',
        lightGray: '#f3f4f6',
      },
      backgroundImage: {
        chatImage: "url('../assets/backGround ChatImage.avif')",
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      keyframes: {
        pingOnce: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.5' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        pingOnce: 'pingOnce 0.4s ease-out',
        fadeInUp: 'fadeInUp 0.5s ease-out',
      },
    },
  },
  plugins: [],
}