import {post} from "@/server/axios";

//备份列表
export function backupApiList(params) {
    return post('/backend/backup/list',params)
}

//新增备份
export function backupApiAdd(params) {
    return post('/backend/backup/add',params)
}

//备份详情
export function backupApiInfo(params) {
    return post('/backend/backup/info',params)
}

//还原备份
export function backupApiRestore(params) {
    return post('/backend/backup/restore',params)
}

//上传备份文件接口
export function backupApiUploadFile(params) {
    return post('/backend/uploadfile/sql',params)
}

//导入备份
export function backupApiImportData(params) {
    return post('/backend/backup/import',params)
}

//下载备份
export function backupApiDownload(params) {
    return post('/backend/backup/down',params)
}

//删除备份
export function backupApiDel(params) {
    return post('/backend/backup/del',params)
}
