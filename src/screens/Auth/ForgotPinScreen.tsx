import AppText, { nf } from '@/components/AppText';
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
import { KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

const forgotPinSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
});
type ForgotPinForm = z.infer<typeof forgotPinSchema>;

type Props = { navigation: any };

export default function ForgotPinScreen({ navigation }: Readonly<Props>) {
  const { colors, isDark } = useTheme();
  const { loading, sendPinResetEmail } = useAuthStore();
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<ForgotPinForm>({ resolver: zodResolver(forgotPinSchema) });

  const onSubmit = async (data: ForgotPinForm) => {
    const result = await sendPinResetEmail(data.email);
    if (result.success) {
      Toast.show({ type: 'success', text1: 'Reset Email Sent', text2: 'Check your inbox for instructions.' });
      navigation.goBack();
    } else {
      Toast.show({ type: 'error', text1: 'Error', text2: result.error });
    }
  };

  return (
    <MainBG>
      <SafeAreaContainer>
        <OverlayLoader open={loading} text="Loading..." />
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View className="flex-1 px-6 justify-center">
            <AppText className="font-bold mb-6" style={{ color: colors?.textPrimary, fontSize: nf(16) }}>Forgot PIN</AppText>
            <AppText className="mb-8" style={{ color: colors?.textPrimary, fontSize: nf(14) }}>Enter your email to reset your PIN.</AppText>
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
            <Button
              title="Send Reset Email"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading || !isValid}
              variant="primary"
              className="mt-8 rounded-3xl"
            />
            <TouchableOpacity className="items-center mt-6" onPress={() => navigation.goBack()}>
              <AppText className="font-medium text-primary">Back to Login</AppText>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaContainer>
    </MainBG>
  );
}
