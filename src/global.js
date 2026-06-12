/**
 * 全局数据
 */

let ip = location.protocol + "//" + location.hostname + ":8057/"; //网络请求地址
let version = "v1"; // api接口版本号
let successCode = 200; //接口响应成功返回的code

if (process.env.NODE_ENV === "development") {
  // ip = "http://192.168.1.23:8057/";
  // ip = "http://192.168.1.100:8057/";
}
export default {
  ip,
  version,
  successCode,
};
