import { envConfig } from '@/config/env.config';
import { logger } from '@/middleware/logger';

interface BibleVerse {
  reference: string;
  text: string;
  translation: string;
}

interface BibleSearchResult {
  verses: BibleVerse[];
  total: number;
}

export class BibleService {
  private baseUrl = 'https://api.scripture.api.bible/v1';
  private apiKey = envConfig.BIBLE_API_KEY;

  /**
   * Get verse by reference
   */
  async getVerse(reference: string, translation: string = 'NIV'): Promise<BibleVerse | null> {
    try {
      if (!this.apiKey) {
        logger.warn('Bible API key not configured, returning mock data');
        return this.getMockVerse(reference);
      }

      const response = await fetch(`${this.baseUrl}/bibles/${translation}/verses/${reference}`, {
        headers: {
          'api-key': this.apiKey
        }
      });

      if (!response.ok) {
        logger.error(`Bible API error: ${response.status} ${response.statusText}`);
        return this.getMockVerse(reference);
      }

      const data = await response.json();

      return {
        reference: data.data.reference,
        text: data.data.content,
        translation
      };
    } catch (error) {
      logger.error('Error fetching verse from Bible API:', error);
      return this.getMockVerse(reference);
    }
  }

  /**
   * Search verses by keyword or theme
   */
  async searchVerses(query: string, translation: string = 'NIV', limit: number = 10): Promise<BibleSearchResult> {
    try {
      if (!this.apiKey) {
        logger.warn('Bible API key not configured, returning mock data');
        return this.getMockSearchResults(query, limit);
      }

      const response = await fetch(`${this.baseUrl}/bibles/${translation}/search?query=${encodeURIComponent(query)}&limit=${limit}`, {
        headers: {
          'api-key': this.apiKey
        }
      });

      if (!response.ok) {
        logger.error(`Bible API search error: ${response.status} ${response.statusText}`);
        return this.getMockSearchResults(query, limit);
      }

      const data = await response.json();

      return {
        verses: data.data.verses.map((verse: any) => ({
          reference: verse.reference,
          text: verse.text,
          translation
        })),
        total: data.data.total
      };
    } catch (error) {
      logger.error('Error searching verses from Bible API:', error);
      return this.getMockSearchResults(query, limit);
    }
  }

  /**
   * Get verses by theme for scavenger hunt
   */
  async getVersesByTheme(theme: string, translation: string = 'NIV'): Promise<BibleVerse[]> {
    const themeQueries: { [key: string]: string } = {
      'love': 'love',
      'faith': 'faith',
      'hope': 'hope',
      'peace': 'peace',
      'joy': 'joy',
      'forgiveness': 'forgive',
      'courage': 'courage',
      'wisdom': 'wisdom',
      'strength': 'strength',
      'salvation': 'salvation'
    };

    const query = themeQueries[theme.toLowerCase()] || theme;
    const result = await this.searchVerses(query, translation, 5);

    return result.verses;
  }

  /**
   * Get random verse for daily challenges
   */
  async getRandomVerse(translation: string = 'NIV'): Promise<BibleVerse> {
    const popularVerses = [
      'John 3:16',
      'Psalm 23:1',
      'Philippians 4:13',
      'Romans 8:28',
      'Jeremiah 29:11',
      'Proverbs 3:5-6',
      'Isaiah 40:31',
      'Matthew 28:19-20',
      '1 Corinthians 13:4-7',
      'Ephesians 2:8-9'
    ];

    const randomReference = popularVerses[Math.floor(Math.random() * popularVerses.length)];
    const verse = await this.getVerse(randomReference, translation);

    return verse || this.getMockVerse(randomReference);
  }

  /**
   * Mock verse data for development/fallback
   */
  private getMockVerse(reference: string): BibleVerse {
    const mockVerses: { [key: string]: string } = {
      'John 3:16': 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
      'Psalm 23:1': 'The Lord is my shepherd, I lack nothing.',
      'Philippians 4:13': 'I can do all this through him who gives me strength.',
      'Romans 8:28': 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
      'Jeremiah 29:11': 'For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future.',
      'Psalm 27:1': 'The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?'
    };

    return {
      reference,
      text: mockVerses[reference] || 'Mock verse text for development purposes.',
      translation: 'NIV'
    };
  }

  /**
   * Mock search results for development/fallback
   */
  private getMockSearchResults(_query: string, limit: number): BibleSearchResult {
    const mockResults = [
      {
        reference: 'John 3:16',
        text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
        translation: 'NIV'
      },
      {
        reference: '1 John 4:8',
        text: 'Whoever does not love does not know God, because God is love.',
        translation: 'NIV'
      },
      {
        reference: '1 Corinthians 13:4',
        text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.',
        translation: 'NIV'
      }
    ];

    return {
      verses: mockResults.slice(0, limit),
      total: mockResults.length
    };
  }
}