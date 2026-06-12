import {post} from "@/server/axios";


//获取咨询师标签
export function ConsultantApiGetLabels() {

    return post('/backend/user/label', {})
}


//添加咨询师
export function ConsultantApiAddConsultant(params) {
    let {labels, activeSelectLabel, ...data} = params
    return post('/backend/user/addexpert', data)
}

//修改咨询师
export function ConsultantApiEditConsultant(params) {
    let {labels, activeSelectLabel, ...data} = params
    return post('/backend/user/editExpert', data)
}
