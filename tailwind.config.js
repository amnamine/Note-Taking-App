module.exports = {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Indigo
        secondary: '#3B82F6', // Sky Blue
        accent: '#FBBF24',    // Amber
        neutral: '#F3F4F6',   // Gray
        danger: '#EF4444',    // Red
        success: '#10B981',   // Green
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Poppins for a modern look
      },
    },
  },
  plugins: [],
}
