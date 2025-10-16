import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MessageCircle, 
  Heart, 
  Share, 
  Plus, 
  Search,
  Users,
  TrendingUp,
  Calendar,
  BookOpen
} from 'lucide-react-native';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    badge?: string;
  };
  category: string;
  replies: number;
  likes: number;
  timestamp: string;
  isPopular?: boolean;
}

interface VerseCard {
  id: string;
  verse: string;
  reference: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  shares: number;
  background: string;
}

const forumPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Finding Peace in Difficult Times',
    content: 'I\'ve been struggling lately and found comfort in Philippians 4:7. How do you find peace when everything feels overwhelming?',
    author: {
      name: 'GraceSeeker',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      badge: 'Faith Warrior'
    },
    category: 'Prayer & Support',
    replies: 12,
    likes: 24,
    timestamp: '2 hours ago',
    isPopular: true
  },
  {
    id: '2',
    title: 'Best Strategies for Memory Verse Challenge',
    content: 'What techniques do you use to memorize long passages? I\'m working on Psalm 119 and could use some tips!',
    author: {
      name: 'MemoryMaster',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    category: 'Game Tips',
    replies: 8,
    likes: 15,
    timestamp: '4 hours ago'
  },
  {
    id: '3',
    title: 'Rescue Mission Squad Looking for Members',
    content: 'Our squad "Mighty Warriors" is looking for 2 more members for tonight\'s rescue mission. We\'re focusing on the Journey of Courage!',
    author: {
      name: 'DavidsPsalm',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      badge: 'Squad Leader'
    },
    category: 'Squad Recruitment',
    replies: 5,
    likes: 18,
    timestamp: '6 hours ago'
  }
];

const verseCards: VerseCard[] = [
  {
    id: '1',
    verse: 'The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?',
    reference: 'Psalm 27:1',
    author: {
      name: 'FaithfulSarah',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    likes: 45,
    shares: 12,
    background: 'https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    verse: 'I can do all things through Christ who strengthens me.',
    reference: 'Philippians 4:13',
    author: {
      name: 'StrengthInHim',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    likes: 38,
    shares: 9,
    background: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

const categories = [
  { id: 'all', label: 'All Posts', icon: <MessageCircle size={16} /> },
  { id: 'prayer', label: 'Prayer & Support', icon: <Heart size={16} /> },
  { id: 'tips', label: 'Game Tips', icon: <TrendingUp size={16} /> },
  { id: 'squads', label: 'Squad Recruitment', icon: <Users size={16} /> },
  { id: 'verses', label: 'Verse Sharing', icon: <BookOpen size={16} /> }
];

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<'forum' | 'verses'>('forum');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = forumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || 
                           post.category.toLowerCase().includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  const renderForumPost = (post: ForumPost) => (
    <Pressable key={post.id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.author.avatar }} style={styles.authorAvatar} />
        <View style={styles.authorInfo}>
          <View style={styles.authorNameContainer}>
            <Text style={styles.authorName}>{post.author.name}</Text>
            {post.author.badge && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{post.author.badge}</Text>
              </View>
            )}
          </View>
          <Text style={styles.postTimestamp}>{post.timestamp}</Text>
        </View>
        {post.isPopular && (
          <View style={styles.popularBadge}>
            <TrendingUp size={12} color="#F59E0B" />
          </View>
        )}
      </View>
      
      <Text style={styles.postTitle}>{post.title}</Text>
      <Text style={styles.postContent}>{post.content}</Text>
      
      <View style={styles.postFooter}>
        <View style={styles.postStats}>
          <View style={styles.postStat}>
            <MessageCircle size={16} color="#6B7280" />
            <Text style={styles.statText}>{post.replies}</Text>
          </View>
          <View style={styles.postStat}>
            <Heart size={16} color="#6B7280" />
            <Text style={styles.statText}>{post.likes}</Text>
          </View>
        </View>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{post.category}</Text>
        </View>
      </View>
    </Pressable>
  );

  const renderVerseCard = (card: VerseCard) => (
    <View key={card.id} style={styles.verseCard}>
      <Image source={{ uri: card.background }} style={styles.verseBackground} />
      <View style={styles.verseOverlay}>
        <Text style={styles.verseText}>"{card.verse}"</Text>
        <Text style={styles.verseReference}>— {card.reference}</Text>
      </View>
      
      <View style={styles.verseFooter}>
        <View style={styles.verseAuthor}>
          <Image source={{ uri: card.author.avatar }} style={styles.verseAuthorAvatar} />
          <Text style={styles.verseAuthorName}>{card.author.name}</Text>
        </View>
        <View style={styles.verseActions}>
          <Pressable style={styles.verseAction}>
            <Heart size={18} color="#EF4444" />
            <Text style={styles.verseActionText}>{card.likes}</Text>
          </Pressable>
          <Pressable style={styles.verseAction}>
            <Share size={18} color="#6B7280" />
            <Text style={styles.verseActionText}>{card.shares}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <Text style={styles.subtitle}>Connect with fellow believers</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'forum' && styles.activeTab]}
          onPress={() => setActiveTab('forum')}
        >
          <MessageCircle size={20} color={activeTab === 'forum' ? '#3B82F6' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'forum' && styles.activeTabText]}>
            Forum
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'verses' && styles.activeTab]}
          onPress={() => setActiveTab('verses')}
        >
          <BookOpen size={20} color={activeTab === 'verses' ? '#3B82F6' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'verses' && styles.activeTabText]}>
            Verse Cards
          </Text>
        </Pressable>
      </View>

      {activeTab === 'forum' && (
        <>
          {/* Search and New Post */}
          <View style={styles.forumControls}>
            <View style={styles.searchContainer}>
              <Search size={20} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search discussions..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <Pressable style={styles.newPostButton}>
              <Plus size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Categories */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map(category => (
              <Pressable
                key={category.id}
                style={[
                  styles.categoryChip,
                  activeCategory === category.id && styles.categoryChipActive
                ]}
                onPress={() => setActiveCategory(category.id)}
              >
                {category.icon}
                <Text style={[
                  styles.categoryChipText,
                  activeCategory === category.id && styles.categoryChipTextActive
                ]}>
                  {category.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Forum Posts */}
          <ScrollView style={styles.postsContainer} showsVerticalScrollIndicator={false}>
            {filteredPosts.map(renderForumPost)}
            <View style={styles.bottomPadding} />
          </ScrollView>
        </>
      )}

      {activeTab === 'verses' && (
        <>
          {/* Verse Cards Header */}
          <View style={styles.versesHeader}>
            <Text style={styles.versesTitle}>Shared Verse Cards</Text>
            <Pressable style={styles.createVerseButton}>
              <Plus size={18} color="#3B82F6" />
              <Text style={styles.createVerseText}>Create</Text>
            </Pressable>
          </View>

          {/* Verse Cards */}
          <ScrollView style={styles.versesContainer} showsVerticalScrollIndicator={false}>
            {verseCards.map(renderVerseCard)}
            <View style={styles.bottomPadding} />
          </ScrollView>
        </>
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
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
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
  forumControls: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  newPostButton: {
    width: 48,
    height: 48,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesContainer: {
    maxHeight: 44,
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  postsContainer: {
    flex: 1,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  badgeContainer: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#F59E0B',
  },
  postTimestamp: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  popularBadge: {
    backgroundColor: '#FEF3C7',
    padding: 6,
    borderRadius: 6,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postStats: {
    flexDirection: 'row',
    gap: 16,
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: '#6B7280',
  },
  categoryTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  versesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  versesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  createVerseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  createVerseText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  versesContainer: {
    flex: 1,
  },
  verseCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  verseBackground: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  verseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    justifyContent: 'center',
  },
  verseText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  verseReference: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E7EB',
    textAlign: 'center',
  },
  verseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  verseAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verseAuthorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  verseAuthorName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  verseActions: {
    flexDirection: 'row',
    gap: 12,
  },
  verseAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verseActionText: {
    fontSize: 13,
    color: '#6B7280',
  },
  bottomPadding: {
    height: 20,
  },
});