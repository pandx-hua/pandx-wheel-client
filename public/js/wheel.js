wheel = {};
(function () {
    wheel.auth = wheel.auth || {};
    wheel.auth.isGranted = (permission) => {
        return wheel.auth.grantedPermissions[permission] !== undefined;
    };
})();