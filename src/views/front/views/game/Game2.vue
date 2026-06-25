<template>
  <div class="user-info-box">
    <div class="bread" @click="$router.go(-1)">
      <span>&nbsp;&nbsp;&nbsp;返回</span>
    </div>
    <div>
      <div v-if="curStatus == 1" class="step1" @dblclick="start()">
        <div>开始游戏</div>
        <div>要挑战惊险刺激的扫雷吗？</div>
        <img src="@/assets/images/game/game2/start.png" alt="" />
        <div>双击即可开始</div>
      </div>
      <div v-else class="step2">
        <div class="top">
          <div>你已经点击了 {{ move }} 下</div>
          <div>已挖空板块 {{ removeBlock }}</div>
          <div>雷 {{ bombs.length }} 个</div>
          <div>用时：{{ time }} 秒</div>
        </div>
        <div class="body">
          <div class="left">
            <div class="board">
              <div
                class="tile"
                v-for="(item, index) in board"
                :key="index"
                :data-tile="item.tile"
                :data-num="item.num"
                :data-index="item.index"
                :data-flag="item.flagged"
                :class="{ active: item.checked }"
                @click="clickTile(item, 1)"
              >
                <span v-show="item.checked">{{
                  item.flagged ? item.flagged : item.num
                }}</span>
              </div>
            </div>
          </div>
          <div class="right">
            <div>
              <p>游戏规则</p>
              <div>
                随机选择一个方块点击，出现两种情况：1.点击的该方块为地雷，则游戏结束。2.点击的该方块出现空白，游戏会自动把无地雷的区域打开，3.点击的方块出现数字，则数字的四周有该数的地雷存在。在找出所有目标雷后，则游戏通关完成。
              </div>
            </div>
            <div>
              <div @click="btnClick()">再玩一次</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="open" v-if="isVisible">
      <div>
        <p>{{ isOver ? "恭喜通关" : "游戏结束" }}</p>
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
          score: 100,
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
          width: 210px;
          height: 210px;
          margin-bottom: 140px;
          border-radius: 10px;
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
        padding: 62px 50px 0;
        box-sizing: border-box;
        > div.top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 59px;
        }
        > div.body {
          display: flex;
          padding: 0 30px;
          box-sizing: border-box;
          > div.left {
            width: 558px;
            margin-right: 150px;
            display: flex;
            justify-content: center;
            align-items: center;
            > div.board {
              width: 558px;
              height: 558px;
              display: flex;
              flex-wrap: wrap;
              > div {
                width: 53px;
                height: 53px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #7ea0ff;
                border: 1px solid #ffffff;
                border-radius: 10px;
                &.active {
                  background: #5875ff;
                }
                > span {
                  // text-shadow: 2px 2px #627ff5;
                  font-size: 27px;
                  font-weight: 700;
                  color: #ffffff;
                }
              }
            }
          }
          > div.right {
            width: 440px;
            > div {
              &:nth-child(1) {
                width: 650px;
                height: 310px;
                background: url(@/assets/images/game/game2/dialog.png) no-repeat;
                background-size: 650px 310px;
                margin-bottom: 100px;
                padding: 60px 38px 0 68px;
                box-sizing: border-box;
                transform: scale(1.2);
                > p {
                  height: 24px;
                  line-height: 24px;
                  font-size: 24px;
                  font-weight: 700;
                  color: #ffffff;
                  margin-bottom: 10px;
                  text-align: center;
                }
                > div {
                  text-indent: 2em;
                  width: 550px;
                  height: 34px;
                  line-height: 34px;
                  font-size: 18px;
                  color: #fff;
                  text-align: left;
                }
              }
              &:nth-child(2) {
                > div {
                  width: 220px;
                  height: 48px;
                  border-radius: 10px;
                  line-height: 48px;
                  font-size: 24px;
                  color: #ffffff;
                  text-align: center;
                  margin: 0 240px 30px;
                  &:nth-child(1) {
                    background: #ffb846;
                  }
                  &:nth-child(2) {
                    background: #2bbf6d;
                  }
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
