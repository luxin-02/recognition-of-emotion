import Vue from "vue";
import VueRouter from "vue-router";
import FrontBox from "@/views/front/IndexBox.vue";
import frontRouter from "./frontRouter";
import BackstageBox from "@/views/backstage/BackstageBox.vue";
import backstageRouter from "./backstageRouter";
import { Message } from "element-ui";
import store from "@/store";
import game from "./game";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: FrontBox,
    children: frontRouter,
  },
  {
    path: "/index",
    component: BackstageBox,
    children: backstageRouter,
    meta: {
      loginRequire: true, // 页面需要登录
      adminRequire: true, // 页面需要管理员身份
    },
  },
  ...game,
];

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// 解决路由重复跳转报错
// const routerPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push (location) {
//   return routerPush.call(this, location).catch((error) => error)
// }
// const routerReplace = VueRouter.prototype.replace
// VueRouter.prototype.replace = function replace (location) {
//   routerReplace.call(this, location).catch((error) => error)
// }

router.beforeEach((to, from, next) => {
  if (
    to.matched.some(function (item) {
      return item.meta.loginRequire;
    })
  ) {
    if (store.getters.isLogin) {
      if (
        to.matched.some(function (item) {
          return item.meta.adminRequire;
        }) &&
        !store.getters.isAdmin
      ) {
        if (store.getters.userInfo.role == 4) {
          next();
          return;
        }
        Message({ message: "无权限访问", duration: 1000 });
        next({ name: "Home" });
      } else {
        next();
      }
    } else {
      if (to.name != "Home")
        Message({ message: "无权限访问，请登录", duration: 1000 });
      next({ name: "Login" });
    }
  } else {
    next();
  }
});

export default router;
