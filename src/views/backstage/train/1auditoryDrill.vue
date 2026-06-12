<template>
  <div class="class-box">
    <div class="title-box">听觉训练管理及内容列表</div>

    <!-- 增删改 -->
    <div class="add-del_change">
      <buttonVue type="add" text="新增" @clickBtn="openAdd"></buttonVue>
      <buttonVue type="update" text="修改" @clickBtn="openEdit"></buttonVue>
      <buttonVue text="删除" @clickBtn="remove"></buttonVue>
    </div>
    <div class="total">
      当前列表共有数据:{{ tableConfig.tableData.length }}条
    </div>
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
              <div class="title_warp" v-if="row.row.info">
                <span>{{ row.row.info.title_name }}</span>
              </div>
            </template>

            <template v-slot:answer="row">
              <div class="title_warp" v-if="row.row.info">
                <span>{{ row.row.info.answer }}</span>
              </div>
            </template>

            <template v-slot:imgA="row">
              <img
                v-if="row.row.info"
                class="preview_img"
                :src="$ip + row.row.info.imgA"
              />
            </template>
            <template v-slot:imgB="row">
              <img
                v-if="row.row.info"
                class="preview_img"
                :src="$ip + row.row.info.imgB"
              />
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
      title="新增/编辑题目"
      @save="save"
    >
      <div class="title-box">
        <div class="label">题目名称:</div>
        <input
          type="text"
          placeholder="请输入题目名称"
          v-model="seleImgData.name"
        />
      </div>

      <div class="title-box" style="margin-top: 0.1rem">
        <div class="label">正确答案:</div>
        <!-- <input
          type="text"
          placeholder="请输入“A”或“B” "
          v-model="seleImgData.answer"
        /> -->
        <el-select
          v-model="seleImgData.answer"
          placeholder="请选择正确答案"
          :popper-append-to-body="false"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="title-box" style="margin: 0.1rem 0">
        <div class="label">图A名称:</div>
        <input
          type="text"
          placeholder="请输入图A名称"
          v-model="seleImgData.img1.name"
        />
      </div>
      <div class="title-box">
        <div class="label">图B名称:</div>
        <input
          type="text"
          placeholder="请输入图B名称"
          v-model="seleImgData.img2.name"
        />
      </div>

      <div class="add-admin flex_col_start">
        <div class="label">图片A:</div>
        <div class="add_row">
          <div class="add_col">
            <div class="upload_img" v-if="!seleImgData.img1.url">
              <img src="@/assets/img/backstage/train/add.png" />
            </div>
            <img
              class="upload_img"
              v-else
              :src="
                isBase64(seleImgData.img1.url)
                  ? seleImgData.img1.url
                  : $ip + seleImgData.img1.url
              "
            />
            <div class="button" style="margin-left: 0.5rem">
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
          <div class="label" style="margin-left: 0.25rem">图片B:</div>
          <div class="add_col">
            <div class="upload_img" v-if="!seleImgData.img2.url">
              <img src="@/assets/img/backstage/train/add.png" />
            </div>
            <img
              class="upload_img"
              v-else
              :src="
                isBase64(seleImgData.img2.url)
                  ? seleImgData.img2.url
                  : $ip + seleImgData.img2.url
              "
            />
            <div class="button" style="margin-left: 0.5rem">
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
        </div>
      </div>
      <!-- <div class="add_col">
        <div class="tips">说明： 上传图片格式为.jpg或.png。</div>
      </div> -->

      <div class="add-admin" style="margin-left: 0.4rem">
        <span>音乐音频:</span>
        <div class="add_row">
          <div class="upload_row2">
            <a
              class="text"
              v-if="seleImgData.audio"
              :href="$ip + seleImgData.audio"
              >{{
                seleImgData.audio ? seleImgData.audio.split("/").pop() : ""
              }}</a
            >
            <div v-else class="text"></div>
            <div class="button">
              <UploadButton
                accept=".mp3"
                v-loading="uploadAudioLoading"
                @change="changeUploadAudio"
                >本地上传
              </UploadButton>
            </div>
          </div>
        </div>
      </div>
    </backstage-dialog>
  </div>
</template>

<script>
import { base64ToFile } from "@/utils/url";
import { isBase64 } from "@/utils/type";
import { fileApiMusic, fileApiImage } from "@/server/api/file";
import {
  addAssets,
  getAssets,
  delAssets,
  editConcept,
} from "@/server/api/gameTrain";

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
            label: "答案",
            prop: "nickname",
            type: "slot",
            slotName: "answer",
          },

          {
            label: "图A",
            type: "slot",
            slotName: "imgA",
          },
          {
            label: "图B",
            type: "slot",
            slotName: "imgB",
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
      seleImgData: {
        name: "",
        answer: "",
        img1: {
          name: "",
          url: "",
        },
        img2: {
          name: "",
          url: "",
        },
        audio: "",
      },
      uploadAudioLoading: false,

      options: [
        {
          value: "A",
          label: "答案A",
        },
        {
          value: "B",
          label: "答案B",
        },
      ],
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
        type_id: "1",
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
        this.seleImgData.id ? await this.saveEdit() : await this.saveAdd();
      } catch (e) {
        console.error(e);
      } finally {
        this.addLoading = false;
      }
    },
    async saveAdd() {
      console.log(this.seleImgData);
      if (
        !this.seleImgData.name ||
        !this.seleImgData.img1.url ||
        !this.seleImgData.img2.url ||
        !this.seleImgData.answer ||
        !this.seleImgData.audio
      ) {
        this.$message.error("请填写或上传完整 ！");
        return;
      }

      const formData = new FormData();
      formData.append("type_id", "1");
      formData.append("imgA", this.seleImgData.img1.url);
      formData.append("imgB", this.seleImgData.img2.url);
      formData.append("answer", this.seleImgData.answer);
      formData.append("audio", this.seleImgData.audio);
      formData.append("name1", this.seleImgData.img1.name);
      formData.append("name2", this.seleImgData.img2.name);
      formData.append("title_name", this.seleImgData.name);
      const { data } = await addAssets(formData);
      if (data.code == this.$global.successCode) {
        console.log(data);
        this.getTableList();
        this.$message.success("新增成功！");
        this.showAddOrEditForm = false;
      } else {
        this.$message.error(data.message);
      }
    },

    async remove() {
      if (!this.selectIds) {
        this.$message.error("请勾选需要删除的列表！");
        return;
      }

      let flag = await this.$backstagePopup.asyncShow(`是否删除选中的内容？`);
      if (flag) {
        const res = await delAssets({ ids: this.selectIds });
        if (res.data.code == 200) {
          await this.getTableList();
          this.$message.success("删除成功！");
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
      this.seleImgData = {
        name: "",
        answer: "",
        img1: {
          sele: "A",
          url: "",
        },
        img2: {
          sele: "B",
          url: "",
        },
        audio: "",
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
        const res = await this.$imgCutting.asyncShow(file.raw, 400, 222);
        // this.addOrEditForm.img = data;
        let cuttingFile = base64ToFile(res);
        const { data } = await fileApiImage(cuttingFile);
        if (i == 1) {
          this.seleImgData.img1.url = data.data;
        }
        if (i == 2) {
          this.seleImgData.img2.url = data.data;
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.uploadingImg = false;
      }
    },
    async changeUploadAudio(file) {
      const isMp3 = (file) => {
        const extensions = ["mp3"];
        const fileType = file.name.split(".").pop().toLowerCase();
        return extensions.includes(fileType);
      };

      if (!isMp3(file)) {
        this.$message.error("上传音频为mp3格式");
        return;
      }

      this.uploadAudioLoading = true;

      try {
        const res = await fileApiMusic(file);
        if (res.data.code == 200) {
          this.seleImgData.audio = res.data.data;
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.uploadAudioLoading = false;
      }
    },

    openEdit() {
      if (!this.activeRow) {
        this.$message.error("请单击需要编辑的列！");
        return;
      }
      // console.log(this.activeRow);
      this.seleImgData = {
        id: this.activeRow.id,
        name: this.activeRow.info.title_name,
        answer: this.activeRow.info.answer,
        img1: {
          name: this.activeRow.info.name1,
          url: this.activeRow.info.imgA,
        },
        img2: {
          name: this.activeRow.info.name2,
          url: this.activeRow.info.imgB,
        },
        audio: this.activeRow.info.audio,
      };

      this.showAddOrEditForm = true;
    },
    async saveEdit() {
      if (
        !this.seleImgData.name ||
        !this.seleImgData.img1.url ||
        !this.seleImgData.img2.url ||
        !this.seleImgData.answer ||
        !this.seleImgData.audio
      ) {
        this.$message.error("请填写或上传完整 ！");
        return;
      }

      // console.log(this.isBase64(this.seleImgData.img2.url));
      const formData = new FormData();
      formData.append("type_id", "1");
      formData.append("imgA", this.seleImgData.img1.url);
      formData.append("imgB", this.seleImgData.img2.url);
      formData.append("answer", this.seleImgData.answer);
      formData.append("audio", this.seleImgData.audio);
      formData.append("name1", this.seleImgData.img1.name);
      formData.append("name2", this.seleImgData.img2.name);
      formData.append("title_name", this.seleImgData.name);
      formData.append("id", this.activeRow.id);
      const { data } = await editConcept(formData);
      if (data.code == this.$global.successCode) {
        this.getTableList();
        this.$message.success("修改成功！");
        this.showAddOrEditForm = false;
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
          // padding-left: 150px;
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
        padding: 35px 0 0 60px;

        .tips {
          width: 200px;
          opacity: 0.7;
          font-size: 16px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: left;
          color: #333333;
          line-height: 32px;
          margin: 15px 0 0 30px;
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

          .el-select-dropdown {
            left: 746px !important;
          }
          .el-popper {
            left: 746px !important;
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

            .upload_row2 {
              margin-left: 20px;
              background: rgba(51, 51, 51, 0);
              border-radius: 6px;
              box-sizing: border-box;
              display: flex;
              justify-content: space-between;

              .text {
                width: 440px;
                height: 38px;
                background: #ffffff;
                border: 0.01px solid #e6e6e6;
                border-radius: 4px;
                font-size: 14px;
                color: #333333;
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

              .button {
                align-items: center;
                display: flex;
                margin-left: 10px;
              }
            }

            .add_col {
              margin-left: 20px;
              display: flex;
              flex-direction: column;
            }

            .upload_img {
              width: 200px;
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
