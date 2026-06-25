<template>
  <transition name="fade">
    <div class="popup_mask" v-if="isShow">
      <div class="shoot_wrap">
        <div class="title">微笑打卡</div>
        <div class="ph_wrap">
          <canvas
            ref="faceCanvas"
            class="faceImg"
            :style="{
              transform: ' rotateY(180deg)',
              display: currentState !== 'ready' ? 'block' : 'none',
            }"
          ></canvas>
          <img
            v-show="currentState === 'ready'"
            :src="
              currentState === 'analyzed' && capturedImage
                ? capturedImage
                : require('@/assets/img/front/detection/默认.png')
            "
          />
        </div>
        <div class="tips_text" :class="{ analyzed: currentState === 'analyzed' }">
          <i class="el-icon-success" v-if="currentState === 'analyzed'"></i>
          {{ tipsText }}
        </div>

        <div class="tips_img">
          <div class="paishe_zhon" v-if="isStateVisible('ready')">
            <div>面部无遮挡</div>
            <div>正对设备</div>
            <div>光线充足</div>
            <div>保持不动</div>
          </div>
          <div class="paishe_hou" v-if="isStateVisible('shooting')">
            <div @click="captureAndAnalyze"></div>
          </div>
          <div class="paishe_hou" v-if="isStateVisible('shot')"></div>
          <div class="paishe_fenxizhon" v-if="isStateVisible('analyzing')">
            <img src="@/assets/img/front/detection/loading.gif" />
          </div>
          <div class="paishe_fenxihou" v-if="isStateVisible('analyzed')">
            <div>
              <p>微笑指数</p>
              <i>{{ analysisData.smileIndex }}分</i>
            </div>
            <div>
              <p>正面情绪</p>
              <i>{{ analysisData.positiveEmotion }}分</i>
            </div>
            <div>
              <p>负面情绪</p>
              <i>{{ analysisData.negativeEmotion }}分</i>
            </div>
            <div>
              <p>心理能力</p>
              <i>{{ analysisData.mentalAbility }}分</i>
            </div>
          </div>
        </div>

        <div
          class="btn_wrap"
          v-if="
            isStateVisible('ready') ||
            isStateVisible('shot') ||
            isStateVisible('analyzing') ||
            isStateVisible('analyzed')
          "
        >
          <button @click="handleButtonClick('left', currentState)">
            {{ buttonTexts.left }}
          </button>
          <button @click="handleButtonClick('right', currentState)">
            {{ buttonTexts.right }}
          </button>
        </div>

        <div class="close" @click="cancel()"></div>
      </div>
      <audio ref="audio" src="./拍照声.mp3" />
    </div>
  </transition>
</template>

<script>
import { createCanvasLoading } from "@/mixins/shoot/util.js"
import { fileApiImage } from "@/server/api/file"
import { base64ToFile } from "@/components/backstage/imgCutting/imgCutting.js"
import { addSmileClock } from "@/server/api/smileCheck"
export default {
  data() {
    return {
      faceCore: null,
      isShow: false,
      analysisTimer: null,
      analysisData: {
        smileIndex: 0,
        positiveEmotion: 0,
        negativeEmotion: 0,
        mentalAbility: 0,
      },
      // 五个状态：ready(初始) -> shooting(拍摄中) -> shot(已拍摄) -> analyzing(分析中) -> analyzed(分析后)
      currentState: "ready",
      canvas: null,
      ctx: null,
      loading: null,
      capturedImage: null,
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // 根据状态显示对应的UI组件
    tipsText() {
      const tipsMap = {
        ready: "请在光线充足的地方进行检测，避免曝光或背光。",
        shot: "请在光线充足的地方进行检测，避免曝光或背光。",
        analyzing: "照片情绪分析中，请勿关闭...",
        analyzed: "分析完成！",
      }
      return tipsMap[this.currentState] || ""
    },
    buttonTexts() {
      const buttonMap = {
        ready: { left: "开始拍摄", right: "取消拍摄" },
        shot: { left: "分析照片", right: "重新拍摄" },
        analyzing: { left: "发布打卡照片", right: "重新拍摄" },
        analyzed: { left: "发布打卡照片", right: "重新拍摄" },
      }
      return buttonMap[this.currentState] || { left: "", right: "" }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.isShow = this.show
    })
  },
  methods: {
    render(e) {
      if (this.loading) {
        this.loading.stop()
        this.loading = null
      }
      const frameData = e.detail.frameData
      const blob = new Blob([new Uint8Array(frameData)], { type: "image/jpeg" })
      const img = new Image()
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
        URL.revokeObjectURL(img.src)
      }
      img.src = URL.createObjectURL(blob)
    },

    // 拍摄
    startCheck() {
      try {
        this.openCamera()
      } catch (e) {
        console.log(e)
      }
    },
    // 打开摄像头
    openCamera() {
      this.capturedImage = null
      this.loading = createCanvasLoading(this.canvas, {
        color: "#3498db", // 动画颜色
        radius: 25, // 半径
        lineWidth: 8, // 线条宽度
        speed: 2, // 旋转速度
      })
      this.loading.start()
      window.addEventListener("videoFrameEvent", this.render)
      CameraProcessor.StartCamera(true)
    },
    // 手动停止
    closeCamera() {
      window.removeEventListener("videoFrameEvent", this.render)
      CameraProcessor.StopCamera()
    },
    // 判断状态是否显示对应的UI组件
    isStateVisible(state) {
      return this.currentState === state
    },
    // 统一的按钮点击处理方法
    handleButtonClick(action, state) {
      // 示例框架：
      if (action === "left") {
        switch (state) {
          case "ready": // 开始拍摄
            console.log("开始拍摄")
            this.currentState = "shooting"
            this.startCheck()
            break
          case "shooting": // 开始拍摄
            console.log("已拍摄")
            this.currentState = "shot"
            break
          case "shot": // 分析照片
            this.analyzePhoto()
            break
          case "analyzing":
            break
          case "analyzed": // 发布打卡照片
            console.log("发布打卡照片", this.analysisData)
            this.publishPhoto()
            break
        }
      } else if (action === "right") {
        switch (state) {
          case "ready": // 取消拍摄
            this.cancel()
            break
          case "shot":
          case "analyzing":
          case "analyzed":
            this.rePhoto() // 重新拍摄
            break
        }
      }
    },
    cancel() {
      if (this.loading) return
      this.isShow = false
      this.$emit("update:show", false)
      this.currentState = "ready"
      this.capturedImage = null
      this.closeCamera()
    },
    rePhoto() {
      this.currentState = "ready"
      this.capturedImage = null
      this.analysisData = {
        smileIndex: 0,
        positiveEmotion: 0,
        negativeEmotion: 0,
        mentalAbility: 0,
      }
    },
    // 拍照并切换到分析完成状态
    captureAndAnalyze() {
      if (this.loading) return
      if (this.canvas && this.ctx) {
        // 将 canvas 内容转换为图片数据
        if (this.$refs.audio) {
          this.$refs.audio.play()
        }
        this.capturedImage = this.canvas.toDataURL("image/jpeg")
      }
      this.closeCamera()
      // 切换状态: 分析照片
      this.currentState = "shot"
    },
    analyzePhoto() {
      this.currentState = "analyzing"
      const randomScore = () => Math.floor(Math.random() * 76) + 20
      this.analysisData = {
        smileIndex: randomScore(),
        positiveEmotion: randomScore(),
        negativeEmotion: randomScore(),
        mentalAbility: randomScore(),
      }
      setTimeout(() => {
        this.currentState = "analyzed"
      }, 10000)
    },
    // 发布打卡照片
    publishPhoto() {
      try {
        fileApiImage({
          file: base64ToFile(this.capturedImage, "photo.jpg"),
        }).then(async (res) => {
          if (res.data.code === 200) {
            console.log(res.data.data)
            const { data } = await addSmileClock({
              uid: this.$store.getters.userInfo.id,
              image: res.data.data,
              smile_index: this.analysisData.smileIndex,
              positive_emotion: this.analysisData.positiveEmotion,
              negative_emotion: this.analysisData.negativeEmotion,
              mental_ability: this.analysisData.mentalAbility,
            })
            if (data.code == this.$global.successCode) {
              this.$myMessage({
                type: "font-success",
                message: "发布成功!",
              })
              this.cancel()
            }
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
  },
  watch: {
    show(newV) {
      this.isShow = newV
      if (this.isShow) {
        this.$nextTick(() => {
          this.canvas = this.$refs.faceCanvas
          if (this.canvas) {
            this.ctx = this.canvas.getContext("2d")
            console.log("Canvas 初始化成功")
          } else {
            console.error("Canvas 元素未找到")
          }
        })
      }
    },
  },
  beforeDestroy() {},
}
</script>

<style lang="scss" scoped>
.popup_mask {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 99;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #00000080;
  font-size: 0;
  .shoot_wrap {
    width: 700px;
    height: 1025px;
    background-image: url(@/assets/img/front/smileCheck/打卡框.png);
    background-size: 100% 100%;
    padding: 160px 0 0 0;
    box-sizing: border-box;
    position: relative;
    .title {
      font-size: 28px;
      color: #fff;
      position: absolute;
      top: 95px;
      left: 50%;
      transform: translateX(-50%);
      font-family: "ziyuanyuanti500W";
    }
    .ph_wrap {
      width: 538px;
      height: 488px;
      background-image: url(@/assets/img/front/smileCheck/头像框.png);
      background-size: 100% 100%;
      margin: 0 auto;
      padding: 19px 0 0 19px;
      box-sizing: border-box;
      > img {
        width: 500px;
        height: 450px;
        border-radius: 23px;
      }
      .faceImg {
        width: 500px;
        height: 450px;
        border-radius: 23px;
      }
    }
    .tips_text {
      width: 90%;
      font-size: 18px;
      font-family: "ziyuanyuanti400W";
      font-weight: 400;
      text-align: center;
      color: #ffffff;
      letter-spacing: 0.9px;
      margin: 10px auto 20px auto;
      .el-icon-success {
        color: #10c86b;
      }
      &.analyzed {
        color: #10c86b;
      }
    }
    .tips_img {
      width: 75%;
      height: 135px;
      margin: 0 auto;
      .paishe_zhon {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > div {
          width: 106px;
          height: 135px;
          font-size: 16px;
          font-family: "ziyuanyuanti400W";
          text-align: center;
          color: #ffffff;
          padding: 90px 0 0 0;
          box-sizing: border-box;
          background-size: 100% 100%;
          &:nth-child(1) {
            background-image: url(@/assets/img/front/smileCheck/面部无遮挡.png);
          }
          &:nth-child(2) {
            background-image: url(@/assets/img/front/smileCheck/正对设备.png);
          }
          &:nth-child(3) {
            background-image: url(@/assets/img/front/smileCheck/光线充足.png);
          }
          &:nth-child(4) {
            background-image: url(@/assets/img/front/smileCheck/保持不动.png);
          }
        }
      }
      .paishe_hou {
        display: flex;
        align-items: center;
        justify-content: center;
        > div {
          margin: 60px 0 0 0;
          width: 120px;
          height: 120px;
          background-size: 100% 100%;
          background-image: url(@/assets/img/front/smileCheck/相机.png);
        }
      }
      .paishe_fenxizhon {
        width: 95%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 auto;
        > img {
          width: 185px;
          height: 63px;
          display: block;
          margin: 20px auto;
        }
      }
      .paishe_fenxihou {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > div {
          width: 106px;
          height: 135px;
          font-size: 16px;
          font-family: "ziyuanyuanti400W";
          text-align: center;
          color: #ffffff;
          padding: 60px 0 0 0;
          box-sizing: border-box;
          background-size: 100% 100%;

          &:nth-child(1) {
            background-image: url(@/assets/img/front/smileCheck/微笑指数.png);
            > i {
              color: #35b8fc;
            }
          }
          &:nth-child(2) {
            background-image: url(@/assets/img/front/smileCheck/正面情绪.png);
            > i {
              color: #10c86b;
            }
          }
          &:nth-child(3) {
            background-image: url(@/assets/img/front/smileCheck/负面情绪.png);
            > i {
              color: #f27803;
            }
          }
          &:nth-child(4) {
            background-image: url(@/assets/img/front/smileCheck/心理能力.png);
            > i {
              color: #ff4f95;
            }
          }
        }
      }
    }
    .btn_wrap {
      width: 80%;
      display: flex;
      justify-content: space-between;
      margin: 20px auto;
      > button {
        width: 268px;
        height: 70px;
        background-color: #00000000;
        background-size: 100% 100%;
        font-size: 18px;
        font-family: "ziyuanyuanti400W";
        color: #ffffff;
        &:nth-child(1) {
          background-image: url(@/assets/img/front/smileCheck/btn1.png);
        }
        &:nth-child(2) {
          background-image: url(@/assets/img/front/smileCheck/btn2.png);
        }
      }
    }
    .close {
      width: 50px;
      height: 50px;
      background-image: url(@/assets/img/front/smileCheck/关闭.png);
      background-size: 100% 100%;
      position: absolute;
      right: 60px;
      top: 80px;
      cursor: pointer;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;

  .popup-box {
    transition: all 0.5s;
  }
}

.fade-enter {
  opacity: 0;

  .popup-box {
    transform: scale(0, 0);
  }
}

.fade-enter-to {
  opacity: 1;

  .popup-box {
    transform: scale(1, 1);
  }
}

.fade-leave {
  opacity: 1;

  .popup-box {
    transform: scale(1, 1);
  }
}

.fade-leave-to {
  opacity: 0;

  .popup-box {
    transform: scale(0, 0);
  }
}
</style>
