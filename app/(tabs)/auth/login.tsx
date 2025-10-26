
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { authService } from '@/services/authService';
import { syncService } from '@/services/syncService';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password');
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await authService.login({ email, password });
      
      // Start sync after login
      await syncService.syncNow();
      
      Alert.alert('Success', 'Welcome back!');
      router.replace('/(tabs)/(home)/');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'apple' | 'microsoft') => {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await authService.loginWithOAuth(provider);
      
      // Start sync after login
      await syncService.syncNow();
      
      Alert.alert('Success', 'Welcome!');
      router.replace('/(tabs)/(home)/');
    } catch (error) {
      console.error('OAuth login error:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Welcome to PVA+',
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <IconSymbol name="sparkles" size={64} color={colors.primary} />
          <Text style={styles.title}>PVA+</Text>
          <Text style={styles.subtitle}>Your AI Personal Assistant</Text>
          <Text style={styles.description}>
            Sign in to sync your data across all devices
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.form}>
          <View style={styles.inputContainer}>
            <IconSymbol name="envelope.fill" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <IconSymbol name="lock.fill" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <IconSymbol
                name={showPassword ? 'eye.slash.fill' : 'eye.fill'}
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>

          <Pressable
            style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </Pressable>

          <Pressable onPress={() => router.push('/(tabs)/auth/signup' as any)}>
            <Text style={styles.linkText}>
              Don&apos;t have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)} style={styles.oauthContainer}>
          <Pressable
            style={[styles.button, styles.oauthButton]}
            onPress={() => handleOAuthLogin('google')}
            disabled={loading}
          >
            <IconSymbol name="g.circle.fill" size={24} color={colors.text} />
            <Text style={styles.oauthButtonText}>Continue with Google</Text>
          </Pressable>

          {Platform.OS === 'ios' && (
            <Pressable
              style={[styles.button, styles.oauthButton]}
              onPress={() => handleOAuthLogin('apple')}
              disabled={loading}
            >
              <IconSymbol name="apple.logo" size={24} color={colors.text} />
              <Text style={styles.oauthButtonText}>Continue with Apple</Text>
            </Pressable>
          )}

          <Pressable
            style={[styles.button, styles.oauthButton]}
            onPress={() => handleOAuthLogin('microsoft')}
            disabled={loading}
          >
            <IconSymbol name="microsoft.logo" size={24} color={colors.text} />
            <Text style={styles.oauthButtonText}>Continue with Microsoft</Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500)} style={styles.footer}>
          <Text style={styles.footerText}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </Animated.View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.text,
    marginTop: 16,
    letterSpacing: -2,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  button: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  oauthButton: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    flexDirection: 'row',
    gap: 12,
  },
  oauthButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  linkText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  linkTextBold: {
    fontWeight: '600',
    color: colors.primary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    marginHorizontal: 16,
  },
  oauthContainer: {
    marginBottom: 32,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
