import { post } from "@/server/axios";

// 后台设置用户的登录方式
export function userLoginMethodBackApiSet(params) {
  return post("/backend/unitsetting/loginmethod", params);
}

// 后台获取登录方式设置
export function userLoginMethodBackApiInfo(params) {
  return post("/backend/unitsetting/getloginmethod", params);
}

// 后台登录
export function userBackApiLogin(params) {
  return post("/backend/user/login", params);
}

// 后台退出登录
export function userBackApiLogout(params) {
  return post("backend/user/logout", params, { noShowMsg: true });
}

// 后台获取所有支持的登录方式
export function userApportLoginBackApiList(params) {
  return post("backend/user/logintype", params);
}

// 后台注册账号
export function userSignInBackApiVarious(params) {
  return post("backend/user/signin", params);
}

// 后台找回密码
export function userBackApiVariousAppeal(params) {
  return post("backend/user/appeal", params);
}

// 后台获取用户列表
export function userBackApiList(params) {
  return post("/backend/user/list", params);
}

// 后台用户重置密码
export function userBackApiResetPassword(params) {
  return post("/backend/user/resetpwd", params);
}

// 后台删除用户移入回收站
export function userBackApiMoveRecycle(params) {
  return post("/backend/user/moverecycle", params);
}

//获取用户申诉详情
export function userBackApiComplaints(params) {
  return post("/backend/user/complaints", params);
}

// 后台添加普通用户
export function userNormalerBackApiAdd(params) {
  return post("/backend/user/addnormaler", params);
}

// 后台获取用户详细信息
export function userBackApiDetails(params) {
  return post("/backend/user/info", params);
}

// 后台修改用户
export function userNormalerBackApiEdit(params) {
  return post("/backend/user/editnormaler", params);
}

// 后台忘记密码
export function userBackApiAppeal(params) {
  return post("/backend/user/appeal", params);
}

// 后台用户注册
export function userBackApiSignin(params) {
  return post("/backend/user/signin", params);
}

// 后台用户批量导入
export function userBackApiImport(params) {
  return post("/backend/user/parse", params);
}

// 后台新增用户管理者
export function userManagerBackApiAdd(params) {
  return post("/backend/user/addmanager", params);
}

// 后台编辑用户管理者
export function userManagerBackApiEdit(params) {
  return post("/backend/user/editmanager", params);
}

// 后台移除用户管理者
export function userManagerBackApiDel(params) {
  return post("/backend/user/movemanager", params);
}

// 前台用户列表
export function userFrontApiList(params) {
  return post("/api/user/list", params);
}

// 前台用户信息
export function userFrontApiInfo(params) {
  return post("/api/user/info", params);
}

// 前台用户编辑
export function userFrontApiEdit(params) {
  return post("/api/user/editnormaler", params);
}

// 前台编辑用户头像
export function userAvatorFrontApiEdit(params) {
  return post("/api/uploadfile/photo", params);
}
// 前台用户人脸设置
export function userFaceFrontApiSet(params) {
  return post("/api/System/setmenface", params);
}
// 前台用户指纹设置
export function userFingerFrontApiSet(params) {
  return post("/api/System/setmenfprint", params);
}
// 前台编辑用户密码
export function userPasswordFrontApiEdit(params) {
  return post("/api/user/editpwd", params);
}

export function userRecycleApiDel(params) {
  let ids = params.rows.map((v) => v.id).join(",");
  return post("/backend/user/recycledel", { ids });
}

export function userRecycleApiRestore(params) {
  let ids = params.rows.map((v) => v.id).join(",");
  return post("/backend/user/restore", { ids });
}

// 前台用户档案列表
export function userRecordList(params) {
  return post("/backend/userArchive/user_list", params);
}

// 前台用户档案详情
export function userRecordDetails(params) {
  return post("/backend/userArchive/user_data", params);
}
// 前台家庭档案详情
export function userFamilyDetails(params) {
  return post("/backend/userArchive/type_data", params);
}

// 前台用户报错档案
export function userRecordSave(params) {
  // return post("/backend/userArchive/user_save", params);
  return post("/backend/userArchive/desk_save", params);
}
