import type { GetWordsByThemePayload } from './get-words-by-theme/getWordsByTheme';
import type { UpdateWordProgressPayload } from './update-word-progress/updateWordProgress';

export type Word = {
  id: number;
  text_en: string;
  text_fr: string;
};

export type GameState = {
  words: Word[];
  currentWordIndex: number;
  score: number;
  loading: boolean;
};

export type GameActions = {
  fetchWords: (payload: GetWordsByThemePayload) => Promise<void>;
  answerCorrectly: (payload: UpdateWordProgressPayload) => void;
  answerIncorrectly: (payload: UpdateWordProgressPayload) => void;
  nextWord: () => void;
  resetGame: () => void;
};

export type GameStore = GameState & GameActions;
