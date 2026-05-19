<template>
  <div class="class-box">
    <div class="title-box">音频管理分类及内容列表</div>
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
      <buttonVue
        v-auth="'/index/music/addclass'"
        @clickBtn="
          () => {
            addClassName = '';
            showAddClass = true;
          }
        "
        :iconUrl="require('@/assets/img/backstage/assembly/btnAdd.png')"
        backgroundColor="#00AEFF"
        text="新增分类"
      ></buttonVue>
      <buttonVue
        v-auth="'/index/music/delclass'"
        :iconUrl="require('@/assets/img/backstage/assembly/btnDelete.png')"
        backgroundColor="#FF7B2B"
        text="删除分类"
        @clickBtn="removeClass"
      >
      </buttonVue>
      <buttonVue
        v-auth="'/index/music/add'"
        :iconUrl="require('@/assets/img/backstage/assembly/btnAdd.png')"
        backgroundColor="#2E8AE6"
        text="新增音乐"
        @clickBtn="openAdd"
      ></buttonVue>
      <buttonVue
        v-auth="'/index/music/edit'"
        text="修改"
        @clickBtn="openEdit"
      ></buttonVue>
      <buttonVue
        v-auth="'/index/music/del'"
        text="删除"
        @clickBtn="remove"
      ></buttonVue>
    </div>
    <div class="total">当前列表共有数据：{{ page.total }}条</div>
    <div class="table">
      <ClassChange
        value_key="id"
        label="title"
        :title="'音乐分类'"
        v-model="page.music_class_id"
        :array="audioClass"
      ></ClassChange>
      <div class="right_box">
        <div class="title">分类下的内容</div>
        <div class="audio_list">
          <div class="not_data" v-if="tableConfig.tableData.length == 0">
            <el-empty description="暂无数据"></el-empty>
          </div>
          <div class="item" v-for="(item, i) in tableConfig.tableData" :key="i">
            <div class="row">
              <checkboxVue v-model="item.isCheck"></checkboxVue>
              <div class="label">选择</div>
            </div>
            <div class="audio_box">
              <img :src="$ip + item.img_url" />
            </div>

            <div class="audio_title">{{ item.title }}</div>
            <div class="audio_tip">{{ item.add_time }}</div>
          </div>
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
      :isSaveLoading="
        addOrEditLoading || uploadAudioLoading || uploadFileLoading
      "
      :isAutoSaveClose="false"
      class="add_edit_warp"
      :show.sync="showAdd"
      title="新增/编辑音乐"
      @save="save"
    >
      <div class="title-box">
        <span>音乐名称:</span>
        <input type="text" maxlength="16" v-model="addOrEditForm.title" />
      </div>
      <div class="title-box add-admin">
        <span>发布人:&nbsp;&nbsp;&nbsp;</span>
        <input type="text" maxlength="12" v-model="addOrEditForm.author" />
      </div>
      <div class="add-admin">
        <span>所属分类:</span>
        <div class="add-select">
          <selectVue
            :options="audioClass"
            v-model="addOrEditForm.music_class_id"
            ItemValue="id"
            label="title"
          >
          </selectVue>
        </div>
      </div>

      <div class="label_title">添加歌曲封面</div>
      <div class="tip">
        说明：上传的图片格式为.jpg或.png，建议尺寸不小于240*135px。
      </div>
      <div class="add-admin">
        <span style="opacity: 0">音乐封面:</span>
        <div class="add_row">
          <img
            class="upload_img"
            v-if="addOrEditForm.img_url"
            :src="$ip + addOrEditForm.img_url"
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
                @change="changeUploadFile"
                v-loading="uploadFileLoading"
              >
                本地上传
              </uploadButton>
            </div>
          </div>
        </div>
      </div>

      <div class="add-admin">
        <span>音乐音频:</span>
        <div class="add_row">
          <div class="upload_row">
            <a
              class="text"
              v-if="addOrEditForm.music_url"
              :href="$ip + addOrEditForm.music_url"
              >{{
                addOrEditForm.music_url
                  ? addOrEditForm.music_url.split("/").pop()
                  : ""
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
    <backstage-popup
      :iconType="'info'"
      class="add_edit_class"
      :show.sync="showAddClass"
      title="新增分类"
      @save="saveClass"
    >
      <div class="content_box">
        <div class="title">请为新分类命名：</div>
        <input maxlength="12" v-model="addClassName" />
      </div>
    </backstage-popup>
  </div>
</template>

<script>
import {
  backMusicApiAdd,
  backMusicClassApiAdd,
  backMusicClassApiList,
  backMusicApiList,
  backMusicApiDel,
  backMusicClassApiDel,
  backMusicApiEdit,
} from "@/server/api/music";
import { fileApiMusic, fileApiImage } from "@/server/api/file";
import { copyNonEmptyProperties } from "@/utils/object";
import { base64ToFile } from "@/utils/url";

export default {
  async created() {
    await this.getAudioClassList();
    this.audioClass.length
      ? (this.page.music_class_id = this.audioClass[0].id)
      : "";
    await this.getTableList();
  },

  computed: {
    //组合属性用于监听搜索参数自动查询
    combinedProperties() {
      return (
        this.page.start_time +
        this.page.end_time +
        this.page.music_class_id +
        this.page.title
      );
    },
    selectIds() {
      return this.tableConfig.tableData
        .filter((v) => v.isCheck)
        .map((v) => v.id)
        .join(",");
    },
    selectRows() {
      return this.tableConfig.tableData.filter((v) => v.isCheck);
    },
    selectRow() {
      return this.selectRows.length ? this.selectRows[0] : null;
    },
  },
  watch: {
    allSelect(newAllSelect) {
      // 全选功能
      this.tableConfig.tableData.forEach((item) => {
        item.isCheck = newAllSelect;
      });
    },
    combinedProperties() {
      this.getTableList(1);
    },
  },
  data() {
    return {
      addClassName: "",
      showAddClass: false,
      showAdd: false,
      searchName: "",
      addOrEditForm: {
        music_class_id: "",
        title: "",
        img_url: "",
        music_url: "",
        author: "", //歌手
      },
      page: {
        title: "",
        start_time: "",
        end_time: "",
        total: 0,
        page: 1,
        page_size: 10,
        music_class_id: "",
      },
      tableConfig: {
        tableData: [],
      },
      total: 0,
      file: "",
      audioClass: [], //分类列表
      allSelect: false,
      uploadFileLoading: false,
      uploadAudioLoading: false,
      addOrEditLoading: false,
    };
  },
  methods: {
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
    async saveEdit() {
      let form = {
        id: "",
        title: "",
        img_url: "",
        music_class_id: "",
        music_url: "",
        author: "",
      };

      const params = copyNonEmptyProperties(form, { ...this.addOrEditForm });
      const verify = (params) => {
        if (params.title.trim().length == "") {
          this.$message.error("请输入标题");
          return false;
        }
        if (params.author.trim().length == "") {
          this.$message.error("请输入歌手");
          return false;
        }
        if (params.music_class_id == "") {
          this.$message.error("请选择分类");
          return false;
        }
        if (params.img_url == "") {
          this.$message.error("请上传封面！");
          return false;
        }

        if (params.music_url == "") {
          this.$message.error("请上传音频！");
          return false;
        }
        return true;
      };
      let flag = verify(params);
      if (!flag) {
        return;
      }
      const res = await backMusicApiEdit({ ...params, version: "v2" });
      if (res.data.code == 200) {
        this.getTableList();
        this.showAdd = false;
        this.$message.success("修改成功！");
      }
    },
    async saveAdd() {
      let form = {
        title: "",
        img_url: "",
        music_class_id: "",
        music_url: "",
        author: "",
      };
      const params = copyNonEmptyProperties(form, { ...this.addOrEditForm });
      const verify = (params) => {
        if (params.title.trim().length == "") {
          this.$message.error("请输入标题");
          return false;
        }
        if (params.author.trim().length == "") {
          this.$message.error("请输入发布人");
          return false;
        }
        if (params.music_class_id == "") {
          this.$message.error("请选择分类");
          return false;
        }
        if (params.img_url == "") {
          this.$message.error("请上传封面！");
          return false;
        }

        if (params.music_url == "") {
          this.$message.error("请上传音频！");
          return false;
        }
        return true;
      };
      let flag = verify(params);
      if (!flag) {
        return;
      }
      const res = await backMusicApiAdd({ ...params, version: "v2" });
      if (res.data.code == 200) {
        this.getTableList();
        this.showAdd = false;
        this.$message.success("新增成功！");
      }
    },

    async saveClass() {
      if (this.addClassName.trim() == "") {
        this.$message.error("请输入分类名称！");
        return;
      }
      const res = await backMusicClassApiAdd({ title: this.addClassName });
      if (res.data.code == 200) {
        this.$message.success("新增成功");
        this.getAudioClassList();
      }
    },

    openAdd() {
      this.addOrEditForm = {
        music_class_id: this.page.music_class_id,
        title: "",
        img_url: "",
        music_url: "",
      };
      this.showAdd = true;
    },
    openEdit() {
      if (this.selectRows.length > 1) {
        this.$message.error("请勾选单个，只支持单个编辑！");
        return;
      }
      if (!this.selectRow) {
        this.$message.error("请勾选需要编辑的音乐！");
        return;
      }
      this.addOrEditForm = JSON.parse(JSON.stringify(this.selectRow));

      this.showAdd = true;
    },
    //获取
    async getAudioClassList() {
      const res = await backMusicClassApiList();
      if (res.data.code == 200) {
        this.audioClass = res.data.data;
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

      const res = await backMusicApiList(params);
      if (res.data.code == 200) {
        this.page.page = res.data.data.current_page;
        this.page.total = res.data.data.total;
        this.tableConfig.tableData = res.data.data.data.map((v) => {
          return { ...v, isCheck: false };
        });
      }
    },
    reset() {
      let music_class_id = this.page.music_class_id;
      this.page = {
        title: "",
        start_time: "",
        end_time: "",
        total: 0,
        page: 1,
        page_size: 10,
        music_class_id: "",
      };
      this.page.music_class_id = music_class_id;

      this.searchName = "";
    },
    // 删除
    async remove() {
      if (!this.selectIds) {
        this.$message.error("请勾选需要删除的音频！");
        return;
      }

      let flag = await this.$backstagePopup.asyncShow(`是否删除选中的内容？`);
      if (flag) {
        const res = await backMusicApiDel({ ids: this.selectIds });
        if (res.data.code == 200) {
          this.$message.success("删除成功！");
          this.getTableList();
        }
      }
    },
    async removeClass() {
      if (!this.page.music_class_id) {
        this.$message.error("请选择需要删除的分类！");
        return;
      }

      let flag = await this.$backstagePopup.asyncShow(
        `是否删除选中的分类？<span style="color: #FF9500">注意删除分类会将分类下面的资源删除！</span>`
      );
      if (flag) {
        const res = await backMusicClassApiDel({
          ids: this.page.music_class_id,
        });
        if (res.data.code == 200) {
          this.$message.success("删除成功！");
          await this.getAudioClassList();
          this.audioClass.length
            ? (this.page.music_class_id = this.audioClass[0].id)
            : (this.page.music_class_id = "");
          this.getTableList();
        }
      }
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
      this.uploadFileLoading = true;

      try {
        const data = await this.$imgCutting.asyncShow(file.raw, 240, 135);
        let cuttingFile = base64ToFile(data);
        const res = await fileApiImage(cuttingFile);
        if (res.data.code == 200) {
          this.addOrEditForm.img_url = res.data.data;
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
          this.addOrEditForm.music_url = res.data.data;

          this.addOrEditForm.title
            ? ""
            : (this.addOrEditForm.title = file.name);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.uploadAudioLoading = false;
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
    justify-content: flex-start;
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

      .audio_list {
        width: 100%;
        height: 583px;
        display: flex;
        flex-wrap: wrap;
        border-bottom: 1px solid #e6e6e6;
        box-sizing: border-box;
        padding: 25px;

        .not_data {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 583px;
        }

        .item {
          margin-right: 10px;

          &:nth-child(5n) {
            margin-right: 0;
          }

          .row {
            display: flex;
            align-items: center;

            .label {
              font-size: 14px;
              font-family: Microsoft YaHei, Microsoft YaHei-Regular;
              font-weight: 400;
              text-align: left;
              color: #333333;
              line-height: 14px;
              margin-left: 10px;
            }
          }

          .audio_box {
            width: 240px;
            height: 135px;
            margin-top: 10px;
            margin-bottom: 18px;

            img {
              border-radius: 6px;
              width: 240px;
              height: 135px;
            }
          }

          .audio_title {
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #333333;
            max-width: 240px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 24px;
          }

          .audio_tip {
            opacity: 0.5;
            font-size: 15px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #555555;
            line-height: 28px;
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

  ::v-deep {
    .add_edit_warp {
      .dialog-box {
        width: 877px;
        // width: 700px;
        height: 598px;
        // height: 420px;

        .content-box {
          height: 488px;
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
              // width: 450px;
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
                background: rgba(51, 51, 51, 0);

                border-radius: 6px;
                box-sizing: border-box;

                display: flex;

                justify-content: space-between;

                .text {
                  width: 500px;
                  // width: 338px;
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

          .cover {
            display: flex;
            margin-top: 20px;

            span {
              line-height: 30px;
            }

            .cover_img {
              margin-left: 21px;
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
                    cursor: pointer;
                  }
                }
              }
            }
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
}
</style>
