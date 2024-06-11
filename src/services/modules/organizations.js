import ajax from '@/services/ajax';

export const $createOrganization = (payload) => {
    return ajax.post('/Organizations/CreateOrganization', payload);
};

export const $updateOrganization = (payload) => {
    return ajax.post('/Organizations/UpdateOrganization', payload);
};

export const $moveOrganization = (payload) => {
    return ajax.post('/Organizations/MoveOrganization', payload);
};

export const $deleteOrganization = (payload) => {
    return ajax.post('/Organizations/DeleteOrganization', payload);
};
export const $up = (payload) => {
    return ajax.post('/Organizations/Up', payload);
};
export const $down = (payload) => {
    return ajax.post('/Organizations/Down', payload);
};
export const $getOrganizations = () => {
    return ajax.post('/Organizations/GetOrganizations');
};

export const $getOrganizationUsers1 = (payload) => {
    return ajax.post('/Organizations/GetOrganizationUsers1', payload);
};

export const $getOrganizationUsers2 = (payload) => {
    return ajax.post('/Organizations/GetOrganizationUsers2', payload);
};

export const $removeUserFromOrganization = (payload) => {
    return ajax.post('/Organizations/RemoveUserFromOrganization', payload);
};

export const $removeUsersFromOrganizations = (payload) => {
    return ajax.post('/Organizations/RemoveUsersFromOrganization', payload);
};
export const $addUsersToOrganization = (payload) => {
    return ajax.post('/Organizations/AddUsersToOrganization', payload);
};

export const $findUsers = (payload) => {
    return ajax.post('/Organizations/FindUsers', payload);
};

export const $validateOrganization = (payload) => {
    return ajax.post('/Organizations/ValidateOrganization', payload);
};