import { initDB } from '@/db/sqllite';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useExpenseStore } from '@/store/useExpenseStore';
import { Theme } from '@/Themes';
import React, { useEffect } from 'react';
import AuthNav from './AuthNav';
import MainNav from './MainNav';

export default function RootNav() {
    const getStoreExpenses = useExpenseStore(s => s.getStoreExpenses);
    const getStoreBudgets = useBudgetStore(s => s.getStoreBudgets);

    useEffect(() => {
        initDB().then(() => {
            getStoreExpenses();
            getStoreBudgets();
        });
    }, []);

    return (
            <Theme>
                {
                    true ? <MainNav /> : <AuthNav />
                }
            </Theme>
    )
}