import { post } from "@/server/axios";

//获取体系化学习分类
export function systematizationClassApiList(params){
    return post('/backend/systematizeclass/list', params)
}
//新增体系化学习分类
export function systematizationClassApiAdd(params){
    return post('/backend/systematizeclass/add', params)
}
//删除体系化学习分类
export function systematizationClassApiDel(params){
    return post('/backend/systematizeclass/del', params)
}
//获取体系化学习分类下的列表
export function systematizationApiList(params){
    return post('/backend/systematize/list', params)
}
//新增体系化学习分类下的列表
export function systematizationApiAdd(params){
    return post('/backend/systematize/add', params)
}
//编辑体系化学习分类下的列表
export function systematizationApiEdit(params){
    return post('/backend/systematize/edit', params)
}
//获取体系化学习分类下的列表的详情
export function systematizationApiInfo(params){
    return post('/backend/systematize/info', params)
}
//删除体系化学习图片
export function systematizationApiDel(params){
    return post('/backend/systematize/del', params)
}