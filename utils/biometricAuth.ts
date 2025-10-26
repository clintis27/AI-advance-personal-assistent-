
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

/**
 * Biometric Authentication Utility
 * Provides fingerprint, FaceID, and TouchID authentication
 */

export class BiometricAuth {
  /**
   * Check if biometric hardware is available
   */
  static async isAvailable(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        return false;
      }
      
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      return hasHardware;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  /**
   * Check if biometrics are enrolled
   */
  static async isEnrolled(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        return false;
      }
      
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return isEnrolled;
    } catch (error) {
      console.error('Error checking biometric enrollment:', error);
      return false;
    }
  }

  /**
   * Get supported authentication types
   */
  static async getSupportedTypes(): Promise<number[]> {
    try {
      if (Platform.OS === 'web') {
        return [];
      }
      
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      return types;
    } catch (error) {
      console.error('Error getting supported types:', error);
      return [];
    }
  }

  /**
   * Authenticate user with biometrics
   */
  static async authenticate(reason: string = 'Authenticate to continue'): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      if (Platform.OS === 'web') {
        return { success: false, error: 'Biometrics not supported on web' };
      }
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        console.log('Biometric authentication successful');
        return { success: true };
      } else {
        console.log('Biometric authentication failed:', result.error);
        return { 
          success: false, 
          error: result.error || 'Authentication failed' 
        };
      }
    } catch (error) {
      console.error('Error during biometric authentication:', error);
      return { 
        success: false, 
        error: 'Authentication error' 
      };
    }
  }

  /**
   * Get biometric type name for display
   */
  static async getBiometricTypeName(): Promise<string> {
    const types = await this.getSupportedTypes();
    
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return Platform.OS === 'ios' ? 'Face ID' : 'Face Recognition';
    }
    
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
    }
    
    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'Iris Recognition';
    }
    
    return 'Biometric Authentication';
  }
}
