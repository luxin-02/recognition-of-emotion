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
        <div class="start-badge">记忆挑战 · MEMORY</div>
        <h1 class="start-title">翻牌大冒险</h1>
        <p class="start-sub">翻开卡片，记住位置，找出相同的伙伴即可通关</p>

        <div class="start-stage">
          <div class="start-glow"></div>
          <div class="start-ring"></div>
          <img class="start-card" src="@/assets/images/game/game1/start.png" alt="" />
          <span class="start-spark sp1"></span>
          <span class="start-spark sp2"></span>
          <span class="start-spark sp3"></span>
          <span class="start-spark sp4"></span>
        </div>

        <div class="level-picker">
          <div class="level-label">选择难度</div>
          <div class="level-cards">
            <div
              v-for="item in ary"
              :key="item.hard"
              class="level-card"
              :class="{ active: selectedLevel == item.hard }"
              @click="selectedLevel = item.hard"
            >
              <div class="level-name">{{ item.name }}</div>
              <!-- <div class="level-grid">{{ item.content }}</div> -->
              <div class="level-count">{{ item.pairs * item.loop }} 张卡片</div>
              <div class="level-check" v-if="selectedLevel == item.hard">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="start-cta">
          <span class="cta-dot"></span>
          双击任意位置开始 · {{ returnCtt(selectedLevel).name }}
        </div>
        <div class="start-hint">通关后自动记录成绩 · 游戏中可随时切换关卡</div>
      </div>

      <!-- 游戏页 -->
      <div v-else class="step2">
        <!-- 顶部状态栏 -->
        <div class="hud">
          <div class="hud-item">
            <div class="hud-icon icon-mode">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
                <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
                <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
                <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
              </svg>
            </div>
            <div class="hud-meta">
              <span class="hud-label">模式</span>
              <span class="hud-value">{{ returnCtt(level).content }}</span>
            </div>
          </div>

          <div class="hud-item">
            <div class="hud-icon icon-step">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div class="hud-meta">
              <span class="hud-label">步数</span>
              <span class="hud-value">{{ step }}</span>
            </div>
          </div>

          <div class="hud-item hud-item--progress">
            <div class="hud-icon icon-progress">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9"></circle>
                <circle cx="12" cy="12" r="5"></circle>
                <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"></circle>
              </svg>
            </div>
            <div class="hud-meta">
              <span class="hud-label">游戏进度 {{ score }}/{{ picList.length / 2 }}</span>
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
          <!-- 卡牌区 -->
          <div class="left">
            <div
              class="card"
              :class="{
                col4: pairs == 4,
                col9: pairs == 9,
                col8: pairs == 8,
                'is-matched': item.matched,
                card_backImg_unactive: item.over,
                card_backImg_active: !item.over,
              }"
              v-for="(item, index) in picList"
              :key="index"
              @click="picClick(item.value, index)"
            >
              <div class="div1">
                <img
                  :style="{ width: item.w + 'rem', height: item.h + 'rem' }"
                  src="@/assets/images/game/game1/start.png"
                />
              </div>
              <div class="div2">
                <img
                  :src="item.img"
                  :style="{ width: item.w + 'rem', height: item.h + 'rem' }"
                />
              </div>
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
                请翻开两个格子，如果图案一致则配对，将其挑出；如果图案不一致则盖回去，直到所有格子都配对完成，游戏就通关了。
              </p>
              <div class="rules-tip">
                <span class="tip-icon">!</span>
                记住每张卡片的位置，用最少步数通关吧！
              </div>
            </div>

            <div class="panel action-panel">
              <div class="mascot">
                <img src="@/assets/images/game/game1/p.png" alt="" />
              </div>
              <div class="btn-group">
                <div class="game-btn btn-primary" @click="btnClick(1)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                  再玩一次
                </div>
                <div class="game-btn btn-secondary" @click="backToSelect">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
                    <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
                    <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
                    <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
                  </svg>
                  选择关卡
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 通关弹窗 -->
    <transition name="pop">
      <div class="open" v-if="isVisible">
        <div class="open-card">
          <div class="open-stars">
            <img src="@/assets/images/game/game1/star.png" alt="" />
          </div>
          <p class="open-title">恭喜通关</p>
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
      picList: [],
      score: 0,
      curOpenNum: 0,
      curOpenIndex: [],
      curOpenValue: [],
      step: 0,
      timer: null,
      isVisible: false,
      strText: "",
      time: 0,
      ary: [
        { hard: 1, pairs: 4, content: "4*2", loop: "2", w: 1.8, h: 2.6, name: "简单" },
        { hard: 2, pairs: 9, content: "9*2", loop: "2", w: 1.14, h: 1.64, name: "普通" },
        { hard: 3, pairs: 8, content: "8*4", loop: "4", w: 0.8, h: 1.08, name: "困难" },
      ],
      hard: null,
      pairs: null,
      loop: null,
      level: 1,
      selectedLevel: 1,
    }
  },
  computed: {
    progressPercent() {
      const total = this.picList.length / 2
      return total ? Math.min(100, (this.score / total) * 100) : 0
    },
  },
  mixins: [],
  watch: {},
  directives: {},
  filters: {},
  components: {},
  methods: {
    clearTimer() {
      clearInterval(this.timer)
      this.timer = null
    },
    returnCtt(level) {
      return this.ary.find((item) => {
        return level == item.hard
      })
    },
    getRandomArrayElements(arr, count) {
      var shuffled = arr.slice(0),
        i = arr.length,
        min = i - count,
        temp,
        index
      while (i-- > min) {
        index = Math.floor((i + 1) * Math.random())
        temp = shuffled[index]
        shuffled[index] = shuffled[i]
        shuffled[i] = temp
      }
      return shuffled.slice(min)
    },
    reset() {
      this.picList = []
      this.score = 0
      this.curOpenNum = 0
      this.curOpenIndex = []
      this.curOpenValue = []
      this.step = 0
      this.time = 0
      this.clearTimer()
      var arr = this.getRandomArrayElements(
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        this.pairs,
      )
      for (var i = 0; i < this.loop; i++) {
        this.loopf(arr)
      }
      console.log(this.picList)
      this.randomSort(this.picList)
      this.timer = setInterval(() => {
        this.time++
      }, 1000)
    },
    btnClick(type) {
      // type == 1：再玩一次（重开当前关卡）
      this.start()
    },
    backToSelect() {
      // 返回选关页
      this.selectedLevel = this.level
      this.clearTimer()
      this.curStatus = 1
    },
    loopf(arr) {
      console.log(arr,'loopf');
      
      for (var i = 0; i < arr.length; i++) {
        this.picList.push({
          img: require("@/assets/images/game/game1/g" + arr[i] + ".png"),
          value: `img${arr[i]}`,
          over: true,
          matched: false,
          w: this.ary[this.level - 1].w,
          h: this.ary[this.level - 1].h,
        })
      }
    },
    randomSort(arr) {
      arr.sort(function () {
        return Math.random() - 0.5
      })
    },
    picClick(value, index) {
      if (this.picList[index].over) {
        if (this.curOpenNum < 2) {
          this.curOpenNum++
          this.curOpenValue.push(value)
          this.curOpenIndex.push(index)
          this.picList[index].over = false
          if (this.curOpenNum == 2) {
            setTimeout(() => {
              this.step++
              if (this.curOpenValue[0] != this.curOpenValue[1]) {
                this.picList[this.curOpenIndex[0]].over = true
                this.picList[this.curOpenIndex[1]].over = true
              } else {
                this.score++
                this.picList[this.curOpenIndex[0]].matched = true
                this.picList[this.curOpenIndex[1]].matched = true
                if (this.score == this.picList.length / 2) {
                  this.isVisible = true
                  this.clearTimer()
                  this.isVisible = true
                  this.strText = `
                                        <p>恭喜你，游戏通关成功！本次游戏能达到 最少步骤为${
                                          this.picList.length / 2
                                        }步。</p>
                                        <p>你本次游戏总计：${
                                          this.step
                                        }步，用时：${this.time}秒</p> 
                                    `

                  setTimeout(async () => {
                    await reportApiAdd({
                      cat_name: "心理训练",
                      game_name: "翻牌",
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
              }
              this.curOpenNum = 0
              this.curOpenIndex = []
              this.curOpenValue = []
            }, 600)
          }
        }
      }
    },
    start() {
      this.curStatus = 2
      this.level = this.selectedLevel
      this.hard = this.ary[this.level - 1].hard
      this.pairs = this.ary[this.level - 1].pairs
      this.loop = this.ary[this.level - 1].loop
      this.reset()
    },
  },
  beforeCreate() {},
  created() {},
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
$bg-deep: #160d3a;
$bg-mid: #2a1863;
$bg-warm: #4a2370;
$glass: rgba(255, 255, 255, 0.08);
$glass-border: rgba(255, 255, 255, 0.18);
$text: #ffffff;
$text-sub: rgba(255, 255, 255, 0.72);
$cyan: #4fd8ff;
$gold: #ffd166;
$pink: #ff6ec7;
$orange: #ff9d4d;
$blue: #5b8cff;

div.user-info-box {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(1200px 700px at 15% 10%, rgba(123, 66, 220, 0.55), transparent 60%),
    radial-gradient(1000px 800px at 85% 90%, rgba(255, 82, 168, 0.38), transparent 60%),
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
    background: #7b42dc;
    top: -120px;
    left: -100px;
  }
  .orb-2 {
    width: 480px;
    height: 480px;
    background: #ff52a8;
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
    overflow-y: auto;

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
      letter-spacing: 6px;
      margin-bottom: 18px;
      background: linear-gradient(180deg, #ffffff 0%, #ffe7a8 55%, #ffb347 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 40px rgba(255, 196, 92, 0.35);
      animation: fadeDown 0.9s ease both;
    }
    .start-sub {
      font-size: 22px;
      color: $text-sub;
      margin-bottom: 30px;
      animation: fadeDown 1s ease both;
    }

    .start-stage {
      position: relative;
      width: 240px;
      height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      animation: fadeUp 1s ease both;
    }
    .start-glow {
      position: absolute;
      width: 280px;
      height: 360px;
      border-radius: 24px;
      background: radial-gradient(circle, rgba(79, 216, 255, 0.55) 0%, rgba(123, 66, 220, 0.25) 45%, transparent 70%);
      filter: blur(20px);
      animation: glowPulse 3s ease-in-out infinite;
    }
    .start-ring {
      position: absolute;
      width: 210px;
      height: 290px;
      border-radius: 18px;
      border: 2px solid rgba(79, 216, 255, 0.5);
      box-shadow:
        0 0 30px rgba(79, 216, 255, 0.35),
        inset 0 0 24px rgba(79, 216, 255, 0.15);
      animation: ringPulse 3s ease-in-out infinite;
    }
    .start-card {
      position: relative;
      width: 180px;
      height: 260px;
      border-radius: 14px;
      box-shadow:
        -12px 14px 30px rgba(0, 0, 0, 0.45),
        0 0 24px rgba(79, 216, 255, 0.35);
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
    }
    .sp1 { top: 20px; left: 10px; }
    .sp2 { top: 50px; right: 0; background: $cyan; box-shadow: 0 0 12px $cyan; animation-delay: -0.8s; }
    .sp3 { bottom: 60px; left: 0; background: $pink; box-shadow: 0 0 12px $pink; animation-delay: -1.4s; }
    .sp4 { bottom: 20px; right: 20px; animation-delay: -1.8s; }

    .start-cta {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 14px 38px;
      border-radius: 999px;
      font-size: 22px;
      color: #fff;
      background: linear-gradient(135deg, #ffb347 0%, #ff7a59 100%);
      box-shadow:
        0 8px 24px rgba(255, 122, 89, 0.45),
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

    /* 关卡选择 */
    .level-picker {
      width: 620px;
      margin-bottom: 32px;
      animation: fadeUp 1.05s ease both;
    }
    .level-label {
      font-size: 18px;
      letter-spacing: 4px;
      color: $text-sub;
      margin-bottom: 16px;
      text-align: center;
    }
    .level-cards {
      display: flex;
      gap: 22px;
      justify-content: center;
    }
    .level-card {
      position: relative;
      width: 168px;
      padding: 20px 0 18px;
      border-radius: 18px;
      text-align: center;
      cursor: pointer;
      user-select: none;
      background: rgba(255, 255, 255, 0.07);
      border: 1.5px solid rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
      overflow: hidden;

      .level-name {
        font-size: 24px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 8px;
        letter-spacing: 2px;
      }
      .level-grid {
        font-size: 18px;
        color: $cyan;
        font-weight: 700;
        margin-bottom: 4px;
      }
      .level-count {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.55);
      }
      .level-check {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ffd166, #ff9d4d);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #3a2a00;
        box-shadow: 0 2px 8px rgba(255, 157, 77, 0.6);
        svg { width: 14px; height: 14px; }
      }

      &:hover {
        transform: translateY(-4px);
        border-color: rgba(79, 216, 255, 0.5);
        background: rgba(79, 216, 255, 0.1);
      }
      &.active {
        border-color: transparent;
        background:
          linear-gradient(160deg, rgba(106, 92, 255, 0.55), rgba(255, 110, 199, 0.45));
        box-shadow:
          0 10px 26px rgba(106, 92, 255, 0.45),
          inset 0 0 0 1.5px rgba(255, 255, 255, 0.35);
        transform: translateY(-4px) scale(1.04);
        .level-grid { color: #ffe7a8; }
      }
    }
  }

  /* ---------- 游戏页 ---------- */
  .step2 {
    padding: 24px 50px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    height: auto;

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
      &.icon-mode { background: linear-gradient(135deg, #6a5cff, #8e5bff); box-shadow: 0 4px 12px rgba(110, 92, 255, 0.5); }
      &.icon-step { background: linear-gradient(135deg, #ff7a59, #ffb347); box-shadow: 0 4px 12px rgba(255, 122, 89, 0.5); }
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
      gap: 40px;
      align-items: center;
      justify-content: center;
      flex: 1;
      min-height: 0;
    }

    /* 卡牌区 */
    .left {
      width: 1010px;
      flex-shrink: 0;
      display: flex;
      flex-flow: row wrap;
      justify-items: flex-start;
      align-content: flex-start;

      .card {
        cursor: pointer;
        display: inline-block;
        overflow: visible;
        position: relative;
        border-radius: 12px;
        margin: 14px 15px;
        box-sizing: border-box;
        perspective: 1000px;
        animation: cardDeal 0.5s ease both;
        transition: transform 0.25s ease, filter 0.25s ease;

        &.col4 { width: 180px; height: 260px; }
        &.col9 { width: 114px; height: 164px; }
        &.col8 { width: 80px; height: 108px; }

        > div {
          border-radius: 12px;
          height: 100%;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          transition: transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1);
          transform-style: preserve-3d;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          overflow: hidden;
        }
        .div1 {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #eaf6ff 0%, #cfe7fb 100%);
          box-shadow:
            0 6px 16px rgba(0, 0, 0, 0.35),
            inset 0 0 0 2px rgba(255, 255, 255, 0.7);
          img { border-radius: 8px; }
        }
        .div2 {
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at 50% 35%, #ffffff 0%, #f3f0ff 70%, #e6e0ff 100%);
          box-shadow:
            0 6px 16px rgba(0, 0, 0, 0.35),
            inset 0 0 0 2px rgba(255, 255, 255, 0.9);
          img { border-radius: 6px; }
        }

        /* 可点击时的悬停效果 */
        &.card_backImg_unactive:hover {
          transform: translateY(-6px);
          .div1 {
            box-shadow:
              0 14px 26px rgba(0, 0, 0, 0.45),
              0 0 18px rgba(79, 216, 255, 0.55),
              inset 0 0 0 2px rgba(255, 255, 255, 0.8);
          }
        }

        /* 配对成功 */
        &.is-matched {
          .div2 {
            box-shadow:
              0 8px 20px rgba(0, 0, 0, 0.35),
              0 0 22px rgba(255, 209, 102, 0.85),
              inset 0 0 0 2px rgba(255, 209, 102, 0.95);
          }
          animation: matchedPop 0.5s ease;
        }
      }

      .card_backImg_active {
        > div.div1 { transform: rotateY(-180deg); }
        > div.div2 { transform: rotateY(0deg); }
      }
      .card_backImg_unactive {
        > div.div1 { transform: rotateY(0deg); }
        > div.div2 { transform: rotateY(-180deg); }
      }

      // 发牌依次出现
      @for $i from 1 through 32 {
        .card:nth-child(#{$i}) { animation-delay: #{$i * 0.025}s; }
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
        display: flex;
        align-items: flex-end;
        gap: 18px;
        .mascot {
          width: 130px;
          flex-shrink: 0;
          img {
            width: 130px;
            height: auto;
            filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.35));
          }
        }
        .btn-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .game-btn {
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          user-select: none;
          transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
          svg { width: 20px; height: 20px; }
          &:active { transform: scale(0.97); }
        }
        .btn-primary {
          background: linear-gradient(135deg, #ffb347 0%, #ff7a59 100%);
          box-shadow: 0 8px 20px rgba(255, 122, 89, 0.45), inset 0 1px 0 rgba(255,255,255,0.35);
          &:hover { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(255, 122, 89, 0.55), inset 0 1px 0 rgba(255,255,255,0.35); }
        }
        .btn-secondary {
          background: linear-gradient(135deg, #5b8cff 0%, #6a5cff 100%);
          box-shadow: 0 8px 20px rgba(91, 140, 255, 0.45), inset 0 1px 0 rgba(255,255,255,0.35);
          &:hover { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(91, 140, 255, 0.55), inset 0 1px 0 rgba(255,255,255,0.35); }
        }
      }
    }
  }

  /* ---------- 通关弹窗 ---------- */
  > div.open {
    position: absolute;
    z-index: 50;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 5, 30, 0.65);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;

    .open-card {
      position: relative;
      width: 520px;
      padding: 92px 50px 46px;
      box-sizing: border-box;
      border-radius: 26px;
      text-align: center;
      background:
        radial-gradient(circle at 50% 0%, rgba(255, 209, 102, 0.25), transparent 60%),
        linear-gradient(160deg, rgba(60, 40, 120, 0.92) 0%, rgba(35, 22, 80, 0.95) 100%);
      border: 1px solid rgba(255, 209, 102, 0.5);
      box-shadow:
        0 0 60px rgba(255, 209, 102, 0.35),
        0 20px 60px rgba(0, 0, 0, 0.5);
      overflow: visible;
    }
    .open-stars {
      position: absolute;
      top: -52px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
      pointer-events: none;
      img {
        width: 260px;
        height: auto;
        filter: drop-shadow(0 6px 14px rgba(255, 209, 102, 0.6));
        animation: starsBounce 1.2s ease both;
      }
    }
    .open-title {
      position: relative;
      z-index: 1;
      font-size: 38px;
      line-height: 1.2;
      font-weight: 700;
      letter-spacing: 4px;
      margin: 0 0 22px;
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
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.05); }
}
@keyframes cardFloat {
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50% { transform: translateY(-14px) rotate(1deg); }
}
@keyframes sparkTwinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.3); }
}
@keyframes dotBlink {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.6); }
}
@keyframes cardDeal {
  from { opacity: 0; transform: translateY(30px) rotateY(40deg); }
  to { opacity: 1; transform: translateY(0) rotateY(0); }
}
@keyframes matchedPop {
  0% { transform: scale(1); }
  40% { transform: scale(1.12) rotate(-2deg); }
  70% { transform: scale(0.97) rotate(1deg); }
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
