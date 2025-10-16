import { Platform } from 'react-native';
import * as Camera from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Notifications from 'expo-notifications';

export class PermissionsManager {
  /**
   * Request camera permissions for Pictionary game
   */
  static async requestCameraPermission(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return true; // Web doesn't need explicit camera permissions
    }

    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  }

  /**
   * Request media library permissions for saving verse cards
   */
  static async requestMediaLibraryPermission(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return true; // Web uses download instead
    }

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting media library permission:', error);
      return false;
    }
  }

  /**
   * Request notification permissions for daily challenges
   */
  static async requestNotificationPermission(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return true; // Web notifications handled differently
    }

    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Check if all required permissions are granted
   */
  static async checkAllPermissions(): Promise<{
    camera: boolean;
    mediaLibrary: boolean;
    notifications: boolean;
  }> {
    const permissions = {
      camera: false,
      mediaLibrary: false,
      notifications: false
    };

    if (Platform.OS === 'web') {
      return {
        camera: true,
        mediaLibrary: true,
        notifications: true
      };
    }

    try {
      // Check camera
      const cameraStatus = await Camera.getCameraPermissionsAsync();
      permissions.camera = cameraStatus.status === 'granted';

      // Check media library
      const mediaStatus = await MediaLibrary.getPermissionsAsync();
      permissions.mediaLibrary = mediaStatus.status === 'granted';

      // Check notifications
      const notificationStatus = await Notifications.getPermissionsAsync();
      permissions.notifications = notificationStatus.status === 'granted';

    } catch (error) {
      console.error('Error checking permissions:', error);
    }

    return permissions;
  }

  /**
   * Request all permissions at once
   */
  static async requestAllPermissions(): Promise<{
    camera: boolean;
    mediaLibrary: boolean;
    notifications: boolean;
  }> {
    const results = {
      camera: await this.requestCameraPermission(),
      mediaLibrary: await this.requestMediaLibraryPermission(),
      notifications: await this.requestNotificationPermission()
    };

    return results;
  }

  /**
   * Show permission rationale to user
   */
  static getPermissionRationale(permission: 'camera' | 'mediaLibrary' | 'notifications'): string {
    const rationales = {
      camera: 'Camera access is needed for the Bible Pictionary game where you can draw biblical scenes.',
      mediaLibrary: 'Media library access is needed to save and share your custom verse cards.',
      notifications: 'Notification access helps remind you of daily challenges and verse reviews.'
    };

    return rationales[permission];
  }
}