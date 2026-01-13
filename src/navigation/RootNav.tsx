import { Theme } from '@/Themes'
import React from 'react'
import AuthNav from './AuthNav'
import MainNav from './MainNav'

export default function RootNav() {
    return (
        <>
            <Theme>
                {
                    true ? <MainNav /> : <AuthNav />
                }
            </Theme>
        </>
    )
}