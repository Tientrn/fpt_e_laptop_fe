/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        olive: {
          DEFAULT: "#808000", // Màu olive chính
          light: "#A6D49F", // Tông sáng hơn
          dark: "#6B8E23", // Tông tối hơn
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out'
      }
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
  variants: {
    extend: {
      scale: ["group-hover"],
    },
  },
};
