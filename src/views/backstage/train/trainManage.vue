<template>
  <div class="class-box">
    <div class="title-box">猜谜语训练内容添加修改</div>
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
        @clickBtn="() => (page.title = searchName)"
      ></buttonVue>
      <buttonVue text="重置" @clickBtn="reset"></buttonVue>
    </div>
    <!-- 增删改 -->
    <div class="add-del_change">
      <buttonVue
        v-auth="'/index/training/addclass'"
        @clickBtn="
          () => {
            addClassName = '';
            showAddClass = true;
          }
        "
        :iconUrl="require('@/assets/img/backstage/assembly/btnAdd.png')"
        backgroundColor="#00AEFF"
        text="新增分类"
      >
      </buttonVue>
      <buttonVue
        v-auth="'/index/training/delclass'"
        :iconUrl="require('@/assets/img/backstage/assembly/btnDelete.png')"
        backgroundColor="#FF7B2B"
        text="删除分类"
        @clickBtn="removeClass"
      >
      </buttonVue>
      <buttonVue
        v-auth="'/index/training/add'"
        type="add"
        text="新增图片"
        @clickBtn="openAdd"
      ></buttonVue>
      <buttonVue
        v-auth="'/index/training/edit'"
        type="update"
        text="修改图片"
        @clickBtn="openEdit"
      ></buttonVue>
      <buttonVue
        v-auth="'/index/training/del'"
        text="删除"
        @clickBtn="remove"
      ></buttonVue>
    </div>
    <div class="total">当前列表共有数据：{{ page.total }}条</div>
    <div class="table">
      <ClassChange
        value_key="id"
        label="title"
        :title="'训练分类'"
        v-model="page.train_class_id"
        :array="trainClass"
      />
      <div class="right_box">
        <div class="table_warp">
          <tableVue
            @currentChange="currentChange"
            :tableConfig="tableConfig"
            ref="tableRef"
            @changeSelect="changeSelect"
          >
            <template v-slot:image="row">
              <img class="preview_img" :src="$ip + row.row.img_url" />
            </template>
            <template v-slot:audio>
              <div class="audio_box">
                <div class="icon"></div>
                <div class="text">已上传</div>
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
      :isAutoSaveClose="false"
      :isSaveLoading="addOrEditLoading || uploadFileLoading"
      class="add_edit_warp"
      :show.sync="showAdd"
      title="新增/编辑资源"
      @save="save"
    >
      <div class="add-admin" style="display: flex">
        <div class="label">所属分类:</div>
        <div class="add-select">
          <selectVue
            :options="trainClass"
            v-model="addOrEditForm.train_class_id"
            ItemValue="id"
            label="title"
          >
          </selectVue>
        </div>
      </div>
      <div class="add-admin flex_col_start">
        <template v-for="(v, i) in 6">
          <div class="upload_wrap" :key="i">
            <div class="label" v-if="i + 1 == 1 || i + 1 == 2">题目1:</div>
            <div class="label" v-if="i + 1 == 3 || i + 1 == 4">题目2:</div>
            <div class="label" v-if="i + 1 == 5 || i + 1 == 6">题目3:</div>
            <div class="add_row">
              <div class="add_col">
                <template v-if="i == 0">
                  <img
                    class="upload_img"
                    v-if="seleImgData.img1.url1"
                    :src="$ip + seleImgData.img1.url1"
                  />
                  <div class="upload_img" v-else>
                    <img src="@/assets/img/backstage/train/add.png" />
                  </div>
                </template>
                <template v-if="i == 1">
                  <img
                    class="upload_img"
                    v-if="seleImgData.img1.url2"
                    :src="$ip + seleImgData.img1.url2"
                  />
                  <div class="upload_img" v-else>
                    <img src="@/assets/img/backstage/train/add.png" />
                  </div>
                </template>
                <template v-if="i == 2">
                  <img
                    class="upload_img"
                    v-if="seleImgData.img2.url1"
                    :src="$ip + seleImgData.img2.url1"
                  />
                  <div class="upload_img" v-else>
                    <img src="@/assets/img/backstage/train/add.png" />
                  </div>
                </template>
                <template v-if="i == 3">
                  <img
                    class="upload_img"
                    v-if="seleImgData.img2.url2"
                    :src="$ip + seleImgData.img2.url2"
                  />
                  <div class="upload_img" v-else>
                    <img src="@/assets/img/backstage/train/add.png" />
                  </div>
                </template>
                <template v-if="i == 4">
                  <img
                    class="upload_img"
                    v-if="seleImgData.img3.url1"
                    :src="$ip + seleImgData.img3.url1"
                  />
                  <div class="upload_img" v-else>
                    <img src="@/assets/img/backstage/train/add.png" />
                  </div>
                </template>
                <template v-if="i == 5">
                  <img
                    class="upload_img"
                    v-if="seleImgData.img3.url2"
                    :src="$ip + seleImgData.img3.url2"
                  />
                  <div class="upload_img" v-else>
                    <img src="@/assets/img/backstage/train/add.png" />
                  </div>
                </template>

                <div class="button">
                  <uploadButton
                    v-loading="uploadFileLoading"
                    accept="image/png, image/jpeg"
                    @change="
                      ($event) => {
                        changeUploadFile($event, i);
                      }
                    "
                  >
                    点击上传
                  </uploadButton>
                </div>
              </div>
            </div>
            <div class="title-box" style="align-items: stretch">
              <div class="label">标题:</div>
              <input
                v-if="i == 0"
                type="text"
                style="width: 3rem"
                v-model="seleImgData.img1.name1"
              />
              <input
                v-if="i == 1"
                type="text"
                style="width: 3rem"
                v-model="seleImgData.img1.name2"
              />
              <input
                v-if="i == 2"
                type="text"
                style="width: 3rem"
                v-model="seleImgData.img2.name1"
              />
              <input
                v-if="i == 3"
                type="text"
                style="width: 3rem"
                v-model="seleImgData.img2.name2"
              />
              <input
                v-if="i == 4"
                type="text"
                style="width: 3rem"
                v-model="seleImgData.img3.name1"
              />
              <input
                v-if="i == 5"
                type="text"
                style="width: 3rem"
                v-model="seleImgData.img3.name2"
              />
            </div>
          </div>
        </template>
      </div>
      <div class="add_col">
        <div class="tips">
          说明：上传图片格式为.jpg或.png。每道题对应一个正确答案，共三道。
        </div>
      </div>
    </backstage-dialog>

    <backstage-popup
      :iconType="'info'"
      class="add_edit_class"
      :show.sync="showAddClass"
      title="新增分类"
      @save="saveClass"
    >
      <div class="content_box">
        <div class="class_name">
          <div class="title">分类命名：</div>
          <input maxlength="12" v-model="addClassName" />
        </div>

        <div class="add-admin flex_col_start">
          <div class="label">封面:&nbsp;&nbsp;&nbsp;</div>
          <div class="add_row">
            <div class="add_col">
              <div class="upload_img" v-if="!addOrEditForm.img_url">
                <img src="@/assets/img/backstage/train/add.png" />
              </div>
              <img
                class="upload_img"
                v-else
                :src="$ip + addOrEditForm.img_url"
              />
              <div class="button">
                <uploadButton
                  v-loading="uploadFileLoading"
                  accept="image/png, image/jpeg"
                  @change="changeUploadFile"
                >
                  点击上传
                </uploadButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </backstage-popup>
  </div>
</template>

<script>
import { copyNonEmptyProperties } from "@/utils/object";
import { base64ToFile } from "@/utils/url";
import {
  getTrainList,
  addTrainClass,
  removeTrainClass,
  getTrainClassList,
  addTrain,
  updateTrain,
  removeTrain,
} from "@/server/api/train";
import { fileApiImage, fileApiMusic } from "@/server/api/file";

export default {
  async created() {
    await this.getClassList();
    this.trainClass.length
      ? (this.page.train_class_id = this.trainClass[0].id)
      : "";
    await this.getTableList();
  },
  data() {
    return {
      showAddClass: false,
      showAdd: false,
      searchName: "",
      addClassName: "",
      trainClass: [],
      activeRow: null,
      uploadAudioLoading: false,
      addOrEditForm: {
        train_class_id: "",
        img_url: "",
        title: "",
        content: "",
        question1: "",
        standard_answer: "",
        audio: "",
      },
      page: {
        title: "",
        start_time: "",
        end_time: "",
        total: 0,
        page: 1,
        page_size: 10,
        train_class_id: "",
      },
      allSelect: false,
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
            width: "80",
            callback: (row) => {
              let activePage = this.page.page;
              let pageSize = this.page.page_size;
              let page = activePage < 1 ? 1 : activePage;
              return row.index + 1 + page * pageSize - pageSize;
            },
          },
          { label: "名称", prop: "title", className: "text_hidden" },

          {
            label: "图片",
            type: "slot",
            slotName: "image",
          },

          {
            label: "问题答案",
            type: "slot",
            slotName: "audio",
          },

          {
            label: "日期",
            prop: "deleteTime",
            type: "function",
            callback: (row) => {
              return row.add_time;
            },
          },
        ],
      },
      addOrEditLoading: false,
      uploadFileLoading: false,

      seleImgData: {
        img1: {
          id: "1",
          name1: "",
          url1: "",
          name2: "",
          url2: "",
        },
        img2: {
          id: "2",
          name1: "",
          url1: "",
          name2: "",
          url2: "",
        },
        img3: {
          id: "3",
          name1: "",
          url1: "",
          name2: "",
          url2: "",
        },
      },
    };
  },
  computed: {
    //组合属性用于监听搜索参数自动查询
    combinedProperties() {
      return (
        this.page.start_time +
        this.page.end_time +
        this.page.train_class_id +
        this.page.title
      );
    },
  },

  methods: {
    currentChange(row) {
      this.activeRow = row;
    },
    async save() {
      this.addOrEditLoading = true;
      try {
        this.addOrEditForm.id ? await this.saveEdit() : await this.saveAdd();
      } catch (e) {
        console.error(e);
      } finally {
        this.addOrEditLoading = false;
      }
    },
    openEdit() {
      if (!this.activeRow) {
        this.$message.error("请勾选需要编辑的资源！");
        return;
      }
      let data = JSON.parse(JSON.stringify(this.activeRow));

      const common_data = JSON.parse(JSON.parse(data.common_data)[0]);
      console.log(data);
      data.answer1 = common_data.answer1;
      data.answer2 = common_data.answer2;
      data.answer3 = common_data.answer3;
      data.standard_answer = parseInt(common_data.standard_answer);
      this.addOrEditForm = data;

      this.showAdd = true;
    },

    async saveAdd() {
      console.log(this.seleImgData);
      return;
      let form = {
        train_class_id: "",
        img_url: "",
        title: "",

        content: "",
        question1: "",
        answer1: "",
        answer2: "",
        answer3: "",
        standard_answer: "",
      };
      const params = copyNonEmptyProperties(form, { ...this.addOrEditForm });
      const verify = (params) => {
        if (params.title.trim().length == "") {
          this.$message.error("请输入标题");
          return false;
        }
        if (params.train_class_id == "") {
          this.$message.error("请选择分类");
          return false;
        }
        if (params.img_url == "") {
          this.$message.error("请上传封面！");
          return false;
        }

        if (params.answer1.trim() == "") {
          this.$message.error("请输入答案一！");
          return false;
        }
        if (params.answer2.trim() == "") {
          this.$message.error("请输入答案二！");
          return false;
        }
        if (params.answer3.trim() == "") {
          this.$message.error("请输入答案三！");
          return false;
        }
        if (params.standard_answer === "") {
          this.$message.error("请选择正确答案！");
          return false;
        }
        return true;
      };
      let flag = verify(params);
      if (!flag) {
        return;
      }

      const res = await addTrain({
        ...params,
        custom_data: [
          {
            question1: params.question1,
            answer1: params.answer1,
            answer2: params.answer2,
            answer3: params.answer3,
            standard_answer: params.standard_answer,
          },
        ],
      });
      if (res.data.code == 200) {
        this.getTableList();
        this.showAdd = false;
        this.$message.success("新增成功！");
      }
    },
    async saveEdit() {
      let form = {
        train_class_id: "",
        img_url: "",
        title: "",

        content: "",
        question1: "",
        answer1: "",
        answer2: "",
        answer3: "",
        standard_answer: "",
        id: "",
      };
      const params = copyNonEmptyProperties(form, { ...this.addOrEditForm });
      const verify = (params) => {
        if (params.title.trim().length == "") {
          this.$message.error("请输入标题");
          return false;
        }
        if (params.train_class_id == "") {
          this.$message.error("请选择分类");
          return false;
        }
        if (params.img_url == "") {
          this.$message.error("请上传封面！");
          return false;
        }

        if (params.answer1.trim() == "") {
          this.$message.error("请输入答案一！");
          return false;
        }
        if (params.answer2.trim() == "") {
          this.$message.error("请输入答案二！");
          return false;
        }
        if (params.answer3.trim() == "") {
          this.$message.error("请输入答案三！");
          return false;
        }
        if (params.standard_answer === "") {
          this.$message.error("请选择正确答案！");
          return false;
        }
        return true;
      };
      let flag = verify(params);
      if (!flag) {
        return;
      }
      const res = await updateTrain({
        img_url: params.img_url,
        title: params.title,
        train_class_id: params.train_class_id,
        content: params.content,
        id: params.id,
        custom_data: [
          {
            question1: params.question1,
            answer1: params.answer1,
            answer2: params.answer2,
            answer3: params.answer3,
            standard_answer: params.standard_answer,
          },
        ],
      });
      if (res.data.code == 200) {
        this.getTableList();
        this.showAdd = false;
        this.$message.success("修改成功！");
      }
    },
    openAdd() {
      this.addOrEditForm = {
        train_class_id: "",
        img_url: "",
        title: "",
        voice_url: "",
        content: "",
        question1: "",
        answer1: "",
        answer2: "",
        answer3: "",
        standard_answer: "",
      };
      this.showAdd = true;
    },
    async saveClass() {
      if (this.addClassName.trim() == "") {
        this.$message.error("请输入分类名称！");
        return;
      }
      const res = await addTrainClass({ title: this.addClassName });
      if (res.data.code == 200) {
        this.$message.success("新增成功");
        await this.getClassList();
        this.trainClass.length
          ? (this.page.train_class_id = this.trainClass[0].id)
          : "";
      }
    },

    async removeClass() {
      if (!this.page.train_class_id) {
        this.$message.error("请选择需要删除的分类！");
        return;
      }

      let flag = await this.$backstagePopup.asyncShow(
        `是否删除选中的分类？<span style="color: #FF9500">注意删除分类会将分类下面的资源删除！</span>`
      );
      if (flag) {
        const res = await removeTrainClass({ ids: this.page.train_class_id });
        if (res.data.code == 200) {
          this.$message.success("删除成功！");
          await this.getClassList();
          this.trainClass.length
            ? (this.page.train_class_id = this.trainClass[0].id)
            : "";
          await this.getTableList();
        }
      }
    },
    //获取
    async getClassList() {
      const res = await getTrainClassList();
      if (res.data.code == 200) {
        this.trainClass = res.data.data;
      }
    },
    async getTableList(page) {
      if (page) {
        this.page.page = page;
      }
      const params = {
        ...this.page,
      };

      params.start_time = params.start_time
        ? new Date(params.start_time).getTime() / 1000
        : "";
      params.end_time = params.end_time
        ? new Date(params.end_time).getTime() / 1000
        : "";

      const res = await getTrainList(params);
      if (res.data.code == 200) {
        this.page.page = res.data.data.current_page;
        this.page.total = res.data.data.total;
        this.tableConfig.tableData = res.data.data.data;
      }
    },
    reset() {
      let train_class_id = this.page.train_class_id;
      this.page = {
        title: "",
        start_time: "",
        end_time: "",
        total: 0,
        page: 1,
        page_size: 10,
        train_class_id: "",
      };
      this.page.train_class_id = train_class_id;

      this.searchName = "";
    },
    async remove() {
      if (!this.selectIds) {
        this.$message.error("请勾选需要删除的资源！");
        return;
      }

      let flag = await this.$backstagePopup.asyncShow(`是否删除选中的内容？`);
      if (flag) {
        const res = await removeTrain({ ids: this.selectIds });
        if (res.data.code == 200) {
          this.$message.success("删除成功！");
          this.getTableList();
        }
      }
    },
    changeSelect(changeValue) {
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

    async changeUploadFile(file, i) {
      const isImage = (file) => {
        const extensions = ["png", "jpg", "jpeg"];
        const fileType = file.name.split(".").pop().toLowerCase();
        return extensions.includes(fileType);
      };
      if (!isImage(file)) {
        this.$message.error("上传图片格式必须为png 或jpg 格式");
        return;
      }
      this.uploadFileLoading = true;

      try {
        const data = await this.$imgCutting.asyncShow(file.raw, 550, 333);
        let cuttingFile = base64ToFile(data);
        const res = await fileApiImage(cuttingFile);

        if (res.data.code == 200) {
          if (i == 0) {
            this.seleImgData.img1.url1 = res.data.data;
          }
          if (i == 1) {
            this.seleImgData.img1.url2 = res.data.data;
          }
          if (i == 2) {
            this.seleImgData.img2.url1 = res.data.data;
          }
          if (i == 3) {
            this.seleImgData.img2.url2 = res.data.data;
          }
          if (i == 4) {
            this.seleImgData.img3.url1 = res.data.data;
          }
          if (i == 5) {
            this.seleImgData.img3.url2 = res.data.data;
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.uploadFileLoading = false;
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
          this.addOrEditForm.audio = res.data.data;
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.uploadAudioLoading = false;
      }
    },
  },
  watch: {
    combinedProperties() {
      this.getTableList();
    },
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
      width: 1330px;
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

        .preview_img {
          width: 86px;
          height: 48px;
        }

        ::v-deep {
          .table {
            margin-top: 0;

            td.text_hidden .cell {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              flex-wrap: nowrap;
              display: block;
              text-align: left;
            }

            .cell {
              text-align: center;
              overflow: hidden;

              text-overflow: ellipsis;
              white-space: nowrap;

              .slot {
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0 auto;
              }
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

        .audio_box {
          display: flex;
          align-items: center;
        }

        .icon {
          width: 16px;
          height: 16px;
          background-size: 100% 100%;
          background-image: url("@/assets/img/backstage/icon/success.png");
          background-size: 100% 100%;
          margin-right: 11px;

          &.error {
            background-image: url("@/assets/img/backstage/icon/error.png");
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
      width: 877px;
      height: 600px;

      .content-box {
        height: 480px;
        border-top: 1px solid #dddddd;
        box-sizing: border-box;
        padding: 10px 0 0 85px;
        overflow: auto;
        &::-webkit-scrollbar {
          display: none; //滚动条隐藏
        }

        .tips {
          width: 500px;
          height: 48px;
          opacity: 0.7;
          font-size: 14px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: left;
          color: #333333;
          line-height: 32px;
          margin: 10px 0 0 100px;
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
          width: 80px;
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
          // display: flex;
          align-items: center;
          margin-top: 20px;
          .upload_wrap {
            display: flex;
            margin-bottom: 10px;
          }

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
            margin-left: 21px;

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
              display: flex;
              flex-direction: column;
            }

            .upload_img {
              width: 110px;
              height: 66px;
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
        }
      }
    }
  }

  .add_edit_class {
    .content_box {
      width: 300px;
      height: 200px;
      .class_name {
        display: flex;
        align-items: center;
        margin: 30px 0 0 50px;
        width: 100%;
        .title {
          font-size: 14px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: center;
          color: #333333;
          line-height: 14px;
          white-space: nowrap;
        }

        input {
          width: 340px;
          height: 38px;
          background: #ffffff;
          border: 1px solid #e6e6e6;
          border-radius: 4px;
        }
      }

      .add-admin {
        display: flex;
        align-items: center;
        margin: 10px 0 0 50px;

        &.flex_col_start {
          align-items: flex-start;
        }
        .add_row {
          display: flex;
          margin-left: 21px;
          .add_col {
            display: flex;
            flex-direction: column;
          }

          .upload_img {
            width: 110px;
            height: 66px;
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
        }
      }
    }
  }
}
</style>
