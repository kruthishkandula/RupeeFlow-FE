import useTheme from '@/hooks/useTheme';
import Wallet from '@/screens/Wallet';
import { findObject } from '@/utility/utilties';
import { BottomTabBarButtonProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useLinkBuilder } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import Icon from '../components/Icon';
import Profile from '../screens/Profile';
import Statistics from '../screens/Statistics';

const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

type CustomButtonProps = BottomTabBarButtonProps & {
    containerStyle?: ViewStyle;
    isFloat?: boolean;
    label: 'dashboard' | 'statistics' | 'addexpense' | 'profile';
};

type tabIconProp = {
    label: CustomButtonProps['label'];
    focused: boolean;
};

const TabNav = createBottomTabNavigator();

const TabRoutes = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        component: Wallet,
        icon: 'House',
    },
    {
        id: 'statistics',
        name: 'Statistics',
        component: Statistics,
        icon: 'ChartBar',
    },
    {
        id: 'profile',
        name: 'Profile',
        component: Profile,
        icon: 'User',
    }
]

export default function BottomNav() {
    const { colors } = useTheme();
    const { buildHref } = useLinkBuilder();

    function renderTabIcon({ label, focused }: tabIconProp) {
        let tabData = findObject({
            data: TabRoutes,
            key: 'name',
            value: label,
        });

        switch (label) {
            default:
                return (
                    <Icon
                        name={tabData?.icon}
                        size={24}
                        color={focused ? colors.primary : colors.white}
                    />
                );
        }
    }

    const MyTabBar = ({ state, descriptors, navigation, ...props }: any) => {

        return (
            <View style={[styles.container, { backgroundColor: colors.primary }]} >
                {
                    state.routes.map((route: any, index: number) => {
                        const { options } = descriptors[route.key];
                        const label =
                            options.tabBarLabel !== undefined
                                ? options.tabBarLabel
                                : options.title !== undefined
                                    ? options.title
                                    : route.name;

                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name, route.params);
                            }
                        };

                        const onLongPress = () => {
                            navigation.emit({
                                type: 'tabLongPress',
                                target: route.key,
                            });
                        };

                        return (
                            <AnimatedPressable
                                activeOpacity={1}
                                layout={LinearTransition.springify()}
                                key={route.key}
                                href={buildHref(route.name, route.params)}
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarButtonTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                style={[styles.tabItemStyle, { backgroundColor: isFocused ? colors.cardOverlayLight : colors.transparent }]}
                            >
                                {renderTabIcon({ label: label as CustomButtonProps['label'], focused: isFocused })}
                                {isFocused && <AnimatedText entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={{ color: colors.primary }}>
                                    {label}
                                </AnimatedText>}
                            </AnimatedPressable>
                        );
                    })
                }
            </View>
        );
    }
    return (
        <TabNav.Navigator screenOptions={{
            headerShown: false
        }}
            tabBar={(props) => <MyTabBar {...props} />}
        >
            {
                TabRoutes?.map((route: any, index: number) => (
                    <TabNav.Screen
                        key={`Tab-${index}`}
                        name={route.name}
                        component={route.component}
                        options={{
                            tabBarShowLabel: false,
                            tabBarIconStyle: route.id === 'addexpense' && styles.addExpenseStyle,
                            tabBarStyle: { height: 80, justifyContent: 'center', paddingBottom: 10, paddingTop: 10 },
                            tabBarIcon: ({ focused, color, size }) => (
                                <Icon name={focused ? route.focusedIcon ?? route.icon : route.icon} color={color} size={size} />
                            ),
                        }}
                    />
                ))
            }
        </TabNav.Navigator>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
        bottom: 20,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 40,
    },
    tabItemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: 'white',
        borderRadius: 24,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    addExpenseStyle: {
        flex: 1,
        width: 80,
        height: 80,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
    }
})