
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Modern color palette inspired by the design image
export const colors = {
  // Background colors - clean and minimal
  background: '#FAFAFA',
  backgroundDark: '#0a0a0a',
  backgroundSecondary: '#FFFFFF',
  backgroundSecondaryDark: '#111111',
  
  // Card colors with subtle borders
  card: '#FFFFFF',
  cardDark: '#1a1a1a',
  cardHover: '#F8F8F8',
  cardHoverDark: '#222222',
  cardSecondary: '#F5F5F5',
  cardSecondaryDark: '#161616',

  // Highlight - subtle tinted background for callouts/status cards
  highlight: '#FFF1EA',
  highlightDark: '#2a1c14',

  // Text colors - high contrast
  text: '#1a1a1a',
  textDark: '#fafafa',
  textSecondary: '#666666',
  textSecondaryDark: '#a1a1aa',
  textMuted: '#999999',
  textMutedDark: '#71717a',
  
  // Primary accent - vibrant orange
  primary: '#FF6B35',
  primaryLight: '#FF8C5A',
  primaryDark: '#E55A2B',
  primaryForeground: '#ffffff',

  // Accent - secondary vibrant color used for variety alongside primary
  accent: '#6366f1',
  accentLight: '#818cf8',
  accentDark: '#4f46e5',

  // Secondary accent - dark/black
  secondary: '#1a1a1a',
  secondaryDark: '#2a2a2a',
  secondaryForeground: '#ffffff',
  secondaryForegroundDark: '#fafafa',
  
  // Status colors - vibrant and clear
  success: '#22c55e',
  successLight: '#4ade80',
  successDark: '#16a34a',
  error: '#ef4444',
  errorLight: '#f87171',
  errorDark: '#dc2626',
  warning: '#f59e0b',
  warningLight: '#fbbf24',
  warningDark: '#d97706',
  info: '#3b82f6',
  infoLight: '#60a5fa',
  infoDark: '#2563eb',
  
  // UI elements - subtle and refined
  border: '#E8E8E8',
  borderDark: '#2a2a2a',
  divider: '#F0F0F0',
  dividerDark: '#1f1f1f',
  
  // Shadows - soft and layered
  shadow: 'rgba(0, 0, 0, 0.04)',
  shadowMedium: 'rgba(0, 0, 0, 0.08)',
  shadowLarge: 'rgba(0, 0, 0, 0.12)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
  
  // Accent colors for variety
  violet: '#8b5cf6',
  violetLight: '#a78bfa',
  violetDark: '#7c3aed',
  pink: '#ec4899',
  pinkLight: '#f472b6',
  pinkDark: '#db2777',
  emerald: '#10b981',
  emeraldLight: '#34d399',
  emeraldDark: '#059669',
  amber: '#f59e0b',
  amberLight: '#fbbf24',
  amberDark: '#d97706',
  indigo: '#6366f1',
  indigoLight: '#818cf8',
  indigoDark: '#4f46e5',
  teal: '#14b8a6',
  tealLight: '#2dd4bf',
  tealDark: '#0d9488',
  rose: '#f43f5e',
  roseLight: '#fb7185',
  roseDark: '#e11d48',
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 4px 12px ${colors.primary}40`,
    elevation: 3,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryForeground,
    letterSpacing: -0.3,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondaryForeground,
    letterSpacing: -0.3,
  },
  outline: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  outlineText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.3,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.3,
  },
  destructive: {
    backgroundColor: colors.error,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 4px 12px ${colors.error}40`,
    elevation: 3,
  },
  destructiveText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryForeground,
    letterSpacing: -0.3,
  },
  link: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: -0.3,
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'left',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -1.2,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.6,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.8,
  },
  text: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 22,
  },
  textSmall: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textMuted,
    lineHeight: 18,
  },
  textLarge: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 26,
  },
  section: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    width: '100%',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 1,
  },
  cardCompact: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    marginVertical: 8,
    width: '100%',
    boxShadow: `0px 2px 6px ${colors.shadow}`,
    elevation: 1,
  },
  cardSmall: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    width: '100%',
    boxShadow: `0px 1px 4px ${colors.shadow}`,
    elevation: 1,
  },
  cardInteractive: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    width: '100%',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 1,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
  imageCard: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: 0.3,
  },
  badgePrimary: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  badgePrimaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryForeground,
    letterSpacing: 0.3,
  },
  badgeSuccess: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.success,
  },
  badgeSuccessText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryForeground,
    letterSpacing: 0.3,
  },
  badgeWarning: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.warning,
  },
  badgeWarningText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryForeground,
    letterSpacing: 0.3,
  },
  badgeError: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.error,
  },
  badgeErrorText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryForeground,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputFocused: {
    borderColor: colors.primary,
    boxShadow: `0px 0px 0px 3px ${colors.primary}20`,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    width: '100%',
    marginVertical: 16,
  },
  dividerVertical: {
    width: 1,
    backgroundColor: colors.divider,
    height: '100%',
    marginHorizontal: 16,
  },
});

// Animation presets for smooth animations
export const animationPresets = {
  spring: {
    damping: 20,
    stiffness: 140,
    mass: 0.7,
  },
  springBouncy: {
    damping: 12,
    stiffness: 180,
    mass: 0.9,
  },
  springSmooth: {
    damping: 28,
    stiffness: 110,
    mass: 0.5,
  },
  springGentle: {
    damping: 32,
    stiffness: 90,
    mass: 0.4,
  },
};

// Timing presets
export const timingPresets = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
};
