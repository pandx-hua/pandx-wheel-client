import ajax from '@/services/ajax';

export const $getRoles = () => {
    return ajax.post('/Roles/GetRoles');
};

export const $getPagedRoles = (payload) => {
    return ajax.post('/Roles/GetPagedRoles', payload);
};

export const $createOrUpdateRole = (payload) => {
    return ajax.post('/Roles/CreateOrUpdateRole', payload);
};

export const $deleteRole = (payload) => {
    return ajax.post('/Roles/DeleteRole', payload);
};

export const $validateRoleName = (payload) => {
    return ajax.post('/Roles/ValidateRoleName', payload);
};

export const $batchDeleteRoles = (payload) => {
    return ajax.post('/Roles/BatchDeleteRoles', payload);
};