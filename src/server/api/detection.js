import { post } from "@/server/axios";

// 情绪检测列表
export function getSmileAssessList(params) {
  return post("/api/SmileAssess/list", params);
}

// 情绪检测添加
export function addSmileAssess(params) {
  return post("/api/SmileAssess/add", params);
}

// 情绪检测详情
export function getSmileAssessDetail(params) {
  return post("/api/SmileAssess/detail", params);
}
    
// 情绪检测删除
export function deleteSmileAssess(params) {
  return post("/api/SmileAssess/delete", params);
}       