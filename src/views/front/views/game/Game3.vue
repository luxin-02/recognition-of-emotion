<template>
  <div class="user-info-box">
    <!-- 背景装饰 -->
    <div class="bg-decor">
      <span class="float-shape s1"></span>
      <span class="float-shape s2"></span>
      <span class="float-shape s3"></span>
      <span class="float-shape s4"></span>
      <span class="float-shape s5"></span>
      <span class="float-shape s6"></span>
      <span class="float-shape s7"></span>
      <span class="float-shape s8"></span>
    </div>

    <div class="bread" @click="$router.go(-1)">
      <span class="back-arrow">‹</span>
      <span>返回</span>
    </div>

    <div class="game-stage">
      <!-- 开始界面 -->
      <div v-if="curStatus == 1" class="step1" @dblclick="start()">
        <div class="start-card">
          <div class="start-badge">
            <span class="dot"></span> 眼力挑战 <span class="dot"></span>
          </div>
          <h1 class="start-title">眼力大比拼</h1>
          <p class="start-subtitle">关卡递增-看看你的眼力有多厉害</p>
          <div class="start-img-wrap">
            <div class="img-glow"></div>
            <img src="@/assets/images/game/game3/start.png" alt="开始游戏" />
          </div>
          <div class="start-hint">
            <span class="hint-icon">👆</span>
            <span>双击任意位置开始游戏</span>
          </div>
          <div class="start-tips">
            <div class="tip-item">
              <span class="tip-num">30s</span>
              <span class="tip-label">限时挑战</span>
            </div>
            <!-- <div class="tip-divider"></div> -->
            <!-- <div class="tip-item">
              <span class="tip-num">∞</span>
              <span class="tip-label">关卡递增</span>
            </div> -->
            <div class="tip-divider"></div>
            <div class="tip-item">
              <span class="tip-num">5</span>
              <span class="tip-label">主题切换</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 游戏界面 -->
      <div v-else class="step2">
        <!-- 顶部状态栏 -->
        <div class="top-bar">
          <div class="status-left">
            <div class="stat-badge level-badge">
              <span class="stat-icon">🏆</span>
              <div class="stat-text">
                <span class="stat-label">当前关卡</span>
                <span class="stat-value">第 {{ level - 1 }} 关</span>
              </div>
            </div>
          </div>
          <div class="status-center">
            <div class="timer-ring" :class="{ 'time-low': time <= 10, 'time-mid': time > 10 && time <= 20 }">
              <svg viewBox="0 0 120 120" class="ring-svg">
                <circle cx="60" cy="60" r="52" class="ring-bg" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  class="ring-progress"
                  :style="{ strokeDasharray: 327, strokeDashoffset: 327 - (327 * time) / 30 }"
                />
              </svg>
              <div class="timer-inner">
                <span class="timer-num">{{ time }}</span>
                <span class="timer-unit">秒</span>
              </div>
            </div>
          </div>
          <div class="status-right">
            <div class="stat-badge type-badge">
              <span class="stat-icon">🎨</span>
              <div class="stat-text">
                <span class="stat-label">当前主题</span>
                <span class="stat-value">主题 {{ curImageIndex + 1 }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="body">
          <!-- 左侧游戏区 -->
          <div class="left">
            <div class="grid-board">
              <ul v-for="(item, index) in list" :key="index">
                <li class="list">
                  <div :class="col" v-for="(sitem, sindex) in item" :key="sindex">
                    <div class="cell-card" @click="clickLi(sitem)">
                      <img :src="sitem" />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- 右侧信息区 -->
          <div class="right">
            <div class="rules-card">
              <div class="rules-header">
                <span class="rules-icon">📋</span>
                <h3>游戏规则</h3>
              </div>
              <div class="rules-body">
                <p>来比一比眼力吧！在网格中找出与其他图片<strong>不同</strong>的那一张。</p>
                <p>找对自动进入下一关，关卡越高图片越多哦～</p>
                <p>30秒内挑战你的极限！</p>
              </div>
              <div class="rules-tags">
                <span class="tag">限时30秒</span>
                <span class="tag">关卡递增</span>
                <span class="tag">眼疾手快</span>
              </div>
            </div>

            <div class="mascot-area">
              <img class="mascot-img" src="@/assets/images/game/game3/p.png" alt="吉祥物" />
              <div class="action-buttons">
                <div class="btn-game btn-replay" @click="btnClick(1)">
                  <span class="btn-icon">🔄</span>
                  <span>再玩一次</span>
                </div>
                <div class="btn-game btn-switch" @click="btnClick(2)">
                  <span class="btn-icon">🎨</span>
                  <span>换类型</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 通关弹窗 -->
    <div class="open" v-if="isVisiable">
      <div class="modal-card">
        <div class="modal-stars">
          <span class="star star1">✦</span>
          <span class="star star2">✦</span>
          <span class="star star3">✦</span>
          <span class="star star4">✦</span>
          <span class="star star5">✦</span>
        </div>
        <div class="modal-trophy">{{ modalIcon }}</div>
        <p class="modal-title">{{ modalTitle }}</p>
        <div class="modal-body" v-html="strText"></div>
        <div class="modal-loading">
          <span></span><span></span><span></span>
        </div>
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
      typeList: [
        {
          img: require("@/assets/images/game/game3/1.jpg"),
          found: require("@/assets/images/game/game3/1-1.jpg"),
        },
        {
          img: require("@/assets/images/game/game3/2.jpg"),
          found: require("@/assets/images/game/game3/2-2.jpg"),
        },
        {
          img: require("@/assets/images/game/game3/3.jpg"),
          found: require("@/assets/images/game/game3/3-3.jpg"),
        },
        {
          img: require("@/assets/images/game/game3/4.jpg"),
          found: require("@/assets/images/game/game3/4-4.jpg"),
        },
        {
          img: require("@/assets/images/game/game3/5.jpg"),
          found: require("@/assets/images/game/game3/5-5.jpg"),
        },
      ],
      isClick: true,
      timer: "",
      img1: "",
      img2: "",
      time: 30,
      score: 0,
      level: 1,
      list: [],
      curTypeIndex: 0,
      curImageIndex: 0,
      typeName: "",
      isVisiable: false,
      strText: "",
      modalIcon: "🏆",
      modalTitle: "恭喜通关",
      gameSeconds: 0, // 累计游戏总时长（秒），独立于倒计时 time
      gameTimer: null, // 游戏总时长计时器
    }
  },
  mixins: [],
  watch: {
    time: function (n, o) {
      if (n == 0) {
        this.clearTimer()
        this.stopGameTimer()
        this.isVisiable = true
        // 已通过的关卡数（第一关从 1 计）；为 0 表示一关未过
        const passedLevel = this.level - 2
        if (passedLevel > 0) {
          this.modalIcon = "🏆"
          this.modalTitle = "恭喜通关"
          this.strText = `
                    <p>恭喜你，30秒内通关到了第${passedLevel}关！继续挑战，下一次一定能走得更远～</p>
                `
        } else {
          this.modalIcon = "💪"
          this.modalTitle = "别灰心"
          this.strText = `
                    <p>别灰心，这次只是热身！多观察图片之间的细微差别，放松心情再试一次，一定能顺利通过第一关，加油！</p>
                `
        }
        setTimeout(async () => {
          this.isVisiable = false
          this.isClick = false
          await reportApiAdd({
            cat_name: "心理训练",
            game_name: "眼力大比拼",
            score: this.score,
            seconds: this.gameSeconds,
          }).then(({ data }) => {
            if (data.code == this.$global.successCode) {
              this.$router.go(-1) // 返回上一页
            }
          })
        }, 5000)
      }
    },
  },
  directives: {},
  filters: {},
  computed: {
    col() {
      return `col${this.level}`
    },
  },
  components: {},
  methods: {
    clearTimer() {
      clearInterval(this.timer)
      this.timer = null
    },
    countTime() {
      this.timer = setInterval(() => {
        this.time--
      }, 1000)
    },
    // 独立于倒计时的游戏总时长计时
    startGameTimer() {
      this.stopGameTimer()
      this.gameSeconds = 0
      this.gameTimer = setInterval(() => {
        this.gameSeconds++
      }, 1000)
    },
    stopGameTimer() {
      clearInterval(this.gameTimer)
      this.gameTimer = null
    },
    btnClick(type) {
      if (type != 1) {
        if (this.curImageIndex < this.typeList.length - 1) {
          this.curImageIndex++
        } else {
          this.curImageIndex = 0
        }
      }
      this.clearTimer()
      this.isClick = true
      this.level = 2
      this.score = 0 // 再玩一次/换类型：新一局分数清零
      this.time = 30
      this.startGameTimer()
      this.img1 = this.typeList[this.curImageIndex].img
      this.img2 = this.typeList[this.curImageIndex].found
      this.loop()
      this.countTime()
    },
    getRandomArrayIndex(arr) {
      return Math.ceil(Math.random() * arr.length - 1)
    },
    clickLi(item) {
      if (this.isClick == true) {
        if (this.level != 1) {
          if (item == this.img2) {
            // 找对图片即过一关，加 10 分后进入下一关
            this.score += 10
            this.start()
          } else {
            this.$toast("", "这张不是你需要找的图片！")
          }
        }
      } else {
        this.$toast("", "请点击按钮才能玩哦！")
      }
    },
    start() {
      this.curStatus = 2
      this.level++
      this.loop()
      if (this.level == 2) {
        this.score = 0 // 双击开始新一局：分数清零
        this.countTime()
        this.startGameTimer()
      }
    },
    reset(data, level) {
      var newData = []
      var len = level //截取的数量
      for (var i = 0; i < data.length; i++) {
        var arr = data.slice(i, i + level)
        newData.push(arr)
        i = i + len - 1
      }
      return newData
    },
    loop() {
      this.list = []
      this.list = Array.from(
        { length: Math.pow(this.level, 2) },
        (item, index) => {
          return this.img1
        },
      )
      let item = this.img2
      this.list.splice(this.getRandomArrayIndex(this.list), 1, item)
      this.list = this.reset(this.list, this.level)
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.img1 = this.typeList[this.curImageIndex].img
    this.img2 = this.typeList[this.curImageIndex].found
    this.loop()
  },
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {
    this.stopGameTimer()
    this.clearTimer()
  },
  errorCaptured() {},
}
</script>

<style lang="scss" scoped>
div.user-info-box {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #fff5ee 0%, #ffe8f0 35%, #e8f8f5 70%, #e0f4ff 100%);
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

  /* ===== 背景浮动装饰 ===== */
  .bg-decor {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;

    .float-shape {
      position: absolute;
      border-radius: 50%;
      opacity: 0.5;
      filter: blur(1px);

      &.s1 {
        width: 180px; height: 180px;
        background: radial-gradient(circle, #ffc8dd 0%, transparent 70%);
        top: 8%; left: 5%;
        animation: floatY 8s ease-in-out infinite;
      }
      &.s2 {
        width: 240px; height: 240px;
        background: radial-gradient(circle, #b8e6d8 0%, transparent 70%);
        top: 50%; right: 3%;
        animation: floatY 10s ease-in-out infinite reverse;
      }
      &.s3 {
        width: 140px; height: 140px;
        background: radial-gradient(circle, #ffe0a3 0%, transparent 70%);
        bottom: 10%; left: 12%;
        animation: floatY 7s ease-in-out infinite 1s;
      }
      &.s4 {
        width: 100px; height: 100px;
        background: radial-gradient(circle, #c8b8ff 0%, transparent 70%);
        top: 20%; right: 18%;
        animation: floatY 9s ease-in-out infinite 2s;
      }
      &.s5 {
        width: 80px; height: 80px;
        background: radial-gradient(circle, #ffb8b8 0%, transparent 70%);
        top: 65%; left: 40%;
        animation: floatY 6s ease-in-out infinite 0.5s;
      }
      &.s6 {
        width: 120px; height: 120px;
        background: radial-gradient(circle, #a8d8ff 0%, transparent 70%);
        bottom: 25%; right: 30%;
        animation: floatY 11s ease-in-out infinite 1.5s;
      }
      &.s7 {
        width: 60px; height: 60px;
        background: radial-gradient(circle, #ffd4a8 0%, transparent 70%);
        top: 35%; left: 25%;
        animation: floatY 8s ease-in-out infinite 3s;
      }
      &.s8 {
        width: 90px; height: 90px;
        background: radial-gradient(circle, #b8f0e0 0%, transparent 70%);
        top: 12%; left: 55%;
        animation: floatY 9s ease-in-out infinite 2.5s;
      }
    }
  }

  @keyframes floatY {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-30px) scale(1.08); }
  }

  /* ===== 返回按钮 ===== */
  > div.bread {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 64px;
    line-height: 64px;
    text-align: left;
    font-size: 16px;
    color: #8a7a72;
    cursor: pointer;
    padding: 0 28px;
    box-sizing: border-box;
    transition: all 0.3s;
    display: flex;
    align-items: center;

    .back-arrow {
      font-size: 28px;
      margin-right: 6px;
      font-weight: 300;
      transition: transform 0.3s;
    }

    &:hover {
      color: #ff8a65;
      .back-arrow { transform: translateX(-4px); }
    }
  }

  .game-stage {
    position: relative;
    z-index: 5;
    height: calc(100% - 64px);
    display: flex;

    > div {
      width: 100%;
      height: 100%;
    }
  }

  /* ===== 开始界面 ===== */
  &.step1 {}
  .step1 {
    display: flex;
    justify-content: center;
    align-items: center;

    .start-card {
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 32px;
      padding: 48px 64px 40px;
      box-shadow:
        0 20px 60px rgba(255, 150, 130, 0.18),
        0 4px 16px rgba(0, 0, 0, 0.04),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.6);
      text-align: center;
      animation: cardIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      cursor: pointer;
      max-width: 520px;
    }

    @keyframes cardIn {
      from { opacity: 0; transform: translateY(30px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .start-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #ff9a76, #ffb88c);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      padding: 6px 18px;
      border-radius: 20px;
      margin-bottom: 20px;
      letter-spacing: 1px;
      box-shadow: 0 4px 12px rgba(255, 154, 118, 0.35);

      .dot {
        width: 5px; height: 5px;
        background: #fff;
        border-radius: 50%;
        animation: blink 1.5s ease-in-out infinite;
      }
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .start-title {
      font-size: 42px;
      font-weight: 800;
      line-height: 1.4;
      background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 50%, #ff9a76 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 8px;
      padding: 8px 0 4px;
      letter-spacing: 2px;
    }

    .start-subtitle {
      font-size: 17px;
      color: #a08a80;
      margin: 0 0 28px;
    }

    .start-img-wrap {
      position: relative;
      display: inline-block;
      margin-bottom: 28px;

      .img-glow {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 280px; height: 280px;
        background: radial-gradient(circle, rgba(125, 216, 192, 0.35) 0%, transparent 65%);
        animation: glowPulse 3s ease-in-out infinite;
      }

      img {
        position: relative;
        width: 200px;
        height: 200px;
        animation: bounce 2.5s ease-in-out infinite;
        filter: drop-shadow(0 8px 20px rgba(0,0,0,0.1));
      }
    }

    @keyframes glowPulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
      50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }

    .start-hint {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.8);
      border: 2px dashed #ffb88c;
      border-radius: 30px;
      padding: 10px 28px;
      font-size: 16px;
      color: #e07850;
      font-weight: 600;
      margin-bottom: 32px;
      animation: hintPulse 2s ease-in-out infinite;

      .hint-icon { font-size: 20px; }
    }

    @keyframes hintPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(255, 154, 118, 0.3); }
      50% { box-shadow: 0 0 0 12px rgba(255, 154, 118, 0); }
    }

    .start-tips {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;

      .tip-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;

        .tip-num {
          font-size: 24px;
          font-weight: 800;
          color: #ff7e5f;
        }
        .tip-label {
          font-size: 12px;
          color: #a08a80;
        }
      }

      .tip-divider {
        width: 1px;
        height: 32px;
        background: linear-gradient(to bottom, transparent, #e0d0c8, transparent);
      }
    }
  }

  /* ===== 游戏界面 ===== */
  .step2 {
    padding: 20px 40px 30px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    /* 顶部状态栏 */
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding: 0 20px;

      .stat-badge {
        display: flex;
        align-items: center;
        gap: 12px;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        padding: 10px 20px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.05);
        border: 1px solid rgba(255,255,255,0.6);

        .stat-icon {
          font-size: 28px;
        }
        .stat-text {
          display: flex;
          flex-direction: column;

          .stat-label {
            font-size: 12px;
            color: #a08a80;
          }
          .stat-value {
            font-size: 18px;
            font-weight: 700;
            color: #5a4a42;
          }
        }

        &.level-badge .stat-icon { filter: drop-shadow(0 2px 4px rgba(255,180,80,0.4)); }
        &.type-badge .stat-icon { filter: drop-shadow(0 2px 4px rgba(120,180,255,0.4)); }
      }

      .timer-ring {
        position: relative;
        width: 100px;
        height: 100px;

        .ring-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);

          .ring-bg {
            fill: none;
            stroke: rgba(255,255,255,0.5);
            stroke-width: 8;
          }
          .ring-progress {
            fill: none;
            stroke: url(#timerGrad);
            stroke: #7dd8c0;
            stroke-width: 8;
            stroke-linecap: round;
            transition: stroke-dashoffset 1s linear, stroke 0.5s;
          }
        }

        .timer-inner {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;

          .timer-num {
            display: block;
            font-size: 32px;
            font-weight: 800;
            color: #5a4a42;
            line-height: 1;
            transition: color 0.3s;
          }
          .timer-unit {
            font-size: 12px;
            color: #a08a80;
          }
        }

        &.time-mid {
          .ring-progress { stroke: #ffb84d; }
          .timer-num { color: #e09020; }
        }
        &.time-low {
          .ring-progress { stroke: #ff6b6b; animation: ringPulse 0.8s ease-in-out infinite; }
          .timer-num { color: #e04040; animation: textPulse 0.8s ease-in-out infinite; }
        }
      }
    }

    @keyframes ringPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes textPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }

    /* 主体区域 */
    .body {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: flex-start;
      gap: 40px;
      padding: 0 20px;
      box-sizing: border-box;
      overflow: hidden;

      /* 左侧网格 */
      .left {
        flex-shrink: 0;
        display: flex;
        justify-content: center;

        .grid-board {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(16px);
          border-radius: 24px;
          padding: 14px;
          box-shadow:
            0 12px 40px rgba(125, 180, 200, 0.15),
            0 2px 8px rgba(0,0,0,0.03),
            inset 0 1px 0 rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.6);
          width: fit-content;

          > ul {
            display: flex;
            justify-content: center;
            margin: 0;
            padding: 0;
            list-style: none;

            > li {
              display: flex;
              justify-content: center;
              align-items: center;
              list-style: none;

              > div {
                padding: 3px;
                box-sizing: border-box;

                .cell-card {
                  width: 100%;
                  height: 100%;
                  border-radius: 8px;
                  overflow: hidden;
                  cursor: pointer;
                  background: #fff;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                  transition: all 0.2s ease;
                  position: relative;

                  img {
                    width: 100%;
                    height: 100%;
                    display: block;
                    object-fit: cover;
                  }

                  &:hover {
                    transform: translateY(-3px) scale(1.04);
                    box-shadow: 0 8px 20px rgba(255, 154, 118, 0.3);
                    z-index: 5;
                  }

                  &:active {
                    transform: scale(0.95);
                  }
                }

                /* 网格尺寸 - 保持原有逻辑 */
                &.col1 { width: 480px; height: 480px; }
                &.col2 { width: 240px; height: 240px; }
                &.col3 { width: 160px; height: 160px; }
                &.col4 { width: 120px; height: 120px; }
                &.col5 { width: 96px; height: 96px; }
                &.col6 { width: 80px; height: 80px; }
                &.col7 { width: calc(480px / 7); height: calc(480px / 7); }
                &.col8 { width: 60px; height: 60px; }
                &.col9 { width: calc(480px / 9); height: calc(480px / 9); }
                &.col10 { width: 48px; height: 48px; }
                &.col11 { width: calc(480px / 11); height: calc(480px / 11); }
                &.col12 { width: 40px; height: 40px; }
                &.col13 { width: calc(480px / 13); height: calc(480px / 13); }
                &.col14 { width: calc(480px / 14); height: calc(480px / 14); }
                &.col15 { width: 32px; height: 32px; }
                &.col16 { width: 30px; height: 30px; }
                &.col17 { width: calc(480px / 17); height: calc(480px / 17); }
                &.col18 { width: calc(480px / 18); height: calc(480px / 18); }
                &.col19 { width: calc(480px / 19); height: calc(480px / 19); }
                &.col20 { width: 24px; height: 24px; }
                &.col21 { width: calc(480px / 21); height: calc(480px / 21); }
                &.col22 { width: calc(480px / 22); height: calc(480px / 22); }
                &.col23 { width: calc(480px / 23); height: calc(480px / 23); }
                &.col24 { width: 20px; height: 20px; }
                &.col25 { width: calc(480px / 25); height: calc(480px / 25); }
                &.col26 { width: calc(480px / 26); height: calc(480px / 26); }
                &.col27 { width: calc(480px / 27); height: calc(480px / 27); }
                &.col28 { width: calc(480px / 28); height: calc(480px / 28); }
                &.col29 { width: calc(480px / 29); height: calc(480px / 29); }
                &.col30 { width: 16px; height: 16px; }
              }
            }
          }
        }
      }

      /* 右侧面板 */
      .right {
        width: 320px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: 20px;

        .rules-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(16px);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.06);
          border: 1px solid rgba(255,255,255,0.6);
          position: relative;
          overflow: hidden;

          &::before {
            content: "";
            position: absolute;
            top: -30px; right: -30px;
            width: 100px; height: 100px;
            background: radial-gradient(circle, rgba(255,200,220,0.4) 0%, transparent 70%);
            border-radius: 50%;
          }

          .rules-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
            position: relative;

            .rules-icon { font-size: 22px; }
            h3 {
              margin: 0;
              font-size: 18px;
              font-weight: 700;
              color: #5a4a42;
            }
          }

          .rules-body {
            position: relative;

            p {
              margin: 0 0 10px;
              font-size: 14px;
              line-height: 1.7;
              color: #7a6a62;

              strong {
                color: #ff7e5f;
                font-weight: 700;
              }
            }
          }

          .rules-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 16px;

            .tag {
              font-size: 12px;
              padding: 4px 12px;
              border-radius: 12px;
              background: linear-gradient(135deg, #fff0e8, #ffe8d8);
              color: #e07850;
              font-weight: 600;
              border: 1px solid rgba(255,154,118,0.2);
            }
          }
        }

        .mascot-area {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.06);
          border: 1px solid rgba(255,255,255,0.6);

          .mascot-img {
            width: 90px;
            height: 98px;
            flex-shrink: 0;
            animation: mascotWiggle 3s ease-in-out infinite;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.08));
          }

          @keyframes mascotWiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
          }

          .action-buttons {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;

            .btn-game {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              height: 44px;
              border-radius: 12px;
              font-size: 15px;
              font-weight: 600;
              color: #fff;
              cursor: pointer;
              transition: all 0.25s;
              user-select: none;

              .btn-icon { font-size: 16px; }

              &:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0,0,0,0.15);
              }
              &:active { transform: translateY(0); }

              &.btn-replay {
                background: linear-gradient(135deg, #ffb84d 0%, #ff9a4d 100%);
                box-shadow: 0 4px 12px rgba(255, 160, 60, 0.35);
              }
              &.btn-switch {
                background: linear-gradient(135deg, #5b9bf5 0%, #4a8af0 100%);
                box-shadow: 0 4px 12px rgba(80, 140, 240, 0.35);
              }
            }
          }
        }
      }
    }
  }

  /* ===== 通关弹窗 ===== */
  > div.open {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(90, 74, 66, 0.45);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fadeIn 0.3s ease;

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-card {
      position: relative;
      width: 420px;
      background: linear-gradient(160deg, #fffaf5 0%, #fff0e8 100%);
      border-radius: 28px;
      padding: 48px 40px 36px;
      box-shadow:
        0 30px 80px rgba(0,0,0,0.2),
        0 0 0 1px rgba(255,255,255,0.5) inset;
      text-align: center;
      animation: modalPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes modalPop {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }

    .modal-stars {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;

      .star {
        position: absolute;
        font-size: 24px;
        color: #ffd966;
        animation: starTwinkle 2s ease-in-out infinite;

        &.star1 { top: 12%; left: 10%; animation-delay: 0s; }
        &.star2 { top: 8%; right: 12%; animation-delay: 0.4s; font-size: 20px; }
        &.star3 { bottom: 18%; left: 8%; animation-delay: 0.8s; font-size: 18px; }
        &.star4 { bottom: 12%; right: 10%; animation-delay: 1.2s; }
        &.star5 { top: 40%; left: 5%; animation-delay: 0.6s; font-size: 16px; }
      }
    }

    @keyframes starTwinkle {
      0%, 100% { opacity: 0.4; transform: scale(1) rotate(0deg); }
      50% { opacity: 1; transform: scale(1.3) rotate(20deg); }
    }

    .modal-trophy {
      font-size: 64px;
      margin-bottom: 12px;
      animation: trophyBounce 1s ease-in-out infinite;
    }

    @keyframes trophyBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    .modal-title {
      font-size: 28px;
      font-weight: 800;
      line-height: 1.4;
      background: linear-gradient(135deg, #ff7e5f, #feb47b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 16px;
      padding: 6px 0 2px;
    }

    .modal-body {
      font-size: 16px;
      color: #7a6a62;
      line-height: 1.8;
      margin-bottom: 24px;

      p { margin: 0; }
    }

    .modal-loading {
      display: flex;
      justify-content: center;
      gap: 8px;

      span {
        width: 8px; height: 8px;
        border-radius: 50%;
        background: #ffb88c;
        animation: loadingDot 1.4s ease-in-out infinite;

        &:nth-child(2) { animation-delay: 0.2s; }
        &:nth-child(3) { animation-delay: 0.4s; }
      }
    }

    @keyframes loadingDot {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }
  }
}
</style>
