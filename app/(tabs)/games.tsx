import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sword, Brain, Palette, Clock, Search, BookOpen, Timer, Users, Target, Volume2, Grid3x3 as Grid3X3, Heart } from 'lucide-react-native';

interface GameType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isMultiplayer: boolean;
  estimatedTime: string;
  theme: string;
}

const gameTypes: GameType[] = [
  {
    id: '1',
    title: 'Rescue Mission',
    description: 'Embark on an adventure to rescue the VVIP by defeating spiritual enemies',
    icon: <Sword size={24} color="#EF4444" />,
    type: 'rescue',
    difficulty: 'medium',
    isMultiplayer: true,
    estimatedTime: '40 min',
    theme: 'Adventure'
  },
  {
    id: '2',
    title: 'Bible Quiz',
    description: 'Test your Bible knowledge with challenging questions',
    icon: <Brain size={24} color="#3B82F6" />,
    type: 'quiz',
    difficulty: 'easy',
    isMultiplayer: true,
    estimatedTime: '15 min',
    theme: 'Knowledge'
  },
  {
    id: '3',
    title: 'Memory Verse Challenge',
    description: 'Memorize and recite Bible verses under time pressure',
    icon: <BookOpen size={24} color="#10B981" />,
    type: 'memory',
    difficulty: 'medium',
    isMultiplayer: true,
    estimatedTime: '20 min',
    theme: 'Memory'
  },
  {
    id: '4',
    title: 'Four Pictures One Word',
    description: 'Guess the Bible word from four related images',
    icon: <Grid3X3 size={24} color="#F59E0B" />,
    type: 'fourpictures',
    difficulty: 'easy',
    isMultiplayer: false,
    estimatedTime: '10 min',
    theme: 'Visual'
  },
  {
    id: '5',
    title: 'Bible Pictionary',
    description: 'Draw or guess Bible scenes and characters',
    icon: <Palette size={24} color="#8B5CF6" />,
    type: 'pictionary',
    difficulty: 'medium',
    isMultiplayer: true,
    estimatedTime: '25 min',
    theme: 'Creative'
  },
  {
    id: '6',
    title: 'Scripture Scavenger Hunt',
    description: 'Find verses that match specific themes and topics',
    icon: <Search size={24} color="#EC4899" />,
    type: 'scavenger',
    difficulty: 'hard',
    isMultiplayer: false,
    estimatedTime: '30 min',
    theme: 'Discovery'
  },
  {
    id: '7',
    title: 'Complete the Verse',
    description: 'Fill in missing words from famous Bible passages',
    icon: <Target size={24} color="#06B6D4" />,
    type: 'verse',
    difficulty: 'easy',
    isMultiplayer: true,
    estimatedTime: '12 min',
    theme: 'Completion'
  },
  {
    id: '8',
    title: 'Bible Timeline',
    description: 'Arrange biblical events in chronological order',
    icon: <Clock size={24} color="#F97316" />,
    type: 'timeline',
    difficulty: 'hard',
    isMultiplayer: false,
    estimatedTime: '18 min',
    theme: 'History'
  },
  {
    id: '9',
    title: 'Beatitudes Match',
    description: 'Match the Beatitudes with their meanings and references',
    icon: <Heart size={24} color="#EF4444" />,
    type: 'beatitudes',
    difficulty: 'medium',
    isMultiplayer: false,
    estimatedTime: '15 min',
    theme: 'Teachings'
  },
  {
    id: '10',
    title: 'Audio Challenge',
    description: 'Identify Bible verses and speakers from audio clips',
    icon: <Volume2 size={24} color="#84CC16" />,
    type: 'audio',
    difficulty: 'medium',
    isMultiplayer: true,
    estimatedTime: '20 min',
    theme: 'Listening'
  }
];

const filters = [
  { id: 'all', label: 'All Games' },
  { id: 'single', label: 'Single Player' },
  { id: 'multi', label: 'Multiplayer' },
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' }
];

export default function GamesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredGames = gameTypes.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      activeFilter === 'all' ||
      (activeFilter === 'single' && !game.isMultiplayer) ||
      (activeFilter === 'multi' && game.isMultiplayer) ||
      activeFilter === game.difficulty;

    return matchesSearch && matchesFilter;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderGameCard = (game: GameType) => (
    <Pressable key={game.id} style={styles.gameCard}>
      <View style={styles.gameHeader}>
        <View style={styles.gameIconContainer}>
          {game.icon}
        </View>
        <View style={styles.gameInfo}>
          <Text style={styles.gameTitle}>{game.title}</Text>
          <Text style={styles.gameTheme}>{game.theme}</Text>
        </View>
        <View style={styles.gameMeta}>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(game.difficulty) + '20' }]}>
            <Text style={[styles.difficultyText, { color: getDifficultyColor(game.difficulty) }]}>
              {game.difficulty.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.gameDescription}>{game.description}</Text>
      
      <View style={styles.gameFooter}>
        <View style={styles.gameDetails}>
          <View style={styles.gameDetail}>
            <Timer size={16} color="#6B7280" />
            <Text style={styles.gameDetailText}>{game.estimatedTime}</Text>
          </View>
          <View style={styles.gameDetail}>
            <Users size={16} color="#6B7280" />
            <Text style={styles.gameDetailText}>
              {game.isMultiplayer ? 'Multiplayer' : 'Single Player'}
            </Text>
          </View>
        </View>
        <Pressable style={styles.playButton}>
          <Text style={styles.playButtonText}>Play</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bible Games</Text>
        <Text style={styles.subtitle}>Choose your spiritual adventure</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search games..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map(filter => (
          <Pressable
            key={filter.id}
            style={[
              styles.filterChip,
              activeFilter === filter.id && styles.filterChipActive
            ]}
            onPress={() => setActiveFilter(filter.id)}
          >
            <Text style={[
              styles.filterChipText,
              activeFilter === filter.id && styles.filterChipTextActive
            ]}>
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Games Grid */}
      <ScrollView style={styles.gamesList} showsVerticalScrollIndicator={false}>
        <View style={styles.gamesGrid}>
          {filteredGames.map(renderGameCard)}
        </View>
        
        {filteredGames.length === 0 && (
          <View style={styles.emptyState}>
            <Search size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No games found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filter criteria
            </Text>
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
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  filtersContainer: {
    maxHeight: 44,
    marginBottom: 20,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  gamesList: {
    flex: 1,
  },
  gamesGrid: {
    paddingHorizontal: 20,
    gap: 16,
  },
  gameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  gameIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  gameTheme: {
    fontSize: 14,
    color: '#6B7280',
  },
  gameMeta: {
    alignItems: 'flex-end',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  gameDescription: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  gameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameDetails: {
    flex: 1,
    gap: 8,
  },
  gameDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gameDetailText: {
    fontSize: 13,
    color: '#6B7280',
  },
  playButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  playButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});