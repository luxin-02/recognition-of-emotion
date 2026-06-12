import {post} from '@/server/axios';

//获取角色列表
export function roleApiList(params) {
  return post('/backend/license/list', params);
}

//获取用户可以看到的权限
export function userGruntApiList(params) {
  return post('/backend/license/getmenulist', params)
}

//获取角色权限
export function roleGruntApiList(params) {
  return post('/backend/license/getUserAuth', params)
}

//修改菜单角色权限
export function roleGruntApiEdit(params) {
  return post('/backend/license/toUserAuth', params)
}
