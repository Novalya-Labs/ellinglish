import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import Text from '@/components/ui/Text';

const NotFoundScreen: React.FC = () => {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-5 bg-pink-200 dark:bg-purple-900 gap-8">
        <Text variant="h1" center>
          This screen does not exist.
        </Text>
        <Link href="/" className="mt-15 py-15 active:scale-95 transition-all duration-300" replace>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
};

export default NotFoundScreen;
