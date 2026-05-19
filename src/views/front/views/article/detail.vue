<template>
  <div class="index">
    <div class="details">
      <div class="module_title">文章详情</div>

      <div class="content_wrapper">
        <div class="scroll_btn prev_btn" @click="scrollContent(-100)">
          <img src="@/assets/img/front/article/上.png" alt="上一页" />
        </div>

        <div class="article_content" ref="contentRef">
          <div class="article_title">
            <img src="@/assets/img/front/article/圆.png" />
            文章：{{ book.title }}
          </div>
          <div class="content_inner" v-html="book.content"></div>
        </div>

        <div class="scroll_btn next_btn" @click="scrollContent(100)">
          <img src="@/assets/img/front/article/下.png" alt="下一页" />
        </div>

        <div class="full_btn" @click="fullShow = true">
          <img src="@/assets/img/front/article/full.png" alt="全屏" />
        </div>
      </div>
    </div>

    <AnimationPopup :show.sync="fullShow">
      <div class="full">
        <div class="text_box" ref="FullcontentRef">
          <p>文章：{{ book.title }}</p>
          <div v-html="book.content"></div>
        </div>
        <div class="btn_box">
          <img
            src="@/assets/img/front/article/full_pre.png"
            alt="上"
            @click="scrollContentFull(-100)"
          />
          <img
            src="@/assets/img/front/article/full_next.png"
            alt="下"
            @click="scrollContentFull(100)"
          />
          <img
            src="@/assets/img/front/article/full_close.png"
            alt="关闭"
            @click="fullShow = false"
          />
        </div>
      </div>
    </AnimationPopup>
  </div>
</template>

<script>
import { articleFrontApiInfo } from "@/server/api/article"

export default {
  data() {
    return {
      book: {},
      fullShow: false,
    }
  },
  created() {
    this.getDetails()
  },
  mounted() {},
  methods: {
    async getDetails() {
      const { data } = await articleFrontApiInfo({
        id: this.$route.query.id,
      })
      if (data.code == this.$global.successCode) {
        console.log(data.data.content)
        this.book = data.data
      }
    },

    scrollContent(offset) {
      const contentEl = this.$refs.contentRef
      if (contentEl) {
        contentEl.scrollTop += offset
      }
    },
    scrollContentFull(offset) {
      const contentEl = this.$refs.FullcontentRef
      if (contentEl) {
        contentEl.scrollTop += offset
      }
    },
  },
  beforeDestroy() {},
}
</script>

<style scoped lang="scss">
.index {
  width: 100%;
  height: 100%;

  .details {
    width: 1580px;
    height: 872px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-image: url(@/assets/img/front/index/kuang.png);
    background-size: 100% 100%;
    .module_title {
      position: absolute;
      top: 90px;
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

    .content_wrapper {
      position: absolute;
      top: 220px;
      left: 50%;
      transform: translateX(-50%);
      width: 1350px;
      height: 475px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .article_title {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        font-size: 20px;
        font-family: "ziyuanyuanti600W";
        font-weight: 600;

        background: linear-gradient(180deg, #ffffff 0%, #1295ff 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;

        > img {
          width: 14px;
          height: 14px;
          margin-right: 10px;
        }
      }

      .scroll_btn {
        width: 75px;
        height: 75px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;

        &:hover {
          transform: scale(1.1);
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .article_content {
        width: 1100px;
        height: 520px;
        border-radius: 8px;

        overflow-y: auto;
        color: #fff;
        font-size: 20px;
        font-family: "ziyuanyuanti400W";
        letter-spacing: 4px;
        line-height: 35px;
      }

      .full_btn {
        width: 70px;
        height: 70px;
        position: absolute;
        bottom: -20px;
        right: 0px;
      }
    }
  }

  .full {
    width: 100vw;
    height: 100vh;
    background-color: #081528;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .text_box {
      width: 1200px;
      height: 100vh;
      background-color: #263448;
      padding: 100px 80px 20px 80px;
      box-sizing: border-box;
      overflow-y: auto;
      > p {
        font-size: 28px;
        font-family: "ziyuanyuanti500W";
        font-weight: 500;
        text-align: left;
        color: #ffffff;
        line-height: 60px;
      }
      > div {
        font-size: 22px;
        font-family: "ziyuanyuanti400W";
        font-weight: 400;
        text-align: left;
        color: #ffffff;
        line-height: 35px;
        letter-spacing: 3px;
      }
    }
    .btn_box {
      width: 70px;
      display: flex;
      flex-wrap: wrap;
      margin-left: 10px;
      position: absolute;
      right: 250px;
      top: 500px;
      > img {
        width: 70px;
        height: 70px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
