import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Env } from '@/constants/Env';
import { getWordsByTheme } from './get-words-by-theme/getWordsByTheme';
import { updateWordProgress } from './update-word-progress/updateWordProgress';
import type { GameState, GameStore } from './wordTypes';

export const initialGameState: GameState = {
  words: [],
  currentWordIndex: 0,
  score: 0,
  loading: true,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialGameState,

      fetchWords: async (themeSlug) => {
        set({ loading: true });
        try {
          const words = await getWordsByTheme(themeSlug);
          // Randomize word order for replayability
          const shuffledWords = words.sort(() => Math.random() - 0.5);
          set({ words: shuffledWords, loading: false });
        } catch (error) {
          console.error(error);
          set({ loading: false });
        }
      },

      answerCorrectly: (payload) => {
        const { words, currentWordIndex } = get();
        const currentWord = words[currentWordIndex];

        if (currentWord) {
          updateWordProgress(payload).catch(console.error);
        }

        set({ score: get().score + 1 });
        get().nextWord();
      },

      answerIncorrectly: (payload) => {
        // Logic for incorrect answer (e.g., reset streak) can be added here
        updateWordProgress(payload).catch(console.error);
        get().nextWord();
      },

      nextWord: () => {
        const { words, currentWordIndex, score } = get();

        if (currentWordIndex < words.length - 1) {
          set({ currentWordIndex: currentWordIndex + 1 });
        } else {
          console.log('Game Over! Final Score:', score);
        }
      },

      resetGame: () => {
        set(initialGameState);
      },
    }),
    {
      name: `game-${Env.APP_SLUG}`,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
