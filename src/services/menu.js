//前端定义菜单时，在这里构建菜单
const $menuList = [
    {
        path: '/home/index',
        name: 'home',
        component: 'Home',
        meta: {
            icon: 'Grid',
            title: '仪表板',
            link: '',
            isHide: false,
            isFull: false,
            isAffix: true,
            isKeepAlive: true,
            permission: '',
        },
    },
    {
        path: '/administration',
        name: 'administration',
        redirect: '/administration/users/index',
        meta: {
            icon: 'Setting',
            title: '系统管理',
            link: '',
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true,
            permission: '',
        },
        children: [
            {
                path: '/administration/users/index',
                name: 'users',
                component: 'Administration/Users',
                meta: {
                    icon: 'Menu',
                    title: '用户',
                    link: '',
                    isHide: false,
                    isFull: false,
                    isAffix: false,
                    isKeepAlive: true,
                    permission: 'Permission.Users.Empty',
                },
            },
            {
                path: '/administration/roles/index',
                name: 'roles',
                component: 'Administration/Roles',
                meta: {
                    icon: 'Menu',
                    title: '角色',
                    link: '',
                    isHide: false,
                    isFull: false,
                    isAffix: false,
                    isKeepAlive: true,
                    permission: 'Permission.Books.View',
                },
            },
        ],
    },
];

export default $menuList;