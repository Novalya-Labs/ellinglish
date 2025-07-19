import { Image, KeyboardAvoidingView, Platform, SafeAreaView, TextInput, View, Animated } from 'react-native'
import Text from '@/components/ui/Text'
import { useTheme } from '@/contexts/theme-context'
import { Confetti, ConfettiMethods } from 'react-native-fast-confetti';
import { useEffect, useRef, useState } from 'react';
import { getRandomWord, normalizeText, type WordPair } from '@/constants/Words'

const WordsScreen: React.FC = () => {
  const { isDarkMode } = useTheme()
  const confettiRef = useRef<ConfettiMethods>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [inputText, setInputText] = useState('')
  const [currentWord, setCurrentWord] = useState<WordPair>(getRandomWord())
  const [streak, setStreak] = useState(0)

  const handleNextWord = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    setTimeout(() => {
      setCurrentWord(getRandomWord())
    }, 200);
  }

  useEffect(() => {
    const userAnswer = normalizeText(inputText)
    const correctAnswer = normalizeText(currentWord.answer)
    
    if (userAnswer && userAnswer === correctAnswer) {
      confettiRef.current?.restart()
      setStreak(prev => prev + 1)
      setInputText('')
      handleNextWord()
    }
  }, [inputText, currentWord])

  return (
    <>
      <SafeAreaView className="flex-1 bg-pink-200 dark:bg-purple-900 relative">
        <View className="absolute top-4 left-4 z-10">
          <Text variant="h1" weight="bold" className="text-lg text-white">
            🔥 {streak}
          </Text>
        </View>
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          className="flex-1"
        >
          <View className='flex-row gap-4 my-4 items-center justify-center'>
            <Image source={require('@/assets/images/flowers/lilac_flower.png')} className="w-8 h-8" />
            <Text variant="h1" weight="bold" className="text-xl text-white">Ellinglish</Text>
            <Image source={require('@/assets/images/flowers/yellow_flower.png')} className="w-8 h-8" />
          </View>
          <View className="flex-1 items-center justify-center gap-4 px-4">
            <Animated.View style={{ opacity: fadeAnim }}>
              <Text variant="h1" weight="bold" className="text-7xl text-white leading-snug text-center">
                {currentWord.word}
              </Text>
            </Animated.View>
            <TextInput 
              className="bg-white dark:bg-white rounded-full py-4 px-8 mt-4 active:scale-95 transition-all duration-300 min-w-full" 
              placeholder="Enter your answer" 
              placeholderTextColor={isDarkMode ? '#581c87' : '#fbcfe8'} 
              style={{ color: isDarkMode ? '#581c87' : '#fbcfe8' }}
              autoFocus
              value={inputText}
              onChangeText={setInputText}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <Confetti ref={confettiRef} count={200} fallDuration={3000} blastDuration={1000} autoplay={false} />
    </>
  )
}

export default WordsScreen