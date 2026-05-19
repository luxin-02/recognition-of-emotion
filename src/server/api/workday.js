import {post} from "@/server/axios";

//批量排包
export function workDayApiBatchadd(params) {
    return post('/backend/workday/batchadd', params)
}

//获取排班月份列表
export function workDayApiList(params) {
    return post('/backend/workday/list', params)
}

//删除排班
export function workDayApiRemove(params) {
    return post('/backend/workday/delete', params)
}


export function workDayApiListUser(params) {
    return post('/api/workday/list', params)
}