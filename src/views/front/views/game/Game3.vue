<template>
  <div class="user-info-box">
    <div class="bread" @click="$router.go(-1)">
      <span>&nbsp;&nbsp;&nbsp;返回</span>
    </div>
    <div>
      <div v-if="curStatus == 1" class="step1" @dblclick="start()">
        <div>开始游戏</div>
        <div>看看你的眼力</div>
        <img src="@/assets/images/game/game3/start.png" alt="" />
        <div>双击即可开始</div>
      </div>
      <div v-else class="step2">
        <div class="top">
          <div>剩余时间：{{ time }} 秒</div>
          <div>关数: {{ level - 2 > 0 ? level - 2 : 0 }}</div>
        </div>
        <div class="body">
          <div class="left">
            <ul v-for="(item, index) in list" :key="index">
              <li class="list">
                <div :class="col" v-for="(sitem, sindex) in item" :key="sindex">
                  <img @click="clickLi(sitem)" :src="sitem" />
                </div>
              </li>
            </ul>
          </div>
          <div class="right">
            <div>
              <p>游戏规则</p>
              <div>来比一比眼力吧，请点击和其他图片不同的图，成功后将自动进入下一关。失败你将被留下。</div>
            </div>
            <div>
              <img src="@/assets/images/game/game3/p.png" alt="" />
              <div>
                <div @click="btnClick(1)">再玩一次</div>
                <div @click="btnClick(2)">换类型</div>
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
      typeList: [
        {
          img: require("@/assets/images/game/game3/1.jpg"),
          found: require("@/assets/images/game/game3/1-1.jpg"),
        },
        {
          img: require("@/assets/images/game/game3/2.jpg"),
          found: require("@/assets/images/game/game3/2-2.jpg"),
        },
        {
          img: require("@/assets/images/game/game3/3.jpg"),
          found: require("@/assets/images/game/game3/3-3.jpg"),
        },
        {
          img: require("@/assets/images/game/game3/4.jpg"),
          found: require("@/assets/images/game/game3/4-4.jpg"),
        },
        {
          img: require("@/assets/images/game/game3/5.jpg"),
          found: require("@/assets/images/game/game3/5-5.jpg"),
        },
      ],
      isClick: true,
      timer: "",
      img1: "",
      img2: "",
      time: 30,
      score: 0,
      level: 1,
      list: [],
      curTypeIndex: 0,
      curImageIndex: 0,
      typeName: "",
      isVisiable: false,
      strText: "",
    }
  },
  mixins: [],
  watch: {
    time: function (n, o) {
      if (n == 0) {
        this.clearTimer()
        this.isVisiable = true
        this.strText = `
                    <p>恭喜你，30秒通关到了第${this.level - 2}关！</p>
                `
        setTimeout(async () => {
          this.isVisiable = false
          this.isClick = false
          await reportApiAdd({
            cat_name: "心理训练",
            game_name: "眼力大比拼",
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
  },
  directives: {},
  filters: {},
  computed: {
    col() {
      return `col${this.level}`
    },
  },
  components: {},
  methods: {
    clearTimer() {
      clearInterval(this.timer)
      this.timer = null
    },
    countTime() {
      this.timer = setInterval(() => {
        this.time--
      }, 1000)
    },
    btnClick(type) {
      if (type != 1) {
        if (this.curImageIndex < this.typeList.length - 1) {
          this.curImageIndex++
        } else {
          this.curImageIndex = 0
        }
      }
      this.clearTimer()
      this.isClick = true
      this.level = 2
      this.time = 30
      this.img1 = this.typeList[this.curImageIndex].img
      this.img2 = this.typeList[this.curImageIndex].found
      this.loop()
      this.countTime()
    },
    getRandomArrayIndex(arr) {
      return Math.ceil(Math.random() * arr.length - 1)
    },
    clickLi(item) {
      if (this.isClick == true) {
        if (this.level != 1) {
          if (item == this.img2) {
            this.start()
          } else {
            this.$toast("", "这张不是你需要找的图片！")
          }
        }
      } else {
        this.$toast("", "请点击按钮才能玩哦！")
      }
    },
    start() {
      this.curStatus = 2
      this.level++
      this.loop()
      if (this.level == 2) {
        this.countTime()
      }
    },
    reset(data, level) {
      var newData = []
      var len = level //截取的数量
      for (var i = 0; i < data.length; i++) {
        var arr = data.slice(i, i + level)
        newData.push(arr)
        i = i + len - 1
      }
      return newData
    },
    loop() {
      this.list = []
      this.list = Array.from({ length: Math.pow(this.level, 2) }, (item, index) => {
        return this.img1
      })
      let item = this.img2
      this.list.splice(this.getRandomArrayIndex(this.list), 1, item)
      this.list = this.reset(this.list, this.level)
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.img1 = this.typeList[this.curImageIndex].img
    this.img2 = this.typeList[this.curImageIndex].found
    this.loop()
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
            margin-right: 201px;
            width: 558px;
            height: 558px;
            > ul {
              width: 558px;
              > li {
                display: flex;
                justify-content: center;
                align-items: center;
                > div {
                  padding: 5px;
                  box-sizing: border-box;
                  > img {
                    width: 100%;
                    height: 100%;
                  }
                  &.col1 {
                    width: 558px;
                    height: 558px;
                  }
                  &.col2 {
                    width: calc(558px / 2);
                    height: calc(558px / 2);
                  }
                  &.col3 {
                    width: calc(558px / 3);
                    height: calc(558px / 3);
                  }
                  &.col4 {
                    width: calc(558px / 4);
                    height: calc(558px / 4);
                  }
                  &.col5 {
                    width: calc(558px / 5);
                    height: calc(558px / 5);
                  }
                  &.col6 {
                    width: calc(558px / 6);
                    height: calc(558px / 6);
                  }
                  &.col7 {
                    width: calc(558px / 7);
                    height: calc(558px / 7);
                  }
                  &.col8 {
                    width: calc(558px / 8);
                    height: calc(558px / 8);
                  }
                  &.col9 {
                    width: calc(558px / 9);
                    height: calc(558px / 9);
                  }
                  &.col10 {
                    width: calc(558px / 10);
                    height: calc(558px / 10);
                  }
                  &.col11 {
                    width: calc(558px / 11);
                    height: calc(558px / 11);
                  }
                  &.col12 {
                    width: calc(558px / 12);
                    height: calc(558px / 12);
                  }
                  &.col13 {
                    width: calc(558px / 13);
                    height: calc(558px / 13);
                  }
                  &.col14 {
                    width: calc(558px / 14);
                    height: calc(558px / 14);
                  }
                  &.col15 {
                    width: calc(558px / 15);
                    height: calc(558px / 15);
                  }
                  &.col16 {
                    width: calc(558px / 16);
                    height: calc(558px / 16);
                  }
                  &.col17 {
                    width: calc(558px / 17);
                    height: calc(558px / 17);
                  }
                  &.col18 {
                    width: calc(558px / 18);
                    height: calc(558px / 18);
                  }
                  &.col19 {
                    width: calc(558px / 19);
                    height: calc(558px / 19);
                  }
                  &.col20 {
                    width: calc(558px / 20);
                    height: calc(558px / 20);
                  }
                  &.col21 {
                    width: calc(558px / 21);
                    height: calc(558px / 21);
                  }
                  &.col22 {
                    width: calc(558px / 22);
                    height: calc(558px / 22);
                  }
                  &.col23 {
                    width: calc(558px / 23);
                    height: calc(558px / 23);
                  }
                  &.col24 {
                    width: calc(558px / 24);
                    height: calc(558px / 24);
                  }
                  &.col25 {
                    width: calc(558px / 25);
                    height: calc(558px / 25);
                  }
                  &.col26 {
                    width: calc(558px / 26);
                    height: calc(558px / 26);
                  }
                  &.col27 {
                    width: calc(558px / 27);
                    height: calc(558px / 27);
                  }
                  &.col28 {
                    width: calc(558px / 28);
                    height: calc(558px / 28);
                  }
                  &.col29 {
                    width: calc(558px / 29);
                    height: calc(558px / 29);
                  }
                  &.col30 {
                    width: calc(558px / 30);
                    height: calc(558px / 30);
                  }
                }
              }
            }
          }
          > div.right {
            width: 440px;
            > div:nth-child(1) {
              width: 386px;
              height: 368px;
              background: url(@/assets/images/game/game3/dialog.png) no-repeat;
              background-size: 386px 368px;
              padding: 44px 20px 0 33px;
              box-sizing: border-box;
              > p {
                height: 24px;
                line-height: 24px;
                font-size: 24px;
                font-weight: 700;
                color: #333333;
                margin-bottom: 24px;
                text-align: center;
              }
              > div {
                width: 333px;
                height: 34px;
                line-height: 34px;
                font-size: 21px;
                color: #333333;
                text-align: left;
              }
            }
            > div:nth-child(2) {
              display: flex;
              > img {
                width: 120px;
                height: 130px;
                display: block;
                margin-left: 70px;
                margin-right: 40px;
              }
              > div {
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
