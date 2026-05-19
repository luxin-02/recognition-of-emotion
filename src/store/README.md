# 详细说明

获取数据尽量使用 getters

## index.js

store入口文件

## module

没有开启命名空间，getters、mutations正常调用即可(例：store.getters.userInfo; store.commit('SET_USER_INFO', null);)

- user.js 用户数据相关
    - getters
        1. userInfo : 用户信息
        2. menuList : 用户菜单权限
        3. authList : 权限表示数组存储时候用于快速查找是否有该权限
        4. isLogin : 是否登录
        5. token : token
        6. sign : sign
        7. roleInfo : 身份信息
        8. isSuperAdmin : 是否超级管理员
        9. isAdmin : 是否管理员
        10. isGuest : 是否游客
        11. userAvatar : 获取用户头像

    - mutations
        1. SET_USER_INFO : 设置用户信息
        2. UPDATE_USER_INFO : 更新用户信息
        3. SET_MENU_LIST : 设置用户菜单数据


- system.js 系统设置相关
    - getters
        1. sysInfo : 系统信息
        2. isOpenGuest : 是否打开游客登录
        3. isOpenFingerprint : 开启指纹
        4. isOpenFace : 关闭人脸

    - mutations
        1. UPDATE_SYS_INFO : 更新系统信息


- uncommon.js 其他数据
  其他数据


