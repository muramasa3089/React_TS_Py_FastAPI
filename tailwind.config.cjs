// tailwind.config.cjs（CommonJSで！）
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-gradient-to-b',
    'from-blue-100',
    'to-green-100',
    'via-white',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
