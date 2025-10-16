import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Clock, Star, Calendar, Target, RotateCcw } from 'lucide-react-native';

interface TimelineEvent {
  id: string;
  text: string;
  correctOrder: number;
  currentPosition: number;
}

interface TimelineChallenge {
  id: string;
  title: string;
  story: string;
  events: TimelineEvent[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function BibleTimelineScreen() {
  const [currentChallenge, setCurrentChallenge] = useState<TimelineChallenge | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [draggedEvent, setDraggedEvent] = useState<string | null>(null);

  const challenges: TimelineChallenge[] = [
    {
      id: '1',
      title: 'The Story of Moses',
      story: 'Arrange the events from Moses\' life in chronological order',
      events: [
        { id: 'e1', text: 'Moses is born during Israelite oppression', correctOrder: 1, currentPosition: 3 },
        { id: 'e2', text: 'Moses kills an Egyptian and flees to Midian', correctOrder: 2, currentPosition: 1 },
        { id: 'e3', text: 'Moses encounters the burning bush', correctOrder: 3, currentPosition: 4 },
        { id: 'e4', text: 'Moses confronts Pharaoh with plagues', correctOrder: 4, currentPosition: 2 },
        { id: 'e5', text: 'The Israelites cross the Red Sea', correctOrder: 5, currentPosition: 5 }
      ],
      difficulty: 'medium'
    },
    {
      id: '2',
      title: 'The Story of Esther',
      story: 'Put the events from the Book of Esther in the correct order',
      events: [
        { id: 'e1', text: 'Queen Vashti is deposed', correctOrder: 1, currentPosition: 2 },
        { id: 'e2', text: 'Esther becomes queen', correctOrder: 2, currentPosition: 4 },
        { id: 'e3', text: 'Haman plots against the Jews', correctOrder: 3, currentPosition: 1 },
        { id: 'e4', text: 'Esther reveals her identity and Haman\'s plot', correctOrder: 4, currentPosition: 3 },
        { id: 'e5', text: 'The Jews are saved and Purim is established', correctOrder: 5, currentPosition: 5 }
      ],
      difficulty: 'hard'
    }
  ];

  useEffect(() => {
    const challenge = challenges[challengeIndex];
    setCurrentChallenge(challenge);
    setEvents([...challenge.events].sort((a, b) => a.currentPosition - b.currentPosition));
  }, [challengeIndex]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      Alert.alert('Time\'s Up!', 'The timeline challenge has ended.');
    }
  }, [timeRemaining]);

  const moveEvent = (eventId: string, direction: 'up' | 'down') => {
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return;

    const newEvents = [...events];
    const targetIndex = direction === 'up' ? eventIndex - 1 : eventIndex + 1;

    if (targetIndex >= 0 && targetIndex < newEvents.length) {
      // Swap events
      [newEvents[eventIndex], newEvents[targetIndex]] = [newEvents[targetIndex], newEvents[eventIndex]];
      setEvents(newEvents);
    }
  };

  const checkOrder = () => {
    if (!currentChallenge) return;

    let correctCount = 0;
    events.forEach((event, index) => {
      if (event.correctOrder === index + 1) {
        correctCount++;
      }
    });

    const isComplete = correctCount === events.length;
    const points = calculatePoints(correctCount, events.length, currentChallenge.difficulty, timeRemaining);

    if (isComplete) {
      setScore(prev => prev + points);
      Alert.alert(
        'Perfect Order!',
        `Excellent! You got all events in the correct order. +${points} points`,
        [
          {
            text: 'Next Challenge',
            onPress: () => {
              if (challengeIndex < challenges.length - 1) {
                setChallengeIndex(prev => prev + 1);
              } else {
                Alert.alert(
                  'Challenge Complete!',
                  `Congratulations! Final score: ${score + points} points`,
                  [
                    { text: 'Play Again', onPress: () => resetGame() },
                    { text: 'Back to Games', onPress: () => router.back() }
                  ]
                );
              }
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'Not Quite Right',
        `You got ${correctCount} out of ${events.length} events correct. Keep trying!`
      );
    }
  };

  const calculatePoints = (correct: number, total: number, difficulty: string, timeLeft: number): number => {
    if (correct !== total) return 0;

    let basePoints = 20;
    switch (difficulty) {
      case 'easy': basePoints = 20; break;
      case 'medium': basePoints = 30; break;
      case 'hard': basePoints = 40; break;
    }

    // Time bonus
    const timeBonus = Math.floor(basePoints * 0.5 * (timeLeft / 600));
    
    return basePoints + timeBonus;
  };

  const resetOrder = () => {
    if (!currentChallenge) return;
    
    // Shuffle events randomly
    const shuffled = [...currentChallenge.events].sort(() => Math.random() - 0.5);
    setEvents(shuffled);
  };

  const resetGame = () => {
    setChallengeIndex(0);
    setScore(0);
    setTimeRemaining(600);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentChallenge) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading timeline...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>Bible Timeline</Text>
        <View style={styles.scoreContainer}>
          <Star size={16} color="#F59E0B" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      {/* Timer and Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.timerContainer}>
          <Clock size={16} color="#EF4444" />
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        </View>
        <View style={styles.challengeInfo}>
          <Text style={styles.challengeTitle}>{currentChallenge.title}</Text>
          <Text style={styles.challengeNumber}>
            Challenge {challengeIndex + 1} of {challenges.length}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.gameContent} showsVerticalScrollIndicator={false}>
        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Calendar size={20} color="#3B82F6" />
          <Text style={styles.instructionsText}>{currentChallenge.story}</Text>
        </View>

        {/* Timeline Events */}
        <View style={styles.timelineContainer}>
          <Text style={styles.timelineTitle}>Arrange in Chronological Order</Text>
          
          {events.map((event, index) => (
            <View key={event.id} style={styles.eventContainer}>
              <View style={styles.eventNumber}>
                <Text style={styles.eventNumberText}>{index + 1}</Text>
              </View>
              
              <View style={styles.eventContent}>
                <Text style={styles.eventText}>{event.text}</Text>
              </View>
              
              <View style={styles.eventControls}>
                <Pressable
                  style={[styles.moveButton, index === 0 && styles.moveButtonDisabled]}
                  onPress={() => moveEvent(event.id, 'up')}
                  disabled={index === 0}
                >
                  <Text style={styles.moveButtonText}>↑</Text>
                </Pressable>
                <Pressable
                  style={[styles.moveButton, index === events.length - 1 && styles.moveButtonDisabled]}
                  onPress={() => moveEvent(event.id, 'down')}
                  disabled={index === events.length - 1}
                >
                  <Text style={styles.moveButtonText}>↓</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable style={styles.resetButton} onPress={resetOrder}>
            <RotateCcw size={16} color="#6B7280" />
            <Text style={styles.resetButtonText}>Reset Order</Text>
          </Pressable>
          
          <Pressable style={styles.checkButton} onPress={checkOrder}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.checkGradient}
            >
              <Target size={20} color="#FFFFFF" />
              <Text style={styles.checkButtonText}>Check Order</Text>
            </LinearGradient>
          </Pressable>
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
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },
  challengeInfo: {
    alignItems: 'flex-end',
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  challengeNumber: {
    fontSize: 12,
    color: '#6B7280',
  },
  gameContent: {
    flex: 1,
    padding: 20,
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  instructionsText: {
    flex: 1,
    fontSize: 15,
    color: '#1E40AF',
    lineHeight: 22,
  },
  timelineContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  eventContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  eventNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  eventContent: {
    flex: 1,
    marginRight: 12,
  },
  eventText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  eventControls: {
    gap: 4,
  },
  moveButton: {
    width: 32,
    height: 32,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moveButtonDisabled: {
    opacity: 0.3,
  },
  moveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  checkButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  checkGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  checkButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
  },
});