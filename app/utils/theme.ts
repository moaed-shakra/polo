export const theme = {
  colors: {
    primary: {
      50: '#f0f9ff',   // Light blue background
      100: '#e0f2fe',  // Lighter blue
      200: '#bae6fd',  // Light blue
      300: '#7dd3fc',  // Sky blue
      400: '#38bdf8',  // Bright blue
      500: '#0ea5e9',  // Main blue
      600: '#0284c7',  // Darker blue
      700: '#0369a1',  // Dark blue
      800: '#075985',  // Deeper blue
      900: '#0c4a6e',  // Darkest blue
    },
    neutral: {
      50: '#fafafa',   // Lightest background
      100: '#f5f5f5',  // Light background
      200: '#e5e5e5',  // Border light
      300: '#d4d4d4',  // Border
      400: '#a3a3a3',  // Disabled text
      500: '#737373',  // Secondary text
      600: '#525252',  // Primary text light
      700: '#404040',  // Primary text
      800: '#262626',  // Dark text
      900: '#171717',  // Darkest text
    },
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      700: '#15803d',
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      700: '#b91c1c',
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      700: '#b45309',
    },
  },
  typography: {
    fonts: {
      sans: 'var(--font-inter)', // Vi kommer att sätta upp Inter font senare
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    sizes: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeights: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },
  spacing: {
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  radii: {
    none: '0',
    sm: '0.125rem',   // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },
  transitions: {
    DEFAULT: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: '100ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  zIndices: {
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    auto: 'auto',
  },
} as const;

// Utility types för type-safety
export type ThemeColors = typeof theme.colors;
export type ThemeColor = keyof ThemeColors;
export type ColorShades = {
  [K in ThemeColor]: keyof typeof theme.colors[K];
};
export type ThemeShade<T extends ThemeColor> = ColorShades[T];

// Helper functions
export const getColor = <T extends ThemeColor>(color: T, shade: ThemeShade<T>) => {
  return theme.colors[color][shade];
};

export const getFontSize = (size: keyof typeof theme.typography.sizes) => {
  return theme.typography.sizes[size];
};

export default theme; 