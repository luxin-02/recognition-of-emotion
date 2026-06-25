<template>
  <transition name="fade">
    <div class="popup_mask" v-if="isShow">
      <div class="shoot_wrap">
        <div class="popup_title">打卡详情</div>

        <div class="content_wrap">
          <div class="ph_box">
            <img v-if="mainImage" :src="mainImage" />
          </div>
          <div class="details_box">
            <div class="user_info">
              <div>姓名：{{ showText(detailData && detailData.nickname) }}</div>
              <div>点赞量：{{ showText(detailData && detailData.like_num) }}</div>
              <div>性别：{{ showText(detailData && detailData.sex) }}</div>
              <div>照片编号：{{ showText(detailData && detailData.id) }}</div>
              <div>部门：{{ showText(detailData && detailData.class_name) }}</div>
              <div>打卡日期：{{ showText(detailData && detailData.clock_date) }}</div>
            </div>
            <div class="shoot_info">
              <div>
                <p>微笑指数</p>
                <i>{{ showScore(detailData && detailData.smile_index) }}</i>
              </div>
              <div>
                <p>正面情绪</p>
                <i>{{ showScore(detailData && detailData.positive_emotion) }}</i>
              </div>
              <div>
                <p>负面情绪</p>
                <i>{{ showScore(detailData && detailData.negative_emotion) }}</i>
              </div>
              <div>
                <p>心理能力</p>
                <i>{{ showScore(detailData && detailData.mental_ability) }}</i>
              </div>
            </div>
            <div class="resemblance">
              <div class="resemblance_title"><i></i>相似笑容：</div>
              <div class="resemblance_ph">
                <div v-for="(item, index) in resemblanceImages" :key="index">
                  <img v-if="item" :src="item" />
                </div>
              </div>
            </div>

            <div class="upvote" @click="handleLike">
              <img v-if="isLiked" src="@/assets/img/front/smileCheck/已赞.png" />
            </div>
          </div>
        </div>

        <div class="close" @click="cancel()"></div>
      </div>
    </div>
  </transition>
</template>

<script>
import { smileClockDetail, likeSmileClock } from "@/server/api/smileCheck"
export default {
  data() {
    return {
      isShow: false,
      detailData: null,
      likeLoading: false,
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    detailsId: {
      default: "",
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.isShow = this.show
    })
  },
  computed: {
    mainImage() {
      const detailData = this.detailData || {}
      return this.getImageUrl(detailData.image || detailData.avatar)
    },
    resemblanceImages() {
      const detailData = this.detailData || {}
      const list = detailData.similar_list || []
      return list.slice(0, 4).map((item) => this.getImageUrl(item.image || item))
    },
    isLiked() {
      const detailData = this.detailData || {}
      return (
        detailData.is_like == 1 || detailData.is_like === true || detailData.isLike == 1 || detailData.isLike === true
      )
    },
  },
  methods: {
    cancel() {
      this.isShow = false
      this.$emit("update:show", false)
      this.detailData = null
    },

    async getDetails() {
      if (this.detailsId) {
        const { data } = await smileClockDetail({
          id: this.detailsId,
        })
        if (data.code == this.$global.successCode) {
          this.detailData = data.data
        }
      }
    },
    async handleLike() {
      if (!this.detailData || this.likeLoading) {
        return
      }
      this.likeLoading = true
      const liked = this.isLiked
      const likeNum = Number(this.detailData.like_num) || 0
      try {
        const { data } = await likeSmileClock({
          id: this.detailData.id || this.detailsId,
        })
        if (data.code == this.$global.successCode) {
          const nextData = data.data && typeof data.data === "object" ? data.data : null
          if (nextData) {
            this.detailData = {
              ...this.detailData,
              ...nextData,
            }
          }
          if (!nextData || (!("is_like" in nextData) && !("isLike" in nextData))) {
            this.$set(this.detailData, "is_like", liked ? 0 : 1)
          }
          if (!nextData || !("like_num" in nextData)) {
            this.$set(this.detailData, "like_num", liked ? Math.max(likeNum - 1, 0) : likeNum + 1)
          }
        }
      } finally {
        this.likeLoading = false
      }
    },
    getImageUrl(url) {
      if (!url) {
        return ""
      }
      if (/^(https?:)?\/\//.test(url) || /^data:/.test(url)) {
        return url
      }
      return this.$ip + url
    },
    showText(value) {
      return value || value === 0 ? value : "--"
    },
    showScore(value) {
      return `${this.showText(value)}分`
    },
  },
  watch: {
    show(newV) {
      this.isShow = newV
      if (!newV) {
        this.detailData = null
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.popup_mask {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 99;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #00000080;
  font-size: 0;
  .shoot_wrap {
    width: 1227px;
    height: 727px;
    background-image: url(@/assets/img/front/smileCheck/详情框.png);
    background-size: 100% 100%;
    padding: 90px 0 0 0;
    box-sizing: border-box;
    position: relative;
    .close {
      width: 50px;
      height: 50px;
      background-image: url(@/assets/img/front/smileCheck/关闭.png);
      background-size: 100% 100%;
      position: absolute;
      right: 60px;
      top: 80px;
    }
    .popup_title {
      font-size: 30px;
      font-family: "ziyuanyuanti500W";
      text-align: center;
      color: #ffffff;
    }
    .content_wrap {
      width: 87%;
      height: 480px;
      margin: 0 auto;
      margin-top: 60px;
      display: flex;
      justify-content: space-between;
      .ph_box {
        width: 530px;
        height: 480px;
        border-radius: 23px;
        background-image: url(@/assets/img/front/smileCheck/头像框.png);
        background-size: 100% 100%;
        padding: 15px 0 0 15px;
        box-sizing: border-box;
        > img {
          width: 500px;
          height: 450px;
          background: #fff;
          border-radius: 23px;
        }
      }
      .details_box {
        width: 500px;
        height: 480px;
        position: relative;
        .user_info {
          width: 100%;
          height: 188px;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          background-image: url(@/assets/img/front/smileCheck/userinfo_bg.png);
          background-size: 100% 100%;
          padding-top: 15px;
          box-sizing: border-box;
          > div {
            width: 50%;
            height: 50px;
            font-size: 16px;
            color: #fefefe;
            font-family: "ziyuanyuanti500W";
            padding-left: 20px;
            box-sizing: border-box;
          }
        }
        .shoot_info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          > div {
            width: 106px;
            height: 135px;
            font-size: 16px;
            font-family: "ziyuanyuanti400W";
            text-align: center;
            color: #ffffff;
            padding: 60px 0 0 0;
            box-sizing: border-box;
            background-size: 100% 100%;

            &:nth-child(1) {
              background-image: url(@/assets/img/front/smileCheck/微笑指数.png);
              > i {
                color: #35b8fc;
              }
            }
            &:nth-child(2) {
              background-image: url(@/assets/img/front/smileCheck/正面情绪.png);
              > i {
                color: #10c86b;
              }
            }
            &:nth-child(3) {
              background-image: url(@/assets/img/front/smileCheck/负面情绪.png);
              > i {
                color: #f27803;
              }
            }
            &:nth-child(4) {
              background-image: url(@/assets/img/front/smileCheck/心理能力.png);
              > i {
                color: #ff4f95;
              }
            }
          }
        }
        .resemblance {
          width: 100%;
          padding: 0 0 0 10px;
          box-sizing: border-box;
          .resemblance_title {
            display: flex;
            align-items: center;
            font-size: 16px;
            font-family: "ziyuanyuanti500W";
            font-weight: 500;
            color: #ffffff;
            > i {
              width: 4px;
              height: 16px;
              background: #0090ff;
              border-radius: 2px;
              display: block;
              margin-right: 10px;
            }
          }
          .resemblance_ph {
            margin-top: 15px;
            display: flex;
            > div {
              width: 105px;
              height: 95px;
              margin-right: 20px;
              background-image: url(@/assets/img/front/smileCheck/气泡.png);
              background-size: 100% 100%;
              padding: 13px 0 0 15px;
              box-sizing: border-box;
              &:nth-child(2n) {
                background-image: url(@/assets/img/front/smileCheck/气泡2.png);
              }
              > img {
                width: 73px;
                height: 73px;
                border-radius: 50px;
              }
            }
          }
        }

        .upvote {
          width: 32px;
          height: 33px;
          background-image: url(@/assets/img/front/smileCheck/未赞.png);
          background-size: 100% 100%;
          position: absolute;
          right: 10px;
          top: 10px;
          cursor: pointer;
          > img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;

  .popup-box {
    transition: all 0.5s;
  }
}

.fade-enter {
  opacity: 0;

  .popup-box {
    transform: scale(0, 0);
  }
}

.fade-enter-to {
  opacity: 1;

  .popup-box {
    transform: scale(1, 1);
  }
}

.fade-leave {
  opacity: 1;

  .popup-box {
    transform: scale(1, 1);
  }
}

.fade-leave-to {
  opacity: 0;

  .popup-box {
    transform: scale(0, 0);
  }
}
</style>
