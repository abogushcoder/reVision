import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * @typedef {import('../models/books.js').Highlight} Highlight
 * @typedef {import('../models/books.js').ReadingState} ReadingState
 */

const KEYS = {
    READING_STATE: 'reading_state_',
    HIGHLIGHTS: 'highlights_',
    SUMMARIES: 'summaries_'
};

export async function saveReadingState(bookId: string, state: any) {
    try {
        await AsyncStorage.setItem(
            `${KEYS.READING_STATE}${bookId}`,
            JSON.stringify(state)
        );
    } catch (error) {
        console.error('Error saving reading state:', error);
    }
}

export async function getReadingState(bookId: string) {
    try {
        const data = await AsyncStorage.getItem(`${KEYS.READING_STATE}${bookId}`);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting reading state:', error);
        return null;
    }
}

 export async function getHighlights(bookId: string): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(`${KEYS.HIGHLIGHTS}${bookId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting highlights:', error);
      return [];
    }
  }

export async function saveHighlight(bookId: string, highlight: any) {
    try {
      const highlights = await getHighlights(bookId);
      highlights.push(highlight);
      await AsyncStorage.setItem(
        `${KEYS.HIGHLIGHTS}${bookId}`,
        JSON.stringify(highlights)
      );
    } catch (error) {
      console.error('Error saving highlight:', error);
    }
  }

   export async function deleteHighlight(bookId: string, highlightId: string) {
    try {
      const highlights = await getHighlights(bookId);
      const filtered = highlights.filter((h) => h.id !== highlightId);
      await AsyncStorage.setItem(
        `${KEYS.HIGHLIGHTS}${bookId}`,
        JSON.stringify(filtered)
      );
    } catch (error) {
      console.error('Error deleting highlight:', error);
    }
  }

   export async function saveSummary(key: string, summary: string) {
    try {
      await AsyncStorage.setItem(`${KEYS.SUMMARIES}${key}`, summary);
    } catch (error) {
      console.error('Error saving summary:', error);
    }
  }

  export async function getSummary(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(`${KEYS.SUMMARIES}${key}`);
    } catch (error) {
      console.error('Error getting summary:', error);
      return null;
    }
  }