/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-indigo': '#432DF0',
        'custom-purplish-gray-100': '#F0F1FF',
        'custom-purplish-gray-200': '#ebecfa',
        'custom-purplish-gray-300': '#dadcf2',
        'custom-gradient-indigo': '#432DF0',
        'custom-gradient-violet': '#7E4EFF',
        'custom-red-100': '#E52C88',
        'custom-red-200': '#D00000',
        'custom-green-100': '#75D801',
        'custom-green-200': '#1AC792',
        'custom-yellow': '#FFB100',
        'custom-gray': '#919191'
      },
      width: {
        'app': '42rem',
        'toolbar': '4.5rem'
      },
      height: {
        'app': '34rem'
      },
      boxShadow: {
        "custom": '0px 4px 15px 0px rgba(40, 49, 95, 0.15)'
      }
    },
  },  
  plugins: [],
}
