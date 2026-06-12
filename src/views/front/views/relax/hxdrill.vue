<template>
  <div class="breathe">
    <div class="title">
      <img
        src="@/assets/img/front/relax/breathe/rt.png"
        alt=""
        @click="isRtPop = true"
      />
      呼吸训练
      <img
        src="@/assets/img/front/relax/breathe/set.png"
        alt=""
        @click="isSetPop = true"
      />
    </div>
    <div class="time">训练时间：{{ secondsStr(breatheObj.seleTime) }}</div>
    <img
      src="@/assets/img/front/relax/小熊.png"
      alt=""
      class="corn"
      :style="{ top: cornTop + 'rem' }"
      ref="corn"
    />
    <img
      src="@/assets/img/front/relax/爱心.png"
      alt=""
      class="grass2"
      ref="grass"
    />
    <!-- <img src="@/assets/img/front/relax/breathe/草.png" alt="" class="grass2"> -->
    <img src="@/assets/img/front/relax/breathe/底2.png" alt="" class="bottom" />
    <div class="state">
      {{ isState == 1 ? "吸气" : isState == 2 ? "屏气" : "呼气" }}
    </div>
    <div class="strip">
      <div
        :style="isState == 1 || isState == 2 ? { width: '100%' } : ''"
        ref="strip"
      ></div>
    </div>
    <div class="btn">
      <div @click="start">
        <img
          src="@/assets/img/front/relax/breathe/播放.png"
          alt=""
          v-if="isStart"
        />
        <img
          src="@/assets/img/front/relax/breathe/暂停.png"
          alt=""
          style="width: 0.25rem; height: 0.31rem"
          v-else
        />
      </div>
      <div>
        <img
          src="@/assets/img/front/relax/breathe/中.png"
          alt=""
          @click="isRtPop = true"
        />
      </div>
    </div>
    <div class="pop" v-if="isSetPop">
      <div class="pop_title">
        呼吸设置<img
          src="@/assets/img/front/relax/breathe/关闭.png"
          alt=""
          @click="isSetPop = false"
        />
      </div>
      <div class="pop_content">
        <div class="block">
          <div></div>
          训练设置
        </div>
        <div class="sele_list">
          <div class="list">
            <span>声音设置:</span>
            <div class="sele_box">
              <DropDownVue
                item-value="value"
                label="label"
                v-model="breatheSetObj.soundValue"
                :options="soundList"
              ></DropDownVue>
            </div>
          </div>
        </div>
        <div class="block">
          <div></div>
          呼吸频率设置
        </div>
        <div class="duration">
          <div class="list">
            <span>频率设置:</span>
            <div class="duration_btn">
              <img
                src="@/assets/img/front/relax/breathe/3.png"
                alt=""
                @click="
                  () => {
                    if (breatheSetObj.inhale == 1) return
                    breatheSetObj.inhale--
                  }
                "
              />
              <div>{{ breatheSetObj.inhale }}秒</div>
              <img
                src="@/assets/img/front/relax/breathe/4.png"
                alt=""
                @click="
                  () => {
                    if (breatheSetObj.inhale >= 10) return
                    breatheSetObj.inhale++
                  }
                "
              />
            </div>
          </div>
          <div class="list">
            <span>吐气时长:</span>
            <div class="duration_btn">
              <img
                src="@/assets/img/front/relax/breathe/3.png"
                alt=""
                @click="
                  () => {
                    if (breatheSetObj.exhale == 1) return
                    breatheSetObj.exhale--
                  }
                "
              />
              <div>{{ breatheSetObj.exhale }}秒</div>
              <img
                src="@/assets/img/front/relax/breathe/4.png"
                alt=""
                @click="
                  () => {
                    if (breatheSetObj.exhale >= 10) return
                    breatheSetObj.exhale++
                  }
                "
              />
            </div>
          </div>
        </div>
        <div class="duration">
          <div class="list">
            <span>屏气时长:</span>
            <div class="duration_btn">
              <img
                src="@/assets/img/front/relax/breathe/3.png"
                alt=""
                @click="
                  () => {
                    if (breatheSetObj.holdBreath == 0) return
                    breatheSetObj.holdBreath--
                  }
                "
              />
              <div>{{ breatheSetObj.holdBreath }}秒</div>
              <img
                src="@/assets/img/front/relax/breathe/4.png"
                alt=""
                @click="
                  () => {
                    if (breatheSetObj.holdBreath >= 8) return
                    breatheSetObj.holdBreath++
                  }
                "
              />
            </div>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="footer_btn">
        <button @click="sub">保存</button>
        <button @click="Restore">恢复默认</button>
      </div>
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

    <audio src="./audio/海浪声.mp3" ref="audio" @canplay="canplay"></audio>
    <audio src="./audio/流水声.mp3" ref="audio2" @canplay="canplay"></audio>
    <audio src="./audio/倒计时.mp3" ref="countDownAudio"></audio>
  </div>
</template>

<script>
import { reportApiAdd } from "@/server/api/report"
import DropDownVue from "@/components/front/DropDownVue.vue"
export default {
  data() {
    return {
      soundList: [
        { value: 1, label: "开启" },
        { value: 2, label: "关闭" },
      ],
      breatheObj: {
        inhale: 4, //吸入
        exhale: 4, //吐气
        holdBreath: 0, //屏气
        seleTime: 180, //训练时长
        soundValue: 1, //声音是否开启 默认1是开启
      },
      breatheSetObj: {},
      isRtPop: false,
      isSetPop: false,
      isStart: false,
      timer: null,
      isState: -1,
      timer2: null,
      cornTop: 4.52,
      recordTime: "",
      isPause: false,
      seleTime: "",

      countDown: 3,
      countDownTimer: null,
      countDownPop: false,
    }
  },
  components: {
    DropDownVue,
  },
  computed: {},
  watch: {
    isStart(val) {
      if (!val) {
        let grass = this.$refs.grass
        grass.style.transition = "none"
        this.$refs.corn.style.transition = "none"
        this.$refs.strip.style.transition = "none"
        this.isState = -1

        this.$refs.audio.pause()
        this.$refs.audio2.pause()
        this.isPause = true

        clearInterval(this.timer2)
        clearInterval(this.timer)
      }
    },
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
          this.start()
          this.$refs.countDownAudio.load()
        }
      }, 1000)
    },
    sub() {
      this.breatheObj.inhale = this.breatheSetObj.inhale
      this.breatheObj.exhale = this.breatheSetObj.exhale
      this.breatheObj.holdBreath = this.breatheSetObj.holdBreath
      this.breatheObj.soundValue = this.breatheSetObj.soundValue
      console.log(this.breatheObj)
      this.isSetPop = false
    },
    Restore() {
      this.breatheObj = {
        inhale: 4, //吸入
        exhale: 4, //吐气
        holdBreath: 0, //屏气
        seleTime: 180, //训练时长
        soundValue: 1, //声音是否开启 默认1是开启
      }

      this.breatheSetObj = {
        inhale: 4, //吸入
        exhale: 4, //吐气
        holdBreath: 0, //屏气
        seleTime: 180, //训练时长
        soundValue: 1, //声音是否开启 默认1是开启
      }
    },
    canplay() {
      this.$refs.audio.volume =
        this.$store.getters.sysInfo.sphere_game_effects / 100
      this.$refs.audio2.volume =
        this.$store.getters.sysInfo.sphere_game_effects / 100
    },
    secondsStr(val) {
      const seconds = val
      const h = parseInt(seconds / 60 / 60)
      const m = parseInt((seconds % 3600) / 60)
      const s = parseInt(seconds % 60)
      return `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}:${
        s < 10 ? "0" + s : s
      }`
    },
    start() {
      this.isStart = !this.isStart
      if (this.isStart) {
        this.timeStr()
        this.isState = 1
        this.share()
      }
    },
    share() {
      let time =
        this.isState == 1
          ? this.breatheObj.inhale
          : this.isState == 2
          ? this.breatheObj.holdBreath
          : this.breatheObj.exhale
      this.recordTime = this.isPause ? 1 : time
      this.isPause = false
      let newSize = this.isState == 1 || this.isState == 2 ? 2.74 : 0.98
      let newLeft = this.isState == 1 || this.isState == 2 ? 6.48 : 8
      let newTop = this.isState == 1 || this.isState == 2 ? 2.4 : 4.2
      if (this.isState == 1 || this.isState == 2) {
        this.cornTop = 4.22
      } else {
        this.cornTop = 4.52
      }
      if (this.$refs.corn) {
        this.$refs.corn.style.transition = `${time}s ease`
      }
      if (this.$refs.strip) {
        this.$refs.strip.style.transition = `${time}s ease`
      }
      if (this.breatheObj.soundValue == 1) {
        if (this.isState == 1) {
          this.$nextTick(function () {
            this.$refs.audio2.pause()
            this.$refs.audio.play()
          })
        }
        if (this.isState == 2) {
          this.$nextTick(function () {
            this.$refs.audio.pause()
            this.$refs.audio2.pause()
          })
        }
        if (this.isState == 3) {
          this.$nextTick(function () {
            this.$refs.audio.pause()
            this.$refs.audio2.play()
          })
        }
      }

      console.log(newSize, newLeft)
      let grass = this.$refs.grass
      if (!grass) return
      grass.style.transition = `all ${time}s`
      grass.style.width = newSize + "rem"
      grass.style.height = newSize + "rem"
      grass.style.top = newTop + "rem"
      grass.style.left = newLeft + "rem"
      this.$nextTick(function () {
        this.timer2 = setInterval(() => {
          this.recordTime--
          //console.log(this.recordTime);
          if (this.recordTime <= 0) {
            clearInterval(this.timer2)
            if (this.isState == 3) {
              this.isState = 1
              this.share()
              return
            }
            if (this.breatheObj.holdBreath == 0) {
              this.isState = 3
              this.share()
              return
            }
            this.isState++
            this.share()
          }
        }, 1000)
      })
    },

    timeStr() {
      this.timer = setInterval(async () => {
        this.breatheObj.seleTime--
        if (this.breatheObj.seleTime == 0) {
          this.isStart = false

          let score
          if (this.$route.query.time == 60) {
            score = 10
          }
          if (this.$route.query.time == 180) {
            score = 30
          }
          if (this.$route.query.time == 300) {
            score = 50
          }
          if (this.$route.query.time == 600) {
            score = 100
          }
          if (this.$route.query.time == 900) {
            score = 150
          }
          await reportApiAdd({
            cat_name: "放松调节",
            game_name: "呼吸训练",
            score: score,
            seconds: this.$route.query.time,
          })
          this.$myMessage.success("已完成训练！")
          setTimeout(() => {
            this.$router.go(-1)
          }, 1000)
        }
      }, 1000)
    },
  },
  mounted() {
    //this.share()
    this.canplay()

    this.breatheSetObj.inhale = this.$route.query.xiru || 4
    this.breatheSetObj.exhale = this.$route.query.tuqi || 4
    this.breatheSetObj.holdBreath = this.$route.query.binqi || 0
    this.breatheSetObj.seleTime = this.$route.query.time || 180

    this.breatheObj.inhale = this.breatheSetObj.inhale
    this.breatheObj.exhale = this.breatheSetObj.exhale
    this.breatheObj.holdBreath = this.breatheSetObj.holdBreath
    this.breatheObj.seleTime = this.$route.query.time || 180

    this.breatheSetObj = {
      inhale: this.breatheObj.inhale,
      exhale: this.breatheObj.exhale,
      holdBreath: this.breatheObj.holdBreath,
      seleTime: this.breatheObj.seleTime,
      soundValue: this.breatheObj.soundValue,
    }

    this.countDownFn()
  },
  created() {
    // if (this.$route.query.breatheObj) {
    //   this.breatheObj = this.$route.query.breatheObj
    //   this.seleTime = this.breatheObj.seleTime
    //   this.breatheSetObj = this.$route.query.breatheObj
    // }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    clearInterval(this.timer2)
  },
}
</script>

<style lang="scss" scoped>
.breathe {
  width: 100vw;
  height: 100vh;
  background: url("@/assets/img/front/relax/bg.png") no-repeat;
  background-size: 100% 100%;
  z-index: 1000;
  position: relative;
  .title {
    width: 100%;
    height: 80px;
    padding: 0 30px;
    box-sizing: border-box;
    background: rgba(30, 35, 49, 0.5);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 30px;
    font-family: "ziyuanyuanti600W";
    color: #fff;

    -webkit-app-region: no-drag;
    img {
      width: 60px;
      height: 60px;
    }
  }
  .time {
    font-size: 30px;
    margin: 60px auto 0;
    text-align: center;
    font-family: "ziyuanyuanti600W";
    color: #fff;
  }
  .corn {
    position: absolute;
    left: 815px;
    // width: 324px;
    // height: 369px;
    width: 300px;
    height: 420px;
  }
  .grass2 {
    // width: 98px;
    // height: 98px;
    /* width: 274px;
          height: 274px; */
    position: absolute;
    top: 220px;
    left: 600px;

    width: 211px;
    height: 211px;
  }
  .grass {
    width: 274px;
    height: 274px;
    position: absolute;
    top: 260px;
    left: 648px;
  }
  .bottom {
    width: 248px;
    height: 82px;
    position: absolute;
    top: 850px;
    left: 860px;
  }
  .state {
    width: 100%;
    text-align: center;
    font-size: 40px;
    line-height: 40px;
    position: absolute;
    bottom: 108px;
    font-family: "ziyuanyuanti600W";
    color: #fff;
  }
  .strip {
    position: absolute;
    top: 998px;
    left: 560px;
    width: 800px;
    height: 40px;
    background: rgba(0, 166, 252, 0.2);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    div {
      width: 100px;
      height: 40px;
      background: #00a6fc;
      border-radius: 20px;
    }
  }
  .btn {
    position: absolute;
    right: 67px;
    top: 446px;
    div {
      width: 79px;
      height: 79px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 25px;
        height: 26px;
      }
      &:nth-child(2) {
        margin-top: 30px;
      }
    }
  }
  .pop {
    width: 800px;
    height: 600px;
    background: #fff;
    border-radius: 20px;
    box-shadow: -2px 0px 59px 2px rgba(0, 0, 0, 0.48);
    padding-top: 10px;
    box-sizing: border-box;
    position: absolute;
    right: 46px;
    top: 120px;
    .pop_title {
      width: 780px;
      height: 60px;
      background: #007ed4;
      border-radius: 20px 20px 0px 0px;
      text-align: center;
      line-height: 60px;
      font-size: 22px;
      font-family: "ziyuanyuanti500W";
      position: relative;
      margin: 0 auto;
      color: #fff;
      img {
        width: 32px;
        height: 32px;
        position: absolute;
        right: 27px;
        top: 14px;
      }
    }
    .pop_content {
      padding: 39px 0 0 50px;
      .block {
        display: flex;
        align-items: center;
        font-size: 22px;
        line-height: 22px;
        font-family: "ziyuanyuanti500W";
        div {
          width: 8px;
          height: 20px;
          background: #00a6fc;
          border-radius: 4px;
          margin-right: 10px;
        }
      }
      .sele_list {
        display: flex;
        align-items: center;
        margin: 29px 0 49px;
        .list {
          display: flex;
          align-items: center;
          &:nth-child(2) {
            margin-left: 69px;
          }
          span {
            font-size: 18px;
            margin-right: 19px;
          }
          .sele_box {
            width: 200px;
            height: 45px;
            border-radius: 5px;
            ::v-deep {
              .el-input__inner {
                background: #c9c9c9;
                border: none;
              }
              .el-select-dropdown {
                left: 0px !important;
              }
            }
          }
        }
      }
      .duration {
        display: flex;
        align-items: center;
        margin-top: 35px;

        .list {
          display: flex;
          align-items: center;
          &:nth-child(2) {
            margin-left: 69px;
          }
          span {
            font-size: 18px;
            margin-right: 19px;
          }
          .duration_btn {
            width: 200px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            img {
              width: 45px;
              height: 45px;
            }
            div {
              width: 100px;
              height: 45px;
              background: #c9c9c9;
              border-radius: 5px;
              line-height: 45px;
              text-align: center;
              font-size: 16px;
              letter-spacing: 1.2px;
            }
          }
        }
      }
    }
    .line {
      width: 780px;
      height: 1px;
      background: #c9c9c9;
      border-radius: 1px 1px 0px 0px;
      margin: 45px auto 32px;
    }
    .footer_btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      button {
        width: 150px;
        height: 55px;
        border-radius: 28px;
        font-size: 22px;
        color: #ffffff;
        background: url("@/assets/img/front/relax/breathe/btn.png") no-repeat;
        background-size: 100% 100% !important;
        &:nth-child(2) {
          background: url("@/assets/img/front/relax/breathe/btn2.png") no-repeat;
          margin-left: 30px;
        }
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
