/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#faf9f7',
          100: '#f5f3ef',
          200: '#e8e4db',
          300: '#d4cdc0',
          400: '#b8ac98',
          500: '#9d8d75',
          600: '#8a7a63',
          700: '#736655',
          800: '#5f5549',
          900: '#4e473d',
        },
        terracotta: {
          50: '#fef6f4',
          100: '#fde9e4',
          200: '#fcd6cd',
          300: '#f9b8a8',
          400: '#f48f75',
          500: '#eb6f4d',
          600: '#d85637',
          700: '#b5432b',
          800: '#963927',
          900: '#7d3325',
        },
        sage: {
          50: '#f6f7f4',
          100: '#e9ede3',
          200: '#d5dbc9',
          300: '#b5c2a4',
          400: '#92a67c',
          500: '#758b5e',
          600: '#5c6f49',
          700: '#49593c',
          800: '#3d4933',
          900: '#343e2d',
        },
      },
      fontFamily: {
        serif: ['Crimson Pro', 'serif'],
        sans: ['Karla', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
