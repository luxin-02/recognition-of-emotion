import { post } from "@/server/axios"
import store from "@/store"

// 不需要登录，获取前台系统配置
export function frontApiSettingInfoWithoutLogin(params) {
  return post("/api/system/getinfo", params)
}

//前台设置悬浮球
export function sphereApiSet(params) {
  return post("/api/system/setsphere", params)
}

// 需要登录，获取前台系统配置
export function frontApiSettingInfoInLogin(params) {
  //如果是游客的话
  if (store.getters.isGuest) {
    return frontApiSettingInfoWithoutLogin()
  }
  return post("/api/system/personalization", params)
}

//恢复悬浮球默认设置
export function sphereApiReset(params) {
  return post("/api/system/restoresphere", params)
}

//获取省
export function provinceApi(params) {
  return post("/backend/pcd/province", params)
}

//获取市
export function cityApi(params) {
  return post("/backend/pcd/city", params)
}

//获取区域
export function areaApi(params) {
  return post("/backend/pcd/area", params)
}

// 单位设置
export function unitsettingApiSave(params) {
  return post("/backend/unitsetting/add", params)
}

//数据同步查看
export function dataSynchronizationApiInfo(params) {
  return post("/backend/datasync/info", params)
}

//数据同步保存
export function dataSynchronizationApiSave(params) {
  return post("/backend/datasync/save", params)
}

//设置配置信息
export function configApiSet(params) {
  return post("/api/system/generalSetting", params)
}

//获取统计数据
export function statisticsApi(params) {
  return post("/api/system/stat", params)
}
