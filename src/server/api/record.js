import { post } from "@/server/axios";

// 后台档案列表
export function getRecordList(params) {
  return post("/backend/userArchive/get_archive_head", params);
}

// 后台保存档案列表
export function setRecordList(params) {
  return post("/backend/userArchive/set_archive_head", params);
}

// 获取档案详情
export function getRecordDetails(params) {
  return post("/backend/userArchive/user_data", params);
}

// 设置档案详情
export function setRecordDetails(params) {
  return post("/backend/userArchive/user_save", params);
}

// 获取档案详情
export function getRecordDetails2(params) {
  return post("/backend/userArchive/type_data", params);
}
