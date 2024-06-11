import ajax from '@/services/ajax';

export const $getPagedBackgroundJobs = (payload) => {
    return ajax.post('/BackgroundJobs/GetPagedBackgroundJobs', payload);
};

export const $createOrUpdateBackgroundJob = (payload) => {
    return ajax.post('/BackgroundJobs/CreateOrUpdateBackgroundJob', payload);
};

export const $deleteBackgroundJob = (payload) => {
    return ajax.post('/BackgroundJobs/DeleteBackgroundJob', payload);
};


export const $getExposedBackgroundJobs = () => {
    return ajax.post('/BackgroundJobs/GetExposedBackgroundJobs');
};

export const $changeBackgroundJobStatus = (payload) => {
    return ajax.post('/BackgroundJobs/ChangeBackgroundJobStatus', payload);
};

export const $getJobExecutions = (payload) => {
    return ajax.post('/BackgroundJobs/GetJobExecutions', payload);
};

export const $validateJobName = (payload) => {
    return ajax.post('/BackgroundJobs/ValidateJobName', payload);
};

export const $validateCronExpression = (payload) => {
    return ajax.post('/BackgroundJobs/ValidateCronExpression', payload);
};