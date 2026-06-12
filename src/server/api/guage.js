import { post } from "@/server/axios";

// 后台量表报告统计
export function backGuageReportApiData(params) {
  return post("/backend/report/statisByThisWeek", params);
}

// 后台获取量表列表
export function backGaugeApiList(params) {
  return post("/backend/gauge/list", params);
}

// 后台添加量表
export function backGaugeApiAdd(params) {
  return post("/backend/gauge/upload", params);
}

// 后台修改量表
export function backGaugeApiEdit(params) {
  return post("/backend/gauge/edit", params);
}

// 后台修改量表显示类型
export function backGaugeTypeApiShow(prams) {
  return post("/backend/gauge/show", prams);
}

// 后台删除量表
export function backGaugeApiDel(prams) {
  return post("/backend/gauge/recycle", prams);
}

// 后台通过文件获取量表详情
export function backGaugeDetailApiByPath(params) {
  return post("/backend/gauge/getExcelInfo", params);
}

// 前台量表列表
export function frontGaugeApiList(params) {
  return post("/api/gauge/list", params);
}

// 前台获取题库详情
export function frontGaugeApiInfo(params) {
  return post("/api/gauge/getGaugeQuestions", params);
}

// 前台提交量表报告
export function frontGaugeReportApiSubmit(params) {
  return post("/backend/gauge/commit", params);
}

// 前台量表报告列表
export function frontGaugeReportApiList(params) {
  return post("/api/gaugereport/list", params);
}

// 前台量表报告的删除
export function frontGaugeReportApiDel(params) {
  return post("/api/gaugereport/recycle", params);
}

// 前台已读量表报告
export function frontGaugeReportApiRead(params) {
  return post("/api/gaugereport/read", params);
}

// 前台量表报告详情
export function frontGaugeReportApiInfo(params) {
  return post("/api/gaugereport/detail", params);
}

// 量表报告
export function gaugeReportRecycleApiList(params) {
  params.startData
    ? (params.start_time = new Date(params.startData).getTime() / 1000)
    : "";
  params.endData
    ? (params.end_time = new Date(params.endData).getTime() / 1000)
    : "";
  params.is_recycle = 1;
  return post("/backend/gaugereport/recycleList", params);
}

export function gaugeReportRecycleApiDel(params) {
  return post("/backend/gaugereport/delete", {
    ids: params.rows.map((v) => v.report_id).join(","),
  });
}

export function gaugeReportRecycleApiRestore(params) {
  return post("/backend/gaugereport/restore", {
    ids: params.rows.map((v) => v.report_id).join(","),
  });
}

export function gaugeRecycleApiList(params) {
  params.startData
    ? (params.start_time = new Date(params.startData).getTime() / 1000)
    : "";
  params.endData
    ? (params.end_time = new Date(params.endData).getTime() / 1000)
    : "";
  params.is_recycle = 1;
  return post("/backend/gauge/recycleList", params);
}

export function gaugeRecycleApiDel(params) {
  let ids = params.rows.map((v) => v.id).join(",");
  return post("/backend/gauge/delete", { ids });
}

export function gaugeRecycleApiRestore(params) {
  let ids = params.rows.map((v) => v.id).join(",");
  return post("/backend/gauge/restore", { ids });
}

//获取量表分类
export function gaugeApiClassList(params) {
  return post("backend/gaugeclass/list", params);
}

export function gaugeApiClassAdd(params) {
  return post("backend/gaugeclass/add", params);
}

export function gaugeApiClassRemove(params) {
  return post("backend/gaugeclass/delete", params);
}
