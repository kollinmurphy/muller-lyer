/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const fs = require('fs');

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {}
  },
  daisyui: {
    themes: [
      {
        lofi: {
          ...require('daisyui/src/theming/themes')['cupcake']
        }
      }
    ]
  },
  plugins: [require('daisyui')]
};
