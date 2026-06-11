export default [
  {
    path: "",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/front/login/frontLogin.vue"),

    // component: () => import("@/views/front/views/detection/index.vue"),
    meta: {
      title: "home", //登录
      exitSystem: true,
      hideRetreat: true,
      notAuthPage: true, //不用鉴权页面的菜单
      showBtnWrap: true,
    },
  },
  {
    path: "/fingerprintLogin",
    name: "FingerprintLogin",
    component: () =>
      import("@/views/front/login/fingerprintLogin/fingerprintLogin.vue"),
    meta: {
      title: "指纹登录",
      hideRetreat: true,
      notAuthPage: true, //不用鉴权页面的菜单
    },
  },
  {
    path: "/faceLogin",
    name: "faceLogin",
    component: () => import("@/views/front/login/faceLogin/faceLogin.vue"),
    meta: {
      title: "人脸登录",
      hideRetreat: true,
      notAuthPage: true, //不用鉴权页面的菜单
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/front/register/frontRegister.vue"),
    meta: {
      title: "用户注册",
      hideRetreat: true,
      notAuthPage: true, //不用鉴权页面的菜单
    },
  },
  {
    path: "/retrievePassword",
    name: "retrievePassword",
    component: () =>
      import("@/views/front/retrievePassword/retrievePassword.vue"),
    meta: {
      title: "忘记密码",
      hideRetreat: true,
      notAuthPage: true, //不用鉴权页面的菜单
    },
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/front/index/Home.vue"),
    meta: {
      title: "home", //首页
      loginRequire: true,
      exitLogin: true,
      showBtnWrap: true,
    },
  },
  {
    path: "/front",
    name: "front",
    component: () => import("@/views/front/views/index.vue"),
    children: [
      // {
      //   path: "/user",
      //   component: () => import("@/views/front/views/userInfo/index.vue"),
      //   meta: {
      //     title: "用户资料",
      //   },
      // },
      // {
      //   path: "/enteringFace",
      //   name: "Entering",
      //   component: () => import("@/views/front/views/user/userFace.vue"),
      //   meta: {
      //     title: "录入人脸",
      //   },
      // },
      // {
      //   path: "/enteringFingerprint",
      //   name: "Entering",
      //   component: () => import("@/views/front/views/user/userFingerprint.vue"),
      //   meta: {
      //     title: "录入指纹",
      //   },
      // },

      {
        path: "/video",
        name: "Video",
        component: () => import("@/views/front/views/video/index.vue"),
        meta: {
          title: "心理视频",
        },
      },

      {
        path: "/specialist", //专家列表
        component: () =>
          import("@/views/front/views/specialist/specialist.vue"),
        meta: {
          title: "心理咨询",
        },
      },
      {
        path: "/specialist/reservation", //预约提交
        component: () =>
          import("@/views/front/views/specialist/reservation.vue"),
        meta: {
          title: "心理咨询",
        },
      },
      {
        path: "/specialist/YyList", //预约列表
        component: () => import("@/views/front/views/specialist/YyList.vue"),
        meta: {
          title: "心理咨询",
        },
      },
      {
        path: "/specialist/YyList/Yyinfo", //预约详情
        component: () => import("@/views/front/views/specialist/Yyinfo.vue"),
        meta: {
          title: "心理咨询",
        },
      },
      {
        path: "/specialist/ZxList", //咨询记录
        component: () => import("@/views/front/views/specialist/ZxList.vue"),
        meta: {
          title: "心理咨询",
        },
      },

      {
        path: "/article",
        component: () => import("@/views/front/views/article/index.vue"),
        meta: {
          title: "心理科普",
        },
      },
      {
        path: "/article/detail",
        component: () => import("@/views/front/views/article/detail.vue"),
        meta: {
          title: "文章详情",
        },
      },
      {
        path: "/scale",
        component: () => import("@/views/front/views/scale/index.vue"),
        meta: {
          title: "心理评估",
        },
      },
      {
        path: "/scale/details",
        component: () => import("@/views/front/views/scale/detail.vue"),
        meta: {
          title: "评估详情",
        },
      },
      {
        path: "/music",
        component: () => import("@/views/front/views/music/index.vue"),
        meta: {
          title: "减压音乐",
        },
      },
      {
        path: "/photograph",
        component: () => import("@/views/front/views/photograph/index.vue"),
        meta: {
          title: "心理图片",
        },
      },
      {
        path: "/EmotionSquare",
        component: () => import("@/views/front/views/EmotionSquare/index.vue"),
        meta: {
          title: "情绪广场",
          showBtnWrap: true,
        },
      },
      {
        path: "/clockIn",
        component: () => import("@/views/front/views/clockIn/index.vue"),
        meta: {
          title: "情绪打卡",
        },
      },
      {
        path: "/clockIn/addPage",
        component: () => import("@/views/front/views/clockIn/addPage.vue"),
        meta: {
          title: "添加情绪",
        },
      },
      {
        path: "/clockIn/periodPage",
        component: () => import("@/views/front/views/clockIn/periodPage.vue"),
        meta: {
          title: "情绪周期",
        },
      },
      {
        path: "/courseVideo",
        component: () => import("@/views/front/views/courseVideo/index.vue"),
        meta: {
          title: "心理微课",
        },
      },
      {
        path: "/company",
        component: () => import("@/views/front/views/company/index.vue"),
        meta: {
          title: "企业概况",
        },
      },
      {
        path: "/userInfo",
        component: () => import("@/views/front/views/userInfo/index.vue"),
        meta: {
          title: "个人中心",
        },
      },
      {
        path: "/set",
        component: () => import("@/views/front/views/set/index.vue"),
        meta: {
          title: "软件设置",
        },
      },
      {
        path: "/relax",
        component: () => import("@/views/front/views/relax/index.vue"),
        meta: {
          title: "放松调节",
          showBtnWrap: true,
        },
      },
      {
        path: "/relax/eve",
        component: () => import("@/views/front/views/relax/eve.vue"),
        meta: {
          title: "眼动脱敏",
          showBtnWrap: true,
        },
      },
      {
        path: "/relax/hrball",
        component: () => import("@/views/front/views/relax/hrball.vue"),
        meta: {
          title: "呼吸球训练",
          showBtnWrap: true,
        },
      },
      {
        path: "/relax/hxdrill",
        component: () => import("@/views/front/views/relax/hxdrill.vue"),
        meta: {
          title: "呼吸球训练",
          showBtnWrap: true,
        },
      },
      {
        path: "/report",
        component: () => import("@/views/front/views/report/index.vue"),
        meta: {
          title: "报告记录",
          keepAlive: true,
        },
      },
      {
        path: "/report/details",
        component: () => import("@/views/front/views/report/details.vue"),
        meta: {
          title: "报告详情",
        },
      },
        {
        path: "/report/emotionReport",
        component: () => import("@/views/front/views/report/emotionReport.vue"),
        meta: {
          title: "情绪报告",
        },
      },
      {
        path: "/gameList",
        component: () => import("@/views/front/views/game/Index.vue"),
        meta: {
          title: "游戏列表",
        },
      },
      {
        path: "/smileCheck",
        component: () => import("@/views/front/views/smileCheck/index.vue"),
        meta: {
          title: "微笑打卡",
        },
      },
      {
        path: "/smileCheck/statistics",
        component: () =>
          import("@/views/front/views/smileCheck/statistics.vue"),
        meta: {
          title: "微笑打卡统计",
        },
      },
      {
        path: "/detection",
        component: () => import("@/views/front/views/detection/index.vue"),
        meta: {
          title: "情绪检测",
        },
      },
    ],
  },
]
