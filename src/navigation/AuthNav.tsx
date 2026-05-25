import EmailVerificationScreen from '@/screens/Auth/EmailVerificationScreen';
import LoginScreen from '@/screens/Auth/LoginScreen';
import SignupScreen from '@/screens/Auth/SignupScreen';
import ForgotPinScreen from '@/screens/Auth/ForgotPinScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  EmailVerification: { email: string };
  ForgotPin: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNav() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
      <Stack.Screen name="ForgotPin" component={ForgotPinScreen} />
    </Stack.Navigator>
  );
}
