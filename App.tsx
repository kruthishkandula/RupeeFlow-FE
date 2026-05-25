import { toastConfig } from '@/components/Alert/Alert'
import FirebaseNotificationProvider from '@/components/Providers/FirebaseNotificationProvider'
import { navigationRef } from '@/navigation/navigationRef'
import RootNav from '@/navigation/RootNav'
import { generateTailwindColorsConfig } from '@/Themes/theme-helper'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { LogBox } from 'react-native'
import Toast from 'react-native-toast-message'
import "./global.css"
import { SafeAreaProvider } from 'react-native-safe-area-context'

const App = () => {
  generateTailwindColorsConfig()

  LogBox.ignoreLogs(['warning'])

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <RootNav />
        <FirebaseNotificationProvider />
        <Toast config={toastConfig} />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default App