import { getFirebaseAuth } from '@/config/firebase';
import { onAuthStateChanged } from '@react-native-firebase/auth';
import { initDB } from '@/db/sqllite';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useExpenseStore } from '@/store/useExpenseStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Theme } from '@/Themes';
import React, { useEffect } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import AuthNav from './AuthNav';
import MainNav from './MainNav';
import useTheme from '@/hooks/useTheme';

export default function RootNav() {
    const getStoreExpenses = useExpenseStore(s => s.getStoreExpenses);
    const getStoreBudgets = useBudgetStore(s => s.getStoreBudgets);
    const { user, initializing, setUser, setInitializing } = useAuthStore();
    const { isDark, colors } = useTheme();

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
            if (initializing) setInitializing(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (user) {
            initDB().then(() => {
                getStoreExpenses();
                getStoreBudgets();
            });
        }
    }, [user]);

    if (initializing) {
        return (
            <Theme>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#2F7E79" />
                </View>
            </Theme>
        );
    }

    return (
        <Theme>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={`${colors?.primary}CC`} />
            {user ? <MainNav /> : <AuthNav />}
        </Theme>
    );
}