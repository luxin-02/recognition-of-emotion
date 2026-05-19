<template>
  <div class="home">
    <div class="main-box">
      <div class="top_box">
        <div class="user_ph">
          <img class="ph" :src="$store.getters.userAvatar" />
          <div class="hytext">
            欢迎您,<i>{{ $store.getters.isAdmin ? "管理员" : "" }}</i
            >{{ $store.getters.userInfo.nickname }}
          </div>
          <img
            class="logout"
            @click="logout"
            src="@/assets/img/front/home/logout.png"
          />
        </div>

        <div class="top_right">
          <div @click="$router.push('/company')">企业概括</div>
          <div @click="$router.push('/set')">系统设置</div>
          <div @click="$router.push('/userInfo')">个人中心</div>
        </div>
      </div>

      <div class="neir_wrap">
        <div class="left">
          <div class="user_info">
            <div>姓名：{{ $store.getters.userInfo.nickname }}</div>
            <div>账号：{{ $store.getters.userInfo.username }}</div>
            <div  v-if=" $store.getters.userInfo.depts.length">
              部门：{{
                $store.getters.userInfo.depts.length
                  ? $store.getters.userInfo.depts[0].class_name
                  : "无"
              }}
            </div>
            <i>个人资料</i>
          </div>

          <div class="synthetical">
            <div class="synthetical_title"><i></i>综合数据：</div>

            <div class="number_box">
              <div>训练数：15次</div>
              <div>评估数：12次</div>
            </div>
            <br />
            <div class="synthetical_title"><i></i>训练数据详情：</div>
            <div id="data_chart"></div>
          </div>
        </div>
        <div class="middle">
          <div>
            <div><i>微笑打卡</i></div>
            <div><i>情绪检测</i></div>
          </div>
          <div>
            <div class="model_tetx">
              <div class="xlly">心理疗愈</div>
              <div class="xly">欢迎踏入心灵栖息地 <br />开启心灵之旅！</div>
              <button>开始探索</button>
            </div>
            <div class="item_list">
              <div @click="$router.push('/music')">音乐主题</div>
              <div @click="$router.push('/article')">微笑科普</div>
              <div @click="$router.push('/video')">心理视频</div>
            </div>
          </div>
        </div>
        <div class="right">
          <div @click="$router.push('/clockIn')"><i>心情记录</i></div>
          <div><i>心理体验</i></div>
          <div @click="$router.push('/scale')"><i>心理评估</i></div>
          <div><i>报告中心</i></div>
        </div>
      </div>
    </div>

    <!-- <div class="date_of_production">Copyright ©2026 - 中育普德</div> -->
  </div>
</template>

<script>
import { frontApiSettingInfoInLogin } from "@/server/api/system"
import { userBackApiLogout } from "@/server/api/user.js"
import { getTodayMoodRecord } from "@/server/api/mood"
import * as echarts from "echarts"
export default {
  data() {
    return {
      todayMood: "",
      qxList: [
        {
          img: require("@/assets/img/front/clockIn/Emoji_超开心.png"),
          name: "超开心",
          i: 1,
        },
        {
          img: require("@/assets/img/front/clockIn/Emoji_开心.png"),
          name: "开心",
          i: 2,
        },
        {
          img: require("@/assets/img/front/clockIn/Emoji_还行.png"),
          name: "还行",
          i: 3,
        },
        {
          img: require("@/assets/img/front/clockIn/Emoji_不开心.png"),
          name: "不爽",
          i: 4,
        },
        {
          img: require("@/assets/img/front/clockIn/Emoji_超烂.png"),
          name: "超烂",
          i: 5,
        },
      ],
      chartTitle: ["训练1", "训练2", "训练3", "训练4", "训练5", "训练6"],
      chartScores: [12, 45, 65, 75, 3, 44],
      dataChartRef: null,
    }
  },
  computed: {
    currentMood() {
      if (!this.todayMood || !this.todayMood.mood) {
        return null
      }
      // 在qxList中查找对应的心情
      return this.qxList.find((item) => item.i == this.todayMood.mood)
    },
  },

  created() {},
  async mounted() {
    // this.getSystemInfo();
    // await this.getTodayMoodRecordFn()
    this.dataChartRef = echarts.init(document.getElementById("data_chart"))
    await this.dataChart(this.chartTitle, this.chartScores)
  },
  methods: {
    // 获取初始设置
    async getSystemInfo() {
      const { data } = await frontApiSettingInfoInLogin()
      if (data.code == 200) {
        data.data.sphere = data.data.sphere ?? "0"
        data.data.sphere_transparency = +(data.data.sphere_transparency ?? 100)
        data.data.sphere_effects = +(data.data.sphere_effects ?? 50)
        data.data.sphere_game_effects = +(data.data.sphere_game_effects ?? 50)
        this.$store.commit("UPDATE_SYS_INFO", data.data)
      }
    },
    logout() {
      this.$popup({
        title: "提示",
        content: "确认退出登录？",
        saveFoo: () => {
          userBackApiLogout()
          setTimeout(() => {
            this.$store.commit("SET_USER_INFO", null)
            this.$router.push("/login")
          }, 200)
        },
      })
    },
    async getTodayMoodRecordFn() {
      const { data } = await getTodayMoodRecord()
      if (data.code == this.$global.successCode) {
        console.log(data)
        this.todayMood = data.data
      }
    },

    async dataChart(title, scores) {
      var myChart = this.dataChartRef
      window.addEventListener("resize", function () {
        myChart.resize({})
      })
      var option = {
        animation: false,
        color: ["#333", "#666", "#999"],
        grid: {
          // 让图表占满容器
          top: "20px",
          left: "40px",
          right: "20px",
          bottom: "30px",
        },
        xAxis: {
          axisTick: {
            show: false, // 不显示坐标轴刻度线
          },
          axisLabel: {
            textStyle: {
              fontSize: 12,
              fontWeight: 400,
            },
            interval: 0,
          },
          type: "category",
          data: title,
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: true,
            //实线
            lineStyle: {
              type: "soild",
            },
          },
          axisLabel: {
            textStyle: {
              fontSize: 14,
            },
          },
        },
        series: [
          {
            // label: {
            //   //柱体上显示数值
            //   show: false, //开启显示
            //   position: "top", //在上方显示
            //   textStyle: {
            //     //数值样式
            //     fontSize: "10px",
            //     color: "#666",
            //   },
            //   formatter: "{c}",
            // },
            data: scores,
            type: "bar",
            barWidth: 10,
            backgroundStyle: {
              color: "rgba(111, 162, 135, 0.2)",
            },
            itemStyle: {
              normal: {
                //柱形图圆角，初始化效果
                barBorderRadius: [50, 50, 0, 0],
                //这里是颜色
                color: function (params) {
                  var colorList = [
                    "#30aee5",
                    "#1bc7ba",
                    "#f26f61",
                    "#18b6c9",
                    "#0cce6b",
                    "#8867db",
                    "#0cce6b",
                    "#f26f61",
                    "#1bc7ba",
                    "#0cce6b",
                    "#f26f61",
                    "#18b6c9",
                    "#0cce6b",
                    "#8867db",
                    "#0cce6b",
                  ]
                  return colorList[params.dataIndex]
                },
              },
            },
          },
        ],
      }
      myChart.setOption(option)
      // let chartImg = myChart.getDataURL(option)
    },
  },
  beforeDestroy() {},
}
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  height: 100%;
  position: fixed;

  .main-box {
    // background-color: antiquewhite;
    position: absolute;
    left: 145px;
    right: 145px;
    bottom: 0;
    top: 160px;
    .top_box {
      width: 100%;
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      .user_ph {
        width: 360px;
        height: 85px;
        background-image: url(@/assets/img/front/home/user_ph.png);
        background-size: 100% 100%;
        display: flex;
        justify-content: space-between;
        padding: 15px 30px 0 20px;
        box-sizing: border-box;
        .ph {
          width: 45px;
          height: 45px;
          border-radius: 50%;
        }
        .hytext {
          font-size: 20px;
          font-family: "ziyuanyuanti400W";
          font-weight: 400;
          color: #ffffff;
          margin-top: 10px;
          > i {
            color: #d87f06;
          }
        }
        .logout {
          width: 25px;
          height: 21px;
          margin-top: 10px;
        }
      }
      .top_right {
        height: 130px;
        width: 405px;
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        font-family: "ziyuanyuanti500W";
        font-weight: 500;
        text-align: center;
        color: #ffffff;
        > div {
          width: 126px;
          height: 131px;
          padding-top: 95px;
          box-sizing: border-box;
          background-size: 100% 100%;
          &:nth-child(1) {
            background-image: url(@/assets/img/front/home/企业概括.png);
          }
          &:nth-child(2) {
            background-image: url(@/assets/img/front/home/系统设置.png);
          }
          &:nth-child(3) {
            background-image: url(@/assets/img/front/home/个人中心.png);
          }
        }
      }
    }

    .neir_wrap {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      .left {
        width: 500px;
        height: 590px;
        background-size: 100% 100%;
        background-image: url(@/assets/img/front/home/left_bg.png);
        position: relative;
        .user_info {
          font-size: 16px;
          font-family: "ziyuanyuanti400W";
          color: #ffffff;
          position: absolute;
          left: 250px;
          top: 110px;
          > i {
            display: block;
            font-size: 13px;
            color: #ffffff;
            width: 105px;
            height: 45px;
            line-height: 34px;
            text-align: center;
            background: #00000000;
            background-image: url(@/assets/img/front/home/个人资料.png);
            background-size: 100% 100%;
            margin-top: 10px;
          }
        }

        .synthetical {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          width: 470px;
          height: 322px;
          padding: 20px 20px 0 20px;
          box-sizing: border-box;
          .synthetical_title {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            > i {
              width: 4px;
              height: 15px;
              background: #0090ff;
              border-radius: 2px;
              display: block;
              font-size: 16px;
              font-family: "ziyuanyuanti400W";
              color: #333333;
              margin-right: 8px;
            }
          }
          .number_box {
            display: flex;
            justify-content: space-between;
            padding: 0 15px;
            > div {
              width: 190px;
              height: 57px;
              border-radius: 10px;
              background-size: 100% 100%;
              font-size: 16px;
              font-family: "ziyuanyuanti500W";
              text-align: center;
              line-height: 57px;
              &:nth-child(1) {
                color: #008bff;
                background-image: url(@/assets/img/front/home/训练数.png);
              }
              &:nth-child(2) {
                color: #ff8939;
                background-image: url(@/assets/img/front/home/评估数.png);
              }
            }
          }
          #data_chart {
            width: 430px;
            height: 140px;
          }
        }
      }
      .middle {
        width: 650px;
        height: 590px;
        > div {
          &:nth-child(1) {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            > div {
              width: 318px;
              height: 287px;
              background-size: 100% 100%;
              padding: 40px 0 0 30px;
              box-sizing: border-box;
              > i {
                font-size: 32px;
                height: 32px;
                font-family: "ziyuanyuanti500W";
                letter-spacing: 0.3px;
                color: #ffffff;
              }
              &:nth-child(1) {
                background-image: url(@/assets/img/front/home/微笑打卡.png);
                > i {
                  background: linear-gradient(97deg, #cc638c 1%, #ffd666 100%);
                  -webkit-background-clip: text;
                  color: transparent;
                }
              }
              &:nth-child(2) {
                background-image: url(@/assets/img/front/home/情绪检测.png);
                > i {
                  background: linear-gradient(-90deg, #72ddff 1%, #2565ed 100%);
                  -webkit-background-clip: text;
                  color: transparent;
                }
              }
            }
          }
          &:nth-child(2) {
            width: 650px;
            height: 287px;
            background-size: 100% 100%;
            background-image: url(@/assets/img/front/home/心里疗愈.png);
            position: relative;
            .model_tetx {
              position: absolute;
              left: 73px;
              top: 58px;
              .xlly {
                height: 26px;
                font-size: 26px;
                font-family: "ziyuanyuanti500W";
                color: #ffffff;
                background: linear-gradient(-90deg, #fff89b 1%, #ff692d 100%);
                -webkit-background-clip: text;
                color: transparent;
              }
              .xly {
                margin: 20px 0;
                font-size: 16px;
                font-family: "ziyuanyuanti400W";
                color: #ffffff;
              }
              > button {
                background-color: #00000000;
                color: #fff;
                font-size: 16px;
              }
            }
            .item_list {
              position: absolute;
              right: 45px;
              top: 43px;
              > div {
                width: 200px;
                line-height: 67px;
                font-size: 20px;
                font-family: "ziyuanyuanti400W";
                color: #ffffff;
              }
            }
          }
        }
      }
      .right {
        width: 455px;
        height: 590px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: space-between;
        > div {
          width: 220px;
          height: 287px;
          background-size: 100% 100%;
          padding: 30px 0 0 30px;
          box-sizing: border-box;
          > i {
            font-size: 28px;
            height: 28px;
            font-family: "ziyuanyuanti500W";
            letter-spacing: 0.3px;
            color: #ffffff;
          }
          &:nth-child(1) {
            background-image: url(@/assets/img/front/home/心情记录.png);
            > i {
              background: linear-gradient(97deg, #cc638c 1%, #ffd666 100%);
              -webkit-background-clip: text;
              color: transparent;
            }
          }
          &:nth-child(2) {
            background-image: url(@/assets/img/front/home/心理体验.png);
            > i {
              background: linear-gradient(-90deg, #72ddff 1%, #2565ed 100%);
              -webkit-background-clip: text;
              color: transparent;
            }
          }
          &:nth-child(3) {
            background-image: url(@/assets/img/front/home/心理评估.png);
            > i {
              background: linear-gradient(97deg, #dfba7a 1%, #5bd5b7 100%);
              -webkit-background-clip: text;
              color: transparent;
            }
          }
          &:nth-child(4) {
            background-image: url(@/assets/img/front/home/报告中心.png);
            > i {
              background: linear-gradient(97deg, #cc638c 1%, #ffd666 100%);
              -webkit-background-clip: text;
              color: transparent;
            }
          }
        }
      }
    }
  }

  .date_of_production {
    opacity: 0.5;
    font-size: 16px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: left;
    color: #ffffff;
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translate(-50%);
  }
}
</style>
