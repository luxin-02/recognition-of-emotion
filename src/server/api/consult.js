import { post } from "@/server/axios";

//获取可以预约的咨询师列表
export function reservationApiGetConsultant(params) {
  params.version = "v2";
  return post("/api/register/list", params);
}
export function reservationApiGetConsultantDetails(params) {
  params.version = "v2";
  return post("/api/register/info", params);
}

export function reservationApiGetConsultantAdd(params) {
  params.version = "v2";
  return post("/api/register/add", params);
}

export function reservationApiReadAll(params) {
  return post("/api/register/readAll", params);
}

export function reservationApiListMsg(params) {
  // params.version = "v2";
  return post("/api/register/listMsg", params);
}

export function reservationApiOnlinemsg(params) {
  params.version = "v2";
  return post("/api/register/onlinemsg", params);
}
export function reservationApiDelMsg(params) {
  params.version = "v2";
  return post("/api/register/delMsg", params);
}
export function reservationApiInfoMsg(params) {
  params.version = "v2";
  return post("/api/register/infoMsg", params);
}
export function reservationApiReply(params) {
  params.version = "v2";
  return post("/api/register/reply", params);
}

export function visitorApiGetList(params) {
  return post("/api/visitor/list", params);
}

export function visitorApiGetDoctorList(params) {
  return post("/api/visitor/doctorlist", params);
}

export function visitorApiGetDoctorInfo(params) {
  return post("/api/visitor/info", params);
}

export function visitorApiDoctorDelete(params) {
  return post("/api/visitor/del", params);
}

export function visitorApiDoctorEdit(params) {
  return post("/api/visitor/edit", params);
}

export function visitorApiUserList(params) {
  return post("/api/visitor/userlist", params);
}

export function visitorApiDoctorSubmit(params) {
  return post("/api/visitor/submit", params);
}
