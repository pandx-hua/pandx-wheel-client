import axios from 'axios';
import {usePersonalStore} from '@/stores/modules/personal/personal';
import router from '@/router';
import {LOGIN_URL} from '@/config';
import {ElMessage} from 'element-plus';


const ajax = axios.create({
    baseURL: import.meta.env.VITE_REMOTE_SERVICE_BASE_URL,
    timeout: 30000,
    withCredentials: false,
    validateStatus: (status) => {
        return status >= 200 && status < 600;
    },
});

const subscribers = [];
const addSubscriber = (callback) => {
    subscribers.push(callback);
};
const notifySubscribers = (newToken) => {
    subscribers.map(callback => callback(newToken));
};
let isRefreshing = false;

ajax.interceptors.request.use(async request => {
    const personalStore = usePersonalStore();
    if (personalStore.token['accessToken']) {
        request.headers['Authorization'] = 'Bearer ' + personalStore.token['accessToken'];
        const refreshTokenExpirationUtcTime = new Date(personalStore.token['refreshTokenExpirationUtcTime']).getTime();
        const accessTokenExpirationUtcTime = new Date(personalStore.token['accessTokenExpirationUtcTime']).getTime();
        const now = new Date().getTime();
        if (now >= refreshTokenExpirationUtcTime) {//refreshToken过期
            personalStore.logout();
            await router.replace(LOGIN_URL);
        } else {
            if (accessTokenExpirationUtcTime - now <= 120000) {//accessToken即将过期
                if (!isRefreshing) {
                    isRefreshing = true;
                    personalStore.refreshToken({
                        accessToken: personalStore.token['accessToken'],
                        refreshToken: personalStore.token['refreshToken'],
                    }).then((response) => {
                        personalStore.token = response.data.result;
                        personalStore.loginTime = new Date();
                        isRefreshing = false;
                        notifySubscribers(response.data.result.accessToken);
                    }).catch(async (error) => {
                        personalStore.logout();
                        await router.replace(LOGIN_URL);
                        isRefreshing = false;
                    });
                }
                return new Promise((resolve) => {
                    addSubscriber(newToken => {
                        request.headers['Authorization'] = 'Bearer ' + newToken;
                        resolve(request);
                    });
                });
            }
        }
    }
    return request;
}, (error) => {
    return Promise.reject(error);
});

ajax.interceptors.response.use(async response => {
    const personalStore = usePersonalStore();
    switch (response.status) {
        case 400:
            ElMessage.error('请求失败，请稍后重试');
            return Promise.reject();
        case 401:
            personalStore.logout();
            await router.replace(LOGIN_URL);
            ElMessage.error('登录信息已失效，请重新登录');
            return Promise.reject();
        case 403:
            ElMessage.warning('权限不足，部分操作将无法进行');
            return Promise.reject();
        case 404:
            ElMessage.error('访问的资源不存在');
            return Promise.reject();
        case 405:
            ElMessage.error('不支持的请求方式');
            return Promise.reject();
        case 408:
            ElMessage.error('请求超时，请稍后重试');
            return Promise.reject();
        case 415:
            ElMessage.error('不支持的请求方式');
            return Promise.reject();
        case 484:
            ElMessage.error(response.data['validationErrors'].map(i => i.message).join('\r\n'));
            return Promise.reject();
        case 500:
            ElMessage.error(response.data.title);
            return Promise.reject();
        case 502:
            ElMessage.error('网关错误,请稍后重试');
            return Promise.reject();
        case 503:
            ElMessage.error('服务不可用，请稍后重试');
            return Promise.reject();
    }
    if (response.status > 200) {
        ElMessage.error('请求失败，请稍后重试');
        return Promise.reject();
    }
    return Promise.resolve(response);
}, async error => {
    if (!window.navigator.onLine) {
        ElMessage.error('网络不在线，请稍后重试');
    } else if (error && error.response && error.response.status === 500) {
        ElMessage.error('服务器错误，请稍后重试');
    } else if (error && error.message && error.message.indexOf('timeout') !== -1) {
        ElMessage.error('请求超时，请稍后重试');
    } else if (error && error.message && error.message.indexOf('Network Error') !== -1) {
        ElMessage.error('网络错误，请稍后重试');
    } else {
        ElMessage.error(error && error.message ? error.message : '未知错误，请稍后再试');
    }
    return Promise.reject();
});

export default ajax;