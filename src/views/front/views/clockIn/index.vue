<template>
  <div class="ph_wrap">
    <div class="index">
      <div class="module_title">心情记录</div>

      <div class="date_sele">
        <div>心情详情：</div>
        <div>
          日期选择：
          <el-date-picker
            v-model="dateTimestamp"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </div>
      </div>

      <div class="mood_today">
        <img v-if="hasMoodData" :src="currentMood.gif || currentMood.gif" />
        <img v-else src="@/assets/img/front/clockIn/还行.png" />
        <p v-if="hasMoodData">今日心情：{{ currentMood.name }}</p>
        <p v-else>尚未设置今日心情</p>
        <p>当前日期：{{ $formatDate(dateTimestamp, "yyyy-MM-dd") }}</p>
        <div class="qx_text" v-if="atMoodData && atMoodData.text">
          {{ atMoodData.text }}
        </div>
        <div class="qx_text" v-else>暂无心情描述</div>
      </div>

      <div class="btn_box">
        <button @click="delMoodFn">删除心情</button>
        <button @click="toAddPage">
          {{ hasMoodData ? "修改心情" : "添加心情" }}
        </button>
        <button @click="toPeriodPage">情绪周期</button>
      </div>
    </div>
  </div>
</template>

<script>
function getCurrentDateFormatted() {
  const now = new Date()
  // 获取年、月、日，并补 0（确保是两位数）
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0") // 补 0，例如 1 → 01
  const day = String(now.getDate()).padStart(2, "0") // 补 0，例如 9 → 09

  return `${year}-${month}-${day}`
}
import { getMood, delMood } from "@/server/api/mood"
export default {
  data() {
    return {
      getCurrentDateFormatted,
      dateTimestamp: Math.floor(Date.now()),
      pickerOptions: {
        disabledDate(time) {
          // 限制只能选择今日及之前的日期
          return time.getTime() > Date.now()
        },
      },
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

      atMoodData: "",
    }
  },
  computed: {
    // 根据atMoodData中的id查找对应的心情
    currentMood() {
      if (!this.atMoodData || !this.atMoodData.mood) {
        return null
      }
      // 在qxList中查找对应的心情
      return this.qxList.find((item) => item.i == this.atMoodData.mood)
    },
    // 判断是否有心情数据
    hasMoodData() {
      return this.currentMood !== null && this.currentMood !== undefined
    },
  },
  watch: {
    dateTimestamp() {
      this.getMoodFn()
    },
  },
  mounted() {
    this.getMoodFn()
  },
  methods: {
    toAddPage() {
      if (this.$store.getters.isGuest) {
        this.$myMessage.error("游客暂无权限")
        return
      }

      this.$router.push({
        path: "/clockIn/addPage",
        query: {
          day: Math.floor(this.dateTimestamp / 1000),
          mood: this.currentMood?.i || "",
          name: this.currentMood?.name || "",
          text: this.atMoodData?.text || "",
        },
      })
    },
    toPeriodPage() {
      this.$router.push({ path: "/clockIn/periodPage" })
    },
    async getMoodFn() {
      const { data } = await getMood({
        day: Math.floor(this.dateTimestamp / 1000),
      })
      if (data.code == this.$global.successCode) {
        this.atMoodData = data.data
        console.log(this.atMoodData)
        console.log(this.currentMood)
      }
    },
    async delMoodFn() {
      if (!this.hasMoodData) {
        this.$myMessage({
          type: "font-error",
          message: "请先添加心情",
        })
        return
      }
      this.$popup({
        title: "提示",
        content: "是否确认删除？",
        saveFoo: async () => {
          const { data } = await delMood({
            ids: this.atMoodData.id,
          })
          if (data.code == this.$global.successCode) {
            this.$myMessage({
              type: "font-success",
              message: data.msg,
            })
            this.getMoodFn()
          }
        },
      })
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
    padding: 200px 150px 0 150px;
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

    .date_sele {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #285bf0;
      > div {
        color: #fff;
        font-size: 18px;
        font-family: "ziyuanyuanti400W";
        display: flex;
        align-items: center;
        ::v-deep .el-input__inner {
          background: #13306e;
          border-color: #285bf0;
          color: #fff;
        }
      }
    }

    .mood_today {
      position: absolute;
      top: 250px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      color: #fff;
      font-size: 18px;
      font-family: "ziyuanyuanti500W";
      line-height: 35px;
      > img {
        width: 260px;
        height: 260px;
      }
      .qx_text {
        width: 1000px;
        height: 100px;
        overflow: auto; /* 改为auto，只在需要时显示滚动条 */
        word-wrap: break-word; /* 允许长单词换行 */
        word-break: break-all; /* 强制所有文字换行 */
        white-space: normal; /* 允许换行 */
        ::-webkit-scrollbar {
          display: none;
        }
      }
    }

    .btn_box {
      position: absolute;
      top: 700px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 550px;
      height: 60px;
      > button {
        width: 167px;
        height: 51px;
        border-radius: 9px;
        font-size: 18px;
        font-weight: 500;
        color: #ffffff;
        &:nth-child(1) {
          background: red;
        }
        &:nth-child(2) {
          background: #0370ff;
        }
        &:nth-child(3) {
          background: #ff9703;
        }
      }
    }
  }
}
</style>
