import MainBG from '@/components/Backgrounds/MainBG';
import Button from '@/components/Button';
import AnimatedInput from '@/components/Input/AnimatedInput';
import useTheme from '@/hooks/useTheme';
import { useAuthStore } from '@/store/useAuthStore';
import { APP_VERSION } from '@/utility/config';
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
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
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
  const hasNumber = /\d/.test(password);
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
    formState: { errors, isValid },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const passwordValue = watch('password', '');
  const passwordStrength = useMemo(() => getPasswordStrength(passwordValue), [passwordValue]);

  const onSubmit = async (data: SignupForm) => {
    const result = await signup(data.email, data.password, data.name);
    if (result.success) {
      navigation.navigate('EmailVerification', { email: data.email });
    } else {
      Toast.show({ type: 'error', text1: 'Signup Failed', text2: result.error });
    }
  };

  return (
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
                          <View style={{ height: '100%', width: Number(passwordStrength.width.replace('%', '')) || 0, backgroundColor: passwordStrength.color, borderRadius: 2 }} />
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
              disabled={!isValid || loading}
              className="mb-6 rounded-3xl"
            />

            {/* Footer */}
            <View className="flex-row justify-center items-center">
              <Text style={{ color: colors.textPrimary }}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text className="font-semibold text-primary">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Version - Bottom Right */}
          <View style={{ position: 'absolute', right: 25, bottom: 30 }} pointerEvents="none">
            <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: '600', opacity: 0.7 }}>
              v{APP_VERSION}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </MainBG>
  );
}
