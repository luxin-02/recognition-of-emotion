<template>
  <div class="box">
    <div class="title-box">回收站分类及列表</div>
    <!-- 搜索 -->
    <div class="search-box">
      <div class="search-input">
        <inputVue v-model="searchName" placeholder="搜索关键字"></inputVue>
      </div>
      <div class="startAndendData">
        <startAndendData
          :startTime.sync="page.recycle_start_time"
          :endTime.sync="page.recycle_end_time"
          startPlaceholder="开始时间"
          endPlaceholder="结束时间"
        >
        </startAndendData>
      </div>
      <div class="search-class" v-if="tab == 0">
        <cascaderVue
          placeholder="所在部门/班级"
          :options="this.deptList"
          v-model="page.class_id"
          label="class_name"
          ItemValue="id"
        ></cascaderVue>
        <!--        <selectVue :options="searchClassList" :value="page.classVal" label="name" ItemValue="id"-->
        <!--                   placeholder="所在部门/班级" @changeValue="searchClass">-->
        <!--        </selectVue>-->
      </div>
      <buttonVue
        text="搜索"
        @clickBtn="
          () => {
            page.name = searchName;
          }
        "
      ></buttonVue>
      &nbsp; &nbsp;
      <buttonVue text="重置" @clickBtn="reset"></buttonVue>
    </div>
    <div class="add-del_change">
      <buttonVue
        v-auth="activeObj.reductionAuth"
        buttonSize="130,40"
        backgroundColor="#2e8ae6"
        type="reset"
        text="重新还原"
        @clickBtn="reduction"
      >
      </buttonVue>
      <buttonVue
        v-auth="activeObj.deleteAuth"
        buttonSize="130,40"
        type="remove"
        text="彻底删除"
        @clickBtn="del"
      ></buttonVue>
    </div>
    <div class="total">当前列表共有数据：{{ page.total }}条</div>
    <div class="table-box">
      <div class="table-left">
        <div class="table-left_title">回收站分类</div>
        <ul class="table-left_tab">
          <li
            v-for="(item, i) in config"
            :key="i"
            @click="tab = i"
            :class="tab == i ? 'addClass' : ''"
          >
            {{ item.title }}
          </li>
        </ul>
      </div>
      <div class="table-right">
        <div class="table-content">
          <tableVue
            v-if="config.length > 0"
            :tableConfig="tableConfig"
            ref="tableRef"
            @changeSelect="changeSelect"
          >
            <template v-slot:deptname="row">
              {{ row.row.deptname == null ? "--" : row.row.deptname }}
            </template>
            <template v-slot:user="row">
              <div class="user_row">
                <img :src="$ip + row.row.avatar" />
                <div class="text">{{ row.row.nickname }}</div>
              </div>
            </template>
            <template v-slot:time="row">
              <template v-if="row.row.add_time">
                {{ new Date(row.row.add_time * 1000) | formatDate }}
              </template>
              <template v-else>
                {{ new Date(row.row.recycle_join_time * 1000) | formatDate }}
              </template>
            </template>
            <template v-slot:other_time="row">
              {{ new Date(row.row.recycle_join_time * 1000) | formatDate }}
            </template>
          </tableVue>
        </div>
        <div class="table-page">
          <!-- 全选 -->
          <checkboxVue
            class="allSelectBtn"
            :propsValue="allSelect"
            @returnValue="allSelect = $event"
          >
          </checkboxVue>

          <div class="text">全选本页</div>

          <!-- 分页 -->
          <pageVue
            class="page"
            :current-page="page.page"
            @change="getTableList"
            :pageSize="page.page_size"
            :goPage="true"
            :total="page.total"
            @pageBtnChange="getTableList"
          ></pageVue>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deptApiList } from "@/server/api/dept";
import {
  userBackApiList,
  userRecycleApiDel,
  userRecycleApiRestore,
} from "@/server/api/user";
import {
  gaugeReportRecycleApiList,
  gaugeReportRecycleApiDel,
  gaugeReportRecycleApiRestore,
  gaugeRecycleApiList,
  gaugeRecycleApiDel,
  gaugeRecycleApiRestore,
} from "@/server/api/guage";
import {
  getGameReportRecycleList,
  delGameReportRecycleList,
  reductionGameReportRecycleList,
} from "@/server/api/game";
let that = null;

let config = [
  {
    route: "recyclebin/users",
    title: "用户回收",
    api: {
      get: (params) => {
        return userBackApiList({ ...params, role: -1 });
      },
      delete: userRecycleApiDel,
      reduction: userRecycleApiRestore,
    },
    reductionAuth: "userrecyclebin/store",
    deleteAuth: "userrecyclebin/del",
    tableConfig: {
      // 是否有选择按框
      isSelect: true,
      // 资源分类列表
      tableData: [],
      // 每一列的标题
      headerTitle: [
        {
          label: "序号",
          type: "function",
          callback: (row) => {
            let page = that.page.page;
            return (
              row.index + 1 + page * that.page.page_size - that.page.page_size
            );
          },
          width: 80,
        },
        { label: "用户头像及姓名", type: "slot", slotName: "user", width: 300 },
        {
          label: "所在部门/班级",
          prop: "class_name",
          width: 200,
        },
        {
          label: "性别",
          prop: "sex",
        },
        {
          label: "年龄",
          prop: "birthdate",
        },
        {
          label: "注册账号",
          prop: "username",
          width: 300,
        },
        {
          label: "删除时间",
          type: "slot",
          slotName: "time",
          width: 200,
        },
      ],
    },
  },
  // {
  //   route: "recyclebin/scores",
  //   title: "量表报告回收",
  //   api: {
  //     get: gaugeReportRecycleApiList,
  //     delete: gaugeReportRecycleApiDel,
  //     reduction: gaugeReportRecycleApiRestore,
  //   },
  //   reductionAuth: "scorerecyclebin/store",
  //   deleteAuth: "scorerecyclebin/del",
  //   tableConfig: {
  //     // 是否有选择按框
  //     isSelect: true,
  //     // 资源分类列表
  //     tableData: [],
  //     // 每一列的标题
  //     headerTitle: [
  //       {
  //         label: "序号",
  //         type: "function",
  //         callback: (row) => {
  //           let page = that.page.page;
  //           return (
  //             row.index + 1 + page * that.page.page_size - that.page.page_size
  //           );
  //         },
  //         width: 80,
  //       },
  //       { label: "训练报告名称", prop: "title" },
  //       {
  //         label: "所属模块",
  //         type: "function",
  //         callback: (row) => {
  //           return "量表测试";
  //         },
  //       },
  //       {
  //         label: "删除时间",
  //         type: "slot",
  //         slotName: "time",
  //         width: 200,
  //       },
  //     ],
  //   },
  // },

  // {
  //   route: "recyclebin/question_bank",
  //   title: "量表题库回收",
  //   reductionAuth: "questionbankrecyclebin/store",
  //   deleteAuth: "questionbankrecyclebin/del",
  //   api: {
  //     get: gaugeRecycleApiList,
  //     delete: gaugeRecycleApiDel,
  //     reduction: gaugeRecycleApiRestore,
  //   },

  //   tableConfig: {
  //     // 是否有选择按框
  //     isSelect: true,
  //     // 资源分类列表
  //     tableData: [],
  //     // 每一列的标题
  //     headerTitle: [
  //       {
  //         label: "序号",
  //         type: "function",
  //         callback: (row) => {
  //           let page = that.page.page;
  //           return (
  //             row.index + 1 + page * that.page.page_size - that.page.page_size
  //           );
  //         },
  //         width: 80,
  //       },
  //       { label: "题库名称", prop: "title" },
  //       {
  //         label: "所属模块",
  //         type: "function",
  //         callback: (row) => {
  //           return "量表测试";
  //         },
  //       },
  //       {
  //         label: "删除时间",
  //         type: "slot",
  //         slotName: "time",
  //         width: 200,
  //       },
  //     ],
  //   },
  // },
  // {
  //   route: "recyclebin/scores",
  //   title: "训练报告回收",
  //   api: {
  //     get: getGameReportRecycleList,
  //     delete: delGameReportRecycleList,
  //     reduction: reductionGameReportRecycleList,
  //   },
  //   reductionAuth: "scorerecyclebin/store",
  //   deleteAuth: "scorerecyclebin/del",
  //   tableConfig: {
  //     // 是否有选择按框
  //     isSelect: true,
  //     // 资源分类列表
  //     tableData: [],
  //     // 每一列的标题
  //     headerTitle: [
  //       {
  //         label: "序号",
  //         type: "function",
  //         callback: (row) => {
  //           let page = that.page.page;
  //           return (
  //             row.index + 1 + page * that.page.page_size - that.page.page_size
  //           );
  //         },
  //         width: 80,
  //       },
  //       { label: "训练报告名称", prop: "game_name" },
  //       {
  //         label: "所属模块",
  //         prop: "cat_name",
  //       },
  //       {
  //         label: "参与用户",
  //         prop: "nickname",
  //       },
  //       {
  //         label: "所在部门/班级",
  //         prop: "class_name",
  //       },
  //       {
  //         label: "性别",
  //         prop: "sex",
  //       },
  //       {
  //         label: "删除时间",
  //         type: "slot",
  //         slotName: "other_time",
  //         width: 200,
  //       },
  //     ],
  //   },
  // },
];

export default {
  data() {
    return {
      config,
      delPopupShow: false,
      reductionPopupShow: false,
      searchName: "",
      page: {
        // 当前分页
        page: 1,
        // 总分页数
        page_size: 10,
        recycle_start_time: null,
        recycle_end_time: null,
        // 总条数
        total: 0,
        name: "",
        class_id: "",
        role: "",
      },

      deptList: [],
      //tab切换
      tab: 0,
      tableConfig: {},
      selectList: [],
      // 选择的个数
      selectCount: 0,
      // 选择的id
      selectIds: "",
      // 是否全选
      allSelect: false,
    };
  },

  computed: {
    //组合属性用于监听搜索参数自动查询
    combinedProperties() {
      return (
        this.page.recycle_start_time +
        this.page.class_id +
        this.page.recycle_end_time +
        this.page.name
      );
    },
    activeObj() {
      return this.config[this.tab];
    },
  },

  watch: {
    allSelect(newAllSelect) {
      if (newAllSelect) {
        // 获取表格dom
        const tableDom = this.$refs.tableRef;
        // 全选功能
        this.tableConfig.tableData.forEach((item) => {
          tableDom.$children[0].toggleRowSelection(item, true);
        });
      } else {
        // 获取表格dom
        const tableDom = this.$refs.tableRef;
        // 全选功能
        tableDom.$children[0].clearSelection();
      }
    },
    combinedProperties() {
      this.getTableList();
    },
    tab(nvl) {
      this.tableConfig = config[nvl].tableConfig;
      this.getTableList();
    },
  },
  async created() {
    that = this;
    this.config = this.config.filter((v) => {
      return this.$store.getters.authList.find((f) => f == v.route);
    });

    const deptRes = await deptApiList();
    if (deptRes.data.code == 200) {
      this.deptList = deptRes.data.data;
    }

    this.tableConfig = this.config[0].tableConfig;
    this.getTableList();
  },
  methods: {
    async getTableList(page) {
      this.tableConfig.tableData = [];
      if (page) {
        this.page.page = page;
      }

      const params = {
        ...this.page,
      };

      params.recycle_start_time = params.recycle_start_time
        ? this.$getTime(params.recycle_start_time) - 28801
        : "";
      params.recycle_end_time = params.recycle_end_time
        ? this.$getTime(params.recycle_end_time)
        : "";

      //判断class_id是否是数组 如果是数组的话取最后一个的值
      if (Array.isArray(params.class_id) && params.class_id.length > 0) {
        params.class_id = params.class_id[params.class_id.length - 1];
      }

      const res = await this.activeObj.api.get(params);
      if (res.data.code == 200) {
        this.page.total = res.data.data.total;
        this.tableConfig.tableData = res.data.data.data
          ? res.data.data.data
          : res.data.data.list;
      }
    },

    reset() {
      this.page = {
        // 当前分页
        page: 1,
        // 总分页数
        page_size: 10,
        // recycle_start_time: null,
        // endData: null,
        recycle_start_time: null,
        recycle_end_time: null,
        // 总条数
        total: 0,
        name: "",
        class_id: "",
        role: "",
      };
      this.searchName = "";
    },

    async reduction() {
      if (this.selectList == 0) {
        return this.$message.error("请勾选需要操作的数据！");
      }
      const flag = await this.$backstagePopup.asyncShow(`
        选中内容将重新还原到初始位置<span style="color:#FF9500"> （分组被删除的也将重新建立） </span>，是否继续？
      `);

      if (flag) {
        const res = await this.activeObj.api.reduction({
          rows: [...this.selectList],
        });
        if (res.data.code == 200) {
          this.getTableList();
          this.$message.success("还原成功！");
        }
      }
    },

    async del() {
      if (this.selectList == 0) {
        return this.$message.error("请勾选需要操作的数据！");
      }
      const flag = await this.$backstagePopup.asyncShow(
        "是否彻底删除选中的内容？彻底删除后无法找回，是否继续？"
      );
      if (flag) {
        const res = await this.activeObj.api.delete({
          rows: [...this.selectList],
        });
        if (res.data.code == 200) {
          this.getTableList();
          this.$message.success("删除成功！");
        }
      }
    },

    // 选择项发生改变时
    changeSelect(changeValue) {
      console.log(changeValue);
      let strArr = [];
      if (changeValue.length !== 0) {
        for (let i = 0; i < changeValue.length; i++) {
          strArr.push(changeValue[i].id);
        }
      }
      this.selectCount = changeValue.length;
      if (changeValue.length == 0) {
        this.allSelect = false;
      } else if (changeValue.length == this.tableConfig.tableData.length) {
        this.allSelect = true;
      }
      this.selectList = changeValue;
      this.selectIds = strArr.join(",");
    },
    // 清空已选择项
    clearSelect() {
      this.allSelect = !this.allSelect;
    },
  },

  mounted() {},
};
</script>
<style lang="less" scoped>
.box {
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 25px;
  box-sizing: border-box;

  .title-box {
    font-size: 16px;
    color: #313131;
  }

  .search-box {
    width: 1300px;
    height: 40px;
    display: flex;
    // justify-content: space-between;
    align-items: center;
    margin-top: 23px;

    .search-input {
      width: 315px;
      height: 40px;
      margin-right: 20px;
    }

    .startAndendData {
      width: 350px;
      height: 40px;
      margin-right: 20px;
    }

    .search-class {
      width: 300px;
      height: 40px;
      margin-right: 20px;
    }

    /deep/ .el-select,
    ::v-deep .el-cascader {
      .el-input__inner {
        background: #eeeeee;
        border: 1px solid #e6e6e6;
        border-radius: 6px;
      }

      .el-select-dropdown {
        left: 0px !important;
      }
    }
  }

  .add-del_change {
    width: 270px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    margin-top: 25px;
  }

  .total {
    width: 300px;
    font-size: 16px;
    text-align: right;
    margin-top: -20px;
    float: right;
  }

  .table-box {
    margin-top: 30px;
    display: flex;
    height: 710px;

    .table-left {
      width: 200px;
      height: 100%;
      border-right: 1px solid #e6e6e6;
      box-sizing: border-box;

      .table-left_title {
        height: 50px;
        width: 100%;
        line-height: 50px;
        background: #eeeeee;
        border-radius: 6px 0px 0px 6px;
        font-size: 14px;
        color: #333333;
        text-align: center;
      }

      .table-left_tab {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;

        li {
          font-size: 14px;
          color: #333333;
          width: 179px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          margin-bottom: 20px;
        }

        .addClass {
          background: #2e8ae6;
          border-radius: 6px;
          color: #ffffff;
        }
      }
    }

    .table-right {
      width: 1360px;

      .table-content {
        height: 630px;
        border-bottom: 1px solid #e6e6e6;

        /deep/ .el-table {
          border-radius: 0 6px 0 0;
          th {
            height: 50px;
          }
          td {
            height: 59px;
          }
          .el-table__header {
            height: 50px;
          }
          .el-table__header-wrapper {
            height: 50px;
          }
          .user_row {
            display: flex;
            align-items: center;
            width: 100%;
            padding-left: 50px;

            img {
              width: 34px;
              height: 34px;
              margin-right: 10px;
              border-radius: 50%;
            }
          }

          .cell {
            text-align: center;
          }
        }
      }

      .table-page {
        height: 80px;
        display: flex;
        align-items: center;

        .allSelectBtn {
          margin-left: 15px;
        }

        .text {
          color: #333333;
          font-size: 16px;
          margin: 0 34px 0 10px;
        }
      }
    }
  }

  /deep/ .popup-mask {
    .my-popup-box {
      margin: 50px auto 0 auto;
      text-align: center;
      width: 280px;
      font-size: 16px;
      color: #333333;
      line-height: 32px;

      span {
        color: #ff9500;
      }
    }
  }
}
</style>
