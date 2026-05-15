import MainBG from '@/components/Backgrounds/MainBG';
import Button from '@/components/Button';
import AnimatedInput from '@/components/Input/AnimatedInput';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import useTheme from '@/hooks/useTheme';
import { useAuthStore } from '@/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useMemo } from 'react';
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

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupForm = z.infer<typeof signupSchema>;

type Props = {
  navigation: any;
};

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
  if (!password) return { label: '', color: 'transparent', width: '0%' };
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score = [password.length >= 8, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  if (score <= 2) return { label: 'Weak', color: '#EF4444', width: '33%' };
  if (score <= 3) return { label: 'Fair', color: '#F59E0B', width: '60%' };
  if (score === 4) return { label: 'Good', color: '#3B82F6', width: '80%' };
  return { label: 'Strong', color: '#22C55E', width: '100%' };
}

export default function SignupScreen({ navigation }: Readonly<Props>) {
  const { isDark, colors } = useTheme();
  const { signup, loading } = useAuthStore();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const passwordValue = watch('password', '');
  const passwordStrength = useMemo(() => getPasswordStrength(passwordValue), [passwordValue]);

  const onSubmit = async (data: SignupForm) => {
    const result = await signup(data.email, data.password, data.name);
    if (result.success) {
      Toast.show({ type: 'success', text1: 'Account created!', text2: 'Welcome to RupeeFlow 🎉' });
    } else {
      Toast.show({ type: 'error', text1: 'Signup Failed', text2: result.error });
    }
  };

  return (
    <SafeAreaContainer className='flex-1'>
      <MainBG>
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
                  Create Account ✨
                </Text>
                <Text
                  className="text-base"
                  style={{
                    color: colors?.textPrimary
                  }}>
                  Start tracking your finances today
                </Text>
              </View>

              {/* Form */}
              <View className="gap-y-5 mb-8">
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <AnimatedInput
                      label="Full Name"
                      value={value}
                      onChange={onChange}
                      error={errors.name?.message}
                      isDark={isDark}
                      autoCapitalize="words"
                      autoComplete="name"
                      textContentType="name"
                    />
                  )}
                />
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
                    <>
                      <AnimatedInput
                        label="Password"
                        value={value}
                        onChange={onChange}
                        error={errors.password?.message}
                        isDark={isDark}
                        secureTextEntry
                        autoComplete="new-password"
                        textContentType="newPassword"
                      />
                      {!!value && (
                        <View style={{ marginTop: -16, marginBottom: 16 }}>
                          <View style={{ height: 4, borderRadius: 2, backgroundColor: isDark ? '#3A3A4A' : '#E5E7EB', overflow: 'hidden' }}>
                            <View style={{ height: '100%', width: passwordStrength.width, backgroundColor: passwordStrength.color, borderRadius: 2 }} />
                          </View>
                          <Text style={{ fontSize: 11, color: passwordStrength.color, marginTop: 4, fontWeight: '600' }}>
                            {passwordStrength.label}
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                />
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, value } }) => (
                    <AnimatedInput
                      label="Confirm Password"
                      value={value}
                      onChange={onChange}
                      error={errors.confirmPassword?.message}
                      isDark={isDark}
                      secureTextEntry
                      autoComplete="new-password"
                      textContentType="newPassword"
                    />
                  )}
                />
              </View>

              {/* Submit */}
              <Button
                title="Create Account"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                disabled={loading}
                className="mb-6 rounded-3xl"
              />

              {/* Footer */}
              <View className="flex-row justify-center items-center">
                <Text style={{ color: isDark ? '#9E9E9E' : '#616161' }}>
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text className="font-semibold" style={{ color: '#2F7E79' }}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </MainBG>
    </SafeAreaContainer >
  );
}
