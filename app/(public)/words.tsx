import { Link } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, TouchableOpacity, View } from 'react-native';
import Text from '@/components/ui/Text';
import { useThemeStore } from '@/features/themes/themeStore';
import type { Theme } from '@/features/themes/themeTypes';

const WordsScreen = () => {
  const { themes, getThemes, loading } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getThemes();
  }, [getThemes]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getThemes();
    setRefreshing(false);
  }, [getThemes]);

  return (
    <SafeAreaView className="flex-1 bg-pink-200 dark:bg-purple-900">
      <View className="p-4 flex-1">
        <Text variant="h1">Themes</Text>
        {loading ? (
          <View className="mt-4">
            <View className="p-4 my-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex-row items-center gap-2">
              <View className="size-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <View className="h-8 w-[40%] bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </View>
            <View className="p-4 my-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex-row items-center gap-2">
              <View className="size-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <View className="h-8 w-[40%] bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </View>
            <View className="p-4 my-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex-row items-center gap-2">
              <View className="size-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <View className="h-8 w-[40%] bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </View>
          </View>
        ) : (
          <FlatList
            data={themes}
            keyExtractor={(item) => item.id.toString()}
            style={{ flexGrow: 1, paddingTop: 16 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }: { item: Theme }) => (
              <Link href={{ pathname: '/(public)/theme/[slug]', params: { slug: item.slug } }} asChild>
                <TouchableOpacity className="p-4 my-2 bg-gray-100 dark:bg-gray-800 rounded-lg active:opacity-70">
                  <Text variant="h3">{item.name}</Text>
                </TouchableOpacity>
              </Link>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default WordsScreen;
