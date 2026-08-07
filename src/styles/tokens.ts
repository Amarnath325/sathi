/**
 * COMPANION CONNECT — DESIGN SYSTEM TOKENS
 * Centralized design tokens for consistent colors, typography, spacing, and shadows.
 */

export const fontTokens = {
  sans: 'var(--font-inter), system-ui, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
};

export const colorTokens = {
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    900: '#312e81',
  },
  emerald: {
    400: '#34d399',
    500: '#10b981',
    900: '#064e3b',
  },
  amber: {
    400: '#fbbf24',
    500: '#f59e0b',
  },
  rose: {
    400: '#f87171',
    500: '#ef4444',
    900: '#7f1d1d',
  },
  slate: {
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  }
};

export const shadowTokens = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  glow: '0 0 20px -3px rgba(79, 70, 229, 0.4)',
};

export const radiusTokens = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
};
