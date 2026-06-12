<template>
  <div class="index">
    <div class="module_title">记录详情</div>
    <div class="top_opt">
      <div class="left_btn"></div>

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

    <div class="list_wrap" v-loading="listLoading">
      <ul>
        <li class="roof">
          <div class="w200" style="text-align: center">打卡用户</div>
          <div class="w200">所在部门</div>
          <div class="w100">性别</div>
          <div class="w200">账号</div>
          <div class="w300">微笑指数</div>
          <div class="w150">打卡日期</div>
          <div class="w200">编辑</div>
        </li>
        <li
          class="item_wrap"
          v-for="item in reportList.list"
          :key="item.id"
          :class="[item.id == detailsId ? 'active' : '']"
          @click="detailsId = item.id"
        >
          <div class="w200 txhz">
            <img class="tx" :src="$ip + item.avatar" />
            <span> {{ item.nickname }}</span>
          </div>
          <div class="w200">{{ item.class_name }}</div>
          <div class="w100">{{ item.sex }}</div>
          <div class="w200">{{ item.username }}</div>
          <div class="w300" style="color: #00a6fc">
            {{ item.smile_index }}
          </div>
          <div class="w150">
            <!-- {{ $formatDate2(item.add_time * 1000, "yyyy-MM-dd") }} -->
            {{ item.clock_date }}
          </div>
        </li>
      </ul>

      <div class="btn_box">
        <button class="look" @click="lookFn">查看</button>
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

    <shootDetails :show.sync="shootDetailsShow" :detailsId="detailsId" />
  </div>
</template>

<script>
import { deptApiList } from "@/server/api/dept"
import shootDetails from "@/views/front/views/smileCheck/components/shootDetails.vue"
import Shoot from "./components/shoot.vue"
import { smileClockList } from "@/server/api/smileCheck"
export default {
  components: {
    shootDetails,
    Shoot,
  },
  data() {
    return {
      reportList: { list: [], page: 1, total: 0, page_size: 6 },
      depList: [],
      depId: "",
      searchName: "",
      listLoading: false,
      detailsId: "",
      infoData: {},
      chartImg: "",
      shootDetailsShow: false,
    }
  },
  watch: {},
  created() {
    this.searchBtn()
    this.getdep()
    this.getClockList()
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

    searchBtn() {
      this.reportList.page = 1
      this.getClockList()
    },
    reset() {
      this.searchName = ""
      this.depId = ""
      this.detailsId = ""
      this.searchBtn()
    },

    lookFn() {
      if (this.detailsId == "")
        return this.$myMessage({
          type: "font-error",
          message: "请选择一条数据查看!",
        })
      this.shootDetailsShow = true
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
            //    this.$myMessage({
            //     type: "font-success",
            //     message: "删除成功!",
            //   })
          }
        },
      })
    },
    changePage(page) {
      this.reportList.page = page
    },
    async getClockList(page) {
      if (page) {
        this.reportList.page = page
      }
      this.listLoading = true
      try {
        const { data } = await smileClockList({
          page: this.reportList.page,
          page_size: this.reportList.page_size,
          title: this.searchName,
          class_id: this.depId,
        })
        if (data.code == this.$global.successCode) {
          this.reportList.list = data.data.data
          this.reportList.total = data.data.total
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.listLoading = false
      }
    },
  },
  activated() {},
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
  background-image: url(@/assets/img/front/index/kuang.png);
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
    height: 470px;
    margin: 20px 0 0 30px;
    position: relative;
    ::v-deep .el-loading-mask {
      background-color: #00000060;
    }
    .roof {
      width: 1350px;
      height: 42px;
      display: flex;
      background: #0b3abe;
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
