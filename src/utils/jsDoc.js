/**
 * @typedef {Object} TabItem
 * @property {string} icon
 * @property {string} title
 * @property {string} path
 * @property {string} name
 * @property {boolean} isClose
 * @property {boolean} isKeepAlive
 */

/**
 * @typedef {Object} RouteMeta
 * @property {string} icon =>菜单和面包屑对应的图标
 * @property {string} title =>路由标题，用作document.title及菜单标题
 * @property {string?} activeMenu =>当前路由为详情页，需要高亮的菜单
 * @property {string?} link =>外链地址
 * @property {boolean} isHide =>是否在菜单中隐藏
 * @property {boolean} isFull =>是否全屏
 * @property {boolean} isAffix =>是否固定
 * @property {boolean} isKeepAlive =>是否缓冲
 * @property {string?} permission =>菜单权限
 */

/**
 * @typedef {Object} MenuItem
 * @property {string} path
 * @property {string} name
 * @property {callback?} component
 * @property {string?} redirect
 * @property {RouteMeta} meta
 * @property {MenuItem[]?} children
 */
