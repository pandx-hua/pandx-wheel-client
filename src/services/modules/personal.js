import ajax from '@/services/ajax';
import axios from 'axios';

export const $getPersonal = () => {
    return ajax.post('/Personal/GetPersonal');
};

export const $getToken = (payload) => {
    return ajax.post('/Personal/GetToken', payload);
};

export const $refreshToken = (payload) => {
    return axios.post('/Personal/RefreshToken', payload, {
        baseURL: import.meta.env.VITE_REMOTE_SERVICE_BASE_URL,
        timeout: 30000,
        withCredentials: false,
    });
};

export const $updateUser=(payload)=>{
    return ajax.post('/Personal/UpdateUser',payload);
};

export const $changePersonalPassword=(payload)=>{
    return ajax.post('/Personal/ChangePersonalPassword',payload);
}

export const $getLoginAttempts=()=>{
    return ajax.post('/Personal/GetLoginAttempts');
}

export const $getAvatar=()=>{
    return ajax.post('/Personal/GetAvatar');
}

export const $uploadAvatar='/Personal/UploadAvatar';