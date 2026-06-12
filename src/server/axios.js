import axios from "axios";
import qs from "qs";
import global from "@/global.js";
import { Message } from "element-ui";
import router from "@/router";
import store from "@/store";
import { checkRequest, deleteRequestKey } from "./stopRepeatServer.js"

const server = axios.create({
  baseURL: global.ip,
  timeout: 65000,
  headers: {
    "content-type": "application/x-www-form-urlencoded;charset=utf-8 ",
  },
});

//GET
const get = function (url) {
  return server({
    method: "get",
    url: url,
  });
};
/**
 * POST
 * @param {*} url 
 * @param {*} data 
 * @param {*} config { version: 'v2',//api版本号 stopRepeat: true,//阻止重复请求 noShowMsg: true,//不显示默认消息提示 }
 * @returns 
 */
const post = function (url, data, config) {
  return server({
    method: "post",
    url: url,
    data: data,
    ...config,
  });
};
//PUT
const put = function (url, data, config) {
  return server({
    method: "put",
    url: url,
    data: data,
    ...config,
  });
};
//DELETE
const del = function (url) {
  return server({
    method: "delete",
    url: url,
  });
};


//请求拦截器
server.interceptors.request.use(
  (config) => {

    // 默认请求头
    config.headers['version'] = config.version || global.version;
    config.headers['time'] = parseInt(new Date().getTime() / 1000);
    config.headers['token'] = store.getters.token;
    config.headers['sign'] = store.getters.sign;

    if (config.data instanceof FormData) {
      // config.data.append("token", token);
    } else {
      config.data = qs.stringify({
        // token,
        ...config.data,
      });
    }

    // 请求时通过设置 config.stopRepeat = true 可使重复请求被中断
    if (config.stopRepeat) {
      //阻止重复请求
      const source = axios.CancelToken.source();
      config.cancelToken = source.token;
      checkRequest(config, source)
    }

    return config;
  },
  (error) => {
    Message("请求错误");
    return error;
  }
);

//响应拦截器
server.interceptors.response.use(
  (response) => {
    // 响应完成后删除key
    deleteRequestKey(response.config)

    // 当请求不正常时，弹出消息提示
    if (response.data.code != global.successCode) {
      let msg = response.config.msg || response.data.msg || '操作失败';
      !response.config.noShowMsg && Message({ message: msg, duration: 1000 });
      return Promise.reject(msg)
    }

    return response;
  },
  (error) => {
    console.log(error)
    if (error.code == 'ERR_CANCELED') { // 被阻止的请求会报该错误
      console.log(error.message)
      return Promise.reject(error)
    }
    // 响应完成后删除key
    deleteRequestKey(error.config)

    if (error.config && error.config.noShowMsg) {
      return error;
    }

    if (!error.response) {
      Message({ message: '网络异常，请检查网络连接', duration: 1000 });
    } else switch (error.response.status) {
      case 401:
        Message({ message: '验证失败,请重新登录', duration: 1000 });
        localStorage.setItem('loginform', '');
        store.commit('SET_USER_INFO', null);
        router.push('/login');
        break;
      case 404:
        Message({ message: '找不到目标地址，请联系管理员处理', duration: 2000 });
        break;
      case 500:
        Message({ message: '内部资源启动失败，请重启软件...', duration: 2000 });
        break;
      case 502:
        Message({ message: '无权限访问', duration: 1000 });
        router.push('/');
        break;
      case 503:
        Message({ message: '服务不可用，请联系管理员处理', duration: 2000 });
        break;
      default:
        Message({ message: error.response.statusText, duration: 2000 });
        break;
    }
    return Promise.reject(error);
  }
);
export { server, get, post, put, del };