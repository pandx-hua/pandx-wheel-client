import ajax from '@/services/ajax';

export const $getPagedUsers = (payload) => {
    return ajax.post('/Users/GetPagedUsers', payload);
};
export const $createOrUpdateUser = (payload) => {
    return ajax.post('/Users/CreateOrUpdateUser', payload);
};

export const $validateUserName = (payload) => {
    return ajax.post('/Users/ValidateUserName', payload);
};

export const $validateEmail = (payload) => {
    return ajax.post('/Users/ValidateEmail', payload);
};

export const $unlockUser = (payload) => {
    return ajax.post('/Users/UnlockUser', payload);
};

export const $changePassword = (payload) => {
    return ajax.post('/Users/ChangePassword', payload);
};

export const $deleteUser = (payload) => {
    return ajax.post('/Users/DeleteUser', payload);
};

export const $batchDeleteUsers = (payload) => {
    return ajax.post('/Users/BatchDeleteUsers', payload);
};

// export const $importUsersFromExcel=()=>{
//     return ajax.post('/Users/ImportUsersFromExcel');
// }

export const $exportUsersToExcel = (payload) => {
    return ajax.post('/Users/ExportUsersToExcel', payload);
};

export const $getAvatarById = (payload) => {
    return ajax.post('/Users/GetAvatarById', payload);
};

//upload
export const $importUsersFromExcel = '/Users/ImportUsersFromExcel';