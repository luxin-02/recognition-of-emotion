/**
 * 组件注册到全局
 */

import vue from "vue";

// 消息弹窗
import openPopup from "@/components/front/popup/index.js";
vue.prototype.$popup = openPopup;
import popup from "@/components/front/popup/index.vue";
vue.component("zx-popup", popup);

// message消息提示
import openMessage from "@/components/front/message/index";
vue.prototype.$myMessage = openMessage;

//游戏弹窗
import AnimationPopup from "@/components/AnimationPopup/AnimationPopup.vue";
vue.component("AnimationPopup", AnimationPopup);

import qtDialog from "@/components/front/qt-Dialog.vue";
vue.component("qt-Dialog", qtDialog);
import xtDialog from "@/components/front/xt-Dialog.vue";
vue.component("xt-Dialog", xtDialog);
