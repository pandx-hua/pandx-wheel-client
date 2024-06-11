export const hasPermission = (permission) => {
    return window.wheel.auth.isGranted(permission);
};