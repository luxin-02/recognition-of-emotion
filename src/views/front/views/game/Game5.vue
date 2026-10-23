<template>
  <div class="user-info-box game5-wrap">
    <!-- 背景装饰 -->
    <div class="bg-layer">
      <span class="bokeh b1"></span>
      <span class="bokeh b2"></span>
      <span class="bokeh b3"></span>
      <span class="bokeh b4"></span>
      <span class="bokeh b5"></span>
      <span class="bokeh b6"></span>
      <span class="sparkle s1">✦</span>
      <span class="sparkle s2">✦</span>
      <span class="sparkle s3">✦</span>
      <span class="sparkle s4">✧</span>
      <span class="sparkle s5">✧</span>
    </div>

    <!-- 返回按钮 -->
    <div class="nav-bar">
      <div class="back-btn" @click="$router.go(-1)">
        <span class="back-arrow">‹</span>
        <span>返回</span>
      </div>
    </div>

    <div class="stage">
      <!-- 开始页 -->
      <div v-if="curStatus == 1" class="step1" @dblclick="start()">
        <div class="start-card">
          <div class="start-badge">心理训练 · 眼力挑战</div>
          <img class="start-logo" src="@/assets/images/game/game5/start.png" alt="" />
          <h1 class="start-title">大家来找茬</h1>
          <p class="start-sub">火眼金睛大考验，看看我哪里不一样</p>
          <div class="start-hint">
            <span class="hint-ring"></span>
            <span class="hint-text">双击任意位置开始游戏</span>
          </div>
          <div class="start-tips">
            <span>🔍 随机 3 关</span>
            <span>🎯 找出全部不同</span>
            <span>⏱ 挑战最快用时</span>
          </div>
        </div>
      </div>

      <!-- 游戏页 -->
      <div v-else class="step2">
        <div class="hud">
          <div class="hud-badge hud-level">
            <span class="hud-icon">🏆</span>
            <span class="hud-label">关卡</span>
            <span class="hud-value">{{ curIndex + 1 }}<em>/{{ list.length }}</em></span>
          </div>
          <div class="hud-badge hud-found">
            <span class="hud-icon">🎯</span>
            <span class="hud-label">不同点</span>
            <span class="hud-value">{{ foundArr.length }}<em>/{{ list[curIndex].differ.length }}</em></span>
          </div>
          <div class="hud-badge hud-time">
            <span class="hud-icon">⏱</span>
            <span class="hud-label">用时</span>
            <span class="hud-value">{{ time }}<em>秒</em></span>
          </div>
        </div>

        <div class="found-dots">
          <span
            v-for="(d, di) in list[curIndex].differ"
            :key="di"
            class="dot"
            :class="{ on: foundArr.indexOf(di) > -1 }"
          ></span>
        </div>

        <div class="body">
          <div class="pic-box">
            <span class="pic-tag tag-a">图 A</span>
            <div class="pic-inner">
              <img :src="list[curIndex].img1" alt="" />
              <div
                v-for="(sitem, sindex) in list[curIndex].differ"
                :key="sindex"
                @click="foundArea(sindex)"
                :class="{ active: foundArr.indexOf(sindex) > -1 }"
                :style="{
                  width: sitem.width,
                  height: sitem.height,
                  top: sitem.top,
                  left: sitem.left,
                  transform: sitem.transform && sitem.transform,
                }"
              ></div>
            </div>
          </div>

          <div class="vs-badge">
            <span>VS</span>
          </div>

          <div class="pic-box">
            <span class="pic-tag tag-b">图 B</span>
            <div class="pic-inner">
              <img :src="list[curIndex].img2" alt="" />
              <div
                v-for="(sitem, sindex) in list[curIndex].differ"
                :key="sindex"
                @click="foundArea(sindex)"
                :class="{ active: foundArr.indexOf(sindex) > -1 }"
                :style="{
                  width: sitem.width,
                  height: sitem.height,
                  top: sitem.top,
                  left: sitem.left,
                  transform: sitem.transform && sitem.transform,
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 通关弹窗 -->
    <div class="open" v-if="isVisible">
      <div class="confetti">
        <span v-for="n in 14" :key="n" :class="'c' + n"></span>
      </div>
      <div class="open-card">
        <div class="open-head">
          <span class="open-star">🌟</span>
          <p class="open-title">恭喜通关</p>
          <span class="open-star">🌟</span>
        </div>
        <div class="open-body" v-html="strText"></div>
        <div class="open-foot">即将返回…</div>
      </div>
    </div>
  </div>
</template>

<script>
import { reportApiAdd } from "@/server/api/report"
export default {
  data() {
    return {
      curStatus: 1,
      timer: null,
      time: 0,
      isVisible: false,
      strText: "",
      curIndex: 0,
      orign: [
        {
          img1: require("@/assets/images/game/game5/1.jpg"),
          img2: require("@/assets/images/game/game5/1-2.jpg"),
          differ: [
            {
              width: "1rem",
              height: "4.80rem",
              top: "0.25rem",
              left: "0.1rem",
            },
            {
              width: "0.84rem",
              height: "2.71rem",
              top: "1.98rem",
              left: "5.29rem",
            },
            {
              width: "0.37rem",
              height: "0.46rem",
              top: "3.18rem",
              left: "3.57rem",
            },
            {
              width: "0.29rem",
              height: "0.33rem",
              top: "4.38rem",
              left: "3.97rem",
            },
          ],
        },
        {
          img1: require("@/assets/images/game/game5/2.jpg"),
          img2: require("@/assets/images/game/game5/2-2.jpg"),
          differ: [
            {
              width: "0.87rem",
              height: "0.81rem",
              top: "0.58rem",
              left: "0.35rem",
            },
            {
              width: "0.29rem",
              height: "0.27rem",
              top: "0.80rem",
              left: "4.44rem",
            },
            {
              width: "0.19rem",
              height: "0.20rem",
              top: "4.45rem",
              left: "1.28rem",
            },
            {
              width: "0.44rem",
              height: "0.58rem",
              top: "4.54rem",
              left: "3.97rem",
            },
            {
              width: "0.88rem",
              height: "1.10rem",
              top: "3.40rem",
              left: "4.37rem",
            },
          ],
        },
        {
          img1: require("@/assets/images/game/game5/3.jpg"),
          img2: require("@/assets/images/game/game5/3-2.jpg"),
          differ: [
            {
              width: "0.35rem",
              height: "0.20rem",
              top: "2.04rem",
              left: "0.71rem",
            },
            {
              width: "0.79rem",
              height: "0.51rem",
              top: "2.35rem",
              left: "5.21rem",
            },
            {
              width: "0.84rem",
              height: "0.66rem",
              top: "3.19rem",
              left: "4.30rem",
            },
          ],
        },
        {
          img1: require("@/assets/images/game/game5/4.jpg"),
          img2: require("@/assets/images/game/game5/4-2.jpg"),
          differ: [
            {
              width: "0.38rem",
              height: "0.37rem",
              top: "2.86rem",
              left: "1.57rem",
            },
            {
              width: "0.73rem",
              height: "0.48rem",
              top: "0.73rem",
              left: "4.25rem",
            },
            {
              width: "1.22rem",
              height: "1.09rem",
              top: "3.04rem",
              left: "4.46rem",
            },
            {
              width: "0.37rem",
              height: "0.24rem",
              top: "4.22rem",
              left: "6.45rem",
            },
            {
              width: "0.83rem",
              height: "0.61rem",
              top: "3.94rem",
              left: "3.12rem",
            },
            {
              width: "0.43rem",
              height: "0.30rem",
              top: "4.93rem",
              left: "1.31rem",
            },
          ],
        },
        {
          img1: require("@/assets/images/game/game5/5.jpg"),
          img2: require("@/assets/images/game/game5/5-2.jpg"),
          differ: [
            {
              width: "0.38rem",
              height: "0.27rem",
              top: "1.09rem",
              left: "0.83rem",
            },
            {
              width: "0.39rem",
              height: "0.23rem",
              top: "0.77rem",
              left: "3.79rem",
            },
            {
              width: "1.23rem",
              height: "0.96rem",
              top: "1.39rem",
              left: "2.41rem",
            },
            {
              width: "0.32rem",
              height: "0.26rem",
              top: "3.23rem",
              left: "1.08rem",
            },
            {
              width: "1.02rem",
              height: "0.83rem",
              top: "2.71rem",
              left: "3.67rem",
            },
          ],
        },
        {
          img1: require("@/assets/images/game/game5/6.jpg"),
          img2: require("@/assets/images/game/game5/6-2.jpg"),
          differ: [
            {
              width: "0.66rem",
              height: "0.51rem",
              top: "0.96rem",
              left: "0.43rem",
            },
            {
              width: "0.18rem",
              height: "0.22rem",
              top: "1.14rem",
              left: "2.18rem",
            },
            {
              width: "0.70rem",
              height: "0.55rem",
              top: "0.55rem",
              left: "6.16rem",
            },
            {
              width: "0.76rem",
              height: "0.22rem",
              top: "2.19rem",
              left: "3.72rem",
            },
            {
              width: "0.42rem",
              height: "0.48rem",
              top: "3.01rem",
              left: "1.40rem",
            },
            {
              width: "0.24rem",
              height: "0.27rem",
              top: "3.60rem",
              left: "4.66rem",
            },
            {
              width: "1.04rem",
              height: "0.62rem",
              top: "4.07rem",
              left: "2.78rem",
            },
          ],
        },
        {
          img1: require("@/assets/images/game/game5/7.jpg"),
          img2: require("@/assets/images/game/game5/7-2.jpg"),
          differ: [
            {
              width: "0.60rem",
              height: "0.66rem",
              top: "2.20rem",
              left: "0.08rem",
            },
            {
              width: "0.50rem",
              height: "0.37rem",
              top: "1.66rem",
              left: "2.22rem",
            },
            {
              width: "0.22rem",
              height: "0.22rem",
              top: "3.19rem",
              left: "3.17rem",
            },
            {
              width: "0.27rem",
              height: "0.22rem",
              top: "2.62rem",
              left: "4.29rem",
            },
            {
              width: "1.24rem",
              height: "0.78rem",
              top: "0.56rem",
              left: "5.65rem",
            },
            {
              width: "0.56rem",
              height: "0.83rem",
              top: "2.52rem",
              left: "6.25rem",
            },
            {
              width: "0.31rem",
              height: "0.27rem",
              top: "4.81rem",
              left: "6.13rem",
            },
            {
              width: "0.20rem",
              height: "0.16rem",
              top: "1.98rem",
              left: "3.32rem",
            },
          ],
        },
        {
          img1: require("@/assets/images/game/game5/8.jpg"),
          img2: require("@/assets/images/game/game5/8-2.jpg"),
          differ: [
            {
              width: 1.09896 * 1.92 + "rem",
              //   height: "0.47396rem",
              //   top: "2.47396rem",
              //   left: "0.08333rem",
              height: "0.910rem",
              top: "4.75rem",
              left: "0.16rem",
            },
            {
              //   width: "0.32813rem",
              //   height: "0.19271rem",
              //   top: "1.80208rem",
              //   left: "2.6875rem",
              width: "0.63rem",
              height: "0.37rem",
              top: "3.46rem",
              left: "5.16rem",
            },
            {
              //   width: "0.44271rem",
              //   height: "0.45313rem",
              //   top: "0.11458rem",
              //   left: "2.13021rem",

              width: "0.85rem",
              height: "0.87rem",
              top: "0.22rem",
              left: "4.09rem",
            },
            {
              //   width: "0.22917rem",
              //   height: "1.04167rem",
              //   top: "0.55208rem",
              //   left: "0.95313rem",
              width: "0.44rem",
              height: "2.0rem",
              top: "1.06rem",
              left: "1.83rem",
              transform: "rotate(30deg)",
            },
          ],
        },
        {
          img1: require("@/assets/images/game/game5/9.jpg"),
          img2: require("@/assets/images/game/game5/9-2.jpg"),
          differ: [
            {
              width: "0.68rem",
              height: "0.36rem",
              top: "1.53rem",
              left: "4.17rem",
            },
            {
              width: "0.21rem",
              height: "0.31rem",
              top: "3.76rem",
              left: "1.16rem",
            },
            {
              width: "0.50rem",
              height: "0.43rem",
              top: "3.87rem",
              left: "2.35rem",
            },
            {
              width: "0.54rem",
              height: "0.40rem",
              top: "4.82rem",
              left: "0.54rem",
            },
            {
              width: "1.16rem",
              height: "0.64rem",
              top: "3.92rem",
              left: "5.17rem",
            },
            {
              width: "0.17rem",
              height: "0.27rem",
              top: "3.30rem",
              left: "6.58rem",
            },
          ],
        },
        {
          img1: require("@/assets/images/game/game5/10.jpg"),
          img2: require("@/assets/images/game/game5/10-2.jpg"),
          differ: [
            {
              width: "1.17rem",
              height: "0.51rem",
              top: "0.10rem",
              left: "0.47rem",
            },
            {
              width: "0.35rem",
              height: "0.34rem",
              top: "0.12rem",
              left: "2.41rem",
            },
            {
              width: "0.65rem",
              height: "1.29rem",
              top: "1.55rem",
              left: "6.29rem",
            },
            {
              width: "1.30rem",
              height: "0.45rem",
              top: "4.07rem",
              left: "3.20rem",
            },
            {
              width: "0.59rem",
              height: "0.56rem",
              top: "4.99rem",
              left: "3.99rem",
            },
          ],
        },
      ],
      foundArr: [],
      list: [],
    }
  },
  mixins: [],
  watch: {},
  directives: {},
  filters: {},
  components: {},
  methods: {
    start() {
      this.curStatus = 2
      this.radioHandle()
    },
    clearTimer() {
      clearInterval(this.timer)
      this.timer = null
    },
    countTime() {
      this.timer = setInterval(() => {
        this.time++
      }, 1000)
    },
    btn1Click() {
      this.isVisible = false
      this.$router.go(-1)
    },
    btn2Click() {
      this.isVisible = false
    },
    foundArea(index) {
      if (this.foundArr.indexOf(index) < 0) {
        this.foundArr.push(index)
        if (this.foundArr.length > this.list[this.curIndex].differ.length - 1) {
          setTimeout(() => {
            this.loop()
          }, 1000)
        }
      }
    },
    loop() {
      if (this.curIndex < this.list.length - 1) {
        this.curIndex++
        this.foundArr = []
      } else {
        this.isVisible = true
        this.clearTimer()
        this.strText = `
                    <p>恭喜你，三关挑战完成！</p>
                    <p>总用时: ${this.time}秒</p>
                `
        setTimeout(async () => {
          this.isVisible = false
          this.$router.go(-1)

          await reportApiAdd({
            cat_name: "心理训练",
            game_name: "大家来找茬",
            score: 100,
            seconds: this.time,
          }).then(({ data }) => {
            if (data.code == this.$global.successCode) {
              this.$router.go(-1) // 返回上一页
            }
          })
        }, 5000)
      }
    },
    radioHandle() {
      this.time = 0
      this.list = []
      this.curIndex = 0
      this.clearTimer()
      this.countTime()
      // 每局从 10 关里随机抽取 3 关，只玩这 3 关
      this.list = [...this.orign].sort(() => Math.random() - 0.5).slice(0, 3)
    },
  },
  beforeCreate() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {
    this.clearTimer()
  },
  errorCaptured() {},
}
</script>

<style lang="scss" scoped>
$warm: #ff7a59;
$warm-deep: #ef5350;
$green: #66bb6a;
$yellow: #ffca28;
$ink: #5a4a3a;
$cream: #fff8ee;

.game5-wrap {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(160deg, #fff3df 0%, #fdeedd 30%, #e7f4e0 65%, #d8eef3 100%);
  font-family: "Microsoft YaHei", sans-serif;
}

/* ---------- 背景装饰 ---------- */
.bg-layer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
  .bokeh {
    position: absolute;
    border-radius: 50%;
    filter: blur(2px);
    opacity: 0.55;
  }
  .b1 { width: 260px; height: 260px; left: -60px; top: 120px; background: radial-gradient(circle at 35% 35%, #ffe7a8, #ffd18033); }
  .b2 { width: 340px; height: 340px; right: -80px; top: -80px; background: radial-gradient(circle at 40% 40%, #c8e6c9, #a5d6a733); }
  .b3 { width: 200px; height: 200px; left: 18%; bottom: 8%; background: radial-gradient(circle at 40% 40%, #ffccbc, #ffab9133); }
  .b4 { width: 240px; height: 240px; right: 12%; bottom: -60px; background: radial-gradient(circle at 40% 40%, #b3e5fc, #81d4fa33); }
  .b5 { width: 120px; height: 120px; left: 45%; top: 8%; background: radial-gradient(circle at 40% 40%, #fff9c4, #fff59d33); }
  .b6 { width: 90px; height: 90px; right: 30%; top: 40%; background: radial-gradient(circle at 40% 40%, #f8bbd0, #f48fb133); }
  .sparkle {
    position: absolute;
    color: #ffb74d;
    opacity: 0.7;
    animation: twinkle 2.6s ease-in-out infinite;
  }
  .s1 { left: 12%; top: 22%; font-size: 26px; }
  .s2 { right: 18%; top: 30%; font-size: 20px; animation-delay: .6s; color: #66bb6a; }
  .s3 { left: 30%; bottom: 18%; font-size: 22px; animation-delay: 1.1s; color: #4fc3f7; }
  .s4 { right: 35%; bottom: 22%; font-size: 30px; animation-delay: 1.6s; color: #ff8a65; }
  .s5 { left: 60%; top: 15%; font-size: 18px; animation-delay: .9s; color: #afb42b; }
}
@keyframes twinkle {
  0%, 100% { opacity: 0.25; transform: scale(0.8) rotate(0deg); }
  50% { opacity: 0.85; transform: scale(1.15) rotate(20deg); }
}

/* ---------- 顶部导航 ---------- */
.nav-bar {
  position: relative;
  z-index: 2;
  height: 74px;
  display: flex;
  align-items: center;
  padding: 0 36px;
}
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 42px;
  padding: 0 22px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(6px);
  border: 2px solid rgba(255, 122, 89, 0.35);
  border-radius: 999px;
  color: $warm-deep;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(255, 122, 89, 0.15);
  transition: all 0.2s ease;
  &:hover {
    background: $warm;
    color: #fff;
    border-color: $warm;
    transform: translateX(-3px);
  }
  .back-arrow {
    font-size: 26px;
    line-height: 1;
    margin-top: -2px;
  }
}

/* ---------- 舞台 ---------- */
.stage {
  position: relative;
  z-index: 1;
  height: calc(100% - 74px);
}

/* ---------- 开始页 ---------- */
.step1 {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.start-card {
  position: relative;
  width: 620px;
  padding: 48px 56px 44px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(10px);
  border-radius: 32px;
  border: 3px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 24px 60px rgba(90, 74, 58, 0.18),
              inset 0 2px 0 rgba(255, 255, 255, 0.8);
  text-align: center;
  animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(30px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.start-badge {
  display: inline-block;
  padding: 6px 18px;
  background: linear-gradient(135deg, #ffe0b2, #ffccbc);
  color: $warm-deep;
  font-size: 15px;
  font-weight: 600;
  border-radius: 999px;
  margin-bottom: 18px;
  letter-spacing: 1px;
}
.start-logo {
  width: 280px;
  height: auto;
  display: block;
  margin: 0 auto 10px;
  filter: drop-shadow(0 8px 16px rgba(255, 122, 89, 0.25));
  animation: logoFloat 3.2s ease-in-out infinite;
}
@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.start-title {
  font-size: 46px;
  font-weight: 700;
  margin: 10px 0 20px;
  letter-spacing: 4px;
  color: #f4511e;
  text-shadow: 0 2px 0 #fff, 0 4px 0 rgba(244, 81, 30, 0.15),
    0 8px 18px rgba(244, 81, 30, 0.28);
}
.start-sub {
  font-size: 19px;
  color: $ink;
  margin: 0 0 30px;
  opacity: 0.8;
}
.start-hint {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: 0 36px;
  background: linear-gradient(135deg, $warm, $warm-deep);
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  border-radius: 999px;
  box-shadow: 0 8px 22px rgba(239, 83, 80, 0.35);
  overflow: hidden;
  .hint-ring {
    position: absolute;
    top: 0;
  right: 0;
  bottom: 0;
  left: 0;
    border-radius: 999px;
    border: 2px solid $warm;
    animation: hintPulse 1.8s ease-out infinite;
  }
}
@keyframes hintPulse {
  0% { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(1.5); opacity: 0; }
}
.start-tips {
  margin-top: 28px;
  display: flex;
  justify-content: center;
  gap: 22px;
  font-size: 15px;
  color: #8d7b68;
  span { white-space: nowrap; }
}

/* ---------- 游戏页 ---------- */
.step2 {
  height: 100%;
  box-sizing: border-box;
  padding: 24px 50px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* HUD */
.hud {
  display: flex;
  gap: 22px;
  margin-bottom: 16px;
}
.hud-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 170px;
  padding: 12px 22px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 18px;
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 22px rgba(90, 74, 58, 0.12);
  .hud-icon { font-size: 26px; }
  .hud-label {
    font-size: 15px;
    color: #9e8d7a;
  }
  .hud-value {
    margin-left: auto;
    font-size: 26px;
    font-weight: 800;
    color: $ink;
    em {
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      color: #b0a090;
      margin-left: 2px;
    }
  }
  &.hud-level .hud-value { color: $warm-deep; }
  &.hud-found .hud-value { color: $green; }
  &.hud-time .hud-value { color: #42a5f5; }
}

/* 进度点 */
.found-dots {
  display: flex;
  gap: 10px;
  margin-bottom: 22px;
  .dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid rgba(180, 160, 140, 0.5);
    transition: all 0.3s ease;
    &.on {
      background: linear-gradient(135deg, $warm, $warm-deep);
      border-color: $warm-deep;
      box-shadow: 0 0 10px rgba(239, 83, 80, 0.5);
      transform: scale(1.15);
    }
  }
}

/* 图片区 */
.body {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}
.pic-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pic-tag {
  display: inline-block;
  padding: 6px 22px;
  margin-bottom: 12px;
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  &.tag-a { background: linear-gradient(135deg, #42a5f5, #1e88e5); }
  &.tag-b { background: linear-gradient(135deg, $warm, $warm-deep); }
}
.pic-inner {
  position: relative;
  width: 700px;
  height: 570px;
  border-radius: 20px;
  overflow: hidden;
  border: 6px solid #fff;
  box-shadow: 0 16px 40px rgba(90, 74, 58, 0.25);
  background: #f5f5f5;
  > img {
    width: 700px;
    height: 570px;
    display: block;
  }
  > div {
    position: absolute;
    cursor: pointer;
    border-radius: 6px;
    box-sizing: border-box;
    transition: box-shadow 0.2s ease;
    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
    &.active {
      border: 3px solid $warm-deep;
      box-shadow: 0 0 0 3px rgba(239, 83, 80, 0.25),
                  0 0 18px rgba(239, 83, 80, 0.55) inset,
                  0 0 18px rgba(239, 83, 80, 0.55);
      animation: foundPop 0.45s ease;
      pointer-events: none;
      &::after {
        content: "✓";
        position: absolute;
        top: -14px;
        right: -14px;
        width: 26px;
        height: 26px;
        line-height: 24px;
        text-align: center;
        font-size: 16px;
        font-weight: 800;
        color: #fff;
        background: $warm-deep;
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
      }
    }
  }
}
@keyframes foundPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.06); }
  100% { transform: scale(1); }
}

.vs-badge {
  margin: 0 24px;
  margin-top: 30px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, $yellow, #ffa726);
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(255, 167, 38, 0.45);
  border: 3px solid #fff;
  letter-spacing: 1px;
  animation: vsSpin 4s linear infinite;
  span { display: block; }
}
@keyframes vsSpin {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
}

/* ---------- 通关弹窗 ---------- */
.open {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  background: rgba(60, 45, 30, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: maskIn 0.3s ease;
}
@keyframes maskIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.open-card {
  position: relative;
  width: 480px;
  background: #fffdf7;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.3);
  border: 4px solid #fff;
  animation: cardPop 0.5s cubic-bezier(0.22, 1.4, 0.36, 1);
}
@keyframes cardPop {
  0% { opacity: 0; transform: scale(0.7); }
  100% { opacity: 1; transform: scale(1); }
}
.open-head {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 26px 24px 18px;
  background: linear-gradient(135deg, $warm 0%, $warm-deep 100%);
  .open-star {
    font-size: 30px;
    animation: starTwinkle 1.6s ease-in-out infinite;
    &:last-child { animation-delay: 0.8s; }
  }
  .open-title {
    margin: 0;
    font-size: 30px;
    font-weight: 800;
    color: #fff;
    letter-spacing: 4px;
    white-space: nowrap;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
}
@keyframes starTwinkle {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.25) rotate(20deg); }
}
.open-body {
  padding: 30px 36px 10px;
  text-align: center;
  font-size: 20px;
  color: $ink;
  line-height: 2;
  ::v-deep p {
    margin: 0;
    &:first-child {
      font-size: 22px;
      font-weight: 700;
      color: $warm-deep;
    }
  }
}
.open-foot {
  padding: 14px 0 26px;
  text-align: center;
  font-size: 15px;
  color: #b0a090;
  letter-spacing: 1px;
}

/* 彩带 */
.confetti {
  $c-colors: $warm, $yellow, $green, #42a5f5, #ab47bc, #ff7043;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;
  span {
    position: absolute;
    top: -20px;
    width: 10px;
    height: 16px;
    border-radius: 2px;
    opacity: 0.9;
    animation: confettiFall linear forwards;
  }
  @for $i from 1 through 14 {
    .c#{$i} {
      left: (5 + $i * 6.5) * 1%;
      background: nth($c-colors, (($i - 1) % 6) + 1);
      animation-duration: (2.2 + ($i % 5) * 0.35) * 1s;
      animation-delay: ($i * 0.12) * 1s;
    }
  }
}
@keyframes confettiFall {
  0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0.8; }
}
</style>
