import LoginScreen from '@/screens/Auth/LoginScreen';
import SignupScreen from '@/screens/Auth/SignupScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNav() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}
