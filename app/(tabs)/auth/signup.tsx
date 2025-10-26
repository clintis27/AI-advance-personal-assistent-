
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
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

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await authService.signup({ name, email, password, provider: 'email' });
      
      // Start sync after signup
      await syncService.syncNow();
      
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/(tabs)/(home)/');
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create Account',
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <IconSymbol name="person.badge.plus.fill" size={64} color={colors.primary} />
          <Text style={styles.title}>Join PVA+</Text>
          <Text style={styles.description}>
            Create your account to get started with your AI assistant
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.form}>
          <View style={styles.inputContainer}>
            <IconSymbol name="person.fill" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

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

          <View style={styles.inputContainer}>
            <IconSymbol name="lock.fill" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={colors.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <Pressable
            style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </Pressable>

          <Pressable onPress={() => router.back()}>
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.footer}>
          <Text style={styles.footerText}>
            By creating an account, you agree to our Terms of Service and Privacy Policy
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
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    marginTop: 16,
    letterSpacing: -1.5,
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
