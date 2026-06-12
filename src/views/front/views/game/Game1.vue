<template>
  <div class="user-info-box">
    <div class="bread" @click="$router.go(-1)">
      <span>&nbsp;&nbsp;&nbsp;返回</span>
    </div>
    <div>
      <div v-if="curStatus == 1" class="step1" @dblclick="start()">
        <div>开始游戏</div>
        <div>开启冒险模式</div>
        <img src="@/assets/images/game/game1/start.png" alt="" />
        <div>双击即可开始</div>
      </div>
      <div v-else class="step2">
        <div class="top">
          <div>模式：{{ returnCtt(level).content }}</div>
          <div>你已经进行了 {{ step }} 步</div>
          <div>游戏进度：{{ score }}/{{ picList.length / 2 }}</div>
          <div>用时：{{ time }} 秒</div>
        </div>
        <div class="body">
          <div class="left">
            <div
              class="card"
              :class="{
                col4: pairs == 4,
                col9: pairs == 9,
                col8: pairs == 8,
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
          <div class="right">
            <div>
              <p>游戏规则</p>
              <div>
                请翻开两个格子，如果图案一致则配对，
                将其挑出，如果图案不一致则盖回去，直到
                所有格子都配对完成，游戏就通关了。可以
                自行选择下一个游戏或者重新开始哦。
              </div>
            </div>
            <div>
              <div>
                <div @click="btnClick(1)">再玩一次</div>
                <div @click="btnClick(2)">
                  {{ returnCtt(level).content == "8*4" ? "返回" : "下一关" }}
                </div>
              </div>
              <img src="@/assets/images/game/game1/p.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="open" v-if="isVisible">
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
        { hard: 1, pairs: 4, content: "4*2", loop: "2", w: 1.8, h: 2.6 },
        { hard: 2, pairs: 9, content: "9*2", loop: "2", w: 1.14, h: 1.64 },
        { hard: 3, pairs: 8, content: "8*4", loop: "4", w: 0.8, h: 1.08 },
      ],
      hard: null,
      pairs: null,
      loop: null,
      level: 1,
    }
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
      if (type != 1) {
        if (this.hard == 3) {
          // this.level = 1;
          this.$router.go(-1)
        } else {
          this.level++
        }
      }
      this.start()
    },
    loopf(arr) {
      console.log(arr,'loopf');
      
      for (var i = 0; i < arr.length; i++) {
        this.picList.push({
          img: require("@/assets/images/game/game1/g" + arr[i] + ".png"),
          value: `img${arr[i]}`,
          over: true,
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
    position: relative;
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
          width: 180px;
          height: 260px;
          margin-bottom: 90px;
          box-shadow: -10px 10px 20px 0px rgba(0, 0, 0, 0.26);
          border-radius: 10px;
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
          margin-bottom: 60px;
        }
        > div.body {
          display: flex;
          > div.left {
            width: 1010px;
            display: flex;
            flex-flow: row wrap;
            justify-items: flex-start;
            .card {
              cursor: pointer;
              display: inline-block;
              overflow: hidden;
              position: relative;
              border-radius: 10px;
              margin: 15px 15px;
              padding: 0 80px 0 0;
              box-sizing: border-box;
              &.col4 {
                width: 180px;
                height: 260px;
              }
              &.col9 {
                width: 114px;
                height: 164px;
              }
              &.col8 {
                width: 76px;
                height: 108px;
              }
              > div {
                border-radius: 10px;
                height: 100%;
                width: 100%;
                position: absolute;
                transition: all 0.3s;
                transform-style: preserve-3d;
                backface-visibility: hidden;
              }
            }
            .card_backImg_active {
              > div.div1 {
                transform: rotateY(-180deg);
              }
              > div.div2 {
                transform: rotateY(0deg);
              }
            }
            .card_backImg_unactive {
              > div.div1 {
                transform: rotateY(0deg);
              }
              > div.div2 {
                transform: rotateY(-180deg);
              }
            }
          }
          > div.right {
            > div {
              &:nth-child(1) {
                width: 460px;
                height: 300px;
                background: url(@/assets/images/game/game1/dialog.png) no-repeat;
                background-size: 460px 300px;
                margin-bottom: 20px;
                padding: 29px 50px 0;
                box-sizing: border-box;
                > p {
                  height: 24px;
                  line-height: 24px;
                  font-size: 24px;
                  font-weight: 700;
                  color: #ffffff;
                  margin-bottom: 10px;
                }
                > div {
                  width: 404px;
                  height: 34px;
                  line-height: 34px;
                  font-size: 21px;
                  color: #ffffff;
                  text-align: left;
                }
              }
              &:nth-child(2) {
                height: 211px;
                display: flex;
                > div {
                  width: 291px;
                  height: 211px;
                  &:nth-child(1) {
                    padding: 58px 0 0 0;
                    box-sizing: border-box;
                    > div {
                      width: 220px;
                      height: 48px;
                      border-radius: 10px;
                      line-height: 48px;
                      font-size: 24px;
                      color: #ffffff;
                      text-align: center;
                      margin-bottom: 30px;
                      &:nth-child(1) {
                        background: #ffb846;
                      }
                      &:nth-child(2) {
                        background: #2767ff;
                      }
                    }
                  }
                }
                > img {
                  width: 169px;
                  height: 211px;
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
