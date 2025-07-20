export type Theme = {
  id: number;
  slug: string;
  name: string;
  required_mastery_level: number;
};

export type ThemeState = {
  themes: Theme[];
  loading: boolean;
};

export type ThemeActions = {
  getThemes: () => Promise<void>;
};

export type ThemeStore = ThemeState & ThemeActions;
