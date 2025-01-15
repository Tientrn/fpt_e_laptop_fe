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
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
  variants: {
    extend: {
      scale: ["group-hover"],
    },
  },
};
