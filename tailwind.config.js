import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '.theme-dark'],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // Organic Design System Colors
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        border: 'var(--border)',
        destructive: 'var(--destructive)',
        // Legacy gray support
        gray: {
          0: 'var(--gray-0)',
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
          999: 'var(--gray-999)',
        }
      },
      // Organic Font Families
      fontFamily: {
        body: ['OPPO Sans 4.0', 'system-ui', 'sans-serif'],
        heading: ['Fraunces', 'Georgia', 'serif'],
        brand: ['Fraunces', 'Georgia', 'serif'],
      },
      // Organic Border Radius
      borderRadius: {
        'organic': '60% 40% 30% 70% / 60% 30% 70% 40%',
        'organic-alt': '30% 70% 70% 30% / 30% 30% 70% 70%',
        'organic-sm': '40% 60% 50% 50% / 50% 40% 60% 50%',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      // Organic Shadows (moss-tinted)
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(93, 112, 82, 0.15)',
        'soft-lg': '0 10px 40px -10px rgba(93, 112, 82, 0.2)',
        'float': '0 10px 40px -10px rgba(193, 140, 93, 0.2)',
        'card': '0 4px 20px -2px rgba(93, 112, 82, 0.12), 0 2px 8px -2px rgba(93, 112, 82, 0.08)',
        'card-hover': '0 20px 40px -10px rgba(93, 112, 82, 0.15)',
      },
      // Spacing extensions
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      // Animation for organic motion
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
      // Typography plugin customization
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--muted-foreground)',
            '--tw-prose-headings': 'var(--foreground)',
            '--tw-prose-lead': 'var(--muted-foreground)',
            '--tw-prose-links': 'var(--primary)',
            '--tw-prose-bold': 'var(--foreground)',
            '--tw-prose-counters': 'var(--muted-foreground)',
            '--tw-prose-bullets': 'var(--border)',
            '--tw-prose-hr': 'var(--border)',
            '--tw-prose-quotes': 'var(--foreground)',
            '--tw-prose-quote-borders': 'var(--primary)',
            '--tw-prose-captions': 'var(--muted-foreground)',
            '--tw-prose-code': 'var(--foreground)',
            '--tw-prose-pre-code': 'var(--muted-foreground)',
            '--tw-prose-pre-bg': 'var(--muted)',
            '--tw-prose-th-borders': 'var(--border)',
            '--tw-prose-td-borders': 'var(--border)',
            // Font customization
            h1: { fontFamily: 'Fraunces, Georgia, serif' },
            h2: { fontFamily: 'Fraunces, Georgia, serif' },
            h3: { fontFamily: 'Fraunces, Georgia, serif' },
            h4: { fontFamily: 'Fraunces, Georgia, serif' },
            // Link styling
            a: {
              color: 'var(--primary)',
              textDecoration: 'none',
              '&:hover': {
                color: 'var(--secondary)',
              },
            },
            // Blockquote styling
            blockquote: {
              borderLeftColor: 'var(--primary)',
              backgroundColor: 'var(--muted)',
              borderRadius: '0 1rem 1rem 0',
              padding: '1rem 1.5rem',
            },
            // Code styling
            code: {
              backgroundColor: 'var(--muted)',
              borderRadius: '0.375rem',
              padding: '0.125rem 0.375rem',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
          },
        },
      },
    },
  },
  plugins: [typography],
}
