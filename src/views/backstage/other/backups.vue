<template>
  <div class="class-box">
    <div class="title-box">系统备份管理分类及内容列表</div>
    <!-- 搜索 -->
    <div class="search-box">
      <div class="search-input">
        <inputVue
          :input="searchObj.name"
          @input="searchObj.name = $event"
          placeholder="搜索备份名称"
        ></inputVue>
      </div>
      <div class="startAndendData">
        <startAndendData
          :startTime.sync="searchObj.start_time"
          :endTime.sync="searchObj.end_time"
          startPlaceholder="开始时间"
          endPlaceholder="结束时间"
        >
        </startAndendData>
      </div>
      <buttonVue text="搜索" @clickBtn="search"></buttonVue>
      <buttonVue text="重置" @clickBtn="reset"></buttonVue>
    </div>

    <div class="add-del_change">
      <buttonVue
        buttonSize="130,40"
        type="add"
        text="新建备份"
        @clickBtn="addShow = true"
        v-auth="'systembackup/addbackup'"
      ></buttonVue>
      <buttonVue
        buttonSize="130,40"
        type="reset"
        backgroundColor="#8962D9"
        text="还原备份"
        @clickBtn="clickReduction"
        v-auth="'systembackup/restorebackup'"
      ></buttonVue>
      <buttonVue
        buttonSize="130,40"
        backgroundColor="#FFAF00"
        :iconUrl="require('@/assets/img/backstage/assembly/import.png')"
        iconSize="16,14"
        text="导入备份"
        @clickBtn="importShow = true"
        v-auth="'systembackup/importbackup'"
      ></buttonVue>

      <buttonVue
        buttonSize="130,40"
        backgroundColor="#1BC7BA"
        :iconUrl="require('@/assets/img/backstage/assembly/download.png')"
        text="下载备份"
        @clickBtn="downloadBackups"
        v-auth="'systembackup/downbackup'"
      ></buttonVue>
      <!-- <a :href="$ip + downUrl"></a> -->
      <buttonVue
        buttonSize="130,40"
        type="remove"
        text="删除备份"
        @clickBtn="delBackupsShow"
        v-auth="'systembackup/delbackup'"
      ></buttonVue>
    </div>
    <div class="total">当前列表共有数据：{{ total }}条</div>
    <div class="table">
      <tableVue
        :tableConfig="tableConfig"
        ref="tableRef"
        @changeSelect="changeSelect"
      >
        <template v-slot:deptname="row">
          {{ row.row.deptname == null ? "--" : row.row.deptname }}
        </template>
      </tableVue>
    </div>
    <div class="footer">
      <!-- 全选 -->
      <!-- <checkboxVue class="allSelectBtn" :propsValue="allSelect" @returnValue="allSelect = $event"></checkboxVue> -->

      <!-- <div class="text">全选本页</div> -->

      <!-- 分页 -->
      <pageVue
        class="page"
        :pageCount="pageTotal"
        :current-page="searchObj.page"
        @change="changePage"
        :paeSizes="[10]"
        :goPage="true"
        :total="total"
        @pageBtnChange="pageBtnChange"
      ></pageVue>
    </div>
    <!-- 删除 -->
    <backstage-popup
      :show.sync="delShow"
      title="操作提示"
      @save="delSub"
      @cancel="delShow = false"
    >
      <div class="my-popup-box">
        删除<span>（{{ backupsDetails.name }}）</span>备份文档，是否继续？
      </div>
    </backstage-popup>
    <!-- 建立备份 -->
    <backstage-dialog
      :show.sync="addShow"
      title="建立备份"
      isbtn="cancel"
      @cancel="addShow = false"
      cancelContent="关闭窗口"
    >
      <div class="backups-name">
        <span>备份名称:</span>
        <input type="text" v-model="addBackupsName" />
        <button @click="addBackups" v-loading="loading.add">开始备份</button>
      </div>
      <div class="backups-schedule">
        <span>备份进度:</span>
        <div class="schedule-box">
          <el-progress :percentage="addProgress"></el-progress>
          <span v-if="isBackupsText">资料备份中...</span>
        </div>
      </div>
    </backstage-dialog>
    <!-- 还原备份 -->
    <backstage-dialog
      :show.sync="reductionShow"
      title="还原备份"
      isbtn="cancel"
      cancelContent="关闭窗口"
    >
      <div class="backups-name">
        <span>备份文件:</span>
        <span style="margin: 0 0.19rem 0 0.22rem">{{
          backupsDetails.name
        }}</span>
        <button
          style="margin: 0"
          @click="reductionBackups"
          v-loading="loading.restore"
        >
          开始还原
        </button>
      </div>
      <div class="backups-schedule">
        <span>还原进度:</span>
        <div class="schedule-box">
          <el-progress :percentage="reductionProgress"></el-progress>
          <span v-if="isBackupsText">资料还原中...</span>
        </div>
      </div>
    </backstage-dialog>
    <!-- 导入备份 -->
    <backstage-dialog
      isbtn="cancel"
      class="import-box"
      :show.sync="importShow"
      title="导入备份"
      cancelContent="关闭窗口"
    >
      <div class="backups-name">
        <span>文件路径:</span>
        <input type="text" v-model="importBackupsName" disabled />
        <!-- <button  @click="$refs.fileRef.click()">选择文件</button> -->
        <el-upload
          class="uploader"
          action=""
          :show-file-list="false"
          :auto-upload="false"
          :on-change="selectFile"
        >
          <button>选择文件</button>
        </el-upload>
      </div>

      <div class="backups-name" style="margin-top: 0.15rem">
        <span>重命名:</span>
        <input
          type="text"
          style="margin-left: 0.15rem"
          v-model="importBackupsNewName"
        />
        <button @click="importBackupsSub" v-loading="importLoading">
          开始备份
        </button>
      </div>

      <div class="backups-schedule">
        <span>备份进度:</span>
        <div class="schedule-box">
          <el-progress :percentage="importProgress"></el-progress>
          <span v-if="isBackupsText">资料备份中...</span>
        </div>
      </div>
    </backstage-dialog>
  </div>
</template>

<script>
import {
  backupApiList,
  backupApiAdd,
  backupApiInfo,
  backupApiRestore,
  backupApiUploadFile,
  backupApiImportData,
  backupApiDownload,
  backupApiDel,
} from "@/server/api/backup";

export default {
  data() {
    return {
      loading: {
        add: false,
        restore: false,
      },
      //下载备份路径
      //downUrl:'',
      //备份详情
      backupsDetails: {},
      //是否显示备份中
      isBackupsText: false,
      //新增备份名称
      addBackupsName: "",
      //新增进度条
      addProgress: 0,
      // 新增弹框
      addShow: false,
      //还原
      reductionShow: false,
      //还原进度条
      reductionProgress: 0,
      //导入
      importShow: false,
      //导入文件的名称
      importBackupsName: "",
      //导入文件的重命名
      importBackupsNewName: "",
      // 导入文件的路径
      importUrl: "",
      importProgress: 0,
      //删除
      delShow: false,
      //提示弹框
      popupShow: false,
      importLoading: false,
      searchObj: {
        name: "",
        start_time: "",
        end_time: "",
        page: 1,
        page_size: 10,
      },
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
              let page = this.searchObj.page <= 0 ? 1 : this.searchObj.page;
              return row.index + 1 + page * 10 - 10;
            },
            width: "50%",
          },
          { label: "备份名称", prop: "name" },
          { label: "备份人", prop: "nickname" },
          { label: "文件大小", prop: "file_size" },
          { label: "备份时间", prop: "add_time" },

          /* {
            label: "日期",
            prop: "deleteTime",
            type: "function",
            callback: (row) => {
              return formatDate(new Date(row.addTime * 1000));
            },
          }, */
        ],
      },

      // 总分页数
      pageTotal: 0,
      // 总条数
      total: 0,
      // 选择的个数
      selectCount: 0,
      // 选择的id
      selectIds: "",
      // 是否全选
      allSelect: false,
    };
  },

  computed: {},

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
    "searchObj.start_time": function () {
      this.getData();
    },
    "searchObj.end_time": function () {
      this.getData();
    },
    importShow() {
      this.importUrl = "";
      this.importBackupsName = "";
      this.importBackupsNewName = "";
    },
  },

  methods: {
    //删除提交
    async delSub() {
      const { data } = await backupApiDel({ ids: this.selectIds });
      if (data.code == 200) {
        this.$message.success("删除成功");
        this.delShow = false;
        this.getData();

        if (this.total !== 1) {
          if (
            this.tableConfig.tableData.length == 1 ||
            this.selectCount == this.tableConfig.tableData.length
          ) {
            this.searchObj.page -= 1;
            this.getData();
          } else {
            this.getData();
          }
        }
      }
    },
    //打开删除弹框
    async delBackupsShow() {
      if (this.selectCount != 1) return this.$message.error("请勾选一条");
      const { data } = await backupApiInfo({ id: this.selectIds });
      //console.log(data);
      if (data.code == 200) {
        this.backupsDetails = data.data;
        this.delShow = true;
      }
    },
    //下载备份
    async downloadBackups() {
      if (this.selectCount != 1) return this.$message.error("请选择一条");
      const { data } = await backupApiDownload({ id: this.selectIds });
      console.log(data);
      if (data.code == 200) {
        //this.downUrl = data.data
        location.href = this.$ip + data.data;
      }
    },
    //打开导入备份文件位置
    importFileLocation() {},
    //导入备份 开始备份
    async importBackupsSub() {
      if (this.importLoading) return;
      if (this.importUrl == "") return this.$message.error("请上传文件");
      if (this.importBackupsNewName == "")
        return this.$message.error("请输入名称");
      this.importLoading = true;
      const params = {
        file_name: this.importBackupsNewName,
        file_path: this.importUrl,
      };
      try {
        const { data } = await backupApiImportData(params);
        console.log(data);
        this.isBackupsText = true;
        if (data.code == 200) {
          this.importProgress = 100;
          setTimeout(() => {
            this.$message.success("备份成功");
            this.importShow = false;
            this.importProgress = 0;
            this.isBackupsText = false;
            this.importUrl = "";
            this.importBackupsName = "";
            this.importBackupsNewName = "";
            this.getData();
            this.importLoading = false;
          }, 1200);
        }
      } catch (error) {
      } finally {
      }
    },
    // 导入备份上传文件
    async selectFile(file) {
      console.log(file);

      let list = file.name.split(".");
      let i = list.length - 1;

      if (file.name.split(".")[i] != "sql") {
        this.$message({ type: "error", message: "上传的类型必须为sql类型" });
      } else {
        this.importBackupsName = file.name;
        const formData = new FormData();
        formData.append("file_upload", file.raw);
        console.log(formData, this.importBackupsName);
        const { data } = await backupApiUploadFile(formData);
        //console.log(data);
        if (data.code == 200) {
          this.importUrl = data.data;
        }
      }
    },
    //开始还原备份
    async reductionBackups() {
      if (this.loading.restore) return;
      this.loading.restore = true;
      try {
        const { data } = await backupApiRestore({ id: this.selectIds });
        //console.log(data);
        this.isBackupsText = true;
        if (data.code == 200) {
          this.reductionProgress = 100;
          setTimeout(() => {
            this.$message.success("还原成功");
            this.reductionShow = false;
            this.reductionProgress = 0;
            this.isBackupsText = false;
            this.backupsDetails = {};
            this.getData();
          }, 1200);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading.restore = false;
      }
    },
    // 打开还原备份
    async clickReduction() {
      if (this.selectCount != 1) return this.$message.error("请选择一条");
      try {
        const { data } = await backupApiInfo({ id: this.selectIds });
        //console.log(data);
        if (data.code == 200) {
          this.backupsDetails = data.data;
          this.reductionShow = true;
        }
      } catch (error) {
        console.error(error);
      } finally {
      }
    },

    //打开文件位置
    addFileLocation() {},
    //新增备份提交
    async addBackups() {
      if (this.loading.add) return;
      if (this.addBackupsName.trim() == "")
        return this.$message.error("请输入名称");
      this.loading.add = true;
      try {
        const { data } = await backupApiAdd({ name: this.addBackupsName });
        // console.log(data);
        this.isBackupsText = true;
        if (data.code == 200) {
          this.addProgress = 100;

          setTimeout(() => {
            this.$message.success("新建成功");
            this.addShow = false;
            this.addProgress = 0;
            this.addBackupsName = "";
            this.isBackupsText = false;
            this.getData();
            this.loading.add = false;
          }, 1200);
        } else {
          this.loading.add = false;
        }
      } catch (e) {
        this.loading.add = false;
        console.error(e);
      }
    },
    search() {
      //console.log('搜索');
      this.searchObj.page = 1;
      this.getData();
    },
    reset() {
      //console.log('重置');
      (this.searchObj = {
        name: "",
        start_time: "",
        end_time: "",
        page: 1,
        page_size: 10,
      }),
        this.getData();
    },
    //输入分页
    pageBtnChange(page) {
      this.searchObj.page = page;
      this.getData();
    },
    //切换分页
    changePage(value) {
      //console.log(value);
      this.searchObj.page = value;
      this.getData();
    },
    // 秒转时分秒
    calcTime(second) {
      return calcTime(second);
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
      this.selectIds = strArr.join(",");
    },
    // 获取列表
    async getData() {
      console.log(this.searchObj);
      const params = {
        ...this.searchObj,
      };

      params.start_time = params.start_time
        ? this.$getTime(params.start_time) - 28801
        : "";
      params.end_time = params.end_time ? this.$getTime(params.end_time) : "";

      const { data } = await backupApiList(params);
      //console.log(data);
      if (data.code == 200) {
        // 获取列表
        this.tableConfig.tableData = data.data.data;
        // 总条数
        this.total = data.data.total;
        // 设置总页数
        this.pageTotal = Math.ceil(data.data.total / 10);
      }
    },
  },

  mounted() {},

  created() {
    this.getData();
  },
};
</script>
<style lang="less" scoped>
.class-box {
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 24px;
  box-sizing: border-box;

  .title-box {
    font-size: 16px;
    color: #313131;
  }

  .search-box {
    width: 905px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 23px;

    .search-input {
      width: 315px;
      height: 40px;
    }

    .startAndendData {
      width: 350px;
      height: 40px;
    }
  }

  .add-del_change {
    width: 690px;
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

  .table {
    margin-top: 30px;
    width: 1560px;
    height: 630px;
    border-bottom: 1px solid #dddddd;
    ::v-deep .el-table__row {
      height: 59px;
    }
  }

  .footer {
    height: 80px;
    display: flex;
    align-items: center;

    .allSelectBtn {
      margin-left: 10px;
    }

    .text {
      color: #333333;
      font-size: 16px;
      margin: 0 34px 0 10px;
    }
  }

  ::v-deep .popup-mask {
    .content-box {
      display: flex;
      justify-content: center;
      align-items: center;

      .my-popup-box {
        width: 256px;
        color: #333333;
        line-height: 32px;
        text-align: center;
        font-size: 16px;

        span {
          color: #2e8ae6;
        }
      }
    }
  }

  ::v-deep .dialog-mask {
    .dialog-box {
      width: 840px;
      height: 430px;

      .content-box {
        height: 320px;
        border-top: 1px solid #dddddd;
        box-sizing: border-box;
        padding: 35px 0 0 70px;

        span {
          display: block;
          font-size: 15px;
          color: #333333;
        }

        .backups-name {
          height: 38px;
          display: flex;
          align-items: center;

          span {
            margin-right: 16px;
          }

          input {
            width: 510px;
            height: 38px;
            background: #ffffff;
            border: 1px solid #e6e6e6;
            border-radius: 4px;
          }

          button {
            width: 100px;
            height: 38px;
            background: #2e8ae6;
            border-radius: 6px;
            font-size: 16px;
            color: #ffffff;
            margin-left: 11px;
            border: none;
            outline: none;
          }
        }

        .backups-schedule {
          margin-top: 40px;

          .schedule-box {
            width: 700px;
            height: 120px;
            background: rgba(51, 51, 51, 0);
            border: 1px dashed #cccccc;
            border-radius: 10px;
            margin-top: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            .el-progress {
              line-height: 0px;
              height: 20px;
              width: 500px;
              white-space: nowrap;

              .el-progress-bar__outer {
                border-radius: 11px;
                height: 20px !important;
                border: 1px solid #2e8ae6;
                background: #ffffff;

                .el-progress-bar__inner {
                  border-radius: 11px;
                  background-color: unset;
                  background-image: linear-gradient(to right, #05aafa, #2e8ae6);
                }
              }

              .el-progress__text {
                font-size: 16px;
                color: #2e8ae6;
                margin-left: 16px;
              }
            }

            span {
              font-size: 14px;
              color: #555555;
              margin-top: 15px;
            }
          }
        }
      }
    }
  }

  ::v-deep .import-box {
    .dialog-box {
      width: 840px;
      height: 460px;

      .content-box {
        height: 350px;
        border-top: 1px solid #dddddd;
        box-sizing: border-box;
        padding: 35px 0 0 70px;

        span {
          display: block;
          font-size: 15px;
          color: #333333;
        }

        .backups-name {
          height: 38px;
          display: flex;
          align-items: center;

          span {
            margin-right: 16px;
          }

          input {
            width: 510px;
            height: 38px;
            background: #ffffff;
            border: 1px solid #e6e6e6;
            border-radius: 4px;
          }

          button {
            width: 100px;
            height: 38px;
            line-height: 38px;
            background: #2e8ae6;
            border-radius: 6px;
            font-size: 16px;
            color: #ffffff;
            margin-left: 11px;
            border: none;
            outline: none;
          }
        }

        .backups-schedule {
          margin-top: 40px;

          .schedule-box {
            width: 700px;
            height: 120px;
            background: rgba(51, 51, 51, 0);
            border: 1px dashed #cccccc;
            border-radius: 10px;
            margin-top: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            .el-progress {
              line-height: 0px;
              height: 20px;
              width: 500px;
              white-space: nowrap;

              .el-progress-bar__outer {
                border-radius: 11px;
                height: 20px !important;
                border: 1px solid #2e8ae6;
                background: #ffffff;

                .el-progress-bar__inner {
                  border-radius: 11px;
                  background-color: unset;
                  background-image: linear-gradient(to right, #05aafa, #2e8ae6);
                }
              }

              .el-progress__text {
                font-size: 16px;
                color: #2e8ae6;
                margin-left: 16px;
              }
            }

            span {
              font-size: 14px;
              color: #555555;
              margin-top: 15px;
            }
          }
        }
      }
    }
  }
}
</style>
