import RootNav from '@/navigation/RootNav'
import { generateTailwindColorsConfig } from '@/Themes/theme-helper'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import "./global.css"

const App = () => {
  generateTailwindColorsConfig()

  return (
    <NavigationContainer>
      <RootNav />
    </NavigationContainer>
  )
}

export default App