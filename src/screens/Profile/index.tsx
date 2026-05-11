import Icon from '@/components/Icon'
import SafeAreaContainer from '@/components/SafeAreaContainer'
import useTheme from '@/hooks/useTheme'
import { gpsw } from '@/style/theme'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import MainBG from '../../components/Backgrounds/MainBG'
import DynamicHeader from '../../components/Header/DynamicHeader'

const settingsCms = {
  order_options: [
    {
      id: 0,
      title: 'Orders',
      route: 'Orders',
      icon: 'truck-delivery-outline',
      iconSet: 'MaterialCommunityIcons',
      size: 28,
      is_active: true,
    },
    {
      id: 1,
      title: '(Balance)',
      route: 'Balance',
      icon: 'wallet-outline',
      iconSet: 'IconIcons',
      size: 28,
      is_active: true,
    },
    {
      id: 2,
      title: 'Address',
      route: 'Address',
      icon: 'map-pin',
      iconSet: 'Feather',
      size: 28,
      is_active: true,
    },
  ],
  settings_options: [
    {
      id: 0,
      title: 'Profile settings',
      route: 'ProfileSettings',
      icon: 'User',
      iconSet: 'Feather',
      size: 24,
      is_active: true,
    },
    {
      id: 1,
      title: 'Favorite Products',
      route: 'FavouriteProducts',
      icon: 'heart',
      iconSet: 'Feather',
      size: 24,
      is_active: false,
    },
    {
      id: 2,
      title: 'Rating & Reviews',
      route: 'Ratings',
      icon: 'Star',
      iconSet: 'Feather',
      size: 24,
      is_active: true,
    },
    {
      id: 3,
      title: 'Change Theme',
      route: 'ChangeTheme',
      icon: 'Settings',
      iconSet: 'Feather',
      size: 24,
      is_active: true
    },
    {
      id: 4,
      title: 'Check New Updates',
      route: 'Updates',
      icon: 'refresh-cw',
      iconSet: 'Feather',
      size: 24,
      is_active: false,
    },
    {
      id: 5,
      title: 'About',
      route: 'About',
      icon: 'info',
      iconSet: 'Feather',
      size: 24,
      is_active: true,
    },
    {
      id: 6,
      title: 'Support',
      route: 'Help',
      icon: 'Headset',
      iconSet: 'FontAwesome',
      size: 24,
      is_active: true,
    },
    {
      id: 7,
      title: 'Logout',
      route: null,
      icon: 'log-out',
      iconSet: 'Feather',
      size: 24,
      isLogout: true,
      is_active: true
    },
  ],
}


export default function Profile() {
  const { colors } = useTheme();
  const { navigate } = useNavigation<any>();

  const handleOptionPress = async (item: any) => {
    if (item.isLogout) {
      // Navigate to login first, then logout
      // await logout();
    } else if (item.route) {
      navigate(item.route);
    }
  };

  return (
    <MainBG>
      <SafeAreaContainer className='mt-8' >
        <DynamicHeader title='Profile' rightComponent={<Icon name='Bell' size={24} color={colors.textPrimary} />} />
        <View className='flex bg-surfaceBase mx-4 my-8 rounded-[30px] justify-center items-center py-6' >
          <Image source={{ uri: 'https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png' }} style={{ width: 100, height: 100, backgroundColor: colors.black, borderRadius: 60 }}  />
          <Text className='text-xl font-poppins mt-6 text-textPrimary'>Enjelin Morgeana</Text>
          <Text className='text-md font-bold text-primary' >@enjelinmorgeana</Text>
        </View>
        {/* Settings Options */}
        <View className='flex px-6 mx-2 rounded-[30px] bg-surfaceBase' >
          <FlatList
            data={settingsCms?.settings_options.filter(item => item.is_active)}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: gpsw(10) }}
            renderItem={({ item, index }) => {
              let title = item.title;

              if (item.isLogout) {
                return (
                  <View className='w-full items-center justify-end flex-1 px-4 py-2' >
                    <TouchableOpacity
                      key={`setting-${index}`}
                      className={`flex-row items-center gap-2 py-4 px-5  border-borderDefault ${item.isLogout ? 'mt-4' : ''}`}
                      onPress={() => handleOptionPress(item)}
                    >
                      <Icon name={item.icon} iconSet={item.iconSet} size={item.size} color={item.isLogout ? '#EF4444' : colors.textPrimary} />
                      <Text className={`text-base ${item.isLogout ? 'text-red-500 font-semibold' : ''}`}>{item.title}</Text>
                    </TouchableOpacity>
                  </View>
                )
              }

              return (
                <TouchableOpacity
                  key={`setting-${index}`}
                  className={`flex-row items-center gap-2 py-4 px-5  border-gray-100`}
                  onPress={() => handleOptionPress(item)}
                >
                  <Icon name={item.icon} iconSet={item.iconSet} size={item.size} color={colors.textPrimary} />
                  <Text className={`text-base text-textPrimary`}>{title}</Text>
                  <Icon name='ChevronRight' size={item?.size} color={colors.textPrimary} style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>
              )
            }
            }
            className='w-full mt-4 flex-grow'
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View className='flex-1 items-center justify-center'>
                <Text className='text-textPrimary'>No settings available</Text>
              </View>
            )}
          />
        </View>
      </SafeAreaContainer>
    </MainBG>
  )
}