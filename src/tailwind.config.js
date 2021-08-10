module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      body: "'Roboto', Arial, Helvetica, sans-serif"
    },
    extend: {
      colors: {
        primary: {
          light: '#E3EAF2',
          main: '#4572A6',
          dark: '#414042',
          accent: '#FDBB58',
          'contrast-text': '#FFFFFF'
        }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
