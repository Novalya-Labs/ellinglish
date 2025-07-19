import { Image, SafeAreaView, TouchableOpacity, View } from 'react-native'
import Text from '@/components/ui/Text'
import { Link } from 'expo-router'
import ToggleTheme from '@/components/toggle-theme'

const MainScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-pink-200 dark:bg-purple-900 relative">
      <View className='relative px-4 justify-end items-end'>
        <ToggleTheme />
      </View>
      <View className="flex-1 items-center justify-center">
        <Text variant="h1" weight="bold" className="text-7xl text-white leading-snug">Ellinglish</Text>
        <View className='flex-row gap-4 my-4'>
          <Image source={require('@/assets/images/flowers/green_flower.png')} className="w-16 h-16" />
          <Image source={require('@/assets/images/flowers/lilac_flower.png')} className="w-16 h-16" />
          <Image source={require('@/assets/images/flowers/yellow_flower.png')} className="w-16 h-16" />
        </View>
        <Link href="/(public)/words" asChild>
        <TouchableOpacity activeOpacity={1} className="bg-white dark:bg-white rounded-full py-4 px-8 mt-4 active:scale-95 transition-all duration-300">
          <Text variant="h3" weight="bold" className="text-pink-200 dark:text-purple-900">Start now</Text>
        </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  )
}

export default MainScreen