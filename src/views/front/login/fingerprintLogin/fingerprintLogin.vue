<template>
  <div class="login">
    <div class="core_warp">
      <div class="login_box">
        <div class="left">
          <div class="explain">
            <img src="~@/assets/img/front/login/explain1.png" />
            <p>禁止手指沾水</p>
          </div>
          <div class="explain">
            <img src="~@/assets/img/front/login/explain2.png" />
            <p>禁止短暂接触</p>
          </div>
          <div class="explain">
            <img src="~@/assets/img/front/login/explain3.png" />
            <p>禁止指纹残缺</p>
          </div>
        </div>

        <div class="middle">
          <div class="title_face">指纹登录</div>
          <p>请保持手指干净，放入准感应区</p>
          <img src="~@/assets/img/front/login/recognition.gif" />
          <div class="login_btn" @click="start()" v-if="curStatus == 1">
            {{ isFirst ? "开始登录" : "重新开始" }}
          </div>
          <div v-if="curStatus == 2" class="login_btn">
            <div class="text">正在识别</div>
          </div>
          <div v-if="curStatus == 3" class="login_btn">
            <div class="text">识别成功</div>
          </div>

          <p class="line"></p>
        </div>
        <div class="right">
          <p class="p1">欢迎进行指纹识别登录！</p>
          <p class="p2" style="margin-bottom: 0">请将手指放入感应区</p>
          <p class="p2" style="color: #009dff">系统将识别您的指纹信息</p>
          <p v-if="curStatus == 3" class="p3">
            识别成功
            <i>
              <img class="p3_icon" src="~@/assets/img/front/login/y.png" />
            </i>
          </p>

          <p v-if="isFail" class="p4">
            识别失败
            <i>
              <img class="p3_icon" src="~@/assets/img/front/login/n.png" />
            </i>
          </p>
        </div>
      </div>
      <div class="btn_box">
        <button @click="$router.push('/login')"></button>
        <button @click="$router.push('/register')"></button>
        <button @click="$router.push('/retrievePassword')"></button>
      </div>
    </div>
  </div>
</template>

<script>
import TheLoginAnimation from "@/views/front/login/components/theLoginAnimation.vue"
import { userBackApiLogin } from "@/server/api/user.js"

export default {
  name: "retrievePassword",
  components: {
    TheLoginAnimation,
  },
  data() {
    return {
      curStatus: 1,
      content: "",
      timer2: "",
      isFirst: true,
      isFail: false,
    }
  },
  methods: {
    start() {
      this.curStatus = 2
      this.fingerprintRecognition()
    },
    getFileName(data) {
      return data.substring(0, data.indexOf("."))
    },
    async fingerprintRecognition() {
      this.isFail = false
      try {
        if (
          FingerprintObj &&
          JSON.parse(FingerprintObj.OpenDevice()).success == true
        ) {
          this.$myMessage({
            type: "font-success",
            message: "设备已打开，请按指纹设备！",
          })
          this.timer2 = setInterval(this.getAn, 1000)
        } else {
          throw new Error("")
        }
      } catch (e) {
        console.error(e)
        clearInterval(this.timer2)
        this.timer2 = null
        this.isFirst = false
        this.curStatus = 1
        this.$myMessage({
          type: "font-error",
          message: "没有连接到设备，请检查",
        })
      }
    },
    async getAn() {
      this.isFail = false
      try {
        FingerprintObj.MatchAllFeas(async (a) => {
          a = JSON.parse(a)
          if (a.success == true) {
            try {
              const { data } = await userBackApiLogin({
                method: "loginbyfingerprint",
                img_name: this.getFileName(a.data.filePath),
              })
              if (data.code == 200) {
                setTimeout(() => {
                  this.curStatus = 3
                  this.$store.commit("SET_USER_INFO", data.data)
                  this.$myMessage({
                    type: "font-success",
                    message: "登录成功,一秒后进入首页！",
                  })
                  setTimeout(() => {
                    this.$router.push({ name: "Home" })
                  }, 1000)
                }, 1000)
              } else {
                this.isFail = true
              }
            } catch (e) {
              console.error(e)
              this.isFail = true
            } finally {
              clearInterval(this.timer2)
              this.timer2 = null
              this.isFirst = false
              this.curStatus = 1
            }
          } else {
            console.log(1)
          }
        })
      } catch (e) {
        this.$myMessage({
          type: "font-error",
          message: "设备异常！",
        })
        clearInterval(this.timer2)
        this.timer2 = null
        this.isFirst = false
        this.curStatus = 1
        console.error(e)
      }
    },
  },
  destroyed() {
    clearInterval(this.timer2)
    this.timer2 = null
  },
}
</script>

<style scoped lang="scss">
.login {
  width: 100%;
  height: 100%;
}

.core_warp {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  .login_box {
    width: 1100px;
    height: 685px;
    background-image: url("@/assets/img/front/index/biankuang.png");
    background-size: 100% 100%;
     .left {
      position: absolute;
      top: 200px;
      left: 120px;
      .explain {
        width: 110px;
        margin-bottom: 40px;
        text-align: center;
        p {
          color: #fff;
          margin-top: 10px;
          font-family: "ziyuanyuanti400W";
          font-size: 16px;
          opacity: 0.8;
        }
        img {
          width: 50px;
          height: 50px;
        }
      }
    }
    .middle {
      width: 900px;
      text-align: center;
      position: absolute;
      top: 100px;
      left: 50%;
      transform: translate(-50%);
      .title_face {
        font-size: 30px;
        font-family: "ziyuanyuanti600W";
        font-weight: 600;
        text-align: center;
        color: #fff;
        letter-spacing: 3px;
        margin-bottom: 50px;
      }
      p {
        font-size: 18px;
        color: #fff;
        letter-spacing: 3.6px;
        margin: 20px 0 50px 0;
        font-family: "ziyuanyuanti400W";
        padding: 0 0 20px 0;
        box-sizing: border-box;
      }
      img {
        width: 180px;
        height: 180px;
        margin-bottom: 60px;
      }
      .login_btn {
        margin: 0 auto;
        color: #fff;
        font-family: "ziyuanyuanti500W";
        font-size: 18px;
        line-height: 45px;
        width: 220px;
        height: 45px;
        background: #1a71c2;
        border: 1px solid #00a8ff;
        border-radius: 4px;
        box-shadow: 0px 0px 20px 0px #0078ff;
      }
    }
    .right {
      position: absolute;
      top: 260px;
      left: 750px;
      .p1 {
        font-size: 18px;
        font-family: "ziyuanyuanti500W";
        text-align: justifyLeft;
        color: #e08867;
        letter-spacing: 3.6px;
        margin-bottom: 10px;
      }
      .p2 {
        font-size: 16px;
        font-family: "ziyuanyuanti500W";
        text-align: justifyLeft;
        letter-spacing: 2.88px;
        line-height: 30px;
        margin-bottom: 24px;
        color: #fff;
        // opacity: 0.6;
      }
      .p3,
      .p4 {
        font-size: 22px;
        font-family: "ziyuanyuanti500W";
        text-align: justifyLeft;
        color: #00b3a4;
        display: flex;
        i {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: block;
          background-color: #00b3a4;
          margin-top: 3px;
          margin-left: 10px;
          // background-image: url(~@/assets/img/account/y.png);
          // background-size: 100% 100%;
          position: relative;
          .p3_icon {
            width: 14px;
            height: 9px;
            position: absolute;
            top: 8px;
            left: 50%;
            transform: translate(-50%);
          }
        }
      }
      .p4 {
        color: red;
        i {
          background-color: red;
          .p3_icon {
            width: 11px;
            height: 11px;
            position: absolute;
            top: 7px;
            left: 50%;
            transform: translate(-50%);
          }
        }
      }
    }
  }
  .btn_box {
    position: absolute;
    top: 88px;
    right: 12px;
    width: 30px;
    > button {
      width: 30px;
      height: 45px;
      margin-bottom: 10px;
      background: #00000000;
    }
  }
}
</style>
