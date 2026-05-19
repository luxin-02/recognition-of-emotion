/**
 * 组件注册到全局
 */

import vue from 'vue'


import backstagePopup from "@/components/backstage/popup/popup.js";
vue.use(backstagePopup)

import imgCutting from "@/components/backstage/imgCutting/imgCutting.js";
vue.use(imgCutting)

//后台弹框
import Dialog from "@/components/backstage/Dialog.vue";
vue.component('backstage-dialog', Dialog)

import cascaderVue from "@/components/backstage/cascaderVue.vue"
vue.component('cascaderVue', cascaderVue)

//后台开关
import SwitchVue from '@/components/backstage/SwitchVue.vue'
vue.component('SwitchVue', SwitchVue)

//后台搜索框
import inputVue from '@/components/backstage/inputVue.vue'
vue.component('inputVue', inputVue)

//后台时间选择器
import startAndendData from '@/components/backstage/startAndendData.vue'
vue.component('startAndendData', startAndendData)

//后台按钮
import buttonVue from '@/components/backstage/buttonVue.vue'
vue.component('buttonVue', buttonVue)

//后台表格
import tableVue from '@/components/backstage/TableVue.vue'
vue.component('tableVue', tableVue)

//后台勾选框
import checkboxVue from '@/components/backstage/checkboxVue.vue'
vue.component('checkboxVue', checkboxVue)

//后台分页
import pageVue from '@/components/backstage/pageVue.vue'
vue.component('pageVue', pageVue)

//后台下拉
import selectVue from '@/components/backstage/selectVue.vue'
vue.component('selectVue', selectVue)

import ClassChange from '@/components/backstage/classChange.vue'
vue.component('ClassChange', ClassChange)

import UploadButton from '@/components/backstage/UploadButton.vue'
vue.component('UploadButton', UploadButton)

import RecursiveList from '@/components/backstage/RecursiveList.vue'
vue.component('RecursiveList', RecursiveList)







