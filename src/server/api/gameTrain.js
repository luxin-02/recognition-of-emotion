import { post } from "@/server/axios";

// 获取分类
export function getCogClass(params) {
  return post("/backend/newcog/class_list", params);
}

// 获取详情
export function getCogList(params) {
  return post("/backend/newcog/list", params);
}

// 添加详情
export function addCogList(params) {
  return post("/backend/newcog/add", params);
}

// 删除详情
export function delCogList(params) {
  return post("/backend/newcog/del", params);
}

// 添加分类
export function addCogClass(params) {
  return post("/backend/newcog/class_add", params);
}
// 删除分类
export function delCogClass(params) {
  return post("/backend/newcog/class_del", params);
}
