import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput } from 'react-native';
import { 
  Sword, 
  Shield, 
  Heart, 
  Clock, 
  ArrowLeft, 
  MapPin,
  Scroll,
  Target,
  Users
} from 'lucide-react-native';

interface MissionTask {
  id: string;
  location: string;
  attacker: string;
  challenge: string;
  answer: string;
  clue: string;
  completed: boolean;
}

interface Squad {
  id: string;
  name: string;
  members: string[];
  progress: number;
}

export default function RescueMissionScreen() {
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
  const [currentTask, setCurrentTask] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(2400); // 40 minutes
  const [squadProgress, setSquadProgress] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showClue, setShowClue] = useState(false);

  const weapons = [
    { id: 'scripture', name: 'Scripture Knowledge', icon: '📖', description: 'Answer Bible questions' },
    { id: 'prayer', name: 'Prayer', icon: '🙏', description: 'Complete verse challenges' },
    { id: 'faith', name: 'Faith', icon: '✨', description: 'Overcome spiritual enemies' }
  ];

  const missionTasks: MissionTask[] = [
    {
      id: '1',
      location: 'Sanctuary',
      attacker: 'Fear',
      challenge: 'Confront the darkness in the shadow. I am an enemy of faith. Who am I?',
      answer: 'Fear',
      clue: 'Your journey begins where worship happens. Look for the scroll near the altar.',
      completed: false
    },
    {
      id: '2',
      location: 'Library of Wisdom',
      attacker: 'Doubt',
      challenge: 'Complete the verse: "The Lord is my light and my salvation—whom shall I ___?"',
      answer: 'fear',
      clue: 'Seek knowledge where books are kept. The next scroll awaits among ancient texts.',
      completed: false
    },
    {
      id: '3',
      location: 'Prayer Room',
      attacker: 'Pride',
      challenge: 'I make people think they don\'t need God. I am the opposite of humility. Who am I?',
      answer: 'Pride',
      clue: 'Find peace where prayers are offered. The final scroll holds the key to victory.',
      completed: false
    }
  ];

  const [tasks, setTasks] = useState(missionTasks);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      // Time's up
      Alert.alert('Mission Failed', 'Time has run out! The VVIP could not be rescued.');
    }
  }, [timeRemaining]);

  const selectWeapon = (weaponId: string) => {
    setSelectedWeapon(weaponId);
  };

  const submitAnswer = () => {
    const task = tasks[currentTask];
    const isCorrect = currentAnswer.toLowerCase().trim() === task.answer.toLowerCase();

    if (isCorrect) {
      // Mark task as completed
      const updatedTasks = [...tasks];
      updatedTasks[currentTask].completed = true;
      setTasks(updatedTasks);

      // Update progress
      const newProgress = ((currentTask + 1) / tasks.length) * 100;
      setSquadProgress(newProgress);

      Alert.alert(
        'Enemy Defeated!',
        `You have successfully defeated ${task.attacker}! ${task.clue}`,
        [
          {
            text: 'Continue',
            onPress: () => {
              if (currentTask < tasks.length - 1) {
                setCurrentTask(currentTask + 1);
                setCurrentAnswer('');
                setShowClue(false);
              } else {
                // Mission complete
                Alert.alert(
                  'Mission Accomplished!',
                  'Congratulations! You have successfully rescued the VVIP and defeated all spiritual enemies!',
                  [
                    { text: 'Play Again', onPress: () => resetMission() },
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
        'Try Again',
        `That's not correct. The ${task.attacker} remains strong. Think about the challenge and try again.`
      );
    }
  };

  const resetMission = () => {
    setSelectedWeapon(null);
    setCurrentTask(0);
    setTimeRemaining(2400);
    setSquadProgress(0);
    setCurrentAnswer('');
    setShowClue(false);
    setTasks(missionTasks.map(task => ({ ...task, completed: false })));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!selectedWeapon) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </Pressable>
          <Text style={styles.headerTitle}>Rescue Mission</Text>
        </View>

        <ScrollView style={styles.weaponSelection} showsVerticalScrollIndicator={false}>
          <View style={styles.missionBrief}>
            <Text style={styles.missionTitle}>Mission Brief</Text>
            <Text style={styles.missionDescription}>
              A VVIP has been captured by spiritual enemies in the mission field. 
              Choose your weapon and embark on a 40-minute rescue mission to defeat 
              Fear, Doubt, and Pride, and bring the VVIP to safety.
            </Text>
          </View>

          <Text style={styles.weaponTitle}>Choose Your Weapon</Text>
          
          {weapons.map(weapon => (
            <Pressable
              key={weapon.id}
              style={styles.weaponCard}
              onPress={() => selectWeapon(weapon.id)}
            >
              <Text style={styles.weaponIcon}>{weapon.icon}</Text>
              <View style={styles.weaponInfo}>
                <Text style={styles.weaponName}>{weapon.name}</Text>
                <Text style={styles.weaponDescription}>{weapon.description}</Text>
              </View>
              <Sword size={24} color="#6B7280" />
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  const currentTaskData = tasks[currentTask];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>Rescue Mission</Text>
        <View style={styles.timerContainer}>
          <Clock size={16} color="#EF4444" />
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        </View>
      </View>

      {/* Mission Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Mission Progress</Text>
          <Text style={styles.progressPercentage}>{Math.round(squadProgress)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${squadProgress}%` }]} />
        </View>
        <View style={styles.taskIndicators}>
          {tasks.map((task, index) => (
            <View
              key={task.id}
              style={[
                styles.taskIndicator,
                task.completed && styles.taskCompleted,
                index === currentTask && styles.taskCurrent
              ]}
            >
              <Text style={[
                styles.taskNumber,
                task.completed && styles.taskNumberCompleted,
                index === currentTask && styles.taskNumberCurrent
              ]}>
                {index + 1}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView style={styles.missionContent} showsVerticalScrollIndicator={false}>
        {/* Current Location */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <MapPin size={20} color="#3B82F6" />
            <Text style={styles.locationName}>{currentTaskData.location}</Text>
          </View>
          <Text style={styles.locationDescription}>
            You have arrived at the {currentTaskData.location}. 
            Prepare to face {currentTaskData.attacker}.
          </Text>
        </View>

        {/* Mission Scroll */}
        <View style={styles.scrollCard}>
          <View style={styles.scrollHeader}>
            <Scroll size={20} color="#8B5CF6" />
            <Text style={styles.scrollTitle}>Ancient Scroll</Text>
          </View>
          <Text style={styles.challengeText}>{currentTaskData.challenge}</Text>
          
          {showClue && (
            <View style={styles.clueContainer}>
              <Text style={styles.clueText}>💡 {currentTaskData.clue}</Text>
            </View>
          )}
        </View>

        {/* Answer Input */}
        <View style={styles.answerSection}>
          <Text style={styles.answerLabel}>Your Answer:</Text>
          <View style={styles.answerInputContainer}>
            <TextInput
              style={styles.answerInput}
              placeholder="Enter your answer to defeat the enemy..."
              value={currentAnswer}
              onChangeText={setCurrentAnswer}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable style={styles.clueButton} onPress={() => setShowClue(true)}>
            <Text style={styles.clueButtonText}>Reveal Clue</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.attackButton, !currentAnswer && styles.attackButtonDisabled]}
            onPress={submitAnswer}
            disabled={!currentAnswer}
          >
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              style={styles.attackGradient}
            >
              <Target size={20} color="#FFFFFF" />
              <Text style={styles.attackButtonText}>Attack Enemy</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Squad Status */}
        <View style={styles.squadStatus}>
          <View style={styles.squadHeader}>
            <Users size={20} color="#10B981" />
            <Text style={styles.squadTitle}>Squad Status</Text>
          </View>
          <View style={styles.squadMembers}>
            <View style={styles.squadMember}>
              <Text style={styles.memberName}>You</Text>
              <Text style={styles.memberStatus}>Active</Text>
            </View>
            <View style={styles.squadMember}>
              <Text style={styles.memberName}>FaithWarrior</Text>
              <Text style={styles.memberStatus}>Task 2</Text>
            </View>
            <View style={styles.squadMember}>
              <Text style={styles.memberName}>GraceSeeker</Text>
              <Text style={styles.memberStatus}>Task 1</Text>
            </View>
          </View>
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
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  weaponSelection: {
    flex: 1,
    padding: 20,
  },
  missionBrief: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  missionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  missionDescription: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  weaponTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  weaponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  weaponIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  weaponInfo: {
    flex: 1,
  },
  weaponName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  weaponDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B82F6',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  taskIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCompleted: {
    backgroundColor: '#10B981',
  },
  taskCurrent: {
    backgroundColor: '#3B82F6',
  },
  taskNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  taskNumberCompleted: {
    color: '#FFFFFF',
  },
  taskNumberCurrent: {
    color: '#FFFFFF',
  },
  missionContent: {
    flex: 1,
    padding: 20,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  locationDescription: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  scrollCard: {
    backgroundColor: '#FEF3C7',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  scrollHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  scrollTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  challengeText: {
    fontSize: 16,
    color: '#92400E',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  clueContainer: {
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  clueText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  answerSection: {
    marginBottom: 24,
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  answerInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  answerInput: {
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 56,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 24,
  },
  clueButton: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clueButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F59E0B',
  },
  attackButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  attackButtonDisabled: {
    opacity: 0.5,
  },
  attackGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  attackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  squadStatus: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  squadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  squadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  squadMembers: {
    gap: 8,
  },
  squadMember: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  memberStatus: {
    fontSize: 12,
    color: '#6B7280',
  },
});