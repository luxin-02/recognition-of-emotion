<template>
  <div class="index">
    <div class="module_title">报告列表</div>
    <div class="top_opt">
      <div class="left_btn">
        报告类型 :
        <el-cascader
          v-model="reportType"
          :options="options"
          label="value"
          @change="
            (e) => {
              reportType = e[0]
            }
          "
          :props="{
            value: 'value',
            label: 'value',
          }"
        ></el-cascader>
      </div>

      <div class="search_wrap">
        输入姓名 :
        <el-input placeholder="搜索用户" v-model="searchName" prefix-icon="el-icon-search"> </el-input>

        选择部门 :
        <el-cascader
          v-model="depId"
          :options="depList"
          :emitPath="false"
          :show-all-levels="false"
          @change="selectChange"
          :props="{
            value: 'id',
            label: 'class_name',
            emitPath: false,
            checkStrictly: true,
          }"
        ></el-cascader>

        <button class="confirm" @click="searchBtn">确定</button>
        <button class="reset" @click="reset">重置</button>
      </div>
    </div>

    <div class="list_wrap">
      <ul v-if="reportType == '测评报告'">
        <li class="roof">
          <div class="w200" style="text-align: center">测评用户</div>
          <div class="w200">所在部门</div>
          <div class="w100">性别</div>
          <div class="w200">账号</div>
          <div class="w300">测评量表</div>
          <div class="w150">生成日期</div>
          <div class="w200">编辑</div>
        </li>
        <li
          class="item_wrap"
          v-for="item in reportList.list"
          :key="item.id"
          :class="[item.report_id == detailsId ? 'active' : '']"
          @click="detailsId = item.report_id"
        >
          <div class="w200 txhz">
            <img class="tx" :src="$ip + item.avatar" />
            <span> {{ item.nickname }}</span>
          </div>
          <div class="w200">{{ item.class_name }}</div>
          <div class="w100">{{ item.sex }}</div>
          <div class="w200">{{ item.username }}</div>
          <div class="w300" style="color: #00a6fc">
            {{ item.gauge_title }}
          </div>
          <div class="w150">
            {{ $formatDate2(item.add_time * 1000, "yyyy-MM-dd") }}
          </div>
        </li>
      </ul>
      <ul v-else>
        <li class="roof">
          <div class="w300" style="text-align: center">测评用户</div>
          <div class="w150">所在部门</div>
          <div class="w100">性别</div>
          <div class="w150">账号</div>
          <div class="w300">模式</div>
          <div class="w150">生成日期</div>
          <div class="w200">编辑</div>
        </li>
        <li
          class="item_wrap"
          v-for="item in reportList.list"
          :key="item.id"
          :class="[item.id == detailsId ? 'active' : '']"
          @click="detailsId = item.id"
        >
          <div class="w300 txhz">
            <img class="tx" :src="$ip + item.avatar" />
            <span> {{ item.nickname }}</span>
          </div>
          <div class="w150">{{ item.class_name }}</div>
          <div class="w100">{{ item.sex }}</div>
          <div class="w150">{{ item.username }}</div>
          <div class="w300" style="color: #00a6fc">
            {{ reportType == "心理训练" ? item.game_name : "情绪检测" }}
          </div>

          <div class="w150">
            {{ $formatDate2(item.add_time * 1000, "yyyy-MM-dd") }}
          </div>
        </li>
      </ul>

      <div class="btn_box">
        <button class="look" @click="lookFn">查看</button>
        <button class="export" @click="exportWord">导出</button>
        <button class="print" @click="printFn">打印</button>
        <button class="del" @click="delFn">删除</button>
      </div>
    </div>
    <div class="all_num">报告数量{{ reportList.total }}份</div>
    <div class="pagination">
      <button class="sye" @click="changePage(1)">首页</button>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="reportList.total"
        :current-page="reportList.page"
        :page-size="reportList.page_size"
        prev-text="<<上一页"
        next-text="下一页>>"
        @current-change="changePage"
      >
      </el-pagination>
      <button class="wye" @click="changePage(Math.ceil(reportList.total / reportList.page_size))">尾页</button>
    </div>

    <print ref="print" :reportData="infoData" :type="reportType" :chartImg="chartImg" />
    <emotionPrint
      ref="emotionPrint"
      :reportData="infoData"
      :chartImg="chartImg"
      :emotionChartImg1="emotionChartImg1"
      :emotionChartImg2="emotionChartImg2"
    />

    <div class="radarMap" id="radarMap" v-show="false"></div>
    <div id="roseChart" v-show="false"></div>
    <div id="barGraph" v-show="false"></div>
  </div>
</template>

<script>
import Print from "./print.vue"
import EmotionPrint from "./emotionPrint.vue"
import { frontGaugeReportApiList, frontGaugeReportApiInfo, frontGaugeReportApiDel } from "@/server/api/guage"
import { reportApiList, reportApiInfo, reportApiDel } from "@/server/api/report"
import * as echarts from "echarts"
import { deptApiList } from "@/server/api/dept"
import { exportWord } from "@/utils/export"
import { getSmileAssessList, deleteSmileAssess, getSmileAssessDetail } from "@/server/api/detection"
export default {
  components: { Print, EmotionPrint },
  data() {
    return {
      reportList: { list: [], page: 1, total: 0, page_size: 6 },
      reportType: "测评报告",
      options: [{ value: "测评报告" }, { value: "心理训练" }, { value: "检测报告" }],
      depList: [],
      depId: "",
      searchName: "",
      listLoading: false,
      detailsId: "",
      infoData: {},
      chartImg: "",
      emotionChartImg1: "",
      emotionChartImg2: "",
      Ls_firstComplete: false,
      emotionIndicators: [
        { name: "悲伤", max: 100 },
        { name: "愤怒", max: 100 },
        { name: "恐惧", max: 100 },
        { name: "快乐", max: 100 },
        { name: "惊讶", max: 100 },
      ],
      barColors: ["#18c8ff", "#ffee00", "#18d27c", "#18c8ff", "#ffee00", "#18c8ff", "#5d5dff"],
    }
  },
  watch: {
    reportType(newv) {
      this.reportList.page = 1
      this.detailsId = ""
      if (newv == "测评报告") {
        this.getScaleReport()
      } else if (newv == "心理训练") {
        this.getReportList()
      } else if (newv == "检测报告") {
        this.getDetectionReport()
      }
    },
  },
  created() {
    this.searchBtn()
    this.getdep()
    // this.getDetectionReport()
  },

  methods: {
    async getdep() {
      const { data } = await deptApiList()
      if (data.code == this.$global.successCode) {
        this.depList = data.data[0].children
      }
    },
    selectChange(e) {
      this.depId = e
    },
    async getScaleReport(page) {
      try {
        if (page) {
          this.reportList.page = page
        }
        this.listLoading = true
        const { data } = await frontGaugeReportApiList({
          class_id: this.depId,
          page: this.reportList.page,
          page_size: this.reportList.page_size,
          title: this.searchName,
        })
        if (data.code == this.$global.successCode) {
          console.log(data.data)
          this.reportList.list = data.data.list
          this.reportList.total = data.data.total
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.listLoading = false
      }
    },
    async getReportList(page) {
      if (page) {
        this.reportList.page = page
      }
      this.listLoading = true
      try {
        const { data } = await reportApiList({
          page: this.reportList.page,
          page_size: this.reportList.page_size,
          title: this.searchName,
          class_id: this.depId,
          cat_name: this.reportType,
        })
        if (data.code == this.$global.successCode) {
          this.reportList.list = data.data
          this.reportList.total = data.total
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.listLoading = false
      }
    },
    async getDetectionReport(page) {
      if (page) {
        this.reportList.page = page
      }
      this.listLoading = true
      try {
        const { data } = await getSmileAssessList({
          page: this.reportList.page,
          page_size: this.reportList.page_size,
          title: this.searchName,
          class_id: this.depId,
        })
        if (data.code == this.$global.successCode) {
          console.log(data)
          this.reportList.list = data.data.data
          this.reportList.total = data.data.total
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.listLoading = false
      }
    },
    searchBtn() {
      this.reportList.page = 1
      if (this.reportType == "测评报告") {
        this.getScaleReport()
      } else if (this.reportType == "心理训练") {
        this.getReportList()
      } else if (this.reportType == "检测报告") {
        this.getDetectionReport()
      }
    },
    reset() {
      this.searchName = ""
      this.depId = ""
      this.detailsId = ""
      this.searchBtn()
    },
    changePage(page) {
      this.reportType === "测评报告"
        ? this.getScaleReport(page)
        : this.reportType === "心理训练"
        ? this.getReportList(page)
        : this.getDetectionReport(page)
    },
    lookFn() {
      if (!this.detailsId) {
        return this.$myMessage({
          type: "font-error",
          message: "请选择一条数据查看!",
        })
      }
      const path = this.reportType === "检测报告" ? "/report/emotionReport" : "/report/details"
      this.$router.push({
        path,
        query: { id: this.detailsId, type: this.reportType },
      })
    },
    async delFn() {
      this.$popup({
        title: "提示",
        content: "是否确认删除？",
        saveFoo: async () => {
          if (!this.detailsId) {
            this.$myMessage({ type: "font-error", message: "请选择一条报告!" })
            return
          }
          const deleteApi =
            this.reportType === "测评报告"
              ? frontGaugeReportApiDel
              : this.reportType === "检测报告"
              ? deleteSmileAssess
              : reportApiDel
          const getList =
            this.reportType === "测评报告"
              ? this.getScaleReport
              : this.reportType === "检测报告"
              ? this.getDetectionReport
              : this.getReportList

          await deleteApi({ ids: this.detailsId }).then(() => {
            this.$myMessage({ type: "font-success", message: "删除成功!" })
            this.detailsId = ""
            const needPrevPage = this.reportList.total !== 1 && this.reportList.list.length === 1
            getList(needPrevPage ? this.reportList.page - 1 : undefined)
          })
        },
      })
    },

    async fetchReportInfo() {
      if (this.reportType === "测评报告") {
        const { data } = await frontGaugeReportApiInfo({ id: this.detailsId })
        if (data.code !== this.$global.successCode) return null
        this.infoData = data.data
        const indicator = []
        const series = []
        data.data.record_result.forEach((item) => {
          indicator.push({ name: item.gradeName, max: 100 })
          series.push(item.prop)
        })
        this.radarMapChartFn(indicator, series)
        return { isScale: true }
      } else if (this.reportType === "心理训练") {
        const { data } = await reportApiInfo({ id: this.detailsId })
        if (data.code !== this.$global.successCode) return null
        this.infoData = {
          ...data.data,
          ...data.data.userinfo,
          gauge_title: data.data.game_name,
          total_seconds: data.data.seconds,
          add_time: data.data.add_time,
        }
        return { isScale: true }
      } else if (this.reportType === "检测报告") {
        const { data } = await getSmileAssessDetail({ id: this.detailsId })
        if (data.code == this.$global.successCode) {
          this.infoData = data.data
          this.infoData.image_analysis = this.safeJsonParse(this.infoData.image_analysis)
          this.infoData.mental_ability = this.safeJsonParse(this.infoData.mental_ability)
          this.infoData.negative = this.safeJsonParse(this.infoData.negative)
          this.infoData.positive = this.safeJsonParse(this.infoData.positive)
          this.infoData.comprehensive = this.safeJsonParse(this.infoData.comprehensive)
          console.log(this.infoData)
          // this.progressValue = this.infoData.image_analysis.value[0] || 0
          this.$nextTick(() => {
            this.radarMapChartFn(this.infoData.negative.name, this.infoData.negative.value)
            this.roseChartFn(this.infoData.positive.value)
            this.barGraphChartFn(this.infoData.mental_ability.name, this.infoData.mental_ability.value)
          })
        }
        return { isScale: false }
      }
    },

    async printFn() {
      if (!this.detailsId) {
        return this.$myMessage({
          type: "font-error",
          message: "请选择一条数据!",
        })
      }
      const result = await this.fetchReportInfo()
      if (!result) return

      this.$nextTick(() => {
        const title = this.infoData.nickname + "的报告详情"
        result.isScale ? this.$refs.print.print(title) : this.$refs.emotionPrint.print(title)
      })
    },
    async exportWord() {
      if (!this.detailsId) {
        return this.$myMessage({
          type: "font-error",
          message: "请选择一条数据!",
        })
      }
      const result = await this.fetchReportInfo()
      if (!result) return
      this.$nextTick(() => {
        const name = this.infoData.nickname + "的报告详情"
        let record_result
        if (this.infoData.record_result) {
          record_result = this.infoData.record_result.map((element) => ({
            ...element,
            result: element.result.replace(/<[^>]+>/g, ""),
          }))
        }
        if (this.infoData.recommend) {
          this.infoData.recommend = this.infoData.recommend.map((element) => ({
            text: element,
          }))
        }
        const fn = (s) => (!s ? "" : s.replace(/<br[ ]*\/>/g, ""))

        let negative = this.infoData.negative.name.map((_, i) => ({
          name: this.infoData.negative.name[i],
          value: this.infoData.negative.value[i],
          result: this.infoData.negative.result[i],
          level: this.infoData.negative.level[i],
        }))
        let image_analysis = this.infoData.image_analysis.name.map((_, i) => ({
          name: this.infoData.image_analysis.name[i],
          value: this.infoData.image_analysis.value[i],
          result: this.infoData.image_analysis.result[i],
          level: this.infoData.image_analysis.level[i],
        }))

        const docx = {
          name,
          ...this.infoData,
          result: fn(this.infoData.result),
          remark: fn(this.infoData.remark),
          suggest: fn(this.infoData.suggest),
          record_result,
          add_time: this.$formatDate(this.infoData.add_time * 1000, "yyyy-MM-dd"),
          total_seconds: this.$formatTime(this.infoData.total_seconds, "HHH:mmm:ss"),
          userType: this.$store.getters.roleInfo.name,
          img: this.chartImg,
          img1: this.emotionChartImg1,
          img2: this.emotionChartImg2,
          wxzs: this.infoData.image_analysis.value[0],
          fmzs: this.infoData.image_analysis.value[2],
          zmzs: this.infoData.image_analysis.value[1],
          xlzs: this.infoData.image_analysis.value[3],
          negative,
          image_analysis,
        }
        const template =
          this.reportType === "测评报告"
            ? "/docxTemplate/测评报告.docx"
            : this.reportType === "训练报告"
            ? "/docxTemplate/训练报告.docx"
            : "/docxTemplate/检测报告.docx"
        const options =
          this.reportType === "测评报告"
            ? { otherSize: { img: [580, 300] } }
            : this.reportType === "检测报告"
            ? { otherSize: { img1: [580, 300], img2: [580, 300], img3: [580, 300] } }
            : {}

        exportWord(template, docx, name, options)
      })
    },
    radarMapChartFn(data, series) {
      let indicator = []
      data.forEach((item) => {
        indicator.push({ name: item, max: 100 })
      })
      var myChart = echarts.init(document.getElementById("radarMap"))
      let option = {
        backgroundColor: "transparent",
        legend: {
          data: ["Allocated Budget", "Actual Spending"],
        },
        radar: {
          // 也可以设置雷达图本身的背景色
          shape: "polygon",
          splitNumber: 6, // 六边形
          radius: "80%",
          startAngle: 90, // 起始角度
          name: {
            textStyle: {
              color: "#333", // 指标名称颜色
              fontSize: 20, // 指标名称大小
              fontFamily: "ziyuanyuanti400W", // 字体家族
            },
          },
          splitArea: {
            areaStyle: {
              color: ["#152b50", "#21375a"],
            },
          },
          axisLine: {
            lineStyle: {
              color: "#ffffff50",
            },
          },
          splitLine: {
            lineStyle: {
              color: "#3273cd",
            },
          },
          indicator: indicator,
        },
        series: [
          {
            name: "",
            type: "radar",
            areaStyle: {
              color: "rgba(0, 174, 255, 0.3)", // 数据区域填充色
            },
            lineStyle: {
              color: "#00aeff", // 线条颜色
            },
            itemStyle: {
              color: "#00aeff", // 数据点颜色
            },
            data: [
              {
                value: series,
              },
            ],
          },
        ],
      }

      myChart.setOption(option)
      this.chartImg = myChart.getDataURL(option)
      setTimeout(() => myChart.dispose(), 100)
    },
    roseChartFn(data) {
      const myChart = echarts.init(document.getElementById("roseChart"))
      let option = {
        animation: false,
        series: [
          {
            name: "roseChart",
            type: "pie",
            radius: [50, 230],
            center: ["50%", "50%"],
            roseType: "area",
            itemStyle: {
              borderRadius: 8,
            },
            // 添加 label 配置来修改线条旁边的文字样式
            label: {
              show: true, // 是否显示标签
              position: "outside", // 标签位置：outside（外部）、inside（内部）等
              fontSize: 20, // 字体大小
              color: "#333", // 文字颜色
              formatter: "{b}：{c}分", // 格式化显示内容
            },
            data: data,
          },
        ],
      }
      myChart.setOption(option)
      this.emotionChartImg1 = myChart.getDataURL(option)
      setTimeout(() => myChart.dispose(), 100)
    },
    barGraphChartFn(data, series) {
      const myChart = echarts.init(document.getElementById("barGraph"))
      let option = {
        animation: false,
        grid: {
          left: 50,
          right: 20,
          top: 100,
          bottom: 100,
        },
        xAxis: {
          type: "category",
          data: data,
          axisLine: {
            lineStyle: {
              color: "#3d5a98",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#00cfff",
            fontSize: 12,
          },
        },
        yAxis: {
          type: "value",
          max: 100,
          axisLine: {
            show: true,
            lineStyle: {
              color: "#3d5a98",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.08)",
            },
          },
          axisLabel: {
            color: "#333",
            fontSize: 16,
          },
        },
        series: [
          // 背景柱
          {
            type: "bar",
            data: series,
            barWidth: 42,
            barGap: "-100%",
            itemStyle: {
              color: "rgba(120,160,220,0.2)",
              borderRadius: 6,
            },
            z: 1,
          },

          // 前景分段柱
          {
            type: "pictorialBar",
            symbol: "roundRect",
            symbolRepeat: true,
            symbolMargin: 2,
            symbolSize: [35, 13],
            symbolBoundingData: 100,
            data: [40, 38, 32, 30, 28, 26, 24],
            z: 2,
            itemStyle: {
              color: (params) => {
                const colors = ["#18c8ff", "#ffee00", "#18d27c", "#18c8ff", "#ffee00", "#18c8ff", "#5d5dff"]

                return colors[params.dataIndex]
              },
            },
          },
        ],
      }
      myChart.setOption(option)
      this.emotionChartImg2 = myChart.getDataURL(option)
      setTimeout(() => myChart.dispose(), 100)
    },
    safeJsonParse(data) {
      if (typeof data === "string") {
        try {
          return JSON.parse(data)
        } catch {
          return data
        }
      }
      return data || {}
    },
  },
  activated() {
    if (this.Ls_firstComplete) {
      if (this.reportType == "测评报告") {
        this.getScaleReport()
      } else if (this.reportType == "心理训练") {
        this.getReportList()
      } else if (this.reportType == "情绪检测") {
        this.getDetectionReport()
      }
    } else {
      this.Ls_firstComplete = true
    }
  },
}
</script>

<style scoped lang="scss">
.index {
  width: 1500px;
  height: 872px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-image: url(@/assets/img/front/report/kuang.png);
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: 160px 0 0 45px;
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
  .top_opt {
    width: 1410px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px #0c6ba9 solid;
    box-sizing: border-box;
    padding: 0 30px;
    .left_btn {
      display: flex;
      align-items: center;
      font-family: "ziyuanyuanti400W";
      font-size: 16px;
      color: #ffffff;
      ::v-deep .el-cascader {
        margin-left: 10px;
        .el-input {
          height: 36px;
          > input {
            width: 240px;
            height: 36px;
            background: rgba(0, 166, 252, 0.3);
            border: 1px solid #0abdff;
            border-radius: 4px;
            color: #fff;
          }
          .el-input__suffix {
            top: -2px;
            color: #fff;
          }
        }
        .el-cascader-menu__wrap {
          height: 160px !important;
        }
        .el-cascader-menu {
          min-width: 110px;
        }
      }
    }

    .search_wrap {
      width: 850px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      color: #fff;
      font-family: "ziyuanyuanti400W";

      ::v-deep .el-input {
        width: 240px;
        height: 36px;
        .el-input__inner {
          width: 240px;
          height: 36px;
          background: rgba(0, 166, 252, 0.3);
          border: 1px solid #0abdff;
          border-radius: 4px;
          color: #fff;
          padding-left: 45px;
          font-size: 16px;
        }
        .el-input__prefix {
          top: -2px;
        }
        .el-input__icon {
          color: #fff;
          font-size: 16px;
          margin-left: 8px;
          margin-bottom: 5px;
        }
      }

      ::v-deep .el-cascader {
        width: 240px;
        height: 36px;
        line-height: 36px;
        .el-input {
          height: 36px;
          .el-input__inner {
            width: 240px;
            height: 36px;
            background: rgba(0, 166, 252, 0.3);
            border: 1px solid #0abdff;
            border-radius: 4px;
            color: #fff;
            padding: 0 0 0 20px;
          }
        }
      }

      .confirm,
      .reset {
        width: 80px;
        height: 36px;
        border-radius: 4px;
        color: #ffffff;
        font-size: 16px;
        font-family: "ziyuanyuanti400W";
        margin-top: 5px;
        background: #00000000;
        background-size: 100% 100%;
      }
      .confirm {
        background-image: url(@/assets/img/front/report/search.png);
      }
      .reset {
        background-image: url(@/assets/img/front/report/reset.png);
      }
    }
  }

  .list_wrap {
    width: 1350px;
    margin: 20px 0 0 30px;
    position: relative;
    .roof {
      width: 1350px;
      height: 42px;
      display: flex;
      background: #00173c;
      > div {
        font-size: 20px;
        color: #ffffff;
        line-height: 42px;
        font-family: "ziyuanyuanti400W";
        text-align: center;
      }
    }

    .item_wrap {
      width: 1150px;
      height: 70px;
      display: flex;
      line-height: 70px;
      font-size: 20px;
      color: #ffffff;
      font-family: "ziyuanyuanti400W";
      text-align: center;
      border-bottom: 1px #0c6ba9 solid;
      &.active {
        background: #143c61;
      }
      > div {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .txhz {
        display: flex;
        align-items: center;
        .tx {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin: 0 10px 0 20px;
        }
        > span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .w250 {
      width: 250px;
    }
    .w200 {
      width: 200px;
    }
    .w100 {
      width: 100px;
    }
    .w150 {
      width: 150px;
    }
    .w300 {
      width: 300px;
    }

    .btn_box {
      width: 198px;
      height: 425px;
      position: absolute;
      top: 42px;
      right: 0;
      border: 1px #0c6ba9 solid;
      border-top: none;
      > button {
        width: 120px;
        height: 42px;
        border-radius: 6px;
        background: #00000000;
        background-size: 100% 100%;
        font-size: 18px;
        color: #ffffff;
        font-family: "ziyuanyuanti400W";
        margin: 20px 0 0 40px;
      }
      .look {
        margin-top: 80px;
        background-image: url(@/assets/img/front/report/look.png);
      }
      .export {
        background-image: url(@/assets/img/front/report/export.png);
      }
      .print {
        background-image: url(@/assets/img/front/report/print.png);
      }
      .del {
        background-image: url(@/assets/img/front/report/del.png);
      }
    }
  }
  .all_num {
    font-size: 16px;
    color: #ffffff;
    font-family: "ziyuanyuanti400W";
    position: absolute;
    left: 80px;
    bottom: 90px;
  }
  .radarMap {
    width: 1000px;
    height: 500px;
    margin: 0 auto;
  }
  #roseChart,
  #barGraph {
    width: 1000px;
    height: 510px;
    margin: 0 auto;
  }

  .pagination {
    position: absolute;
    right: 100px;
    bottom: 90px;
    display: flex;
    align-items: center;
    .sye,
    .wye {
      width: 80px;
      height: 40px;
      background: #002b5f;
      border: 1px solid #0abdff;
      border-radius: 6px;
      box-shadow: 0px 0px 20px 0px #00baff inset;
      color: #fff;
      font-size: 14px;
      font-family: "ziyuanyuanti400W";
    }

    ::v-deep .number {
      color: #ffffff;
      width: 40px;
      height: 40px;
      background: #002b5f;
      border: 1px solid #0abdff;
      border-radius: 6px;
      box-shadow: 0px 0px 20px 0px #00baff inset;
      line-height: 40px;
      font-family: "ziyuanyuanti400W";
    }
    ::v-deep .el-pager {
      .active {
        color: #fff;
        border: 1px solid #ff9600;
        border-radius: 6px;
        box-shadow: 0px 0px 20px 0px #ff9500 inset;
        background: #00000000 !important;
      }
    }
    ::v-deep .btn-next {
      color: #ffffff;
      width: 110px;
      height: 40px;
      background: #002b5f;
      border: 1px solid #0abdff;
      border-radius: 6px;
      box-shadow: 0px 0px 20px 0px #00baff inset;
      font-family: "ziyuanyuanti400W";
    }
    ::v-deep .btn-prev {
      color: #ffffff;
      width: 110px;
      height: 40px;
      background: #002b5f;
      border: 1px solid #0abdff;
      border-radius: 6px;
      box-shadow: 0px 0px 20px 0px #00baff inset;
      font-family: "ziyuanyuanti400W";
    }
    ::v-deep .btn-quicknext {
      color: #ffffff;
      width: 40px;
      height: 40px;
      background: #002b5f;
      border: 1px solid #0abdff;
      border-radius: 6px;
      box-shadow: 0px 0px 20px 0px #00baff inset;
      line-height: 40px;
    }
    ::v-deep .btn-quickprev {
      color: #ffffff;
      width: 40px;
      height: 40px;
      background: #002b5f;
      border: 1px solid #0abdff;
      border-radius: 6px;
      box-shadow: 0px 0px 20px 0px #00baff inset;
      line-height: 40px;
    }
  }
}
</style>
