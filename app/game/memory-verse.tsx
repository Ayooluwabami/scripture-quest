import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Clock, Star, BookOpen, Target, Lightbulb, Volume2 } from 'lucide-react-native';

interface MemoryVerse {
  id: string;
  reference: string;
  fullText: string;
  blanks: string[];
  displayText: string;
  hints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function MemoryVerseScreen() {
  const [currentVerse, setCurrentVerse] = useState<MemoryVerse | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentBlank, setCurrentBlank] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [verseIndex, setVerseIndex] = useState(0);

  const verses: MemoryVerse[] = [
    {
      id: '1',
      reference: 'Psalm 23:1',
      fullText: 'The Lord is my shepherd; I shall not want.',
      blanks: ['shepherd', 'want'],
      displayText: 'The Lord is my ___; I shall not ___.',
      hints: ['One who guides sheep', 'To lack or need'],
      difficulty: 'easy'
    },
    {
      id: '2',
      reference: 'John 14:6',
      fullText: 'Jesus said, "I am the way, the truth, and the life."',
      blanks: ['way', 'truth', 'life'],
      displayText: 'Jesus said, "I am the ___, the ___, and the ___."',
      hints: ['Path or road', 'Opposite of lie', 'Opposite of death'],
      difficulty: 'medium'
    },
    {
      id: '3',
      reference: 'Jeremiah 29:11',
      fullText: 'For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you.',
      blanks: ['plans', 'prosper', 'harm'],
      displayText: 'For I know the ___ I have for you," declares the Lord, "___ to ___ you and not to ___ you.',
      hints: ['God\'s intentions', 'To succeed or flourish', 'To hurt or damage'],
      difficulty: 'hard'
    }
  ];

  useEffect(() => {
    const verse = verses[verseIndex];
    setCurrentVerse(verse);
    setAnswers(new Array(verse.blanks.length).fill(''));
    setCurrentBlank(0);
  }, [verseIndex]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      Alert.alert('Time\'s Up!', 'The memory verse challenge has ended.');
    }
  }, [timeRemaining]);

  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const checkAnswer = (index: number) => {
    if (!currentVerse) return;

    const isCorrect = answers[index].toLowerCase().trim() === currentVerse.blanks[index].toLowerCase();
    
    if (isCorrect) {
      const points = calculatePoints(currentVerse.difficulty, timeRemaining, hintsUsed);
      setScore(prev => prev + points);
      
      Alert.alert('Correct!', `+${points} points`, [
        {
          text: 'Continue',
          onPress: () => {
            if (index < currentVerse.blanks.length - 1) {
              setCurrentBlank(index + 1);
            } else {
              // Verse completed
              completeVerse();
            }
          }
        }
      ]);
    } else {
      Alert.alert('Try Again', `The correct word is "${currentVerse.blanks[index]}"`);
    }
  };

  const completeVerse = () => {
    if (!currentVerse) return;

    Alert.alert(
      'Verse Completed!',
      `You've successfully memorized ${currentVerse.reference}!`,
      [
        {
          text: 'Next Verse',
          onPress: () => {
            if (verseIndex < verses.length - 1) {
              setVerseIndex(prev => prev + 1);
              setHintsUsed(0);
              setShowHint(false);
            } else {
              // All verses completed
              Alert.alert(
                'Challenge Complete!',
                `Congratulations! Final score: ${score} points`,
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
  };

  const calculatePoints = (difficulty: string, timeLeft: number, hints: number): number => {
    let basePoints = 15;
    switch (difficulty) {
      case 'easy': basePoints = 15; break;
      case 'medium': basePoints = 20; break;
      case 'hard': basePoints = 25; break;
    }

    // Time bonus
    const timeBonus = Math.floor(basePoints * 0.2 * (timeLeft / 300));
    
    // Hint penalty
    const hintPenalty = hints * 2;
    
    return Math.max(basePoints + timeBonus - hintPenalty, 5);
  };

  const useHint = () => {
    if (!currentVerse || hintsUsed >= currentVerse.hints.length) {
      Alert.alert('No more hints', 'No additional hints available for this verse.');
      return;
    }

    setShowHint(true);
    setHintsUsed(prev => prev + 1);
  };

  const resetGame = () => {
    setVerseIndex(0);
    setScore(0);
    setTimeRemaining(300);
    setHintsUsed(0);
    setShowHint(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderVerseWithBlanks = () => {
    if (!currentVerse) return null;

    const parts = currentVerse.displayText.split('___');
    const result = [];

    for (let i = 0; i < parts.length; i++) {
      result.push(
        <Text key={`text-${i}`} style={styles.verseText}>
          {parts[i]}
        </Text>
      );

      if (i < currentVerse.blanks.length) {
        result.push(
          <View key={`blank-${i}`} style={styles.blankContainer}>
            <TextInput
              style={[
                styles.blankInput,
                currentBlank === i && styles.blankInputActive
              ]}
              value={answers[i]}
              onChangeText={(value) => updateAnswer(i, value)}
              onFocus={() => setCurrentBlank(i)}
              placeholder="___"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        );
      }
    }

    return result;
  };

  if (!currentVerse) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading verse...</Text>
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
        <Text style={styles.headerTitle}>Memory Verse Challenge</Text>
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
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            Verse {verseIndex + 1} of {verses.length}
          </Text>
          <Text style={styles.difficultyText}>{currentVerse.difficulty}</Text>
        </View>
      </View>

      <ScrollView style={styles.gameContent} showsVerticalScrollIndicator={false}>
        {/* Verse Reference */}
        <View style={styles.referenceContainer}>
          <BookOpen size={20} color="#3B82F6" />
          <Text style={styles.referenceText}>{currentVerse.reference}</Text>
          <Pressable style={styles.audioButton}>
            <Volume2 size={16} color="#6B7280" />
          </Pressable>
        </View>

        {/* Verse with Blanks */}
        <View style={styles.verseContainer}>
          <View style={styles.verseContent}>
            {renderVerseWithBlanks()}
          </View>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressIndicator}>
          <Text style={styles.progressLabel}>
            Progress: {answers.filter(a => a.trim()).length} / {currentVerse.blanks.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(answers.filter(a => a.trim()).length / currentVerse.blanks.length) * 100}%` }
              ]} 
            />
          </View>
        </View>

        {/* Hint Section */}
        <View style={styles.hintContainer}>
          <Pressable style={styles.hintButton} onPress={useHint}>
            <Lightbulb size={16} color="#F59E0B" />
            <Text style={styles.hintButtonText}>
              Use Hint ({hintsUsed}/{currentVerse.hints.length})
            </Text>
          </Pressable>
          
          {showHint && hintsUsed > 0 && currentBlank < currentVerse.hints.length && (
            <View style={styles.hintDisplay}>
              <Text style={styles.hintText}>
                💡 {currentVerse.hints[currentBlank]}
              </Text>
            </View>
          )}
        </View>

        {/* Check Answer Button */}
        <Pressable 
          style={[
            styles.checkButton,
            !answers[currentBlank]?.trim() && styles.checkButtonDisabled
          ]}
          onPress={() => checkAnswer(currentBlank)}
          disabled={!answers[currentBlank]?.trim()}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.checkGradient}
          >
            <Target size={20} color="#FFFFFF" />
            <Text style={styles.checkButtonText}>Check Answer</Text>
          </LinearGradient>
        </Pressable>
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
  progressInfo: {
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  difficultyText: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  gameContent: {
    flex: 1,
    padding: 20,
  },
  referenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  referenceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3B82F6',
  },
  audioButton: {
    padding: 4,
  },
  verseContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  verseContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseText: {
    fontSize: 18,
    color: '#1F2937',
    lineHeight: 28,
    textAlign: 'center',
  },
  blankContainer: {
    marginHorizontal: 4,
    marginVertical: 2,
  },
  blankInput: {
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 80,
    textAlign: 'center',
    fontSize: 18,
    color: '#1F2937',
    fontWeight: '500',
  },
  blankInputActive: {
    borderBottomColor: '#3B82F6',
    backgroundColor: '#EBF5FF',
  },
  progressIndicator: {
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  hintContainer: {
    marginBottom: 24,
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  hintButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F59E0B',
  },
  hintDisplay: {
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  hintText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
    textAlign: 'center',
  },
  checkButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  checkButtonDisabled: {
    opacity: 0.5,
  },
  checkGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
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