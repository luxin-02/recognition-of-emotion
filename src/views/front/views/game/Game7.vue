<template>
  <div class="user-info-box">
    <div class="bread" @click="$router.go(-1)">
      <span>&nbsp;&nbsp;&nbsp;返回</span>
    </div>
    <div>
      <div v-if="curStatus == 1" class="step1" @dblclick="start()">
        <div>开始游戏</div>
        <div>想成为最强大脑吗？</div>
        <img src="@/assets/images/game/game7/start.png" alt="" />
        <div>双击即可开始</div>
      </div>
      <div v-else class="step2">
        <div class="top">
          <!-- <div>游戏进度：{{ level }}/∞</div> -->
          <div>游戏进度：{{ 1 }}/∞</div>
          <div>当前步数：{{ steps }}</div>
          <div>用时：{{ time }} 秒</div>
        </div>
        <div class="body">
          <div class="left">
            <div
              class="item item-color1"
              :class="item == 0 ? 'item-color1' : 'item-color2'"
              :style="{
                height: `${100 / level}%`,
                width: `${100 / level}%`,
              }"
              v-for="(item, key) in list"
              :key="key"
              @click="handleCurrentIndex(key)"
            ></div>
          </div>
          <div class="right">
            <div>
              <p>游戏规则</p>
              <div>
                每点击一个方块，该方块和上下左右4个格子的方块会出现反色（原来是红色变成黄色，原来是黄色变成红色），请把所有方块变成黄色。成功后将自动过关，失败你将被留下。
              </div>
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
      timer: null,
      isVisiable: false,
      strText: "",
      time: 0,

      list: [],
      successList: [],
      level: 5,
      steps: 0,
      currentSteps: 0,
      isLoading: true,
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
    /**
     * 赋值
     */
    handleList() {
      this.steps = 0
      this.time = 0
      this.countTime()
      this.list = []
      for (let i = 0; i < this.level * this.level; i++) {
        this.list.push(0)
      }
      this.isFlag = true
    },
    handleCurrentIndex(currentIndex) {
      this.steps++
      //当前
      this.setList(currentIndex)
      // 上一级
      if (currentIndex > this.level - 1) {
        const upLevelIndex = currentIndex - this.level
        this.setList(upLevelIndex)
      }
      // 下一级
      if (currentIndex < (this.level - 1) * this.level) {
        const downLevelIndex = currentIndex + this.level
        this.setList(downLevelIndex)
      }
      //左
      if (currentIndex % this.level !== 0) {
        const leftLevelIndex = currentIndex - 1
        this.setList(leftLevelIndex)
      }
      //右
      if ((currentIndex + 1) % this.level !== 0) {
        const rightLevelIndex = currentIndex + 1
        this.setList(rightLevelIndex)
      }
      this.checkList()
    },
    checkList() {
      let isSuccess = true
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i] === 0) {
          isSuccess = false
        }
      }
      if (isSuccess) {
        this.isVisiable = true
        this.clearTimer()
        this.strText = `
                    <p>恭喜你，游戏通关！</p>
                    <p>您一共花了${this.steps}步！</p>
                    <p>总用时${this.time}秒</p>
                `
        setTimeout(async () => {
          this.level++
          this.handleList()
          this.isVisiable = false
          await reportApiAdd({
            cat_name: "心理训练",
            game_name: "板块迭代",
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
    /**
     * 修改
     */
    setList(index) {
      this.$set(this.list, index, this.handleVal(this.list[index]))
    },
    /**
     * 判断1还是0
     */
    handleVal(value) {
      let val = value === 1 ? 0 : 1
      return val
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
            height: 570px;
            width: 570px;
            display: flex;
            flex-flow: row wrap;
            align-content: flex-start;
            margin-right: 218px;
            .item {
              box-shadow: 2px 2px 2px 0px #fff inset;
              cursor: pointer;
            }
            .item-color1 {
              background: #ff6b6b;
            }
            .item-color2 {
              background: #ffe66d;
            }
          }
          > div.right {
            width: 440px;
            > div:nth-child(1) {
              width: 480px;
              height: 222px;
              background: url(@/assets/images/game/game7/dialog.png) no-repeat;
              background-size: 480px 222px;
              padding: 20px 30px 0 30px;
              box-sizing: border-box;
              > p {
                height: 24px;
                line-height: 24px;
                font-size: 24px;
                font-weight: 700;
                color: #333333;
                margin-bottom: 20px;
                text-align: center;
              }
              > div {
                text-indent: 2em;
                width: 100%;
                height: 34px;
                line-height: 34px;
                font-size: 19px;
                color: #333333;
                text-align: left;
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
