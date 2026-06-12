import qs from "qs";

// 阻止重复axios请求

/**创建存储 key 的 集合 */
let keyMap = new Map();
/**获取每一次请求的key */
function getRequestKey(config) {
  let { url, method, data, params } = config;
  // console.log(url, method, data, params)
  let dataKey = ''
  if (config.data instanceof FormData) {
    let datas = [], keys = new Set()
    for (let key of config.data.keys()) {
      keys.add(key)
    }
    for (let key of keys) {
      let vals = config.data.getAll(key)
      let valStrs = []
      for (let val of vals) {
        if (Object.prototype.toString.call(vals[0]) == '[object File]') {
          valStrs.push(val.name+'_'+val.size)
        } else {
          valStrs.push(val.toString())
        }
      }
      datas.push(key + '=' + valStrs.toString())
    }
    dataKey = datas.join('&')
  } else {
    dataKey = data.toString()
  }
  //记得这里一定要处理 每次请求都会变化的参数(比如每个请求都携带了时间戳),否则二个请求的key不一样
  let key = [url, method, dataKey, qs.stringify(params)].join("&");
  // console.log(key)
  return key;
}
/**判断是否存在该key,不存在则插入 */
function checkRequest(config, source) {
  let key = getRequestKey(config);
  if (keyMap.has(key)) {
    source.cancel(`${config.url} 请求被中断`);
  } else {
    keyMap.set(key, config);
  }
}
/**响应完成后,删除key */
function deleteRequestKey(config) {
  if (!config) {
    keyMap.clear();
    return
  }
  let key = getRequestKey(config);
  // console.log(key, keyMap)
  if (keyMap.has(key)) {
    setTimeout(() => { // 避免短时间内多次执行
      keyMap.delete(key);
    }, 500);
  }
}

export { getRequestKey, checkRequest, deleteRequestKey };