import ChangeTheme from '@/screens/ChangeTheme'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import BottomNav from './BottomNav'

const MainStack = createNativeStackNavigator()

export default function MainNav() {
    return (
        <MainStack.Navigator screenOptions={{
            headerShown: false
        }}>
            <MainStack.Screen name="Home" component={BottomNav} />
            <MainStack.Screen name="ChangeTheme" component={ChangeTheme} />
        </MainStack.Navigator>
    )
}