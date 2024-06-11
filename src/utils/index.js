const mode = import.meta.env.VITE_ROUTER_MODE;
export const getUrlWithParams = () => {
    const url = {
        hash: location.href.substring(1),
        history: location.pathname + location.search,
    };
    return url[mode];
};
//移除元数据中具有isHide属性或没有权限的菜单
export const getShowMenuList = (menuList) => {
    //如果前端定义菜单，使用下面的代码
    // const newMenuList = JSON.parse(JSON.stringify(menuList));
    // return newMenuList.filter(item => {
    //     let result = true;
    //     if (item.children && item.children.length) {
    //         result = item.children.some(i => hasPermission(i.meta.permission) || i.meta.permission==='');
    //         item.children = getShowMenuList(item.children);
    //     }
    //     return !item.meta.isHide && (hasPermission(item.meta.permission) || item.meta.permission==='') && result;
    // });

    const newMenuList = JSON.parse(JSON.stringify(menuList));
    return newMenuList.filter(item => {
        if (item.children && item.children.length) {
            item.children = getShowMenuList(item.children);
        }
        return !item.meta.isHide;
    });
};
//扁平化后的一维数组菜单，用来添加动态路由
export const getFlatMenuList = (menuList) => {
    const newMenuList = JSON.parse(JSON.stringify(menuList));
    return newMenuList.flatMap(item => [item, ...(item.children ? getFlatMenuList(item.children) : [])]);
};

export const getBreadcrumbList = (menuList, parent = [], result = {}) => {
    for (const item of menuList) {
        result[item.path] = [...parent, item];
        if (item.children) {
            getBreadcrumbList(item.children, result[item.path], result);
        }
    }
    return result;
};

export const getTimeState = (name) => {
    const hours = new Date().getHours();
    if (hours >= 6 && hours <= 10) {
        return `${name}，早上好`;
    }
    if (hours >= 10 && hours <= 14) {
        return `${name}，中午好`;
    }
    if (hours >= 14 && hours <= 18) {
        return `${name}，下午好`;
    }
    if (hours >= 18 && hours <= 24) {
        return `${name}，晚上好`;
    }
    if (hours >= 0 && hours <= 6) {
        return `${name}，凌晨好`;
    }
};

export const guid = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

export const formatFileSize = (size) => {
    if (size < 1024) {
        return size + ' B';
    } else if (size >= 1024 && size < 1024 * 1024) {
        return Math.round((size / 1024) * 100) / 100 + ' KB';
    } else if (size >= 1024 * 1024 && size < 1024 * 1024 * 1024) {
        return Math.round((size / (1024 * 1014)) * 100) / 100 + ' MB';
    } else if (size >= 1024 * 1024 * 1024) {
        return Math.round((size / (1024 * 1024 * 1024)) * 100) / 100 + ' GB';
    }
};

//数字转字符串，前面补0，num：数字，n：字符串长度
export const prefixInteger = (num, n) => {
    return (Array(n).join('0') + num).slice(-n);
};

export const getNotificationClass = (severity) => {
    switch (severity) {
        case 0:
            return 'notification-info';
        case 1:
            return 'notification-success';
        case 2:
            return 'notification-warning';
        case 3:
            return 'notification-error';
        case 4:
            return 'notification-error';
        default:
            return 'notification-primary';
    }
};
export const getNotificationSeverity = (severity) => {
    switch (severity) {
        case 0:
            return 'info';
        case 1:
            return 'success';
        case 2:
            return 'warning';
        case 3:
            return 'error';
        case 4:
            return 'error';
        default:
            return 'info';
    }
};
