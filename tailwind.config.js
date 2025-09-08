module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        survivor: {
          orange: '#FF6B35',
          blue: '#004E89',
          green: '#2E7D32',
          red: '#D32F2F',
          yellow: '#F57F17'
        }
      }
    },
  },
  plugins: [],
}
