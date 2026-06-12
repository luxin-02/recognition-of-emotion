import { post } from "@/server/axios";

// 添加微笑打卡
export function addSmileClock(params) {
  return post("/api/SmileClock/add", params);
}

// 微笑打卡列表
export function smileClockList(params) {
  return post("/api/SmileClock/list", params);
}

// 我的微笑打卡
export function mySmileClockList(params) {
  return post("/api/SmileClock/myList", params);
}

// 点赞 / 取消点赞
export function likeSmileClock(params) {
  return post("/api/SmileClock/like", params);
}

// 微笑打卡详情
export function smileClockDetail(params) {
  return post("/api/SmileClock/detail", params);
}
