import type { Config } from 'tailwindcss'

/**
 * Meridian Vapes brand tokens.
 *
 * Colours are derived directly from the logo assets in /logo:
 *   - Electric blue accent  #0081FD  (sampled from the vape device in the mark)
 *   - Silver-grey           #BEBDBF  (sampled from the "M" wings)
 *   - Near-black ink        #0A0B0D  (premium dark theme background)
 *
 * Do NOT hardcode hex values in components — always reference these tokens
 * (e.g. `bg-ink-950`, `text-silver-300`, `text-accent`, `ring-accent`).
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Near-black backgrounds (cool, slightly blue-leaning dark)
        ink: {
          950: '#0A0B0D',
          900: '#0E1013',
          850: '#131619',
          800: '#181C20',
          700: '#222730',
          600: '#2C323B',
          500: '#3A4049',
          DEFAULT: '#0A0B0D',
        },
        // Silver-grey neutral scale (logo wings + UI text)
        silver: {
          50: '#F6F7F8',
          100: '#E9EBED',
          200: '#D4D7DB',
          300: '#BEC0C4', // ≈ brand silver #BEBDBF
          400: '#9AA0A8',
          500: '#7C828B',
          600: '#60656D',
          700: '#474B52',
          800: '#33363B',
          900: '#212327',
          DEFAULT: '#BEC0C4',
        },
        // Electric blue accent scale (the single brand accent)
        accent: {
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CBFF',
          300: '#66B0FF',
          400: '#3396FE',
          500: '#0081FD', // brand accent
          600: '#0067CA',
          700: '#004D98',
          800: '#003466',
          900: '#001A33',
          DEFAULT: '#0081FD',
        },
      },
      fontFamily: {
        sans: [
          'Manrope',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        display: [
          'Manrope',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
      },
      maxWidth: {
        content: '80rem', // 1280px page container
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        accent: '0 0 0 1px rgba(0,129,253,0.4), 0 8px 30px -8px rgba(0,129,253,0.35)',
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 10px 30px -18px rgba(0,0,0,0.9)',
      },
      ringColor: {
        accent: '#0081FD',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 180ms ease-out',
        'scale-in': 'scale-in 180ms ease-out',
      },
    },
  },
  plugins: [],
}

export default config
