<template>
  <div class="scale">
    <div class="module_title">评估列表</div>

    <div class="class_list">
      <div class="class_wrap">
        <div class="prev" @click="scrollLeft"></div>
        <div class="item_scroll" ref="itemScroll">
          <div
            :class="[atClass.id == item.id ? 'active' : '']"
            @click="atClassFn(item)"
            v-for="(item, i) in classList"
            :key="i"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="next" @click="scrollRight"></div>
      </div>
      <div class="scroll">
        <div
          v-for="item in gaugeList.list"
          :key="item.id"
          @click="atGauge = item"
          :class="[atGauge.id == item.id ? 'active' : '']"
        >
          <img :src="$ip + item.thumb" :alt="item.title" />
          <div>
            <div class="scale_title">{{ item.title }}</div>
            <div class="scale_num">{{ item.views }}人测评过</div>
          </div>
        </div>
      </div>
    </div>

    <div class="intro_wrap">
      <div class="intro_text">评估简介</div>
      <div class="intro_content">
        {{ atGauge && atGauge.introduce ? atGauge.introduce : '' }}
      </div>
      <div class="begin" @click="gaugeFn">开始评估</div>
    </div>
  </div>
</template>

<script>
import { gaugeApiClassList, frontGaugeApiList } from "@/server/api/guage"
export default {
  data() {
    return {
      classList: [],
      atClass: {},
      gaugeList: {
        list: [],
        page: 1,
        total: 0,
      },
      gaugeLoading: false,
      atGauge: {},
    }
  },
  mounted() {
    this.getClassList()
    // this.getGaugeList()
  },
  methods: {
    async getClassList() {
      const { data } = await gaugeApiClassList()
      if (data.code == this.$global.successCode) {
        this.classList = data.data
        this.atClass = this.classList[0]
        this.$nextTick(() => {
          this.getGaugeList()
        })
      }
    },
    scrollLeft() {
      const scroll = this.$refs.itemScroll
      scroll.scrollLeft -= 200
    },
    scrollRight() {
      const scroll = this.$refs.itemScroll
      scroll.scrollLeft += 200
    },
    async getGaugeList(page) {
      if (page) {
        this.gaugeList.page = page
      }
      this.gaugeLoading = true
      try {
        const { data } = await frontGaugeApiList({
          cat_id: this.atClass.id,
          page: this.gaugeList.page,
          page_size: 9999,
          is_show: 1,
        })
        if (data.code == this.$global.successCode) {
          console.log(data)
          this.gaugeList.total = data.data.total
          this.gaugeList.list = data.data.list
          if (this.gaugeList.list && this.gaugeList.list.length > 0) {
            this.atGauge = this.gaugeList.list[0]
          } else {
            this.atGauge = {}
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.gaugeLoading = false
      }
    },
    gaugeFn() {
      this.$router.push({
        path: "/scale/details",
        query: {
          id: this.atGauge.id,
        },
      })
    },
    atClassFn(v) {
      this.atClass = v
      this.getGaugeList(1)
      console.log(v);
      
    },
  },
  //   activated() {
  //     if (this.Ls_firstComplete) {
  //       this.getGaugeList()
  //     } else {
  //       this.Ls_firstComplete = true
  //     }
  //   },
}
</script>

<style scoped lang="scss">
.scale {
  width: 1580px;
  height: 872px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-image: url(@/assets/img/front/index/kuang.png);
  background-size: 100% 100%;
  display: flex;
  justify-content: space-between;
  padding: 180px 80px 0 80px;
  box-sizing: border-box;
  z-index: 2;

  .module_title {
    position: absolute;
    top: 95px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 32px;
    height: 33px;
    line-height: 33px;
    font-family: "ziyuanyuanti600W";
    color: #fff;
    background: linear-gradient(0deg, #85a7ff 0%, #ffffff 100%);
    -webkit-background-clip: text;
    color: transparent;
  }
  .class_list {
    width: 476px;
    height: 580px;
    margin-top: 10px;
    // overflow-y: auto;
    // &::-webkit-scrollbar {
    //   display: none;
    // }
    .class_wrap {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      .prev,
      .next {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        background-size: 100% 100%;
        &.prev {
          margin-right: 10px;
          background-image: url(@/assets/img/front/scale/prev.png);
        }
        &.next {
          margin-left: 10px;
          background-image: url(@/assets/img/front/scale/next.png);
        }
      }
      .item_scroll {
        width: 80%;
        height: 40px;
        display: flex;
        overflow-x: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        > div {
          flex-shrink: 0;
          min-width: 120px;
          height: 40px;
          background: #123d72;
          border-radius: 20px;
          margin-right: 8px;
          font-size: 20px;
          font-family: "ziyuanyuanti400W";
          font-weight: 400;
          text-align: center;
          color: #ffffff;
          line-height: 40px;
          padding: 0 15px;
          box-sizing: border-box;
          &:last-child {
            margin-right: 0;
          }
          &.active {
            background: #285bf0;
          }
        }
      }
    }
    .scroll {
      width: 476px;
      height: 520px;
      margin-top: 10px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      > div {
        width: 100%;
        height: 106px;
        background-image: url(@/assets/img/front/scale/class_bg.png);
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        > img {
          width: 75px;
          height: 75px;
          margin: 0 20px;
        }
        > div {
          font-family: "ziyuanyuanti400W";
          font-weight: 400;
          .scale_title {
            width: 340px;
            font-size: 22px;
            color: #ffffff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .scale_num {
            font-size: 17px;
            color: #ffffff;
            opacity: 0.3;
            margin-top: 10px;
          }
        }
        &.active {
          background-image: url(@/assets/img/front/scale/active.png);
        }
      }
    }
  }

  .intro_wrap {
    width: 920px;
    height: 600px;
    background-image: url(@/assets/img/front/scale/intro.png);
    background-size: 100% 100%;

    .intro_text {
      font-size: 22px;
      font-family: "ziyuanyuanti500W";
      font-weight: 500;
      text-align: center;
      line-height: 40px;
      color: #fff;
      background: #0080ff;
      width: 150px;
      height: 45px;
      border-radius: 30px;
      margin: 40px auto;
    }
    .intro_content {
      width: 830px;
      height: 350px;
      margin: 0 auto;
      font-size: 18px;
      font-family: "ziyuanyuanti400W";
      font-weight: 400;
      color: #ffffff;
      line-height: 36px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .begin {
      width: 352px;
      height: 46px;
      background: #1a71c2;
      border: 1px solid #00a8ff;
      border-radius: 4px;
      box-shadow: 0px 0px 8px 0px #0054ff;
      color: #fff;
      text-align: center;
      line-height: 46px;
      margin: 35px auto;
      font-family: "ziyuanyuanti400W";
      font-weight: 400;
      font-size: 20px;
    }
  }
}
</style>
