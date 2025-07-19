import { useColorScheme as useColorSchemeNativewind } from 'nativewind';
import { createContext, type ReactNode, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useProfileStore } from '@/features/profile/profileStore';

interface ThemeContextType {
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { setColorScheme } = useColorSchemeNativewind();
  const colorScheme = useColorScheme();
  const { theme } = useProfileStore();

  const isDarkMode = theme === 'DARK' || (theme === 'SYSTEM' && colorScheme === 'dark');

  useEffect(() => {
    setColorScheme(theme === 'LIGHT' ? 'light' : theme === 'DARK' ? 'dark' : 'system');
  }, [theme, setColorScheme]);

  return <ThemeContext.Provider value={{ isDarkMode }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { theme, setTheme } = useProfileStore();

  return {
    theme,
    isDarkMode,
    setTheme,
  };
};

export default ThemeContext;
