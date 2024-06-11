import ajax from '@/services/ajax';

export const $getPagedAuditing = (payload) => {
    return ajax.post('/Auditing/GetPagedAuditing', payload);
};

export const $getAuditingToExcel = (payload) => {
    return ajax.post('/Auditing/GetAuditingToExcel', payload);
};