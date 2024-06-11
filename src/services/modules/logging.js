import ajax from '@/services/ajax';

export const $downloadLogs = () => {
    return ajax.post('/Logging/DownloadLogs');
};

export const $getLatestLogs = () => {
    return ajax.post('/Logging/GetLatestLogs');
};