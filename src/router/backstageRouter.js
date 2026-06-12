export default [
  // 首页
  {
    path: "",
    redirect: "/index/home",
  },
  {
    path: "home",
    component: () => import("@/views/backstage/home/index.vue"),
    meta: {
      title: "后台首页",
      hideTopInfo: true,
    },
  },
  {
    path: "cognition",
    component: () => import("@/views/backstage/train/cognitionManage.vue"),
    meta: {
      title: "心理图片",
      notes: "心理图片分类及内容管理",
    },
  },
  {
    path: "newcog",
    component: () => import("@/views/backstage/train/newcogManage.vue"),
    meta: {
      title: "认知资源管理",
      notes: "认知资源管理",
    },
  },
  {
    path: "music",
    component: () => import("@/views/backstage/train/audioManage.vue"),
    meta: {
      title: "音乐疗法",
      notes: "音乐疗法分类及内容管理",
    },
  },
  {
    path: "video",
    component: () => import("@/views/backstage/train/videoManage.vue"),
    meta: {
      title: "心理视频",
      notes: "心理视频分类及内容管理。",
    },
  },
  {
    path: "video2",
    component: () => import("@/views/backstage/train/videoManage2.vue"),
    meta: {
      title: "心理微课",
      notes: "心理微课内容管理。",
    },
  },
  {
    path: "training",
    component: () => import("@/views/backstage/train/trainManage.vue"),
    meta: {
      title: "训练管理",
      notes: "对系统内的训练进行上传、编辑等管理。",
    },
  },
  {
    path: "evaluation",
    component: () => import("@/views/backstage/train/evaluationManage.vue"),
    meta: {
      title: "心理评估",
      notes: "对心理评估模块的量表进行上传、编辑等管理。",
    },
  },
  {
    path: "article",
    component: () => import("@/views/backstage/train/articleManage.vue"),
    meta: {
      title: "心理科普",
      notes: "对心理科普文章进行上传、编辑等管理。",
    },
  },
  {
    path: "scene",
    component: () => import("@/views/backstage/train/sceneManager.vue"),
    meta: {
      title: "场景分类及内容管理。",
      notes: "音乐播放管理",
    },
  },

  // 用户管理
  {
    path: "classManage",
    name: "classManage",
    component: () => import("@/views/backstage/userManage/classManage.vue"),
    meta: {
      title: "部门/班级设定",
      notes: "对系统内的部门/班级进行增、删、改、指定管理员等操作。",
    },
  },
  {
    path: "roleManage",
    component: () => import("@/views/backstage/userManage/roleManage.vue"),
    meta: {
      title: "角色管理",
      notes: "对预设角色进行权限管理，并添加新的角色。",
    },
  },
  // 用户管理
  {
    path: "users",
    name: "users",
    component: () => import("@/views/backstage/userManage/users.vue"),
    meta: {
      title: "用户管理",
      notes: "对系统内的所有用户进行增、删、改、查、重置密码等操作。",
    },
  },
  {
    path: "softwareSettings",
    component: () => import("@/views/backstage/other/softwareSettings.vue"),
    meta: {
      title: "单位设置/数据同步",
      notes: "设置软件内的单位信息，与云平台的数据进行同步操作等。",
    },
  },
  {
    path: "advancedOptions",
    component: () => import("@/views/backstage/other/advancedOptions.vue"),
    meta: {
      title: "高级选项设置",
      notes: "对一些功能的详情设置。需要对应功能实装才有效。",
    },
  },
  {
    path: "recycleBin",
    component: () => import("@/views/backstage/other/recycleBin.vue"),
    meta: {
      title: "回收站",
      notes: "以前删除的用户可在回收站进行还原、彻底删除等操作。",
    },
  },
  {
    path: "backups",
    component: () => import("@/views/backstage/other/backups.vue"),
    meta: {
      title: "系统备份",
      notes: "对系统内当前的资料数据进行备份，建立的备份可下载、可还原。",
    },
  },

  //

  {
    path: "auditoryDrill",
    component: () => import("@/views/backstage/train/1auditoryDrill.vue"),
    meta: {
      title: "听觉训练",
      notes: "对听觉训练模块进行上传、删除等管理。",
    },
  },
  {
    path: "durationDrill",
    component: () => import("@/views/backstage/train/2durationDrill.vue"),
    meta: {
      title: "时长感知",
      notes: "对时长感知模块进行上传、删除等管理。",
    },
  },
  {
    path: "sortDrill",
    component: () => import("@/views/backstage/train/3sortDrill.vue"),
    meta: {
      title: "逻辑排序",
      notes: "对逻辑排序模块进行上传、删除等管理。",
    },
  },
  {
    path: "conceptDrill",
    component: () => import("@/views/backstage/train/4conceptDrill.vue"),
    meta: {
      title: "概念认知",
      notes: "对概念认知模块进行上传、删除等管理。",
    },
  },
  {
    path: "perceiveDrill",
    component: () => import("@/views/backstage/train/5perceiveDrill.vue"),
    meta: {
      title: "基础认知",
      notes: "对基础认知模块进行上传、删除等管理。",
    },
  },
  {
    path: "matchingDrill",
    component: () => import("@/views/backstage/train/6matchingDrill.vue"),
    meta: {
      title: "认知匹配",
      notes: "对认知匹配模块进行上传、删除等管理。",
    },
  },

  {
    path: "sizeDrill",
    component: () => import("@/views/backstage/train/7sizeDrill.vue"),
    meta: {
      title: "大小感知",
      notes: "对大小感知模块进行上传、删除等管理。",
    },
  },
];
