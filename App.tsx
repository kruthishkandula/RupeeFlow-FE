import { toastConfig } from '@/components/Alert/Alert'
import RootNav from '@/navigation/RootNav'
import { generateTailwindColorsConfig } from '@/Themes/theme-helper'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { LogBox } from 'react-native'
import Toast from 'react-native-toast-message'
import "./global.css"

const App = () => {
  generateTailwindColorsConfig()


  LogBox.ignoreLogs(['warning'])

  return (
    <NavigationContainer>
      <RootNav />
      <Toast config={toastConfig} />
    </NavigationContainer>
  )
}

export default App