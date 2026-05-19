import {post} from "@/server/axios";

//系统用户数和部门统计
export function statisticsUserDeptApiData(params) {
    return post('/backend/statistics/userroledatalist', params)
}

//部门人数统计
export function statisticsDeptApiData(params) {
    return post('/backend/statistics/classdatalist', params)
}

//活跃度统计
export function statisticsActivityApiData(params) {
    return post('/backend/statistics/userlogindatalist', params)
}
