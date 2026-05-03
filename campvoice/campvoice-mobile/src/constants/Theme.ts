export const COLORS = {
  // Global Background: Warm Milk
  background: '#FFFDF5',
  
  // Primary Accent: Forest Green
  primary: '#1A531A',
  
  // Secondary Surfaces: Cream White
  surface: '#F8FBF8',
  
  // Text: Charcoal (Do NOT use pure black)
  textPrimary: '#2A2A2A',
  textSecondary: '#525252',
  textOnPrimary: '#FFFFFF',
  
  // Borders
  border: '#E6EBE6',
  
  // Status Colors
  success: '#1A531A', // Aligned with Primary Forest Green
  warning: '#D97706',
  danger: '#DC2626',
  info: '#2563EB',
  
  // Derived Tints
  primaryLight: '#2A7A2A',
  surfaceAlt: '#F0F4F0',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: COLORS.textPrimary,
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: COLORS.textPrimary,
  },
  body: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  caption: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
};
