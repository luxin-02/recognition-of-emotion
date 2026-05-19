<template>
  <div class="class-box">
    <div class="title-box">认知匹配管理及内容列表</div>

    <!-- 增删改 -->
    <div class="add-del_change">
      <buttonVue type="add" text="新增" @clickBtn="openAdd"></buttonVue>
      <buttonVue type="update" text="修改" @clickBtn="openEdit"></buttonVue>
      <buttonVue text="删除" @clickBtn="remove"></buttonVue>
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
            <template v-slot:nickname="row">
              <div class="title_warp">
                <span>{{ row.row.info.title_name }}</span>
              </div>
            </template>

            <template v-slot:image1="row">
              <img class="preview_img" :src="$ip + row.row.info.img1" />
              &nbsp; &nbsp;
              <img class="preview_img" :src="$ip + row.row.info.img4" />
            </template>
            <template v-slot:image2="row">
              <img class="preview_img" :src="$ip + row.row.info.img2" />
              &nbsp; &nbsp;
              <img class="preview_img" :src="$ip + row.row.info.img5" />
            </template>
            <template v-slot:image3="row">
              <img class="preview_img" :src="$ip + row.row.info.img3" />
              &nbsp; &nbsp;
              <img class="preview_img" :src="$ip + row.row.info.img6" />
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
      title="新增题目"
      @save="save"
    >
      <div class="title-box">
        <div class="label">题目名称:</div>
        <input
          type="text"
          placeholder="请输入名称"
          v-model="sortImgData.name"
        />
      </div>

      <div class="add-admin flex_col_start">
        <div class="label">配对1:</div>
        <div class="add_row">
          <div class="add_col">
            <div class="upload_img" v-if="!sortImgData.img1.url1">
              <img src="@/assets/img/backstage/train/add.png" />
            </div>
            <img
              class="upload_img"
              v-else
              :src="
                isBase64(sortImgData.img1.url1)
                  ? sortImgData.img1.url1
                  : $ip + sortImgData.img1.url1
              "
            />
            <div class="button">
              <uploadButton
                v-loading="uploadingImg"
                accept="image/png, image/jpeg"
                @change="
                  ($event) => {
                    changeUploadThumb($event, 1);
                  }
                "
              >
                点击上传
              </uploadButton>
            </div>
          </div>
          <div class="label">配对2:</div>
          <div class="add_col">
            <div class="upload_img" v-if="!sortImgData.img2.url1">
              <img src="@/assets/img/backstage/train/add.png" />
            </div>
            <img
              class="upload_img"
              v-else
              :src="
                isBase64(sortImgData.img2.url1)
                  ? sortImgData.img2.url1
                  : $ip + sortImgData.img2.url1
              "
            />
            <div class="button">
              <uploadButton
                v-loading="uploadingImg"
                accept="image/png, image/jpeg"
                @change="
                  ($event) => {
                    changeUploadThumb($event, 2);
                  }
                "
              >
                点击上传
              </uploadButton>
            </div>
          </div>
          <div class="label">配对3:</div>
          <div class="add_col">
            <div class="upload_img" v-if="!sortImgData.img3.url1">
              <img src="@/assets/img/backstage/train/add.png" />
            </div>
            <img
              class="upload_img"
              v-else
              :src="
                isBase64(sortImgData.img3.url1)
                  ? sortImgData.img3.url1
                  : $ip + sortImgData.img3.url1
              "
            />
            <div class="button">
              <uploadButton
                v-loading="uploadingImg"
                accept="image/png, image/jpeg"
                @change="
                  ($event) => {
                    changeUploadThumb($event, 3);
                  }
                "
              >
                点击上传
              </uploadButton>
            </div>
          </div>
        </div>
      </div>
      <div class="add-admin flex_col_start">
        <div class="label">配对1:</div>
        <div class="add_row">
          <div class="add_col">
            <div class="upload_img" v-if="!sortImgData.img1.url2">
              <img src="@/assets/img/backstage/train/add.png" />
            </div>
            <img
              class="upload_img"
              v-else
              :src="
                isBase64(sortImgData.img1.url2)
                  ? sortImgData.img1.url2
                  : $ip + sortImgData.img1.url2
              "
            />
            <div class="button">
              <uploadButton
                v-loading="uploadingImg"
                accept="image/png, image/jpeg"
                @change="
                  ($event) => {
                    changeUploadThumb($event, 4);
                  }
                "
              >
                点击上传
              </uploadButton>
            </div>
          </div>
          <div class="label">配对2:</div>
          <div class="add_col">
            <div class="upload_img" v-if="!sortImgData.img2.url2">
              <img src="@/assets/img/backstage/train/add.png" />
            </div>
            <img
              class="upload_img"
              v-else
              :src="
                isBase64(sortImgData.img2.url2)
                  ? sortImgData.img2.url2
                  : $ip + sortImgData.img2.url2
              "
            />
            <div class="button">
              <uploadButton
                v-loading="uploadingImg"
                accept="image/png, image/jpeg"
                @change="
                  ($event) => {
                    changeUploadThumb($event, 5);
                  }
                "
              >
                点击上传
              </uploadButton>
            </div>
          </div>
          <div class="label">配对3:</div>
          <div class="add_col">
            <div class="upload_img" v-if="!sortImgData.img3.url2">
              <img src="@/assets/img/backstage/train/add.png" />
            </div>
            <img
              class="upload_img"
              v-else
              :src="
                isBase64(sortImgData.img3.url2)
                  ? sortImgData.img3.url2
                  : $ip + sortImgData.img3.url2
              "
            />
            <div class="button">
              <uploadButton
                v-loading="uploadingImg"
                accept="image/png, image/jpeg"
                @change="
                  ($event) => {
                    changeUploadThumb($event, 6);
                  }
                "
              >
                点击上传
              </uploadButton>
            </div>
          </div>
        </div>
      </div>
      <div class="add_col">
        <div class="tips">提示：名称和图片对应，上传图片格式为.jpg或.png。</div>
      </div>
    </backstage-dialog>
  </div>
</template>

<script>
import { base64ToFile } from "@/utils/url";
import { isBase64 } from "@/utils/type";
import {
  addAssets,
  getAssets,
  delAssets,
  editConcept,
} from "@/server/api/gameTrain";
import { fileApiImage } from "@/server/api/file";

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
            slotName: "nickname",
          },

          {
            label: "图片A",
            type: "slot",
            slotName: "image1",
          },
          {
            label: "图片B",
            type: "slot",
            slotName: "image2",
          },
          {
            label: "图片C",
            type: "slot",
            slotName: "image3",
          },

          // {
          //   label: "添加时间",
          //   prop: "deleteTime",
          //   type: "function",
          //   callback: (row) => {
          //     return formatDate(new Date(row.add_time * 1000));
          //   },
          // },

          // {
          //   label: "显示状态",
          //   type: "slot",
          //   slotName: "show",
          // },
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
      sortImgData: {
        name: "",
        img1: { url1: "", url2: "" },
        img2: { url1: "", url2: "" },
        img3: { url1: "", url2: "" },
      },
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
      const { data } = await getAssets({
        type_id: "6",
        page: this.page.page,
        page_size: 10,
      });
      if (data.code == this.$global.successCode) {
        this.tableConfig.tableData = data.data.list;
        this.page.total = data.data.count;
      }
    },
    currentChange(row) {
      this.activeRow = row;
    },
    async save() {
      this.addLoading = true;
      try {
        this.sortImgData.id ? await this.saveEdit() : await this.saveAdd();
      } catch (e) {
        console.error(e);
      } finally {
        this.addLoading = false;
      }
    },
    async saveAdd() {
      console.log(this.sortImgData);
      if (
        !this.sortImgData.img1.url1 ||
        !this.sortImgData.img2.url1 ||
        !this.sortImgData.img3.url1 ||
        !this.sortImgData.img1.url2 ||
        !this.sortImgData.img2.url2 ||
        !this.sortImgData.img3.url2 ||
        !this.sortImgData.name
      ) {
        this.$message.error("请填写或上传完整 ！");
        return;
      }
      const formData = new FormData();
      formData.append("type_id", "6");
      formData.append("img1", this.sortImgData.img1.url1);
      formData.append("img2", this.sortImgData.img2.url1);
      formData.append("img3", this.sortImgData.img3.url1);
      formData.append("img4", this.sortImgData.img1.url2);
      formData.append("img5", this.sortImgData.img2.url2);
      formData.append("img6", this.sortImgData.img3.url2);
      formData.append("title_name", this.sortImgData.name);

      const { data } = await addAssets(formData);
      if (data.code == this.$global.successCode) {
        console.log(data);
        this.getTableList();
        this.showAddOrEditForm = false;
        this.$message.success("新增成功！");
      } else {
        this.$message.error(data.message);
      }
    },
    async remove() {
      if (!this.selectIds) {
        this.$message.error("请勾选需要删除的题目！");
        return;
      }

      let flag = await this.$backstagePopup.asyncShow(`是否删除选中的内容？`);
      if (flag) {
        const res = await delAssets({ ids: this.selectIds });
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
      this.sortImgData = {
        name: "",
        img1: { url1: "", url2: "" },
        img2: { url1: "", url2: "" },
        img3: { url1: "", url2: "" },
      };
      // if (this.tableConfig.tableData.length >= 10) {
      //   this.$message.error("此游戏题目已满,如需新增请删除其中一条。");
      //   return;
      // }
      this.showAddOrEditForm = true;
    },
    async changeUploadThumb(file, i) {
      const isImage = (file) => {
        const extensions = ["png", "jpg", "jpeg"];
        const fileType = file.name.split(".").pop().toLowerCase();
        return extensions.includes(fileType);
      };
      if (!isImage(file)) {
        this.$message.error("上传图片格式必须为png 或jpg 格式");
        return;
      }
      this.uploadingImg = true;
      try {
        const res = await this.$imgCutting.asyncShow(file.raw, 250, 170);
        // this.addOrEditForm.img = data;
        let cuttingFile = base64ToFile(res);
        const { data } = await fileApiImage(cuttingFile);
        if (i == 1) {
          this.sortImgData.img1.url1 = data.data;
        }
        if (i == 2) {
          this.sortImgData.img2.url1 = data.data;
        }
        if (i == 3) {
          this.sortImgData.img3.url1 = data.data;
        }
        if (i == 4) {
          this.sortImgData.img1.url2 = data.data;
        }
        if (i == 5) {
          this.sortImgData.img2.url2 = data.data;
        }
        if (i == 6) {
          this.sortImgData.img3.url2 = data.data;
        }
        // let cuttingFile = base64ToFile(data);
        // this.addOrEditForm.thumb = cuttingFile;
      } catch (error) {
        console.error(error);
      } finally {
        this.uploadingImg = false;
      }
    },
    openEdit() {
      if (!this.activeRow) {
        this.$message.error("请单击需要编辑的列！");
        return;
      }
      console.log(this.activeRow);
      this.sortImgData = {
        id: this.activeRow.id,
        name: this.activeRow.info.title_name,
        img1: {
          url1: this.activeRow.info.img1,
          url2: this.activeRow.info.img4,
        },
        img2: {
          url1: this.activeRow.info.img2,
          url2: this.activeRow.info.img5,
        },
        img3: {
          url1: this.activeRow.info.img3,
          url2: this.activeRow.info.img6,
        },
      };
      this.showAddOrEditForm = true;
    },
    async saveEdit() {
      if (
        !this.sortImgData.img1.url1 ||
        !this.sortImgData.img2.url1 ||
        !this.sortImgData.img3.url1 ||
        !this.sortImgData.img1.url2 ||
        !this.sortImgData.img2.url2 ||
        !this.sortImgData.img3.url2 ||
        !this.sortImgData.name
      ) {
        this.$message.error("请填写或上传完整 ！");
        return;
      }
      const formData = new FormData();
      formData.append("type_id", "6");
      formData.append("id", this.sortImgData.id);
      formData.append("img1", this.sortImgData.img1.url1);
      formData.append("img2", this.sortImgData.img2.url1);
      formData.append("img3", this.sortImgData.img3.url1);
      formData.append("img4", this.sortImgData.img1.url2);
      formData.append("img5", this.sortImgData.img2.url2);
      formData.append("img6", this.sortImgData.img3.url2);
      formData.append("title_name", this.sortImgData.name);

      const { data } = await editConcept(formData);
      if (data.code == this.$global.successCode) {
        console.log(data);
        this.getTableList();
        this.showAddOrEditForm = false;
        this.$message.success("修改成功！");
      } else {
        this.$message.error(data.message);
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
      height: 680px;
      border-radius: 8px 0 0 0;

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
        height: 680px;
        display: flex;
        flex-wrap: wrap;
        border-bottom: 1px solid #e6e6e6;
        box-sizing: border-box;
        .preview_img {
          width: 86px;
          height: 48px;
          border-radius: 10px;
        }
        ::v-deep {
          .el-table__row {
            height: 63px;
            &:nth-child(10) {
              > td {
                border-bottom: none;
              }
            }
          }
        }
        ::v-deep {
          .slot {
            width: 100%;
            display: flex;
            justify-content: center;
          }
        }

        .title_warp {
          // display: flex;
          // align-items: center;
          width: 100%;
          // justify-content: flex-start;
          // padding-left: 100px;
          // box-sizing: border-box;

          img {
            width: 38px;
            height: 38px;
          }

          span {
            // padding-left: 13px;
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
              height: 58px;
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
    margin-top: 10px;
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
      height: 580px;

      .content-box {
        height: 370px;
        border-top: 1px solid #dddddd;
        box-sizing: border-box;
        padding: 35px 0 0 85px;

        .tips {
          width: 500px;
          opacity: 0.7;
          font-size: 16px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: left;
          color: #333333;
          line-height: 32px;
          margin: 15px 0 0 120px;
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
              height: 68px;
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
