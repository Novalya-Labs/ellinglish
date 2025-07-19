import { Link, Stack } from 'expo-router';
import type React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '@/components/ui/Text';

const NotFoundScreen: React.FC = () => {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text>This screen does not exist.</Text>
        <Link href="/" style={styles.link}>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});

export default NotFoundScreen;
