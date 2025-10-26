
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Modern monochromatic color palette inspired by the design
export const colors = {
  // Primary colors - blue-gray monochromatic scheme
  background: '#f5f7fa',
  backgroundDark: '#1a2332',
  
  // Card colors
  card: '#ffffff',
  cardDark: '#2a3544',
  cardSecondary: '#f0f3f7',
  
  // Text colors
  text: '#1a2332',
  textDark: '#f5f7fa',
  textSecondary: '#6b7a8f',
  textSecondaryDark: '#9ca8b8',
  textMuted: '#a0aec0',
  
  // Accent colors
  primary: '#5b7c99',
  primaryLight: '#7a9ab8',
  primaryDark: '#3d5a75',
  
  secondary: '#8fa3b8',
  accent: '#6b8ca8',
  
  // Status colors
  success: '#6ba88f',
  error: '#b87a7a',
  warning: '#b8a67a',
  info: '#7a9ab8',
  
  // UI elements
  border: '#e5e9f0',
  borderDark: '#3d4a5c',
  divider: '#eef2f7',
  shadow: 'rgba(26, 35, 50, 0.08)',
  shadowDark: 'rgba(0, 0, 0, 0.3)',
  
  // Overlay
  overlay: 'rgba(26, 35, 50, 0.4)',
  overlayDark: 'rgba(0, 0, 0, 0.6)',
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    boxShadow: `0px 4px 16px ${colors.shadow}`,
    elevation: 4,
  },
  backButton: {
    backgroundColor: colors.card,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: colors.border,
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
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.3,
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
    borderRadius: 24,
    padding: 24,
    marginVertical: 12,
    width: '100%',
    boxShadow: `0px 8px 24px ${colors.shadow}`,
    elevation: 3,
  },
  cardCompact: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    width: '100%',
    boxShadow: `0px 6px 20px ${colors.shadow}`,
    elevation: 2,
  },
  cardSmall: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    boxShadow: `0px 4px 16px ${colors.shadow}`,
    elevation: 2,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.cardSecondary,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
