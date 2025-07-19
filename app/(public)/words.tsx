import { KeyboardAvoidingView, Platform, SafeAreaView, TextInput, View, Animated } from 'react-native'
import Text from '@/components/ui/Text'
import { useTheme } from '@/contexts/theme-context'
import { Confetti, ConfettiMethods } from 'react-native-fast-confetti';
import { useEffect, useRef, useState } from 'react';
import { getRandomWord, normalizeText, type WordPair } from '@/constants/Words'
import * as Haptics from 'expo-haptics';

const WordsScreen: React.FC = () => {
  const { isDarkMode } = useTheme()
  const confettiRef = useRef<ConfettiMethods>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const [inputText, setInputText] = useState('')
  const [currentWord, setCurrentWord] = useState<WordPair>(getRandomWord())
  const [streak, setStreak] = useState(0)
  const [isError, setIsError] = useState(false)

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

  const handleError = () => {
    setIsError(true)
    
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      setIsError(false)
    });
  }

  useEffect(() => {
    const userAnswer = normalizeText(inputText)
    const correctAnswer = normalizeText(currentWord.answer)

    const answerLength = userAnswer.length
    const correctAnswerLength = correctAnswer.length
    
    if (userAnswer && userAnswer === correctAnswer) {
      setStreak(prev => prev + 1)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      setInputText('')
      handleNextWord()
    } else if (answerLength === correctAnswerLength) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      handleError()
      setStreak(0)
      setInputText('')
    }
  }, [inputText, currentWord])

  return (
    <>
      <SafeAreaView className="flex-1 bg-pink-200 dark:bg-purple-900 relative">
        <View className='relative flex-row items-center justify-center px-4'>
          <Text variant="h1" weight="bold" className="text-lg text-white">
            🔥 {streak}
          </Text>
        </View>
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 items-center justify-center gap-4 px-4">
            <Animated.View style={{ 
              opacity: fadeAnim,
              transform: [{ translateX: shakeAnim }]
            }}>
              <Text 
                variant="h1" 
                weight="bold" 
                className="text-7xl leading-snug text-center"
                style={{ color: isError ? '#ef4444' : 'white' }}
              >
                {currentWord.word}
              </Text>
            </Animated.View>
            <TextInput 
              className="bg-white dark:bg-white rounded-full py-6 px-8 mt-4 active:scale-95 transition-all duration-300 w-md max-w-lg text-center" 
              placeholder="Enter your answer" 
              placeholderTextColor={isDarkMode ? '#581c87' : '#fbcfe8'} 
              style={{ color: isDarkMode ? '#581c87' : '#fbcfe8' }}
              autoFocus
              autoCorrect={false}
              autoComplete='off'
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