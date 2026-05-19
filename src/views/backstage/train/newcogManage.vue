<template>
  <div class="class-box">
    <div class="title-box">认知分类及内容列表</div>
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
        @clickBtn="() => (page.title = searchName)"
      ></buttonVue>
      <buttonVue text="重置" @clickBtn="reset"></buttonVue>
    </div>
    <!-- 增删改 -->
    <div class="add-del_change">
      <!-- v-auth="'/index/cognition/addclass'" -->
      <buttonVue
        v-if="false"
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
      <!-- v-auth="'/index/cognition/delclass'" -->
      <buttonVue
        v-if="false"
        :iconUrl="require('@/assets/img/backstage/assembly/btnDelete.png')"
        backgroundColor="#FF7B2B"
        text="删除分类"
        @clickBtn="removeClass"
      >
      </buttonVue>
      <!-- v-auth="'/index/cognition/add'" -->
      <buttonVue type="add" text="新增图片" @clickBtn="openAdd"></buttonVue>

      <!-- v-auth="'/index/cognition/edit'" -->
      <buttonVue type="update" text="修改图片" @clickBtn="openEdit"></buttonVue>
      <!-- v-auth="'/index/cognition/del'" -->
      <buttonVue text="删除" @clickBtn="remove"></buttonVue>
    </div>
    <div class="total">当前列表共有数据：{{ page.total }}条</div>
    <div class="table">
      <ClassChange
        value_key="id"
        label="name"
        :title="'认知分类'"
        v-model="page.class_id"
        :array="cognitionClass"
      >
      </ClassChange>
      <div class="right_box">
        <div class="table_warp">
          <tableVue
            @currentChange="currentChange"
            :tableConfig="tableConfig"
            ref="tableRef"
            @changeSelect="changeSelect"
          >
            <template v-slot:image="row">
              <img class="preview_img" :src="$ip + row.row.back_pic" />
              &nbsp; &nbsp;
              <img class="preview_img" :src="$ip + row.row.front_pic" />
            </template>
            <template v-slot:audio="row">
              <div class="audio_box">
                <div
                  class="icon"
                  :class="
                    row.row.e_front_audio || row.row.z_front_audio
                      ? ''
                      : 'error'
                  "
                ></div>
                <div class="text">
                  {{
                    row.row.e_front_audio || row.row.z_front_audio
                      ? "已上传"
                      : "未上传"
                  }}
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
      class="addOrEdit classDialog"
      :show.sync="showAddClass"
      title="新增分类"
      @save="saveClass"
      @cancel="
        () => {
          showAddClass = false;
          addClassName = '';
          classImgUrl = '';
        }
      "
    >
      <div class="video">
        <div class="name">
          <span>分类名称:</span>
          <input type="text" v-model="addClassName" />
        </div>

        <div class="cover">
          <span>分类封面:</span>
          <div class="cover_img">
            <img :src="$ip + classImgUrl" alt="" v-if="classImgUrl" />
            <img
              src="@/assets/img/backstage/assembly/cross.png"
              alt=""
              v-else
              style="width: 0.35rem; height: 0.35rem"
            />
          </div>
          <div class="cover_upload">
            <span>说明：封面图片格式为.jpg或.png，尺寸建议228px*150px。</span>
            <el-upload
              class="uploader"
              action=""
              :show-file-list="false"
              :auto-upload="false"
              :on-change="changeUploadFile2"
            >
              <button>本地上传</button>
            </el-upload>
          </div>
        </div>
      </div>
    </backstage-dialog>
    <backstage-dialog
      :isSaveLoading="
        addOrEditLoading || uploadAudioLoading || uploadFileLoading
      "
      :isAutoSaveClose="false"
      class="add_edit_warp"
      :show.sync="showAdd"
      title="新增/编辑资源"
      @save="save"
    >
      <div class="title-box">
        <span>图片名称:</span>
        <input type="text" v-model="addOrEditForm.title" />
      </div>
      <div class="add-admin">
        <span>所属分类:</span>
        <div class="add-select">
          <selectVue
            :options="cognitionClass"
            v-model="addOrEditForm.class_id"
            ItemValue="id"
            label="name"
          >
          </selectVue>
        </div>
      </div>
      <div class="label_title">图片设置</div>
      <div class="tip">
        说明：上传格式为.jpg或.png，建议尺寸不小于390px*260px，图一对应音频1，图二对应音频2。
      </div>
      <div style="display: flex">
        <div class="add-admin">
          <span style="opacity: 0">认知图片:</span>
          <div class="add_row">
            <img
              class="upload_img"
              v-if="addOrEditForm.back_pic"
              :src="$ip + addOrEditForm.back_pic"
            />
            <img
              class="upload_img"
              v-else
              src="@/assets/img/backstage/train/img_add.png"
            />
            <div class="add_col">
              <div class="button">
                <uploadButton
                  accept="image/png, image/jpeg"
                  @change="
                    ($event) => {
                      changeUploadFile($event, 1);
                    }
                  "
                  v-loading="uploadFileLoading"
                >
                  本地上传
                </uploadButton>
              </div>
            </div>
          </div>
        </div>
        <div class="add-admin">
          <div class="add_row">
            <img
              class="upload_img"
              v-if="addOrEditForm.front_pic"
              :src="$ip + addOrEditForm.front_pic"
            />
            <img
              class="upload_img"
              v-else
              src="@/assets/img/backstage/train/img_add.png"
            />
            <div class="add_col">
              <div class="button">
                <uploadButton
                  accept="image/png, image/jpeg"
                  @change="
                    ($event) => {
                      changeUploadFile($event, 2);
                    }
                  "
                  v-loading="uploadFileLoading"
                >
                  本地上传
                </uploadButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="label_title">音频设置</div>
      <div class="add-admin">
        <span>音频1:</span>
        <div class="add_row">
          <div class="upload_row">
            <a
              class="text"
              v-if="addOrEditForm.z_front_audio"
              :href="$ip + addOrEditForm.z_front_audio"
              >{{
                addOrEditForm.z_front_audio
                  ? addOrEditForm.z_front_audio.split("/").pop()
                  : ""
              }}</a
            >
            <div v-else class="text"></div>
            <div class="button">
              <img
                :src="
                  addOrEditForm.z_front_audio
                    ? require('@/assets/img/backstage/popup/success.png')
                    : require('@/assets/img/backstage/popup/ic-close.png')
                "
              />

              <div class="success_tip">
                {{ addOrEditForm.z_front_audio ? "已上传" : "未上传" }}
              </div>
              <UploadButton
                accept=".mp3"
                v-loading="uploadAudioLoading"
                @change="
                  ($event) => {
                    changeUploadAudio($event, 1);
                  }
                "
                >本地上传
              </UploadButton>
            </div>
          </div>
        </div>
      </div>
      <div class="add-admin">
        <span>音频2:</span>
        <div class="add_row">
          <div class="upload_row">
            <a
              class="text"
              v-if="addOrEditForm.e_front_audio"
              :href="$ip + addOrEditForm.e_front_audio"
              >{{
                addOrEditForm.e_front_audio
                  ? addOrEditForm.e_front_audio.split("/").pop()
                  : ""
              }}</a
            >
            <div v-else class="text"></div>
            <div class="button">
              <img
                :src="
                  addOrEditForm.e_front_audio
                    ? require('@/assets/img/backstage/popup/success.png')
                    : require('@/assets/img/backstage/popup/ic-close.png')
                "
              />

              <div class="success_tip">
                {{ addOrEditForm.e_front_audio ? "已上传" : "未上传" }}
              </div>
              <UploadButton
                accept=".mp3"
                v-loading="uploadAudioLoading"
                @change="
                  ($event) => {
                    changeUploadAudio($event, 2);
                  }
                "
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
import { formatDate } from "@/utils/time";
import { fileApiMusic, fileApiImage } from "@/server/api/file";
import { copyNonEmptyProperties } from "@/utils/object";
import { base64ToFile } from "@/utils/url";

import {
  getCogClass,
  getCogList,
  addCogList,
  delCogList,
  addCogClass,
  delCogClass,
} from "@/server/api/gameTrain";

let config = new Map([
  [
    "表情识别",
    {
      hiddenUploadImg: false,
      hiddenUploadAudio: false,
      hiddenUploadContent: true,
    },
  ],
  [
    "好学生",
    {
      hiddenUploadImg: false,
      hiddenUploadAudio: false,
      hiddenUploadContent: true,
    },
  ],
  [
    "需求表达",
    {
      hiddenUploadImg: false,
      hiddenUploadAudio: false,
      hiddenUploadContent: true,
    },
  ],
  [
    "做有礼貌的好孩子",
    {
      hiddenUploadImg: false,
      hiddenUploadAudio: false,
      hiddenUploadContent: true,
    },
  ],
  [
    "认一认",
    {
      hiddenUploadImg: false,
      hiddenUploadAudio: false,
      hiddenUploadContent: true,
    },
  ],
  [
    "观察花朵",
    {
      hiddenUploadImg: false,
      hiddenUploadAudio: false,
      hiddenUploadContent: true,
    },
  ],
  [
    "绕口令",
    {
      hiddenUploadImg: true,
      hiddenUploadAudio: false,
      hiddenUploadContent: false,
    },
  ],
  [
    "观察身体部位",
    {
      hiddenUploadImg: false,
      hiddenUploadAudio: false,
      hiddenUploadContent: true,
    },
  ],
  [
    "观察天气",
    {
      hiddenUploadImg: false,
      hiddenUploadAudio: false,
      hiddenUploadContent: true,
    },
  ],
  [
    "认识乐器",
    {
      hiddenUploadImg: false,
      hiddenUploadAudio: false,
      hiddenUploadContent: false,
    },
  ],
  [
    "",
    {
      hiddenUploadImg: false,
      hiddenUploadAudio: false,
      hiddenUploadContent: false,
    },
  ],
]);

export default {
  async created() {
    await this.getClassList();
    this.cognitionClass.length
      ? (this.page.class_id = this.cognitionClass[0].id)
      : "";
    await this.getTableList();
  },
  data() {
    return {
      showAddClass: false,
      showAdd: false,
      searchName: "",
      addClassName: "",
      cognitionClass: [],
      activeRow: null,
      addOrEditForm: {
        class_id: "",
        title: "",
        z_front_audio: "",
        e_front_audio: "",
        front_pic: "",
        back_pic: "",
      },
      page: {
        title: "",
        start_time: "",
        end_time: "",
        total: 0,
        page: 1,
        page_size: 10,
        class_id: "",
      },
      allSelect: false,
      tableConfig: {
        // 是否有选择按框
        isSelect: true,
        // 资源分类列表
        tableData: [],
        currentRow: "",
        // 每一列的标题
        headerTitle: [
          {
            label: "序号",
            type: "function",
            width: "100px",
            callback: (row) => {
              let page = this.page.page;
              return (
                row.index + 1 + page * this.page.page_size - this.page.page_size
              );
            },
          },
          { label: "标题", prop: "title" },

          {
            label: "图片",
            type: "slot",
            slotName: "image",
          },

          {
            label: "音频上传",
            type: "slot",
            slotName: "audio",
          },

          {
            label: "日期",
            prop: "deleteTime",
            type: "function",
            callback: (row) => {
              return formatDate(Number(row.add_time) * 1000);
            },
          },
        ],
      },
      addOrEditLoading: false,
      uploadFileLoading: false,
      uploadAudioLoading: false,
      classImgUrl: "",
    };
  },
  computed: {
    //组合属性用于监听搜索参数自动查询
    combinedProperties() {
      return (
        this.page.start_time +
        this.page.end_time +
        this.page.class_id +
        this.page.title
      );
    },
    activeClassAuth() {
      let find = this.cognitionClass.find(
        (v) => v.id == this.addOrEditForm.class_id
      );
      let title = find ? find.title : "";

      return config.get(title);
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
        this.$message.error("请选择需要编辑的资源！");
        return;
      }
      this.activeRow = { ...this.activeRow, class_id: this.page.class_id };
      this.addOrEditForm = JSON.parse(JSON.stringify(this.activeRow));

      this.showAdd = true;
    },

    async saveAdd() {
      let form = {
        title: "",
        class_id: "",
        z_front_audio: "",
        e_front_audio: "",
        front_pic: "",
        back_pic: "",
      };
      const params = copyNonEmptyProperties(form, { ...this.addOrEditForm });
      const verify = (params) => {
        if (
          params.title.trim().length == "" ||
          params.class_id == "" ||
          params.z_front_audio == "" ||
          params.e_front_audio == "" ||
          params.front_pic == "" ||
          params.back_pic == ""
        ) {
          this.$message.error("请完整上传");
          return false;
        }

        return true;
      };
      let flag = verify(params);
      if (!flag) {
        return;
      }
      const res = await addCogList(params);
      if (res.data.code == 200) {
        this.getTableList();
        this.showAdd = false;
        this.$message.success("新增成功！");
      }
    },
    async saveEdit() {
      let form = {
        id: "",
        title: "",
        class_id: "",
        z_front_audio: "",
        e_front_audio: "",
        front_pic: "",
        back_pic: "",
      };

      const params = copyNonEmptyProperties(form, { ...this.addOrEditForm });
      const verify = (params) => {
        if (
          params.title.trim().length == "" ||
          params.class_id == "" ||
          params.z_front_audio == "" ||
          params.e_front_audio == "" ||
          params.front_pic == "" ||
          params.back_pic == ""
        ) {
          this.$message.error("请完整上传");
          return false;
        }

        return true;
      };
      let flag = verify(params);
      if (!flag) {
        return;
      }
      const res = await addCogList(params);
      if (res.data.code == 200) {
        this.getTableList();
        this.showAdd = false;
        this.$message.success("修改成功！");
      }
    },
    openAdd() {
      this.addOrEditForm = {
        class_id: this.page.class_id,
        title: "",
        z_front_audio: "",
        e_front_audio: "",
        front_pic: "",
        back_pic: "",
      };
      this.showAdd = true;
    },
    async saveClass() {
      if (this.addClassName.trim() == "") {
        this.$message.error("请输入分类名称！");
        return;
      }
      const res = await addCogClass({
        name: this.addClassName,
        icon: this.classImgUrl,
      });
      if (res.data.code == 200) {
        this.$message.success("新增成功");
        await this.getClassList();
        this.cognitionClass.length
          ? (this.page.class_id = this.cognitionClass[0].id)
          : "";
      }
    },

    async removeClass() {
      if (!this.page.class_id) {
        this.$message.error("请选择需要删除的分类！");
        return;
      }

      let flag = await this.$backstagePopup.asyncShow(
        `是否删除选中的分类？<span style="color: #FF9500">注意删除分类会将分类下面的资源删除！</span>`
      );
      if (flag) {
        const res = await delCogClass({
          ids: this.page.class_id,
        });
        if (res.data.code == 200) {
          this.$message.success("删除成功！");
          await this.getClassList();
          this.cognitionClass.length
            ? (this.page.class_id = this.cognitionClass[0].id)
            : "";
          await this.getTableList();
        }
      }
    },
    //获取
    async getClassList() {
      const { data } = await getCogClass();
      if (data.code == 200) {
        this.cognitionClass = data.data;
        console.log(data.data);
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

      const res = await getCogList(params);
      if (res.data.code == 200) {
        this.page.total = res.data.total;
        this.tableConfig.tableData = res.data.data;
      }
    },
    reset() {
      let class_id = this.page.class_id;
      this.page = {
        title: "",
        start_time: "",
        end_time: "",
        total: 0,
        page: 1,
        page_size: 10,
        class_id: "",
      };
      this.page.class_id = class_id;

      this.searchName = "";
    },
    async remove() {
      if (!this.selectIds) {
        this.$message.error("请勾选需要删除的资源！");
        return;
      }

      let flag = await this.$backstagePopup.asyncShow(`是否删除选中的内容？`);
      if (flag) {
        const res = await delCogList({ ids: this.selectIds });
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
        const data = await this.$imgCutting.asyncShow(file.raw, 390, 260);
        let cuttingFile = base64ToFile(data);
        const res = await fileApiImage(cuttingFile);

        if (res.data.code == 200) {
          if (i == 1) {
            this.addOrEditForm.back_pic = res.data.data;
          }
          if (i == 2) {
            this.addOrEditForm.front_pic = res.data.data;
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.uploadFileLoading = false;
      }
    },
    async changeUploadAudio(file, i) {
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
          if (i == 1) {
            this.addOrEditForm.z_front_audio = res.data.data;
          }
          if (i == 2) {
            this.addOrEditForm.e_front_audio = res.data.data;
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.uploadAudioLoading = false;
      }
    },

    async changeUploadFile2(file, i) {
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
        const data = await this.$imgCutting.asyncShow(file.raw, 228, 150);
        let cuttingFile = base64ToFile(data);
        const res = await fileApiImage(cuttingFile);

        if (res.data.code == 200) {
          this.classImgUrl = res.data.data;
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.uploadFileLoading = false;
      }
    },
  },
  watch: {
    combinedProperties() {
      this.getTableList(1);
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
    width: 620px;
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

            .cell {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              text-align: center;
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

        .audio_box {
          display: flex;
          align-items: center;
          justify-content: center;
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
      margin-left: 15px;
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
      height: 598px + 100px;

      .content-box {
        height: 488px + 100px;
        border-top: 1px solid #dddddd;
        box-sizing: border-box;
        padding: 35px 0 0 85px;

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

            .add_col {
              margin-left: 20px;
              display: flex;
              flex-direction: column;
            }

            .upload_img {
              width: 192px;
              height: 108px;
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

        .textarea_row {
          margin-top: 20px;
        }

        textarea {
          width: 550px;
          height: 70px;
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
    }
  }

  .add_edit_class {
    .content_box {
      display: flex;
      flex-direction: column;
      align-items: center;

      .title {
        padding-top: 41px;
        padding-bottom: 20px;
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: center;
        color: #333333;
        line-height: 14px;
      }

      input {
        width: 340px;
        height: 38px;
        background: #ffffff;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
      }
    }
  }
}
/deep/ .addOrEdit {
  .dialog-box {
    width: 840px;
    height: 480px;
    display: block;

    .content {
      height: 430px;

      .content-box {
        height: 370px;

        .video {
          width: 100%;
          height: 100%;
          padding: 36px 0 0 85px;
          box-sizing: border-box;

          span {
            font-size: 14px;
            color: #333333;
            margin-right: 30px;
          }

          .name {
            display: flex;
            align-items: center;

            input {
              width: 590px;
              height: 38px;
              background: #ffffff;
              border: 1px solid #e6e6e6;
              border-radius: 4px;
              font-size: 14px;
              color: #333333;
            }
          }

          .where_class {
            display: flex;
            align-items: center;
            margin-top: 20px;

            .selectTool {
              width: 300px;
              height: 38px;

              .el-input__inner {
                background: #ffffff;
                border: 1px solid #e6e6e6;
                border-radius: 4px;
              }
            }
          }

          .cover {
            display: flex;
            margin-top: 20px;

            span {
              line-height: 30px;
            }

            .cover_img {
              width: 192px;
              height: 108px;
              background: #ffffff;
              border: 1px solid #e6e6e6;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .cover_upload {
              margin-left: 20px;

              > span {
                font-size: 14px;
                color: rgba(51, 51, 51, 0.7);
              }

              .uploader {
                width: 100px;
                height: 38px;
                margin-top: 10px;

                .el-upload {
                  display: block;
                  width: 100%;
                  height: 100%;

                  button {
                    display: block;
                    width: 100%;
                    height: 100%;
                    background: #2e8ae6;
                    border-radius: 6px;
                    font-size: 16px;
                    color: #ffffff;
                  }
                }
              }
            }
          }

          .video_file {
            display: flex;
            align-items: center;
            margin-top: 20px;

            input {
              width: 500px;
              height: 38px;
              background: #ffffff;
              border: 1px solid #e6e6e6;
              border-radius: 4px;
              font-size: 14px;
              color: #333333;
            }

            .video_warp {
              width: 80px;
              height: 38px;
              margin-left: 10px;

              .el-upload {
                width: 100%;
                height: 100%;

                button {
                  width: 100%;
                  height: 100%;
                  background: #2e8ae6;
                  border-radius: 6px;
                  font-size: 16px;
                  color: #ffffff;
                }
              }
            }
          }
        }
      }
    }
  }
}
/deep/ .classDialog {
  .dialog-box {
    height: 380px;
  }
}
</style>
