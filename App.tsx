import RootNav from '@/navigation/RootNav'
import { generateTailwindColorsConfig } from '@/Themes/theme-helper'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import "./global.css"

const App = () => {
  generateTailwindColorsConfig()

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNav />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default App