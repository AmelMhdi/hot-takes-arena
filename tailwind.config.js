/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './index.html'
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        // Base neutrals
        cream: {
          50: '#fefcf9',
          100: '#fdf8f1',
          200: '#faf0e1',
          300: '#f5e6cc',
          400: '#eed5a8',
          500: '#e4c284',
        },
        
        // Warm grays
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        
        // Earthy sage
        sage: {
          50: '#f6f7f6',
          100: '#e3e8e3',
          200: '#c7d2c7',
          300: '#a3b5a3',
          400: '#7d947d',
          500: '#5f7a5f',
          600: '#4a614a',
          700: '#3d4f3d',
          800: '#334033',
          900: '#2a352a',
        },
        
        // Moody charcoal
        charcoal: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#262626',
        },
        
        // Muted plum
        plum: {
          50: '#faf8fa',
          100: '#f4f0f4',
          200: '#e9e1e9',
          300: '#d9cad9',
          400: '#c4aac4',
          500: '#a888a8',
          600: '#8f6d8f',
          700: '#755a75',
          800: '#624d62',
          900: '#524252',
        },
        
        // Soft peach accent
        peach: {
          50: '#fef7f3',
          100: '#fdede6',
          200: '#fbd8cc',
          300: '#f7baa3',
          400: '#f19268',
          500: '#ea7547',
          600: '#d85d2a',
          700: '#b54820',
          800: '#923c1e',
          900: '#76341d',
        },
        
        // Dusty rose accent  
        rose: {
          50: '#fdf2f2',
          100: '#fce7e7',
          200: '#fbd4d4',
          300: '#f8b4b4',
          400: '#f28b8b',
          500: '#e85d5d',
          600: '#d13d3d',
          700: '#b02d2d',
          800: '#922929',
          900: '#7a2727',
        }
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Clash Display', 'Inter', 'system-ui', 'sans-serif'],
      },
      
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}