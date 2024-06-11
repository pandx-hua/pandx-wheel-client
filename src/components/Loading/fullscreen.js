import {ElLoading} from 'element-plus';

let loadingInstance;

const startLoading = () => {
    loadingInstance = ElLoading.service({
        fullscreen: true,
        lock: true,
        text: '加载中...',
        background: 'rgba(0,0,0,0.70)',
    });
};

const endLoading = () => {
    loadingInstance.close();
};

let needLoadingRequestCount = 0;

export const showFullscreenLoading = () => {
    if (needLoadingRequestCount === 0) {
        startLoading();
    }
    needLoadingRequestCount++;
};

export const hideFullscreenLoading = () => {
    if (needLoadingRequestCount <= 0) {
        return;
    }
    needLoadingRequestCount--;
    if (needLoadingRequestCount === 0) {
        endLoading();
    }
};