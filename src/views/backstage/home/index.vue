<template>
  <div class="home-box">
    <div class="left-box">
      <div class="left-top_box">
        <span>Hello,{{ userInfo.nickname }}</span>
        <span>欢迎使用{{ sysInfo.name }}后台管理系统。</span>
        <span
          >{{
            sysInfo.name
          }}后台系统专注后台管理服务，为你提供最便捷的服务。</span
        >
        <span>上次登录时间：{{ timestampToTime }}</span>
      </div>
      <div class="left-center_box">
        <div class="center-list">
          <div class="list-title">
            <div class="title-icon">
              <img src="@/assets/img/backstage/home/userIcon.png" alt="" />
            </div>
            <span>系统普通用户</span>
          </div>
          <div class="list-bottom">
            <div class="list-num">
              <div>用户数量</div>
              <div>
                <span>{{ normal.num }}</span
                >人
              </div>
            </div>
            <div
              v-auth="'normaluserlist'"
              class="list-details"
              @click="$router.push({ name: 'users', query: { tab: 1 } })"
            >
              查看详情>>
            </div>
          </div>
        </div>
        <div class="center-list">
          <div class="list-title">
            <div class="title-icon">
              <img src="@/assets/img/backstage/home/adminIcon.png" alt="" />
            </div>
            <span>系统管理员</span>
          </div>
          <div class="list-bottom">
            <div class="list-num">
              <div>管理员数量</div>
              <div>
                <span>{{ manger.num }}</span
                >人
              </div>
            </div>
            <div
              v-auth="'adminlist'"
              class="list-details"
              @click="$router.push({ name: 'users', query: { tab: 2 } })"
            >
              查看详情>>
            </div>
          </div>
        </div>
        <div class="center-list">
          <div class="list-title">
            <div class="title-icon">
              <img src="@/assets/img/backstage/home/systemIcon.png" alt="" />
            </div>
            <span>系统部门数量</span>
          </div>
          <div class="list-bottom">
            <div class="list-num">
              <div>班级/部门总数</div>
              <div>
                <span>{{ department.num }}</span
                >个
              </div>
            </div>
            <div
              v-auth="'/index/classManage'"
              class="list-details"
              @click="$router.push({ name: 'classManage' })"
            >
              查看详情>>
            </div>
          </div>
        </div>
      </div>

      <div class="left-bottom_box">
        <div class="bottom-left">
          <div class="title-box">
            <div></div>
            <span>登录方式设置</span>
          </div>
          <div class="left-list">
            <div class="list-box">
              <div class="list-left">
                <img src="@/assets/img/backstage/home/1.png" alt="" />
                <span>账密登录</span>
              </div>
              <span class="list-center">{{
                accountSwitch == 0
                  ? "已开启"
                  : accountSwitch == 1
                  ? "未开启"
                  : "需此功能请联系客服"
              }}</span>
              <SwitchVue
                :status="accountSwitch"
                inactiveColor="#cccccc"
                activeColor="#2e8ae6"
                @swtichValue="account"
                :disabled="accountSwitch == 2"
              >
              </SwitchVue>
            </div>

            <div class="list-box">
              <div class="list-left">
                <img src="@/assets/img/backstage/home/2.png" alt="" />
                <span>游客登录</span>
              </div>
              <span class="list-center">{{
                touristSwitch == 0
                  ? "已开启"
                  : touristSwitch == 1
                  ? "未开启"
                  : "需此功能请联系客服"
              }}</span>
              <SwitchVue
                :status="touristSwitch"
                inactiveColor="#cccccc"
                activeColor="#2e8ae6"
                @swtichValue="tourist"
                :disabled="touristSwitch == 2"
              >
              </SwitchVue>
            </div>

            <div class="list-box">
              <div class="list-left">
                <img src="@/assets/img/backstage/home/3.png" alt="" />
                <span>人脸登录</span>
              </div>
              <span class="list-center">{{
                faceSwitch == 0
                  ? "已开启"
                  : faceSwitch == 1
                  ? "未开启"
                  : "需此功能请联系客服"
              }}</span>
              <SwitchVue
                :status="faceSwitch"
                inactiveColor="#cccccc"
                activeColor="#2e8ae6"
                @swtichValue="face"
                :disabled="faceSwitch == 2"
              >
              </SwitchVue>
            </div>

            <div class="list-box">
              <div class="list-left">
                <img src="@/assets/img/backstage/home/4.png" alt="" />
                <span>指纹登录</span>
              </div>
              <span class="list-center">{{
                fingerprintSwitch == 0
                  ? "已开启"
                  : fingerprintSwitch == 1
                  ? "未开启"
                  : "需此功能请联系客服"
              }}</span>
              <SwitchVue
                :status="fingerprintSwitch"
                inactiveColor="#cccccc"
                activeColor="#2e8ae6"
                @swtichValue="fingerprint"
                :disabled="fingerprintSwitch == 2"
              >
              </SwitchVue>
            </div>
            <div class="list-box">
              <div class="list-left">
                <img src="@/assets/img/backstage/home/5.png" alt="" />
                <span>扫码登录</span>
              </div>
              <span class="list-center">{{
                scanCodeSwitch == 0
                  ? "已开启"
                  : scanCodeSwitch == 1
                  ? "未开启"
                  : "需此功能请联系客服"
              }}</span>
              <SwitchVue
                :status="scanCodeSwitch"
                inactiveColor="#cccccc"
                activeColor="#2e8ae6"
                @swtichValue="scanCode"
                :disabled="scanCodeSwitch == 2"
              >
              </SwitchVue>
            </div>
            <div class="list-box">
              <div class="list-left">
                <img src="@/assets/img/backstage/home/6.png" alt="" />
                <span>感应登录</span>
              </div>
              <span class="list-center">{{
                inductionSwitch == 0
                  ? "已开启"
                  : inductionSwitch == 1
                  ? "未开启"
                  : "需此功能请联系客服"
              }}</span>
              <SwitchVue
                :status="inductionSwitch"
                inactiveColor="#cccccc"
                activeColor="#2e8ae6"
                @swtichValue="induction"
                :disabled="inductionSwitch == 2"
              >
              </SwitchVue>
            </div>
          </div>
        </div>
        <div class="bottom-right">
          <div class="title-box">
            <div></div>
            <span>用户活跃度</span>
          </div>
          <div class="table">
            <div class="th">
              <div>序号</div>
              <div>用户类型</div>
              <div>本周活跃数量</div>
              <div>周涨幅</div>
            </div>
            <div class="td" v-for="(i, index) in userActivityList" :key="index">
              <div>{{ index + 1 }}</div>
              <div>{{ i.title }}</div>
              <div>{{ i.total }}</div>
              <div
                :style="
                  i.rate >= 0 ? { color: '#14C76A' } : { color: '#FF6161' }
                "
              >
                {{ i.rate >= 0 ? `+${i.rate}` : `${i.rate}` }}
                <img
                  :src="
                    i.rate >= 0
                      ? require('@/assets/img/backstage/home/加.png')
                      : require('@/assets/img/backstage/home/减.png')
                  "
                  alt=""
                />
              </div>
            </div>
            <!-- <div class="td"></div>
            <div class="td"></div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="right-box">
      <div class="right-top">
        <div class="title-box">
          <div></div>
          <span>部门管理统计</span>
        </div>

        <div
          id="main"
          style="width: 3.1rem; height: 1.7rem; margin: 0rem auto 0rem auto"
        ></div>
        <div class="data-num">
          <span>部门数量</span>
          {{ classTotal }}个
        </div>
        <div class="total-num">总人数：{{ totalNum }}人</div>
        <div class="data-list">
          <div class="title-page">
            <div class="title-page_left">各部门人数</div>
            <div class="title-page_right">
              <div @click="classUpper">&lt;</div>
              <div>{{ getClassObj.page }}</div>
              <div @click="classNext">&gt;</div>
            </div>
          </div>
          <div class="list-class">
            <div v-for="(i, index) in classList" :key="index">
              <span></span>
              <div>{{ i.class_name }}</div>
              ：{{ i.number_people }}人
            </div>
          </div>
        </div>
      </div>
      <div class="right-bottom">
        <div class="title-box">
          <div></div>
          <span>用户报告统计</span>
        </div>
        <div class="report-num_text">
          <div class="num-box">
            本周累计生成报告：&nbsp;<span
              >{{
                reportDataList.reduce(
                  (accumulator, currentValue) =>
                    accumulator + currentValue.total,
                  0
                )
              }}份</span
            >
          </div>
          <div class="text-box">（单位：份）</div>
        </div>
        <div class="report-data">
          <div class="columnar"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  statisticsUserDeptApiData,
  statisticsDeptApiData,
  statisticsActivityApiData,
} from "@/server/api/statistic";
import {
  userLoginMethodBackApiInfo,
  userLoginMethodBackApiSet,
} from "@/server/api/user";
import { backGuageReportApiData } from "@/server/api/guage";
import * as echarts from "echarts";
import { mapGetters } from "vuex";

// function getWeek() {
//   // 获取当天日期
//   let today = new Date();

//   // 获取当天是本周的第几天（0-6，其中0代表周日）
//   let currentDay = today.getDay();

//   // 获取本周的第一天的日期
//   let firstDayOfWeek = new Date(
//     today.getFullYear(),
//     today.getMonth(),
//     today.getDate() - currentDay - 6
//   );

//   // 创建一个空数组来存储日期
//   let weekDates = [];

//   // 循环获取一周的日期并存入数组
//   for (let i = 0; i < 7; i++) {
//     let date = new Date(
//       firstDayOfWeek.getFullYear(),
//       firstDayOfWeek.getMonth(),
//       firstDayOfWeek.getDate() + i
//     );
//     weekDates.push(date);
//   }

//   // 输出日期数组
//   return weekDates;
// }

let myChart = null;
export default {
  data() {
    return {
      accountSwitch: 0, //账号登录
      touristSwitch: 0, //游客登录
      faceSwitch: 0, //面部登录
      fingerprintSwitch: 0, //指纹登录
      scanCodeSwitch: 0, //扫码登录
      inductionSwitch: 0, //感应登录
      reportDataList: [],
      colors: [
        "#3786cf",
        "#8ebf13",
        "#43d288",
        "#8962d9",
        "#f29822",
        "#1bc7ba",
      ],
      normal: {}, //普通用户
      manger: {}, //管理角色
      department: {}, //部门统计
      classList: [], //部门人数
      classTotal: "", //总部门
      totalNum: 0, //总人数
      //部门统计参数
      getClassObj: {
        page: 1,
        page_size: 6,
      },
      userActivityList: [], //用户活跃度
      reportTotal: 0, // 游戏报告总数
    };
  },

  computed: {
    //上次登录时间
    timestampToTime() {
      var date = this.userInfo.login_time
        ? new Date(this.userInfo.login_time * 1000)
        : new Date();
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      var m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + " " + h + m + s;
    },
    ...mapGetters(["userInfo", "sysInfo", "userAvatar"]),
  },

  watch: {},

  methods: {
    //账号登录开关
    account(val) {
      this.accountSwitch = val;
      this.setlogin();
    },
    //游客登录开关
    tourist(val) {
      this.touristSwitch = val;
      this.setlogin();
    },
    //面部登录开关
    face(val) {
      this.faceSwitch = val;
      this.setlogin();
    },
    //指纹登录开关
    fingerprint(val) {
      this.fingerprintSwitch = val;
      this.setlogin();
    },
    //扫码登录开关
    scanCode(val) {
      this.scanCodeSwitch = val;
      this.setlogin();
    },
    //感应登录开关
    induction(val) {
      this.inductionSwitch = val;
      this.setlogin();
    },
    //设置登录方式
    async setlogin() {
      const params = {
        face: this.faceSwitch,
        fingerprint: this.fingerprintSwitch,
        guest: this.touristSwitch,
        user_pwd: this.accountSwitch,
        scan: this.scanCodeSwitch,
        inductive: this.inductionSwitch,
      };
      const { data } = await userLoginMethodBackApiSet(params);
      if (data.code == 200) {
        this.$message.success("设置成功");
        // console.log(params);
        this.$store.commit("UPDATE_SYS_INFO", params);
        this.getLoginSet();
      }
    },
    //获取登录方式设置
    async getLoginSet() {
      const { data } = await userLoginMethodBackApiInfo();
      // console.log(data);
      if (data.code == 200) {
        this.accountSwitch = +data.data.user_pwd;
        this.touristSwitch = +data.data.guest;
        this.faceSwitch = +data.data.face;
        this.fingerprintSwitch = +data.data.fingerprint;
        this.scanCodeSwitch = +data.data.scan;
        this.inductionSwitch = +data.data.inductive;
      }
    },
    //圆形图
    circular(val) {
      function addSuffixToDuplicates(arr) {
        let nameCount = {};
        let result = [];

        // 计算每个名字的出现次数
        for (let i = 0; i < arr.length; i++) {
          if (nameCount[arr[i].class_name] === undefined) {
            nameCount[arr[i].class_name] = 1;
          } else {
            nameCount[arr[i].class_name]++;
          }
        }

        // 对于每个重复的名字，添加一个唯一的后缀
        for (let i = 0; i < arr.length; i++) {
          if (nameCount[arr[i].class_name] > 1) {
            let newName =
              arr[i].class_name + `(${nameCount[arr[i].class_name]})`;
            nameCount[arr[i].class_name] -= 1;
            result.push({ ...arr[i], class_name: newName });
          } else {
            result.push(arr[i]);
          }
        }

        return result;
      }

      val = addSuffixToDuplicates(val);
      let chartDom = document.getElementById("main");
      myChart = echarts.init(chartDom);
      let option;
      option = {
        tooltip: {
          trigger: "item",
        },
        color: this.colors,
        series: [
          {
            name: "管理部门统计",
            type: "pie",
            radius: ["42%", "53%"],
            center: ["50%", "50%"],

            itemStyle: {
              borderRadius: 2,
              borderColor: "#fff",
              borderWidth: 0,
            },
            label: {
              position: "outside",
              show: true,
              formatter: "{number_people|{c} 人}",

              rich: {
                value: {
                  fontSize: 14,
                  color: "#333333",
                },
              },
            },
            labelLine: {
              show: true,
              length: 15,
              length2: 15,
              maxSurfaceAngle: 0,
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "12",
                fontWeight: "bold",
              },
            },

            data: val.map((v) => {
              return { name: `${v.class_name}`, value: v.number_people };
            }),
          },
        ],
      };

      option && myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    onResize() {
      let time = setTimeout(() => {
        if (myChart && myChart.resize) {
          myChart.resize();
        }
      }, 100);
    },
    // 初始化柱状图
    initColumnar() {
      const echarts = require("echarts/lib/echarts");
      require("echarts/lib/component/grid");
      require("echarts/lib/chart/bar");
      // let week = getWeek();
      // const date = this.reportDataList.map((v, i) => {
      //   let date1 = week[i];
      //   const month = date1.getMonth() + 1;
      //   const day = date1.getDate();
      //   // (month < 10 ? ('0' + month) : month) + '-' +
      //   return day < 10 ? "0" + day : day;
      // });
      // let year = `${week[0].getFullYear()}/${
      //   week[0].getMonth() + 1 < 10
      //     ? "0" + (week[0].getMonth() + 1)
      //     : week[0].getMonth() + 1
      // }`;
      // date.unshift(year);

      const dateA = this.reportDataList.map((v, i) => {
        return v.date.slice(-2);
      });

      var dateB = new Date(); //创建日期对象
      var yearB = dateB.getFullYear();
      var month = dateB.getMonth() + 1;
      if (month < 10) month = "0" + month;
      const thieYear = `${yearB}-${month}     `;

      const columnarData = this.reportDataList.map((v) => v.total);
      columnarData.unshift("");

      var chartDom = document.querySelector(".columnar");
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        grid: {
          y: 30,
          x: 30,
          y2: 30,
        },
        xAxis: {
          type: "category",
          data: [thieYear, ...dateA],
          axisTick: { show: false },
          //设置坐标轴字体颜色和宽度
          axisLine: {
            //这是y轴文字颜色
            lineStyle: {
              color: "#E1E1E1",
            },
            show: true, //y轴线消失
          },
          axisLabel: {
            textStyle: {
              fontSize: 10,
              color: "#000", //坐标值得具体的颜色
            },
            interval: 0,
            //rotate: 55,
          },
        },
        yAxis: {
          minInterval: 1, //设置成1保证坐标轴分割刻度显示成整数。
          type: "value",
          //设置坐标轴字体颜色和宽度
          axisLine: {
            show: false, //y轴线消失
          },

          // 背景线变虚线
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: "#CCC",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#333", //坐标值得具体的颜色
            },
            interval: 1, // 设置轴标签的显示间隔为整数单位
          },
        },
        series: [
          {
            data: columnarData,
            type: "bar",
            barWidth: 6,
            itemStyle: {
              normal: {
                //柱形图圆角，初始化效果
                barBorderRadius: [4, 4, 0, 0],
                color: function (params) {
                  // build a color map as your need.

                  var colorList = [
                    "#2E8AE6",
                    "#14C76A",
                    "#FAAB00",
                    "#8EBF13",
                    "#8962D9",
                    "#1BC7BA",
                    "#57c1ff",
                    "#2E8AE6",
                  ];

                  return colorList[params.dataIndex];
                },
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    getReport() {
      this.$post("backend/statistics/userreportlist").then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.reportDataList = res.data.data;
          console.log(this.reportDataList);
          this.reportTotal = res.data.total;

          this.initColumnar();
        }
      });
    },
    //获取系统用户数和部门数
    async getUserOrdetp() {
      const { data } = await statisticsUserDeptApiData();
      if (data.code == 200) {
        this.normal = data.data.normal;
        this.manger = data.data.manger;
        this.department = data.data.class;
      }
    },
    //获取部门人数统计
    async getClassNum() {
      const { data } = await statisticsDeptApiData(this.getClassObj);
      // console.log(data);
      if (data.code == 200) {
        this.classList = data.data.data;
        this.totalNum = data.data.number_people_total;
        this.classTotal = data.data.total;
        this.circular(this.classList);
      }
    },
    async getReportData() {
      const res = await backGuageReportApiData({});
      if (res.data.code == 200) {
        this.reportDataList = res.data.data;
      }
    },

    //部门人数上一页
    classUpper() {
      if (this.getClassObj.page == 1) return;
      this.getClassObj.page--;
      this.getClassNum();
    },
    //部门人数下一页
    classNext() {
      let page = Math.ceil(this.classTotal / 6);
      if (this.getClassObj.page == page) return;
      this.getClassObj.page++;
      this.getClassNum();
    },
    //获取用户活跃度
    async getUserActivity() {
      const { data } = await statisticsActivityApiData();
      if (data.code == 200) {
        this.userActivityList = data.data;
      }
    },
  },

  async mounted() {
    await this.getUserOrdetp();
    await this.getClassNum();
    await this.getUserActivity();
    await this.getLoginSet();
    await this.circular(this.classList);
    await this.getReportData();
    //await this.getReportData()

    await this.initColumnar();
    window.addEventListener("resize", this.onResize);
  },

  created() {
    // console.log(this.sysInfo);
  },
};
</script>
<style lang="less" scoped>
/deep/ .min-box {
  height: 100%;
}

.home-box {
  height: 1013px;
  width: 100%;
  padding-top: 25px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;

  .title-box {
    padding: 30px 0 0 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin-bottom: 30px;

    div {
      width: 8px;
      height: 20px;
      background: #2e8ae6;
      border-radius: 4px;
    }

    span {
      display: block;
      font-size: 18px;
      color: #333333;
      margin-left: 10px;
    }
  }

  .left-box {
    width: 1140px;
    height: auto;

    .left-top_box {
      width: 100%;
      height: 280px;
      background: url("@/assets/img/backstage/home/top.png") no-repeat;
      background-size: 100% 100%;
      padding: 40px 0 0 33px;
      box-sizing: border-box;

      span {
        display: block;
        font-size: 30px;
        color: #f7f7f7;

        &:nth-of-type(2) {
          font-size: 24px;
          margin-top: 30px;
        }

        &:nth-of-type(3) {
          font-size: 14px;
          margin-top: 17px;
        }

        &:nth-of-type(4) {
          font-size: 14px;
          margin-top: 50px;
        }
      }
    }

    .left-center_box {
      width: 100%;
      height: 150px;
      display: flex;
      justify-content: space-between;
      margin-top: 30px;

      .center-list {
        width: 370px;
        height: 150px;
        background: #2e8ae6;
        border-radius: 10px;
        padding: 20px 16px 0 20px;
        box-sizing: border-box;

        &:nth-of-type(2) {
          background: #faab00;
        }

        &:nth-of-type(3) {
          background: #8962d9;
        }

        .list-title {
          width: auto;
          height: auto;
          display: flex;
          align-items: center;

          .title-icon {
            width: 40px;
            height: 40px;
            background: rgba(251, 251, 251, 0.2);
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              display: block;
              width: 24px;
              height: 24px;
            }
          }

          span {
            display: block;
            font-size: 20px;
            color: #f7f7f7;
            margin-left: 20px;
          }
        }

        .list-bottom {
          margin-top: 23px;
          display: flex;
          justify-content: space-between;
          font-size: 14px;

          .list-num {
            color: #f7f7f7;

            div {
              display: flex;
              vertical-align: bottom;
              line-height: 25px;

              span {
                display: block;
                font-size: 24px;
              }
            }
          }

          .list-details {
            margin-top: 28px;
            color: #ffffff;
            opacity: 0.5;
            cursor: pointer;
          }
        }
      }
    }

    .left-bottom_box {
      width: 100%;
      height: 480px;
      display: flex;
      justify-content: space-between;
      margin-top: 20px;

      > div {
        width: 560px;
        height: 480px;
        background: rgba(238, 238, 238, 0.7);
        border: 1px solid #e6e6e6;
        border-radius: 10px;
      }

      .bottom-left {
        .left-list {
          width: 520px;
          height: 380px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin: 0 auto;

          .list-box {
            width: 100%;
            height: 57px;
            background: #ffffff;
            border: 1px solid #e6e6e6;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            box-sizing: border-box;
            color: #333333;

            .list-left {
              display: flex;
              align-items: center;

              img {
                display: block;
                width: 36px;
                height: 36px;
              }

              span {
                font-size: 14px;
                margin-left: 20px;
              }
            }

            .list-center {
              font-size: 13px;
            }
          }
        }
      }

      .bottom-right {
        .table {
          width: 540px;
          height: auto;
          border-radius: 6px;
          margin: 0 auto;

          .th {
            width: 100%;
            height: 40px;
            background: #eeeeee;
            border: 1px solid #e6e6e6;
            border-radius: 6px 6px 0px 0px;
            display: flex;
            align-items: center;
            justify-content: space-around;

            //box-sizing: border-box;
            div {
              font-size: 15px;
              color: #333333;
              width: 70px;
              text-align: center;

              &:nth-of-type(2) {
                width: 218px;
              }

              &:nth-of-type(3) {
                width: 142px;
              }

              &:nth-of-type(4) {
                width: 110px;
              }
            }
          }

          .td {
            width: 100%;
            height: 48px;
            background: #ffffff;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            justify-content: space-around;
            box-sizing: border-box;

            div {
              font-size: 15px;
              color: #333333;
              width: 70px;
              text-align: center;

              &:nth-of-type(2) {
                width: 218px;
              }

              &:nth-of-type(3) {
                width: 142px;
                color: #888888;
              }

              &:nth-of-type(4) {
                width: 110px;
                display: flex;
                align-items: center;
                justify-content: center;

                //padding: 0 35px;
                //box-sizing: border-box;
                img {
                  display: block;
                  width: 10px;
                  height: 6px;
                  margin-left: 7px;
                }
              }
            }
          }
        }
      }
    }
  }

  .right-box {
    width: 400px;
    height: 960px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;

    > div {
      background: rgba(238, 238, 238, 0.7);
      border: 0.01rem solid #e6e6e6;
      border-radius: 10px;
      //box-sizing: border-box;
    }

    .right-top {
      width: 100%;
      height: 460px;
      position: relative;

      /* #main {
        /deep/ div {
          width: 3.1rem !important;
          height: 1.5rem !important;

          canvas {
            width: 3.1rem !important;
            height: 1.5rem !important;
          }
        }
      } */

      .data-num {
        position: absolute;
        top: 38%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000000;
        font-size: 20px;
        color: #555555;
        text-align: center;

        span {
          display: block;
          font-size: 14px;
        }
      }

      .total-num {
        text-align: center;
        font-size: 16px;
        font-weight: 400;
        color: #555555;
      }

      .data-list {
        width: 380px;
        height: 158px;
        background: #ffffff;
        border-radius: 10px;
        margin: 15px auto 0 auto;
        padding: 22px 20px 18px;
        box-sizing: border-box;

        .title-page {
          height: 20px;
          display: flex;
          justify-content: space-between;
          font-size: 16px;

          .title-page_left {
            font-size: 16px;
            color: #555555;
          }

          .title-page_right {
            display: flex;
            justify-content: space-between;
            width: 98px;
            height: 20px;

            div {
              width: 24px;
              height: 20px;
              line-height: 20px;
              background: #eeeeee;
              border-radius: 2px;
              font-size: 12px;
              text-align: center;

              &:nth-of-type(2) {
                width: 40px;
              }
            }
          }
        }

        .list-class {
          height: 85px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin-top: 22px;

          div {
            // flex-shrink: 1;
            // width: 55%;
            width: 180px;
            height: 25px;
            font-size: 14px;
            color: #555555;
            display: flex;
            align-items: center;
            white-space: nowrap;
            > div {
              max-width: 100px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              display: inline-block;
            }

            &:nth-of-type(even) {
              width: 45%;
            }

            span {
              width: 6px;
              height: 6px;
              display: block;
              border-radius: 50%;
              margin-right: 10px;
            }

            &:nth-of-type(1) {
              span {
                background: #3786cf;
              }
            }

            &:nth-of-type(2) {
              span {
                background: #8ebf13;
              }
            }

            &:nth-of-type(3) {
              span {
                background: #43d288;
              }
            }

            &:nth-of-type(4) {
              span {
                background: #8962d9;
              }
            }

            &:nth-of-type(5) {
              span {
                background: #f29822;
              }
            }

            &:nth-of-type(6) {
              span {
                background: #1bc7ba;
              }
            }
          }
        }
      }
    }

    .right-bottom {
      width: 100%;
      height: 480px;

      .report-num_text {
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .num-box {
          font-size: 16px;
          color: #555555;

          span {
            color: #297dcc;
          }
        }

        .text-box {
          font-size: 14px;
          color: #888888;
        }
      }

      .report-data {
        width: 380px;
        height: 333px;
        background: #ffffff;
        border-radius: 10px;
        margin: 25px auto 0 auto;

        .columnar {
          width: 380px;
          height: 333px;
        }
      }
    }
  }
}
</style>
