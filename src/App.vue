<template>
  <div id="appBox">
    <div class="top-drag_box"></div>
    <router-view />
    <bearControl
      v-show="sphere && sphere_transparency > 0"
      :style="{
        opacity: sphere_transparency,
      }"
    ></bearControl>
  </div>
</template>

<script>
import {
  frontApiSettingInfoWithoutLogin,
  frontApiSettingInfoInLogin,
} from "@/server/api/system"
import { userGruntApiList } from "@/server/api/role"
import bearControl from "@/components/common/bearControl/index.vue"
export default {
  components: { bearControl },
  data() {
    return {}
  },
  computed: {
    isLogin() {
      return this.$store.getters.isLogin
    },
    isAdmin() {
      return this.$store.getters.isAdmin
    },
    userInfo() {
      return this.$store.getters.userInfo
    },
    sysInfo() {
      return this.$store.getters.sysInfo
    },
    sphere() {
      return this.$store.getters.sysInfo.sphere == 0
    },
    sphere_transparency() {
      return +(+this.$store.getters.sysInfo.sphere_transparency / 100).toFixed(
        2
      )
    },
  },
  watch: {
    isLogin(v) {
      if (v) {
        this.getSystemInfoLogin()
        if (this.isAdmin) {
          this.getSidebarData()
        }
      } else {
        this.getSystemInfo()
      }
    },
  },
  mounted() {
    if (this.isLogin) {
      this.getSystemInfoLogin()
      if (this.isAdmin) {
        this.getSidebarData()
      }
    } else {
      this.getSystemInfo()
    }
  },
  methods: {
    // 获取初始设置
    async getSystemInfo() {
      const { data } = await frontApiSettingInfoWithoutLogin()
      if (data.code == 200) {
        this.$store.commit("UPDATE_SYS_INFO", data.data)
      }
    },
    async getSystemInfoLogin() {
      const { data } = await frontApiSettingInfoInLogin()
      if (data.code == 200) {
        data.data.sphere = data.data.sphere ?? "0"
        data.data.sphere_transparency = +(data.data.sphere_transparency ?? 100)
        data.data.sphere_effects = +(data.data.sphere_effects ?? 50)
        data.data.sphere_game_effects = +(data.data.sphere_game_effects ?? 50)
        this.$store.commit("UPDATE_SYS_INFO", data.data)
      }
    },
    // 获取后台导航栏
    async getSidebarData() {
      const { data } = await userGruntApiList({
        username: this.userInfo.username,
      })

      let routes = data.data
      routes = routes.filter((r) => {
        return r.check != 0
      })
      routes.forEach((v) => {
        v.children ? (v.children = v.children.filter((v) => v.check != 0)) : ""
      })

      this.$store.commit("SET_MENU_LIST", routes)
    },
  },
}
</script>

<style lang="scss">
html {
  overflow: hidden;
  -webkit-app-region: no-drag;
}

body {
  width: 1920px;
  height: 1080px;
  margin: 0;
  padding: 0;
  -webkit-app-region: no-drag;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular, serif, "siyuan-heiti";
  // overflow: hidden;
  // 设置元素不可复制 解决了拖动时会拖掉的问题
  -moz-user-select: none; /* Firefox私有属性 */
  -webkit-user-select: none; /* WebKit内核私有属性 */
  -ms-user-select: none; /* IE私有属性(IE10及以后) */
  -khtml-user-select: none; /* KHTML内核私有属性 */
  -o-user-select: none; /* Opera私有属性 */
  user-select: none; /* CSS3属性 */
  font-size: 16px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
}

#appBox {
  -webkit-app-region: no-drag;
  width: 1920px;
  height: 1080px;
  overflow: hidden;
}

.top-drag_box {
  display: none;
  position: fixed;
  width: 1000px;
  height: 70px;
  top: 0;
  left: 50%;
  margin-left: -500px;
  -webkit-app-region: drag;
  //cursor: move;
  z-index: 100;
}
</style>
