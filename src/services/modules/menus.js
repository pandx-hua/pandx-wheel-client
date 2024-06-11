import ajax from '@/services/ajax';

export const $getMenus = () => {
    return ajax.post('/Personal/GetMenus');
};