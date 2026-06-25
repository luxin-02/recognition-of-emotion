<template>
  <div class="user-info-box">
    <div class="bread" @click="$router.go(-1)">
      <span>&nbsp;&nbsp;&nbsp;返回</span>
    </div>
    <div>
      <div v-if="curStatus == 1" class="step1" @dblclick="start()">
        <div>开始游戏</div>
        <div>看看我哪里不一样</div>
        <img src="@/assets/images/game/game5/start.png" alt="" />
        <div>双击即可开始</div>
      </div>
      <div v-else class="step2">
        <div class="top">
          <div>
            不同点：{{ foundArr.length }}/{{ list[curIndex].differ.length }}
          </div>
          <div>用时：{{ time }} 秒</div>
        </div>
        <div class="body">
          <div>
            <img :src="list[curIndex].img1" alt="" />
            <div
              v-for="(sitem, sindex) in list[curIndex].differ"
              :key="sindex"
              @click="foundArea(sindex)"
              :class="{ active: foundArr.indexOf(sindex) > -1 }"
              :style="{
                width: sitem.width,
                height: sitem.height,
                top: sitem.top,
                left: sitem.left,
                transform: sitem.transform && sitem.transform,
              }"
            ></div>
          </div>
          <div>
            <img :src="list[curIndex].img2" alt="" />
            <div
              v-for="(sitem, sindex) in list[curIndex].differ"
              :key="sindex"
              @click="foundArea(sindex)"
              :class="{ active: foundArr.indexOf(sindex) > -1 }"
              :style="{
                width: sitem.width,
                height: sitem.height,
                top: sitem.top,
                left: sitem.left,
                transform: sitem.transform && sitem.transform,
              }"
            ></div>
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
      timer: null,
      time: 0,
      isVisible: false,
      strText: "",
      curIndex: 0,
      orign: [
        {
          img1: require("@/assets/images/game/game5/1.jpg"),
          img2: require("@/assets/images/game/game5/1-2.jpg"),
          differ: [
            {
              width: "0.70rem",
              height: "2.30rem",
              top: "0.25rem",
              left: "0.07rem",
            },
            {
              width: "0.84rem",
              height: "2.71rem",
              top: "1.98rem",
              left: "5.29rem",
            },
            {
              width: "0.37rem",
              height: "0.46rem",
              top: "3.18rem",
              left: "3.57rem",
            },
            {
              width: "0.29rem",
              height: "0.33rem",
              top: "4.38rem",
              left: "3.97rem",
            },
          ],
        },
        {
          img1: require("@/assets/images/game/game5/2.jpg"),
          img2: require("@/assets/images/game/game5/2-2.jpg"),
          differ: [
            {
              width: "0.87rem",
              height: "0.81rem",
              top: "0.58rem",
              left: "0.35rem",
            },
            {
              width: "0.29rem",
              height: "0.27rem",
              top: "0.80rem",
              left: "4.44rem",
            },
            {
              width: "0.19rem",
              height: "0.20rem",
              top: "4.45rem",
              left: "1.28rem",
            },
            {
              width: "0.44rem",
              height: "0.58rem",
              top: "4.54rem",
              left: "3.97rem",
            },
            {
              width: "0.88rem",
              height: "1.10rem",
              top: "3.40rem",
              left: "4.37rem",
            },
          ],
        },
        {
          img1: require("@/assets/images/game/game5/3.jpg"),
          img2: require("@/assets/images/game/game5/3-2.jpg"),
          differ: [
            {
              width: "0.35rem",
              height: "0.20rem",
              top: "2.04rem",
              left: "0.71rem",
            },
            {
              width: "0.79rem",
              height: "0.51rem",
              top: "2.35rem",
              left: "5.21rem",
            },
            {
              width: "0.84rem",
              height: "0.66rem",
              top: "3.19rem",
              left: "4.30rem",
            },
          ],
        },
        {
          img1: require("@/assets/images/game/game5/4.jpg"),
          img2: require("@/assets/images/game/game5/4-2.jpg"),
          differ: [
            {
              width: "0.38rem",
              height: "0.37rem",
              top: "2.86rem",
              left: "1.57rem",
            },
            {
              width: "0.73rem",
              height: "0.48rem",
              top: "0.73rem",
              left: "4.25rem",
            },
            {
              width: "1.22rem",
              height: "1.09rem",
              top: "3.04rem",
              left: "4.46rem",
            },
            {
              width: "0.37rem",
              height: "0.24rem",
              top: "4.22rem",
              left: "6.45rem",
            },
            {
              width: "0.83rem",
              height: "0.61rem",
              top: "3.94rem",
              left: "3.12rem",
            },
            {
              width: "0.43rem",
              height: "0.30rem",
              top: "4.93rem",
              left: "1.31rem",
            },
          ],
        },
        {
          img1: require("@/assets/images/game/game5/5.jpg"),
          img2: require("@/assets/images/game/game5/5-2.jpg"),
          differ: [
            {
              width: "0.38rem",
              height: "0.27rem",
              top: "1.09rem",
              left: "0.83rem",
            },
            {
              width: "0.39rem",
              height: "0.23rem",
              top: "0.77rem",
              left: "3.79rem",
            },
            {
              width: "1.23rem",
              height: "0.96rem",
              top: "1.39rem",
              left: "2.41rem",
            },
            {
              width: "0.32rem",
              height: "0.26rem",
              top: "3.23rem",
              left: "1.08rem",
            },
            {
              width: "1.02rem",
              height: "0.83rem",
              top: "2.71rem",
              left: "3.67rem",
            },
          ],
        },
        {
          img1: require("@/assets/images/game/game5/6.jpg"),
          img2: require("@/assets/images/game/game5/6-2.jpg"),
          differ: [
            {
              width: "0.66rem",
              height: "0.51rem",
              top: "0.96rem",
              left: "0.43rem",
            },
            {
              width: "0.18rem",
              height: "0.22rem",
              top: "1.14rem",
              left: "2.18rem",
            },
            {
              width: "0.70rem",
              height: "0.55rem",
              top: "0.55rem",
              left: "6.16rem",
            },
            {
              width: "0.76rem",
              height: "0.22rem",
              top: "2.19rem",
              left: "3.72rem",
            },
            {
              width: "0.42rem",
              height: "0.48rem",
              top: "3.01rem",
              left: "1.40rem",
            },
            {
              width: "0.24rem",
              height: "0.27rem",
              top: "3.60rem",
              left: "4.66rem",
            },
            {
              width: "1.04rem",
              height: "0.62rem",
              top: "4.07rem",
              left: "2.78rem",
            },
          ],
        },
        {
          img1: require("@/assets/images/game/game5/7.jpg"),
          img2: require("@/assets/images/game/game5/7-2.jpg"),
          differ: [
            {
              width: "0.60rem",
              height: "0.66rem",
              top: "2.20rem",
              left: "0.08rem",
            },
            {
              width: "0.50rem",
              height: "0.37rem",
              top: "1.66rem",
              left: "2.22rem",
            },
            {
              width: "0.22rem",
              height: "0.22rem",
              top: "3.19rem",
              left: "3.17rem",
            },
            {
              width: "0.27rem",
              height: "0.22rem",
              top: "2.62rem",
              left: "4.29rem",
            },
            {
              width: "1.24rem",
              height: "0.78rem",
              top: "0.56rem",
              left: "5.65rem",
            },
            {
              width: "0.56rem",
              height: "0.83rem",
              top: "2.52rem",
              left: "6.25rem",
            },
            {
              width: "0.31rem",
              height: "0.27rem",
              top: "4.81rem",
              left: "6.13rem",
            },
            {
              width: "0.20rem",
              height: "0.16rem",
              top: "1.98rem",
              left: "3.32rem",
            },
          ],
        },
        {
          img1: require("@/assets/images/game/game5/8.jpg"),
          img2: require("@/assets/images/game/game5/8-2.jpg"),
          differ: [
            {
              width: 1.09896 * 1.92 + "rem",
              //   height: "0.47396rem",
              //   top: "2.47396rem",
              //   left: "0.08333rem",
              height: "0.910rem",
              top: "4.75rem",
              left: "0.16rem",
            },
            {
              //   width: "0.32813rem",
              //   height: "0.19271rem",
              //   top: "1.80208rem",
              //   left: "2.6875rem",
              width: "0.63rem",
              height: "0.37rem",
              top: "3.46rem",
              left: "5.16rem",
            },
            {
              //   width: "0.44271rem",
              //   height: "0.45313rem",
              //   top: "0.11458rem",
              //   left: "2.13021rem",

              width: "0.85rem",
              height: "0.87rem",
              top: "0.22rem",
              left: "4.09rem",
            },
            {
              //   width: "0.22917rem",
              //   height: "1.04167rem",
              //   top: "0.55208rem",
              //   left: "0.95313rem",
              width: "0.44rem",
              height: "2.0rem",
              top: "1.06rem",
              left: "1.83rem",
              transform: "rotate(30deg)",
            },
          ],
        },
        {
          img1: require("@/assets/images/game/game5/9.jpg"),
          img2: require("@/assets/images/game/game5/9-2.jpg"),
          differ: [
            {
              width: "0.68rem",
              height: "0.36rem",
              top: "1.53rem",
              left: "4.17rem",
            },
            {
              width: "0.21rem",
              height: "0.31rem",
              top: "3.76rem",
              left: "1.16rem",
            },
            {
              width: "0.50rem",
              height: "0.43rem",
              top: "3.87rem",
              left: "2.35rem",
            },
            {
              width: "0.54rem",
              height: "0.40rem",
              top: "4.82rem",
              left: "0.54rem",
            },
            {
              width: "1.16rem",
              height: "0.64rem",
              top: "3.92rem",
              left: "5.17rem",
            },
            {
              width: "0.17rem",
              height: "0.27rem",
              top: "3.30rem",
              left: "6.58rem",
            },
          ],
        },
        {
          img1: require("@/assets/images/game/game5/10.jpg"),
          img2: require("@/assets/images/game/game5/10-2.jpg"),
          differ: [
            {
              width: "1.17rem",
              height: "0.51rem",
              top: "0.10rem",
              left: "0.47rem",
            },
            {
              width: "0.35rem",
              height: "0.34rem",
              top: "0.12rem",
              left: "2.41rem",
            },
            {
              width: "0.65rem",
              height: "1.29rem",
              top: "1.55rem",
              left: "6.29rem",
            },
            {
              width: "1.30rem",
              height: "0.45rem",
              top: "4.07rem",
              left: "3.20rem",
            },
            {
              width: "0.59rem",
              height: "0.56rem",
              top: "4.99rem",
              left: "3.99rem",
            },
          ],
        },
      ],
      foundArr: [],
      list: [],
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
      this.radioHandle()
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
    },
    randomSort(arr) {
      arr.sort(function () {
        return Math.random() - 0.5
      })
    },
    foundArea(index) {
      if (this.foundArr.indexOf(index) < 0) {
        this.foundArr.push(index)
        if (this.foundArr.length > this.list[this.curIndex].differ.length - 1) {
          setTimeout(() => {
            this.loop()
          }, 1000)
        }
      }
    },
    loop() {
      if (this.curIndex < this.list.length - 1) {
        this.curIndex++
        this.foundArr = []
      } else {
        this.isVisible = true
        this.clearTimer()
        this.strText = `
                    <p>恭喜你，游戏通关！</p>
                    <p>总用时: ${this.time}秒</p>
                `
        setTimeout(async () => {
          this.isVisible = false
          this.$router.go(-1)

          await reportApiAdd({
            cat_name: "心理训练",
            game_name: "大家来找茬",
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
    radioHandle() {
      this.time = 0
      this.list = []
      this.curIndex = 0
      this.clearTimer()
      this.countTime()
      this.randomSort(this.orign)
      this.list = this.orign
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
  box-sizing: border-box;
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
          width: 284px;
          height: 220px;
          margin-bottom: 130px;
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
          justify-content: center;
          > div {
            position: relative;
            width: 700px;
            height: 570px;
            > img {
              width: 700px;
              height: 570px;
            }
            &:nth-child(1) {
              margin-right: 20px;
            }
            > div {
              position: absolute;
              cursor: pointer;
              &.active {
                border: 2px solid #fe4447;
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
