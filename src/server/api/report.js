import { post } from "@/server/axios";

// 报告列表
export function reportApiList(params) {
  params.version = "v2";
  return post("api/game/list", params);
}

// export function reportApiList(params) {
//   return post("api/report/list", params);
// }

/** 报告详情 */
export function reportApiInfo(params) {
  params.version = "v2";
  return post("api/game/info", params);
}


/** 报告删除 */
export function reportApiDel(params) {
  return post("api/game/truedel", params);
}

/** 报告新增 */
export function reportApiAdd(params) {
  params.version = "v2";
  return post("api/game/save", params);
}
