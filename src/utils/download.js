import axios from 'axios';
import download from 'downloadjs';
import {ElMessage} from 'element-plus';
import {usePersonalStore} from '@/stores/modules/personal/personal';

const personalStore = usePersonalStore();
export const downloadWithToken = async (url, name, type, data = {}) => {
    const ajax = axios.create({
        baseURL: import.meta.env.VITE_REMOTE_SERVICE_BASE_URL,
        timeout: 30000,
        responseType: 'blob',
    });

    if (personalStore.token['accessToken']) {
        ajax.defaults.headers['Authorization'] = 'Bearer ' + personalStore.token['accessToken'];
    }
    try {
        const response = await ajax.post(url, data);
        download(response.data, convert(name), type);
    } catch (e) {
        ElMessage.error('文件下载失败，错误代码 ' + e.code);
    }

};

export const convert = (name) => {
    return name.replace(/\//g, '／').replace(/\\/g, '＼').replace(/\*/g, '※').replace(/:/g, '：').replace(/"/g, '＂')
        .replace(/\?/g, '？').replace(/</g, '＜').replace(/>/g, '＞').replace(/\|/g, '┆');
};