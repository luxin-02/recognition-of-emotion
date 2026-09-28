<template>
  <div class="game8-root">
    <!-- 背景装饰 -->
    <div class="bg-decor" aria-hidden="true">
      <span class="orb orb-red"></span>
      <span class="orb orb-green"></span>
      <span class="orb orb-yellow"></span>
      <span class="orb orb-blue"></span>
      <span class="grid-mask"></span>
    </div>

    <!-- 返回栏 -->
    <div class="bread" @click="$router.go(-1)">
      <span class="back-arrow">‹</span>
      <span>返回</span>
    </div>

    <div class="game-stage">
      <!-- 开始页 -->
      <div v-if="curStatus == 1" class="step1" @dblclick="start()">
        <div class="start-card">
          <div class="start-badge">PSYCH · TRAINING</div>
          <div class="start-logo">
            <img src="@/assets/images/game/game8/start.png" alt="旋转拼图" />
            <span class="logo-ring"></span>
          </div>
          <h1 class="start-title">旋转拼图</h1>
          <p class="start-sub">考验你智慧的时候到了</p>
          <div class="start-hint">
            <span class="pulse-dot"></span>
            <span>双击任意位置开始</span>
          </div>
        </div>
      </div>

      <!-- 游戏页 -->
      <div v-else class="step2">
        <div class="top-bar">
          <div class="stat-pill">
            <span class="stat-icon">◆</span>
            <span class="stat-label">步数</span>
            <span class="stat-value">{{ step }}</span>
          </div>
          <div class="game-title">
            <span class="title-dot"></span>
            旋转拼图
            <span class="title-dot"></span>
          </div>
          <div class="stat-pill">
            <span class="stat-icon">◷</span>
            <span class="stat-label">用时</span>
            <span class="stat-value">{{ time }}<small>s</small></span>
          </div>
        </div>

        <div class="board-wrap">
          <!-- 左侧占位，保证棋盘居中 -->
          <div class="grid-spacer"></div>

          <div class="pane">
            <div class="pane-glow"></div>
            <div class="tile-cont">
              <div
                class="tile"
                :class="[
                  'tile-' + item,
                  { 'tile-hot': hotTiles.includes(index) },
                ]"
                v-for="(item, index) in data"
                :key="index"
              ></div>
            </div>
            <div class="dot-cont">
              <div
                class="dot"
                :style="{
                  top: `${((((index / ROW_DOT) | 0) + 1) / ROW) * 100}%`,
                  left: `${(((index % ROW_DOT) + 1) / ROW) * 100}%`,
                }"
                v-for="(item, index) in dotData"
                :key="index"
                @click="clickHandle(item)"
                @mouseenter="hoverIndex = item"
                @mouseleave="hoverIndex = -1"
              >
                ↻
              </div>
            </div>
          </div>

          <!-- 右侧信息面板 -->
          <div class="side-panel">
            <div class="panel-card rules-card">
              <h3>游戏规则</h3>
              <p>
                点击方块交界处的旋转按钮，其四周的四个方块会按<strong>顺时针</strong>方向旋转。
                当四个区域的方块颜色各自统一时，即可通关。
              </p>
              <div class="rules-tip">
                <span class="tip-dot"></span> 悬停按钮可预览将要旋转的四个方块
              </div>
            </div>
            <div class="panel-card btns-card">
              <div class="action-btn btn-reset" @click="clear()">
                <span class="btn-icon">↺</span> 复原
              </div>
              <div class="action-btn btn-shuffle" @click="generate()">
                <span class="btn-icon">⟳</span> 重置
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 通关弹窗 -->
    <div class="modal-mask" v-if="isVisiable">
      <div class="modal-card">
        <div class="modal-stars">
          <span>★</span><span>★</span><span>★</span>
        </div>
        <h2 class="modal-title">恭喜通关</h2>
        <div class="modal-body" v-html="strText"></div>
        <div class="modal-footer">即将自动返回…</div>
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
      isVisiable: false,
      timer: null,
      strText: "",
      time: 0,

      ROW: 12, // 色块行数，同时也是列数
      ROW_DOT: 11, // 旋钮行数 ROW - 1
      total: 144, // ROW ** 2
      data: [],
      isRunning: false,
      dotData: [],
      dataString: "",
      step: 0,
      hoverIndex: -1, // 悬停的旋钮对应的左上角色块索引
    }
  },
  computed: {
    // 当前悬停旋钮影响到的四个色块
    hotTiles() {
      const i = this.hoverIndex
      if (i < 0) return []
      return [i, i + 1, i + this.ROW, i + this.ROW + 1]
    },
  },
  methods: {
    start() {
      this.curStatus = 2
      this.generate() // 直接洗牌并开始计时，优化开局体验
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
    initDotList() {
      const row = this.ROW - 1
      return Array.from({ length: row ** 2 }, (_, i) => {
        return ((i / row) | 0) * this.ROW + (i % row)
      })
    },
    getRandNum(max) {
      return (Math.random() * max) | 0
    },
    initData() {
      return Array.from({ length: this.total }, (_, i) => {
        const row = ((i / this.ROW) | 0) >= this.ROW / 2 ? 1 : 0
        const col = i % this.ROW >= this.ROW / 2 ? 1 : 0
        return row * 2 + col
      })
    },
    turn(sourceData, index) {
      const data = [...sourceData]
      const offset = [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
      ]
      for (let i = 0; i < offset.length; i++) {
        const [y1, x1] = offset[i]
        const [y2, x2] = offset[(i + 1) % 4]
        const prev = index + y1 * this.ROW + x1
        const next = index + y2 * this.ROW + x2
        data[next] = sourceData[prev]
      }
      return data
    },
    clickHandle(index) {
      if (!this.isRunning) {
        this.$myMessage({
          type: "font-error",
          message: "当前不可旋转，请点击重置按钮开始游戏",
        })
        return
      }
      const data = this.turn(this.data, index)
      this.data = data
      this.step++
      if (JSON.stringify(data) === this.dataString) {
        this.isVisiable = true
        this.clearTimer()
        this.strText = `
          <p>恭喜你，游戏通关！总共用了 ${this.step} 步</p>
          <p>总用时 ${this.time} 秒</p>
        `
        setTimeout(async () => {
          this.isVisiable = false
          this.isRunning = false

          await reportApiAdd({
            cat_name: "心理训练",
            game_name: "旋转拼图",
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
    clear() {
      this.clearTimer()
      this.time = 0
      this.step = 0
      this.isRunning = false
      this.data = this.initData()
    },
    generate() {
      this.time = 0
      this.step = 0
      this.clearTimer()
      this.countTime()
      let count = this.dotData.length
      let data = this.data
      this.isRunning = true

      while (count--) {
        const num = this.dotData[this.getRandNum(this.dotData.length)]
        data = this.turn(data, num)
      }
      this.data = data
    },
  },
  created() {
    this.dataString = JSON.stringify(this.initData())
    this.dotData = this.initDotList()
    this.data = this.initData()
  },
  destroyed() {
    this.clearTimer()
  },
}
</script>

<style lang="scss" scoped>
$tile-0: #ff6b6b;
$tile-1: #81eb00;
$tile-2: #ffe14c;
$tile-3: #598bff;

.game8-root {
  --board-size: min(700px, 74vmin);
  --tile-size: calc(var(--board-size) / 12);
  --panel-w: 280px;

  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  color: #eef1ff;
  background: linear-gradient(135deg, #1b1b46 0%, #2a1a52 45%, #101a3d 100%);
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

  /* ---------- 背景装饰 ---------- */
  .bg-decor {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .orb {
    position: absolute;
    width: 42vmax;
    height: 42vmax;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.28;
    animation: float 18s ease-in-out infinite;
  }
  .orb-red {
    background: $tile-0;
    top: -18vmax;
    left: -12vmax;
  }
  .orb-green {
    background: $tile-1;
    bottom: -20vmax;
    right: -10vmax;
    animation-delay: -6s;
  }
  .orb-yellow {
    background: $tile-2;
    top: 30%;
    left: 45%;
    width: 28vmax;
    height: 28vmax;
    opacity: 0.18;
    animation-delay: -12s;
  }
  .orb-blue {
    background: $tile-3;
    bottom: 10%;
    left: 8%;
    width: 26vmax;
    height: 26vmax;
    opacity: 0.22;
    animation-delay: -3s;
  }
  .grid-mask {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
        rgba(255, 255, 255, 0.035) 1px,
        transparent 1px
      ),
      linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
  }

  @keyframes float {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    50% {
      transform: translate(3vmax, -2vmax) scale(1.1);
    }
  }

  /* ---------- 返回栏 ---------- */
  > .bread {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    height: 64px;
    padding: 0 28px;
    font-size: 16px;
    color: rgba(238, 241, 255, 0.75);
    cursor: pointer;
    user-select: none;
    transition: color 0.2s;
    .back-arrow {
      font-size: 26px;
      line-height: 1;
      margin-right: 6px;
      transition: transform 0.2s;
    }
    &:hover {
      color: #fff;
      .back-arrow {
        transform: translateX(-4px);
      }
    }
  }

  .game-stage {
    position: relative;
    z-index: 1;
    height: calc(100% - 64px);
  }

  /* ---------- 开始页 ---------- */
  .step1 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;

    .start-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px 64px 40px;
      border-radius: 28px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(18px);
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
      animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .start-badge {
      padding: 5px 16px;
      border-radius: 999px;
      font-size: 12px;
      letter-spacing: 2px;
      color: #c9d2ff;
      background: rgba(89, 139, 255, 0.18);
      border: 1px solid rgba(89, 139, 255, 0.4);
      margin-bottom: 28px;
    }
    .start-logo {
      position: relative;
      width: 180px;
      height: 180px;
      margin-bottom: 28px;
      img {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        border-radius: 24px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
      }
      .logo-ring {
        position: absolute;
        inset: -14px;
        border-radius: 30px;
        border: 2px dashed rgba(255, 255, 255, 0.25);
        animation: spin 14s linear infinite;
      }
    }
    .start-title {
      font-size: 44px;
      font-weight: 800;
      letter-spacing: 6px;
      margin: 10px 0;
      background: linear-gradient(90deg, $tile-0, $tile-2, $tile-1, $tile-3);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      line-height: 44px;
    }
    .start-sub {
      margin: 0 0 32px;
      font-size: 17px;
      color: rgba(238, 241, 255, 0.7);
    }
    .start-hint {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 22px;
      border-radius: 999px;
      font-size: 15px;
      color: #dfe6ff;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.14);
      .pulse-dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: $tile-1;
        box-shadow: 0 0 0 0 rgba(129, 235, 0, 0.6);
        animation: pulse 1.6s infinite;
      }
    }
  }

  @keyframes cardIn {
    from {
      opacity: 0;
      transform: translateY(24px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(129, 235, 0, 0.55);
    }
    70% {
      box-shadow: 0 0 0 12px rgba(129, 235, 0, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(129, 235, 0, 0);
    }
  }

  /* ---------- 游戏页 ---------- */
  .step2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 18px 24px 28px;
    box-sizing: border-box;
  }

  .top-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 28px;
    margin-bottom: 22px;
    flex-shrink: 0;
  }
  .stat-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 20px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.14);
    backdrop-filter: blur(10px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
    .stat-icon {
      font-size: 16px;
      color: $tile-2;
    }
    .stat-label {
      font-size: 14px;
      color: rgba(238, 241, 255, 0.65);
    }
    .stat-value {
      font-size: 22px;
      font-weight: 700;
      color: #fff;
      font-variant-numeric: tabular-nums;
      small {
        font-size: 13px;
        font-weight: 400;
        margin-left: 2px;
        color: rgba(238, 241, 255, 0.6);
      }
    }
  }
  .game-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 4px;
    color: #fff;
    .title-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: $tile-3;
      box-shadow: 0 0 8px $tile-3;
    }
  }

  .board-wrap {
    flex: 1;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    justify-items: center;
    gap: 28px;
    min-height: 0;
  }
  .grid-spacer {
    width: 0;
  }

  /* 棋盘 */
  .pane {
    position: relative;
    width: var(--board-size);
    height: var(--board-size);
    border-radius: 18px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.16);
    backdrop-filter: blur(14px);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.2);
    .pane-glow {
      position: absolute;
      inset: -2px;
      border-radius: 20px;
      background: linear-gradient(
        135deg,
        rgba(255, 107, 107, 0.4),
        rgba(129, 235, 0, 0.4),
        rgba(255, 225, 76, 0.4),
        rgba(89, 139, 255, 0.4)
      );
      filter: blur(22px);
      opacity: 0.35;
      z-index: -1;
    }
  }
  .tile-cont {
    position: absolute;
    inset: 10px;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(12, 1fr);
    border-radius: 10px;
    overflow: hidden;
  }
  .tile {
    position: relative;
    width: 100%;
    height: 100%;
    transition: background-color 0.18s ease, box-shadow 0.15s ease,
      transform 0.15s ease;
    box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.35),
      inset -1px -1px 0 rgba(0, 0, 0, 0.12);
    &.tile-0 {
      background-color: $tile-0;
    }
    &.tile-1 {
      background-color: $tile-1;
    }
    &.tile-2 {
      background-color: $tile-2;
    }
    &.tile-3 {
      background-color: $tile-3;
    }
    &.tile-hot {
      z-index: 2;
      box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.95),
        inset 0 0 12px rgba(255, 255, 255, 0.6),
        0 0 14px rgba(255, 255, 255, 0.55);
      filter: brightness(1.12);
    }
  }
  .dot-cont {
    position: absolute;
    inset: 10px;
    pointer-events: none;
    .dot {
      position: absolute;
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: 2px solid #fff;
      color: #fff;
      font-size: 16px;
      line-height: 1;
      cursor: pointer;
      pointer-events: auto;
      background: radial-gradient(circle at 35% 30%, #6fb8ff, $tile-3 70%);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.45),
        0 0 0 1px rgba(89, 139, 255, 0.6);
      transform: translate(-50%, -50%);
      transition: transform 0.18s ease, box-shadow 0.18s ease,
        background 0.2s ease;
      user-select: none;
      &:hover {
        transform: translate(-50%, -50%) scale(1.3) rotate(90deg);
        background: radial-gradient(circle at 35% 30%, #ffe98a, #ffb846 70%);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5),
          0 0 14px rgba(255, 225, 76, 0.8);
        z-index: 5;
      }
      &:active {
        transform: translate(-50%, -50%) scale(1.12);
      }
    }
  }

  /* 右侧面板 */
  .side-panel {
    width: var(--panel-w);
    display: flex;
    flex-direction: column;
    gap: 18px;
    justify-self: start;
  }
  .panel-card {
    border-radius: 18px;
    padding: 20px 22px;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.13);
    backdrop-filter: blur(14px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.32);
  }
  .rules-card {
    h3 {
      margin: 0 0 12px;
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
      &::before {
        content: "";
        width: 4px;
        height: 18px;
        border-radius: 2px;
        background: linear-gradient($tile-2, $tile-3);
      }
    }
    p {
      margin: 0;
      font-size: 14px;
      line-height: 1.8;
      color: rgba(238, 241, 255, 0.78);
      strong {
        color: $tile-2;
      }
    }
    .rules-tip {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 14px;
      padding: 8px 12px;
      border-radius: 10px;
      font-size: 12.5px;
      color: rgba(238, 241, 255, 0.7);
      background: rgba(89, 139, 255, 0.12);
      .tip-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: $tile-1;
        flex-shrink: 0;
      }
    }
  }
  .btns-card {
    display: flex;
    flex-direction: column;
    gap: 14px;
    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 54px;
      border-radius: 14px;
      font-size: 19px;
      font-weight: 600;
      color: #fff;
      cursor: pointer;
      user-select: none;
      transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      .btn-icon {
        font-size: 22px;
      }
      &:hover {
        transform: translateY(-2px);
        filter: brightness(1.08);
      }
      &:active {
        transform: translateY(0);
      }
    }
    .btn-reset {
      background: linear-gradient(135deg, #ffc36d, #ff9d2e);
      box-shadow: 0 8px 20px rgba(255, 157, 46, 0.35);
    }
    .btn-shuffle {
      background: linear-gradient(135deg, #7aa2ff, #4a72f0);
      box-shadow: 0 8px 20px rgba(74, 114, 240, 0.4);
    }
  }

  /* ---------- 通关弹窗 ---------- */
  .modal-mask {
    position: absolute;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(8, 10, 28, 0.65);
    backdrop-filter: blur(6px);
    animation: fadeIn 0.3s ease;
  }
  .modal-card {
    position: relative;
    width: 420px;
    max-width: 86vw;
    padding: 56px 40px 32px;
    border-radius: 24px;
    text-align: center;
    background: linear-gradient(160deg, #fff7e6 0%, #ffe9c2 100%);
    border: 3px solid #ff7a59;
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55),
      inset 0 2px 0 rgba(255, 255, 255, 0.8);
    animation: modalIn 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    box-sizing: border-box;
  }
  .modal-stars {
    position: absolute;
    top: -34px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    span {
      font-size: 40px;
      color: #ffc531;
      text-shadow: 0 3px 0 #d98a18, 0 5px 10px rgba(0, 0, 0, 0.35);
      animation: starPop 0.6s cubic-bezier(0.22, 1, 0.36, 1) backwards;
      &:nth-child(2) {
        animation-delay: 0.15s;
        font-size: 48px;
      }
      &:nth-child(3) {
        animation-delay: 0.3s;
      }
    }
  }
  .modal-title {
    margin: 0 0 18px;
    font-size: 30px;
    font-weight: 800;
    letter-spacing: 4px;
    color: #e8532f;
    text-shadow: 0 2px 0 rgba(255, 255, 255, 0.7);
  }
  .modal-body {
    font-size: 18px;
    line-height: 2;
    color: #6b3e2a;
    p {
      margin: 0;
    }
  }
  .modal-footer {
    margin-top: 18px;
    font-size: 13px;
    color: rgba(107, 62, 42, 0.65);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes modalIn {
    from {
      opacity: 0;
      transform: scale(0.8) translateY(20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  @keyframes starPop {
    from {
      opacity: 0;
      transform: translateY(14px) scale(0.3) rotate(-30deg);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1) rotate(0);
    }
  }

  /* ---------- 响应式 ---------- */
  @media (max-width: 1100px) {
    .board-wrap {
      grid-template-columns: 1fr;
      gap: 18px;
      align-content: center;
    }
    .grid-spacer {
      display: none;
    }
    .side-panel {
      width: min(520px, 90%);
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      .panel-card {
        flex: 1 1 220px;
      }
    }
  }
  @media (max-height: 820px) {
    .game8-root {
      --board-size: min(600px, 66vmin);
    }
    .step2 {
      padding-top: 10px;
    }
    .top-bar {
      margin-bottom: 14px;
    }
  }
}
</style>
