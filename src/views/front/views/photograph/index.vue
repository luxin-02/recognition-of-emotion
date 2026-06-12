<template>
  <div class="ph_wrap">
    <div class="index">
      <div class="module_title">
        <i>-----------</i>
        <img src="@/assets/img/front/ph/1.png" alt="" />
        {{ $route.meta.title }}
        <i>-----------</i>
      </div>
      <div class="class_wrap">
        <div class="line"></div>
        <div class="scroll_box">
          <button
            @click="
              () => {
                atClass = item
                getPhlist()
              }
            "
            v-for="(item, i) in classList"
            :key="i"
            :class="[item.id == atClass.id ? 'active' : '']"
          >
            {{ item.title }}
          </button>
        </div>
      </div>

      <div class="ph_list">
        <div class="pre" @click="preFn">
          <img src="@/assets/img/front/ph/上箭头.png" />上一项
        </div>
        <div class="scroll_box">
          <div
            class="item"
            v-for="(item, i) in phList"
            :key="i"
            :class="[item.id == atPhData.id ? 'active' : '']"
            @click="phClick(item, i)"
          >
            <el-image :src="$ip + item.cover" lazy></el-image>
            <span>{{ item.title }}</span>
          </div>
        </div>
        <div class="next" @click="nextFn">
          <img src="@/assets/img/front/ph/下箭头.png" />下一项
        </div>
      </div>

      <div class="ph_wrap" v-if="atPhData">
        <!-- <img class="ph" src="" /> -->
        <el-image :src="$ip + atPhData.cover" lazy></el-image>
        <div class="name_box">
          <div>当前图片：{{ atPhData.title }}</div>
          <div>{{ phIndex }} /{{ total }}</div>
        </div>
        <div class="btn_wrap">
          <div class="left">
            <div @click="preFn">上一张</div>
            <div class="line"></div>
            <div @click="nextFn">下一张</div>
            <div class="line"></div>
          </div>

          <div class="right" @click="fullShow = true">
            <div class="line"></div>
            <img src="@/assets/img/front/ph/全屏.png" />全屏
          </div>
        </div>
      </div>
    </div>
    <AnimationPopup :show.sync="fullShow">
      <div class="full_screen">
        <img :src="$ip + atPhData.cover" />
        <button @click="fullShow = false">退出全屏</button>
      </div>
    </AnimationPopup>
  </div>
</template>

<script>
import {
  cognitionClassFrontApiList,
  cognitionFrontApiList,
} from "@/server/api/cognition"
export default {
  data() {
    return {
      classList: "",
      atClass: "",
      phList: "",
      atPhData: "",
      phIndex: 1,
      total: 0,
      fullShow: false,
    }
  },
  mounted() {
    this.getClass()
  },
  methods: {
    async getClass() {
      const { data } = await cognitionClassFrontApiList()
      if (data.code == this.$global.successCode) {
        this.classList = data.data
        this.atClass = data.data[0]
        this.getPhlist()
      }
    },
    async getPhlist() {
      const { data } = await cognitionFrontApiList({
        cog_class_id: this.atClass.id,
        page_size: 99999,
      })
      if (data.code == this.$global.successCode) {
        this.phList = data.data.data
        if (this.phList.length) {
          this.atPhData = data.data.data[0]
          this.total = data.data.total
          this.phIndex = 1
        } else {
          this.atPhData = ""
          this.total = 0
          this.phIndex = 1
        }

        console.log(data.data)
      }
    },
    phClick(item, i) {
      this.atPhData = item
      this.phIndex = i + 1
    },
    preFn() {
      if (this.phIndex <= 1) return
      this.phIndex--
      this.atPhData = this.phList[this.phIndex - 1]
    },
    nextFn() {
      if (this.phIndex == this.total) return
      this.phIndex++
      this.atPhData = this.phList[this.phIndex - 1]
    },
  },
}
</script>

<style scoped lang="scss">
.ph_wrap {
  width: 100%;
  height: 100%;
  .index {
    width: 1600px;
    height: 840px;
    padding: 165px 0 0 90px;
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    top: 43%;
    transform: translate(-50%, -50%);
    z-index: 3;
    display: flex;
    background-image: url(@/assets/img/front/index/biankuang.png);
    background-size: 100% 100%;
    .module_title {
      position: absolute;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 24px;
      font-family: "ziyuanyuanti500W";
      color: #fff;
      > img {
        width: 60px;
        height: 60px;
      }
      > i {
        font-size: 30px;
        font-weight: 400;
        font-family: "ziyuanyuanti400W";
        color: #aed6ffad;
        display: inline-block;
        margin: 0 10px;
      }
    }
    .class_wrap {
      width: 180px;
      height: 600px;
      position: relative;
      padding: 50px 0 0 0;
      box-sizing: border-box;

      .scroll_box {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        &::-webkit-scrollbar {
          display: none;
        }
        > button {
          width: 140px;
          height: 50px;
          border-radius: 25px;
          font-size: 20px;
          color: #ffffff;
          letter-spacing: 1px;
          font-family: "ziyuanyuanti400W";
          line-height: 40px;
          margin-bottom: 20px;
          background: #00000000;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &.active {
            background: #00a6fc;
          }
        }
      }

      .line {
        position: absolute;
        right: 0;
        top: 0;
        width: 1px;
        height: 440px;
        background-image: url(@/assets/img/front/index/line.png);
        background-size: 100% 100%;
      }
    }
    .ph_list {
      width: 380px;
      height: 600px;
      margin: 0 15px 0 35px;
      position: relative;
      font-family: "ziyuanyuanti400W";
      .pre,
      .next {
        width: 380px;
        height: 60px;
        background: #115488;
        border-radius: 5px;
        position: absolute;
        left: 0;
        font-size: 20px;
        text-align: center;
        color: #ffffff;
        line-height: 60px;
        letter-spacing: 1px;
        display: flex;
        align-items: center;
        justify-content: center;
        > img {
          width: 16px;
          height: 9px;
          margin-right: 10px;
        }
      }
      .pre {
        top: 0;
      }
      .next {
        bottom: 0;
      }

      .scroll_box {
        width: 380px;
        height: 460px;
        margin-top: 70px;
        overflow: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
        > .item {
          width: 380px;
          height: 100px;
          background: #3a4961;
          border-radius: 5px;
          margin-bottom: 10px;
          padding: 0px 0 0 15px;
          box-sizing: border-box;
          font-size: 18px;
          text-align: left;
          color: #ffffff;
          letter-spacing: 0.9px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: flex;
          align-items: center;
          &:last-child {
            margin-bottom: 0;
          }
          &.active {
            background: #00a6fc;
          }
          ::v-deep .el-image {
            width: 120px;
            height: 65px;
            margin-right: 10px;
            border-radius: 10px;
          }
          > span {
            width: 220px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          // > img {
          //   width: 120px;
          //   height: 65px;
          //   margin-right: 10px;
          // }
        }
      }
    }
    .ph_wrap {
      height: 600px;
      width: 815px;
      background: #061d34;
      border-radius: 10px;
      overflow: hidden;
      .ph {
        width: 815px;
        height: 460px;
      }
      ::v-deep > .el-image {
        width: 815px;
        height: 460px;
      }
      .name_box {
        height: 60px;
        font-size: 20px;
        color: #ffffff;
        line-height: 60px;
        letter-spacing: 1px;
        display: flex;
        justify-content: space-between;
        padding: 0 30px;
        box-sizing: border-box;
        border-bottom: 1px solid #fff;
        > div:nth-of-type(1) {
          width: 600px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .btn_wrap {
        height: 70px;
        width: 815px;
        font-family: "ziyuanyuanti400W";
        font-size: 18px;
        text-align: left;
        color: #ffffff;
        display: flex;
        justify-content: space-between;
        .left {
          display: flex;
          align-items: center;
          > div {
            width: 120px;
            height: 100px;
            line-height: 100px;
            text-align: center;
          }
          .line {
            width: 1px;
            height: 50px;
            background-image: url(@/assets/img/front/ph/line.png);
            background-size: 100% 100%;
          }
        }
        .right {
          width: 120px;
          height: 100px;
          line-height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          > img {
            width: 18px;
            height: 17px;
            margin-right: 5px;
          }
          .line {
            width: 1px;
            height: 50px;
            background-image: url(@/assets/img/front/ph/line.png);
            background-size: 100% 100%;
            position: absolute;
            left: 0;
            top: 30px;
          }
        }
      }
    }
  }

  .full_screen {
    width: 100vw;
    height: 100vh;
    > button {
      width: 80px;
      height: 32px;
      border-radius: 20px;
      background: #00000050;
      color: #fff;
      font-size: 14px;
      font-family: "ziyuanyuanti400W";
      position: absolute;
      right: 10px;
      top: 10px;
    }
    > img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
