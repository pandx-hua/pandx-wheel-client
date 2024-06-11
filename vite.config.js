import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import pkg from './package.json';
import dayjs from 'dayjs';

const {dependencies, devDependencies, name, version} = pkg;
const __APP__INFO__ = {
    pkg: {dependencies, devDependencies, name, version},
    lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
    return {
        plugins: [
            vue(),
            vueJsx(),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        define: {
            __APP_INFO__: JSON.stringify(__APP__INFO__),
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@import "@/assets/styles/var.scss";`,
                },
            },
        },
    };
});


