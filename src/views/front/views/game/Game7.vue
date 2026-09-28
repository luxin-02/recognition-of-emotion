<template>
  <div class="lights-page">
    <!-- 背景装饰层 -->
    <div class="bg-layer">
      <div class="bg-grid"></div>
      <div class="bg-glow glow-1"></div>
      <div class="bg-glow glow-2"></div>
      <div class="bg-glow glow-3"></div>
      <span
        v-for="p in particles"
        :key="'p'+p.id"
        class="particle"
        :style="{ left: p.left+'%', top: p.top+'%', animationDelay: p.delay+'s', animationDuration: p.dur+'s', width: p.size+'px', height: p.size+'px' }"
      ></span>
    </div>

    <!-- 顶部导航 -->
    <div class="page-header">
      <div class="back-btn" @click="$router.go(-1)">
        <span class="back-arrow">‹</span>
        <span>返回</span>
      </div>
      <div class="header-title" v-if="curStatus == 2">
        <span class="title-icon">⚡</span> 板块迭代
      </div>
      <div class="header-right"></div>
    </div>

    <div class="page-body">
      <!-- 开始界面 -->
      <div v-if="curStatus == 1" class="start-screen" @dblclick="start()">
        <div class="start-card">
          <div class="start-badge">NEON MATRIX</div>
          <div class="start-img-wrap">
            <img src="@/assets/images/game/game7/start.png" alt="">
            <div class="start-ring"></div>
            <div class="start-ring r2"></div>
          </div>
          <h2>板块迭代</h2>
          <p class="start-sub">点亮所有能量块，激活霓虹矩阵</p>
          <div class="start-features">
            <span><i>🎯</i>6 关挑战</span>
            <span><i>💡</i>智能提示</span>
            <span><i>⭐</i>三星评价</span>
          </div>
          <div class="start-action">
            <span class="pulse-dot"></span>
            双击任意位置开始
          </div>
        </div>
      </div>

      <!-- 游戏界面 -->
      <div v-else class="game-screen">
        <!-- 状态栏 -->
        <div class="status-bar">
          <div class="status-chip chip-level">
            <span class="chip-icon">🗺️</span>
            <span class="chip-label">关卡</span>
            <span class="chip-value">{{ level }}<em>/{{ totalLevels }}</em></span>
          </div>
          <div class="status-chip chip-steps">
            <span class="chip-icon">👣</span>
            <span class="chip-label">步数</span>
            <span class="chip-value">{{ steps }}<em>/{{ par }}</em></span>
          </div>
          <div class="status-chip chip-time">
            <span class="chip-icon">⏱️</span>
            <span class="chip-label">用时</span>
            <span class="chip-value">{{ time }}<em>s</em></span>
          </div>
          <div class="status-chip chip-hint">
            <span class="chip-icon">💡</span>
            <span class="chip-label">提示</span>
            <span class="chip-value">{{ hintsLeft }}<em>次</em></span>
          </div>
        </div>

        <!-- 关卡进度点 -->
        <div class="level-dots">
          <span v-for="n in totalLevels" :key="n" class="dot" :class="{ active: n===level, done: n<level }">
            <span v-if="n<level" class="dot-star">⭐</span>
            <span v-else>{{ n }}</span>
          </span>
        </div>

        <!-- 主游戏区 -->
        <div class="play-area">
          <!-- 棋盘 -->
          <div class="board-panel">
            <div class="board-frame" :style="frameStyle">
              <div class="board" :style="boardStyle">
                <div
                  v-for="(item, key) in list"
                  :key="key"
                  class="cell"
                  :class="{
                    'cell-on': item === 1,
                    'cell-off': item === 0,
                    'cell-hint': hintCell === key,
                    'cell-pop': popCell === key
                  }"
                  :style="cellStyle"
                  @click="handleCurrentIndex(key)"
                >
                  <span class="cell-inner"></span>
                  <span v-if="hintCell === key" class="hint-pulse"></span>
                </div>
              </div>
            </div>
            <div class="board-legend">
              <span class="legend-item"><i class="legend-dot d-on"></i>已点亮</span>
              <span class="legend-item"><i class="legend-dot d-off"></i>未点亮</span>
              <span class="legend-item"><i class="legend-dot d-hint"></i>提示位置</span>
            </div>
          </div>

          <!-- 右侧控制面板 -->
          <div class="control-panel">
            <div class="info-card rules-card">
              <h3>📜 游戏规则</h3>
              <p>点击一个能量块，它和<strong>上下左右相邻</strong>的能量块会同时切换状态（点亮↔熄灭）。把所有能量块全部点亮即可通关！</p>
            </div>

            <div class="info-card action-card">
              <h3>🎮 操作</h3>
              <div class="btn-group">
                <button class="game-btn btn-hint" :disabled="hintsLeft<=0 || !isPlaying" @click="useHint">
                  <span>💡</span> 使用提示
                </button>
                <button class="game-btn btn-reset" :disabled="!isPlaying" @click="resetLevel">
                  <span>🔄</span> 重置本关
                </button>
              </div>
            </div>

            <div class="info-card star-card">
              <h3>⭐ 星级标准</h3>
              <div class="star-rows">
                <div class="star-row">
                  <span class="star-ico">⭐⭐⭐</span>
                  <span class="star-txt">步数 ≤ {{ par }}</span>
                </div>
                <div class="star-row">
                  <span class="star-ico">⭐⭐</span>
                  <span class="star-txt">步数 ≤ {{ Math.ceil(par * 1.5) }}</span>
                </div>
                <div class="star-row">
                  <span class="star-ico">⭐</span>
                  <span class="star-txt">通关即可</span>
                </div>
              </div>
            </div>

            <div class="info-card best-card" v-if="bestRecords[level]">
              <h3>🏆 本关最佳</h3>
              <div class="best-row">
                <span>步数</span>
                <b>{{ bestRecords[level].steps }}</b>
              </div>
              <div class="best-row">
                <span>用时</span>
                <b>{{ bestRecords[level].time }}s</b>
              </div>
              <div class="best-row">
                <span>星级</span>
                <b>{{ '⭐'.repeat(bestRecords[level].stars) }}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 通关弹窗 -->
    <div class="modal-mask" v-if="isVisiable">
      <div class="modal-card">
        <div class="modal-stars-row">
          <span v-for="n in 3" :key="n" class="m-star" :class="{ lit: n <= starRating }">⭐</span>
        </div>
        <h2 class="modal-title">{{ modalTitle }}</h2>
        <div class="modal-body" v-html="strText"></div>
        <div class="modal-btns" v-if="!isReporting">
          <button class="modal-btn btn-replay" @click="replayLevel">再玩一次</button>
          <button v-if="level < totalLevels" class="modal-btn btn-next-level" @click="nextLevel">下一关</button>
          <button v-else class="modal-btn btn-finish" @click="finishGame">完成</button>
        </div>
        <div class="modal-loading" v-else>正在保存成绩...</div>
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
      isVisiable: false,
      isReporting: false,
      strText: "",
      modalTitle: "恭喜通关",
      starRating: 3,
      time: 0,

      list: [],
      level: 1,
      totalLevels: 6,
      steps: 0,
      par: 0,
      isPlaying: false,
      hintsLeft: 15,
      hintCell: -1,
      popCell: -1,

      // 解谜辅助：当前还需要点击的格子（0/1）
      solutionMap: [],
      // 每关最佳记录
      bestRecords: {},
      // 累计
      totalTime: 0,

      // 背景粒子
      particles: [],
    }
  },
  computed: {
    gridSize() {
      // 每关的网格维度
      const sizes = [3, 3, 4, 4, 5, 5]
      return sizes[this.level - 1] || 5
    },
    boardPx() {
      // 棋盘像素尺寸，根据网格大小自适应
      const n = this.gridSize
      if (n <= 3) return 450
      if (n === 4) return 480
      return 520
    },
    cellPx() {
      return (this.boardPx - (this.gridSize - 1) * 10) / this.gridSize
    },
    boardStyle() {
      return {
        width: this.boardPx + 'px',
        height: this.boardPx + 'px',
        gridTemplateColumns: `repeat(${this.gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${this.gridSize}, 1fr)`,
      }
    },
    frameStyle() {
      return {
        padding: '14px',
        borderRadius: '22px',
      }
    },
    cellStyle() {
      return {
        borderRadius: Math.max(10, this.cellPx * 0.18) + 'px',
      }
    },
  },
  methods: {
    start() {
      this.curStatus = 2
      this.level = 1
      this.totalTime = 0
      this.hintsLeft = 15
      this.initParticles()
      this.initLevel()
    },
    initParticles() {
      const arr = []
      for (let i = 0; i < 24; i++) {
        arr.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 8,
          dur: 6 + Math.random() * 8,
          size: 2 + Math.random() * 4,
        })
      }
      this.particles = arr
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
    /**
     * 初始化当前关卡：从全亮状态出发，随机点击若干次保证有解
     */
    initLevel() {
      this.clearTimer()
      this.steps = 0
      this.time = 0
      this.isVisiable = false
      this.isReporting = false
      this.hintCell = -1
      this.isPlaying = true

      const n = this.gridSize
      const total = n * n
      // 全亮（1=已点亮）为目标状态
      this.list = new Array(total).fill(1)
      // 解题映射：0 表示该格不需要再点
      this.solutionMap = new Array(total).fill(0)

      // 根据关卡决定打乱次数
      const scrambleCounts = [3, 5, 6, 8, 10, 12]
      const scrambleCount = scrambleCounts[this.level - 1] || 10

      // 随机点击 scrambleCount 次（不重复连续点同一格）
      let lastPick = -1
      for (let i = 0; i < scrambleCount; i++) {
        let idx
        do {
          idx = Math.floor(Math.random() * total)
        } while (idx === lastPick && total > 1)
        lastPick = idx
        this.toggleAt(idx, false)
        // 记录到解题映射
        this.solutionMap[idx] = this.solutionMap[idx] === 1 ? 0 : 1
      }

      // 极小概率打乱后仍为全亮，重新生成一次
      if (this.list.every((v) => v === 1)) {
        this.list = new Array(total).fill(1)
        this.solutionMap = new Array(total).fill(0)
        lastPick = -1
        for (let i = 0; i < scrambleCount; i++) {
          let idx
          do {
            idx = Math.floor(Math.random() * total)
          } while (idx === lastPick && total > 1)
          lastPick = idx
          this.toggleAt(idx, false)
          this.solutionMap[idx] = this.solutionMap[idx] === 1 ? 0 : 1
        }
      }

      // par = 打乱时实际涉及的不同格子数
      this.par = this.solutionMap.reduce((a, b) => a + b, 0)
      if (this.par < 1) this.par = 1

      this.countTime()
    },
    /**
     * 切换某个格子及其相邻格子的状态
     */
    toggleAt(index, animate) {
      const n = this.gridSize
      const targets = [index]
      const row = Math.floor(index / n)
      const col = index % n
      if (row > 0) targets.push(index - n)
      if (row < n - 1) targets.push(index + n)
      if (col > 0) targets.push(index - 1)
      if (col < n - 1) targets.push(index + 1)

      targets.forEach((t) => {
        this.$set(this.list, t, this.list[t] === 1 ? 0 : 1)
      })

      if (animate) {
        this.popCell = index
        setTimeout(() => {
          if (this.popCell === index) this.popCell = -1
        }, 300)
      }
    },
    handleCurrentIndex(currentIndex) {
      if (!this.isPlaying) return
      this.steps++
      this.hintCell = -1
      this.toggleAt(currentIndex, true)

      // 同步解题映射：玩家点击的格子在解集中则移除，否则加入
      this.solutionMap[currentIndex] = this.solutionMap[currentIndex] === 1 ? 0 : 1

      this.checkList()
    },
    checkList() {
      const isSuccess = this.list.every((v) => v === 1)
      if (isSuccess) {
        this.isPlaying = false
        this.clearTimer()
        this.totalTime += this.time

        // 星级评定
        let stars = 1
        if (this.steps <= this.par) stars = 3
        else if (this.steps <= Math.ceil(this.par * 1.5)) stars = 2
        this.starRating = stars

        // 更新最佳记录
        const prev = this.bestRecords[this.level]
        if (!prev || this.steps < prev.steps || (this.steps === prev.steps && stars > prev.stars)) {
          this.$set(this.bestRecords, this.level, {
            steps: this.steps,
            time: this.time,
            stars: stars,
          })
        }

        if (this.level >= this.totalLevels) {
          this.modalTitle = "全部通关"
          this.strText = `
            <div class="result-stats">
              <div class="rs-row"><span>总用时</span><b>${this.totalTime} 秒</b></div>
              <div class="rs-row"><span>最终关卡</span><b>${this.totalLevels} / ${this.totalLevels}</b></div>
              <div class="rs-row"><span>剩余提示</span><b>${this.hintsLeft} 次</b></div>
            </div>
            <p class="rs-tip">恭喜你点亮了整个霓虹矩阵！</p>
          `
        } else {
          this.modalTitle = "恭喜通关"
          this.strText = `
            <div class="result-stats">
              <div class="rs-row"><span>关卡</span><b>${this.level} / ${this.totalLevels}</b></div>
              <div class="rs-row"><span>用时</span><b>${this.time} 秒</b></div>
              <div class="rs-row"><span>步数</span><b>${this.steps} 步</b></div>
              <div class="rs-row"><span>参考步数</span><b>${this.par} 步</b></div>
            </div>
            <p class="rs-tip">${stars === 3 ? '完美！步数控制得非常精准！' : stars === 2 ? '不错！再试试更少步数拿三星吧～' : '通关啦！挑战更少步数获得更高星级！'}</p>
          `
        }
        this.isVisiable = true
      }
    },
    useHint() {
      if (this.hintsLeft <= 0 || !this.isPlaying) return
      // 找到一个还需要点击的格子
      const candidates = []
      for (let i = 0; i < this.solutionMap.length; i++) {
        if (this.solutionMap[i] === 1) candidates.push(i)
      }
      if (candidates.length === 0) return
      this.hintCell = candidates[Math.floor(Math.random() * candidates.length)]
      this.hintsLeft--
    },
    resetLevel() {
      this.initLevel()
    },
    replayLevel() {
      this.isVisiable = false
      this.initLevel()
    },
    nextLevel() {
      this.isVisiable = false
      this.level++
      this.initLevel()
    },
    async finishGame() {
      this.isReporting = true
      try {
        await reportApiAdd({
          cat_name: "心理训练",
          game_name: "板块迭代",
          score: 100,
          seconds: this.totalTime || this.time,
        }).then(({ data }) => {
          if (data.code == this.$global.successCode) {
            this.$router.go(-1)
          } else {
            this.isReporting = false
            this.$toast("", "保存失败，请重试")
          }
        })
      } catch (e) {
        this.isReporting = false
        this.$toast("", "网络异常，请重试")
      }
    },
  },
  mounted() {
    this.initParticles()
  },
  beforeDestroy() {
    this.clearTimer()
  },
  destroyed() {
    this.clearTimer()
  },
}
</script>

<style lang="scss" scoped>
/* ============ 页面背景：霓虹矩阵 ============ */
.lights-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(160deg, #0a0e27 0%, #131a3e 35%, #1a1040 65%, #0d1b3a 100%);
  font-family: "ziyuanyuanti400W", "Microsoft YaHei", sans-serif;
}

.bg-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

/* 网格背景 */
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 229, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 80%);
}

.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}
.glow-1 {
  width: 420px; height: 420px;
  background: #00e5ff;
  top: -120px; left: -80px;
  opacity: 0.15;
}
.glow-2 {
  width: 380px; height: 380px;
  background: #ff3d71;
  bottom: -140px; right: -60px;
  opacity: 0.13;
}
.glow-3 {
  width: 340px; height: 340px;
  background: #7c5cfc;
  top: 45%; right: 25%;
  opacity: 0.12;
}

/* 粒子 */
.particle {
  position: absolute;
  border-radius: 50%;
  background: #00e5ff;
  box-shadow: 0 0 8px 2px rgba(0, 229, 255, 0.6);
  animation: particleFloat linear infinite;
  opacity: 0;
}
@keyframes particleFloat {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 0.8; }
  50% { transform: translateY(-40vh) translateX(15px); }
  90% { opacity: 0.6; }
  100% { transform: translateY(-80vh) translateX(-10px); opacity: 0; }
}

/* ============ 顶部导航 ============ */
.page-header {
  position: relative;
  z-index: 2;
  height: 60px;
  padding: 0 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e9f5ff;
  font-size: 17px;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: all 0.25s;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-3px);
  }
  .back-arrow {
    font-size: 26px;
    line-height: 1;
    font-weight: bold;
  }
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  color: #e9f5ff;
  letter-spacing: 3px;
  text-shadow: 0 2px 12px rgba(0, 229, 255, 0.5);
  .title-icon {
    margin-right: 6px;
  }
}

.header-right {
  width: 90px;
}

/* ============ 主体容器 ============ */
.page-body {
  position: relative;
  z-index: 2;
  height: calc(100% - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ============ 开始界面 ============ */
.start-screen {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.start-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 68px 36px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(0, 229, 255, 0.25);
  backdrop-filter: blur(16px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 229, 255, 0.1);
  animation: cardFloat 4s ease-in-out infinite;
}

@keyframes cardFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.start-badge {
  padding: 5px 20px;
  border-radius: 14px;
  background: linear-gradient(135deg, #00e5ff, #7c5cfc);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 3px;
  margin-bottom: 20px;
  box-shadow: 0 4px 14px rgba(0, 229, 255, 0.4);
}

.start-img-wrap {
  position: relative;
  width: 190px;
  height: 190px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 229, 255, 0.2), rgba(124, 92, 252, 0.08));
  margin-bottom: 24px;
  img {
    width: 140px;
    height: 140px;
    border-radius: 24px;
    filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.4));
    position: relative;
    z-index: 2;
  }
}
.start-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(0, 229, 255, 0.4);
  animation: ringPulse 2.5s ease-out infinite;
}
.start-ring.r2 {
  animation-delay: 1.2s;
  border-color: rgba(124, 92, 252, 0.4);
}
@keyframes ringPulse {
  0% { transform: scale(0.85); opacity: 1; }
  100% { transform: scale(1.3); opacity: 0; }
}

.start-card h2 {
  font-size: 44px;
  font-weight: 700;
  color: #f1f0ff;
  letter-spacing: 8px;
  margin: 0 0 10px;
  text-shadow: 0 4px 16px rgba(0, 229, 255, 0.5);
}

.start-sub {
  font-size: 18px;
  color: #b8c5ff;
  margin: 0 0 22px;
  letter-spacing: 2px;
}

.start-features {
  display: flex;
  gap: 14px;
  margin-bottom: 26px;
  span {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 7px 16px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    font-size: 15px;
    color: #d4d9ff;
    i {
      font-style: normal;
    }
  }
}

.start-action {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #8fe9ff;
  letter-spacing: 1px;
}
.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00e5ff;
  box-shadow: 0 0 8px 2px rgba(0, 229, 255, 0.7);
  animation: pulseDot 1.5s ease-in-out infinite;
}
@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
}

/* ============ 游戏界面 ============ */
.game-screen {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 40px 20px;
  box-sizing: border-box;
}

/* 状态栏 */
.status-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 14px;
}

.status-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  .chip-icon {
    font-size: 20px;
  }
  .chip-label {
    font-size: 14px;
    color: #9fa8da;
  }
  .chip-value {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    em {
      font-size: 13px;
      font-style: normal;
      color: #8a93c9;
      margin-left: 2px;
    }
  }
  &.chip-level .chip-value { color: #ffe066; }
  &.chip-steps .chip-value { color: #84ffff; }
  &.chip-time .chip-value { color: #ffb74d; }
  &.chip-hint .chip-value { color: #ce93d8; }
}

/* 关卡进度点 */
.level-dots {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  .dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.08);
    border: 2px solid rgba(255, 255, 255, 0.2);
    color: #8a93c9;
    transition: all 0.3s;
    .dot-star {
      font-size: 14px;
    }
    &.done {
      background: rgba(255, 224, 102, 0.15);
      border-color: rgba(255, 224, 102, 0.5);
      color: #ffe066;
    }
    &.active {
      background: linear-gradient(135deg, #00e5ff, #7c5cfc);
      border-color: transparent;
      color: #fff;
      box-shadow: 0 0 14px rgba(0, 229, 255, 0.5);
      transform: scale(1.15);
    }
  }
}

/* 主游戏区 */
.play-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 36px;
  flex: 1;
  min-height: 0;
}

/* 棋盘 */
.board-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.board-frame {
  background: linear-gradient(145deg, rgba(20, 28, 60, 0.9), rgba(15, 20, 45, 0.95));
  border: 2px solid rgba(0, 229, 255, 0.2);
  box-shadow:
    0 0 0 4px rgba(0, 229, 255, 0.06),
    0 20px 50px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.board {
  display: grid;
  gap: 10px;
}

.cell {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s, box-shadow 0.2s;
  user-select: none;

  .cell-inner {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    transition: all 0.25s ease;
  }

  /* 未点亮 */
  &.cell-off .cell-inner {
    background: linear-gradient(145deg, #1a2150, #0f1535);
    border: 1px solid rgba(99, 120, 200, 0.25);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4);
  }
  &.cell-off:hover .cell-inner {
    border-color: rgba(0, 229, 255, 0.4);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4), 0 0 12px rgba(0, 229, 255, 0.2);
  }

  /* 已点亮 */
  &.cell-on .cell-inner {
    background: linear-gradient(145deg, #ffe066, #ffb300);
    border: 1px solid rgba(255, 224, 102, 0.8);
    box-shadow:
      0 0 18px rgba(255, 224, 102, 0.5),
      0 0 36px rgba(255, 179, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }
  &.cell-on:hover .cell-inner {
    box-shadow:
      0 0 24px rgba(255, 224, 102, 0.7),
      0 0 48px rgba(255, 179, 0, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }

  /* 点击弹动 */
  &.cell-pop {
    animation: cellPop 0.3s ease;
  }

  /* 提示高亮 */
  &.cell-hint .cell-inner {
    border-color: #ff3d71 !important;
    box-shadow:
      0 0 20px rgba(255, 61, 113, 0.6),
      0 0 40px rgba(255, 61, 113, 0.3),
      inset 0 0 12px rgba(255, 61, 113, 0.2) !important;
    animation: hintBlink 1s ease-in-out infinite;
  }
  .hint-pulse {
    position: absolute;
    inset: -4px;
    border-radius: inherit;
    border: 2px solid rgba(255, 61, 113, 0.6);
    animation: hintPulse 1.2s ease-out infinite;
    pointer-events: none;
  }

  &:active {
    transform: scale(0.92);
  }
}

@keyframes cellPop {
  0% { transform: scale(1); }
  40% { transform: scale(0.88); }
  100% { transform: scale(1); }
}
@keyframes hintBlink {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.3); }
}
@keyframes hintPulse {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.25); opacity: 0; }
}

.board-legend {
  display: flex;
  gap: 20px;
  margin-top: 16px;
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #9fa8da;
  }
  .legend-dot {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    display: inline-block;
    &.d-on {
      background: linear-gradient(145deg, #ffe066, #ffb300);
      box-shadow: 0 0 8px rgba(255, 224, 102, 0.5);
    }
    &.d-off {
      background: linear-gradient(145deg, #1a2150, #0f1535);
      border: 1px solid rgba(99, 120, 200, 0.3);
    }
    &.d-hint {
      background: rgba(255, 61, 113, 0.3);
      border: 1px solid #ff3d71;
      box-shadow: 0 0 8px rgba(255, 61, 113, 0.5);
    }
  }
}

/* 右侧控制面板 */
.control-panel {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-card {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 18px;
  padding: 16px 18px;
  backdrop-filter: blur(10px);
  h3 {
    margin: 0 0 10px;
    font-size: 17px;
    font-weight: 700;
    color: #e9f5ff;
  }
  p {
    margin: 0;
    font-size: 14px;
    color: #b8c5ff;
    line-height: 1.7;
    strong {
      color: #84ffff;
    }
  }
}

.btn-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.game-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 42px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}
.btn-hint {
  background: linear-gradient(135deg, #ce93d8, #7c5cfc);
  color: #fff;
  box-shadow: 0 4px 14px rgba(124, 92, 252, 0.35);
  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 92, 252, 0.5);
  }
}
.btn-reset {
  background: rgba(255, 255, 255, 0.12);
  color: #d4d9ff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  &:not(:disabled):hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
}

.star-rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.star-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #b8c5ff;
  .star-ico {
    letter-spacing: 1px;
  }
}

.best-card {
  border-color: rgba(255, 224, 102, 0.25);
  h3 {
    color: #ffe066;
  }
}
.best-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 14px;
  color: #b8c5ff;
  b {
    color: #ffe066;
    font-size: 16px;
  }
}

/* ============ 通关弹窗 ============ */
.modal-mask {
  position: absolute;
  inset: 0;
  z-index: 99;
  background: rgba(10, 8, 30, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-card {
  position: relative;
  width: 440px;
  max-width: 90vw;
  padding: 36px 40px 32px;
  border-radius: 26px;
  background: linear-gradient(160deg, #1e2a5e 0%, #141b42 100%);
  border: 2px solid rgba(0, 229, 255, 0.4);
  box-shadow:
    0 0 0 4px rgba(0, 229, 255, 0.1),
    0 24px 60px rgba(0, 0, 0, 0.6),
    0 0 50px rgba(0, 229, 255, 0.2);
  text-align: center;
  box-sizing: border-box;
  animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: visible;
}

@keyframes popIn {
  from { transform: scale(0.7); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-stars-row {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
  .m-star {
    font-size: 42px;
    display: inline-block;
    filter: grayscale(1) opacity(0.3);
    transition: all 0.3s;
    &.lit {
      filter: none;
      animation: starPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  }
}

@keyframes starPop {
  0% { transform: scale(0) rotate(-30deg); }
  100% { transform: scale(1) rotate(0); }
}

.modal-title {
  margin: 0 0 20px;
  font-size: 30px;
  font-weight: 700;
  color: #ffe066;
  letter-spacing: 4px;
  line-height: 1.4;
  text-shadow: 0 2px 12px rgba(255, 224, 102, 0.4);
  white-space: nowrap;
  padding: 0 8px;
  box-sizing: border-box;
  overflow: visible;
  text-overflow: clip;
}

.modal-body {
  font-size: 18px;
  color: #d4d9ff;
  line-height: 1.7;
  p { margin: 6px 0; }
}

.result-stats {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 14px 18px;
  margin-bottom: 14px;
  .rs-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    font-size: 16px;
    color: #b8c5ff;
    b {
      color: #84ffff;
      font-size: 18px;
    }
  }
}
.rs-tip {
  font-size: 15px;
  color: #9fa8da;
  margin: 8px 0 0;
}

.modal-btns {
  display: flex;
  gap: 12px;
  margin-top: 22px;
}

.modal-btn {
  flex: 1;
  height: 46px;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.btn-replay {
  background: rgba(255, 255, 255, 0.12);
  color: #d4d9ff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  &:hover { background: rgba(255, 255, 255, 0.2); }
}
.btn-next-level {
  background: linear-gradient(135deg, #00e5ff, #7c5cfc);
  color: #fff;
  box-shadow: 0 4px 16px rgba(0, 229, 255, 0.4);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 22px rgba(0, 229, 255, 0.55);
  }
}
.btn-finish {
  background: linear-gradient(135deg, #ffe066, #ff9100);
  color: #1a1040;
  box-shadow: 0 4px 16px rgba(255, 224, 102, 0.4);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 22px rgba(255, 224, 102, 0.55);
  }
}

.modal-loading {
  margin-top: 22px;
  font-size: 16px;
  color: #9fa8da;
}
</style>
