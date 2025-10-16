import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, User, Bell, Volume2, Palette, Shield, Heart, CircleHelp as HelpCircle, LogOut, Trash2, ChevronRight } from 'lucide-react-native';

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

interface SettingsItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  destructive?: boolean;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    soundEnabled: true,
    kidFriendlyMode: false,
    highContrastMode: false,
    hapticFeedback: true,
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement logout logic
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your progress, memorized verses, and badges will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Account', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'Type "DELETE" to confirm account deletion',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm', style: 'destructive' }
              ]
            );
          }
        }
      ]
    );
  };

  const settingsSections: SettingsSection[] = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Edit Profile',
          description: 'Update username, avatar, and preferences',
          icon: <User size={20} color="#3B82F6" />,
          type: 'navigation',
          onPress: () => router.push('/settings/profile')
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          description: 'Daily challenges and verse reminders',
          icon: <Bell size={20} color="#10B981" />,
          type: 'toggle',
          value: settings.notifications
        },
        {
          id: 'sound',
          title: 'Sound Effects',
          description: 'Game sounds and audio feedback',
          icon: <Volume2 size={20} color="#F59E0B" />,
          type: 'toggle',
          value: settings.soundEnabled
        },
        {
          id: 'haptic',
          title: 'Haptic Feedback',
          description: 'Vibration for correct answers and achievements',
          icon: <Heart size={20} color="#EF4444" />,
          type: 'toggle',
          value: settings.hapticFeedback
        }
      ]
    },
    {
      title: 'Accessibility',
      items: [
        {
          id: 'kidMode',
          title: 'Kid-Friendly Mode',
          description: 'Simplified interface and parental controls',
          icon: <Shield size={20} color="#8B5CF6" />,
          type: 'toggle',
          value: settings.kidFriendlyMode
        },
        {
          id: 'contrast',
          title: 'High Contrast Mode',
          description: 'Enhanced visibility for better readability',
          icon: <Palette size={20} color="#6B7280" />,
          type: 'toggle',
          value: settings.highContrastMode
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & FAQ',
          description: 'Get help and find answers',
          icon: <HelpCircle size={20} color="#3B82F6" />,
          type: 'navigation',
          onPress: () => router.push('/settings/help')
        },
        {
          id: 'donate',
          title: 'Support Scripture Quest',
          description: 'Help us keep the app free and ad-free',
          icon: <Heart size={20} color="#EF4444" />,
          type: 'navigation',
          onPress: () => router.push('/settings/donate')
        }
      ]
    },
    {
      title: 'Account Actions',
      items: [
        {
          id: 'logout',
          title: 'Sign Out',
          icon: <LogOut size={20} color="#EF4444" />,
          type: 'action',
          onPress: handleLogout,
          destructive: true
        },
        {
          id: 'delete',
          title: 'Delete Account',
          description: 'Permanently delete your account and all data',
          icon: <Trash2 size={20} color="#EF4444" />,
          type: 'action',
          onPress: handleDeleteAccount,
          destructive: true
        }
      ]
    }
  ];

  const renderSettingsItem = (item: SettingsItem) => (
    <Pressable
      key={item.id}
      style={[styles.settingsItem, item.destructive && styles.destructiveItem]}
      onPress={item.onPress}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.itemIcon, item.destructive && styles.destructiveIcon]}>
          {item.icon}
        </View>
        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, item.destructive && styles.destructiveText]}>
            {item.title}
          </Text>
          {item.description && (
            <Text style={styles.itemDescription}>{item.description}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.itemRight}>
        {item.type === 'toggle' && (
          <Switch
            value={item.value}
            onValueChange={(value) => updateSetting(item.id, value)}
            trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
            thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
          />
        )}
        {item.type === 'navigation' && (
          <ChevronRight size={20} color="#9CA3AF" />
        )}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {settingsSections.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingsItem)}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Scripture Quest</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            Enhancing Bible learning through interactive games
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  destructiveItem: {
    backgroundColor: '#FEF2F2',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  destructiveIcon: {
    backgroundColor: '#FEE2E2',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  destructiveText: {
    color: '#EF4444',
  },
  itemDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  itemRight: {
    marginLeft: 12,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});