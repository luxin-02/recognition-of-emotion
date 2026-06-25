<template>
  <div class="login">
    <div class="core_warp">
      <!-- <div class="system_title">{{ $store.getters.sysInfo.name }}</div> -->
      <p class="welcome">账号登录</p>
      <el-input
        @keydown.enter.native="login"
        placeholder="输入账号"
        :maxlength="16"
        v-model="form.username"
        style="margin-top: 0.3rem"
      >
        <i slot="prefix" class="el-input__icon"></i>
      </el-input>
      <el-input
        @keydown.enter.native="login"
        type="password"
        placeholder="输入密码"
        :maxlength="16"
        v-model="form.password"
      >
        <i slot="prefix" class="el-input__icon pwd"></i>
      </el-input>

      <!-- <div class="label">
        <div class="text" @click="$toUrl('retrievePassword')">
          &nbsp; &nbsp; 忘记密码
        </div>
      </div> -->
      <br />
      <div class="label">
        <div class="check_box" @click="autoLogin = !autoLogin">
          <img v-if="autoLogin" src="@/assets/img/front/login/sele_yes.png" />
        </div>
        <div class="text" @click="autoLogin = !autoLogin">记住密码</div>

        <div class="retrieve_pwd" @click="$toUrl('retrievePassword')">
          忘记密码
        </div>
        <!-- <div class="retrieve_pwd" @click="$toUrl('register')">注册账号</div> -->
      </div>

      <div
        class="loginBtn"
        @click="login"
        v-loading="loading.login"
        element-loading-background="rgba(0, 0, 0, 0.5)"
      >
        登录
      </div>
      <div class="login_type">
        <span @click="$toUrl('faceLogin')" v-if="$store.getters.isOpenFace">
          人脸登录
        </span>
        <i v-if="$store.getters.isOpenFingerprint"></i>
        <span
          @click="$toUrl('fingerprintLogin')"
          v-if="$store.getters.isOpenFingerprint"
        >
          指纹登录
        </span>
        <i v-if="$store.getters.isOpenGuest"></i>
        <span @click="guestLogin" v-if="$store.getters.isOpenGuest">
          游客登录
        </span>
        <i v-if="$store.getters.isOpenGuest"></i>
        <span @click="$toUrl('register')"> 注册账号 </span>
      </div>
    </div>

    <img class="xion" src="@/assets/img/front/login/xion.png" />
    <img class="biaoqin" src="@/assets/img/front/login/表情.png" />

    <!-- <p class="company">{{ $store.getters.sysInfo.unit }}</p>
    <img
      class="chuangyuCopyrightLogo"
      src="@/assets/img/front/index/chuangyuCopyrightLogo.png"
    /> -->

    <LoginWindow
      v-if="showAdmin"
      :userRouter="{ name: 'Home' }"
      :adminRouter="'/index'"
    ></LoginWindow>
  </div>
</template>

<script>
import { userBackApiLogin } from "@/server/api/user.js"
import LoginWindow from "./LoginWindow.vue"

export default {
  data() {
    return {
      loading: {
        login: false,
        guestLogin: false,
      },

      form: {
        username: "",
        password: "",
      },
      autoLogin: false, // 记住密码自动登录
      showAdmin: false,
    }
  },
  components: { LoginWindow },
  computed: {
    isSuccess() {
      let reg = new RegExp("^.{5,16}$")
      return reg.test(this.form.username) && reg.test(this.form.password)
    },
    checkColor() {
      return this.autoLogin ? "#00aeff" : "#e5f7ff"
    },
  },
  created() {
    let loginFrom = localStorage.getItem("brain-loginform")
    if (loginFrom) {
      loginFrom = JSON.parse(loginFrom)
      this.form = loginFrom
    }
  },
  mounted() {},
  methods: {
    /**
     *退出系统
     */
    offSys() {
      this.$popup({
        title: "提示",
        content: "确定要退出本系统？",
        saveFoo: () => {
          if ("FingerprintObj" in window) {
            // eslint-disable-next-line no-undef
            FingerprintObj.closeWindow()
          } else {
            this.$message("当前状态下，没有此功能！")
          }
        },
      })
    },
    /**登录 */
    async login() {
      if (!this.form.username || !this.form.password) {
        this.$myMessage({
          type: "font-error",
          message: "请输入账号和密码!",
        })
        return
      }
      try {
        this.loading.login = true
        const { data } = await userBackApiLogin({
          username: this.form.username,
          pwd: this.form.password,
          method: "loginbynameandpwd",
        })
        this.$store.commit("SET_USER_INFO", data.data)
        if (this.autoLogin) {
          localStorage.setItem("brain-loginform", JSON.stringify(this.form))
        } else {
          localStorage.removeItem("brain-loginform")
        }
        this.$myMessage({
          type: "font-success",
          message: "登录成功!",
        })
        // if (this.$store.getters.isAdmin) {
        //   this.showAdmin = true;
        // } else {
        this.$router.push("/home")
        // }
      } catch (e) {
        console.error(e)
        this.form.password = ""
      } finally {
        this.loading.login = false
      }
    },
    /*
      游客登录
     */
    async guestLogin() {
      try {
        this.loading.guestLogin = true
        localStorage.removeItem("brain-loginform")
        // this.autoLogin = true;
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
        this.loading.guestLogin = false
      }
    },
  },
}
</script>

<style scoped lang="scss">
.login {
  // position: fixed;
  width: 100vw;
  height: 100vh;
  .core_warp {
    width: 630px;
    height: 630px;
    background-image: url("@/assets/img/front/login/account_bg.png");
    background-size: 100% 100%;
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    // padding: 0 0 0 140px;
    .system_title {
      font-size: 30px;
      font-family: "ziyuanyuanti600W";
      font-weight: 600;
      color: #ffffff;
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
    }
    .welcome {
      font-size: 32px;
      height: 32px;
      font-family: "ziyuanyuanti600W";
      letter-spacing: 0.3px;
      margin: 80px 0 50px 0;
      text-align: center;
      color: #ffffff;
      background-image: linear-gradient(to top, #93aff7, #fff);
      -webkit-background-clip: text;
      color: transparent;
    }
    .el-input {
      margin: 0 0 20px 120px;
      ::v-deep .el-input__inner {
        width: 380px;
        height: 50px;
        background: #11223e;
        border-radius: 23px;
        box-shadow: inset 0px -1.5px 0px 0px rgba(255, 255, 255, 0.2);
        font-size: 16px;
        border: none;
        line-height: 50px;
        color: #fff;

        &::placeholder {
          font-size: 16px;
          font-family: "ziyuanyuanti400W";
          font-weight: 400;
          color: #b8c0c3;
          letter-spacing: 0.36px;
        }
      }
      ::v-deep .el-input__icon {
        width: 18px;
        height: 20px;
        background-image: url(@/assets/img/front/login/user.png);
        background-size: 100% 100%;
        position: absolute;
        left: 330px;
        top: 15px;
      }
      .pwd {
        background-image: url(@/assets/img/front/login/pwd.png);
      }
    }

    .label {
      width: 380px;
      display: flex;
      align-items: center;
      margin: auto;

      .check_box {
        width: 18px;
        height: 18px;
        background-image: url(@/assets/img/front/login/sele_no.png);
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .text {
        line-height: 18px;
        margin-left: 10px;
        font-size: 13px;
        font-family: "ziyuanyuanti400W";
        color: #c2efff;
        letter-spacing: 0.84px;
        cursor: pointer;
      }

      .retrieve_pwd {
        line-height: 18px;
        margin-left: 230px;
        font-size: 13px;
        font-family: "ziyuanyuanti400W";
        color: #c2efff;
        letter-spacing: 0.84px;
        cursor: pointer;
      }
    }
    .loginBtn {
      width: 380px;
      height: 50px;
      background: #0080ff;
      border-radius: 23px;
      font-size: 20px;
      color: #fff;
      font-family: "ziyuanyuanti500W";
      text-align: center;
      line-height: 50px;
      cursor: pointer;
      margin: auto;
      margin-top: 50px;
    }

    .login_type {
      width: 420px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: auto;
      margin-top: 70px;
      > span {
        cursor: pointer;
        font-size: 16px;
        font-family: Resource Han Rounded CN, Resource Han Rounded CN-Regular;
        font-weight: 400;
        text-align: left;
        color: #c2efff;
      }
      > i {
        width: 1px;
        height: 16px;
        background: #ffffff80;
        display: inline-block;
        margin: 0 25px;
      }
    }
  }

  .xion {
    width: 285px;
    height: 410px;
    position: absolute;
    left: 180px;
    bottom: 100px;
  }
  .biaoqin {
    width: 310px;
    height: 350px;
    position: absolute;
    right: 180px;
    bottom: 100px;
  }

  .company {
    color: #bebebe;
    font-size: 16px;
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translate(-50%);
  }
  .chuangyuCopyrightLogo {
    width: 70px;
    height: 30px;
    position: fixed;
    bottom: 60px;
    left: 50%;
    transform: translate(-50%);
  }

  ::v-deep .el-loading-mask {
    border-radius: 23px;
  }
}
</style>
