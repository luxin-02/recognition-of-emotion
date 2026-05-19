export default [
       {
        path: "/game1",
        component: () => import("@/views/front/views/game/Game1.vue"),
        meta: {
          title: "翻牌",
        },
      },
      {
        path: "/game2",
        component: () => import("@/views/front/views/game/Game2.vue"),
        meta: {
          title: "拼图",
        },
      },
      {
        path: "/game3",
        component: () => import("@/views/front/views/game/Game3.vue"),
        meta: {
          title: "眼力大比拼",
        },
      },
      {
        path: "/game4",
        component: () => import("@/views/front/views/game/Game4.vue"),
        meta: {
          title: "舒特尔测试",
        },
      },
      {
        path: "/game5",
        component: () => import("@/views/front/views/game/Game5.vue"),
        meta: {
          title: "大家来找茬",
        },
      },
      {
        path: "/game6",
        component: () => import("@/views/front/views/game/Game6.vue"),
        meta: {
          title: "迷宫",
        },
      },
      {
        path: "/game7",
        component: () => import("@/views/front/views/game/Game7.vue"),
        meta: {
          title: "板块迭代",
        },
      },
      {
        path: "/game8",
        component: () => import("@/views/front/views/game/Game8.vue"),
        meta: {
          title: "旋转拼图",
        },
      }
];
