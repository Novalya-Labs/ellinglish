import { Stack } from 'expo-router'

const PublicLayout: React.FC = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}> 
      <Stack.Screen name="index" />
      <Stack.Screen name="words" options={{ animation: 'fade' }} />
    </Stack>
  )
}

export default PublicLayout