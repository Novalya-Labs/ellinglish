import { Link } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView className="flex-1 bg-pink-200 dark:bg-purple-900" edges={['top']}>
      <View className="px-4 flex-1">
        <Text variant="h1">Themes</Text>
        {loading ? (
          <View className="mt-4">
            <View className="p-4 my-2 bg-gray-100 dark:bg-gray-800 rounded-2xl flex-row items-center gap-2">
              <View className="size-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <View className="h-8 w-[40%] bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </View>
            <View className="p-4 my-2 bg-gray-100 dark:bg-gray-800 rounded-2xl flex-row items-center gap-2">
              <View className="size-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <View className="h-8 w-[40%] bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </View>
            <View className="p-4 my-2 bg-gray-100 dark:bg-gray-800 rounded-2xl flex-row items-center gap-2">
              <View className="size-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <View className="h-8 w-[40%] bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </View>
          </View>
        ) : (
          <FlatList
            data={themes}
            keyExtractor={(item) => item.id.toString()}
            style={{ flexGrow: 1 }}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }: { item: Theme; index: number }) => (
              <Animated.View entering={FadeInUp.delay(index * 100).springify()} key={item.id} className="rounded-2xl">
                <Link href={{ pathname: '/(public)/theme/[slug]', params: { slug: item.slug } }} asChild>
                  <TouchableOpacity
                    className="flex-row items-center justify-between p-4 my-2 bg-gray-100 dark:bg-gray-800 rounded-t-2xl active:scale-90 transition-all duration-100 relative"
                    activeOpacity={1}
                  >
                    <Text variant="h3">{item.name}</Text>
                    <Text variant="h3">{item.progress}%</Text>
                    <View
                      className="absolute bottom-0 left-0 h-1 bg-purple-900 dark:bg-pink-200 rounded-r-full"
                      style={{ width: `${item.progress}%` }}
                    />
                  </TouchableOpacity>
                </Link>
              </Animated.View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default WordsScreen;
