import { Link } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import Text from '@/components/ui/Text';
import { useThemeStore } from '@/features/themes/themeStore';
import type { Theme } from '@/features/themes/themeTypes';

const WordsScreen = () => {
  const { themes, getThemes, loading } = useThemeStore();

  useEffect(() => {
    getThemes();
  }, [getThemes]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Loading themes...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="p-4">
        <Text variant="h1">Themes</Text>
        <FlatList
          data={themes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }: { item: Theme }) => (
            <Link
              href={{
                pathname: '/(public)/theme/[slug]',
                params: { slug: item.slug },
              }}
              asChild
            >
              <TouchableOpacity className="p-4 my-2 bg-gray-100 dark:bg-gray-800 rounded-lg active:opacity-70">
                <Text variant="h3">{item.name}</Text>
              </TouchableOpacity>
            </Link>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default WordsScreen;
