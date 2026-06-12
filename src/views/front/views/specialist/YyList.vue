<template>
  <div class="index">
    <div class="module_title">
      <i>-----------</i>
      <img src="@/assets/img/front/specialist/1.png" alt="" />
      {{ $route.meta.title }}
      <i>-----------</i>
    </div>
    <div class="top_opt">
      <div class="left_btn">
        <div class="all_sele" @click="allselectFn">
          <div>
            <img
              src="@/assets/img/front/specialist/sele_yes.png"
              v-show="isAllChecked"
            />
          </div>
          全选
        </div>
        <div class="del_wrap" @click="batchDel">
          <img src="@/assets/img/front/specialist/del.png" />
          批量删除
        </div>
      </div>

      <div class="search_wrap">
        <el-input
          placeholder="搜索用户"
          v-model="page.name"
          prefix-icon="el-icon-search"
        >
        </el-input>

        <el-date-picker
          v-model="Datetimestamp"
          type="daterange"
          range-separator=":"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
        >
        </el-date-picker>

        <button class="confirm" @click="searchBtn">确定</button>
        <button class="reset" @click="reset">重置</button>
      </div>
    </div>

    <div class="list_wrap">
      <ul>
        <li class="roof">
          <div class="w300" style="text-align: center">预约用户</div>
          <div class="w100">所在部门</div>
          <div class="w200">问题类型</div>
          <div class="w200">被预约专家</div>
          <div class="w200">记录生成时间</div>
          <div class="w350">编辑</div>
        </li>

        <li class="item_wrap" v-for="item in list" :key="item.id">
          <div class="w300">
            <div
              class="sele"
              @click="
                () => {
                  item.opt = !item.opt
                  selectFn()
                }
              "
            >
              <img
                src="@/assets/img/front/specialist/sele_yes.png"
                v-show="item.opt"
              />
            </div>
            <img class="tx" :src="$ip + item.avatar" />
            {{ item.nickname }}
          </div>
          <div class="w100">{{ item.class_name }}</div>
          <div class="w200" style="color: #00a6fc">{{ item.target }}</div>
          <div class="w200">{{ item.doctor_name }}</div>
          <div class="w200">
            {{ $formatDate(item.add_time * 1000, "yyyy-MM-dd") }}
          </div>
          <div class="w350">
            <button class="look" @click="toLookBtn('hf', item.id)">查看</button>
            <button
              class="record"
              @click="toLookBtn('jl', item.id)"
              v-if="$store.getters.roleInfo.name == '心理咨询师'"
            >
              记录
            </button>
            <button class="del" @click="remove(item.id)">删除</button>
          </div>
        </li>
      </ul>

      <div class="all_num">预约数量{{ page.total }}份</div>
    </div>

    <div class="pagination">
      <button class="sye" @click="getTableList(1)">首页</button>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="page.total"
        :current-page="page.page"
        :page-size="page.page_size"
        prev-text="<<上一页"
        next-text="下一页>>"
        @current-change="getTableList"
      >
      </el-pagination>
      <button class="wye" @click="getTableList(Math.ceil(page.total / 6))">
        尾页
      </button>
    </div>
  </div>
</template>

<script>
import {
  visitorApiDoctorDelete,
  visitorApiGetList,
  visitorApiUserList,
} from "@/server/api/consult"

export default {
  data() {
    return {
      Datetimestamp: "",
      activeTypeIndex: 0,
      page: {
        page: 1,
        page_size: 6,
        total: 0,
        startDate: "",
        endDate: "",
        name: "",
      },
      loading: {
        table: false,
      },
      list: [],
      allChecked: false,
      ids: "",
    }
  },

  created() {
    this.getTableList()
  },
  computed: {
    isAllChecked() {
      if (!this.list.length) return
      var allChecked = true
      for (var i = 0; i < this.list.length; i++) {
        if (!this.list[i].opt) {
          allChecked = false
          break
        }
      }
      return allChecked
    },
  },
  methods: {
    async getTableList(page) {
      if (page) {
        this.page.page = page
      }
      try {
        this.loading.table = true
        let { startDate, endDate, name, ...page } = this.page
        if (this.Datetimestamp) {
          var start_time = this.Datetimestamp[0] / 1000
          var end_time = this.Datetimestamp[1] / 1000 + 86399
        } else {
          var start_time = ""
          var end_time = ""
        }
        const res = await visitorApiUserList({
          ...page,
          start_time,
          end_time,
          uid: this.$store.getters.userInfo.id,
          name,
        })

        if (res.data.code == this.$global.successCode) {
          this.list = res.data.data.data
          this.page.total = res.data.data.total
          this.list = this.list.map((item, index) => {
            return {
              ...item,
              opt: false,
            }
          })
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading.table = false
      }
    },
    async remove(id) {
      const flag = await this.$popup.asyncShow("确定要删除这条信息吗？")

      if (!flag) {
        return
      }
      const res = await visitorApiDoctorDelete({ ids: id })
      if (res.data.code == this.$global.successCode) {
        this.$myMessage({
          type: "font-success",
          message: "删除成功!",
        })
        if (this.page.total !== 1) {
          if (
            this.list.length == 1 ||
            this.ids.split(",").length == this.list.length
          ) {
            this.page.page -= 1
          }
          this.getTableList()
        }
      }
    },
    batchDel() {
      if (!this.ids) {
        this.$myMessage({
          type: "font-error",
          message: "请勾选记录!",
        })
        return
      }
      this.remove(this.ids)
    },
    searchBtn() {
      this.getTableList(1)
    },
    selectFn() {
      this.ids = this.list
        .filter((obj) => obj.opt)
        .map((item) => item.id)
        .join(",")
    },
    allselectFn() {
      if (this.isAllChecked) {
        this.list.map((item) => (item.opt = false))
      } else {
        this.list.map((item) => (item.opt = true))
      }
      this.ids = this.list
        .filter((obj) => obj.opt)
        .map((item) => item.id)
        .join(",")
    },
    toLookBtn(type, id) {
      this.$router.push({
        path: "/specialist/YyList/Yyinfo",
        query: {
          type: type,
          id: id,
        },
      })
    },
    reset() {
      this.Datetimestamp = ""
      this.page.name = ""
      this.getTableList(1)
    },
  },
}
</script>

<style scoped lang="scss">
.index {
  width: 1500px;
  height: 840px;
  position: absolute;
  left: 50%;
  top: 44%;
  transform: translate(-50%, -50%);
  background-image: url(@/assets/img/front/index/biankuang.png);
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: 150px 0 0 45px;

  .module_title {
    position: absolute;
    top: 65px;
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
      .all_sele {
        display: flex;
        align-items: center;
        font-size: 20px;
        color: #ffffff;
        font-family: "ziyuanyuanti400W";
        > div {
          width: 20px;
          height: 20px;
          background-image: url(@/assets/img/front/specialist/sele_no.png);
          background-size: 100% 100%;
          margin: 0 5px 0 0;
          position: relative;
          > img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        }
      }
      .del_wrap {
        display: flex;
        align-items: center;
        font-size: 20px;
        color: #ffffff;
        font-family: "ziyuanyuanti400W";
        margin-left: 40px;
        > img {
          width: 15px;
          height: 18px;
          margin-right: 5px;
        }
      }
    }

    .search_wrap {
      width: 830px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      ::v-deep {
        .el-input {
          width: 280px;
          height: 42px;
          .el-input__inner {
            width: 280px;
            height: 42px;
            background: #0e274e;
            border: 1px solid #00a6fc;
            border-radius: 8px;
            color: #fff;
            padding-left: 45px;
            font-size: 18px;
          }
          .el-input__icon {
            color: #fff;
            font-size: 20px;
            margin-left: 8px;
            margin-top: 3px;
          }
        }

        .el-date-editor {
          width: 350px;
          height: 42px;
          background: #0e274e;
          border: 1px solid #00a6fc;
          > input {
            background: #0e274e;
            color: #fff;
          }
          .el-range-separator {
            color: #fff;
          }
          .el-input__icon {
            font-size: 20px;
            margin-left: 10px;
            color: #fff;
          }
        }
      }

      .confirm,
      .reset {
        width: 80px;
        height: 42px;
        background: #00a6fc;
        border-radius: 6px;
        font-size: 20px;
        color: #ffffff;
        font-family: "ziyuanyuanti400W";
      }
      .reset {
        background: #b17a00;
      }
    }
  }

  .list_wrap {
    width: 1350px;
    margin: 20px 0 0 30px;
    .roof {
      width: 1350px;
      height: 42px;
      display: flex;
      background: #0080ff;
      > div {
        font-size: 20px;
        color: #ffffff;
        line-height: 42px;
        font-family: "ziyuanyuanti400W";
        text-align: center;
      }
    }
    .item_wrap {
      width: 100%;
      height: 70px;
      display: flex;
      line-height: 70px;
      font-size: 20px;
      color: #ffffff;
      font-family: "ziyuanyuanti400W";
      text-align: center;
      border-bottom: 1px #00a6fc solid;
      > .w300 {
        display: flex;
        align-items: center;
        .sele {
          width: 20px;
          height: 20px;
          background-image: url(@/assets/img/front/specialist/sele_no.png);
          background-size: 100% 100%;
          margin-left: 10px;
          position: relative;
          > img {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
        .tx {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin: 0 15px;
        }
      }
      > .w350 {
        > button {
          width: 76px;
          height: 42px;
          font-size: 20px;
          color: #ffffff;
          font-family: "ziyuanyuanti400W";
          margin-right: 15px;
          background: #00000000;
          background-size: 100% 100%;
          &:nth-child(3) {
            margin-right: 0;
          }
          &.look {
            background-image: url(@/assets/img/front/specialist/look.png);
          }
          &.record {
            background-image: url(@/assets/img/front/specialist/record.png);
          }
          &.del {
            background-image: url(@/assets/img/front/specialist/del_btn.png);
          }
        }
      }
    }
    .w300 {
      width: 300px;
      text-align: left;
    }
    .w100 {
      width: 100px;
    }
    .w200 {
      width: 200px;
    }
    .w350 {
      width: 350px;
    }

    .all_num {
      font-size: 16px;
      color: #ffffff;
      font-family: "ziyuanyuanti400W";
      margin-top: 20px;
      position: absolute;
      left: 75px;
      bottom: 110px;
    }
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
