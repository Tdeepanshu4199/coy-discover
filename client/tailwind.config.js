/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coy: {
          pink: '#FF347F',
          'pink-hover': '#e6246e',
          'pink-light': '#FFF0F5',
          'lavender-soft': '#E9E0FF',
          'lavender-light': '#F5F2FA',
          white: '#FFFFFF',
          'text-primary': '#191722',
          'text-secondary': '#85818F',
          border: '#EAE6F0',
        },
      },
      boxShadow: {
        coy: '4px 4px 0px #191722',
        'coy-sm': '2px 2px 0px #191722',
        'coy-lg': '6px 6px 0px #191722',
        'coy-pink': '4px 4px 0px #FF347F',
        'coy-soft': '0 10px 30px -5px rgba(25, 23, 34, 0.08)',
        'coy-card': '0 20px 40px -15px rgba(25, 23, 34, 0.12)',
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
