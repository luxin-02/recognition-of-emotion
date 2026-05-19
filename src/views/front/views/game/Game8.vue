<template>
  <div class="user-info-box">
    <div class="bread" @click="$router.go(-1)">
      <span>&nbsp;&nbsp;&nbsp;返回</span>
    </div>
    <div>
      <div v-if="curStatus == 1" class="step1" @dblclick="start()">
        <div>开始游戏</div>
        <div>考验你智慧的时候到了</div>
        <img src="@/assets/images/game/game8/start.png" alt="" />
        <div>双击即可开始</div>
      </div>
      <div v-else class="step2">
        <div class="top">
          <div>步数：{{ step }}</div>
          <div>用时：{{ time }} 秒</div>
        </div>
        <div class="body">
          <div class="left">
            <div class="pane">
              <div class="tile-cont">
                <div
                  class="tile"
                  :class="'tile-' + item"
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
                >
                  ↻
                </div>
              </div>
            </div>
          </div>
          <div class="right">
            <div>
              <p>游戏规则</p>
              <div>
                点击中间的旋转按钮，四周的方块会
                按顺时针旋转，当四个区域的方块颜色一 样时，游戏就通关了。
              </div>
            </div>
            <div>
              <div @click="clear()">复原</div>
              <div @click="generate()">重置</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="open" v-if="isVisiable">
      <div>
        <p>恭喜通关</p>
        <div v-html="strText"></div>
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
      total: 144, //ROW ** 2
      data: [],
      isRunning: false,
      dotData: [],
      dataString: "",
      step: 0,
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
      this.handleList()
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
      this.step = 0
      this.time = 0
    },
    randomSort(arr) {
      arr.sort(function () {
        return Math.random() - 0.5
      })
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
      if (this.isRunning) {
        const data = this.turn(this.data, index)
        this.data = data
        this.step++
        if (this.isRunning) {
          if (JSON.stringify(data) === this.dataString) {
            this.isVisiable = true
            this.clearTimer()
            this.strText = `
                            <p>恭喜你，游戏通关！总共用了${this.step}步</p>
                            <p>总用时${this.time}秒</p>
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
        }
      } else {
        // this.$toast("当前不可旋转，请点击重置按钮开始游戏")
        this.$myMessage({
          type: "font-error",
          message: "当前不可旋转，请点击重置按钮开始游戏",
        })
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
  beforeCreate() {},
  created() {
    this.dataString = JSON.stringify(this.initData())
    this.dotData = this.initDotList()
    this.data = this.initData()
  },
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
div.user-info-box {
  width: 100%;
  height: 100%;
  > div.bread {
    width: 100%;
    height: 74px;
    line-height: 74px;
    text-align: left;
    font-size: 20px;

    font-weight: normal;
    color: #999999;
    border-bottom: 2px solid rgba(153, 153, 153, 0.34901960784313724);
  }
  > div.bread + div {
    height: calc(100% - 74px);
    display: flex;
    > div {
      width: 100%;
      height: 100%;
      &.step1 {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        > img {
          width: 200px;
          height: 200px;
          margin-bottom: 150px;
          box-shadow: -10px 10px 20px 0px rgba(0, 0, 0, 0.26);
        }
        > div {
          &:nth-child(1) {
            height: 52px;
            line-height: 52px;
            font-size: 53px;
            color: #333333;
            margin-bottom: 30px;
          }
          &:nth-child(2) {
            line-height: 24px;
            height: 24px;
            font-size: 24px;
            color: #333333;
            margin-bottom: 99px;
          }
          &:nth-child(4) {
            height: 24px;
            line-height: 24px;
            font-size: 24px;
            color: #333333;
          }
        }
      }
      &.step2 {
        padding: 59px 50px 0;
        box-sizing: border-box;
        > div.top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 60px;
        }
        > div.body {
          display: flex;
          padding: 0 124px;
          box-sizing: border-box;
          > div.left {
            .tile-cont {
              position: absolute;
              width: 576px;
              height: 576px;
              .tile {
                width: 48px;
                height: 48px;
                float: left;
                box-shadow: 2px 2px 2px 0px #fff inset;
              }
              .tile.tile-0 {
                background-color: #ff6b6b;
              }
              .tile.tile-1 {
                background-color: #81eb00;
              }
              .tile.tile-2 {
                background-color: #ffe14c;
              }
              .tile.tile-3 {
                background-color: #598bff;
              }
            }
            .dot-cont {
              position: relative;
              width: 576px;
              height: 576px;
              .dot {
                position: absolute;
                width: 20px;
                height: 20px;
                text-align: center;
                line-height: 20px;
                border-radius: 50%;
                border: 2px solid #ffffff;
                color: #ffffff;
                cursor: pointer;
                background-color: #2fc6ff;
                box-shadow: 1px 1px 2px #000;
                transform: translate(-50%, -50%);
              }
            }
          }
          > div.right {
            margin-left: 200px;
            width: 440px;
            > div:nth-child(1) {
              width: 448px;
              height: 290px;
              background: url(@/assets/images/game/game8/dialog.png) no-repeat;
              background-size: 448px 290px;
              padding: 70px 34px 0 34px;
              box-sizing: border-box;
              margin-bottom: 100px;
              > p {
                height: 24px;
                line-height: 24px;
                font-size: 24px;
                font-weight: 700;
                color: #333333;
                margin-bottom: 16px;
                text-align: center;
              }
              > div {
                text-indent: 2em;
                width: 380px;
                height: 34px;
                line-height: 34px;
                font-size: 21px;
                color: #333333;
                text-align: left;
              }
            }
            > div:nth-child(2) {
              > div {
                width: 220px;
                height: 48px;
                border-radius: 10px;
                line-height: 48px;
                font-size: 24px;
                color: #ffffff;
                text-align: center;
                margin: 0 110px 30px;
                &:nth-child(1) {
                  background: #ffb846;
                }
                &:nth-child(2) {
                  background: #598bff;
                }
              }
            }
          }
        }
      }
    }
  }
  > div.open {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    > div {
      width: 457px;
      height: 300px;
      border-radius: 10px;
      background: url(@/assets/images/game/game1/open.png) no-repeat;
      background-size: 457px 300px;
      position: relative;
      padding: 61px 51px 0 51px;
      box-sizing: border-box;
      &:after {
        content: "";
        position: absolute;
        width: 262px;
        height: 100px;
        display: block;
        background: url(@/assets/images/game/game1/star.png) no-repeat;
        background-size: 262px 100px;
        top: -47px;
        left: 99px;
      }
      > p {
        height: 24px;
        line-height: 24px;
        font-size: 24px;
        font-weight: 700;
        color: #333333;
        margin-bottom: 15px;
      }
      > div {
        width: 355px;
        font-size: 20px;
        text-align: left;
        color: #333333;
        line-height: 36px;
      }
    }
  }
}
</style>
