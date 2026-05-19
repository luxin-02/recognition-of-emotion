<template>
  <div class="index">
    <div class="back_wrap">
      <div class="back_btn" @click="isRtPop = true"></div>
      {{ $route.meta.title }}
      <div class="set_btn" @click="setShow = !setShow"></div>
    </div>
    <div class="speed_control" v-show="setShow">
      <div class="speed_control_title">频率设置</div>
      <div class="speed_control_content">
        <div>呼吸频率：</div>
        <el-input-number
          v-model="swingSpeed"
          :min="1"
          :max="10"
          label="秒"
        ></el-input-number>
      </div>
    </div>

    <div class="time_text">训练时间：{{ formattedTime }}</div>

    <div
      class="diqiu"
      :style="{
        transform: `translate(-50%, -50%) scale(${currentScale})`,
      }"
    ></div>

    <div class="btn_wrap">
      <div class="start_btn" @click="startTraining">开始</div>
      <div class="pause_btn" @click="pauseTraining">暂停</div>
    </div>

    <AnimationPopup :show="isRtPop">
      <div class="rt_pop">
        <div class="rt_pop_title">提示</div>
        <div class="text">你确定要中止训练吗，退出将不产生报告！</div>
        <div class="rt_pop_btn">
          <button @click="$router.go(-1)">退出</button>
          <button @click="isRtPop = false">取消</button>
        </div>
      </div>
    </AnimationPopup>

    <AnimationPopup :show="countDownPop">
      <div class="num_pop">{{ countDown }}</div>
    </AnimationPopup>

    <audio src="./audio/倒计时.mp3" ref="countDownAudio"></audio>
    <audio src="./audio/背景音.mp3" ref="bgAudio" loop></audio>
  </div>
</template>

<script>
import { reportApiAdd } from "@/server/api/report"
export default {
  data() {
    return {
      currentScale: 1, // 当前缩放比例
      swingSpeed: 5, // 呼吸频率（1-10）
      minScale: 0.6, // 最小缩放比例
      maxScale: 1.4, // 最大缩放比例
      animationId: null,
      startTime: 0, // 动画开始时间
      lastTime: 0, // 上一帧时间
      drillTime: 0, // 训练时间（秒）
      countdownInterval: null, // 倒计时定时器
      remainingTime: 0, // 剩余时间
      setShow: false,
      isPlaying: false, // 是否正在播放
      pausedTime: 0, // 暂停时的时间
      isRtPop: false,

      countDown: 3,
      countDownTimer: null,
      countDownPop: false,
    }
  },
  computed: {
    formattedTime() {
      // 将秒数转换为 00:00:00 格式
      const hours = Math.floor(this.remainingTime / 3600)
      const minutes = Math.floor((this.remainingTime % 3600) / 60)
      const seconds = this.remainingTime % 60

      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    },
  },
  mounted() {
    this.drillTime = parseInt(this.$route.query.time) || 0
    this.swingSpeed = parseInt(this.$route.query.frequency) || 5
    this.remainingTime = this.drillTime

    this.countDownFn()
  },
  beforeDestroy() {
    this.stopTraining()
  },
  methods: {
    countDownFn() {
      // 如果已经在倒计时或训练中，不重复开始
      if (this.countDownTimer) return

      // 开始倒计时
      this.$refs.countDownAudio.play()
      this.countDown = 3
      this.countDownPop = true
      this.countDownTimer = setInterval(() => {
        this.countDown--
        if (this.countDown <= 0) {
          clearInterval(this.countDownTimer)
          this.countDownTimer = null
          this.countDownPop = false
          this.startTraining()
          this.$refs.countDownAudio.load()
          this.$refs.bgAudio.play()
          this.$refs.bgAudio.volume = 0.2
        }
      }, 1000)
    },
    startBreathing() {
      this.startTime = performance.now()
      this.lastTime = this.startTime

      const animate = (currentTime) => {
        if (!this.isPlaying) return

        // 计算时间增量（秒）
        const deltaTime = (currentTime - this.lastTime) / 1000
        this.lastTime = currentTime

        // 计算总时间（秒）
        const totalTime = (currentTime - this.startTime) / 1000

        // 根据速度计算频率（速度越快，频率越高）
        const frequency = 0.2 + (this.swingSpeed - 3) * 0.05 // 0.5到1.4Hz

        // 使用正弦函数实现平滑的缩放动画
        // 缩放比例在minScale和maxScale之间变化
        const normalizedValue =
          (Math.sin(2 * Math.PI * frequency * totalTime) + 1) / 2
        this.currentScale =
          this.minScale + (this.maxScale - this.minScale) * normalizedValue

        this.animationId = requestAnimationFrame(animate)
      }

      this.animationId = requestAnimationFrame(animate)
    },

    startCountdown() {
      if (this.drillTime <= 0) {
        // 如果没有设置时间，显示默认时间但不倒计时
        this.remainingTime = 0
        return
      }

      this.countdownInterval = setInterval(() => {
        if (!this.isPlaying) return

        this.remainingTime--

        if (this.remainingTime <= 0) {
          // 倒计时结束，自动返回
          this.stopTraining()
          this.countdownEnded()
        }
      }, 1000)
    },

    startTraining() {
      if (this.isPlaying) return

      this.isPlaying = true

      // 启动呼吸动画
      this.startBreathing()

      // 启动倒计时
      this.startCountdown()
    },

    pauseTraining() {
      if (!this.isPlaying) return

      this.isPlaying = false

      // 停止动画
      if (this.animationId) {
        cancelAnimationFrame(this.animationId)
        this.animationId = null
      }

      // 停止倒计时
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval)
        this.countdownInterval = null
      }
    },

    stopTraining() {
      this.isPlaying = false

      // 停止动画
      if (this.animationId) {
        cancelAnimationFrame(this.animationId)
        this.animationId = null
      }

      // 停止倒计时
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval)
        this.countdownInterval = null
      }
    },

    countdownEnded() {
      // 倒计时结束，显示提示并自动返回
      let score
      if (this.drillTime == 60) {
        score = 10
      }
      if (this.drillTime == 180) {
        score = 30
      }
      if (this.drillTime == 300) {
        score = 50
      }
      if (this.drillTime == 600) {
        score = 100
      }
      if (this.drillTime == 900) {
        score = 150
      }
      reportApiAdd({
        cat_name: "放松调节",
        game_name: this.$route.meta.title,
        score: score,
        seconds: this.drillTime,
      }).then(({ data }) => {
        if (data.code == this.$global.successCode) {
          // this.$myMessage('保存成功')
          this.$router.go(-1) // 返回上一页
        }
      })
    },
  },
  watch: {
    swingSpeed(newSpeed) {
      // 频率改变时重新开始动画（保持连续性）
      if (this.animationId) {
        cancelAnimationFrame(this.animationId)
      }
      if (this.isPlaying) {
        this.startBreathing()
      }
    },
  },
}
</script>

<style scoped lang="scss">
.index {
  width: 100vw;
  height: 100vh;
  background-size: 100% 100%;
  background-image: url("@/assets/img/front/relax/bg.png");
  position: relative;
  z-index: 10;
  .back_wrap {
    width: 100%;
    height: 80px;
    background: #00000030;
    padding: 0 30px 0 30px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 30px;
    font-family: "ziyuanyuanti600W";
    font-weight: 600;
    color: #ffffff;
    -webkit-app-region: no-drag;

    > .back_btn,
    > .set_btn {
      width: 60px;
      height: 60px;
      background-size: 100% 100%;
    }
    > .back_btn {
      background-image: url("@/assets/img/front/relax/back.png");
    }
    > .set_btn {
      background-image: url("@/assets/img/front/relax/set_btn.png");
    }
  }
  .time_text {
    font-size: 30px;
    font-family: "ziyuanyuanti600W";
    font-weight: 600;
    text-align: center;
    color: #ffffff;
    margin-top: 60px;
  }

  .speed_control {
    width: 400px;
    height: 180px;
    background: #ffffff;
    border-radius: 17px;
    box-sizing: border-box;
    padding: 10px;
    position: absolute;
    right: 50px;
    top: 120px;
    .speed_control_title {
      width: 380px;
      height: 50px;
      background: #0082da;
      border-radius: 17px 17px 0px 0px;

      font-size: 20px;
      font-family: "ziyuanyuanti500W";
      font-weight: 500;
      text-align: center;
      color: #ffffff;
      line-height: 50px;
    }
    .speed_control_content {
      margin: 30px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      > div {
        font-size: 18px;
        font-family: "ziyuanyuanti400W";
        font-weight: 400;
        color: #333;
        margin-right: 20px;
      }
      ::v-deep .el-input__inner {
        background-color: #c9c9c9;
        border: none;
        color: #333;
        font-weight: 600;
      }
      ::v-deep .el-input-number__decrease,
      ::v-deep .el-input-number__increase {
        background: #00a6fc;
        color: #fff;
        border: none;
      }
    }
  }

  .diqiu {
    width: 400px;
    height: 400px;
    background-image: url("@/assets/img/front/relax/diqiu.png");
    background-size: 100% 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease-out; // 添加平滑过渡效果
  }

  .btn_wrap {
    display: flex;
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translate(-50%);
    > div {
      width: 200px;
      height: 75px;
      background-size: 100% 100%;
      background-color: #00000000;
      font-size: 26px;
      font-family: "ziyuanyuanti500W";
      font-weight: 500;
      text-align: center;
      color: #ffffff;
      line-height: 70px;
      cursor: pointer;

      &.start_btn {
        background-image: url(@/assets/img/front/relax/开始.png);
        margin-right: 30px;
      }
      &.pause_btn {
        background-image: url(@/assets/img/front/relax/暂停.png);
      }
    }
  }

  .rt_pop {
    width: 400px;
    height: 270px;
    background: #fff;
    border-radius: 17px;
    padding-top: 10px;
    box-sizing: border-box;
    .rt_pop_title {
      width: 380px;
      height: 50px;
      background: #007ed5;
      border-radius: 17px 17px 0px 0px;
      font-size: 20px;
      font-family: "ziyuanyuanti500W";
      text-align: center;
      margin: 0 auto;
      line-height: 50px;
      color: #fff;
    }
    .text {
      width: 215px;
      font-size: 18px;
      text-align: center;
      line-height: 25px;
      margin: 35px auto 0;
    }
    .rt_pop_btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      button {
        width: 125px;
        height: 45px;
        border-radius: 23px;
        font-size: 18px;
        color: #ffffff;
        background: url("@/assets/img/front/relax/breathe/btn2.png") no-repeat;
        background-size: 100% 100% !important;
        margin-top: 50px;
        &:nth-child(2) {
          background: url("@/assets/img/front/relax/breathe/btn.png") no-repeat;
          margin-left: 44px;
        }
      }
    }
  }

  .num_pop {
    width: 650px;
    height: 650px;
    border-radius: 50%;
    background-color: #00000080;
    text-align: center;
    font-size: 500px;
    line-height: 600px;
    color: #fff;
    font-weight: 600;
  }
}
</style>
