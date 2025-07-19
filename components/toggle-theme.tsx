import { useTheme } from '@/contexts/theme-context'
import { MoonIcon, SunIcon } from 'lucide-react-native'
import { Switch, View } from 'react-native'
import { type ClassNameValue, twMerge } from 'tailwind-merge'

interface ToggleThemeProps {
  className?: ClassNameValue
}

const ToggleTheme: React.FC<ToggleThemeProps> = ({ className }) => {
  const { isDarkMode, setTheme } = useTheme()
  return (
    <View className={twMerge('flex-row items-center gap-2', className)}>
      <SunIcon size={18} color={isDarkMode ? '#fbcfe8' : '#581c87'} />
      <Switch
        value={isDarkMode}
        trackColor={{ true: '#737373', false: '#fbcfe8' }}
        thumbColor={isDarkMode ? '#581c87' : '#fbcfe8'}
        ios_backgroundColor={isDarkMode ? '#737373' : '#737373'}
        onValueChange={() => setTheme(isDarkMode ? 'LIGHT' : 'DARK')}
      />
      <MoonIcon size={18} color={isDarkMode ? '#fbcfe8' : '#581c87'} />
    </View>
  )
}

export default ToggleTheme