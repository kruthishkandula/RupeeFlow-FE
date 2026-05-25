import { getFirebaseAuth } from '@/config/firebase';
import { initDB } from '@/db/sqllite';
import useTheme from '@/hooks/useTheme';
import Onboarding from '@/screens/Onboarding';
import SplashScreen from '@/screens/Splash';
import { useAuthStore } from '@/store/useAuthStore';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useExpenseStore } from '@/store/useExpenseStore';
import { Theme } from '@/Themes';
import { getItem } from '@/utility/storage';
import { onAuthStateChanged } from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import React, { useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import AuthNav from './AuthNav';
import MainNav from './MainNav';

export default function RootNav() {
    const getStoreExpenses = useExpenseStore(s => s.getStoreExpenses);
    const getStoreBudgets = useBudgetStore(s => s.getStoreBudgets);
    const { user, setUser, setInitializing } = useAuthStore();
    const { isDark, colors } = useTheme();
    const [onboardingSeen, setOnboardingSeen] = useState<boolean | null>(null);
    const [showSplash, setShowSplash] = useState<boolean>(true);

    useEffect(() => {
        const auth = getFirebaseAuth();
        if (!auth) {
            setInitializing(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (!firebaseUser) {
                useExpenseStore.setState({ expenses: [] });
                useBudgetStore.setState({ budgets: {} });
            }
            setUser(firebaseUser);
            setInitializing(false);
        });
        return unsubscribe;
    }, [setInitializing, setUser]);

    useEffect(() => {
        (async () => {
            try {
                const v = await getItem('onboardingSeen');
                setOnboardingSeen(!!v);
            } catch (e) {
                setOnboardingSeen(false);
            }
        })();
    }, []);

    const getFCMToken = async (): Promise<string | null> => {
        if (Platform.OS !== 'ios') return null;
        try {
            const messagingClient = messaging();

            await messagingClient.registerDeviceForRemoteMessages();

            const authStatus = await messagingClient.requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (!enabled) {
                console.warn('[RootNav] Notification permission not granted.');
                return null;
            }

            return await messagingClient.getToken();
        } catch (error) {
            // FCM token is unavailable on iOS Simulator — expected in development
            console.warn('[RootNav] FCM token unavailable (simulator?):', error);
            return null;
        }
    };

    useEffect(() => {
        if (Platform.OS !== 'ios') return;
        (async () => {
            const token = await getFCMToken();
            if (token) {
                console.log('FCM Token---', token);
            }
        })();
    }, [user]);

    useEffect(() => {
        if (Platform.OS !== 'ios') return;
        const unsubscribeTokenRefresh = messaging().onTokenRefresh((token) => {
            console.log('FCM Token refreshed---', token);
        });

        return unsubscribeTokenRefresh;
    }, []);

    useEffect(() => {
        if (user) {
            initDB().then(() => {
                getStoreExpenses();
                getStoreBudgets();
            });
        }
    }, [getStoreBudgets, getStoreExpenses, user]);


    if (showSplash) {
        return (
            <Theme>
                <SplashScreen onFinish={() => setShowSplash(false)} />
            </Theme>
        );
    }

    if (onboardingSeen === null) {
        return (
            <Theme>
                <Onboarding onFinish={() => setOnboardingSeen(true)} />
            </Theme>
        );
    }

    return (
        <Theme>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={`${colors?.primary}CC`} />
            {user?.emailVerified ? <MainNav /> : <AuthNav />}
        </Theme>
    );
}