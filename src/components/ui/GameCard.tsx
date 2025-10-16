import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Timer, Users, Target } from 'lucide-react-native';

interface GameCardProps {
  game: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    difficulty: 'easy' | 'medium' | 'hard';
    isMultiplayer: boolean;
    estimatedTime: string;
    theme: string;
  };
  onPress: () => void;
}

export default function GameCard({ game, onPress }: GameCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getDifficultyGradient = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return ['#ECFDF5', '#D1FAE5'];
      case 'medium': return ['#FFFBEB', '#FEF3C7'];
      case 'hard': return ['#FEF2F2', '#FECACA'];
      default: return ['#F9FAFB', '#F3F4F6'];
    }
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <LinearGradient
        colors={getDifficultyGradient(game.difficulty)}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {game.icon}
          </View>
          <View style={styles.gameInfo}>
            <Text style={styles.title}>{game.title}</Text>
            <Text style={styles.theme}>{game.theme}</Text>
          </View>
          <View style={styles.meta}>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(game.difficulty) + '20' }]}>
              <Text style={[styles.difficultyText, { color: getDifficultyColor(game.difficulty) }]}>
                {game.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.description}>{game.description}</Text>
        
        <View style={styles.footer}>
          <View style={styles.details}>
            <View style={styles.detail}>
              <Timer size={16} color="#6B7280" />
              <Text style={styles.detailText}>{game.estimatedTime}</Text>
            </View>
            <View style={styles.detail}>
              <Users size={16} color="#6B7280" />
              <Text style={styles.detailText}>
                {game.isMultiplayer ? 'Multiplayer' : 'Single Player'}
              </Text>
            </View>
          </View>
          <View style={styles.playButton}>
            <Target size={16} color="#3B82F6" />
            <Text style={styles.playButtonText}>Play</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gameInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  theme: {
    fontSize: 14,
    color: '#6B7280',
  },
  meta: {
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
  description: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  details: {
    flex: 1,
    gap: 8,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  playButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
});