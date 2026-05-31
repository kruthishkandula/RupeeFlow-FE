import AppText from '@/components/AppText';
import MainBG from '@/components/Backgrounds/MainBG';
import Button from '@/components/Button';
import AnimatedInput from '@/components/Input/AnimatedInput';
import OverlayLoader from '@/components/Loader/OverlayLoader';
import useTheme from '@/hooks/useTheme';
import { useAuthStore } from '@/store/useAuthStore';
import { APP_VERSION } from '@/utility/config';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email')
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val), {
      message: 'Enter a valid email address',
    })
    .refine((val) => !val.includes('+'), {
      message: 'Email aliases with "+" are not allowed',
    }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

type Props = {
  navigation: any;
};

export default function LoginScreen({ navigation }: Readonly<Props>) {
  const { colors, isDark } = useTheme()
  const { login, loading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    const result = await login(data.email, data.password);
    if (!result.success) {
      if (result.requiresVerification) {
        navigation.navigate('EmailVerification', { email: data.email });
      } else {
        Toast.show({ type: 'error', text1: 'Login Failed', text2: result.error });
      }
    }
  };

  return (
    <MainBG>
      <OverlayLoader open={loading} text='Loading...' />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-6 justify-center">
            {/* Header */}
            <View className="mb-10">
              <AppText 
                className="text-4xl font-bold mb-2"
                style={{ color: colors?.textPrimary }}>
                Welcome Back 👋
              </AppText>
              <AppText 
                className="text-base"
                style={{ color: colors?.textPrimary }}>
                Sign in to manage your finances
              </AppText>
            </View>

            {/* Form */}
            <View className="gap-y-5 mb-8">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <AnimatedInput
                    label="Email Address"
                    value={value}
                    onChange={onChange}
                    keyboardType="email-address"
                    error={errors.email?.message}
                    isDark={isDark}
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <AnimatedInput
                    label="Password"
                    value={value}
                    onChange={onChange}
                    error={errors.password?.message}
                    isDark={isDark}
                    secureTextEntry
                    autoComplete="current-password"
                    textContentType="password"
                  />
                )}
              />
            </View>

            {/* Submit */}
            <Button
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading || !isValid}
              variant='primary'
              className="mb-4 rounded-3xl"
            />

            {/* Forgot Password */}
            <TouchableOpacity
              className="items-center mb-6"
              onPress={() => navigation.navigate('ForgotPin')}>
              <AppText className="font-medium text-primary">
                Forgot PIN?
              </AppText>
            </TouchableOpacity>

            {/* Footer */}
            <View className="flex-row justify-center items-center">
              <AppText style={{ color: colors.textPrimary }}>
                Don't have an account?{' '}
              </AppText>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <AppText className="font-semibold text-primary">
                  Sign Up
                </AppText>
              </TouchableOpacity>
            </View>
            {/* Version - Bottom Right */}
            <View style={{ position: 'absolute', right: 25, bottom: 30 }} pointerEvents="none">
              <AppText style={{ color: colors.textPrimary, fontSize: 12, fontWeight: '600', opacity: 0.7 }}>
                v{APP_VERSION}
              </AppText>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </MainBG >
  );
}
