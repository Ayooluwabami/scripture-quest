export interface GameQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'open-ended' | 'fill-in' | 'drawing' | 'ordering' | 'audio' | 'matching' | 'true-false';
  answer: string | string[];
  options?: string[];
  reference?: string;
  hints?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameSession {
  id: string;
  gameId: string;
  gameType: string;
  players: string[];
  currentQuestion: number;
  questions: GameQuestion[];
  scores: { [playerId: string]: number };
  timeRemaining: number;
  status: 'waiting' | 'playing' | 'finished';
  settings: {
    allowHints: boolean;
    hintCost: number;
    timeLimit: number;
  };
}

export class GameLogic {
  /**
   * Check if an answer is correct
   */
  static checkAnswer(question: GameQuestion, userAnswer: string | string[]): boolean {
    const correctAnswer = question.answer;
    
    if (Array.isArray(correctAnswer)) {
      if (Array.isArray(userAnswer)) {
        return correctAnswer.every(ans => 
          userAnswer.some(userAns => 
            userAns.toLowerCase().trim() === ans.toLowerCase().trim()
          )
        );
      } else {
        return correctAnswer.some(ans => 
          ans.toLowerCase().trim() === userAnswer.toLowerCase().trim()
        );
      }
    } else {
      if (Array.isArray(userAnswer)) {
        return userAnswer.some(ans => 
          ans.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
        );
      } else {
        return correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim();
      }
    }
  }

  /**
   * Calculate points based on various factors
   */
  static calculatePoints(
    isCorrect: boolean,
    difficulty: string,
    timeRemaining: number,
    totalTime: number,
    hintsUsed: number = 0
  ): number {
    if (!isCorrect) return 0;

    // Base points by difficulty
    let basePoints = 10;
    switch (difficulty) {
      case 'easy': basePoints = 10; break;
      case 'medium': basePoints = 15; break;
      case 'hard': basePoints = 20; break;
    }

    // Time bonus (up to 50% more points for quick answers)
    const timeRatio = timeRemaining / totalTime;
    const timeBonus = Math.floor(basePoints * 0.5 * timeRatio);

    // Hint penalty
    const hintPenalty = hintsUsed * 2;

    return Math.max(basePoints + timeBonus - hintPenalty, 1);
  }

  /**
   * Generate rescue mission tasks
   */
  static generateRescueMissionTasks(): Array<{
    id: string;
    location: string;
    attacker: string;
    challenge: string;
    answer: string;
    clue: string;
  }> {
    return [
      {
        id: '1',
        location: 'Sanctuary',
        attacker: 'Fear',
        challenge: 'Confront the darkness in the shadow. I am an enemy of faith. Who am I?',
        answer: 'Fear',
        clue: 'Your journey begins where worship happens. Look for the scroll near the altar.'
      },
      {
        id: '2',
        location: 'Library of Wisdom',
        attacker: 'Doubt',
        challenge: 'Complete the verse: "The Lord is my light and my salvation—whom shall I ___?"',
        answer: 'fear',
        clue: 'Seek knowledge where books are kept. The next scroll awaits among ancient texts.'
      },
      {
        id: '3',
        location: 'Prayer Room',
        attacker: 'Pride',
        challenge: 'I make people think they don\'t need God. I am the opposite of humility. Who am I?',
        answer: 'Pride',
        clue: 'Find peace where prayers are offered. The final scroll holds the key to victory.'
      },
      {
        id: '4',
        location: 'Garden of Faith',
        attacker: 'Despair',
        challenge: 'Complete the verse: "For I know the plans I have for you," declares the Lord, "plans to ___"',
        answer: 'prosper',
        clue: 'Where faith grows, hope blooms. The VVIP awaits your final victory.'
      }
    ];
  }

  /**
   * Generate quiz questions by category
   */
  static generateQuizQuestions(category: string, difficulty: string, count: number = 10): GameQuestion[] {
    const questionBank: { [key: string]: GameQuestion[] } = {
      'characters': [
        {
          id: 'char-1',
          text: 'Who was the mother of Moses?',
          type: 'multiple-choice',
          answer: 'Jochebed',
          options: ['Jochebed', 'Miriam', 'Zipporah', 'Deborah'],
          reference: 'Numbers 26:59',
          hints: ['She was from the tribe of Levi', 'She hid Moses for three months'],
          difficulty: 'medium'
        },
        {
          id: 'char-2',
          text: 'Which prophet was swallowed by a great fish?',
          type: 'multiple-choice',
          answer: 'Jonah',
          options: ['Jonah', 'Elijah', 'Elisha', 'Jeremiah'],
          reference: 'Jonah 1:17',
          hints: ['He tried to flee from God\'s command', 'He was sent to Nineveh'],
          difficulty: 'easy'
        },
        {
          id: 'char-3',
          text: 'Who saved the Jewish people as queen?',
          type: 'open-ended',
          answer: 'Esther',
          reference: 'Book of Esther',
          hints: ['She was chosen in a beauty contest', 'She revealed Haman\'s plot'],
          difficulty: 'medium'
        }
      ],
      'verses': [
        {
          id: 'verse-1',
          text: 'Complete the verse: "For God so loved the world that he gave his one and only ___"',
          type: 'fill-in',
          answer: 'Son',
          reference: 'John 3:16',
          hints: ['This verse is about God\'s sacrifice', 'Jesus is God\'s only begotten'],
          difficulty: 'easy'
        },
        {
          id: 'verse-2',
          text: 'Complete: "I can do all things through Christ who ___"',
          type: 'fill-in',
          answer: 'strengthens',
          reference: 'Philippians 4:13',
          hints: ['This word means to make strong', 'Paul wrote this while in prison'],
          difficulty: 'easy'
        }
      ]
    };

    const categoryQuestions = questionBank[category] || questionBank['characters'];
    const filteredQuestions = categoryQuestions.filter(q => 
      difficulty === 'all' || q.difficulty === difficulty
    );

    // Shuffle and return requested count
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  /**
   * Generate memory verse challenges
   */
  static generateMemoryVerseChallenge(difficulty: string): {
    verse: string;
    reference: string;
    blanks: string[];
    hints: string[];
  } {
    const verses = {
      'easy': [
        {
          verse: 'The Lord is my ___; I shall not ___.',
          reference: 'Psalm 23:1',
          blanks: ['shepherd', 'want'],
          hints: ['One who guides sheep', 'To lack or need']
        },
        {
          verse: 'Jesus said, "I am the ___, the ___, and the ___."',
          reference: 'John 14:6',
          blanks: ['way', 'truth', 'life'],
          hints: ['Path or road', 'Opposite of lie', 'Opposite of death']
        }
      ],
      'medium': [
        {
          verse: 'For I know the ___ I have for you," declares the Lord, "plans to ___ you and not to ___ you.',
          reference: 'Jeremiah 29:11',
          blanks: ['plans', 'prosper', 'harm'],
          hints: ['God\'s intentions', 'To succeed or flourish', 'To hurt or damage']
        }
      ],
      'hard': [
        {
          verse: 'Love is ___, love is ___. It does not ___, it does not ___, it is not ___.',
          reference: '1 Corinthians 13:4',
          blanks: ['patient', 'kind', 'envy', 'boast', 'proud'],
          hints: ['Willing to wait', 'Gentle and caring', 'To want what others have', 'To brag', 'Arrogant']
        }
      ]
    };

    const difficultyVerses = verses[difficulty as keyof typeof verses] || verses['easy'];
    const randomVerse = difficultyVerses[Math.floor(Math.random() * difficultyVerses.length)];
    
    return randomVerse;
  }

  /**
   * Generate four pictures one word puzzle
   */
  static generateFourPicturesPuzzle(): {
    images: string[];
    answer: string;
    hints: string[];
  } {
    const puzzles = [
      {
        images: [
          'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg', // Cross
          'https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg', // Crown
          'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',  // Lamb
          'https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg'  // Shepherd
        ],
        answer: 'Jesus',
        hints: ['Son of God', 'Savior of the world', 'The Good Shepherd']
      },
      {
        images: [
          'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg', // Basket
          'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', // River
          'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg', // Baby
          'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'  // Princess
        ],
        answer: 'Moses',
        hints: ['Led Israelites out of Egypt', 'Received the Ten Commandments', 'Found in a basket']
      }
    ];

    return puzzles[Math.floor(Math.random() * puzzles.length)];
  }

  /**
   * Generate timeline events for ordering
   */
  static generateTimelineChallenge(story: string): {
    events: Array<{ id: string; text: string; order: number }>;
    correctOrder: string[];
  } {
    const timelines: { [key: string]: Array<{ text: string; order: number }> } = {
      'moses': [
        { text: 'Moses is born during Israelite oppression', order: 1 },
        { text: 'Moses kills an Egyptian and flees to Midian', order: 2 },
        { text: 'Moses encounters the burning bush', order: 3 },
        { text: 'Moses confronts Pharaoh with plagues', order: 4 },
        { text: 'The Israelites cross the Red Sea', order: 5 }
      ],
      'esther': [
        { text: 'Queen Vashti is deposed', order: 1 },
        { text: 'Esther becomes queen', order: 2 },
        { text: 'Haman plots against the Jews', order: 3 },
        { text: 'Esther reveals her identity and Haman\'s plot', order: 4 },
        { text: 'The Jews are saved and Purim is established', order: 5 }
      ]
    };

    const storyEvents = timelines[story] || timelines['moses'];
    const shuffledEvents = [...storyEvents]
      .sort(() => Math.random() - 0.5)
      .map((event, index) => ({
        id: `event-${index}`,
        text: event.text,
        order: event.order
      }));

    const correctOrder = storyEvents
      .sort((a, b) => a.order - b.order)
      .map((_, index) => `event-${shuffledEvents.findIndex(e => e.order === index + 1)}`);

    return {
      events: shuffledEvents,
      correctOrder
    };
  }

  /**
   * Generate beatitudes matching challenge
   */
  static generateBeatitudesChallenge(): {
    beatitudes: Array<{ id: string; text: string; meaning: string; reference: string }>;
    shuffledMeanings: string[];
  } {
    const beatitudes = [
      {
        id: 'beat-1',
        text: 'Blessed are the poor in spirit',
        meaning: 'for theirs is the kingdom of heaven',
        reference: 'Matthew 5:3'
      },
      {
        id: 'beat-2',
        text: 'Blessed are those who mourn',
        meaning: 'for they will be comforted',
        reference: 'Matthew 5:4'
      },
      {
        id: 'beat-3',
        text: 'Blessed are the meek',
        meaning: 'for they will inherit the earth',
        reference: 'Matthew 5:5'
      },
      {
        id: 'beat-4',
        text: 'Blessed are those who hunger and thirst for righteousness',
        meaning: 'for they will be filled',
        reference: 'Matthew 5:6'
      },
      {
        id: 'beat-5',
        text: 'Blessed are the merciful',
        meaning: 'for they will be shown mercy',
        reference: 'Matthew 5:7'
      },
      {
        id: 'beat-6',
        text: 'Blessed are the pure in heart',
        meaning: 'for they will see God',
        reference: 'Matthew 5:8'
      },
      {
        id: 'beat-7',
        text: 'Blessed are the peacemakers',
        meaning: 'for they will be called children of God',
        reference: 'Matthew 5:9'
      },
      {
        id: 'beat-8',
        text: 'Blessed are those who are persecuted because of righteousness',
        meaning: 'for theirs is the kingdom of heaven',
        reference: 'Matthew 5:10'
      }
    ];

    const shuffledMeanings = [...beatitudes]
      .map(b => b.meaning)
      .sort(() => Math.random() - 0.5);

    return {
      beatitudes,
      shuffledMeanings
    };
  }

  /**
   * Generate word search grid
   */
  static generateWordSearch(theme: string): {
    grid: string[][];
    words: Array<{ word: string; found: boolean; positions: Array<{ row: number; col: number }> }>;
  } {
    const wordLists: { [key: string]: string[] } = {
      'characters': ['MOSES', 'DAVID', 'ESTHER', 'JONAH', 'ELIJAH', 'RUTH', 'NOAH', 'ABRAHAM'],
      'places': ['JERUSALEM', 'BETHLEHEM', 'NAZARETH', 'JORDAN', 'SINAI', 'GALILEE'],
      'virtues': ['FAITH', 'HOPE', 'LOVE', 'PEACE', 'JOY', 'GRACE', 'MERCY', 'TRUTH']
    };

    const words = wordLists[theme] || wordLists['characters'];
    const gridSize = 12;
    const grid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

    // Place words in grid (simplified - horizontal only for demo)
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
      grid,
      words: placedWords
    };
  }

  /**
   * Validate game session state
   */
  static validateSessionState(session: GameSession): boolean {
    if (!session.id || !session.gameId) return false;
    if (session.players.length === 0) return false;
    if (session.currentQuestion < 0 || session.currentQuestion >= session.questions.length) return false;
    if (session.timeRemaining < 0) return false;
    
    return true;
  }

  /**
   * Calculate final game statistics
   */
  static calculateGameStats(session: GameSession, userId: string): {
    finalScore: number;
    correctAnswers: number;
    totalQuestions: number;
    accuracy: number;
    timeBonus: number;
    rank: number;
  } {
    const finalScore = session.scores[userId] || 0;
    const totalQuestions = session.questions.length;
    
    // Mock calculation for demo
    const correctAnswers = Math.floor(finalScore / 15); // Assuming average 15 points per correct answer
    const accuracy = (correctAnswers / totalQuestions) * 100;
    const timeBonus = Math.max(0, finalScore - (correctAnswers * 10));
    
    // Calculate rank
    const sortedScores = Object.values(session.scores).sort((a, b) => b - a);
    const rank = sortedScores.indexOf(finalScore) + 1;

    return {
      finalScore,
      correctAnswers,
      totalQuestions,
      accuracy,
      timeBonus,
      rank
    };
  }
}