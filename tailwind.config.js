/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: { 
      animation: {
        'light-bounce': 'lightBounce 1s ease-in-out infinite',
      },
      keyframes: {
        lightBounce: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-5px)', // Ajusta este valor según lo que necesites
          },
        },
      },
  },
  },
  plugins: [],
}

