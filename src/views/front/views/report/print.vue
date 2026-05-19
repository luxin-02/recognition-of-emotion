<template>
  <print-box ref="print_box">
    <div class="wrap" ref="targetHtml">
      <div class="class_title">心理评估分析报告</div>
      <div class="content_wrap">
        <div class="mk_title"><i></i>基本信息</div>
        <div class="user_info">
          <div>
            <div>
              所属名称： <i>{{ reportData.gauge_title }}</i>
            </div>
            <div>
              本次报告用时：
              <i>{{ $formatTime(reportData.total_seconds, "HHH:mmm:sss") }}</i>
            </div>
            <div>
              结果生成时间：
              <i>{{
                $formatDate2(reportData.add_time * 1000, "yyyy-MM-dd")
              }}</i>
            </div>
          </div>
          <div>
            <div>
              测评用户： <i>{{ reportData.nickname }}</i>
            </div>
            <div>
              性别： <i>{{ reportData.sex }}</i>
            </div>
            <div>
              年龄： <i>{{ reportData.age }}</i>
            </div>
          </div>
          <div>
            <div>
              所在部门： <i>{{ reportData.class_name }}</i>
            </div>
            <div>
              编号： <i>{{ reportData.studentID }}</i>
            </div>
            <div>
              所在单位： <i>{{ reportData.unit }}</i>
            </div>
          </div>
          <div>
            <div>
              注册账号： <i>{{ reportData.username }}</i>
            </div>
            <div>
              账号类型： <i>{{ $store.getters.roleInfo.name }}</i>
            </div>
            <div>
              联系电话： <i>{{ reportData.phone }}</i>
            </div>
          </div>
        </div>
        <br />

        <template v-if="type == '测评报告'">
          <div
            class="mk_title"
            v-if="
              reportData.record_result && reportData.record_result.length > 1
            "
          >
            <i></i>报告分析
          </div>
          <br />
          <!-- <div class="radarMap" ref="radarMap"></div> -->
          <img
            v-if="
              reportData.record_result && reportData.record_result.length > 1
            "
            class="radarMap"
            :src="chartImg"
          />
          <br />
          <br />
          <div class="mk_title"><i></i>报告结果</div>
          <div v-for="(item, i) in reportData.record_result" :key="i">
            <div class="mk2_title">
              <img src="@/assets/img/front/report/yuan.png" />
              {{ item.gradeName }} - {{ item.prop + "%" }}
            </div>
            <!-- <el-progress
              :percentage="item.prop"
              :color="customColors"
              :stroke-width="10"
              define-back-color="#091628"
            ></el-progress> -->

            <div class="jdt">
              <div
                :style="{
                  width: item.prop + '%',
                  backgroundColor: getJdtColor(item.prop),
                }"
              >
                -
              </div>
            </div>
          </div>

          <div class="mk2_title">
            <img src="@/assets/img/front/report/yuan.png" />
            诊断说明
          </div>
          <div class="explain_text">
            <div v-for="(item, i) in reportData.record_result" :key="i">
              <p>{{ item.gradeName }}</p>
              <p>{{ item.degree }}</p>
              <p>说明：{{ item.result }}</p>
              <p>得分：{{ item.scores }} , 分数占比：{{ item.prop }}%</p>
              <br />
            </div>
          </div>
        </template>

        <template v-else>
          <div class="mk_title"><i></i>报告结果</div>
          <div class="explain_text" v-html="reportData.result"></div>
          <br />
          <div class="mk_title"><i></i>报告建议</div>
          <div class="explain_text" v-html="reportData.suggest"></div>
        </template>

        <div class="mk2_title">
          <img src="@/assets/img/front/report/yuan.png" />
          推荐方案
        </div>
        <div class="project">
          <div v-for="(item, i) in reportData.recommend" :key="i">
            {{ item }}
          </div>
        </div>

        <br /><br />
      </div>
    </div>

    <!-- <div class="mk2_title">
      <img src="@/assets/img/front/report/yuan.png" />
      抑郁障碍
    </div>
    <div class="jdt">
      <div
        :style="{
          width: percentages[1] + '%',
          backgroundColor: getJdtColor(percentages[1]),
        }"
      >
        -
      </div>
    </div> -->
  </print-box>
</template>

<script>
import PrintBox from "@/components/common/print/PrintBox.vue"

export default {
  name: "print",
  props: ["reportData", "type", "chartImg"],
  components: {
    PrintBox,
  },
  data() {
    return {
      // 为每个进度条设置不同的百分比值
      percentages: [
        30, // 第一个进度条的百分比
        65, // 第二个进度条的百分比
        85, // 第三个进度条的百分比
      ],
      customColors: ["#18D1A9", "#94E629", "#FFCC31", "#FF9328", "#FF5F35"],
    }
  },
  methods: {
    print(title) {
      this.$refs.print_box.printWord(title)
    },
    // 通用的颜色计算方法，传入百分比值返回对应的颜色
    getJdtColor(percentage) {
      if (percentage > 0 && percentage <= 20) {
        return this.customColors[0] // 大于0用第一个颜色
      } else if (percentage > 20 && percentage <= 40) {
        return this.customColors[1] // 大于20用第二个颜色
      } else if (percentage > 40 && percentage <= 60) {
        return this.customColors[2] // 大于40用第三个颜色
      } else if (percentage > 60 && percentage <= 80) {
        return this.customColors[3] // 大于60用第四个颜色
      } else if (percentage > 80) {
        return this.customColors[4] // 大于80用第五个颜色
      } else {
        return "#18D1A9" // 默认颜色
      }
    },
  },
}
</script>

<style scoped lang="scss">
.wrap {
  position: relative;

  .class_title {
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 24px;
    font-family: "ziyuanyuanti500W";
    color: #00aeff;
    // background-color: #0a2c62;
    border-radius: 20px 20px 0 0;
    padding-right: 130px;
    box-sizing: border-box;
  }
  .content_wrap {
    width: 100%;
    height: 520px;
    // background-color: #082047;
    border-radius: 0 0 20px 20px;
    box-sizing: border-box;
    padding: 40px 130px 0 120px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }

    .mk_title {
      font-size: 20px;
      font-family: "ziyuanyuanti500W";
      color: #00aeff;
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      > i {
        width: 5px;
        height: 18px;
        background: #00aeff;
        border-radius: 3px;
        display: inline-block;
        margin-right: 8px;
      }
    }
    .mk2_title {
      font-size: 18px;
      font-family: "ziyuanyuanti400W";
      color: #00aeff;
      margin: 20px 0;
      > img {
        width: 16px;
        height: 16px;
        margin: 0 5px 3px 0;
      }
    }
    .jdt {
      width: 100%;
      height: 6px;
      background-color: #33333330;
      border-radius: 10px;
      margin-bottom: 10px;
      > div {
        height: 6px;
        background-color: #18d1a9;
        border-radius: 10px;
        font-size: 2px;
        line-height: 10px;
      }
    }
    .user_info {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      > div {
        width: 100%;
        display: flex;
        align-items: center;
        > div {
          width: 33%;
          font-size: 18px;
          font-family: "ziyuanyuanti400W";
          color: #333;
          line-height: 35px;
          > i {
            // color: #c2efff;
            color: #33333380;
          }
        }
      }
    }
    .radarMap {
      width: 1000px;
      height: 500px;
      margin: 0 auto;
    }
    .explain_text {
      font-size: 18px;
      font-family: "ziyuanyuanti400W";
      color: #333;
      line-height: 26px;
    }
    .project {
      display: flex;
      align-items: center;
      > div {
        padding: 0 15px;
        font-size: 20px;
        font-family: "ziyuanyuanti400W";
        text-align: center;
        color: #fff;
        line-height: 38px;
        background-color: #00aeff;
        border-radius: 20px;
        margin-right: 10px;
      }
    }
  }
}
</style>
