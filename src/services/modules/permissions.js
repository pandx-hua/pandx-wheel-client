import ajax from '@/services/ajax';

export const $getPermissions = () => {
    return ajax.post('/Permissions/GetPermissions');
};

