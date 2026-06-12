import { post } from "@/server/axios";

//视频分类列表
export function videoClassBackApiList(params) {
  return post("/backend/videoclassB/list", params);
}

//新增视频分类
export function videoClassBackApiAdd(params) {
  return post("/backend/videoclassB/add", params);
}

//删除视频分类
export function videoClassBackApiDel(params) {
  return post("/backend/videoclassB/del", params);
}

//视频列表
export function videoBackApiList(params) {
  return post("/backend/videoB/list", params);
}

//新增视频
export function videoBackApiAdd(params) {
  return post("/backend/videoB/add", params);
}

//编辑视频
export function videoBackApiEdit(params) {
  return post("/backend/videoB/edit", params);
}

//删除视频
export function videoBackApiDel(params) {
  return post("/backend/videoB/del", params);
}

//上传视频
export function videoBackApiUpload(params) {
  return post("/backend/uploadfile/wav", params);
}

//用户界面视频列表
export function videoApiList(params) {
  return post("/api/videoB/list", params);
}
