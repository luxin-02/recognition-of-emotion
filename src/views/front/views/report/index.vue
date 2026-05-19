<template>
  <div class="index">
    <div class="module_title">
      <i>-----------</i>
      <img src="@/assets/img/front/report/1.png" alt="" />
      {{ $route.meta.title }}
      <i>-----------</i>
    </div>
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
        <el-input
          placeholder="搜索用户"
          v-model="searchName"
          prefix-icon="el-icon-search"
        >
        </el-input>

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
            {{ item.game_name }}
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
      <button
        class="wye"
        @click="changePage(Math.ceil(reportList.total / reportList.page_size))"
      >
        尾页
      </button>
    </div>

    <print
      ref="print"
      :reportData="infoData"
      :type="reportType"
      :chartImg="chartImg"
    />

    <div class="radarMap" id="radarMap" v-show="false"></div>
  </div>
</template>

<script>
import Print from "./print.vue"
import {
  frontGaugeReportApiList,
  frontGaugeReportApiInfo,
  frontGaugeReportApiDel,
} from "@/server/api/guage"
import { reportApiList, reportApiInfo, reportApiDel } from "@/server/api/report"
import * as echarts from "echarts"
import { deptApiList } from "@/server/api/dept"
import { exportWord } from "@/utils/export"
export default {
  components: { Print },
  data() {
    return {
      reportList: { list: [], page: 1, total: 0, page_size: 6 },
      reportType: "测评报告",
      options: [
        {
          value: "测评报告",
        },
        {
          value: "心理训练",
        },
        // {
        //   value: "放松调节",
        // },
      ],
      depList: [],
      depId: "",
      searchName: "",
      listLoading: false,
      detailsId: "",
      infoData: {},
      chartImg: "",
    }
  },
  watch: {
    reportType(newv) {
      this.reportList.page = 1
      this.detailsId = ""
      if (newv == "测评报告") {
        this.getScaleReport()
      } else {
        this.getReportList()
      }
    },
  },
  created() {
    this.searchBtn()
    this.getdep()
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
    searchBtn() {
      this.reportList.page = 1
      if (this.reportType == "测评报告") {
        this.getScaleReport()
      } else {
        this.getReportList()
      }
    },
    reset() {
      this.searchName = ""
      this.depId = ""
      this.detailsId = ""
      this.searchBtn()
    },
    changePage(page) {
      this.reportType == "测评报告"
        ? this.getScaleReport(page)
        : this.getReportList(page)
    },
    lookFn() {
      if (this.detailsId == "")
        return this.$myMessage({
          type: "font-error",
          message: "请选择一条数据查看!",
        })
      this.$router.push({
        path: "/report/details",
        query: {
          id: this.detailsId,
          type: this.reportType,
        },
      })
    },
    async delFn() {
      this.$popup({
        title: "提示",
        content: "是否确认删除？",
        saveFoo: async () => {
          if (!this.detailsId) {
            this.$myMessage({
              type: "font-error",
              message: "请选择一条报告!",
            })
            return
          }
          if (this.reportType == "测评报告") {
            await frontGaugeReportApiDel({
              ids: this.detailsId,
            }).then(() => {
              this.$myMessage({
                type: "font-success",
                message: "删除成功!",
              })
              this.detailsId = ""
              if (this.reportList.total !== 1) {
                if (this.reportList.list.length == 1) {
                  this.getScaleReport(this.reportList.page - 1)
                } else {
                  this.getScaleReport()
                }
              } else {
                this.getScaleReport()
              }
            })
          } else {
            await reportApiDel({
              ids: this.detailsId,
            }).then(() => {
              this.$myMessage({
                type: "font-success",
                message: "删除成功!",
              })
              this.detailsId = ""
              if (this.reportList.total !== 1) {
                if (this.reportList.list.length == 1) {
                  this.getReportList(this.reportList.page - 1)
                } else {
                  this.getReportList()
                }
              } else {
                this.getReportList()
              }
            })
          }
        },
      })
    },

    async printFn() {
      if (this.detailsId == "")
        return this.$myMessage({
          type: "font-error",
          message: "请选择一条数据!",
        })
      if (this.reportType == "测评报告") {
        const { data } = await frontGaugeReportApiInfo({
          id: this.detailsId,
        })
        if (data.code == this.$global.successCode) {
          this.infoData = data.data
          let indicator = []
          let series = []
          data.data.record_result.forEach((item) => {
            indicator.push({ name: item.gradeName, max: 100 })
            series.push(item.prop)
          })

          this.radarMapChartFn(indicator, series)
          this.$nextTick(async () => {
            this.$refs.print.print(this.infoData.nickname + "的报告详情")
          })
        }
      } else {
        const { data } = await reportApiInfo({
          id: this.detailsId,
        })
        if (data.code == this.$global.successCode) {
          this.infoData = {
            ...data.data,
            ...data.data.userinfo,
            gauge_title: data.data.game_name,
            total_seconds: data.data.seconds,
            add_time: data.data.add_time,
          }
          this.$nextTick(async () => {
            this.$refs.print.print(this.infoData.nickname + "的报告详情")
          })
        }
      }
    },
    async exportWord() {
      if (this.detailsId == "")
        return this.$myMessage({
          type: "font-error",
          message: "请选择一条数据!",
        })
      if (this.reportType == "测评报告") {
        const { data } = await frontGaugeReportApiInfo({
          id: this.detailsId,
        })
        if (data.code == this.$global.successCode) {
          this.infoData = data.data
          let indicator = []
          let series = []
          data.data.record_result.forEach((item) => {
            indicator.push({ name: item.gradeName, max: 100 })
            series.push(item.prop)
          })
          this.radarMapChartFn(indicator, series)
        }
      } else {
        const { data } = await reportApiInfo({
          id: this.detailsId,
        })
        if (data.code == this.$global.successCode) {
          this.infoData = {
            ...data.data,
            ...data.data.userinfo,
            gauge_title: data.data.game_name,
            total_seconds: data.data.seconds,
            add_time: data.data.add_time,
          }
        }
      }

      // return;
      this.$nextTick(() => {
        let name = this.infoData.nickname + "的报告详情"
        if (this.infoData.record_result) {
          var record_result = this.infoData.record_result.map((element) => {
            return {
              ...element,
              result: element.result.replace(/<[^>]+>/g, ""),
            }
          })
        }
        if (this.infoData.recommend) {
          this.infoData.recommend = this.infoData.recommend.map((element) => {
            return {
              text: element,
            }
          })
        }
        function fn(s) {
          if (!s) return ""
          return s.replace(/<br[ ]*\/>/g, "")
        }
        let docx = {
          name: name,
          ...this.infoData,
          result: fn(this.infoData.result),
          remark: fn(this.infoData.remark),
          suggest: fn(this.infoData.suggest),
          record_result,
          add_time: this.$formatDate(
            this.infoData.add_time * 1000,
            "yyyy-MM-dd",
          ),
          total_seconds: this.$formatTime(
            this.infoData.total_seconds,
            "HHH:mmm:ss",
          ),
          userType: this.$store.getters.roleInfo.name,
          img: this.chartImg,
        }
        if (this.reportType == "测评报告") {
          exportWord("/docxTemplate/测评报告.docx", docx, name, {
            otherSize: {
              img: [550, 300],
            },
          })
        } else {
          exportWord("/docxTemplate/训练报告.docx", docx, name)
        }
      })
    },
    radarMapChartFn(indicator, series) {
      var myChart = echarts.init(document.getElementById("radarMap"))
      let option = {
        animation: false, // 关闭动画
        // 设置背景颜色与页面容器一致
        backgroundColor: "#08204780",
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
              color: "#fff", // 指标名称颜色
              fontSize: 18, // 指标名称大小
              fontFamily: "ziyuanyuanti400W", // 字体家族
            },
          },
          splitArea: {
            areaStyle: {
              color: ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"],
            },
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.5)",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.3)",
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

      option && myChart.setOption(option)
      this.chartImg = myChart.getDataURL(option)
    },
  },
  activated() {
    if (this.Ls_firstComplete) {
      if (this.reportType == "测评报告") {
        this.getScaleReport()
      } else {
        this.getReportList()
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
  height: 800px;
  position: absolute;
  left: 50%;
  top: 44%;
  transform: translate(-50%, -50%);
  background-image: url(@/assets/img/front/index/biankuang.png);
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: 130px 0 0 45px;
  .module_title {
    position: absolute;
    top: 55px;
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
  .top_opt {
    width: 1410px;
    height: 60px;
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
    bottom: 80px;
  }
  .radarMap {
    width: 1000px;
    height: 500px;
    margin: 0 auto;
  }

  .pagination {
    position: absolute;
    right: 100px;
    bottom: 70px;
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
