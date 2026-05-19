import { post } from "@/server/axios";

// 后台获取文章分类列表
export function articleBehindApiClassList(params) {
  return post("/backend/articleclass/list", params);
}

// 后台新增文章分类
export function articleBehindApiClassAdd(params) {
  return post("backend/articleclass/add", params);
}
// 后台删除文章分类
export function articleBehindApiClassDel(params) {
  return post("backend/articleclass/del", params);
}
// 后台获取文章列表
export function articleBehindApiList(params) {
  return post("/backend/article/list", params);
}

// 后台删除文章
export function articleBehindApiDel(params) {
  return post("/backend/article/del", params);
}

// 后台修改文章
export function articleBehindApiEdit(params) {
  return post("/backend/article/edit", params);
}

// 后台新增文章
export function articleBehindApiUAdd(params) {
  return post("/backend/article/add", params);
}

// 前台获取文章列表
export function articleFrontApiList(params) {
  return post("/api/article/list", params);
}

// 前台获取文章详情
export function articleFrontApiInfo(params) {
  return post("/api/article/info", params);
}
