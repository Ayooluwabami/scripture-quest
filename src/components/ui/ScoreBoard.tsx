import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Trophy, Star, Target, Clock } from 'lucide-react-native';

interface Player {
  id: string;
  username: string;
  avatar: string;
  score: number;
  correctAnswers: number;
  timeBonus: number;
}

interface ScoreBoardProps {
  players: Player[];
  currentUserId: string;
  gameType: string;
  showDetailed?: boolean;
}

export default function ScoreBoard({ players, currentUserId, gameType, showDetailed = false }: ScoreBoardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy size={20} color="#F59E0B" />;
      case 2: return <Star size={20} color="#9CA3AF" />;
      case 3: return <Target size={20} color="#CD7C2F" />;
      default: return <Text style={styles.rankNumber}>{rank}</Text>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#FEF3C7';
      case 2: return '#F3F4F6';
      case 3: return '#FED7AA';
      default: return '#FFFFFF';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Trophy size={24} color="#F59E0B" />
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.gameType}>{gameType}</Text>
      </View>

      <ScrollView style={styles.playersList} showsVerticalScrollIndicator={false}>
        {sortedPlayers.map((player, index) => {
          const rank = index + 1;
          const isCurrentUser = player.id === currentUserId;
          
          return (
            <View 
              key={player.id} 
              style={[
                styles.playerCard,
                { backgroundColor: getRankColor(rank) },
                isCurrentUser && styles.currentUserCard
              ]}
            >
              <View style={styles.playerRank}>
                {getRankIcon(rank)}
              </View>
              
              <View style={styles.playerInfo}>
                <View style={styles.playerHeader}>
                  <Text style={styles.playerAvatar}>{player.avatar}</Text>
                  <View style={styles.playerDetails}>
                    <Text style={[styles.playerName, isCurrentUser && styles.currentUserName]}>
                      {player.username}
                      {isCurrentUser && ' (You)'}
                    </Text>
                    <Text style={styles.playerScore}>{player.score} points</Text>
                  </View>
                </View>
                
                {showDetailed && (
                  <View style={styles.detailedStats}>
                    <View style={styles.statItem}>
                      <Target size={14} color="#6B7280" />
                      <Text style={styles.statText}>{player.correctAnswers} correct</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Clock size={14} color="#6B7280" />
                      <Text style={styles.statText}>+{player.timeBonus} time bonus</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Summary Stats */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Game Summary</Text>
        <View style={styles.summaryStats}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Players</Text>
            <Text style={styles.summaryValue}>{players.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Highest Score</Text>
            <Text style={styles.summaryValue}>{sortedPlayers[0]?.score || 0}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Your Rank</Text>
            <Text style={styles.summaryValue}>
              #{sortedPlayers.findIndex(p => p.id === currentUserId) + 1}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  gameType: {
    fontSize: 14,
    color: '#6B7280',
  },
  playersList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  currentUserCard: {
    borderColor: '#3B82F6',
    borderWidth: 2,
  },
  playerRank: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
  playerInfo: {
    flex: 1,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  currentUserName: {
    color: '#3B82F6',
  },
  playerScore: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
  },
  detailedStats: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
});