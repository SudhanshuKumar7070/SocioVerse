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
        "chatImage": "url('../assets/backGround ChatImage.avif')",
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], // Added Poppins font
        montserrat: ['Montserrat', 'sans-serif'], // Added Montserrat font
      },
    },
  },
  plugins: [
    
  ],
}
