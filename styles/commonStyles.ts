
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Modern shadcn/ui inspired color palette
export const colors = {
  // Background colors - clean and minimal
  background: '#ffffff',
  backgroundDark: '#0a0a0a',
  backgroundSecondary: '#f9fafb',
  backgroundSecondaryDark: '#111111',
  
  // Card colors with subtle borders
  card: '#ffffff',
  cardDark: '#0f0f0f',
  cardHover: '#fafafa',
  cardHoverDark: '#1a1a1a',
  
  // Text colors - high contrast
  text: '#09090b',
  textDark: '#fafafa',
  textSecondary: '#71717a',
  textSecondaryDark: '#a1a1aa',
  textMuted: '#a1a1aa',
  textMutedDark: '#71717a',
  
  // Primary accent - modern blue
  primary: '#0ea5e9',
  primaryLight: '#38bdf8',
  primaryDark: '#0284c7',
  primaryForeground: '#ffffff',
  
  // Secondary accent
  secondary: '#f4f4f5',
  secondaryDark: '#27272a',
  secondaryForeground: '#18181b',
  secondaryForegroundDark: '#fafafa',
  
  // Status colors - vibrant and clear
  success: '#22c55e',
  successLight: '#4ade80',
  error: '#ef4444',
  errorLight: '#f87171',
  warning: '#f59e0b',
  warningLight: '#fbbf24',
  info: '#3b82f6',
  infoLight: '#60a5fa',
  
  // UI elements - subtle and refined
  border: '#e4e4e7',
  borderDark: '#27272a',
  divider: '#f4f4f5',
  dividerDark: '#1f1f1f',
  
  // Shadows - soft and layered
  shadow: 'rgba(0, 0, 0, 0.05)',
  shadowMedium: 'rgba(0, 0, 0, 0.1)',
  shadowLarge: 'rgba(0, 0, 0, 0.15)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
  
  // Accent colors for variety
  violet: '#8b5cf6',
  violetLight: '#a78bfa',
  pink: '#ec4899',
  pinkLight: '#f472b6',
  emerald: '#10b981',
  emeraldLight: '#34d399',
  amber: '#f59e0b',
  amberLight: '#fbbf24',
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 2px 8px ${colors.shadowMedium}`,
    elevation: 2,
  },
  primaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryForeground,
    letterSpacing: -0.2,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondaryForeground,
    letterSpacing: -0.2,
  },
  outline: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  outlineText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.2,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.2,
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
    textAlign: 'center',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginVertical: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: `0px 4px 16px ${colors.shadow}`,
    elevation: 2,
  },
  cardCompact: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 20,
    marginVertical: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: `0px 3px 12px ${colors.shadow}`,
    elevation: 1,
  },
  cardSmall: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
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
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondaryForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  inputFocused: {
    borderColor: colors.primary,
    boxShadow: `0px 0px 0px 3px ${colors.primary}20`,
  },
});
