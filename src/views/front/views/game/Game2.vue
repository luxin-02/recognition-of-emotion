<template>
  <div class="user-info-box minesweeper-page">
    <!-- 全局背景装饰 -->
    <div class="page-bg">
      <div class="bg-grid"></div>
      <span class="bg-blob blob1"></span>
      <span class="bg-blob blob2"></span>
      <span class="bg-blob blob3"></span>
      <span class="bg-mine bm1">💣</span>
      <span class="bg-mine bm2">💣</span>
      <span class="bg-mine bm3">💣</span>
      <span class="bg-mine bm4">💣</span>
      <span class="bg-mine bm5">✦</span>
      <span class="bg-mine bm6">✦</span>
    </div>

    <div class="bread" @click="$router.go(-1)">
      <span class="back-arrow">
        <svg viewBox="0 0 1024 1024" width="20" height="20">
          <path
            d="M724.977739 942.204298c-10.439442 0-20.875905-3.84524-28.932826-11.542493L270.089435 523.656051c-16.110864-15.397485-16.110864-40.258539 0-55.659008L696.044913 61.000813c16.110864-15.397485 42.230479-15.397485 58.341343 0 16.110864 15.400465 16.110864 40.258539 0 55.659008L356.692313 495.826547l397.693943 379.17589c16.110864 15.397485 16.110864 40.258539 0 55.659008C745.856624 938.359058 735.417181 942.204298 724.977739 942.204298z"
            fill="currentColor"
          ></path>
        </svg>
      </span>
      <span>返回</span>
    </div>

    <div class="page-body">
      <!-- 开始页 -->
      <div v-if="curStatus == 1" class="step1" @dblclick="start()">
        <div class="start-bg-deco">
          <span class="deco-mine m1">💣</span>
          <span class="deco-mine m2">💣</span>
          <span class="deco-mine m3">💣</span>
          <span class="deco-mine m4">💣</span>
          <span class="deco-spark s1">✦</span>
          <span class="deco-spark s2">✦</span>
          <span class="deco-spark s3">✦</span>
        </div>

        <div class="start-card">
          <div class="mine-orb">
            <span class="mine-emoji">💣</span>
            <span class="orb-ring r1"></span>
            <span class="orb-ring r2"></span>
          </div>
          <h1 class="start-title">扫雷大战</h1>
          <p class="start-subtitle">要挑战惊险刺激的扫雷吗？</p>
          <div class="start-hint">
            <span class="hint-dot"></span>
            <span>双击任意位置开始游戏</span>
            <span class="hint-dot"></span>
          </div>
          <div class="start-btn">
            <span>▶ 开始挑战</span>
          </div>
        </div>
      </div>

      <!-- 游戏页 -->
      <div v-else class="step2">
        <div class="stats-bar">
          <div class="stat-card">
            <div class="stat-icon icon-click">👆</div>
            <div class="stat-meta">
              <span class="stat-value">{{ move }}</span>
              <span class="stat-label">点击次数</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon icon-dig">⛏️</div>
            <div class="stat-meta">
              <span class="stat-value">{{ removeBlock }}</span>
              <span class="stat-label">已挖板块</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon icon-bomb">💣</div>
            <div class="stat-meta">
              <span class="stat-value">{{ bombs.length }}</span>
              <span class="stat-label">地雷数量</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon icon-time">⏱️</div>
            <div class="stat-meta">
              <span class="stat-value">{{ time }}<em class="stat-unit">s</em></span>
              <span class="stat-label">已用时间</span>
            </div>
          </div>
        </div>

        <div class="body">
          <div class="left">
            <div class="board-frame">
              <div class="board">
                <div
                  class="tile"
                  v-for="(item, index) in board"
                  :key="index"
                  :data-tile="item.tile"
                  :data-num="item.num"
                  :data-index="item.index"
                  :data-flag="item.flagged"
                  :class="{
                    active: item.checked,
                    'is-bomb': item.checked && item.flagged,
                  }"
                  @click="clickTile(item, 1)"
                >
                  <span
                    v-if="item.checked && item.flagged"
                    class="tile-bomb"
                  >💣</span>
                  <span
                    v-else-if="item.checked && item.num"
                    class="tile-num"
                    :style="{ color: numberColors[item.num - 1] }"
                  >{{ item.num }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="right">
            <div class="rules-card">
              <div class="rules-head">
                <span class="rules-icon">📖</span>
                <span>游戏规则</span>
              </div>
              <div class="rules-body">
                <p>随机选择一个方块点击，会出现以下情况：</p>
                <ul>
                  <li><b class="dot bomb-dot">💣</b> 点击到地雷，则游戏结束。</li>
                  <li><b class="dot blank-dot">⬜</b> 点击到空白，将自动打开周围无雷区域。</li>
                  <li><b class="dot num-dot">①</b> 点击到数字，表示其周围有对应数量的地雷。</li>
                </ul>
                <p class="rules-tip">找出所有安全板块，即可通关！</p>
              </div>
            </div>

            <div class="restart-btn" @click="btnClick()">
              <span class="restart-icon">🔄</span>
              <span>再玩一次</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 结算弹窗 -->
    <div class="open" v-if="isVisible">
      <div class="modal-card" :class="isOver ? 'modal-win' : 'modal-lose'">
        <div class="modal-icon-wrap">
          <span class="modal-icon">{{ isOver ? "🏆" : "💥" }}</span>
          <span class="icon-glow"></span>
        </div>
        <p class="modal-title">{{ isOver ? "恭喜通关" : "游戏结束" }}</p>
        <div class="modal-subtitle">
          {{ isOver ? "你成功排除了所有地雷！" : "很遗憾，你踩到了地雷" }}
        </div>
        <div class="modal-stats" v-html="strText"></div>
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
      step: 0, //交换次数
      timer: null, //定时器
      isVisible: false,
      strText: "",
      time: 0, //时长
      level: 1,
      move: 0,
      size: 10,
      bombFrequency: 0.2,
      bombs: [],
      numbers: [],
      numberColors: [
        "#3498db",
        "#2ecc71",
        "#e74c3c",
        "#9b59b6",
        "#f1c40f",
        "#1abc9c",
        "#34495e",
        "#7f8c8d",
      ],
      gameOver: false,
      board: [],
      removeBlock: 0,
      isOver: false,
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
      this.countTime()
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
    btnClick() {
      this.clearTimer()
      this.start()
      this.isVisible = false
      this.move = 0
      this.time = 0
      this.isOver = false
      this.clear()
    },
    randomSort(arr) {
      arr.sort(function () {
        return Math.random() - 0.5
      })
    },
    clear() {
      this.gameOver = false
      this.board = []
      this.bombs = []
      this.numbers = []
      this.move = 0
      this.removeBlock = 0
      this.setup()
    },
    setup() {
      this.board = Array.from(
        { length: Math.pow(this.size, 2) },
        (item, index) => {
          let y = Math.floor(index / this.size)
          let x = index % this.size
          return {
            tile: `${x},${y}`,
            index: index,
            checked: false,
          }
        },
      )
      this.board.forEach((item, index) => {
        let random_boolean = Math.random() < this.bombFrequency
        let y = Math.floor(index / this.size)
        let x = index % this.size
        if (random_boolean) {
          this.bombs.push(item.tile)
          item.flagged = "💣"
          if (x > 0) this.numbers.push(`${x - 1},${y}`)
          if (x < this.size - 1) this.numbers.push(`${x + 1},${y}`)
          if (y > 0) this.numbers.push(`${x},${y - 1}`)
          if (y < this.size - 1) this.numbers.push(`${x},${y + 1}`)
          if (x > 0 && y > 0) this.numbers.push(`${x - 1},${y - 1}`)
          if (x < this.size - 1 && y < this.size - 1)
            this.numbers.push(`${x + 1},${y + 1}`)
          if (y > 0 && x < this.size - 1) this.numbers.push(`${x + 1},${y - 1}`)
          if (x > 0 && y < this.size - 1) this.numbers.push(`${x - 1},${y + 1}`)
        } else {
          item.flagged = ""
        }
      })
      // console.log(this.bombs)
      this.numbers.forEach((num) => {
        this.board.forEach((item) => {
          if (item.tile == num) {
            if (!item.num) {
              item.num = 0
            }
            item.num += 1
          }
        })
      })
      // console.log(this.board)
    },
    clickTile(item, type) {
      if (this.gameOver) {
        this.$toast("", "请点击按钮才能玩哦！")
        return
      }
      if (item.checked == true) return
      if (this.bombs.includes(item.tile)) {
        if (type == 1) this.move++
        this.endGame(item)
      } else {
        this.removeBlock++
        if (type == 1) this.move++
        let num = item.num
        if (num) {
          item.checked = true
          setTimeout(() => {
            this.checkVictory()
          }, 100)
          return
        }
        // 该块白色，并且周围无雷区域自动打开
        this.checkTile(item)
      }
      item.checked = true
    },
    endGame() {
      this.gameOver = true
      this.board.forEach((item, index) => {
        if (item.flagged == "💣") {
          item.checked = true
          // this.$set(this.board[index], "checked", true);
          // console.log(this.board[index].checked)
        }
      })
      this.clearTimer()
      this.isVisible = true
      this.strText = `
                <p>当前一共有${this.bombs.length}个雷</p>
                <p>您一共点击了${this.move}下！</p>
                <p>挖空了${this.removeBlock}板块!</p>
                <p>花了${this.time}秒!</p>
            `
      setTimeout(async () => {
        await reportApiAdd({
          cat_name: "心理训练",
          game_name: "扫雷大战",
          score: this.removeBlock,
          seconds: this.time,
        }).then(({ data }) => {
          if (data.code == this.$global.successCode) {
            this.$router.go(-1) // 返回上一页
          }
        })
        this.isVisible = false
      }, 5000)
    },
    checkVictory() {
      if (Math.pow(this.size, 2) - this.removeBlock == this.bombs.length) {
        this.isOver = true
        this.gameOver = true
        this.clearTimer()
        this.isVisible = true
        this.strText = `
                    <p>当前一共有${this.bombs.length}个雷</p>
                    <p>您一共点击了${this.move}下！</p>
                    <p>挖空了${this.removeBlock}板块!</p>
                    <p>花了${this.time}秒!</p>
                `
        setTimeout(async () => {
          await reportApiAdd({
            cat_name: "心理训练",
            game_name: "扫雷大战",
            score: 100,
            seconds: this.time,
          }).then(({ data }) => {
            if (data.code == this.$global.successCode) {
              this.$router.go(-1) // 返回上一页
            }
          })

          this.isVisible = false
        }, 5000)
      }
    },
    checkTile(item) {
      let coords = item.tile.split(",")
      let x = parseInt(coords[0])
      let y = parseInt(coords[1])
      setTimeout(() => {
        if (x > 0) {
          this.clickTile(this.board[item.index - 1])
        }
        if (x < this.size - 1) {
          this.clickTile(this.board[item.index + 1])
        }
        if (y > 0) {
          this.clickTile(this.board[item.index - this.size])
        }
        if (y < this.size - 1) {
          this.clickTile(this.board[item.index + this.size])
        }
        if (x > 0 && y > 0) {
          this.clickTile(this.board[item.index - this.size - 1])
        }
        if (x < this.size - 1 && y < this.size - 1) {
          this.clickTile(this.board[item.index + this.size + 1])
        }
        if (y > 0 && x < this.size - 1) {
          this.clickTile(this.board[item.index - this.size + 1])
        }
        if (x > 0 && y < this.size - 1) {
          this.clickTile(this.board[item.index + this.size - 1])
        }
      }, 10)
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.setup()
  },
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
div.user-info-box {
  touch-action: none;
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, #eef2ff 0%, #e3ebff 38%, #f5f0ff 72%, #eef4ff 100%);

  /* 全局背景装饰层 */
  > div.page-bg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;

    .bg-grid {
      position: absolute;
      top: -40px;
      left: -40px;
      right: -40px;
      bottom: -40px;
      background-image: radial-gradient(
        circle,
        rgba(88, 117, 255, 0.13) 1.5px,
        transparent 1.5px
      );
      background-size: 32px 32px;
      mask-image: radial-gradient(ellipse at center, #000 30%, transparent 78%);
      -webkit-mask-image: radial-gradient(
        ellipse at center,
        #000 30%,
        transparent 78%
      );
    }

    .bg-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.55;
    }
    .blob1 {
      width: 480px;
      height: 480px;
      top: -120px;
      left: -100px;
      background: radial-gradient(circle, #8fa8ff 0%, transparent 70%);
      animation: blobFloat 14s ease-in-out infinite;
    }
    .blob2 {
      width: 520px;
      height: 520px;
      bottom: -160px;
      right: -120px;
      background: radial-gradient(circle, #b69cff 0%, transparent 70%);
      animation: blobFloat 18s ease-in-out infinite reverse;
    }
    .blob3 {
      width: 300px;
      height: 300px;
      top: 40%;
      right: 22%;
      background: radial-gradient(circle, #ffd089 0%, transparent 70%);
      opacity: 0.35;
      animation: blobFloat 16s ease-in-out infinite;
      animation-delay: -6s;
    }

    .bg-mine {
      position: absolute;
      opacity: 0.16;
      animation: bgFloat 9s ease-in-out infinite;
    }
    .bm1 { top: 14%; left: 8%; font-size: 40px; animation-delay: 0s; }
    .bm2 { top: 62%; left: 14%; font-size: 32px; animation-delay: -3s; }
    .bm3 { top: 22%; right: 12%; font-size: 36px; animation-delay: -5s; }
    .bm4 { bottom: 12%; right: 8%; font-size: 44px; animation-delay: -1.5s; }
    .bm5 {
      top: 40%; left: 46%;
      font-size: 26px;
      color: #ffb846;
      opacity: 0.4;
      animation-delay: -2s;
    }
    .bm6 {
      top: 75%; right: 38%;
      font-size: 20px;
      color: #7ea0ff;
      opacity: 0.45;
      animation-delay: -7s;
    }
  }

  > div.bread {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 74px;
    line-height: 74px;
    text-align: left;
    font-size: 20px;
    font-weight: normal;
    color: #4a5568;
    display: flex;
    align-items: center;
    padding: 0 10px;
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
    transition: color 0.2s;
    .back-arrow {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-right: 6px;
      transition: transform 0.2s;
    }
    &:hover {
      color: #5875ff;
      .back-arrow {
        transform: translateX(-4px);
      }
    }
  }

  > div.page-body {
    height: calc(100% - 74px);
    position: relative;
    z-index: 1;

    > div {
      width: 100%;
      height: 100%;
    }
  }

  /* ============ 开始页 ============ */
  .step1 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    .start-bg-deco {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      pointer-events: none;
      .deco-mine {
        position: absolute;
        font-size: 42px;
        opacity: 0.18;
        animation: floatMine 6s ease-in-out infinite;
      }
      .m1 { top: 12%; left: 18%; animation-delay: 0s; }
      .m2 { top: 22%; right: 20%; font-size: 34px; animation-delay: 1.2s; }
      .m3 { bottom: 18%; left: 24%; font-size: 38px; animation-delay: 2.4s; }
      .m4 { bottom: 26%; right: 16%; font-size: 30px; animation-delay: 0.8s; }
      .deco-spark {
        position: absolute;
        color: #ffb846;
        opacity: 0.5;
        animation: twinkle 3s ease-in-out infinite;
      }
      .s1 { top: 30%; left: 30%; font-size: 22px; animation-delay: 0.5s; }
      .s2 { top: 60%; right: 28%; font-size: 18px; animation-delay: 1.5s; }
      .s3 { top: 20%; left: 55%; font-size: 16px; animation-delay: 2.2s; }
    }

    .start-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 2;
      animation: cardIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .mine-orb {
      position: relative;
      width: 180px;
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 36px;
      .mine-emoji {
        font-size: 96px;
        filter: drop-shadow(0 8px 18px rgba(88, 117, 255, 0.45));
        animation: pulseMine 2.4s ease-in-out infinite;
      }
      .orb-ring {
        position: absolute;
        border-radius: 50%;
        border: 2px solid rgba(88, 117, 255, 0.35);
        animation: ringPulse 2.4s ease-out infinite;
      }
      .r1 {
        width: 160px;
        height: 160px;
      }
      .r2 {
        width: 160px;
        height: 160px;
        animation-delay: 1.2s;
      }
    }

    .start-title {
      font-size: 64px;
      font-weight: 800;
      letter-spacing: 6px;
      margin: 0 0 18px;
      padding: 8px 12px;
      line-height: 1.25;
      background: linear-gradient(135deg, #5875ff 0%, #7ea0ff 45%, #ffb846 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 4px 12px rgba(88, 117, 255, 0.25);
    }

    .start-subtitle {
      font-size: 26px;
      color: #4a5568;
      margin: 0 0 48px;
      letter-spacing: 2px;
    }

    .start-hint {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 20px;
      color: #7c8aa5;
      margin-bottom: 30px;
      .hint-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #5875ff;
        animation: dotBlink 1.4s ease-in-out infinite;
      }
    }

    .start-btn {
      padding: 16px 56px;
      border-radius: 999px;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 4px;
      color: #fff;
      background: linear-gradient(135deg, #5875ff 0%, #7ea0ff 100%);
      box-shadow: 0 10px 30px rgba(88, 117, 255, 0.45),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      animation: btnFloat 2.4s ease-in-out infinite;
      user-select: none;
      &:hover {
        transform: translateY(-2px) scale(1.03);
        box-shadow: 0 14px 36px rgba(88, 117, 255, 0.55);
      }
      &:active {
        transform: translateY(0) scale(0.98);
      }
    }
  }

  /* ============ 游戏页 ============ */
  .step2 {
    padding: 30px 50px 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .stats-bar {
      display: flex;
      justify-content: center;
      gap: 28px;
      margin-bottom: 34px;
      flex-shrink: 0;

      .stat-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 30px;
        min-width: 168px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.72);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.9);
        box-shadow: 0 8px 24px rgba(88, 117, 255, 0.12);
        transition: transform 0.25s, box-shadow 0.25s;
        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(88, 117, 255, 0.2);
        }
        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          flex-shrink: 0;
        }
        .icon-click { background: linear-gradient(135deg, #e0e7ff, #c7d2fe); }
        .icon-dig { background: linear-gradient(135deg, #fef3c7, #fde68a); }
        .icon-bomb { background: linear-gradient(135deg, #fee2e2, #fecaca); }
        .icon-time { background: linear-gradient(135deg, #d1fae5, #a7f3d0); }

        .stat-meta {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .stat-value {
          font-size: 34px;
          font-weight: 800;
          color: #2d3748;
          font-variant-numeric: tabular-nums;
          .stat-unit {
            font-size: 18px;
            font-style: normal;
            font-weight: 600;
            color: #7c8aa5;
            margin-left: 2px;
          }
        }
        .stat-label {
          font-size: 16px;
          color: #7c8aa5;
          margin-top: 4px;
        }
      }
    }

    .body {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: 60px;
      padding: 0 20px;
      box-sizing: border-box;
      min-height: 0;

      .left {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;

        .board-frame {
          padding: 18px;
          border-radius: 26px;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.85), rgba(236, 242, 255, 0.7));
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 20px 50px rgba(88, 117, 255, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .board {
          width: 560px;
          height: 560px;
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          grid-template-rows: repeat(10, 1fr);
          gap: 5px;
          padding: 4px;
          box-sizing: border-box;
          border-radius: 16px;
          background: rgba(88, 117, 255, 0.08);

          .tile {
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 10px;
            cursor: pointer;
            position: relative;
            background: linear-gradient(145deg, #8fa8ff 0%, #6b83f5 100%);
            box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.45),
              inset 0 -3px 6px rgba(56, 78, 190, 0.35),
              0 2px 4px rgba(56, 78, 190, 0.18);
            transition: transform 0.12s, box-shadow 0.12s, background 0.2s;
            user-select: none;

            &::before {
              content: "";
              position: absolute;
              top: 18%;
              left: 20%;
              width: 30%;
              height: 22%;
              border-radius: 50%;
              background: rgba(255, 255, 255, 0.35);
              filter: blur(2px);
            }

            &:hover {
              transform: translateY(-2px);
              box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.5),
                inset 0 -3px 6px rgba(56, 78, 190, 0.3),
                0 5px 12px rgba(56, 78, 190, 0.28);
            }
            &:active {
              transform: translateY(0);
            }

            &.active {
              cursor: default;
              background: linear-gradient(145deg, #f1f5ff 0%, #e3ebff 100%);
              box-shadow: inset 0 2px 6px rgba(56, 78, 190, 0.18);
              &::before {
                display: none;
              }
              &:hover {
                transform: none;
                box-shadow: inset 0 2px 6px rgba(56, 78, 190, 0.18);
              }
            }

            &.is-bomb {
              background: linear-gradient(145deg, #ff8a8a 0%, #ff5252 100%);
              box-shadow: inset 0 2px 6px rgba(180, 20, 20, 0.35),
                0 0 16px rgba(255, 82, 82, 0.5);
              animation: bombShake 0.5s ease;
              &::before {
                display: none;
              }
            }

            .tile-num {
              font-size: 28px;
              font-weight: 800;
              text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6);
              animation: numPop 0.25s ease;
            }
            .tile-bomb {
              font-size: 28px;
              animation: bombPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
              filter: drop-shadow(0 2px 4px rgba(120, 0, 0, 0.3));
            }
          }
        }
      }

      .right {
        width: 380px;
        display: flex;
        flex-direction: column;
        gap: 30px;
        flex-shrink: 0;
        padding-top: 10px;

        .rules-card {
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 12px 32px rgba(88, 117, 255, 0.15);
          overflow: hidden;

          .rules-head {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 18px 26px;
            font-size: 24px;
            font-weight: 700;
            color: #fff;
            background: linear-gradient(135deg, #5875ff 0%, #7ea0ff 100%);
            letter-spacing: 2px;
            .rules-icon {
              font-size: 26px;
            }
          }
          .rules-body {
            padding: 22px 26px 24px;
            color: #4a5568;
            font-size: 18px;
            line-height: 1.7;
            p {
              margin: 0 0 12px;
            }
            ul {
              list-style: none;
              margin: 0 0 14px;
              padding: 0;
              li {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                margin-bottom: 10px;
                .dot {
                  flex-shrink: 0;
                  width: 28px;
                  height: 28px;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  border-radius: 8px;
                  font-size: 16px;
                  font-style: normal;
                }
                .bomb-dot { background: #fee2e2; }
                .blank-dot { background: #e0e7ff; }
                .num-dot {
                  background: #fef3c7;
                  font-weight: 800;
                  color: #d97706;
                }
              }
            }
            .rules-tip {
              margin: 0;
              padding: 10px 14px;
              border-radius: 12px;
              background: linear-gradient(135deg, #fff7e6, #ffefcc);
              color: #b45309;
              font-weight: 600;
              font-size: 17px;
            }
          }
        }

        .restart-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: 60px;
          border-radius: 16px;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 4px;
          color: #fff;
          background: linear-gradient(135deg, #ffb846 0%, #ff9a3c 100%);
          box-shadow: 0 10px 24px rgba(255, 154, 60, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
          cursor: pointer;
          user-select: none;
          transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
          .restart-icon {
            font-size: 24px;
            transition: transform 0.5s;
          }
          &:hover {
            transform: translateY(-3px);
            box-shadow: 0 14px 30px rgba(255, 154, 60, 0.5);
            .restart-icon {
              transform: rotate(-180deg);
            }
          }
          &:active {
            transform: translateY(0) scale(0.98);
            filter: brightness(0.96);
          }
        }
      }
    }
  }

  /* ============ 结算弹窗 ============ */
  > div.open {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(30, 41, 82, 0.45);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    animation: fadeIn 0.3s ease;

    .modal-card {
      width: 500px;
      border-radius: 28px;
      background: linear-gradient(160deg, #ffffff 0%, #f4f7ff 100%);
      box-shadow: 0 30px 80px rgba(20, 30, 80, 0.35);
      padding: 50px 50px 44px;
      box-sizing: border-box;
      text-align: center;
      position: relative;
      animation: modalPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      overflow: hidden;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 8px;
      }
      &.modal-win::before {
        background: linear-gradient(90deg, #ffd54f, #ffb846, #ffd54f);
      }
      &.modal-lose::before {
        background: linear-gradient(90deg, #ff8a8a, #ff5252, #ff8a8a);
      }

      .modal-icon-wrap {
        position: relative;
        width: 110px;
        height: 110px;
        margin: 0 auto 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        .modal-icon {
          font-size: 72px;
          position: relative;
          z-index: 2;
          animation: iconBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .icon-glow {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          border-radius: 50%;
          z-index: 1;
        }
      }
      &.modal-win .icon-glow {
        background: radial-gradient(circle, rgba(255, 184, 70, 0.35) 0%, transparent 70%);
        animation: glowPulse 2s ease-in-out infinite;
      }
      &.modal-lose .icon-glow {
        background: radial-gradient(circle, rgba(255, 82, 82, 0.35) 0%, transparent 70%);
      }

      .modal-title {
        font-size: 38px;
        font-weight: 800;
        margin: 0 0 20px;
        letter-spacing: 4px;
      }
      &.modal-win .modal-title {
        background: linear-gradient(135deg, #f59e0b, #ffb846);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      &.modal-lose .modal-title {
        color: #ef4444;
      }

      .modal-subtitle {
        font-size: 18px;
        color: #7c8aa5;
        margin-bottom: 28px;
      }

      .modal-stats {
        display: flex;
        flex-direction: column;
        gap: 12px;
        text-align: left;
        background: rgba(88, 117, 255, 0.06);
        border-radius: 16px;
        padding: 22px 28px;
        :deep(p) {
          margin: 0;
          font-size: 20px;
          color: #2d3748;
          line-height: 1.6;
          display: flex;
          align-items: center;
          &::before {
            content: "";
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #5875ff;
            margin-right: 12px;
            flex-shrink: 0;
          }
        }
      }
    }
  }
}

/* ============ 动画 ============ */
@keyframes floatMine {
  0%, 100% { transform: translateY(0) rotate(-8deg); }
  50% { transform: translateY(-22px) rotate(8deg); }
}
@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 0.6; transform: scale(1.2); }
}
@keyframes pulseMine {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}
@keyframes ringPulse {
  0% { transform: scale(0.8); opacity: 0.7; }
  100% { transform: scale(1.5); opacity: 0; }
}
@keyframes btnFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes dotBlink {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
@keyframes cardIn {
  0% { opacity: 0; transform: translateY(30px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes numPop {
  0% { transform: scale(0.2); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes bombPop {
  0% { transform: scale(0) rotate(-180deg); opacity: 0; }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}
@keyframes bombShake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-5px) rotate(-3deg); }
  40% { transform: translateX(5px) rotate(3deg); }
  60% { transform: translateX(-4px) rotate(-2deg); }
  80% { transform: translateX(4px) rotate(2deg); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes modalPop {
  0% { opacity: 0; transform: scale(0.7) translateY(20px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes iconBounce {
  0% { transform: scale(0) rotate(-30deg); }
  60% { transform: scale(1.2) rotate(10deg); }
  100% { transform: scale(1) rotate(0); }
}
@keyframes glowPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}
@keyframes blobFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -25px) scale(1.08); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}
@keyframes bgFloat {
  0%, 100% { transform: translateY(0) rotate(-6deg); }
  50% { transform: translateY(-24px) rotate(6deg); }
}
</style>
