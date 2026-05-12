import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#f5f5f5',
          dim: '#9d9d9d',
          faint: '#5a5a5a',
          ghost: 'rgba(245,245,245,0.12)',
        },
        night: {
          DEFAULT: '#050505',
          soft: '#0a0a0a',
          deeper: '#020202',
        },
        chrome: '#d8c9a8', // warm gold chrome accent
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.16, 0.84, 0.30, 1)',
        editorial: 'cubic-bezier(0.65, 0, 0.35, 1)',
        drift: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        '1200': '1200ms',
        '1600': '1600ms',
        '2000': '2000ms',
      },
      letterSpacing: {
        editorial: '0.32em',
        wider: '0.4em',
      },
      keyframes: {
        grain: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '20%':       { transform: 'translate(-3%, 2%)' },
          '40%':       { transform: 'translate(2%, -3%)' },
          '60%':       { transform: 'translate(-2%, -1%)' },
          '80%':       { transform: 'translate(1%, 2%)' },
        },
        sheen: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        scrollline: {
          '0%':   { backgroundPosition: '0% -100%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
        // Autonomous atmospheric haze — drifts on two independent cycles
        // so the overlapping gradients never sync visibly.
        hazeDrift: {
          '0%, 100%': { transform: 'translate(0%, 0%)' },
          '30%':      { transform: 'translate(3.5%, 2%)' },
          '65%':      { transform: 'translate(-2%, 3.5%)' },
        },
        hazeShift: {
          '0%, 100%': { transform: 'translate(0%, 0%)' },
          '38%':      { transform: 'translate(-4%, -2.5%)' },
          '72%':      { transform: 'translate(2.5%, -1.5%)' },
        },
      },
      animation: {
        grain:       'grain 1.4s steps(6) infinite',
        sheen:       'sheen 20s cubic-bezier(0.65,0,0.35,1) infinite',
        scrollline:  'scrollline 3.0s cubic-bezier(0.65,0,0.35,1) infinite',
        'haze-drift': 'hazeDrift 50s ease-in-out infinite',
        'haze-shift': 'hazeShift 62s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
