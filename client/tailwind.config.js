/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			keyframes: {
				underline: {
					"0%": { width: "0" },
					"100%": { width: "100%" },
				},
			},
			animation: {
				underline: "underline 0.2s ease",
			},
			fontFamily: {
				sans: ["Inter", ...fontFamily.sans],
				heading: ["Space Grotesk", ...fontFamily.sans],
			},
			fontSize: {
				h1: "3rem", // 48px
				h2: "2.25rem", // 36px
				h3: "1.5rem", // 24px
				body: "1rem", // 16px
				small: "0.875rem", // 14px
			},
			spacing: {
				18: "4.5rem", // 72px
				22: "5.5rem", // 88px
			},
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: "#000000", // Black from the logo
					secondary: "#FF9494", // Red from the logo
					accent: "#414141", // Dark gray (kept from previous config)
					neutral: "#EEEEEE", // Very light gray (kept from previous config)
					"base-100": "#FFFFFF", // White background
					"base-200": "#F5F5F5", // Lighter gray (kept from previous config)
					"base-300": "#E0E0E0", // Light gray (kept from previous config)
					info: "#9E9E9E", // Medium light gray (kept from previous config)
					success: "#616161", // Medium dark gray (kept from previous config)
					warning: "#424242", // Dark gray (kept from previous config)
					error: "#FF5757", // Using the red from the logo for error state
					background: "#FFFFFF", // White background
					text: "#000000", // Black text color
				},
			},
		],
	},
};
