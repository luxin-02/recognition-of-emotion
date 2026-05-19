/**
 **部门通用api
 * */
import { post } from "@/server/axios";

// 班级/部门列表
export function deptApiList(params) {
  return post("/backend/dept/getlists", params);
}
export function deptApiList2(params) {
  return post("/backend/dept/getDeptList", params);
}

// 班级/部门新增
export function deptApiAdd(params) {
  return post("/backend/dept/add", params);
}

// 班级/部门管理员
export function deptApiManager(params) {
  return post("/backend/dept/manager", params);
}

// 编辑班级/部门
export function deptApiEdit(params) {
  return post("/backend/dept/edit", params);
}

// 删除班级/部门
export function deptApiDel(params) {
  return post("/backend/dept/del", params);
}
