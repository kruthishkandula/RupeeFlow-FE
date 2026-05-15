import MainBG from '@/components/Backgrounds/MainBG';
import Button from '@/components/Button';
import AnimatedInput from '@/components/Input/AnimatedInput';
import OverlayLoader from '@/components/Loader/OverlayLoader';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import useTheme from '@/hooks/useTheme';
import { useAuthStore } from '@/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
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
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    const result = await login(data.email, data.password);
    console.log('result---', result)
    if (!result.success) {
      Toast.show({ type: 'error', text1: 'Login Failed', text2: result.error });
    }
  };

  return (
    <SafeAreaContainer className='flex-1'>
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
                <Text
                  className="text-4xl font-bold mb-2"
                  style={{ color: colors?.textPrimary }}>
                  Welcome Back 👋
                </Text>
                <Text
                  className="text-base"
                  style={{ color: colors?.textPrimary }}>
                  Sign in to manage your finances
                </Text>
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
                disabled={loading}
                variant='primary'
                className="mb-4 rounded-3xl"
              />

              {/* Forgot Password */}
              <TouchableOpacity
                className="items-center mb-6"
                onPress={() => navigation.navigate('ForgotPassword')}>
                <Text className="font-medium" style={{ color: '#2F7E79' }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Footer */}
              <View className="flex-row justify-center items-center">
                <Text style={{ color: isDark ? '#9E9E9E' : '#616161' }}>
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text className="font-semibold" style={{ color: '#2F7E79' }}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </MainBG >
    </SafeAreaContainer>
  );
}
