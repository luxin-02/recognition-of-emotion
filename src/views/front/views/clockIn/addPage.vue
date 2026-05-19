<template>
  <div class="ph_wrap">
    <div class="index">
      <div class="module_title">心情记录</div>

      <div class="qx_sele">
        <div v-for="(img, i) in qxList" :key="i" @click="currentQx = img">
          <img :src="img.img" v-show="currentQx.name != img.name" />
          <img :src="img.gif" v-show="currentQx.name == img.name" />
          <p :class="{ active: currentQx.name == img.name }">
            {{ img.name }}
          </p>
        </div>

        <div class="input_textarea">
          <el-input type="textarea" placeholder="说点什么？" v-model="qxText">
          </el-input>
        </div>

        <button class="issue" @click="issue">
          {{ $route.query.mood ? "修改心情" : "发布心情" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { addMood } from "@/server/api/mood"

export default {
  data() {
    return {
      qxList: [
        {
          img: require("@/assets/img/front/clockIn/超开心.png"),
          gif: require("@/assets/img/front/clockIn/超开心.gif"),
          name: "超开心",
          i: 1,
        },
        {
          img: require("@/assets/img/front/clockIn/开心.png"),
          gif: require("@/assets/img/front/clockIn/开心.gif"),
          name: "开心",
          i: 2,
        },
        {
          img: require("@/assets/img/front/clockIn/还行.png"),
          gif: require("@/assets/img/front/clockIn/还行.gif"),
          name: "还行",
          i: 3,
        },
        {
          img: require("@/assets/img/front/clockIn/不爽.png"),
          gif: require("@/assets/img/front/clockIn/不爽.gif"),
          name: "不爽",
          i: 4,
        },
        {
          img: require("@/assets/img/front/clockIn/超烂.png"),
          gif: require("@/assets/img/front/clockIn/超烂.gif"),
          name: "超烂",
          i: 5,
        },
      ],

      currentQx: "",
      qxText: "",
    }
  },
  mounted() {
    if (this.$route.query.mood) {
      this.currentQx = {
        name: this.$route.query.name || "",
        i: this.$route.query.mood || "",
      }
      this.qxText = this.$route.query.text || ""
    }
  },
  methods: {
    async issue() {
      if (!this.currentQx.name) {
        this.$myMessage({
          type: "font-error",
          message: "请选择心情!",
        })
        return
      }

      // font-success

      const { data } = await addMood({
        mood: this.currentQx.i,
        text: this.qxText,
        time: this.$route.query.day,
      })
      if (data.code == this.$global.successCode) {
        this.$myMessage({
          type: "font-success",
          message: data.msg,
        })
        this.currentQx = ""
        this.qxText = ""
      }
    },
  },
}
</script>

<style scoped lang="scss">
.ph_wrap {
  width: 100%;
  height: 100%;
  .index {
    width: 1580px;
    height: 872px;
    padding: 200px 100px 0 100px;
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    display: flex;
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

    .qx_sele {
      width: 100%;
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      //   margin-top: 50px;
      > div {
        > img {
          width: 260px;
          height: 260px;
        }
        > p {
          width: 165px;
          height: 80px;
          font-family: "ziyuanyuanti500W";
          font-size: 20px;
          text-align: center;
          color: #ffffff;
          line-height: 80px;
          margin: 0 auto;
          &.active {
            background-image: url("@/assets/img/front/clockIn/btn.png");
            background-size: 100% 100%;
          }
        }
      }

      .input_textarea {
        width: 1055px;
        height: 160px;
        margin-top: 10px;
        ::v-deep .el-textarea__inner {
          background: #010f21;
          border-radius: 14px;
          width: 1055px;
          height: 160px;
          border: none;
          resize: none;

          font-size: 18px;
          font-family: "ziyuanyuanti500W";
          font-weight: 500;
          color: #ffffff;
          line-height: 30px;
        }
      }

      .issue {
        margin: 0 auto;
        width: 167px;
        height: 51px;
        background: #0370ff;
        border-radius: 9px;
        font-size: 18px;
        font-family: "ziyuanyuanti500W";
        font-weight: 500;
        color: #ffffff;
        position: absolute;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
