<template>
  <div class="index">
    <div class="brainwaveGame">
      <div class="module_title">
        <img src="@/assets/img/front/scale/1.png" alt="" />
        评估简介
        <i>-----------</i>
        <img src="@/assets/img/front/scale/22.png" alt="" />
        心理评估
        <i>-----------</i>
        <img src="@/assets/img/front/scale/3.png" alt="" />
        评估分析
      </div>
      <div class="content_box">
        <div class="right">
          <p class="right_title">{{ topicTpye.info.title }}</p>
          <!-- <p class="questionTypes">题型：{{ "单选" }}</p> -->
          <p class="question">
            {{ topicTpye.atPresent }} 、{{ currentTopic.question }}
          </p>
          <div class="tabControl_box">
            <p
              :class="[
                'option_p',
                currentTopic.select == item.option_answer ? 'active' : '',
              ]"
              v-for="(item, index) in currentTopic.answers"
              :key="index"
              @click="selectClick(currentTopic.question_id, item)"
            >
              {{ item.option_answer }}
            </p>
          </div>

          <div class="btn_box">
            <button
              class="last_btn"
              @click="topicTpye.atPresent !== 1 ? topicTpye.atPresent-- : ''"
            >
              上一题
            </button>
            <button
              class="next_btn"
              @click="
                topicTpye.atPresent !== topicTpye.topic.length
                  ? topicTpye.atPresent++
                  : ''
              "
            >
              下一题
            </button>

            <div class="nextQuestion">
              <p class="next_text">自动跳题:</p>
              <input
                type="checkbox"
                class="nextQuestion_check"
                v-model="nextQuestion"
              />
              <p class="next_text">{{ nextQuestion ? "开启" : "关闭" }}</p>
            </div>
          </div>

          <div class="btn_box2">
            <!-- <button class="btnOk" v-loading="saveLoading" @click="accomplish">
              测试完成
            </button> -->
            <!-- <button class="quit" @click="quit">退出测试</button> -->
          </div>
        </div>

        <div class="left">
          <div class="timepiece">
            <div class="timepiece_text">
              测试时间<img src="@/assets/img/front/scale/时钟.png" />
            </div>
            <div class="timepiece_num">{{ topicTime | formatTime }}</div>
          </div>

          <div class="topicNumber_box" v-loading="numberLoading">
            <div class="dtqk">答题情况</div>

            <ul id="topicUl">
              <li
                :class="[
                  'number',
                  questionId.some((id) => item.question_id == id)
                    ? 'active'
                    : '',
                ]"
                v-for="(item, i) in topicTpye.topic"
                :key="i"
                @click="topicTpye.atPresent = i + 1"
              >
                {{ i + 1 }}
              </li>
            </ul>

            <div class="submit" v-loading="saveLoading" @click="accomplish">
              提交答卷
            </div>
          </div>

          <!-- <div class="estimationTime">
            <p class="estimation">测评用时：</p>
            <p class="time">{{ topicTime | formatTime }}</p>
          </div> -->
        </div>
      </div>
    </div>
    <!-- :show.sync="dialog.show" -->

    <qt-Dialog :show.sync="dialog.show" title="量表测评目的或简介" @save="save">
      <div class="p_box">
        <p class="dialog_p">
          {{ this.topicTpye.info.introduce }}
        </p>
      </div>
    </qt-Dialog>
    <!-- :show.sync="tourist.show" -->
    <qt-Dialog
      :show="false"
      title="测试结果"
      @save="$toUrl('/psychologicalTests')"
      @cancel="$toUrl('/psychologicalTests')"
    >
      <div class="p_box">
        <div v-for="(item, i) in tourist.reportText" :key="i">
          <p class="dialog_p" style="margin-bottom: 0.06rem">
            {{ item.categoryName + " : " + item.categoryScores }}
          </p>
          <p class="dialog_p" style="margin-bottom: 0.06rem">
            {{ item.degree }}
          </p>
          <p
            class="dialog_p"
            style="margin-bottom: 0.3rem"
            v-html="item.result"
          ></p>
        </div>
      </div>
    </qt-Dialog>

    <xt-Dialog :show.sync="quitShow" @save="$goRetreat()">
      <p class="quitShow_p">确定要退出吗？</p>
    </xt-Dialog>
  </div>
</template>

<script>
import {
  frontGaugeReportApiSubmit,
  frontGaugeApiInfo,
} from "@/server/api/guage"
import bicycleDataMixin from "@/mixins/bicycleDataMixin.js"
export default {
  mixins: [bicycleDataMixin],
  data() {
    return {
      numberLoading: false,
      triangleTop: false,
      triangleBottom: true,
      nextQuestion: true, //自动跳转下一题
      // 题目数据
      topicTpye: {
        atPresent: 1, //当前题
        //题目序号
        topic: [],
        info: {},
      },
      dialog: {
        show: false,
      },
      tourist: {
        show: false,
        reportText: "",
      },
      quitShow: false,
      //得分
      score: [],
      // 答完题目id,得分
      questionId: [],
      //答案选中高亮
      topicChecked: "",
      //使用时间
      topicTime: 0,
      showTimeCObj: null,
      //当前题目
      currentTopic: {},
      dsq: null,
      saveLoading: false,
      heartArr: [],
      heartArrTimer: null,
    }
  },
  computed: {},
  watch: {
    topicTpye: {
      handler(newval, oldval) {
        let result = this.topicTpye.topic.filter(
          (item) => item.question_id == newval.atPresent,
        )
        // console.log(newval);
        this.currentTopic = result[0]
        console.log(this.currentTopic)
        if (newval.atPresent % 21 == 0) {
          this.triangle("next")
        }

        return
      },
      deep: true,
    },
  },
  created() {
    this.getTopicList()

    window.goHistoryFn = this.goRetreat
  },
  mounted() {
    clearInterval(this.heartArrTimer)
    this.heartArrTimer = setInterval(() => {
      this.heartArr.push(this.bicycleData.heart)
      if (this.heartArr.length > 6000) {
        this.heartArr.shift()
      }
    }, 1000)
    this.showTimeCObj = setInterval(() => {
      this.topicTime += 1
    }, 1000)
  },
  filters: {
    // 秒转分钟
    formatTime(time) {
      var hours = Math.floor(time / 3600)
      var minutes = Math.floor(Math.floor(time % 3600) / 60)
      var seconds = Math.floor(time % 60)
      var h = hours.toString().length === 1 ? `0${hours}` : hours
      var m = minutes.toString().length === 1 ? `0${minutes}` : minutes
      var s = seconds.toString().length === 1 ? `0${seconds}` : seconds
      return `${h}:${m}:${s}`
    },
  },
  methods: {
    goRetreat() {
      this.$popup({
        title: "提示",
        content: "确定要退出吗？将不产生成绩。",
        saveFoo: () => {
          window.goHistoryFn = undefined
          this.$goRetreat()
        },
      })
    },
    //退出
    quit() {
      this.quitShow = true
      // this.$router.push('/psychologicalTests')
    },
    // 完成
    async accomplish() {
      // console.log(this.topicTpye.topic, this.questionId);
      if (this.topicTpye.topic.length !== this.questionId.length) {
        // this.$message({
        //   showClose: true,
        //   message: "未完整作答",
        //   type: "warning",
        //   offset: 60,
        // });
        this.$myMessage.error("未完整作答")
        return
      }
      if (this.saveLoading) return
      this.saveLoading = true
      try {
        /**计算平均值 */
        function getAvg(arr, flength = 0) {
          if (arr.length == 0) {
            return 0
          }
          let sum = arr.reduce((acc, val) => acc + val, 0)
          return +(sum / arr.length).toFixed(flength)
        }
        function getMin(arr) {
          arr = arr.filter((v) => {
            return v > 0
          })
          if (arr.length == 0) {
            return 0
          }
          return Math.min(...arr)
        }
        function getMax(arr) {
          if (arr.length == 0) {
            return 0
          }
          return Math.max(...arr)
        }

        let brainObj = {
          heart_min: getMin(this.heartArr),
          heart_max: getMax(this.heartArr),
          heart_avg: getAvg(this.heartArr),
          heart_arr: this.heartArr,
        }
        const { data } = await frontGaugeReportApiSubmit({
          id: this.$route.query.id,
          questionScore: this.score,
          seconds: this.topicTime,
          color_json: brainObj,
        })

        if (data.code == this.$global.successCode) {
          console.log(data.data)
          if (data.data.record_id) {
            // this.$router.push({
            //   name: "reportDetails",
            //   query: {
            //     id: data.data.record_id,
            //     reportClass: "scale",
            //   },
            // });
          } else {
            this.tourist.reportText = data.data.record_result
            this.tourist.show = true
          }
          // this.$myMessage.success("提交成功,可前往报告中心查看结果！")
          this.$goRetreat()
          setTimeout(() => {
            this.saveLoading = false

            this.$router.push({
              path: "/report/details",
              query: {
                id: data.data.record_id,
                type: "测评报告",
              },
            })
          }, 50)
        }
      } catch (error) {
      } finally {
      }
    },
    //弹出层
    save() {
      this.dialog.show = false
      clearInterval(this.showTimeCObj)
      this.showTimeCObj = setInterval(() => {
        this.topicTime += 1
      }, 1000)
    },
    triangle(v) {
      var element = document.getElementById("topicUl") // 获取需要滚动的元素
      if (v == "pre") {
        element.scrollTop -= 220
      }
      if (v == "next") {
        element.scrollTop += 220
      }
      //   element.clientHeight + element.scrollTop == element.scrollHeight
      //     ? (this.triangleBottom = false)
      //     : (this.triangleBottom = true);

      element.scrollTop <= 0
        ? (this.triangleTop = false)
        : (this.triangleTop = true)
    },
    //自动切换下一页
    selectClick(id, item) {
      this.score.push({ question_id: id, score: item.option_score })
      this.questionId.push(id)
      this.topicChecked = item.option_answer

      let newArr = []
      let obj = {}
      for (var i = 0; i < this.score.length; i++) {
        if (!obj[this.score[i].question_id]) {
          newArr.push(this.score[i])
          obj[this.score[i].question_id] = true
        }
      }
      let newArr1 = [...new Set(this.questionId)]
      this.questionId = newArr1
      this.score = newArr
      // console.log(this.score);
      this.currentTopic.select = item.option_answer
      if (this.nextQuestion) {
        if (this.topicTpye.atPresent == this.topicTpye.topic.length) return
        clearTimeout(this.dsq)
        this.dsq = setTimeout(() => {
          this.topicTpye.atPresent++
        }, 50)
      }
    },

    async getTopicList() {
      this.numberLoading = true
      try {
        const { data } = await frontGaugeApiInfo({
          id: this.$route.query.id,
        })
        if (data.code == this.$global.successCode) {
          this.topicTpye.topic = data.data.question_list
          this.topicTpye.info = data.data.info
        }
      } catch (error) {
      } finally {
        this.numberLoading = false
        this.triangle()
      }
    },
  },
  beforeDestroy() {
    window.goHistoryFn = undefined
    clearInterval(this.heartArrTimer)
    clearInterval(this.showTimeCObj)
  },
}
</script>

<style scoped lang="scss">
.index {
  width: 100%;
  height: 100%;

  .dialog_p,
  .quitShow_p {
    line-height: 30px;
    opacity: 0.7;
    font-size: 16px;
    font-family: "ziyuanyuanti400W";
    color: #ffffff;
    letter-spacing: -0.45px;
  }
  .p_box {
    overflow: hidden;
    overflow: auto;
    height: 300px;
    width: 600px;
    box-sizing: border-box;
    padding: 0 10px;
    &::-webkit-scrollbar {
      display: none; //滚动条隐藏
    }
  }
  .quitShow_p {
    margin-top: 20px;
    text-align: center;
    font-size: 20px;
  }
}
.brainwaveGame {
  width: 1500px;
  height: 810px;
  position: absolute;
  left: 50%;
  top: 43%;
  transform: translate(-50%, -50%);
  padding: 160px 0 0 80px;
  box-sizing: border-box;
  background-image: url(@/assets/img/front/index/biankuang.png);
  background-size: 100% 100%;
  .module_title {
    width: 800px;
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

  .content_box {
    width: 100%;
    height: 100%;
    display: flex;
    .left {
      width: 430px;
      height: 560px;
      position: relative;
      .timepiece {
        width: 100%;
        height: 180px;
        background-color: #082047;
        border-radius: 20px;
        .timepiece_text {
          font-size: 22px;
          font-family: "ziyuanyuanti500W";
          font-weight: 500;
          color: #ffffff;
          display: flex;
          justify-content: center;
          padding: 20px 0 0 0;
          box-sizing: border-box;
          > img {
            width: 26px;
            height: 25px;
            margin-left: 5px;
          }
        }
        .timepiece_num {
          width: 315px;
          height: 82px;
          background: rgba(164, 164, 164, 0.1);
          border: 1px solid #0080ff;
          border-radius: 8px;
          box-shadow: 0px 0px 13px 0px #0080ff;
          margin: 20px auto 0 auto;
          text-align: center;
          line-height: 80px;

          font-size: 40px;
          font-family: "ziyuanyuanti600W";
          font-weight: 600;
          color: #00a6ff;
        }
      }
      .topicNumber_box {
        width: 100%;
        height: 360px;
        padding: 20px 55px 0 55px;
        box-sizing: border-box;
        margin-top: 20px;
        border-radius: 20px;
        position: relative;
        background-color: #082047;
        ul {
          display: flex;
          flex-wrap: wrap;
          max-height: 210px;
          overflow: hidden;
          overflow: auto;
          &::-webkit-scrollbar {
            display: none;
          }
          .number {
            width: 40px;
            height: 40px;
            border-radius: 5px;
            text-align: center;
            line-height: 40px;
            margin-right: 15px;
            margin-bottom: 15px;
            color: #fff;
            cursor: pointer;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-sizing: border-box;
            &:nth-child(6n + 6) {
              margin-right: 0;
            }
          }
          .active {
            background: #0096ff;
            border: none;
          }
        }
        .submit {
          width: 100%;
          height: 40px;
          background: #008aff;
          border-radius: 4px;
          margin: 0 auto;
          text-align: center;
          line-height: 40px;
          font-size: 16px;
          font-family: "ziyuanyuanti500W";
          font-weight: 500;
          color: #ffffff;
          margin-top: 15px;
        }
        .dtqk {
          font-size: 18px;
          font-family: "ziyuanyuanti400W";
          color: #fff;
          text-align: center;
          margin-bottom: 20px;
        }
      }

      .estimationTime {
        position: absolute;
        left: 0;
        bottom: 100px;
        margin-left: 60px;
        line-height: 30px;
        display: flex;
        .estimation {
          font-size: 18px;
          font-family: "ziyuanyuanti400W";
          color: #00b4ff;
        }
        .time {
          font-size: 18px;
          font-family: "ziyuanyuanti400W";
          color: #00b4ff;
        }
      }

      .nextQuestion {
        position: absolute;
        left: 0;
        bottom: 70px;
        margin-left: 60px;
        margin-top: 20px;
        display: flex;
        line-height: 18px;
        .nextQuestion_check {
          width: 16px;
          height: 16px;
          margin: 2px 8px 0 15px;
          cursor: pointer;
        }
        .next_text {
          font-size: 17px;
          font-family: "ziyuanyuanti400W";
          color: #00b4ff;
        }
      }

      .btn_box {
        position: absolute;
        bottom: 40px;
        left: 50%;
        transform: translate(-50%);
        display: flex;
        button {
          width: 100px;
          height: 42px;
          border-radius: 6px;
          color: #fff;
          font-size: 18px;
          font-family: Microsoft YaHei, Microsoft YaHei-Bold;
          font-weight: 700;
          color: #ffffff;
        }
        .btnOk {
          background-color: #0cce6b;
          margin-right: 80px;
        }
        .quit {
          background-color: #ff5b49;
        }
      }
    }

    .right {
      width: 880px;
      height: 560px;
      margin-right: 20px;
      border-radius: 20px;
      background-color: #082047;
      position: relative;

      .activeBtn {
        opacity: 0.5;
      }
      .right_title {
        font-size: 18px;
        font-family: "ziyuanyuanti400W";
        text-align: left;
        letter-spacing: 1.8px;
        margin: 20px 0 0 40px;
        color: #00b4ff;
      }
      .questionTypes {
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei-Bold;
        font-weight: 700;
        color: #1391cf;
        margin-top: 20px;
        margin-left: 60px;
      }
      .question {
        width: 780px;
        font-size: 18px;
        font-family: "ziyuanyuanti400W";
        color: #fff;
        margin: 8px 0 0 40px;
      }

      .tabControl_box {
        margin: 30px 0 0 40px;
        width: 780px;
        height: 330px;
        overflow-y: scroll;
        overflow-x: hidden;
        &::-webkit-scrollbar {
          display: none;
          // width: 8px;
          // border-radius: 5px;
        }
        // &::-webkit-scrollbar-track {
        //   background: #33333305;
        // }
        // &::-webkit-scrollbar-thumb {
        //   display: block;
        //   border-radius: 6px;
        //   background: #33333310;
        // }
        // &::-webkit-scrollbar-thumb:hover {
        //   background-color: #00aeff93;
        // }

        .option_p {
          width: 780px;
          min-height: 50px;
          border-radius: 6px;
          font-family: "ziyuanyuanti400W";
          line-height: 50px;
          padding-left: 30px;
          margin-bottom: 20px;
          box-sizing: border-box;
          color: #fff;
          box-shadow: 0px 0px 20px 0px rgba(0, 192, 255, 0.65) inset;
          background: #002345, rgba(192, 192, 192, 0);
          border: 1px solid #0080ff;

          cursor: pointer;
          &:last-child {
            margin-bottom: 0;
          }
        }
        .active {
          color: #fff;
          background: rgba(0, 149, 255, 0.7);
          border: 1px solid #81d4ff;
          border-radius: 5px;
          box-shadow: 0px 0px 20px 0px #0078ff, 0px 0px 59px 0px #008aff inset;
        }
      }

      .btn_box {
        display: flex;
        position: absolute;
        bottom: 30px;
        left: 40px;
        button {
          width: 120px;
          height: 40px;
          border-radius: 4px;
          font-size: 16px;
          font-family: "ziyuanyuanti400W";
          color: #fefefe;
          margin-right: 20px;
          background: #008aff;
          // &:active {
          //   background-color: #5fafff;
          // }
        }

        .nextQuestion {
          // position: absolute;
          // left: 0;
          // bottom: 70px;
          // margin-left: 60px;
          margin-top: 10px;
          display: flex;
          line-height: 18px;
          .nextQuestion_check {
            width: 16px;
            height: 16px;
            margin: 2px 8px 0 15px;
            cursor: pointer;
          }
          .next_text {
            font-size: 17px;
            font-family: "ziyuanyuanti400W";
            color: #00b4ff;
          }
        }

        // .next_btn {
        //   background: #00aeff;
        // }
        // .last_btn {
        //   background-color: #ffaf00;
        // }
      }

      .btn_box2 {
        display: flex;
        position: absolute;
        bottom: 0;
        right: 40px;
        > button {
          width: 120px;
          height: 40px;
          border-radius: 5px;
          margin-right: 20px;
          color: #fff;
          font-family: "ziyuanyuanti400W";
          font-size: 16px;
          background: #1a71c2;
          border: 1px solid #81d4ff;
          box-shadow: 0px 0px 10px 0px #0054ff;

          // &.btnOk {
          //   background: linear-gradient(to right, #5376f3, #1dd2e3);
          // }
          // &.quit {
          //   margin-right: 0;
          //   background: linear-gradient(to right, #f22e25, #f7700d);
          // }

          ::v-deep .el-loading-mask {
            top: -1px;
            bottom: -1px;
          }
        }
      }
    }
  }
}
</style>
