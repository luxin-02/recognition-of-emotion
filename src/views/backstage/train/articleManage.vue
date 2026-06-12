<template>
  <div class="class-box">
    <div class="title-box">学习分类及内容列表</div>
    <!-- 搜索 -->
    <div class="search-bpx">
      <div class="search-input">
        <inputVue v-model="searchName" placeholder="搜索关键字"></inputVue>
      </div>
      <div class="startAndendData">
        <startAndendData
          :startTime.sync="page.startData"
          :endTime.sync="page.endData"
          startPlaceholder="开始时间"
          endPlaceholder="结束时间"
        >
        </startAndendData>
      </div>
      <buttonVue
        text="搜索"
        @clickBtn="
          () => {
            page.title = searchName;
            getTableList();
          }
        "
      ></buttonVue>
      <buttonVue text="重置" @clickBtn="reset"></buttonVue>
    </div>
    <!-- 增删改 -->
    <div class="add-del_change">
      <buttonVue
        v-auth="'backendarticlemanager/addclass'"
        buttonSize="120,40"
        backgroundColor="#00AEFF"
        type="add"
        text="新增分类"
        @clickBtn="addClass = true"
      >
      </buttonVue>
      <buttonVue
        v-auth="'backendarticlemanager/delclass'"
        buttonSize="120,40"
        backgroundColor="#FF7B2B"
        type="remove"
        text="删除分类"
        @clickBtn="del(1)"
      >
      </buttonVue>
      <buttonVue
        v-auth="'backendarticlemanager/add'"
        type="add"
        text="新增"
        @click="openAdd(true)"
      ></buttonVue>
      <buttonVue
        v-auth="'backendarticlemanager/changestatus'"
        type="update"
        text="修改"
        @clickBtn="openAdd(false)"
      >
      </buttonVue>
      <buttonVue
        v-auth="'backendarticlemanager/del'"
        text="删除"
        @clickBtn="remove"
      ></buttonVue>
      <buttonVue
        v-auth="'backendarticlemanager/changestatus'"
        backgroundColor="#297DCC"
        text="显示"
        @clickBtn="updateType(true)"
      ></buttonVue>
      <buttonVue
        v-auth="'backendarticlemanager/changestatus'"
        backgroundColor="#FFAF00"
        :iconUrl="require('@/assets/img/backstage/assembly/no_eye.png')"
        text="隐藏"
        @clickBtn="updateType(false)"
      >
      </buttonVue>
      <!-- <buttonVue v-auth="'backendarticlemanager/changestatus'" backgroundColor="#297DCC" text="显示"
                 @clickBtn="updateType(true)"></buttonVue>
      <buttonVue v-auth="'backendarticlemanager/changestatus'" backgroundColor="#FFAF00"
                 :iconUrl="require('@/assets/img/backstage/assembly/no_eye.png')" text="隐藏"
                 @clickBtn="updateType(false)">
      </buttonVue> -->
    </div>
    <div class="total">当前列表共有数据:{{ page.total }}条</div>
    <div class="table">
      <div class="left">
        <div class="left_title">分类名称</div>
        <div class="scroll">
          <div class="left_list">
            <div
              class="i"
              v-for="(i, index) in classList"
              :key="index"
              :class="leftTab == index ? 'iAddClass' : ''"
              @click="clickTab(i, index)"
            >
              {{ i.title }}
            </div>
          </div>
        </div>
      </div>
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
                <img :src="$ip + row.row.cover" />
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
          <checkboxVue class="allSelectBtn" v-model="allSelect"></checkboxVue>
          <div class="text">全选本页</div>
          <!-- 分页 -->
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
    <backstage-popup
      class="add_class_box"
      :show.sync="addClass"
      title="新增分类"
      @save="addClassSub"
      @cancel="addClass = false"
    >
      <span>请为新分类命名：</span>
      <input type="text" v-model="addClassName" placeholder="请输入名称" />
    </backstage-popup>
    <!-- 删除 -->
    <backstage-popup
      class="del_class_box"
      :show.sync="delPopup"
      title="操作提示"
      @save="delSub"
      @cancel="delPopup = false"
    >
      <span>{{ popupMsg }}</span>
    </backstage-popup>
    <backstage-dialog
      :isAutoSaveClose="false"
      :isSaveLoading="loading"
      class="add_edit_warp"
      :show.sync="showAdd"
      title="内容上传编辑"
      @save="save"
    >
      <div class="title-box" style="margin-bottom: 20px">
        <div class="label">图片标题:</div>
        <input type="text" v-model="editOrAddForm.title" />
      </div>
      <!-- <div class="title-box">
        <div class="label">文章作者:</div>
        <input type="text" v-model="editOrAddForm.author" />
      </div> -->
      <div class="where_class">
        <div class="label">所属分类:</div>
        <selectVue
          :options="classList"
          :value="editOrAddForm.art_class_id"
          label="title"
          ItemValue="id"
          placeholder="所属分类"
          @changeValue="changeWhereClass"
        >
        </selectVue>
      </div>
      <div class="add-admin flex_col_start">
        <div class="label">上传图片:</div>
        <div class="add_row">
          <div class="add_col">
            <div class="upload_img">
              <img
                class="scImg"
                v-if="editOrAddForm.cover"
                :src="$ip + editOrAddForm.cover"
              />
              <img
                v-else
                :src="require('@/assets/img/backstage/train/add.png')"
              />
            </div>
          </div>
          <div class="add_col">
            <div class="tips">
              说明：上传图片格式为.jpg或.png，尺寸不超过338px * 210px。
            </div>
            <div class="button">
              <uploadButton
                v-loading="uploadFileLoading"
                accept="image/png, image/jpeg"
                @change="changeUploadFile"
                >本地上传
              </uploadButton>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="add-admin2">
        <span style="font-size: 0.16rem">文章音频:</span>
        <div class="add_row">
          <div class="upload_row">
            <a
              class="text"
              v-if="editOrAddForm.music"
              :href="$ip + editOrAddForm.music"
              >{{
                editOrAddForm.music ? editOrAddForm.music.split("/").pop() : ""
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
      </div> -->
      <div class="add-admin">
        <div class="label">内容详情:</div>
        <div class="article_text">
          <editor
            :content="editOrAddForm.content"
            @changeData="hChangeData"
            @uploadImg="hUploadImg"
          />
        </div>
      </div>
    </backstage-dialog>
  </div>
</template>

<script>
import editor from "./components/editorVue.vue";
import { getBase64 } from "@/utils/url";
import { fileApiImage, fileApiMusic } from "@/server/api/file";
import { copyNonEmptyProperties } from "@/utils/object";
import {
  articleBehindApiList,
  articleBehindApiUAdd,
  articleBehindApiDel,
  articleBehindApiEdit,
  articleBehindApiClassList,
  articleBehindApiClassAdd,
  articleBehindApiClassDel,
} from "@/server/api/article";

export default {
  components: { editor },
  created() {
    this.getClass();
  },
  computed: {
    combinedProperties() {
      return this.page.title + this.page.startData + this.page.endData;
    },
  },
  //组合属性用于监听搜索参数自动查询

  data() {
    return {
      delPopup: false,
      //左边切换
      leftTab: 0,
      classList: [],

      addClassName: "",
      addClass: false,
      loading: false, //保存时锁定
      uploadFileLoading: false, //上传文件时锁定
      file: "",
      showAdd: false,
      searchName: "",
      total: 0,
      page: {
        title: "",
        startData: "",
        endData: "",
        total: 0,
        page: 1,
        page_size: 10,
        art_class_id: "",
      },
      tableConfig: {
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
            width: "100",
            callback: (row) => {
              let page = this.page.page;
              return (
                row.index + 1 + page * this.page.page_size - this.page.page_size
              );
            },
          },

          { label: "名称", prop: "title", className: "text_hidden" },

          {
            label: "添加时间",
            prop: "deleteTime",
            type: "function",
            callback: (row) => {
              return row.add_time;
            },
          },

          {
            label: "显示状态",
            type: "slot",
            slotName: "show",
          },
        ],
      },
      activeRow: null,
      allSelect: false,
      editOrAddForm: {
        title: "",
        author: "",
        content: "",
        cover: "",
        art_class_id: "",
        music: "",
      },
      popupMsg: "",
      uploadAudioLoading: false,
    };
  },
  methods: {
    //新增或编辑 选择分类
    changeWhereClass(val) {
      this.editOrAddForm.art_class_id = val;
    },
    //左边切换
    clickTab(val, idx) {
      this.leftTab = idx;
      this.allSelect = false;
      this.page.art_class_id = val.id;
      this.page.page = 1;
      this.page.startData = "";
      this.page.endData = "";
      this.page.title = "";
      this.getTableList();
    },
    currentChange(row) {
      this.activeRow = row;
    },
    hChangeData(editDataHtml) {
      // 获取最新的html数据

      this.editOrAddForm.content = editDataHtml ? editDataHtml : "";
    },
    hUploadImg(file, insertFn) {
      console.log(file);
      // 插入图片，调接口返回图片url,通过插入conteng
      getBase64(file).then((url) => {
        insertFn(url);
      });
    },
    //获取分类
    async getClass() {
      const { data } = await articleBehindApiClassList({
        type: "2",
      });
      if (data.code == 200) {
        this.classList = data.data;
        //console.log(this.classList);
        if (this.classList.length == 0) return;
        this.getTableList();
      }
    },
    // 新增分类提交
    async addClassSub() {
      const params = {
        pid: 0,
        title: this.addClassName,
      };
      const { data } = await articleBehindApiClassAdd(params);
      if (data.code == 200) {
        if (this.classList.length == 1 || this.leftTab == -1) {
          this.leftTab = 0;
        }
        this.$myMessage.success("新增成功");
        this.addClassName = "";
        this.getClass();
      }
    },
    //打开删除弹框
    del(val) {
      this.delClassOrVideo = val;
      if (val == 1) {
        this.popupMsg = "删除分类将删除分类下的所有内容，是否继续？";
      } else {
        if (this.selectIds == "")
          return this.$myMessage.error("请选择要删除的内容");
        this.popupMsg = "是否删除当前内容？";
      }
      this.delPopup = true;
    },
    //删除分类或视频 提交
    async delSub() {
      //删除分类
      if (this.delClassOrVideo == 1) {
        const { data } = await articleBehindApiClassDel({
          ids: this.page.art_class_id,
        });
        if (data.code == 200) {
          this.$myMessage.success("删除成功");
          this.leftTab -= 1;
          if (this.classList.length > 0 && this.leftTab == -1) {
            this.leftTab = 0;
          }
          if (this.classList.length == 0) return;
          this.getClass();
        }
      }
    },
    async save() {
      try {
        this.loading = true;
        if (this.editOrAddForm.ids) {
          await this.saveEdit();
        } else {
          await this.saveAdd();
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    async saveAdd() {
      let params = { ...this.editOrAddForm };

      const validity = (params) => {
        if (params.title.trim().length == 0) {
          this.$myMessage.error("请输入标题！");
          return false;
        }

        // if (params.author.trim().length == 0) {
        //   this.$myMessage.error("请输入作者！");
        //   return false;
        // }
        if (params.art_class_id == "") {
          this.$myMessage.error("请选择分类！");
          return false;
        }
        // if (params.music == "") {
        //   this.$myMessage.error("请上传音频！");
        //   return false;
        // }

        if (params.cover == "") {
          this.$myMessage.error("请上传封面！");
          return false;
        }

        return true;
      };
      let flag = validity(params);

      if (flag) {
        params.pid = 0;
        const res = await articleBehindApiUAdd(params);

        if (res.data.code == 200) {
          this.$myMessage.success("添加成功！");
          this.getTableList();
          this.showAdd = false;
        }
      }
    },
    async saveEdit() {
      let params = { ...this.editOrAddForm };

      const validity = (params) => {
        if (params.title.trim().length == 0) {
          this.$myMessage.error("请输入标题！");
          return false;
        }

        if (params.art_class_id == "") {
          this.$myMessage.error("请选择分类！");
          return false;
        }

        // if (params.music == "") {
        //   this.$myMessage.error("请上传音频！");
        //   return false;
        // }
        if (params.cover == "") {
          this.$myMessage.error("请上传封面！");
          return false;
        }

        return true;
      };
      let flag = validity(params);

      if (flag) {
        const res = await articleBehindApiEdit(params);

        if (res.data.code == 200) {
          this.$myMessage.success("保存成功！");
          this.getTableList();
          this.showAdd = false;
        }
      }
    },

    cancel() {},
    openAdd(flag) {
      this.editOrAddForm = {
        title: "",
        author: "",
        content: "",
        cover: "",
        art_class_id: this.classList[this.leftTab].id,
        music: "",
      };
      if (!flag) {
        if (!this.activeRow) {
          this.$myMessage.error("请选择需要修改的行！");
          return;
        }
        this.editOrAddForm = copyNonEmptyProperties(
          this.editOrAddForm,
          this.activeRow
        );
        this.editOrAddForm.ids = this.activeRow.id;
      }

      this.showAdd = true;
    },
    async changeUploadFile(file) {
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
        this.$myMessage.error("上传图片格式必须为png 或jpg 格式");
        return;
      }

      //验证图片尺寸
      // try {
      //   await checkImageSize(file.raw
      //     , 260, 40)
      // } catch (error) {
      //   this.$myMessage.error(error)
      //   return
      // }
      this.uploadFileLoading = true;

      try {
        const file2 = await this.$imgCutting.asyncShowByFile(
          file.raw,
          338,
          210
        );

        const res = await fileApiImage(file2);
        if (res.data.code == 200) {
          this.editOrAddForm.cover = res.data.data;
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.uploadFileLoading = false;
      }
    },

    async getTableList(page) {
      if (this.classList.length == 0) return;
      this.page.art_class_id = this.classList[this.leftTab].id;
      if (page) {
        this.page.page = page;
      }
      const params = {
        ...this.page,
      };

      params.start_time = params.startData
        ? new Date(params.startData).getTime() / 1000
        : "";
      params.end_time = params.endData
        ? new Date(params.endData).getTime() / 1000
        : "";

      const res = await articleBehindApiList(params);
      if (res.data.code == 200) {
        this.page.page = res.data.data.current_page;
        this.page.total = res.data.data.total;
        this.tableConfig.tableData = res.data.data.data;
      }
    },
    reset() {
      this.page = {
        title: "",
        startData: "",
        endData: "",
        total: 0,
        page: 1,
        page_size: 10,
        art_class_id: "",
      };
      this.searchName = "";
    },
    // 删除
    async remove() {
      if (!this.selectIds) {
        this.$myMessage.error("请勾选需要删除的文章！");
        return;
      }

      let flag = await this.$backstagePopup.asyncShow(`是否删除选中的内容？`);
      if (flag) {
        const res = await articleBehindApiDel({ ids: this.selectIds });
        if (res.data.code == 200) {
          this.$myMessage.success("删除成功！");
          this.getTableList();
        }
      }
    },
    //更新状态隐藏显示
    async updateType(type) {
      if (!this.selectIds) {
        this.$myMessage.error(`请勾选需要${type ? "显示" : "隐藏"}的文章！`);
        return;
      }

      let flag = await this.$backstagePopup.asyncShow(
        `是否${type ? "显示" : "隐藏"}选中的文章？`
      );
      if (flag) {
        let params = {
          ids: this.selectIds,
          is_show: type ? 1 : 0,
        };
        const res = await articleBehindApiEdit(params);
        if (res.data.code == 200) {
          this.$myMessage.success("修改状态成功！");
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
          this.editOrAddForm.music = res.data.data;

          this.editOrAddForm.title
            ? ""
            : (this.editOrAddForm.title = file.name);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.uploadAudioLoading = false;
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

    .left {
      width: 230px;
      //border-right: 1px solid #e6e6e6;
      box-sizing: border-box;

      .left_title {
        width: 100%;
        height: 46px;
        line-height: 46px;
        text-align: center;
        background: #eeeeee;
        border-radius: 6px 0px 0px 0px;
        font-size: 14px;
        color: #333333;
      }

      .scroll {
        height: 620px;
        overflow-y: scroll;
        .left_list {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;

          .i {
            width: 199px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 14px;
            color: #333333;
            margin-top: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 0 55px;
            box-sizing: border-box;
          }

          .iAddClass {
            background: #2e8ae6;
            border-radius: 6px;
            color: #ffffff;
          }
        }
      }
    }

    ::v-deep {
      .class_change_title {
        border-radius: 6px 0 0px 0;
      }
    }

    .right_box {
      width: 1360px;
      border-left: 1px solid #e6e6e6;
      height: 710px;
      //border-top-left-radius: 6px;

      .title {
        height: 46px;
        background: #eeeeee;
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: center;
        color: #333333;
        //border-radius: 0px 6px 0px 0px;
        line-height: 46px;
        box-sizing: border-box;
      }

      .table_warp {
        width: 100%;
        height: 590px + 46px;
        display: flex;
        flex-wrap: wrap;
        border-bottom: 1px solid #e6e6e6;
        box-sizing: border-box;

        .title_warp {
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: flex-start;

          box-sizing: border-box;
          padding-left: 30px;

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
            .el-table {
              border-radius: 0 6px 0 0;
              box-sizing: border-box;
            }
            .cell {
              display: flex;
              justify-content: center;
            }

            .slot {
              width: 100%;
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

/deep/ .del_class_box {
  .content-box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 140px;

    span {
      width: 235px;
      font-size: 16px;
      color: #333333;
      text-align: center;
      line-height: 32px;
      margin: 20px auto 0 auto;
    }
  }
}

/deep/ .add_class_box {
  .content-box {
    span {
      display: block;
      font-size: 14px;
      color: #333333;
      text-align: center;
      margin-top: 40px;
    }

    input {
      width: 340px;
      height: 38px;
      background: #ffffff;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      margin: 20px auto 0 auto;
      font-size: 14px;
      color: #333333;
      display: block;
    }
  }
}

::v-deep {
  .add_edit_warp {
    .dialog-box {
      width: 1000px;
      height: 780px;

      .content-box {
        height: 670px;
        border-top: 1px solid #dddddd;
        box-sizing: border-box;
        padding: 35px 0 0 85px;

        .tips {
          width: 400px;
          height: 48px;
          opacity: 0.7;
          font-size: 14px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: left;
          color: #333333;
          line-height: 32px;
          white-space: nowrap;
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
        .where_class {
          display: flex;
          align-items: center;
          margin-top: 20px;

          .selectTool {
            width: 300px;
            height: 38px;
            margin-left: 21px;
            .el-input__inner {
              background: #ffffff;
              border: 1px solid #e6e6e6;
              border-radius: 4px;
            }
          }
        }
        .add-admin {
          display: flex;
          margin-top: 20px;

          .article_text {
            width: 750px;
            height: 280px;
            margin-left: 20px;
            background-color: #d4dcff42;
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
              width: 180px;
              height: 100px;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #ffffff;
              border: 1px solid #e6e6e6;
              border-radius: 5px;

              img {
                width: 35px;
                height: 35px;
              }
              .scImg {
                width: 180px;
                height: 100px;
                border-radius: 5px;
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

        .add-admin2 {
          display: flex;
          align-items: center;
          margin-top: 20px;
          margin-left: 30px;

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
              background: rgba(51, 51, 51, 0);

              border-radius: 6px;
              box-sizing: border-box;

              display: flex;

              justify-content: space-between;

              .text {
                width: 500px;
                height: 38px;
                background: #ffffff;
                border: 0.01px solid #e6e6e6;
                border-radius: 4px;
                font-size: 14px;
                color: #333333;
              }

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
                margin-left: 10px;
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
      }
    }
  }
}
</style>
