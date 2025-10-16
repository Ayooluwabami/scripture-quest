import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Image, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Clock, Star, Target, Lightbulb, CircleCheck as CheckCircle } from 'lucide-react-native';

interface FourPicturesPuzzle {
  id: string;
  images: string[];
  answer: string;
  hints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  theme: string;
}

export default function FourPicturesScreen() {
  const [currentPuzzle, setCurrentPuzzle] = useState<FourPicturesPuzzle | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | null; message: string }>({ type: null, message: '' });
  const [puzzleIndex, setPuzzleIndex] = useState(0);

  const puzzles: FourPicturesPuzzle[] = [
    {
      id: '1',
      images: [
        'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg', // Cross
        'https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg', // Crown
        'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',  // Lamb
        'https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg'  // Shepherd
      ],
      answer: 'Jesus',
      hints: ['Son of God', 'Savior of the world', 'The Good Shepherd'],
      difficulty: 'easy',
      theme: 'Characters'
    },
    {
      id: '2',
      images: [
        'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg', // Basket
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', // River
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg', // Baby
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'  // Princess
      ],
      answer: 'Moses',
      hints: ['Led Israelites out of Egypt', 'Received the Ten Commandments', 'Found in a basket'],
      difficulty: 'medium',
      theme: 'Characters'
    },
    {
      id: '3',
      images: [
        'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg', // Dove
        'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg', // Water
        'https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg', // Fire
        'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg'  // Wind
      ],
      answer: 'Holy Spirit',
      hints: ['Third person of the Trinity', 'Descended like a dove', 'Comforter and Guide'],
      difficulty: 'hard',
      theme: 'Theology'
    }
  ];

  useEffect(() => {
    setCurrentPuzzle(puzzles[puzzleIndex]);
  }, [puzzleIndex]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      Alert.alert('Time\'s Up!', 'The game has ended. Let\'s see your final score!');
    }
  }, [timeRemaining]);

  const submitAnswer = () => {
    if (!currentPuzzle || !userAnswer.trim()) {
      Alert.alert('Please enter an answer', 'Type your guess before submitting.');
      return;
    }

    const isCorrect = userAnswer.toLowerCase().trim() === currentPuzzle.answer.toLowerCase();
    const points = calculatePoints(isCorrect, currentPuzzle.difficulty, timeRemaining, hintsUsed);

    setFeedback({
      type: isCorrect ? 'correct' : 'incorrect',
      message: isCorrect ? 
        `Correct! +${points} points` : 
        `Incorrect. The answer was: ${currentPuzzle.answer}`
    });

    if (isCorrect) {
      setScore(prev => prev + points);
    }

    setTimeout(() => {
      if (puzzleIndex < puzzles.length - 1) {
        // Next puzzle
        setPuzzleIndex(prev => prev + 1);
        setUserAnswer('');
        setHintsUsed(0);
        setShowHint(false);
        setFeedback({ type: null, message: '' });
      } else {
        // Game complete
        Alert.alert(
          'Game Complete!',
          `Congratulations! You scored ${score + (isCorrect ? points : 0)} points.`,
          [
            { text: 'Play Again', onPress: () => resetGame() },
            { text: 'Back to Games', onPress: () => router.back() }
          ]
        );
      }
    }, 2000);
  };

  const calculatePoints = (isCorrect: boolean, difficulty: string, timeLeft: number, hints: number): number => {
    if (!isCorrect) return 0;
    
    let basePoints = 10;
    switch (difficulty) {
      case 'easy': basePoints = 10; break;
      case 'medium': basePoints = 15; break;
      case 'hard': basePoints = 20; break;
    }

    // Time bonus
    const timeBonus = Math.floor(basePoints * 0.3 * (timeLeft / 300));
    
    // Hint penalty
    const hintPenalty = hints * 3;
    
    return Math.max(basePoints + timeBonus - hintPenalty, 1);
  };

  const useHint = () => {
    if (!currentPuzzle || hintsUsed >= currentPuzzle.hints.length) {
      Alert.alert('No more hints', 'No additional hints available for this puzzle.');
      return;
    }

    setShowHint(true);
    setHintsUsed(prev => prev + 1);
  };

  const resetGame = () => {
    setPuzzleIndex(0);
    setScore(0);
    setTimeRemaining(300);
    setUserAnswer('');
    setHintsUsed(0);
    setShowHint(false);
    setFeedback({ type: null, message: '' });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentPuzzle) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading puzzle...</Text>
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
        <Text style={styles.headerTitle}>Four Pictures One Word</Text>
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
            Puzzle {puzzleIndex + 1} of {puzzles.length}
          </Text>
          <Text style={styles.themeText}>{currentPuzzle.theme}</Text>
        </View>
      </View>

      <ScrollView style={styles.gameContent} showsVerticalScrollIndicator={false}>
        {/* Images Grid */}
        <View style={styles.imagesContainer}>
          <View style={styles.imagesGrid}>
            {currentPuzzle.images.map((imageUrl, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.puzzleImage} />
                <View style={styles.imageNumber}>
                  <Text style={styles.imageNumberText}>{index + 1}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Answer Input */}
        <View style={styles.answerContainer}>
          <Text style={styles.answerLabel}>What do these four pictures have in common?</Text>
          <View style={styles.answerInputContainer}>
            <TextInput
              style={styles.answerInput}
              placeholder="Enter your answer..."
              value={userAnswer}
              onChangeText={setUserAnswer}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Hint Section */}
        <View style={styles.hintContainer}>
          <Pressable style={styles.hintButton} onPress={useHint}>
            <Lightbulb size={16} color="#F59E0B" />
            <Text style={styles.hintButtonText}>
              Use Hint ({hintsUsed}/{currentPuzzle.hints.length})
            </Text>
          </Pressable>
          
          {showHint && hintsUsed > 0 && (
            <View style={styles.hintDisplay}>
              <Text style={styles.hintText}>
                💡 {currentPuzzle.hints[hintsUsed - 1]}
              </Text>
            </View>
          )}
        </View>

        {/* Feedback */}
        {feedback.type && (
          <View style={[
            styles.feedbackContainer,
            feedback.type === 'correct' ? styles.correctFeedback : styles.incorrectFeedback
          ]}>
            <CheckCircle size={20} color={feedback.type === 'correct' ? '#10B981' : '#EF4444'} />
            <Text style={[
              styles.feedbackText,
              { color: feedback.type === 'correct' ? '#10B981' : '#EF4444' }
            ]}>
              {feedback.message}
            </Text>
          </View>
        )}

        {/* Submit Button */}
        <Pressable 
          style={[styles.submitButton, !userAnswer.trim() && styles.submitButtonDisabled]}
          onPress={submitAnswer}
          disabled={!userAnswer.trim()}
        >
          <LinearGradient
            colors={['#3B82F6', '#1D4ED8']}
            style={styles.submitGradient}
          >
            <Target size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Submit Answer</Text>
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
  themeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  gameContent: {
    flex: 1,
    padding: 20,
  },
  imagesContainer: {
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
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageContainer: {
    width: '48%',
    aspectRatio: 1,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  puzzleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageNumber: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  answerContainer: {
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
  answerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  answerInputContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  answerInput: {
    padding: 16,
    fontSize: 18,
    color: '#1F2937',
    textAlign: 'center',
    fontWeight: '500',
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
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  correctFeedback: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  incorrectFeedback: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  submitButtonText: {
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