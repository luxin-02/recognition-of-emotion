import {post} from "@/server/axios";

// 后台认知列表
export function cognitionBehindApiList(params) {
    return post('/backend/cognition/list', params)
}

// 后台认知新增
export function cognitionBehindApiAdd(params) {
    return post('/backend/cognition/add', params
    )
}

// 后台认知删除
export function cognitionBehindApiDel(params) {
    return post('/backend/cognition/del', params)
}

// 后台认知编辑
export function cognitionBehindApiEdit(params) {
    return post('/backend/cognition/edit', params)
}

// 后台认知类型列表
export function cognitionClassBehindApiList(params) {
    return post('/backend/cognitionclass/list', params)
}

// 后台认知列表类型新增
export function cognitionClassBehindApiAdd(params) {
    return post('/backend/cognitionclass/add', params)
}

// 后台认知列表类型删除
export function cognitionClassBehindApiDel(params) {
    return post('/backend/cognitionclass/del', params);
}

// 后台认知列表类型编辑
export function cognitionClassBehindApiEdit(params) {
    return post('/backend/cognitionclass/edit', params)
}

// 前台认知列表
export function cognitionFrontApiList(params) {
    return post('/api/cognition/list', params)
}

// 前台认知类型列表
export function cognitionClassFrontApiList(params) {
    return post('/api/cognitionclass/list', params)
}

// 前台认知随机列表
export function cognitionFrontApiRandomList(params) {
    return post('/api/cognition/randomlist', params)
}