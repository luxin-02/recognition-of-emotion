import { post } from "@/server/axios";

// 后台获取音乐列表
export function backMusicApiList(params) {
  return post("/backend/music/list", params);
}

// 后台新增音乐列表
export function backMusicApiAdd(params) {
  return post("/backend/music/add", params);
}

// 后台删除音乐
export function backMusicApiDel(params) {
  return post("/backend/music/del", params);
}

// 后台修改音乐
export function backMusicApiEdit(params) {
  return post("/backend/music/edit", params);
}

// 后台获取音乐类型列表
export function backMusicClassApiList(params) {
  return post("/backend/musicclass/list", params);
}

// 后台新增音乐类型列表
export function backMusicClassApiAdd(params) {
  return post("/backend/musicclass/add", params);
}

// 后台删除音乐类型
export function backMusicClassApiDel(params) {
  return post("/backend/musicclass/del", params);
}
// 后台修改音乐类型
export function backMusicClassApiEdit(params) {
  return post("/backend/musicclass/edit", params);
}

// 前台获取音乐列表
export function frontMusicApiList(params) {
  return post("/api/music/list", params);
}

// 前台获取音乐类型列表
export function frontMusicClassApiList(params) {
  return post("/api/musicclass/list", params);
}

// 前台获取随机音乐
export function frontMusicRandMusic(params) {
  return post("/api/music/randMusic", params);
}
