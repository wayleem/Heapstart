/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#4A5568",    // A dark blue-gray, reminiscent of code editor backgrounds
          "secondary": "#718096",  // A lighter blue-gray for secondary elements
          "accent": "#48BB78",     // A muted green, inspired by terminal text
          "neutral": "#2D3748",    // A very dark blue-gray for contrast
          "base-100": "#EDF2F7",   // A light gray-blue for main background
          "base-200": "#E2E8F0",   // A slightly darker gray-blue for layering
          "base-300": "#CBD5E0",   // An even darker gray-blue for more contrast
          "info": "#4299E1",       // A bright blue for informational elements
          "success": "#68D391",    // A bright green for success states
          "warning": "#F6E05E",    // A muted yellow for warnings
          "error": "#FC8181",      // A soft red for errors
        },
      },
    ],
  },
}

