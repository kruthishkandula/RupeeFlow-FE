import { local_storage } from '@/storage';
import { ThemesVariant } from '@/Themes/theme-config';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemesVariants = ThemesVariant;

interface ThemeStore {
    isDefaultTheme: boolean;
    setIsDefaultTheme: (isDefault: boolean) => void;
    theme: ThemesVariants;
    setTheme: (theme: ThemesVariants) => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set, get) => {
            return {
                isDefaultTheme: true,
                theme: 'light',
                loading: false,
                error: null,
                setIsDefaultTheme: (isDefault: boolean) => {
                    set({ isDefaultTheme: isDefault });
                },
                setTheme: (theme: ThemesVariants) => {
                    set({ theme });
                },
            };
        },
        {
            name: 'theme-items-storage2',
            storage: local_storage,
        }
    )
);
