import typography from '@tailwindcss/typography'

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}


/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'theme-dark',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
    colors: {
      'gray': {
        50: 'var(--gray-50)',
        100: 'var(--gray-100)',
        200: 'var(--gray-200)',
        300: 'var(--gray-300)',
        400: 'var(--gray-400)',
        500: 'var(--gray-500)',
        600: 'var(--gray-600)',
        700: 'var(--gray-700)',
        800: 'var(--gray-800)',
        900: 'var(--gray-900)',
      }
    }
  },
  plugins: [typography],
}

