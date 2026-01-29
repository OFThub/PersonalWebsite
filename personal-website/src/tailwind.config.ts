import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#e2e8f0',
            a: {
              color: '#06b6d4',
              '&:hover': {
                color: '#0891b2',
              },
            },
            h1: { color: '#f1f5f9' },
            h2: { color: '#f1f5f9' },
            h3: { color: '#f1f5f9' },
            h4: { color: '#f1f5f9' },
            strong: { color: '#f1f5f9' },
            code: { color: '#06b6d4' },
            blockquote: {
              color: '#cbd5e1',
              borderLeftColor: '#06b6d4',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config