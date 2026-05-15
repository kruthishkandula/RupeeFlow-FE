import Icon from '@/components/Icon'
import SafeAreaContainer from '@/components/SafeAreaContainer'
import useTheme from '@/hooks/useTheme'
import { useAuthStore } from '@/store/useAuthStore'
import { APP_VERSION } from '@/utility/config'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import MainBG from '../../components/Backgrounds/MainBG'
import DynamicHeader from '../../components/Header/DynamicHeader'

const SETTINGS = [
  {
    id: 'theme',
    title: 'Change Theme',
    subtitle: 'Customize app appearance',
    route: 'ChangeTheme',
    icon: 'Moon',
    iconBg: '#8B5CF6',
    is_active: true,
  },
  {
    id: 'about',
    title: 'About RupeeFlow',
    subtitle: 'Version & app info',
    route: 'About',
    icon: 'info',
    iconBg: '#3B82F6',
    is_active: true,
  },
  {
    id: 'support',
    title: 'Support',
    subtitle: 'Get help & contact us',
    route: 'Help',
    icon: 'MessageCircle',
    iconBg: '#10B981',
    is_active: true,
  },
]

export default function Profile() {
  const { colors, isDark } = useTheme();
  const { navigate } = useNavigation<any>();
  const { user, logout } = useAuthStore();

  const [logoutVisible, setLogoutVisible] = useState(false);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleLogout = () => setLogoutVisible(true);

  return (
    <MainBG>
      <SafeAreaContainer className='flex-1'>
        <DynamicHeader
          title='Profile'
          rightComponent={<Icon name='Bell' size={24} color={colors.textPrimary} />}
        />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

          {/* Avatar Card */}
          <View
            className='mx-4 mt-6 rounded-3xl items-center py-8'
            style={{ backgroundColor: colors.surfaceBase }}>
            <View style={{
              width: 90, height: 90, borderRadius: 45,
              backgroundColor: '#2F7E79',
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 3, borderColor: '#2F7E7940',
            }}>
              <Text style={{ fontSize: 34, color: '#fff', fontWeight: '800' }}>{initials}</Text>
            </View>
            <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '700', marginTop: 14 }}>
              {displayName}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>{email}</Text>
          </View>

          {/* Settings */}
          <View
            className='mx-4 mt-5 pt-8 rounded-3xl overflow-hidden'
            style={{ backgroundColor: colors.surfaceBase }}>
            {SETTINGS.filter(s => s.is_active).map((item, index, arr) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => navigate(item.route)}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  paddingHorizontal: 20, paddingVertical: 16,
                  borderBottomWidth: index < arr.length - 1 ? 1 : 0,
                  borderBottomColor: isDark ? '#2a2a2a' : '#F5F5F5',
                }}>
                <View style={{
                  width: 40, height: 40, borderRadius: 12,
                  backgroundColor: item.iconBg + '20',
                  alignItems: 'center', justifyContent: 'center', marginRight: 14,
                }}>
                  <Icon name={item.icon} size={20} color={item.iconBg} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '600' }}>{item.title}</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>{item.subtitle}</Text>
                </View>
                <Icon name='ChevronRight' size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            className='mx-4 mt-4 rounded-2xl py-4 flex-row items-center justify-center gap-2'
            style={{ backgroundColor: '#EF444415', borderWidth: 1, borderColor: '#EF444430' }}>
            <Icon name='LogOut' size={20} color='#EF4444' />
            <Text style={{ color: '#EF4444', fontSize: 15, fontWeight: '700' }}>Logout</Text>
          </TouchableOpacity>

          <View className='flex-1 justify-center items-center mt-8' >
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>Version {APP_VERSION}</Text>
          </View>

        </ScrollView>

        {/* Custom Logout Modal */}
        <Modal
          visible={logoutVisible}
          transparent
          animationType='slide'
          onRequestClose={() => setLogoutVisible(false)}>
          <Pressable
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' }}
            onPress={() => setLogoutVisible(false)}>
            <Pressable onPress={e => e.stopPropagation()}>
              <View style={{
                backgroundColor: colors.surfaceBase,
                borderTopLeftRadius: 28, borderTopRightRadius: 28,
                padding: 28, paddingBottom: 40,
              }}>
                {/* Icon */}
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                  <View style={{
                    width: 64, height: 64, borderRadius: 32,
                    backgroundColor: '#EF444418',
                    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                  }}>
                    <Icon name='LogOut' size={28} color='#EF4444' />
                  </View>
                  <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '800' }}>
                    Logout
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 8, textAlign: 'center', lineHeight: 20 }}>
                    Are you sure you want to logout?{`\n`}You'll need to sign in again to access your data.
                  </Text>
                </View>

                {/* User pill */}
                <View style={{
                  flexDirection: 'row', alignItems: 'center', gap: 12,
                  backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
                  borderRadius: 16, padding: 14, marginBottom: 24,
                }}>
                  <View style={{
                    width: 40, height: 40, borderRadius: 20,
                    backgroundColor: '#2F7E79',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>{initials}</Text>
                  </View>
                  <View>
                    <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 14 }}>{displayName}</Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{email}</Text>
                  </View>
                </View>

                {/* Buttons */}
                <TouchableOpacity
                  onPress={async () => { setLogoutVisible(false); await logout(); }}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: '#EF4444', borderRadius: 16,
                    paddingVertical: 16, alignItems: 'center', marginBottom: 12,
                  }}>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Yes, Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setLogoutVisible(false)}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: isDark ? '#2a2a2a' : '#F0F0F0',
                    borderRadius: 16, paddingVertical: 16, alignItems: 'center',
                  }}>
                  <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

      </SafeAreaContainer>
    </MainBG>
  )
}