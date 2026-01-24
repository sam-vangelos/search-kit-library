import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Boolean IDE color palette
        'bg-primary': '#0d1117',
        'bg-secondary': '#161b22',
        'bg-tertiary': '#21262d',
        'bg-elevated': '#1c2128',
        'border-primary': '#30363d',
        'text-primary': '#e6edf3',
        'text-secondary': '#8b949e',
        'text-muted': '#6e7681',
        'accent-blue': '#58a6ff',
        'accent-green': '#3fb950',
        'accent-orange': '#d29922',
        'accent-cyan': '#39c5cf',
      },
      fontFamily: {
        sans: ['Outfit', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
      },
    },
  },
  plugins: [],
}

export default config
