import { useThemeContextActions } from '@/Themes';
import { getThemeColors } from '@/Themes/theme-config';

const useTheme = () => {
    const { theme } = useThemeContextActions();
    const colors = getThemeColors(theme);
    let isDark = colors?.isDark || false;

    return {
        colors,
        theme,
        isDark
    }
}

export default useTheme