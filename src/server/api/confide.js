import { post } from "@/server/axios";

// 添加获取倾诉
export function roastAdd(params) {
  return post("/api/roast/save", params);
}

// 倾诉列表
export function roastList(params) {
  return post("/api/roast/list", params);
}

// 倾诉详情
export function roastDetails(params) {
  return post("/api/roast/info", params);
}

// 倾诉
export function roastapi(params) {
  return post("/api/roast/message_save", params);
}

// 删除
export function delRoast(params) {
  return post("/api/roast/del", params);
}

// 更新时间
export function getTime(params) {
  return post("/api/roast/update", params);
}

// 对话次数
export function getCharacter(params) {
  return post("/api/roast/character", params);
}
