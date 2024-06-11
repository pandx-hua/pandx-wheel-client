import {useGlobalStore} from '@/stores/modules/global';
import {DEFAULT_PRIMARY} from '@/config';
import {ElMessage} from 'element-plus';
import {getDarkColor, getLightColor} from '@/utils/color';
import {asideTheme, headerTheme, menuTheme} from '@/theme';

export const useTheme = () => {
    const globalStore = useGlobalStore();


    const initTheme = () => {
        switchDark();
        if (globalStore.isGray) {
            changeGrayOrWeak('gray', true);
        }
        if (globalStore.isWeak) {
            changeGrayOrWeak('weak', true);
        }
    };

    const switchDark = () => {
        const html = document.documentElement;
        if (globalStore.isDark) {
            html.setAttribute('class', 'dark');
        } else {
            html.setAttribute('class', '');
        }
        changePrimary(globalStore.primary);
        setAsideTheme();
        setHeaderTheme();
    };

    const changePrimary = (value) => {
        if (!value) {
            value = DEFAULT_PRIMARY;
            ElMessage.success(`主色调已重置为${DEFAULT_PRIMARY}`);
        }
        document.documentElement.style.setProperty('--el-color-primary', value);
        document.documentElement.style.setProperty('--el-color-primary-dark-2', globalStore.isDark ? `${getLightColor(value, 0.2)}` : `${getDarkColor(value, 0.3)}`);
        for (let i = 1; i <= 9; i++) {
            const primaryColor = globalStore.isDark ? `${getDarkColor(value, i / 10)}` : `${getLightColor(value, i / 10)}`;
            document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, primaryColor);
        }
        globalStore.setGlobalState('primary', value);
    };

    const setAsideTheme = () => {
        let type = 'light';
        if (globalStore.isDark) {
            type = 'dark';
        }
        if (globalStore.isAsideInverted) {
            type = 'inverted';
        }
        const theme = asideTheme[type];
        for (const [key, value] of Object.entries(theme)) {
            document.documentElement.style.setProperty(key, value);
        }
        setMenuTheme();
    };

    const setHeaderTheme = () => {
        let type = 'light';
        if (globalStore.isDark) {
            type = 'dark';
        }
        if (globalStore.isHeaderInverted) {
            type = 'inverted';
        }
        const theme = headerTheme[type];
        for (const [key, value] of Object.entries(theme)) {
            document.documentElement.style.setProperty(key, value);
        }
        setMenuTheme();
    };

    const setMenuTheme = () => {
        let type = 'light';
        if (globalStore.isDark) {
            type = 'dark';
        }
        if (globalStore.layout === 'transverse' && globalStore.isHeaderInverted) {
            type = 'inverted';
        }
        if (globalStore.layout !== 'transverse' && globalStore.isAsideInverted) {
            type = 'inverted';
        }
        const theme = menuTheme[type];
        for (const [key, value] of Object.entries(theme)) {
            document.documentElement.style.setProperty(key, value);
        }
    };

    const changeGrayOrWeak = (type, value) => {
        const body = document.body;
        if (!value) {
            return body.removeAttribute('style');
        }
        const styles = {
            gray: 'filter:grayscale(1)',
            weak: 'filter:invert(80%)',
        };
        body.setAttribute('style', styles[type]);
        const propName = type === 'gray' ? 'isWeak' : 'isGray';
        globalStore.setGlobalState(propName, false);
    };

    return {
        initTheme,
        switchDark,
        changePrimary,
        changeGrayOrWeak,
        setHeaderTheme,
        setAsideTheme,
    };
};