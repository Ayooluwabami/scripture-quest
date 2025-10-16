import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { BookOpen, CircleCheck as CheckCircle, Circle as XCircle, Lightbulb } from 'lucide-react-native';

interface VerseInputProps {
  verse: {
    reference: string;
    text: string;
    blanks: string[];
  };
  onComplete: (answers: string[]) => void;
  showHints?: boolean;
  hints?: string[];
}

export default function VerseInput({ verse, onComplete, showHints = false, hints = [] }: VerseInputProps) {
  const [answers, setAnswers] = useState<string[]>(new Array(verse.blanks.length).fill(''));
  const [currentBlank, setCurrentBlank] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ index: number; correct: boolean } | null>(null);

  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const checkAnswer = (index: number) => {
    const isCorrect = answers[index].toLowerCase().trim() === verse.blanks[index].toLowerCase();
    setFeedback({ index, correct: isCorrect });
    
    setTimeout(() => {
      setFeedback(null);
      if (isCorrect && index < verse.blanks.length - 1) {
        setCurrentBlank(index + 1);
      } else if (isCorrect && index === verse.blanks.length - 1) {
        // All blanks completed
        onComplete(answers);
      }
    }, 1500);
  };

  const renderVerseWithBlanks = () => {
    const parts = verse.text.split('___');
    const result = [];

    for (let i = 0; i < parts.length; i++) {
      result.push(
        <Text key={`text-${i}`} style={styles.verseText}>
          {parts[i]}
        </Text>
      );

      if (i < verse.blanks.length) {
        result.push(
          <View key={`blank-${i}`} style={styles.blankContainer}>
            <TextInput
              style={[
                styles.blankInput,
                currentBlank === i && styles.blankInputActive,
                feedback?.index === i && (feedback.correct ? styles.blankInputCorrect : styles.blankInputIncorrect)
              ]}
              value={answers[i]}
              onChangeText={(value) => updateAnswer(i, value)}
              onFocus={() => setCurrentBlank(i)}
              placeholder="___"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {feedback?.index === i && (
              <View style={styles.feedbackIcon}>
                {feedback.correct ? (
                  <CheckCircle size={16} color="#10B981" />
                ) : (
                  <XCircle size={16} color="#EF4444" />
                )}
              </View>
            )}
          </View>
        );
      }
    }

    return result;
  };

  return (
    <View style={styles.container}>
      {/* Verse Header */}
      <View style={styles.header}>
        <BookOpen size={20} color="#3B82F6" />
        <Text style={styles.reference}>{verse.reference}</Text>
      </View>

      {/* Verse with Blanks */}
      <View style={styles.verseContainer}>
        <View style={styles.verseContent}>
          {renderVerseWithBlanks()}
        </View>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Progress: {answers.filter(a => a.trim()).length} / {verse.blanks.length}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(answers.filter(a => a.trim()).length / verse.blanks.length) * 100}%` }
            ]} 
          />
        </View>
      </View>

      {/* Hint Section */}
      {showHints && hints.length > 0 && (
        <View style={styles.hintSection}>
          <Pressable style={styles.hintButton} onPress={() => setShowHint(!showHint)}>
            <Lightbulb size={16} color="#F59E0B" />
            <Text style={styles.hintButtonText}>
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Text>
          </Pressable>
          
          {showHint && currentBlank < hints.length && (
            <View style={styles.hintDisplay}>
              <Text style={styles.hintText}>
                💡 {hints[currentBlank]}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Check Answer Button */}
      <Pressable 
        style={[
          styles.checkButton,
          !answers[currentBlank]?.trim() && styles.checkButtonDisabled
        ]}
        onPress={() => checkAnswer(currentBlank)}
        disabled={!answers[currentBlank]?.trim()}
      >
        <Text style={styles.checkButtonText}>Check Answer</Text>
      </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  reference: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  verseContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  verseContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  verseText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
  blankContainer: {
    position: 'relative',
    marginHorizontal: 4,
  },
  blankInput: {
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 60,
    textAlign: 'center',
    fontSize: 16,
    color: '#1F2937',
  },
  blankInputActive: {
    borderBottomColor: '#3B82F6',
  },
  blankInputCorrect: {
    borderBottomColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  blankInputIncorrect: {
    borderBottomColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  feedbackIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  hintSection: {
    marginBottom: 16,
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
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  hintText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  checkButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkButtonDisabled: {
    opacity: 0.5,
  },
  checkButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});