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
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        pulseAmber: {
          '0%': { boxShadow: '0 0 0 0 rgba(245, 158, 11, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(245, 158, 11, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(245, 158, 11, 0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        slideUp: 'slideUp 0.5s ease-out',
        pulseAmber: 'pulseAmber 2s infinite'
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
