import { initDB } from '@/db/sqllite';
import { Theme } from '@/Themes';
import React, { useEffect } from 'react';
import AuthNav from './AuthNav';
import MainNav from './MainNav';

export default function RootNav() {
    useEffect(() => {
        initDB();
    }, []);

    return (
            <Theme>
                {
                    true ? <MainNav /> : <AuthNav />
                }
            </Theme>
    )
}