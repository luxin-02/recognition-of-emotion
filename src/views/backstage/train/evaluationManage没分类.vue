<template>
  <div class="class-box">
    <div class="title-box">量表管理分类及内容列表</div>
    <!-- 搜索 -->
    <div class="search-bpx">
      <div class="search-input">
        <inputVue v-model="searchName" placeholder="搜索关键字"></inputVue>
      </div>
      <div class="startAndendData">
        <startAndendData
          :startTime.sync="page.start_time"
          :endTime.sync="page.end_time"
          startPlaceholder="开始时间"
          endPlaceholder="结束时间"
        >
        </startAndendData>
      </div>
      <buttonVue
        text="搜索"
        @clickBtn="() => (page.name = searchName)"
      ></buttonVue>
      <buttonVue text="重置" @clickBtn="reset"></buttonVue>
    </div>
    <!-- 增删改 -->
    <div class="add-del_change">
      <buttonVue type="add" text="新增" @clickBtn="openAdd"></buttonVue>
      <buttonVue type="update" text="修改" @clickBtn="openEdit"></buttonVue>
      <buttonVue text="删除" @clickBtn="remove"></buttonVue>
      <buttonVue
        backgroundColor="#297DCC"
        :iconUrl="require('@/assets/img/backstage/assembly/yes_eye.png')"
        text="显示"
        @clickBtn="updateType(true)"
      ></buttonVue>
      <buttonVue
        backgroundColor="#FFAF00"
        :iconUrl="require('@/assets/img/backstage/assembly/no_eye.png')"
        text="隐藏"
        @clickBtn="updateType(false)"
      >
      </buttonVue>
    </div>
    <div class="total">当前列表共有数据:{{ page.total }}条</div>
    <div class="table">
      <div class="right_box">
        <div class="table_warp">
          <tableVue
            @currentChange="currentChange"
            :tableConfig="tableConfig"
            ref="tableRef"
            @changeSelect="changeSelect"
          >
            <template v-slot:image="row">
              <div class="title_warp">
                <span>{{ row.row.title }}</span>
              </div>
            </template>
            <template v-slot:show="row">
              <div
                class="show_box"
                :class="row.row.is_show == 1 ? '' : 'close'"
              >
                <div class="text">
                  {{ row.row.is_show == 1 ? "显示" : "隐藏" }}
                </div>
              </div>
            </template>
          </tableVue>
        </div>

        <div class="footer">
          <checkboxVue class="allSelectBtn" v-model="allSelect"> </checkboxVue>
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

    <backstage-dialog
      :isSaveLoading="addLoading"
      :isAutoSaveClose="false"
      class="add_edit_warp"
      :show.sync="showAddOrEditForm"
      :title="addOrEditForm.id ? '编辑量表' : '量表上传'"
      @save="save"
    >
      <div class="title-box">
        <div class="label">量表名称:</div>
        <input
          type="text"
          placeholder="选择文件读取"
          :disabled="true"
          v-model="addOrEditForm.name"
        />
      </div>
      <!-- <div class="add-admin">
          <div class="label">所属分类:</div>
          <div class="add-select">
              <selectVue>
              </selectVue>
          </div>
      </div> -->

      <div class="add-admin flex_col_start">
        <div class="label">量表图片:</div>
        <div class="add_row">
          <div class="add_col">
            <div class="upload_img" v-if="!addOrEditForm.img">
              <img src="@/assets/img/backstage/train/add.png" />
            </div>
            <img
              class="upload_img"
              v-else
              :src="
                isBase64(addOrEditForm.img)
                  ? addOrEditForm.img
                  : $ip + addOrEditForm.img
              "
            />
            <div class="button">
              <uploadButton
                v-loading="uploadingImg"
                accept="image/png, image/jpeg"
                @change="changeUploadThumb"
              >
                本地上传
              </uploadButton>
            </div>
          </div>
          <div class="add_col">
            <div class="tips">
              说明：上传图片格式为.jpg或.png，尺寸建议不超过120px*120px。
            </div>
          </div>
        </div>
      </div>
      <div class="add-admin" v-if="!addOrEditForm.id">
        <div class="label">选择文件:</div>
        <div class="file_src_warp">{{ addOrEditForm.file.name }}</div>

        <div class="file_up_button">
          <uploadButton
            v-loading="uploadingExcel"
            accept=".xlsx, .xls, application/vnd.ms-excel, application/vnd.open"
            @change="changeUploadExcel"
          >
            选择
          </uploadButton>
        </div>
      </div>
    </backstage-dialog>
  </div>
</template>

<script>
import { formatDate } from "@/utils/time";
import { base64ToFile } from "@/utils/url";
import {
  backGaugeApiAdd,
  backGaugeDetailApiByPath,
  backGaugeApiEdit,
  backGaugeApiList,
  backGaugeApiDel,
  backGaugeTypeApiShow,
} from "@/server/api/guage";
import { isBase64 } from "@/utils/type";
import { createFormData } from "@/utils/object";

export default {
  created() {
    this.getTableList();
  },
  data() {
    return {
      file: "",
      showAddOrEditForm: false,
      searchName: "",

      page: {
        name: "",
        start_time: "",
        end_time: "",
        total: 0,
        page: 1,
        page_size: 10,
      },
      allSelect: false,
      tableConfig: {
        //高亮行
        currentRow: "",
        // 是否有选择按框
        isSelect: true,
        // 资源分类列表
        tableData: [],
        // 每一列的标题
        headerTitle: [
          {
            label: "序号",
            type: "function",
            width: 80,
            callback: (row) => {
              let page = this.page.page;
              return (
                row.index + 1 + page * this.page.page_size - this.page.page_size
              );
            },
          },
          {
            label: "名称",
            prop: "nickname",
            type: "slot",
            slotName: "image",
          },

          {
            label: "添加时间",
            prop: "deleteTime",
            type: "function",
            callback: (row) => {
              return formatDate(new Date(row.add_time * 1000));
            },
          },

          {
            label: "显示状态",
            type: "slot",
            slotName: "show",
          },
        ],
      },

      //上传图片时锁定
      uploadingImg: false,
      //上传excel时锁定
      uploadingExcel: false,
      //添加时button锁定
      addLoading: false,
      //添加表单
      addOrEditForm: {
        name: "",
        thumb: "",
        excel: "",
        file: {},
        img: "",
      },
      activeRow: null,
    };
  },
  computed: {
    //组合属性用于监听搜索参数自动查询
    combinedProperties() {
      return this.page.end_time + this.page.start_time + this.page.name;
    },
  },
  methods: {
    //判断是否为base64路径
    isBase64,

    async getTableList(page) {
      if (page) {
        this.page.page = page;
      }
      const params = {
        ...this.page,
      };

      if (params.start_time) {
        params.start_time = new Date(params.start_time).getTime() / 1000;
      }

      if (params.end_time) {
        params.end_time = new Date(params.end_time).getTime() / 1000;
      }

      const res = await backGaugeApiList(params);
      if (res.data.code == 200) {
        // this.page.page = res.data.data.current_page;
        this.page.total = res.data.data.total;
        this.tableConfig.tableData = res.data.data.list;
      }
    },
    currentChange(row) {
      this.activeRow = row;
    },
    async save() {
      this.addLoading = true;
      try {
        if (this.addOrEditForm.id) {
          await this.saveEdit();
        } else {
          await this.saveAdd();
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.addLoading = false;
      }
    },
    async saveAdd() {
      let params = {
        ...this.addOrEditForm,
      };

      isBase64(params.thumb) ? (params.thumb = params.img) : "";

      //删除无用属性
      Reflect.deleteProperty(params, "file");
      //删除无用属性
      Reflect.deleteProperty(params, "img");
      //验证参数方法！
      const verify = (params) => {
        // if (params.thumb == '') {
        //   this.$message.error('请上传封面！')
        //   return false
        // }

        if (params.excel == "") {
          this.$message.error("请上传excel!");
          return false;
        }
        if (params.name == "") {
          this.$message.error("请输入量表名称！");
          return false;
        }

        return true;
      };

      let flag = verify(params);
      if (!flag) {
        return;
      }

      params = createFormData(params);

      const res = await backGaugeApiAdd(params);
      if (res.data.code == 200) {
        this.$message.success("新增成功！");
        this.getTableList();
        this.showAddOrEditForm = false;
      }
    },

    async saveEdit() {
      let params = {
        ...this.addOrEditForm,
      };

      isBase64(params.thumb) ? (params.thumb = params.img) : "";

      //删除无用属性
      Reflect.deleteProperty(params, "file");
      //删除无用属性
      Reflect.deleteProperty(params, "img");
      //删除无用属性
      Reflect.deleteProperty(params, "excel");
      //验证参数方法！
      const verify = (params) => {
        if (params.thumb == "") {
          this.$message.error("请上传封面！");
          return false;
        }

        if (params.name == "") {
          this.$message.error("请输入量表名称！");
          return false;
        }

        return true;
      };

      let flag = verify(params);
      if (!flag) {
        return;
      }

      params = createFormData(params);

      const res = await backGaugeApiEdit(params);
      if (res.data.code == 200) {
        this.$message.success("修改成功！");
        this.getTableList();
        this.showAddOrEditForm = false;
      }
    },

    reset() {
      this.page = {
        name: "",
        start_time: "",
        end_time: "",
        total: 0,
        page: 1,
        page_size: 10,
      };
      this.searchName = "";
    },
    async remove() {
      if (!this.selectIds) {
        this.$message.error("请勾选需要删除的量表！");
        return;
      }

      let flag = await this.$backstagePopup.asyncShow(`是否删除选中的内容？`);
      if (flag) {
        const res = await backGaugeApiDel({ ids: this.selectIds });
        if (res.data.code == 200) {
          this.$message.success("删除成功！");
          this.getTableList();
        }
      }
    },
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
    // 清空已选择项
    clearSelect() {
      this.allSelect = false;
      if (!this.allSelect) {
        //获取表格dom;
        const tableDom = this.$refs.tableRef;
        // 全选功能
        tableDom.$children[0].clearSelection();
      }
    },
    openAdd() {
      this.addOrEditForm = {
        thumb: "",
        img: "",
        excel: "",
        file: {},
        name: "",
      };
      this.showAddOrEditForm = true;
    },
    openEdit() {
      if (!this.activeRow) {
        this.$message.error("请选择！");
        return;
      }

      this.addOrEditForm = {
        id: this.activeRow.id,
        thumb: this.activeRow.thumb,
        img: this.activeRow.thumb,
        excel: "",
        file: {},
        name: this.activeRow.title,
      };
      this.showAddOrEditForm = true;
    },
    async changeUploadThumb(file) {
      const isImage = (file) => {
        const extensions = ["png", "jpg", "jpeg"];
        const fileType = file.name.split(".").pop().toLowerCase();
        return extensions.includes(fileType);
      };

      const checkImageSize = (file, maxWidth, maxHeight) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = function () {
            const width = img.width;
            const height = img.height;
            if (width > maxWidth || height > maxHeight) {
              reject("图片尺寸超过指定大小");
            } else {
              resolve("图片尺寸符合要求");
            }
          };
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });
      };
      if (!isImage(file)) {
        this.$message.error("上传图片格式必须为png 或jpg 格式");
        return;
      }

      //验证图片尺寸
      // try {
      //   await checkImageSize(file.raw
      //     , 260, 40)
      // } catch (error) {
      //   this.$message.error(error)
      //   return
      // }
      this.uploadingImg = true;

      try {
        // const res = await fileApiImage(file);
        // if (res.data.code == 200) {
        //   this.addOrEditForm.thumb = res.data.data;
        //
        // }

        const data = await this.$imgCutting.asyncShow(file.raw, 120, 120);
        this.addOrEditForm.img = data;
        let cuttingFile = base64ToFile(data);

        this.addOrEditForm.thumb = cuttingFile;
      } catch (error) {
        console.error(error);
      } finally {
        this.uploadingImg = false;
      }
    },
    async changeUploadExcel(file) {
      function isExcelFile(file) {
        // 获取文件名
        const fileName = file.name;
        // 判断文件扩展名是否为 .xlsx 或 .xls
        const fileExt = fileName.split(".").pop();
        return fileExt === "xlsx" || fileExt === "xls";
      }

      let flag = isExcelFile(file);
      if (!flag) {
        this.$message.error("请选择xlsx文件!");
        return;
      }
      //锁定上传
      this.uploadingExcel = true;

      try {
        // const fileRes = await uploadExcelFile(file)
        // if (fileRes.data.code != 200) {
        //   return
        // }
        // let path = fileRes.data.data;
        this.addOrEditForm.excel = file.raw;
        this.addOrEditForm.file = file;
        const params = new FormData();
        params.set("excel", this.addOrEditForm.excel);
        const detailsRes = await backGaugeDetailApiByPath(params);
        console.log(this.addOrEditForm.file);
        if (detailsRes.data.code == 200) {
          this.addOrEditForm.name = detailsRes.data.data.title;
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.uploadingExcel = false;
      }
    },
    //更新状态隐藏显示
    async updateType(type) {
      if (!this.selectIds) {
        this.$message.error(`请勾选需要${type ? "显示" : "隐藏"}的量表！`);
        return;
      }

      let flag = await this.$backstagePopup.asyncShow(
        `是否${type ? "显示" : "隐藏"}选中的量表？`
      );
      if (flag) {
        let params = {
          ids: this.selectIds,
          type: type ? 1 : 2,
        };
        const res = await backGaugeTypeApiShow(params);
        if (res.data.code == 200) {
          this.$message.success("修改状态成功！");
          this.getTableList();
        }
      }
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

  .search-bpx {
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
    height: 40px;
    display: flex;

    margin-top: 25px;

    ::v-deep {
      button {
        margin-right: 10px;
      }
    }
  }

  .total {
    width: 300px;
    font-size: 16px;
    text-align: right;
    margin-top: -20px;
    float: right;
  }

  .table {
    display: flex;
    width: 1560px;
    margin-top: 30px;

    ::v-deep {
      .class_change_title {
        border-radius: 6px 0 0px 0;
      }
    }

    .right_box {
      width: 1560px;
      border-left: 1px solid #e6e6e6;
      height: 710px;

      .title {
        height: 46px;
        background: #eeeeee;
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: center;
        color: #333333;
        border-radius: 0px 6px 0px 0px;
        line-height: 46px;
      }

      .table_warp {
        width: 100%;
        height: 590px + 46px;
        display: flex;
        flex-wrap: wrap;
        border-bottom: 1px solid #e6e6e6;
        box-sizing: border-box;

        ::v-deep {
          .slot {
            width: 100%;
            display: flex;
            justify-content: center;
          }
        }

        .title_warp {
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: flex-start;
          padding-left: 100px;
          box-sizing: border-box;

          img {
            width: 38px;
            height: 38px;
          }

          span {
            padding-left: 13px;

            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #333333;
          }
        }

        ::v-deep {
          .table {
            margin-top: 0;

            .cell {
              display: flex;
              justify-content: center;
            }

            th {
              height: 46px;
              padding: 0;

              &:last-child(1) {
                border-radius: 6px 0 0 6px;
              }
            }

            .el-table__row td {
              padding: 0;
              height: 59px;
              box-sizing: border-box;
            }
          }
        }

        .show_box {
          width: 56px;
          height: 28px;
          background: rgba(0, 143, 204, 0.1);
          border: 1px solid #008fcc;
          border-radius: 4px;
          font-size: 14px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: center;
          color: #008fcc;
          line-height: 28px;

          &.close {
            width: 56px;
            height: 28px;
            background: #fff7e5;
            border: 1px solid #ffaf00;
            border-radius: 4px;
            color: #ffaf00;
          }
        }
      }
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

  // /deep/ .popup-mask {
  //     .content-box {
  //         display: flex;
  //         justify-content: center;
  //         align-items: center;

  //         .my-popup-box {
  //             width: 256px;
  //             color: #333333;
  //             line-height: 32px;
  //             text-align: center;
  //             font-size: 16px;
  //         }
  //     }

  // }
}

::v-deep {
  .add_edit_warp {
    .dialog-box {
      width: 840px;
      height: 480px;

      .content-box {
        height: 370px;
        border-top: 1px solid #dddddd;
        box-sizing: border-box;
        padding: 35px 0 0 85px;

        .tips {
          width: 321px;
          height: 48px;
          opacity: 0.7;
          font-size: 14px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: left;
          color: #333333;
          line-height: 32px;
        }

        .row {
          display: flex;
        }

        .mid_input {
          display: flex;
          align-items: center;
          margin-top: 43px;
          margin-bottom: 52px;

          input {
            width: 120px;
            height: 38px;
            background: #ffffff;
            border: 1px solid #e6e6e6;
            border-radius: 4px;
            margin-left: 21px;
            margin-right: 49px;
          }
        }

        .select_button {
          width: 60px;
          height: 38px;
          background: #ffffff;
          border: 1px solid #e6e6e6;
          border-radius: 6px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 51px;
          font-size: 14px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: center;
          color: #333333;

          &.active {
            background: #2e8ae6;
            border-radius: 6px;
            color: white;
          }
        }

        span {
          font-size: 14px;
          color: #333333;
        }

        .label_title {
          font-size: 16px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: left;
          color: #333333;
          line-height: 16px;
          margin: 24px 0 18px 0;
        }

        .tip {
          opacity: 0.55;
          font-size: 14px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: left;
          color: #333333;
          line-height: 14px;
        }

        .label {
          width: 100px;
          text-align: right;
        }

        .title-box {
          display: flex;
          align-items: center;

          input {
            width: 550px;
            height: 38px;
            background: #ffffff;
            border: 1px solid #e6e6e6;
            border-radius: 4px;
            outline: none;
            padding: 10px 0 10px 10px;
            box-sizing: border-box;
            font-size: 14px;
            margin-left: 21px;
          }
        }

        .add-admin {
          display: flex;
          align-items: center;
          margin-top: 20px;

          &.flex_col_start {
            align-items: flex-start;
          }

          .add-select {
            width: 240px;
            height: 38px;
            background: #ffffff;
            //border: 1px solid #e6e6e6;
            border-radius: 4px;
            box-sizing: border-box;
            margin-left: 21px;
          }

          .add_row {
            display: flex;
            //margin-left: 21px;

            .upload_row {
              width: 667px;
              height: 50px;
              background: rgba(51, 51, 51, 0);
              border: 1px dashed #cccccc;
              border-radius: 6px;
              box-sizing: border-box;

              display: flex;
              padding: 0 17px;
              justify-content: space-between;

              img {
                width: 16px;
                height: 16px;
              }

              .text {
                font-size: 14px;
                font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                font-weight: 400;
                text-decoration: underline;
                text-align: left;
                color: #002aff;
                line-height: 50px;
              }

              .success_tip {
                font-size: 14px;
                font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                font-weight: 400;
                text-align: left;
                color: #333333;
                margin-right: 41px;
                margin-left: 8px;
              }

              .button {
                align-items: center;
                display: flex;
              }
            }

            .add_col {
              margin-left: 20px;
              display: flex;
              flex-direction: column;
            }

            .upload_img {
              width: 100px;
              height: 100px;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #ffffff;
              border: 1px solid #e6e6e6;
              border-radius: 10px;
              margin-bottom: 15px;

              img {
                width: 35px;
                height: 35px;
              }
            }

            .tip {
              opacity: 0.7;
              font-size: 14px;
              font-family: Microsoft YaHei, Microsoft YaHei-Regular;
              font-weight: 400;
              text-align: left;
              color: #333333;
              line-height: 32px;
            }
          }

          .file_src_warp {
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #333333;
            width: 500px;
            height: 38px;
            background: #ffffff;
            border: 1px solid #e6e6e6;
            border-radius: 4px;
            display: flex;
            align-items: center;

            margin-left: 21px;
            margin-right: 10px;
            box-sizing: border-box;
            padding-left: 11px;
          }
        }
      }
    }
  }
}
</style>
