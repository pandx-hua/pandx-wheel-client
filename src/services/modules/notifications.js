import ajax from '@/services/ajax';

export const $getPagedUserNotifications = (payload) => {
    return ajax.post('/Notifications/GetPagedUserNotifications', payload);
};

export const $setUserNotificationAsRead = (payload) => {
    return ajax.post('/Notifications/SetUserNotificationAsRead', payload);
};

export const $deleteUserNotification = (payload) => {
    return ajax.post('/Notifications/DeleteUserNotification', payload);
};

export const $download = '/Notifications/Download';