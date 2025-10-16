import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Heart, Star, ArrowLeft, CircleCheck as CheckCircle, Circle as XCircle, Lightbulb, Target } from 'lucide-react-native';
import { TextInput } from 'react-native';

interface Question {
  id: string;
  text: string;
  type: string;
  options?: string[];
  reference?: string;
  hints?: string[];
}

interface GameSession {
  id: string;
  gameId: string;
  currentQuestion: number;
  questions: Question[];
  timeRemaining: number;
  score: number;
  status: 'playing' | 'finished';
}

export default function GamePlayScreen() {
  const { gameId } = useLocalSearchParams();
  const [session, setSession] = useState<GameSession | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | null; message: string }>({ type: null, message: '' });

  useEffect(() => {
    initializeGame();
  }, [gameId]);

  useEffect(() => {
    if (session && session.timeRemaining > 0 && session.status === 'playing') {
      const timer = setInterval(() => {
        setSession(prev => prev ? { ...prev, timeRemaining: prev.timeRemaining - 1 } : null);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [session]);

  const initializeGame = async () => {
    try {
      setIsLoading(true);
      
      // Mock game session creation
      const mockSession: GameSession = {
        id: `session_${Date.now()}`,
        gameId: gameId as string,
        currentQuestion: 0,
        questions: [
          {
            id: '1',
            text: 'Who was the mother of Moses?',
            type: 'multiple-choice',
            options: ['Jochebed', 'Miriam', 'Zipporah', 'Deborah'],
            reference: 'Numbers 26:59',
            hints: ['She was from the tribe of Levi', 'She hid Moses for three months']
          },
          {
            id: '2',
            text: 'Complete the verse: "The Lord is my light and my salvation—whom shall I ___?"',
            type: 'fill-in',
            reference: 'Psalm 27:1',
            hints: ['This word expresses being afraid', 'Opposite of courage']
          },
          {
            id: '3',
            text: 'I am an enemy of faith. I make people doubt God\'s promises. Who am I?',
            type: 'open-ended',
            reference: 'Rescue Mission',
            hints: ['I am the opposite of belief', 'I make people question']
          }
        ],
        timeRemaining: 600, // 10 minutes
        score: 0,
        status: 'playing'
      };

      setSession(mockSession);
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing game:', error);
      Alert.alert('Error', 'Failed to start game. Please try again.');
      router.back();
    }
  };

  const submitAnswer = async () => {
    if (!session) return;

    const currentQuestion = session.questions[session.currentQuestion];
    const answer = currentQuestion.type === 'multiple-choice' ? selectedOption : currentAnswer;

    if (!answer) {
      Alert.alert('Please provide an answer', 'Select an option or enter your answer before submitting.');
      return;
    }

    try {
      // Mock answer checking
      const isCorrect = checkAnswer(currentQuestion, answer);
      const points = calculatePoints(isCorrect, session.timeRemaining, hintsUsed);

      setFeedback({
        type: isCorrect ? 'correct' : 'incorrect',
        message: isCorrect ? 
          `Correct! +${points} points` : 
          `Incorrect. The answer was: ${getCorrectAnswer(currentQuestion)}`
      });

      // Update session
      const updatedSession = {
        ...session,
        score: session.score + points,
        currentQuestion: session.currentQuestion + 1
      };

      if (updatedSession.currentQuestion >= session.questions.length) {
        updatedSession.status = 'finished' as const;
      }

      setSession(updatedSession);

      // Reset for next question
      setTimeout(() => {
        setCurrentAnswer('');
        setSelectedOption(null);
        setShowHint(false);
        setFeedback({ type: null, message: '' });
        
        if (updatedSession.status === 'finished') {
          showGameComplete(updatedSession.score);
        }
      }, 2000);

    } catch (error) {
      console.error('Error submitting answer:', error);
      Alert.alert('Error', 'Failed to submit answer. Please try again.');
    }
  };

  const checkAnswer = (question: Question, answer: string): boolean => {
    // Mock answer checking logic
    const correctAnswers: { [key: string]: string } = {
      '1': 'Jochebed',
      '2': 'fear',
      '3': 'Doubt'
    };

    const correct = correctAnswers[question.id];
    return answer.toLowerCase().trim() === correct.toLowerCase();
  };

  const getCorrectAnswer = (question: Question): string => {
    const correctAnswers: { [key: string]: string } = {
      '1': 'Jochebed',
      '2': 'fear',
      '3': 'Doubt'
    };
    return correctAnswers[question.id] || 'Unknown';
  };

  const calculatePoints = (isCorrect: boolean, timeRemaining: number, hintsUsed: number): number => {
    if (!isCorrect) return 0;
    
    let points = 10;
    
    // Time bonus
    if (timeRemaining > 540) points += 5; // Quick answer bonus
    
    // Hint penalty
    points -= hintsUsed * 2;
    
    return Math.max(points, 1);
  };

  const useHint = () => {
    if (!session) return;
    
    const currentQuestion = session.questions[session.currentQuestion];
    if (!currentQuestion.hints || hintsUsed >= currentQuestion.hints.length) {
      Alert.alert('No more hints', 'No additional hints available for this question.');
      return;
    }

    setShowHint(true);
    setHintsUsed(prev => prev + 1);
  };

  const showGameComplete = (finalScore: number) => {
    Alert.alert(
      'Game Complete!',
      `Congratulations! You scored ${finalScore} points.`,
      [
        { text: 'Play Again', onPress: () => initializeGame() },
        { text: 'Back to Games', onPress: () => router.back() }
      ]
    );
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading game...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load game</Text>
          <Pressable style={styles.retryButton} onPress={initializeGame}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (session.status === 'finished') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completedContainer}>
          <CheckCircle size={64} color="#10B981" />
          <Text style={styles.completedTitle}>Game Complete!</Text>
          <Text style={styles.completedScore}>Final Score: {session.score} points</Text>
          <View style={styles.completedActions}>
            <Pressable style={styles.playAgainButton} onPress={initializeGame}>
              <Text style={styles.playAgainButtonText}>Play Again</Text>
            </Pressable>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>Back to Games</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = session.questions[session.currentQuestion];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.questionCounter}>
            {session.currentQuestion + 1} of {session.questions.length}
          </Text>
          <View style={styles.scoreContainer}>
            <Star size={16} color="#F59E0B" />
            <Text style={styles.scoreText}>{session.score}</Text>
          </View>
        </View>
      </View>

      {/* Timer and Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.timerContainer}>
          <Clock size={16} color="#EF4444" />
          <Text style={styles.timerText}>{formatTime(session.timeRemaining)}</Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((session.currentQuestion + 1) / session.questions.length) * 100}%` }
            ]} 
          />
        </View>
      </View>

      <ScrollView style={styles.gameContent} showsVerticalScrollIndicator={false}>
        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
          {currentQuestion.reference && (
            <Text style={styles.referenceText}>{currentQuestion.reference}</Text>
          )}
        </View>

        {/* Answer Input */}
        <View style={styles.answerContainer}>
          {currentQuestion.type === 'multiple-choice' ? (
            <View style={styles.optionsContainer}>
              {currentQuestion.options?.map((option, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedOption === option && styles.selectedOption
                  ]}
                  onPress={() => setSelectedOption(option)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedOption === option && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your answer..."
                value={currentAnswer}
                onChangeText={setCurrentAnswer}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          )}
        </View>

        {/* Hint Section */}
        {currentQuestion.hints && currentQuestion.hints.length > 0 && (
          <View style={styles.hintContainer}>
            <Pressable style={styles.hintButton} onPress={useHint}>
              <Lightbulb size={16} color="#F59E0B" />
              <Text style={styles.hintButtonText}>
                Use Hint ({hintsUsed}/{currentQuestion.hints.length})
              </Text>
            </Pressable>
            
            {showHint && hintsUsed > 0 && (
              <View style={styles.hintDisplay}>
                <Text style={styles.hintText}>
                  💡 {currentQuestion.hints[hintsUsed - 1]}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Feedback */}
        {feedback.type && (
          <View style={[
            styles.feedbackContainer,
            feedback.type === 'correct' ? styles.correctFeedback : styles.incorrectFeedback
          ]}>
            {feedback.type === 'correct' ? (
              <CheckCircle size={20} color="#10B981" />
            ) : (
              <XCircle size={20} color="#EF4444" />
            )}
            <Text style={[
              styles.feedbackText,
              feedback.type === 'correct' ? styles.correctText : styles.incorrectText
            ]}>
              {feedback.message}
            </Text>
          </View>
        )}

        {/* Submit Button */}
        <Pressable 
          style={[
            styles.submitButton,
            (!currentAnswer && !selectedOption) && styles.submitButtonDisabled
          ]}
          onPress={submitAnswer}
          disabled={!currentAnswer && !selectedOption}
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
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionCounter: {
    fontSize: 16,
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 6,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EF4444',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  gameContent: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 26,
    marginBottom: 8,
  },
  referenceText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  answerContainer: {
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF5FF',
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  textInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  textInput: {
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 56,
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
  correctText: {
    color: '#10B981',
  },
  incorrectText: {
    color: '#EF4444',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  completedScore: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 32,
  },
  completedActions: {
    gap: 12,
    width: '100%',
  },
  playAgainButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  playAgainButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});