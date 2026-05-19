<template>
  <div class="user-info-box">
    <div class="bread" @click="$router.go(-1)">
      <span>&nbsp;&nbsp;&nbsp;返回</span>
    </div>
    <div>
      <div v-if="curStatus == 1" class="step1" @dblclick="start()">
        <div>开始游戏</div>
        <div>让我考考你的注意力</div>
        <img src="@/assets/images/game/game4/start.png" alt="" />
        <div>双击即可开始</div>
      </div>
      <div v-else class="step2">
        <div class="top">
          <div>下一个数字：{{ curMustNum }}</div>
          <div>用时：{{ time }} 秒</div>
        </div>
        <div class="body">
          <div class="left">
            <ul>
              <li
                v-for="(item, index) in list"
                :key="index"
                @click="numClick(item)"
              >
                <div :class="{ active: activeArr.includes(item) }">
                  {{ item }}
                </div>
              </li>
            </ul>
          </div>
          <div class="right">
            <div>
              <p>游戏规则</p>
              <div>
                请观看左上角数字提示。按顺序点击
                数字，数字全部点击后，游戏就通关了。 可以选择再玩一次。
              </div>
            </div>
            <div>
              <div @click="reset()">再玩一次</div>
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
                score: 100,
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
          setTimeout(() => {
            this.isVisible = false
            this.isClick = false
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
          width: 240px;
          height: 240px;
          margin-bottom: 108px;
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
            margin-bottom: 101px;
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
          justify-content: center;
          > div.left {
            width: 500px;
            height: 500px;
            margin-right: 200px;
            > ul {
              width: 100%;
              height: 100%;
              display: flex;
              flex-flow: row wrap;
              > li {
                width: 100px;
                height: 100px;
                padding: 5px;
                box-sizing: border-box;
                > div {
                  width: 100%;
                  height: 100%;
                  transition: background-color 0.5s;
                  color: #ffffff;
                  background: #ffa71f;
                  font-size: 27px;
                  line-height: 90px;
                  box-shadow: -10px 0px 20px 10px rgba(0, 0, 0, 0.12);
                  text-align: center;
                  &.active {
                    background: #fcc56d;
                  }
                }
              }
            }
          }
          > div.right {
            width: 444px;
            > div {
              &:nth-child(1) {
                width: 444px;
                height: 280px;
                background: url(@/assets/images/game/game4/dialog.png) no-repeat;
                background-size: 444px 280px;
                margin-bottom: 100px;
                padding: 55px 0 0 0;
                box-sizing: border-box;
                position: relative;
                > p {
                  height: 24px;
                  line-height: 24px;
                  font-size: 24px;
                  font-weight: 700;
                  color: #333333;
                  margin-bottom: 24px;
                }
                > div {
                  width: 375px;
                  height: 34px;
                  line-height: 34px;
                  font-size: 21px;
                  color: #333333;
                  text-align: left;
                  margin-left: 54px;
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
                  margin: 0 110px 30px;
                  &:nth-child(1) {
                    background: #fcc56d;
                  }
                  &:nth-child(2) {
                    background: #2a69ff;
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
