import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Clock, Star, Search, Target, Lightbulb } from 'lucide-react-native';

interface WordSearchGame {
  id: string;
  theme: string;
  grid: string[][];
  words: Array<{
    word: string;
    found: boolean;
    positions: Array<{ row: number; col: number }>;
  }>;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function WordSearchScreen() {
  const [currentGame, setCurrentGame] = useState<WordSearchGame | null>(null);
  const [selectedCells, setSelectedCells] = useState<Array<{ row: number; col: number }>>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes
  const [showHint, setShowHint] = useState(false);

  const generateWordSearch = (theme: string): WordSearchGame => {
    const wordLists: { [key: string]: string[] } = {
      'characters': ['MOSES', 'DAVID', 'ESTHER', 'JONAH', 'ELIJAH', 'RUTH'],
      'places': ['JERUSALEM', 'BETHLEHEM', 'NAZARETH', 'JORDAN', 'SINAI'],
      'virtues': ['FAITH', 'HOPE', 'LOVE', 'PEACE', 'JOY', 'GRACE']
    };

    const words = wordLists[theme] || wordLists['characters'];
    const gridSize = 12;
    const grid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

    // Place words in grid (simplified - horizontal only)
    const placedWords = words.slice(0, 6).map(word => {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * (gridSize - word.length));
      
      const positions = [];
      for (let i = 0; i < word.length; i++) {
        grid[row][col + i] = word[i];
        positions.push({ row, col: col + i });
      }

      return {
        word,
        found: false,
        positions
      };
    });

    // Fill empty cells with random letters
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (!grid[row][col]) {
          grid[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    return {
      id: `wordsearch-${theme}`,
      theme,
      grid,
      words: placedWords,
      difficulty: 'medium'
    };
  };

  useEffect(() => {
    const game = generateWordSearch('characters');
    setCurrentGame(game);
  }, []);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      Alert.alert('Time\'s Up!', 'The word search challenge has ended.');
    }
  }, [timeRemaining]);

  const selectCell = (row: number, col: number) => {
    const cellKey = `${row}-${col}`;
    const isSelected = selectedCells.some(cell => cell.row === row && cell.col === col);

    if (isSelected) {
      // Deselect cell
      setSelectedCells(prev => prev.filter(cell => !(cell.row === row && cell.col === col)));
    } else {
      // Select cell
      setSelectedCells(prev => [...prev, { row, col }]);
    }
  };

  const checkSelectedWord = () => {
    if (!currentGame || selectedCells.length === 0) return;

    // Check if selected cells form a word
    const selectedWord = selectedCells
      .sort((a, b) => a.row - b.row || a.col - b.col)
      .map(cell => currentGame.grid[cell.row][cell.col])
      .join('');

    const foundWord = currentGame.words.find(w => 
      w.word === selectedWord && !foundWords.includes(w.word)
    );

    if (foundWord) {
      // Word found!
      setFoundWords(prev => [...prev, foundWord.word]);
      const points = calculatePoints(foundWord.word.length, currentGame.difficulty);
      setScore(prev => prev + points);
      
      Alert.alert('Word Found!', `${foundWord.word} - +${points} points`);
      
      // Check if all words found
      if (foundWords.length + 1 === currentGame.words.length) {
        const bonusPoints = Math.floor(timeRemaining / 10);
        setScore(prev => prev + bonusPoints);
        
        Alert.alert(
          'Puzzle Complete!',
          `All words found! Time bonus: +${bonusPoints} points\nFinal score: ${score + points + bonusPoints}`,
          [
            { text: 'New Puzzle', onPress: () => newPuzzle() },
            { text: 'Back to Games', onPress: () => router.back() }
          ]
        );
      }
    } else {
      Alert.alert('Not a Word', 'The selected letters don\'t form a valid word.');
    }

    // Clear selection
    setSelectedCells([]);
  };

  const calculatePoints = (wordLength: number, difficulty: string): number => {
    let basePoints = wordLength * 2;
    
    switch (difficulty) {
      case 'easy': basePoints *= 1; break;
      case 'medium': basePoints *= 1.5; break;
      case 'hard': basePoints *= 2; break;
    }

    return Math.floor(basePoints);
  };

  const newPuzzle = () => {
    const themes = ['characters', 'places', 'virtues'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const game = generateWordSearch(randomTheme);
    setCurrentGame(game);
    setFoundWords([]);
    setSelectedCells([]);
    setTimeRemaining(900);
  };

  const getHint = () => {
    if (!currentGame) return;

    const unFoundWords = currentGame.words.filter(w => !foundWords.includes(w.word));
    if (unFoundWords.length === 0) return;

    const randomWord = unFoundWords[Math.floor(Math.random() * unFoundWords.length)];
    const firstPosition = randomWord.positions[0];
    
    Alert.alert(
      'Hint',
      `Look for "${randomWord.word}" starting at row ${firstPosition.row + 1}, column ${firstPosition.col + 1}`
    );
    
    setShowHint(true);
    setTimeout(() => setShowHint(false), 3000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentGame) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Generating word search...</Text>
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
        <Text style={styles.headerTitle}>Bible Word Search</Text>
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
        <View style={styles.themeInfo}>
          <Text style={styles.themeText}>Theme: {currentGame.theme}</Text>
          <Text style={styles.progressText}>
            {foundWords.length} / {currentGame.words.length} words found
          </Text>
        </View>
      </View>

      <ScrollView style={styles.gameContent} showsVerticalScrollIndicator={false}>
        {/* Word List */}
        <View style={styles.wordListContainer}>
          <Text style={styles.wordListTitle}>Find These Words:</Text>
          <View style={styles.wordList}>
            {currentGame.words.map(wordObj => (
              <View
                key={wordObj.word}
                style={[
                  styles.wordItem,
                  foundWords.includes(wordObj.word) && styles.wordItemFound
                ]}
              >
                <Text style={[
                  styles.wordText,
                  foundWords.includes(wordObj.word) && styles.wordTextFound
                ]}>
                  {wordObj.word}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Word Search Grid */}
        <View style={styles.gridContainer}>
          {currentGame.grid.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.gridRow}>
              {row.map((letter, colIndex) => {
                const isSelected = selectedCells.some(cell => 
                  cell.row === rowIndex && cell.col === colIndex
                );
                const isPartOfFoundWord = currentGame.words.some(wordObj =>
                  foundWords.includes(wordObj.word) &&
                  wordObj.positions.some(pos => pos.row === rowIndex && pos.col === colIndex)
                );

                return (
                  <Pressable
                    key={`${rowIndex}-${colIndex}`}
                    style={[
                      styles.gridCell,
                      isSelected && styles.gridCellSelected,
                      isPartOfFoundWord && styles.gridCellFound
                    ]}
                    onPress={() => selectCell(rowIndex, colIndex)}
                  >
                    <Text style={[
                      styles.gridCellText,
                      isSelected && styles.gridCellTextSelected,
                      isPartOfFoundWord && styles.gridCellTextFound
                    ]}>
                      {letter}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable style={styles.hintButton} onPress={getHint}>
            <Lightbulb size={16} color="#F59E0B" />
            <Text style={styles.hintButtonText}>Get Hint</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.checkButton, selectedCells.length === 0 && styles.checkButtonDisabled]}
            onPress={checkSelectedWord}
            disabled={selectedCells.length === 0}
          >
            <LinearGradient
              colors={['#3B82F6', '#1D4ED8']}
              style={styles.checkGradient}
            >
              <Target size={20} color="#FFFFFF" />
              <Text style={styles.checkButtonText}>Check Word</Text>
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
  themeInfo: {
    alignItems: 'flex-end',
  },
  themeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textTransform: 'capitalize',
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  gameContent: {
    flex: 1,
    padding: 20,
  },
  wordListContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  wordListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  wordList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  wordItem: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  wordItemFound: {
    backgroundColor: '#ECFDF5',
  },
  wordText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  wordTextFound: {
    color: '#10B981',
    textDecorationLine: 'line-through',
  },
  gridContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    width: 24,
    height: 24,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCellSelected: {
    backgroundColor: '#EBF5FF',
    borderColor: '#3B82F6',
  },
  gridCellFound: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  gridCellText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  gridCellTextSelected: {
    color: '#3B82F6',
  },
  gridCellTextFound: {
    color: '#10B981',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  hintButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  hintButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F59E0B',
  },
  checkButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  checkButtonDisabled: {
    opacity: 0.5,
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