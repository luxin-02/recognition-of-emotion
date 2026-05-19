import { post } from "@/server/axios"

// 我的漂流瓶列表
export function myBottleList(params) {
  return post("/api/bottle/list", params)
}

// 漂流瓶列表
export function bottleList(params) {
  return post("/api/bottle/drift", params)
}

// 漂流瓶添加
export function bottleAdd(params) {
  return post("/api/bottle/add", params)
}

// 漂流瓶删除
export function bottleDel(params) {
  return post("/api/bottle/del", params)
}

// 漂流瓶详情
export function bottleInfo(params) {
  return post("/api/bottle/info", params)
}

// 漂流瓶添加评论
export function bottleCommentAdd(params) {
  return post("/api/bottle/comment", params)
}

// 漂流瓶删除评论
export function bottleCommentDel(params) {
  return post("/api/bottle/comment_del", params)
}