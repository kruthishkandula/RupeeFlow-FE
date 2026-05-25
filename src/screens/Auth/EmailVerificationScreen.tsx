import MainBG from '@/components/Backgrounds/MainBG';
import Button from '@/components/Button';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import useTheme from '@/hooks/useTheme';
import { useAuthStore } from '@/store/useAuthStore';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

type Props = {
  navigation: any;
  route: { params: { email: string } };
};

const RESEND_COOLDOWN = 60;

export default function EmailVerificationScreen({ navigation, route }: Readonly<Props>) {
  const { colors, isDark } = useTheme();
  const { sendVerificationEmail, checkEmailVerified, loading, logout } = useAuthStore();
  const email = route?.params?.email ?? '';

  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [checking, setChecking] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cooldown timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  // Auto-poll for email verification every 5 seconds
  useEffect(() => {
    pollRef.current = setInterval(async () => {
      const verified = await checkEmailVerified();
      if (verified) {
        clearInterval(pollRef.current!);
        Toast.show({ type: 'success', text1: 'Email Verified!', text2: 'Welcome to RupeeFlow 🎉' });
      }
    }, 5000);
    return () => clearInterval(pollRef.current!);
  }, []);

  const handleResend = async () => {
    const result = await sendVerificationEmail();
    if (result.success) {
      setCooldown(RESEND_COOLDOWN);
      intervalRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      Toast.show({ type: 'success', text1: 'Email Sent', text2: 'Verification email resent.' });
    } else {
      Toast.show({ type: 'error', text1: 'Failed', text2: result.error });
    }
  };

  const handleCheckManually = async () => {
    setChecking(true);
    const verified = await checkEmailVerified();
    setChecking(false);
    if (!verified) {
      Toast.show({ type: 'info', text1: 'Not Verified Yet', text2: 'Please check your inbox and click the link.' });
    }
  };

  const handleBack = async () => {
    await logout();
    navigation.navigate('Login');
  };

  return (
    <SafeAreaContainer className="flex-1">
      <MainBG>
        <View className="flex-1 px-6 justify-center">
          {/* Icon */}
          <View className="items-center mb-8">
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: isDark ? '#1E3A39' : '#E6F4F3',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ fontSize: 36 }}>📧</Text>
            </View>
          </View>

          {/* Heading */}
          <Text
            className="text-3xl font-bold text-center mb-3"
            style={{ color: colors?.textPrimary }}>
            Verify Your Email
          </Text>
          <Text
            className="text-base text-center mb-2"
            style={{ color: isDark ? '#9E9E9E' : '#616161' }}>
            We've sent a verification link to
          </Text>
          <Text
            className="text-base font-semibold text-center mb-8"
            style={{ color: '#2F7E79' }}>
            {email}
          </Text>

          <Text
            className="text-sm text-center mb-8"
            style={{ color: isDark ? '#9E9E9E' : '#616161' }}>
            Click the link in your email to verify your account. This page will update automatically once verified.
          </Text>

          {/* Check manually */}
          <Button
            title="I've Verified My Email"
            onPress={handleCheckManually}
            loading={checking}
            disabled={checking}
            variant="primary"
            className="mb-4 rounded-3xl"
          />

          {/* Resend */}
          <TouchableOpacity
            className="items-center mb-6 py-3"
            onPress={handleResend}
            disabled={cooldown > 0 || loading}>
            <Text
              className="font-medium"
              style={{ color: cooldown > 0 ? (isDark ? '#555' : '#aaa') : '#2F7E79' }}>
              {cooldown > 0
                ? `Resend Email (${cooldown}s)`
                : 'Resend Verification Email'}
            </Text>
          </TouchableOpacity>

          {/* Back to login */}
          <TouchableOpacity className="items-center" onPress={handleBack}>
            <Text style={{ color: isDark ? '#9E9E9E' : '#616161' }}>
              Back to{' '}
              <Text className="font-semibold" style={{ color: '#2F7E79' }}>
                Sign In
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </MainBG>
    </SafeAreaContainer>
  );
}
