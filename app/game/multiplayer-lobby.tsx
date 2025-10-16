import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  Users, 
  Plus, 
  Crown, 
  Clock, 
  ArrowLeft,
  Send,
  Settings,
  Play,
  UserPlus
} from 'lucide-react-native';

interface Squad {
  id: string;
  name: string;
  leader: string;
  members: Player[];
  maxMembers: number;
  gameType: string;
  status: 'waiting' | 'ready' | 'playing';
  settings: {
    difficulty: string;
    timeLimit: number;
    allowHints: boolean;
  };
}

interface Player {
  id: string;
  username: string;
  avatar: string;
  isReady: boolean;
  isLeader: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
}

export default function MultiplayerLobbyScreen() {
  const [activeTab, setActiveTab] = useState<'squads' | 'create'>('squads');
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Mock data
  const [availableSquads] = useState<Squad[]>([
    {
      id: '1',
      name: 'Mighty Warriors',
      leader: 'DavidsPsalm',
      members: [
        { id: '1', username: 'DavidsPsalm', avatar: '👑', isReady: true, isLeader: true },
        { id: '2', username: 'FaithSeeker', avatar: '⚔️', isReady: false, isLeader: false }
      ],
      maxMembers: 4,
      gameType: 'Rescue Mission',
      status: 'waiting',
      settings: {
        difficulty: 'medium',
        timeLimit: 2400,
        allowHints: true
      }
    },
    {
      id: '2',
      name: 'Scripture Scholars',
      leader: 'WisdomSeeker',
      members: [
        { id: '3', username: 'WisdomSeeker', avatar: '📚', isReady: true, isLeader: true },
        { id: '4', username: 'VerseVanguard', avatar: '🛡️', isReady: true, isLeader: false },
        { id: '5', username: 'TruthTeller', avatar: '✨', isReady: false, isLeader: false }
      ],
      maxMembers: 6,
      gameType: 'Bible Quiz',
      status: 'waiting',
      settings: {
        difficulty: 'hard',
        timeLimit: 900,
        allowHints: false
      }
    }
  ]);

  useEffect(() => {
    // Mock chat messages
    setChatMessages([
      {
        id: '1',
        userId: '1',
        username: 'DavidsPsalm',
        message: 'Welcome to the squad! Ready for the rescue mission?',
        timestamp: new Date(Date.now() - 300000)
      },
      {
        id: '2',
        userId: '2',
        username: 'FaithSeeker',
        message: 'Yes! Let\'s defeat those spiritual enemies together!',
        timestamp: new Date(Date.now() - 120000)
      }
    ]);
  }, [selectedSquad]);

  const joinSquad = (squad: Squad) => {
    setSelectedSquad(squad);
    Alert.alert('Joined Squad', `You have joined "${squad.name}". Get ready for battle!`);
  };

  const leaveSquad = () => {
    setSelectedSquad(null);
    setIsReady(false);
    Alert.alert('Left Squad', 'You have left the squad.');
  };

  const toggleReady = () => {
    setIsReady(!isReady);
  };

  const sendMessage = () => {
    if (!chatMessage.trim() || !selectedSquad) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current-user',
      username: 'You',
      message: chatMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');
  };

  const startGame = () => {
    if (!selectedSquad) return;

    const allReady = selectedSquad.members.every(member => member.isReady);
    if (!allReady) {
      Alert.alert('Not Ready', 'All squad members must be ready before starting the game.');
      return;
    }

    Alert.alert(
      'Start Game',
      `Starting ${selectedSquad.gameType} with ${selectedSquad.members.length} players.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start', 
          onPress: () => {
            if (selectedSquad.gameType === 'Rescue Mission') {
              router.push('/game/rescue-mission');
            } else {
              router.push(`/game/${selectedSquad.gameType.toLowerCase().replace(' ', '-')}`);
            }
          }
        }
      ]
    );
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  if (selectedSquad) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={leaveSquad}>
            <ArrowLeft size={24} color="#1F2937" />
          </Pressable>
          <View style={styles.squadInfo}>
            <Text style={styles.squadName}>{selectedSquad.name}</Text>
            <Text style={styles.gameType}>{selectedSquad.gameType}</Text>
          </View>
          <Pressable style={styles.settingsButton}>
            <Settings size={20} color="#6B7280" />
          </Pressable>
        </View>

        {/* Squad Members */}
        <View style={styles.membersSection}>
          <Text style={styles.sectionTitle}>Squad Members ({selectedSquad.members.length}/{selectedSquad.maxMembers})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.membersList}>
              {selectedSquad.members.map(member => (
                <View key={member.id} style={styles.memberCard}>
                  <Text style={styles.memberAvatar}>{member.avatar}</Text>
                  <Text style={styles.memberUsername}>{member.username}</Text>
                  {member.isLeader && (
                    <View style={styles.leaderBadge}>
                      <Crown size={12} color="#F59E0B" />
                    </View>
                  )}
                  <View style={[
                    styles.readyIndicator,
                    member.isReady ? styles.readyTrue : styles.readyFalse
                  ]}>
                    <Text style={[
                      styles.readyText,
                      member.isReady ? styles.readyTextTrue : styles.readyTextFalse
                    ]}>
                      {member.isReady ? 'Ready' : 'Not Ready'}
                    </Text>
                  </View>
                </View>
              ))}
              
              {selectedSquad.members.length < selectedSquad.maxMembers && (
                <Pressable style={styles.inviteCard}>
                  <UserPlus size={24} color="#6B7280" />
                  <Text style={styles.inviteText}>Invite Player</Text>
                </Pressable>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Game Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Game Settings</Text>
          <View style={styles.settingsGrid}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Difficulty</Text>
              <Text style={styles.settingValue}>{selectedSquad.settings.difficulty}</Text>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Time Limit</Text>
              <Text style={styles.settingValue}>{formatTime(selectedSquad.settings.timeLimit)}</Text>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Hints</Text>
              <Text style={styles.settingValue}>{selectedSquad.settings.allowHints ? 'Enabled' : 'Disabled'}</Text>
            </View>
          </View>
        </View>

        {/* Chat */}
        <View style={styles.chatSection}>
          <Text style={styles.sectionTitle}>Squad Chat</Text>
          <ScrollView style={styles.chatMessages} showsVerticalScrollIndicator={false}>
            {chatMessages.map(message => (
              <View key={message.id} style={styles.chatMessage}>
                <Text style={styles.chatUsername}>{message.username}:</Text>
                <Text style={styles.chatText}>{message.message}</Text>
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.chatInput}>
            <TextInput
              style={styles.chatTextInput}
              placeholder="Type a message..."
              value={chatMessage}
              onChangeText={setChatMessage}
              placeholderTextColor="#9CA3AF"
              onSubmitEditing={sendMessage}
            />
            <Pressable style={styles.sendButton} onPress={sendMessage}>
              <Send size={20} color="#3B82F6" />
            </Pressable>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable 
            style={[styles.readyButton, isReady && styles.readyButtonActive]}
            onPress={toggleReady}
          >
            <Text style={[styles.readyButtonText, isReady && styles.readyButtonTextActive]}>
              {isReady ? 'Ready!' : 'Mark as Ready'}
            </Text>
          </Pressable>
          
          <Pressable 
            style={[styles.startButton, !isReady && styles.startButtonDisabled]}
            onPress={startGame}
            disabled={!isReady}
          >
            <Play size={20} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Start Game</Text>
          </Pressable>
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
        <Text style={styles.headerTitle}>Multiplayer Lobby</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'squads' && styles.activeTab]}
          onPress={() => setActiveTab('squads')}
        >
          <Users size={20} color={activeTab === 'squads' ? '#3B82F6' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'squads' && styles.activeTabText]}>
            Join Squad
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'create' && styles.activeTab]}
          onPress={() => setActiveTab('create')}
        >
          <Plus size={20} color={activeTab === 'create' ? '#3B82F6' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
            Create Squad
          </Text>
        </Pressable>
      </View>

      {activeTab === 'squads' ? (
        <ScrollView style={styles.squadsList} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Available Squads</Text>
          {availableSquads.map(squad => (
            <Pressable key={squad.id} style={styles.squadCard} onPress={() => joinSquad(squad)}>
              <View style={styles.squadHeader}>
                <Text style={styles.squadCardName}>{squad.name}</Text>
                <View style={styles.squadMemberCount}>
                  <Users size={16} color="#6B7280" />
                  <Text style={styles.memberCountText}>
                    {squad.members.length}/{squad.maxMembers}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.squadGameType}>{squad.gameType}</Text>
              
              <View style={styles.squadDetails}>
                <View style={styles.squadDetail}>
                  <Text style={styles.detailLabel}>Leader:</Text>
                  <Text style={styles.detailValue}>{squad.leader}</Text>
                </View>
                <View style={styles.squadDetail}>
                  <Text style={styles.detailLabel}>Difficulty:</Text>
                  <Text style={styles.detailValue}>{squad.settings.difficulty}</Text>
                </View>
                <View style={styles.squadDetail}>
                  <Text style={styles.detailLabel}>Time:</Text>
                  <Text style={styles.detailValue}>{formatTime(squad.settings.timeLimit)}</Text>
                </View>
              </View>
              
              <View style={styles.squadMembers}>
                {squad.members.map(member => (
                  <View key={member.id} style={styles.memberPreview}>
                    <Text style={styles.memberPreviewAvatar}>{member.avatar}</Text>
                    {member.isLeader && (
                      <Crown size={12} color="#F59E0B" style={styles.memberCrown} />
                    )}
                  </View>
                ))}
              </View>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <ScrollView style={styles.createSquadForm} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Create New Squad</Text>
          
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Squad Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter squad name..."
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Game Type</Text>
            <View style={styles.gameTypeOptions}>
              {['Rescue Mission', 'Bible Quiz', 'Memory Verse Relay'].map(gameType => (
                <Pressable key={gameType} style={styles.gameTypeOption}>
                  <Text style={styles.gameTypeText}>{gameType}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Max Members</Text>
            <View style={styles.memberOptions}>
              {[2, 4, 6].map(count => (
                <Pressable key={count} style={styles.memberOption}>
                  <Text style={styles.memberOptionText}>{count}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Difficulty</Text>
            <View style={styles.difficultyOptions}>
              {['Easy', 'Medium', 'Hard'].map(difficulty => (
                <Pressable key={difficulty} style={styles.difficultyOption}>
                  <Text style={styles.difficultyText}>{difficulty}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable style={styles.createButton}>
            <Text style={styles.createButtonText}>Create Squad</Text>
          </Pressable>
        </ScrollView>
      )}
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  squadInfo: {
    flex: 1,
    alignItems: 'center',
  },
  squadName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  gameType: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingsButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#EBF5FF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  squadsList: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  squadCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  squadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  squadCardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  squadMemberCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  memberCountText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  squadGameType: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
    marginBottom: 12,
  },
  squadDetails: {
    gap: 6,
    marginBottom: 12,
  },
  squadDetail: {
    flexDirection: 'row',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  squadMembers: {
    flexDirection: 'row',
    gap: 8,
  },
  memberPreview: {
    position: 'relative',
    alignItems: 'center',
  },
  memberPreviewAvatar: {
    fontSize: 20,
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
  },
  memberCrown: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  membersSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  membersList: {
    flexDirection: 'row',
    gap: 12,
  },
  memberCard: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    minWidth: 80,
    position: 'relative',
  },
  memberAvatar: {
    fontSize: 24,
    marginBottom: 6,
  },
  memberUsername: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 6,
  },
  leaderBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FEF3C7',
    padding: 2,
    borderRadius: 4,
  },
  readyIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  readyTrue: {
    backgroundColor: '#ECFDF5',
  },
  readyFalse: {
    backgroundColor: '#FEF2F2',
  },
  readyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  readyTextTrue: {
    color: '#10B981',
  },
  readyTextFalse: {
    color: '#EF4444',
  },
  inviteCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    minWidth: 80,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  inviteText: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  settingItem: {
    flex: 1,
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  chatSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  chatMessages: {
    flex: 1,
    maxHeight: 200,
    marginBottom: 12,
  },
  chatMessage: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 6,
  },
  chatUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  chatText: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  chatTextInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  sendButton: {
    padding: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  readyButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  readyButtonActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  readyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  readyButtonTextActive: {
    color: '#10B981',
  },
  startButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    gap: 8,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  createSquadForm: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    color: '#1F2937',
  },
  gameTypeOptions: {
    gap: 8,
  },
  gameTypeOption: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  gameTypeText: {
    fontSize: 16,
    color: '#1F2937',
  },
  memberOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  memberOption: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  memberOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  difficultyOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyOption: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  difficultyText: {
    fontSize: 16,
    color: '#1F2937',
  },
  createButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});