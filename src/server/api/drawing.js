import { post } from "@/server/axios";

/**
 * 提交绘画数据到服务器
 * @param {Object} params - 提交绘画所需的参数
 * @returns {Promise} - 返回一个 Promise 对象，用于处理服务器响应
 */

// 绘画选项
export function drawingOption(params) {
  return post("/api/Draw/option", params);
}
// 绘画提交
export function drawingAdd(params) {
  return post("/api/Draw/add", params);
}

// 绘画列表
export function drawingList(params) {
  return post("/api/Draw/list", params);
}
// 绘画删除
export function drawingDel(params) {
  return post("/api/Draw/del", params);
}
// 绘画删除
export function drawingInfo(params) {
  return post("/api/Draw/info", params);
}

// 绘画编辑
export function drawingEdit(params) {
  return post("/api/Draw/edit", params);
}
