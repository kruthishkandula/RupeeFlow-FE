import ChangeTheme from '@/screens/ChangeTheme'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import BottomNav from './BottomNav'
import Add from '@/screens/Expense/Add'
import ExpenseDetail from '@/screens/Expense/ExpenseDetail'
import Transactions from '@/screens/History'

const MainStack = createNativeStackNavigator()

export default function MainNav() {
    return (
        <MainStack.Navigator screenOptions={{
            headerShown: false
        }}>
            <MainStack.Screen name="Home" component={BottomNav} />
            <MainStack.Screen name="ChangeTheme" component={ChangeTheme} />
            <MainStack.Screen name="AddExpense" component={Add} />
            <MainStack.Screen name="ExpenseDetail" component={ExpenseDetail} />
            <MainStack.Screen name="Transactions" component={Transactions} />
        </MainStack.Navigator>
    )
}