//==============================
// 用户设置
//==============================

import global from "@/global";

const user = {
  namespaced: false,
  state: () => ({
    // 用户信息
    userInfo: null,
    // 用户菜单权限
    menuList: [],
    //权限表示数组存储时候用于快速查找是否有该权限
    authList: [],
  }),
  getters: {
    /**用户信息 */
    userInfo (state) {
      return state.userInfo ? state.userInfo : {}
    },
    /**用户菜单权限 */
    menuList (state) {
      return state.menuList
    },
    /**权限表示数组存储时候用于快速查找是否有该权限 */
    authList (state) {
      return state.authList
    },
    /**是否登录 */
    isLogin (state) {
      return (state.userInfo && state.userInfo.id) ? true : false
    },
    /**token */
    token (state) {
      return state.userInfo ? state.userInfo.token : ''
    },
    /**sign */
    sign (state) {
      return state.userInfo ? state.userInfo.sign : ''
    },
    /**身份信息 */
    roleInfo (state) {
      let roleInfo = { name: '未登录', isAdmin: false, isSuperAdmin: false, }
      if (!state.userInfo) {
        return roleInfo
      }
      switch (+state.userInfo.role) {
        case 0:
          Object.assign(roleInfo, { name: '开发者账号', isAdmin: true, isSuperAdmin: true, })
          break;
        case 1:
          Object.assign(roleInfo, { name: '超级管理员', isAdmin: true, isSuperAdmin: true, })
          break;
        case 2:
          Object.assign(roleInfo, { name: '管理员', isAdmin: true, })
          break;
        case 3:
          Object.assign(roleInfo, { name: '普通用户', })
          break;
        case 4:
          Object.assign(roleInfo, { name: '心理咨询师', })
          break;
        default:
          Object.assign(roleInfo, { name: '未知身份', })
          break;
      }
      return roleInfo
    },
    /**是否超级管理员 */
    isSuperAdmin (state, getters) {
      return getters.roleInfo.isSuperAdmin
    },
    /**是否管理员 */
    isAdmin (state, getters) {
      return getters.roleInfo.isAdmin
    },
    /**是否游客 */
    isGuest (state) {
      return (state.userInfo && (state.userInfo.username == 'GUEST')) ? true : false
      // return (state.userInfo && (state.userInfo.role == -1)) ? true : false
    },
    /**获取用户头像 */
    userAvatar (state, getters) {
      if (!state.userInfo) {
        return require('@/assets/img/userAvatar/6.png')
      }
      if (!state.userInfo.avatar) {
        if (getters.isAdmin) {
          return require('@/assets/img/userAvatar/1.png')
        }
        if (getters.isGuest) {
          return require('@/assets/img/userAvatar/6.png')
        }
        return state.userInfo.sex == '女' ? require('@/assets/img/userAvatar/3.png') : require('@/assets/img/userAvatar/2.png')
      }
      return global.ip + state.userInfo.avatar
    },
  },
  mutations: {
    /**设置用户信息 */
    SET_USER_INFO (state, args) {
      state.userInfo = args;
    },
    /**更新用户信息 */
    UPDATE_USER_INFO (state, args) {
      let newV = Object.assign(state.userInfo, args)
      state.userInfo = newV;
    },
    /**设置用户菜单数据 */
    SET_MENU_LIST (state, args) {
      state.menuList = args;
      let authList = [];

      //遍历节点
      traverseTree({ children: args }, (node) => {
        authList.push(node.route);
      })
      //存储权限
      state.authList = authList;
    },
  },
  actions: {
  },
};
export default user;


//用于遍历树结构
function traverseTree (node, callback) {
  callback ? callback(node) : '';
  // 遍历子节点
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      traverseTree(node.children[i], callback);
    }
  }
}