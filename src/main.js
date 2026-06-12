import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//==========
// 基础样式
//==========
// rem根元素字体大小计算
import "@/utils/flexible.js";
// 导入字体文件
import "@/assets/fonts/fontStyle.css";
// 初始化样式
import "@/assets/styles/init.scss";

//==========
// 全局数据
//==========
import global from "@/global";

Vue.prototype.$global = global;
Vue.prototype.$ip = global.ip;

//==========
// 常用方法
//==========
// 跳转
Vue.prototype.$toUrl = (url) => {
  router.push(url);
};
// 返回上一级历史
Vue.prototype.$goRetreat = (url = -1) => {
  router.go(url);
};
// 时间日期格式化
import { formatDate, formatTime, getTime, formatDate2 } from "@/utils/time.js";

Vue.prototype.$formatDate = formatDate;
Vue.prototype.$formatDate2 = formatDate2;
Vue.prototype.$formatTime = formatTime;
Vue.prototype.$getTime = getTime;
// 自定义指令
import directive from "@/utils/directive.js";

Vue.use(directive);
// 自定义过滤器
import filters from "@/utils/filters.js";

Vue.use(filters);

//==========
// 网络请求
//==========
// axios
import { get, post } from "@/server/axios";

Vue.prototype.$get = get;
Vue.prototype.$post = post;

//==========
// 组件
//==========
// ElementUI
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);
// 用户界面组件注册
import "@/components/front/useAll";
// 后台界面组件注册
import "@/components/backstage/useAll";
import Teleport from "vue2-teleport";
// <Teleport></Teleport>
Vue.component("Teleport", Teleport);

Vue.filter("getTime", (time) => {
  // 转换为式分秒
  let m = parseInt((time / 60) % 60);
  m = m < 10 ? "0" + m : m;
  let s = parseInt(time % 60);
  s = s < 10 ? "0" + s : s;
  // 作为返回值返回
  return m + ":" + s;
});

// // 阻止 vue 在启动时生成生产提示
// Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
