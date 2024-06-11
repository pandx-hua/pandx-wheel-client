import {ElMessage} from 'element-plus';

/**
 *
 * @param {string} hexStr
 * @returns {*}
 */
export const hexToRgb = (hexStr) => {
    const regExp = /^#?[0-9A-Fa-f]{6}$/;
    if (!regExp.test(hexStr)) {
        ElMessage.warning('输入了错误的hex颜色值');
    }
    hexStr = hexStr.replace('#', '');
    const hex = hexStr.match(/../g);
    for (let i = 0; i < 3; i++) {
        hex[i] = parseInt(hex[i], 16);
    }
    return hex;
};
/**
 *
 * @param {*} r
 * @param {*} g
 * @param {*} b
 * @return {*}
 */
export const rgbToHex = (r, g, b) => {
    const regExp = /^\d{1,3}$/;
    if (!regExp.test(r) || !regExp.test(g) || !regExp.test(b)) {
        return ElMessage.warning('输入了错误的rgb颜色值');
    }
    const hex = [parseInt(r).toString(16), parseInt(g).toString(16), parseInt(b).toString(16)];
    for (let i = 0; i < 3; i++) {
        if (hex[i].length === 1) {
            hex[i] = `0${hex[i]}`;
        }
    }
    return `#${hex.join('')}`;
};
/**
 *
 * @param {string} color 颜色字符串值
 * @param {number} level 深度，0-1之间
 * @returns {*} 返回处理后的颜色值
 */
export const getLightColor = (color, level) => {
    const regExp = /^#?[0-9A-Fa-f]{6}$/;
    if (!regExp.test(color)) {
        return ElMessage.warning('输入了错误的hex颜色值');
    }
    const rgb = hexToRgb(color);
    for (let i = 0; i < 3; i++) {
        rgb[i] = Math.round(255 * level + rgb[i] * (1 - level));
    }
    return rgbToHex(rgb[0], rgb[1], rgb[2]);
};
/**
 *
 * @param {string} color 颜色字符串值
 * @param {number} level 深度，0-1之间
 * @returns {*} 返回处理后的颜色值
 */
export const getDarkColor = (color, level) => {
    const regExp = /^#?[0-9A-Fa-f]{6}$/;
    if (!regExp.test(color)) {
        return ElMessage.warning('输入了错误的hex颜色值');
    }
    const rgb = hexToRgb(color);
    for (let i = 0; i < 3; i++) {
        rgb[i] = Math.round(20.5 * level + rgb[i] * (1 - level));
    }
    return rgbToHex(rgb[0], rgb[1], rgb[2]);
};
