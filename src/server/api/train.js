import {post} from "@/server/axios";

export function getTrainList(params) {

    return post('/backend/train/list', params)
}

export function addTrain(params) {
    return post('/backend/train/add', params)
}


export function updateTrain(params) {
    return post('/backend/train/edit', params)
}

export function removeTrain(params) {
    return post('/backend/train/del', params)
}

export function getTrainClassList(params) {

    return post('/backend/trainclass/list', params)
}


export function addTrainClass(params) {
    return post('/backend/trainclass/add', params)
}

export function removeTrainClass(params) {
    return post('/backend/trainclass/del', params)
}


export function getTrainClassListFront(params) {
    return post('/backend/trainclass/list', params)
}

export function getTrainListFront(params) {
    return post('/backend/train/list', params)
}

//获取随机的认知数据前端训练用到
export function getTrainRandomList(params) {
    return post('/api/train/randomlist', params)
}