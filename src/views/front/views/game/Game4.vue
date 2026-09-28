<template>
  <div class="user-info-box">
    <!-- 游戏背景装饰层 -->
    <div class="bg-decor" aria-hidden="true">
      <div class="bg-orb orb-1"></div>
      <div class="bg-orb orb-2"></div>
      <div class="bg-orb orb-3"></div>
      <div class="bg-stars stars-1"></div>
      <div class="bg-stars stars-2"></div>
      <div class="bg-stars stars-3"></div>
      <div class="bg-grid"></div>
    </div>

    <!-- 返回 -->
    <div class="bread" @click="$router.go(-1)">
      <span class="back-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </span>
      <span>返回</span>
    </div>

    <div class="page-body">
      <!-- 开始页 -->
      <div v-if="curStatus == 1" class="step1" @dblclick="start()">
        <div class="start-badge">注意力训练 · FOCUS</div>
        <h1 class="start-title">舒尔特方格</h1>
        <p class="start-sub">按顺序依次点击 1—25，考考你的专注力</p>

        <div class="start-stage">
          <div class="start-glow"></div>
          <div class="start-ring"></div>
          <div class="start-grid-mini">
            <span v-for="n in 25" :key="n" :class="'cell-' + n">{{ n }}</span>
          </div>
          <img class="start-card" src="@/assets/images/game/game4/start.png" alt="" />
          <span class="start-spark sp1"></span>
          <span class="start-spark sp2"></span>
          <span class="start-spark sp3"></span>
          <span class="start-spark sp4"></span>
        </div>

        <div class="start-cta">
          <span class="cta-dot"></span>
          双击任意位置开始挑战
        </div>
        <div class="start-hint">通关后自动记录成绩 · 点错数字游戏即结束</div>
      </div>

      <!-- 游戏页 -->
      <div v-else class="step2">
        <!-- 顶部状态栏 -->
        <div class="hud">
          <div class="hud-item hud-target">
            <div class="hud-icon icon-target">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9"></circle>
                <circle cx="12" cy="12" r="5"></circle>
                <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"></circle>
              </svg>
            </div>
            <div class="hud-meta">
              <span class="hud-label">下一个数字</span>
              <span class="hud-value hud-target-num">{{ curMustNum }}</span>
            </div>
          </div>

          <div class="hud-item hud-item--progress">
            <div class="hud-icon icon-progress">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                <line x1="8" y1="9" x2="8" y2="15"></line>
                <line x1="12" y1="9" x2="12" y2="15"></line>
                <line x1="16" y1="9" x2="16" y2="15"></line>
              </svg>
            </div>
            <div class="hud-meta">
              <span class="hud-label">已找到 {{ activeArr.length }}/25</span>
              <div class="hud-bar">
                <div class="hud-bar-fill" :style="{ width: progressPercent + '%' }"></div>
              </div>
            </div>
          </div>

          <div class="hud-item">
            <div class="hud-icon icon-time">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9"></circle>
                <polyline points="12 7 12 12 15 14"></polyline>
              </svg>
            </div>
            <div class="hud-meta">
              <span class="hud-label">用时</span>
              <span class="hud-value">{{ time }}<em>s</em></span>
            </div>
          </div>
        </div>

        <div class="body">
          <!-- 数字方格区 -->
          <div class="left">
            <div class="grid-frame">
              <ul>
                <li
                  v-for="(item, index) in list"
                  :key="index"
                  @click="numClick(item)"
                >
                  <div :class="{ active: activeArr.includes(item) }">
                    <span class="num-shadow">{{ item }}</span>
                    <span class="num-text">{{ item }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- 右侧规则与操作 -->
          <div class="right">
            <div class="panel rules-panel">
              <div class="panel-title">
                <span class="title-bullet"></span>
                游戏规则
              </div>
              <p class="rules-text">
                请观看左上角的数字提示，按从小到大的顺序依次点击 1—25。全部点对即通关，点错任意数字游戏立即结束。
              </p>
              <div class="rules-tip">
                <span class="tip-icon">!</span>
                保持视线居中，用余光寻找下一个数字，速度会更快哦！
              </div>
            </div>

            <div class="panel action-panel">
              <div class="btn-group">
                <div class="game-btn btn-primary" @click="reset()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                  再玩一次
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 结果弹窗 -->
    <transition name="pop">
      <div class="open" v-if="isVisible">
        <div class="open-card" :class="{ 'is-win': isOver }">
          <div class="open-stars">
            <img src="@/assets/images/game/game1/star.png" alt="" />
          </div>
          <p class="open-title">{{ isOver ? "恭喜通关" : "游戏结束" }}</p>
          <div class="open-text" v-html="strText"></div>
          <span class="confetti c1"></span>
          <span class="confetti c2"></span>
          <span class="confetti c3"></span>
          <span class="confetti c4"></span>
          <span class="confetti c5"></span>
          <span class="confetti c6"></span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { reportApiAdd } from "@/server/api/report"
export default {
  data() {
    return {
      curStatus: 1,
      timer: null,
      isVisible: false,
      list: [],
      curMustNum: 1,
      isTimer: false,
      time: 0,
      strText: "",
      audio: null,
      level: 1,
      key: true,
      isVisiable: false,
      randomNum: 1,
      activeArr: [],
      isClick: true,
      isOver: false,
    }
  },
  computed: {
    progressPercent() {
      return Math.min(100, (this.activeArr.length / 25) * 100)
    },
    // 点对一个得 4 分，满分 100 分（25 * 4）
    score() {
      return this.activeArr.length * 4
    },
  },
  mixins: [],
  watch: {},
  directives: {},
  filters: {},
  components: {},
  methods: {
    start() {
      this.curStatus = 2
      this.reset()
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
    reset() {
      this.activeArr = []
      this.clearTimer()
      this.countTime()
      this.time = 0
      this.curMustNum = 1
      this.loop()
      this.isTimer = true
      this.isClick = true
      this.isOver = false
    },
    loop() {
      this.list = []
      for (var i = 0; i < 25; i++) {
        this.list.push(i + 1)
      }
      this.randomSort(this.list)
    },
    randomSort(arr) {
      arr.sort(function () {
        return Math.random() - 0.5
      })
    },
    rand(min, max) {
      return Math.round(Math.random() * (max - min) + min)
    },
    deepClone(obj) {
      if (obj === null) return obj
      if (obj instanceof Date) return new Date(obj)
      if (obj instanceof RegExp) return new RegExp(obj)
      if (typeof obj !== "object") return obj
      let cloneObj = new obj.constructor()
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloneObj[key] = this.deepClone(obj[key])
        }
      }
      return cloneObj
    },
    numClick(item) {
      if (this.isClick == true) {
        if (item == this.curMustNum) {
          if (this.curMustNum < 25) {
            this.activeArr.push(this.curMustNum)
            this.curMustNum++
          } else {
            this.activeArr.push(this.curMustNum)
            this.clearTimer()
            this.isTimer = false
            this.isVisible = true
            this.isOver = true
            this.strText = `您用时${this.time}秒`
            setTimeout(async () => {
              this.isVisible = false
              this.isClick = false

              await reportApiAdd({
                cat_name: "心理训练",
                game_name: "舒尔特测试",
                score: this.score,
                seconds: this.time,
              }).then(({ data }) => {
                if (data.code == this.$global.successCode) {
                  this.$router.go(-1) // 返回上一页
                }
              })
            }, 5000)
          }
        } else {
          this.clearTimer()
          this.isTimer = false
          this.isVisible = true
          this.strText = `
                        <p>游戏结束，您用时${this.time}秒</p>
                        <p>这个数字应为${this.curMustNum},当前是${item}</p>
                    `
          setTimeout(async () => {
            this.isVisible = false
            this.isClick = false

            await reportApiAdd({
              cat_name: "心理训练",
              game_name: "舒尔特测试",
              score: this.score,
              seconds: this.time,
            }).then(({ data }) => {
              if (data.code == this.$global.successCode) {
                this.$router.go(-1) // 返回上一页
              }
            })
          }, 5000)
        }
      } else {
        this.$toast("", "请点击按钮才能玩哦！")
      }
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
$bg-deep: #0c1a3a;
$bg-mid: #1a2f6a;
$bg-warm: #2a1f6b;
$glass: rgba(255, 255, 255, 0.08);
$glass-border: rgba(255, 255, 255, 0.18);
$text: #ffffff;
$text-sub: rgba(255, 255, 255, 0.72);
$cyan: #4fd8ff;
$gold: #ffd166;
$pink: #ff6ec7;
$orange: #ff9d4d;
$blue: #5b8cff;
$tile-grad-b: #6a5cff;

div.user-info-box {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(1200px 700px at 15% 10%, rgba(91, 140, 255, 0.45), transparent 60%),
    radial-gradient(1000px 800px at 85% 90%, rgba(123, 66, 220, 0.45), transparent 60%),
    radial-gradient(900px 700px at 70% 20%, rgba(79, 216, 255, 0.22), transparent 60%),
    linear-gradient(160deg, $bg-deep 0%, $bg-mid 50%, $bg-warm 100%);
  font-family: "ziyuanyuanti400W", "Microsoft YaHei", sans-serif;

  /* ---------- 背景装饰 ---------- */
  .bg-decor {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.55;
    animation: orbFloat 16s ease-in-out infinite;
  }
  .orb-1 {
    width: 420px;
    height: 420px;
    background: #4a7dff;
    top: -120px;
    left: -100px;
  }
  .orb-2 {
    width: 480px;
    height: 480px;
    background: #7b42dc;
    bottom: -160px;
    right: -120px;
    animation-delay: -5s;
  }
  .orb-3 {
    width: 360px;
    height: 360px;
    background: #2fd4ff;
    top: 45%;
    left: 55%;
    animation-delay: -10s;
  }
  .bg-stars {
    position: absolute;
    inset: 0;
    background-repeat: repeat;
    animation: twinkle 5s ease-in-out infinite alternate;
  }
  .stars-1 {
    background-image:
      radial-gradient(1.5px 1.5px at 20px 30px, #ffffff, transparent),
      radial-gradient(1px 1px at 80px 120px, rgba(255, 255, 255, 0.8), transparent),
      radial-gradient(1.5px 1.5px at 160px 60px, #ffffff, transparent),
      radial-gradient(1px 1px at 220px 180px, rgba(255, 255, 255, 0.7), transparent);
    background-size: 260px 260px;
  }
  .stars-2 {
    background-image:
      radial-gradient(1px 1px at 50px 90px, #fff, transparent),
      radial-gradient(1.5px 1.5px at 140px 30px, rgba(180, 220, 255, 0.9), transparent),
      radial-gradient(1px 1px at 200px 150px, #fff, transparent);
    background-size: 300px 300px;
    animation-delay: -2s;
    opacity: 0.7;
  }
  .stars-3 {
    background-image:
      radial-gradient(2px 2px at 70px 50px, rgba(255, 230, 150, 0.9), transparent),
      radial-gradient(1px 1px at 180px 110px, #fff, transparent),
      radial-gradient(1.5px 1.5px at 260px 200px, rgba(255, 255, 255, 0.8), transparent);
    background-size: 340px 340px;
    animation-delay: -3.5s;
    opacity: 0.6;
  }
  .bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(79, 216, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(79, 216, 255, 0.05) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
    -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
  }

  /* ---------- 返回按钮 ---------- */
  > div.bread {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 74px;
    padding: 0 40px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    color: $text-sub;
    cursor: pointer;
    user-select: none;
    transition: color 0.25s;
    .back-icon {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $glass;
      border: 1px solid $glass-border;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      transition: all 0.25s;
      svg {
        width: 20px;
        height: 20px;
      }
    }
    &:hover {
      color: $text;
      .back-icon {
        background: rgba(255, 255, 255, 0.18);
        transform: translateX(-3px);
      }
    }
  }

  > .page-body {
    position: relative;
    z-index: 1;
    height: calc(100% - 74px);
    width: 100%;

    > div {
      width: 100%;
      height: 100%;
    }
  }

  /* ---------- 开始页 ---------- */
  .step1 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
    user-select: none;

    .start-badge {
      padding: 7px 22px;
      border-radius: 999px;
      font-size: 16px;
      letter-spacing: 3px;
      color: $cyan;
      background: rgba(79, 216, 255, 0.12);
      border: 1px solid rgba(79, 216, 255, 0.4);
      margin-bottom: 22px;
      animation: fadeDown 0.8s ease both;
    }
    .start-title {
      font-size: 64px;
      line-height: 1.1;
      font-weight: 700;
      letter-spacing: 8px;
      margin-bottom: 18px;
      background: linear-gradient(180deg, #ffffff 0%, #cfe8ff 55%, #4fd8ff 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 40px rgba(79, 216, 255, 0.35);
      animation: fadeDown 0.9s ease both;
    }
    .start-sub {
      font-size: 22px;
      color: $text-sub;
      margin-bottom: 24px;
      animation: fadeDown 1s ease both;
    }

    .start-stage {
      position: relative;
      width: 300px;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 28px;
      animation: fadeUp 1s ease both;
    }
    .start-glow {
      position: absolute;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(79, 216, 255, 0.5) 0%, rgba(91, 140, 255, 0.25) 45%, transparent 70%);
      filter: blur(20px);
      animation: glowPulse 3s ease-in-out infinite;
    }
    .start-ring {
      position: absolute;
      width: 250px;
      height: 250px;
      border-radius: 24px;
      border: 2px solid rgba(79, 216, 255, 0.5);
      box-shadow:
        0 0 30px rgba(79, 216, 255, 0.35),
        inset 0 0 24px rgba(79, 216, 255, 0.15);
      animation: ringPulse 3s ease-in-out infinite;
      transform: rotate(45deg);
      border-radius: 30px;
    }
    .start-grid-mini {
      position: absolute;
      width: 230px;
      height: 230px;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 6px;
      z-index: 1;
      span {
        border-radius: 8px;
        background: rgba(79, 216, 255, 0.08);
        border: 1px solid rgba(79, 216, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.55);
        animation: miniCellPulse 3s ease-in-out infinite;
      }
      @for $i from 1 through 25 {
        .cell-#{$i} { animation-delay: #{($i - 1) * 0.08}s; }
      }
    }
    .start-card {
      position: relative;
      z-index: 2;
      width: 150px;
      height: 150px;
      object-fit: contain;
      border-radius: 20px;
      box-shadow:
        -10px 14px 30px rgba(0, 0, 0, 0.45),
        0 0 30px rgba(79, 216, 255, 0.45);
      animation: cardFloat 3.5s ease-in-out infinite;
    }
    .start-spark {
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: $gold;
      box-shadow: 0 0 12px $gold;
      animation: sparkTwinkle 2.4s ease-in-out infinite;
      z-index: 3;
    }
    .sp1 { top: 20px; left: 20px; }
    .sp2 { top: 50px; right: 10px; background: $cyan; box-shadow: 0 0 12px $cyan; animation-delay: -0.8s; }
    .sp3 { bottom: 60px; left: 10px; background: $pink; box-shadow: 0 0 12px $pink; animation-delay: -1.4s; }
    .sp4 { bottom: 20px; right: 30px; animation-delay: -1.8s; }

    .start-cta {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 14px 38px;
      border-radius: 999px;
      font-size: 22px;
      color: #fff;
      background: linear-gradient(135deg, #4fd8ff 0%, #5b8cff 100%);
      box-shadow:
        0 8px 24px rgba(91, 140, 255, 0.45),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
      animation: fadeUp 1.1s ease both;
      .cta-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #fff;
        animation: dotBlink 1.2s ease-in-out infinite;
      }
    }
    .start-hint {
      margin-top: 18px;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.5);
      animation: fadeUp 1.2s ease both;
    }
  }

  /* ---------- 游戏页 ---------- */
  .step2 {
    padding: 24px 50px 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    /* HUD */
    .hud {
      display: flex;
      align-items: center;
      gap: 22px;
      padding: 16px 26px;
      border-radius: 18px;
      background: $glass;
      border: 1px solid $glass-border;
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
      margin-bottom: 28px;
    }
    .hud-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 4px 20px 4px 4px;
      border-right: 1px solid rgba(255, 255, 255, 0.12);
      &:last-child { border-right: none; }
      &--progress { flex: 1; }
    }
    .hud-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      flex-shrink: 0;
      svg { width: 22px; height: 22px; }
      &.icon-target { background: linear-gradient(135deg, #ff9d4d, #ffd166); box-shadow: 0 4px 12px rgba(255, 157, 77, 0.5); }
      &.icon-progress { background: linear-gradient(135deg, #2fd4ff, #4fd8ff); box-shadow: 0 4px 12px rgba(47, 212, 255, 0.5); }
      &.icon-time { background: linear-gradient(135deg, #ff6ec7, #b16bff); box-shadow: 0 4px 12px rgba(255, 110, 199, 0.5); }
    }
    .hud-meta {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }
    .hud-label {
      font-size: 14px;
      color: $text-sub;
      line-height: 1;
    }
    .hud-value {
      font-size: 24px;
      font-weight: 700;
      color: $text;
      line-height: 1.1;
      em {
        font-size: 14px;
        font-style: normal;
        color: $text-sub;
        margin-left: 2px;
      }
    }
    .hud-target-num {
      font-size: 32px;
      background: linear-gradient(180deg, #ffe7a8, #ff9d4d);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 20px rgba(255, 157, 77, 0.4);
    }
    .hud-bar {
      width: 100%;
      min-width: 180px;
      height: 8px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.14);
      overflow: hidden;
      margin-top: 2px;
    }
    .hud-bar-fill {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, #2fd4ff, #4fd8ff 50%, #ffe27a);
      box-shadow: 0 0 10px rgba(79, 216, 255, 0.7);
      transition: width 0.4s ease;
    }

    .body {
      display: flex;
      gap: 60px;
      align-items: flex-start;
      justify-content: center;
      flex: 1;
      min-height: 0;
    }

    /* 数字方格区 */
    .left {
      flex-shrink: 0;
      display: flex;
      align-items: flex-start;
      justify-content: center;

      .grid-frame {
        padding: 18px;
        border-radius: 24px;
        background:
          radial-gradient(circle at 50% 0%, rgba(79, 216, 255, 0.15), transparent 60%),
          $glass;
        border: 1px solid $glass-border;
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        box-shadow:
          0 16px 40px rgba(0, 0, 0, 0.35),
          inset 0 0 0 1px rgba(255, 255, 255, 0.04);

        ul {
          width: 500px;
          height: 500px;
          display: flex;
          flex-flow: row wrap;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        li {
          width: 100px;
          height: 100px;
          padding: 5px;
          box-sizing: border-box;
          list-style: none;
        }
        li > div {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 14px;
          cursor: pointer;
          color: #ffffff;
          background: linear-gradient(145deg, #5d94ff 0%, $tile-grad-b 100%);
          box-shadow:
            0 6px 14px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.35),
            inset 0 -3px 6px rgba(0, 0, 0, 0.2);
          text-align: center;
          overflow: hidden;
          transition: transform 0.18s ease, box-shadow 0.25s ease, background 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: tileDeal 0.45s ease both;

          .num-shadow {
            position: absolute;
            font-size: 40px;
            font-weight: 800;
            color: rgba(255, 255, 255, 0.12);
            transform: translate(2px, 2px);
          }
          .num-text {
            position: relative;
            font-size: 32px;
            font-weight: 800;
            letter-spacing: 1px;
            text-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
          }

          &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 45%;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.22), transparent);
            border-radius: 14px 14px 50% 50%;
            pointer-events: none;
          }
          &:hover {
            transform: translateY(-4px) scale(1.03);
            box-shadow:
              0 12px 22px rgba(0, 0, 0, 0.4),
              0 0 18px rgba(79, 216, 255, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.4);
          }
          &:active {
            transform: translateY(-1px) scale(0.98);
          }
          &.active {
            background: linear-gradient(145deg, #ffe7a8 0%, #ffb347 100%);
            box-shadow:
              0 6px 14px rgba(0, 0, 0, 0.3),
              0 0 22px rgba(255, 209, 102, 0.75),
              inset 0 1px 0 rgba(255, 255, 255, 0.5);
            animation: tilePop 0.45s ease;
            .num-text {
              color: #5a3a00;
              text-shadow: 0 1px 2px rgba(255, 255, 255, 0.4);
            }
            .num-shadow {
              color: rgba(90, 58, 0, 0.12);
            }
          }
        }
        @for $i from 1 through 25 {
          li:nth-child(#{$i}) > div { animation-delay: #{$i * 0.025}s; }
        }
      }
    }

    /* 右侧 */
    .right {
      width: 380px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 22px;

      .panel {
        border-radius: 20px;
        background: $glass;
        border: 1px solid $glass-border;
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
      }
      .panel-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 22px;
        font-weight: 700;
        color: $text;
        margin-bottom: 14px;
        .title-bullet {
          width: 10px;
          height: 24px;
          border-radius: 4px;
          background: linear-gradient(180deg, #4fd8ff, #6a5cff);
          box-shadow: 0 0 10px rgba(79, 216, 255, 0.6);
        }
      }

      .rules-panel {
        padding: 26px 28px;
      }
      .rules-text {
        font-size: 17px;
        line-height: 1.8;
        color: $text-sub;
        margin: 0 0 16px;
      }
      .rules-tip {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        border-radius: 12px;
        font-size: 15px;
        color: #ffe7a8;
        background: rgba(255, 209, 102, 0.12);
        border: 1px solid rgba(255, 209, 102, 0.3);
        .tip-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          color: #3a2a00;
          background: $gold;
        }
      }

      .action-panel {
        padding: 24px 28px 28px;
        .btn-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .game-btn {
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 21px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          user-select: none;
          transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
          svg { width: 20px; height: 20px; }
          &:active { transform: scale(0.97); }
        }
        .btn-primary {
          background: linear-gradient(135deg, #4fd8ff 0%, #5b8cff 100%);
          box-shadow: 0 8px 20px rgba(91, 140, 255, 0.45), inset 0 1px 0 rgba(255,255,255,0.35);
          &:hover { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(91, 140, 255, 0.55), inset 0 1px 0 rgba(255,255,255,0.35); }
        }
      }
    }
  }

  /* ---------- 结果弹窗 ---------- */
  > div.open {
    position: absolute;
    z-index: 50;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(8, 14, 38, 0.65);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;

    .open-card {
      position: relative;
      width: 520px;
      padding: 82px 50px 46px;
      box-sizing: border-box;
      border-radius: 26px;
      text-align: center;
      background:
        radial-gradient(circle at 50% 0%, rgba(79, 216, 255, 0.25), transparent 60%),
        linear-gradient(160deg, rgba(40, 60, 130, 0.92) 0%, rgba(25, 30, 80, 0.95) 100%);
      border: 1px solid rgba(79, 216, 255, 0.5);
      box-shadow:
        0 0 60px rgba(79, 216, 255, 0.35),
        0 20px 60px rgba(0, 0, 0, 0.5);
      overflow: visible;

      &.is-win {
        background:
          radial-gradient(circle at 50% 0%, rgba(255, 209, 102, 0.25), transparent 60%),
          linear-gradient(160deg, rgba(60, 40, 120, 0.92) 0%, rgba(35, 22, 80, 0.95) 100%);
        border-color: rgba(255, 209, 102, 0.5);
        box-shadow:
          0 0 60px rgba(255, 209, 102, 0.35),
          0 20px 60px rgba(0, 0, 0, 0.5);
      }
    }
    .open-stars {
      position: absolute;
      top: -34px;
      left: 50%;
      transform: translateX(-50%);
      img {
        width: 280px;
        height: auto;
        filter: drop-shadow(0 6px 14px rgba(255, 209, 102, 0.6));
        animation: starsBounce 1.2s ease both;
      }
    }
    .open-title {
      font-size: 38px;
      font-weight: 700;
      letter-spacing: 4px;
      line-height: 1.4;
      padding: 6px 0 2px;
      margin-bottom: 22px;
      background: linear-gradient(180deg, #fff7d6 0%, #ffd166 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .open-text {
      font-size: 20px;
      line-height: 1.9;
      color: $text-sub;
      p { margin: 0; }
    }

    .confetti {
      position: absolute;
      width: 10px;
      height: 14px;
      top: -10px;
      opacity: 0.9;
      animation: confettiFall 2.6s ease-in infinite;
    }
    .c1 { left: 12%;  background: #ff6ec7; animation-delay: 0s; }
    .c2 { left: 28%;  background: #4fd8ff; animation-delay: -0.6s; }
    .c3 { left: 48%;  background: #ffd166; animation-delay: -1.2s; }
    .c4 { left: 66%;  background: #6a5cff; animation-delay: -0.3s; }
    .c5 { left: 82%;  background: #ff9d4d; animation-delay: -1.8s; }
    .c6 { left: 92%;  background: #4fd8ff; animation-delay: -0.9s; }
  }

  /* 弹窗过渡 */
  .pop-enter-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .pop-leave-active { transition: all 0.3s ease; }
  .pop-enter, .pop-leave-to {
    opacity: 0;
    .open-card { transform: scale(0.7); }
  }
}

/* ---------- 动画 ---------- */
@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -40px) scale(1.08); }
}
@keyframes twinkle {
  0% { opacity: 0.45; }
  100% { opacity: 1; }
}
@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes glowPulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}
@keyframes ringPulse {
  0%, 100% { opacity: 0.5; transform: rotate(45deg) scale(1); }
  50% { opacity: 0.9; transform: rotate(45deg) scale(1.05); }
}
@keyframes cardFloat {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-14px) rotate(2deg); }
}
@keyframes sparkTwinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.3); }
}
@keyframes dotBlink {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.6); }
}
@keyframes miniCellPulse {
  0%, 100% { opacity: 0.4; transform: scale(0.95); }
  50% { opacity: 0.9; transform: scale(1); }
}
@keyframes tileDeal {
  from { opacity: 0; transform: translateY(24px) scale(0.8); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes tilePop {
  0% { transform: scale(1); }
  40% { transform: scale(1.12); }
  70% { transform: scale(0.96); }
  100% { transform: scale(1); }
}
@keyframes starsBounce {
  0% { opacity: 0; transform: translateX(-50%) scale(0.3) rotate(-20deg); }
  60% { opacity: 1; transform: translateX(-50%) scale(1.15) rotate(8deg); }
  100% { opacity: 1; transform: translateX(-50%) scale(1) rotate(0); }
}
@keyframes confettiFall {
  0% { transform: translateY(-20px) rotate(0); opacity: 1; }
  100% { transform: translateY(360px) rotate(540deg); opacity: 0; }
}
</style>
