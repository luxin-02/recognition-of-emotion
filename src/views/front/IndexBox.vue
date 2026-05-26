<template>
  <div class="index-wrap" v-loading="loading">
    <div class="top_bar">
      <div class="left_top_bar">
        <div class="logo">
          <img :src="$ip + $store.getters.sysInfo.cover_photo1" />
        </div>
        <div class="text">
          {{ $store.getters.sysInfo.unit }}
        </div>
      </div>

      <div class="system_text_index">
        {{ $store.getters.sysInfo.name }}
      </div>

      <div class="right_top_bar">
        <template v-if="$route.meta.notAuthPage">
          <div
            class="icon_box"
            v-if="!$route.meta.exitSystem"
            @click="$router.push('login')"
          >
            <img src="@/assets/img/front/icon/backIcon.png" />
            <div class="text">返回上级</div>
          </div>
          <div class="icon_box" v-if="$route.meta.exitSystem" @click="offSys">
            <img class="exitIcon" src="@/assets/img/front/icon/exitIcon.png" />
            <div class="text">退出系统</div>
          </div>
        </template>
        <template v-else>
          <div class="icon_box" v-if="$route.meta.exitLogin" @click="logout">
            <img class="exitIcon" src="@/assets/img/front/icon/exitIcon.png" />
            <div class="text">退出登录</div>
          </div>
          <div class="icon_box" @click="$router.go(-1)" v-else>
            <img src="@/assets/img/front/icon/backIcon.png" />
            <div class="text">返回上级</div>
          </div>
        </template>
      </div>
    </div>

    <!-- <template v-if="$route.path != '/home'">
      <div
        class="exit_btn"
        v-if="$route.path == '/login'"
        @click="offSys()"
      ></div>
      <div class="back_btn" v-else @click="goRetreat()"></div>
    </template> -->

    <div class="main-box">
      <transition name="fade">
        <router-view />
      </transition>

      <!-- <buttonControl v-if="!$route.meta.showBtnWrap"></buttonControl> -->
    </div>
  </div>
</template>

<script>
// import buttonControl from "@/components/common/buttonControl/index.vue"
import { userBackApiLogout, userBackApiLogin } from "@/server/api/user.js"
import { mapGetters } from "vuex"
export default {
  // components: { buttonControl },
  data() {
    return {
      dropDown: false,
      loading: false,
      showUserType: false,
    }
  },
  computed: {
    ...mapGetters(["userInfo", "sysInfo"]),
  },
  created() {},
  mounted() {
    document.addEventListener("click", this.bodyCloseMenus)
  },
  beforeDestroy() {
    document.removeEventListener("click", this.bodyCloseMenus)
  },
  methods: {
    goRetreat() {
      if (window.goHistoryFn) {
        window.goHistoryFn()
      } else {
        this.$goRetreat()
      }
    },
    //关闭下拉框
    bodyCloseMenus(e) {
      if (this.dropDown == true) {
        this.dropDown = false
      }
    },
    toBackstage() {
      this.$router.push("/index")
    },
    /*
      游客登录
     */
    async guestLogin() {
      try {
        this.loading = true
        const { data } = await userBackApiLogin({
          method: "loginByGuest",
        })
        this.$store.commit("SET_USER_INFO", data.data)
        this.$myMessage({
          type: "font-success",
          message: "登录成功!",
        })
        this.$router.push("/home")
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.$popup({
        title: "提示",
        content: "确认退出登录？",
        saveFoo: () => {
          userBackApiLogout()
          setTimeout(() => {
            this.$store.commit("SET_USER_INFO", null)
            this.$router.push("/login")
          }, 200)
        },
      })
    },
    offSys() {
      this.$popup({
        title: "提示",
        content: "确定要退出本系统？",
        saveFoo: () => {
          if ("FingerprintObj" in window) {
            FingerprintObj.closeWindow()
          } else {
            this.$myMessage({
              type: "font-error",
              message: "当前状态下，没有此功能！",
            })
          }
        },
      })
    },
  },
}
</script>

<style scoped lang="scss">
.index-wrap {
  position: relative;
  // box-sizing: border-box;
  // width: 1920px;
  // height: 1080px;
  width: 100vw;
  height: 100vh;
  background-image: url(@/assets/img/front/index/background.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  .back_btn,
  .exit_btn {
    width: 84px;
    height: 92px;
    background-image: url(@/assets/img/front/index/back_btn.png);
    background-size: 100% 100%;
    position: absolute;
    right: 60px;
    bottom: 40px;
    z-index: 9;
  }
  .exit_btn {
    background-image: url(@/assets/img/front/index/exit_system.png);
  }
}

.top_bar {
  width: 100%;
  height: 111px;
  display: flex;
  // align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  padding: 0 30px;
  box-sizing: border-box;
  -webkit-app-region: drag;
  background-image: url(@/assets/img/front/index/top_bar.png);
  background-size: 100% 100%;

  .left_top_bar {
    display: flex;
    align-items: center;
    height: 50px;

    .company_icon {
      width: 30px;
      height: 30px;
      background: #ffffff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: "ziyuanyuanti400W";

      img {
        width: 18px;
        height: 22px;
      }
    }

    .text {
      font-size: 18px;
      font-family: "ziyuanyuanti400W";
      font-weight: 400;
      text-align: left;
      color: #ffffff;
      margin-left: 9px;
    }
    .logo{
      >img{
        width: 30px;
        height: 30px;
      }
    }
  }
  .right_top_bar {
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    -webkit-app-region: no-drag;

    .icon_box {
      display: flex;
      align-items: center;
      padding-left: 18px;
      cursor: pointer;

      img {
        width: 20px;

        &.userIcon {
          width: 18px;
          height: 18px;
        }

        &.setIcon {
          width: 18px;
          height: 18px;
        }

        &.exitIcon {
          width: 18px;
          height: 19px;
        }
      }

      .text {
        font-size: 18px;
        font-family: "ziyuanyuanti400W";
        font-weight: 400;
        text-align: left;
        color: #ffffff;
        line-height: 20px;
        margin-left: 10px;
      }

      &:after {
        content: "";
        display: block;
        width: 2px;
        height: 12px;
        background: #ffffff;
        border-radius: 1px;
        margin-left: 19px;
      }

      &:nth-last-child(1) {
        &:after {
          display: none;
        }
      }
    }
  }
  .system_text_index {
    height: 40px;
    font-size: 40px;
    line-height: 40px;
    font-family: "ziyuanyuanti600W";
    font-weight: 600;
    text-align: center;
    color: #ffffff;
    background-image: linear-gradient(to top, #93aff7, #fff);
    -webkit-background-clip: text;
    color: transparent;
    position: absolute;
    left: 50%;
    top: 30px;
    transform: translateX(-50%);
  }

  .main-box {
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave {
  opacity: 1;
}
</style>
