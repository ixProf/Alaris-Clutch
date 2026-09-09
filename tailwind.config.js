/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0E0F11',
        foreground: '#EEEEEE',
        card: '#151619',
        'card-hover': '#1C1D21',
        popover: '#1C1D21',
        sidebar: '#111215',
        muted: '#1F2024',
        'muted-foreground': '#8A8F98',
        'muted-foreground-subtle': '#9499A3',
        primary: '#5E6AD2',
        destructive: '#E05252',
        border: 'rgba(255, 255, 255, 0.08)',
        accent: {
          nebula: '#a78bfa',
          cosmos: '#8b5cf6',
          stardust: '#7c3aed',
        },
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '8px',
        lg: '10px',
      },
      boxShadow: {
        flat: '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
        elevated: '0 4px 12px 0 rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
