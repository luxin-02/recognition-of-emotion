<template>
  <div class="login">
    <div class="core_warp">
      <div class="login_box">
        <div class="left">
          <div class="explain">
            <img src="~@/assets/img/front/login/face1.png" />
            <p>禁止灯光低暗</p>
          </div>
          <div class="explain">
            <img src="~@/assets/img/front/login/face2.png" />
            <p>禁止佩戴眼镜</p>
          </div>
          <div class="explain">
            <img src="~@/assets/img/front/login/face3.png" />
            <p>禁止遮挡脸部</p>
          </div>
        </div>
        <div class="middle">
          <div class="title_face">人脸登录</div>
          <p>请衣着整齐，平视屏幕，并正对光源。</p>
          <img src="~@/assets/img/front/login/facesb.gif" />
          <div class="login_btn" @click="start()" v-if="curStatus == 1">
            {{ isFirst ? "开始登录" : "重新开始" }}
          </div>
          <button v-if="curStatus == 2" class="login_btn">
            <div class="text">正在识别</div>
          </button>
          <div v-if="curStatus == 3" class="login_btn">
            <div class="text">识别成功</div>
          </div>
        </div>
        <div class="right">
          <p class="p1">欢迎进行人脸识别登录！</p>
          <p class="p2" style="margin-bottom: 0">请正对摄像头，勿遮挡脸部</p>
          <p class="p2">系统将识别您的人脸信息</p>
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
  name: "fingerLogin",
  components: { TheLoginAnimation },
  data() {
    return {
      curStatus: 1,
      isFirst: true,
      isFail: false,
    }
  },
  methods: {
    start() {
      this.curStatus = 2
      setTimeout(() => {
        this.getLogin()
      }, 1000)
    },
    getFileName(data) {
      return data.substring(0, data.indexOf("."))
    },
    getLogin() {
      this.isFail = false
      const that = this
      try {
        if (FingerprintObj && JSON.parse(FingerprintObj.isOpenCamera()).success == true) {
          setTimeout(() => {
            JSON.stringify(FingerprintObj.faceCapture())
            setTimeout(async () => {
              let a = JSON.parse(FingerprintObj.getFileName())
              if (a.success === true) {
                let avatarName = this.getFileName(a.data.filePath)

                const { data } = await userBackApiLogin({
                  method: "loginByFace",
                  img_name: avatarName,
                })
                if (data.code == 200) {
                  setTimeout(() => {
                    that.curStatus = 3
                    that.$store.commit("SET_USER_INFO", data.data)
                    this.$myMessage({
                      type: "font-success",
                      message: "登录成功,一秒后进入首页！",
                    })
                    setTimeout(() => {
                      that.$router.push({ name: "Home" })
                    }, 1000)
                  }, 1000)
                } else {
                  this.isFirst = false
                  this.curStatus = 1
                  this.isFail = true
                }
              } else {
                this.isFirst = false
                this.curStatus = 1
                this.isFail = true
              }
            }, 2000)
          }, 100)
        } else {
          this.$myMessage({
            type: "font-error",
            message: "没有连接到设备，请检查",
          })
          this.isFirst = false
          this.curStatus = 1
        }
      } catch (e) {
        this.curStatus = 1
        this.$myMessage({
          type: "font-error",
          message: "未识别到摄像头",
        })
      }
    },
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
        // margin: 0 auto;
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
        position: absolute;
        top: 400px;
        left: 50%;
        transform: translate(-50%);
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
