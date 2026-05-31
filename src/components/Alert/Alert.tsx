import { commonColors } from '@/Themes/theme-config';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import Toast, { ToastConfig, ToastConfigParams } from 'react-native-toast-message';
import AppText from '../AppText';

// ─── Types ───────────────────────────────────────────────────────────────────

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertOptions {
  title: string;
  message?: string;
  position?: 'top' | 'bottom';
  duration?: number;
}

// ─── Per-type config ──────────────────────────────────────────────────────────

const typeConfig: Record<AlertType, { bg: string; border: string; icon: string }> = {
  success: { bg: '#F0FDF4', border: commonColors.success, icon: '✓' },
  error: { bg: '#FEF2F2', border: commonColors.error, icon: '✕' },
  warning: { bg: '#FFFBEB', border: commonColors.warning, icon: '!' },
  info: { bg: '#EFF6FF', border: commonColors.info, icon: 'i' },
};

// ─── Custom Toast UI ──────────────────────────────────────────────────────────

function CustomToast({ type, text1, text2 }: Readonly<ToastConfigParams<any>>) {
  const t = typeConfig[type as AlertType] ?? typeConfig.info;

  return (
    <View style={[styles.container, { backgroundColor: t.bg, borderLeftColor: t.border }]}>
      <View style={[styles.iconWrapper, { backgroundColor: t.border }]}>
        <AppText style={styles.icon}>{t.icon}</AppText>
      </View>
      <View style={styles.textWrapper}>
        {!!text1 && <AppText style={styles.title} numberOfLines={1}>{text1}</AppText>}
        {!!text2 && <AppText style={styles.message} numberOfLines={2}>{text2}</AppText>}
      </View>
    </View>
  );
}

// ─── Toast config (pass this to <Toast config={toastConfig} /> in App.tsx) ───

export const toastConfig: ToastConfig = {
  success: (props) => <CustomToast {...props} />,
  error: (props) => <CustomToast {...props} />,
  warning: (props) => <CustomToast {...props} />,
  info: (props) => <CustomToast {...props} />,
};

// ─── Alert utility ────────────────────────────────────────────────────────────

const Alert = {
  show(type: AlertType, { title, message, position = 'bottom', duration = 3000 }: AlertOptions) {
    console.log('position', position)
    Toast.show({
      type,
      text1: title,
      text2: message,
      position,
      visibilityTime: duration,
    });
  },
  success(options: AlertOptions) { this.show('success', options); },
  error(options: AlertOptions) { this.show('error', options); },
  warning(options: AlertOptions) { this.show('warning', options); },
  info(options: AlertOptions) { this.show('info', options); },
  hide() { Toast.hide(); },
};

export default Alert;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    paddingVertical: 12,
    paddingRight: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  message: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
    marginTop: 2,
  },
});
