import { post } from "@/server/axios"

//查询心情
export function getMood(params) {
  return post("/api/mood/index", params)
}

//添加心情
export function addMood(params) {
  return post("/api/mood/add", params)
}

//删除心情
export function delMood(params) {
  return post("/api/mood/del", params)
}

//查询心情记录
export function getMoodRecord(params) {
  return post("/api/mood/record", params)
}

//查询今天的心情记录
export function getTodayMoodRecord(params) {
  return post("/api/mood/getMood", params)
}
