import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Trophy, 
  BookOpen, 
  Target, 
  Settings, 
  Share,
  Calendar,
  Star,
  Award,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react-native';

interface UserStats {
  totalScore: number;
  gamesPlayed: number;
  versesMemorized: number;
  streakDays: number;
  badgesEarned: number;
  journeysCompleted: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

interface MemorizedVerse {
  id: string;
  reference: string;
  text: string;
  mastered: boolean;
  reviewCount: number;
  lastReviewed: string;
}

const userStats: UserStats = {
  totalScore: 2450,
  gamesPlayed: 67,
  versesMemorized: 45,
  streakDays: 7,
  badgesEarned: 12,
  journeysCompleted: 3
};

const badges: Badge[] = [
  {
    id: '1',
    name: 'Faith Warrior',
    description: 'Complete the Journey of Faith',
    icon: '⚔️',
    earned: true,
    earnedDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Memory Master',
    description: 'Memorize 50 verses',
    icon: '🧠',
    earned: false
  },
  {
    id: '3',
    name: 'Quiz Champion',
    description: 'Score 100% on 10 quizzes',
    icon: '🏆',
    earned: true,
    earnedDate: '2024-01-20'
  },
  {
    id: '4',
    name: 'Squad Leader',
    description: 'Lead 5 successful rescue missions',
    icon: '👑',
    earned: true,
    earnedDate: '2024-01-18'
  },
  {
    id: '5',
    name: 'Verse Collector',
    description: 'Memorize verses from 10 different books',
    icon: '📚',
    earned: false
  },
  {
    id: '6',
    name: 'Daily Devotion',
    description: 'Play games for 30 consecutive days',
    icon: '📅',
    earned: false
  }
];

const memorizedVerses: MemorizedVerse[] = [
  {
    id: '1',
    reference: 'Psalm 23:1',
    text: 'The Lord is my shepherd; I shall not want.',
    mastered: true,
    reviewCount: 5,
    lastReviewed: '2024-01-20'
  },
  {
    id: '2',
    reference: 'John 3:16',
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    mastered: true,
    reviewCount: 8,
    lastReviewed: '2024-01-19'
  },
  {
    id: '3',
    reference: 'Philippians 4:13',
    text: 'I can do all this through him who gives me strength.',
    mastered: false,
    reviewCount: 2,
    lastReviewed: '2024-01-21'
  }
];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'verses'>('overview');

  const renderStatCard = (icon: React.ReactNode, label: string, value: string | number, color: string) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        {React.cloneElement(icon as React.ReactElement, { color, size: 20 })}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const renderBadge = (badge: Badge) => (
    <View key={badge.id} style={[styles.badgeCard, !badge.earned && styles.badgeCardLocked]}>
      <Text style={styles.badgeIcon}>{badge.icon}</Text>
      <Text style={[styles.badgeName, !badge.earned && styles.badgeNameLocked]}>{badge.name}</Text>
      <Text style={[styles.badgeDescription, !badge.earned && styles.badgeDescriptionLocked]}>
        {badge.description}
      </Text>
      {badge.earned && badge.earnedDate && (
        <Text style={styles.badgeDate}>Earned {badge.earnedDate}</Text>
      )}
      {!badge.earned && (
        <View style={styles.lockedOverlay}>
          <Text style={styles.lockedText}>Locked</Text>
        </View>
      )}
    </View>
  );

  const renderMemorizedVerse = (verse: MemorizedVerse) => (
    <Pressable key={verse.id} style={styles.verseCard}>
      <View style={styles.verseHeader}>
        <Text style={styles.verseReference}>{verse.reference}</Text>
        <View style={[styles.masteryBadge, { backgroundColor: verse.mastered ? '#10B981' : '#F59E0B' }]}>
          <Text style={styles.masteryText}>{verse.mastered ? 'Mastered' : 'Learning'}</Text>
        </View>
      </View>
      <Text style={styles.verseText}>{verse.text}</Text>
      <View style={styles.verseFooter}>
        <Text style={styles.verseStats}>Reviewed {verse.reviewCount} times</Text>
        <Text style={styles.verseDate}>Last: {verse.lastReviewed}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150' }}
              style={styles.avatar}
            />
            <View style={styles.avatarBadge}>
              <Star size={16} color="#F59E0B" />
            </View>
          </View>
          <Text style={styles.username}>GraceSeeker</Text>
          <Text style={styles.userTitle}>Faith Warrior</Text>
          <View style={styles.userLevel}>
            <Trophy size={16} color="#F59E0B" />
            <Text style={styles.levelText}>Level 12</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable style={styles.actionButton}>
            <Settings size={20} color="#6B7280" />
            <Text style={styles.actionButtonText}>Settings</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Share size={20} color="#6B7280" />
            <Text style={styles.actionButtonText}>Share Profile</Text>
          </Pressable>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'badges' && styles.activeTab]}
            onPress={() => setActiveTab('badges')}
          >
            <Text style={[styles.tabText, activeTab === 'badges' && styles.activeTabText]}>
              Badges
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'verses' && styles.activeTab]}
            onPress={() => setActiveTab('verses')}
          >
            <Text style={[styles.tabText, activeTab === 'verses' && styles.activeTabText]}>
              Memory Bank
            </Text>
          </Pressable>
        </View>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <View style={styles.tabContent}>
            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              {renderStatCard(<TrendingUp />, 'Total Score', userStats.totalScore.toLocaleString(), '#3B82F6')}
              {renderStatCard(<Target />, 'Games Played', userStats.gamesPlayed, '#10B981')}
              {renderStatCard(<BookOpen />, 'Verses Memorized', userStats.versesMemorized, '#F59E0B')}
              {renderStatCard(<Calendar />, 'Day Streak', userStats.streakDays, '#EF4444')}
              {renderStatCard(<Award />, 'Badges Earned', userStats.badgesEarned, '#8B5CF6')}
              {renderStatCard(<Users />, 'Journeys Complete', userStats.journeysCompleted, '#06B6D4')}
            </View>

            {/* Recent Activity */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.activityList}>
                <View style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Trophy size={16} color="#F59E0B" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>Earned "Quiz Champion" badge</Text>
                    <Text style={styles.activityTime}>2 hours ago</Text>
                  </View>
                </View>
                <View style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <BookOpen size={16} color="#10B981" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>Mastered Philippians 4:13</Text>
                    <Text style={styles.activityTime}>Yesterday</Text>
                  </View>
                </View>
                <View style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Users size={16} color="#3B82F6" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>Completed Journey of Faith</Text>
                    <Text style={styles.activityTime}>3 days ago</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'badges' && (
          <View style={styles.tabContent}>
            <View style={styles.badgesGrid}>
              {badges.map(renderBadge)}
            </View>
          </View>
        )}

        {activeTab === 'verses' && (
          <View style={styles.tabContent}>
            <View style={styles.memoryBankHeader}>
              <Text style={styles.sectionTitle}>Memory Bank</Text>
              <Pressable style={styles.reviewButton}>
                <Clock size={16} color="#3B82F6" />
                <Text style={styles.reviewButtonText}>Review All</Text>
              </Pressable>
            </View>
            <View style={styles.versesList}>
              {memorizedVerses.map(renderMemorizedVerse)}
            </View>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#3B82F6',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FEF3C7',
    padding: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  userLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  activityList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  badgeCardLocked: {
    opacity: 0.6,
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: '#9CA3AF',
  },
  badgeDescription: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  badgeDescriptionLocked: {
    color: '#D1D5DB',
  },
  badgeDate: {
    fontSize: 10,
    color: '#10B981',
    marginTop: 4,
  },
  lockedOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lockedText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  memoryBankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  versesList: {
    gap: 12,
  },
  verseCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  verseReference: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  masteryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  masteryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  verseText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  verseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verseStats: {
    fontSize: 12,
    color: '#6B7280',
  },
  verseDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  bottomPadding: {
    height: 20,
  },
});