import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Target, BookOpen, Users } from 'lucide-react-native';

interface JourneyCard {
  id: string;
  title: string;
  description: string;
  progress: number;
  theme: string;
  levels: number;
  image: string;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  type: string;
}

const journeys: JourneyCard[] = [
  {
    id: '1',
    title: 'Journey of Faith',
    description: 'Strengthen your faith through interactive challenges and scripture memorization',
    progress: 65,
    theme: 'Faith',
    levels: 10,
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    title: 'Journey of Courage',
    description: 'Face your fears and overcome challenges with biblical courage',
    progress: 30,
    theme: 'Courage',
    levels: 8,
    image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    title: 'Journey of Love',
    description: 'Discover the depths of God\'s love through scripture and reflection',
    progress: 0,
    theme: 'Love',
    levels: 12,
    image: 'https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

const dailyChallenges: DailyChallenge[] = [
  {
    id: '1',
    title: 'Memory Verse Master',
    description: 'Memorize Psalm 23:1 and recite it perfectly',
    points: 50,
    type: 'memory'
  },
  {
    id: '2',
    title: 'Quiz Champion',
    description: 'Answer 10 questions about the Gospel of John',
    points: 30,
    type: 'quiz'
  }
];

export default function HomeScreen() {
  const renderJourneyCard = (journey: JourneyCard) => (
    <Pressable key={journey.id} style={styles.journeyCard}>
      <Image source={{ uri: journey.image }} style={styles.journeyImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.journeyGradient}
      />
      <View style={styles.journeyContent}>
        <Text style={styles.journeyTitle}>{journey.title}</Text>
        <Text style={styles.journeyDescription}>{journey.description}</Text>
        <View style={styles.journeyMeta}>
          <Text style={styles.journeyLevels}>{journey.levels} levels</Text>
          <Text style={styles.journeyProgress}>{journey.progress}% complete</Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[styles.progressFill, { width: `${journey.progress}%` }]} 
          />
        </View>
      </View>
    </Pressable>
  );

  const renderDailyChallengeCard = (challenge: DailyChallenge) => (
    <Pressable key={challenge.id} style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <Target size={24} color="#F97316" />
        <View style={styles.challengePoints}>
          <Text style={styles.pointsText}>+{challenge.points}</Text>
        </View>
      </View>
      <Text style={styles.challengeTitle}>{challenge.title}</Text>
      <Text style={styles.challengeDescription}>{challenge.description}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.subtitle}>Continue your spiritual journey</Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Trophy size={20} color="#F59E0B" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
          <View style={styles.statCard}>
            <BookOpen size={20} color="#3B82F6" />
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>Verses</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={20} color="#10B981" />
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Daily Challenges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Challenges</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalList}>
              {dailyChallenges.map(renderDailyChallengeCard)}
            </View>
          </ScrollView>
        </View>

        {/* Featured Journeys */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Journeys</Text>
          {journeys.map(renderJourneyCard)}
        </View>

        {/* Community Highlights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Highlights</Text>
          <View style={styles.communityCard}>
            <View style={styles.communityHeader}>
              <Users size={20} color="#6B7280" />
              <Text style={styles.communityTitle}>Top Players This Week</Text>
            </View>
            <View style={styles.leaderboardList}>
              <View style={styles.leaderboardItem}>
                <Text style={styles.leaderboardRank}>1.</Text>
                <Text style={styles.leaderboardName}>FaithfulSarah</Text>
                <Text style={styles.leaderboardScore}>2,450 pts</Text>
              </View>
              <View style={styles.leaderboardItem}>
                <Text style={styles.leaderboardRank}>2.</Text>
                <Text style={styles.leaderboardName}>DavidsPsalm</Text>
                <Text style={styles.leaderboardScore}>2,280 pts</Text>
              </View>
              <View style={styles.leaderboardItem}>
                <Text style={styles.leaderboardRank}>3.</Text>
                <Text style={styles.leaderboardName}>GraceSeeker</Text>
                <Text style={styles.leaderboardScore}>2,150 pts</Text>
              </View>
            </View>
          </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
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
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  horizontalList: {
    flexDirection: 'row',
    paddingLeft: 20,
    gap: 12,
  },
  challengeCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengePoints: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  journeyCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  journeyImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  journeyGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  journeyContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  journeyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  journeyDescription: {
    fontSize: 14,
    color: '#E5E7EB',
    lineHeight: 20,
    marginBottom: 12,
  },
  journeyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  journeyLevels: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  journeyProgress: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  communityCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  communityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  leaderboardList: {
    gap: 12,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderboardRank: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    width: 24,
  },
  leaderboardName: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  leaderboardScore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
});