<template>
  <div class="class-box">
    <div class="title-box">视频管理及内容列表。</div>
    <!-- 搜索 -->
    <div class="search-box">
      <div class="search-input">
        <inputVue
          :input="searchObj.name"
          @input="searchObj.name = $event"
          placeholder="搜索关键字"
        ></inputVue>
      </div>
      <div class="startAndendData">
        <startAndendData
          :startTime.sync="searchObj.startData"
          :endTime.sync="searchObj.endData"
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
        v-auth="'/index/video/addclass'"
        buttonSize="120,40"
        backgroundColor="#00AEFF"
        type="add"
        text="新增分类"
        @clickBtn="addClass = true"
      >
      </buttonVue>
      <buttonVue
        v-auth="'/index/video/delclass'"
        buttonSize="120,40"
        backgroundColor="#FF7B2B"
        type="remove"
        text="删除分类"
        @clickBtn="del(1)"
      >
      </buttonVue>
      <buttonVue
        v-auth="'/index/video/add'"
        buttonSize="120,40"
        backgroundColor="#2E8AE6"
        type="add"
        text="新增视频"
        @clickBtn="addOrEditVideo(1)"
      >
      </buttonVue>
      <buttonVue
        v-auth="'/index/video/del'"
        buttonSize="120,40"
        backgroundColor="#FF6161"
        type="remove"
        text="删除视频"
        @clickBtn="del(2)"
      >
      </buttonVue>
      <buttonVue
        v-auth="'/index/video/edit'"
        buttonSize="120,40"
        backgroundColor="#1BC7BA"
        type="update"
        text="修改视频"
        @clickBtn="addOrEditVideo(2)"
      ></buttonVue>
    </div>
    <div class="total">当前列表共有数据：{{ total }}条</div>

    <!-- 视频分类和列表 -->
    <div class="content">
      <div class="left">
        <div class="left_title">视频分类</div>
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
      <div class="right">
        <div class="right_title">分类下的内容</div>
        <div class="right_list" v-if="videoList.length != 0">
          <div class="i" v-for="(i, index) in videoList" :key="index">
            <div class="sele">
              <checkboxVue
                :propsValue="i.isChecked"
                @returnValue="
                  (data) => {
                    changeChecked(data, i, index);
                  }
                "
              ></checkboxVue>
              <span>选择</span>
            </div>
            <img :src="$ip + i.img_url + '?' + new Date().getTime()" alt="" />
            <span class="name">{{ i.title }}</span>
            <span class="time">{{ i.add_time }}</span>
          </div>
        </div>
        <div class="empty" v-else>
          <img src="@/assets/img/backstage/assembly/tableNull.png" alt="" />
          暂无数据
        </div>

        <div class="footer">
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
            :pageCount="pageTotal"
            :current-page="currentPage"
            @change="changePage"
            :pageSize="10"
            :goPage="true"
            :total="total"
            @pageBtnChange="pageBtnChange"
          ></pageVue>
        </div>
      </div>
    </div>
    <!-- 新增分类 -->

    <!-- <backstage-dialog
      class="addOrEdit classDialog"
      :show.sync="addClass"
      title="新增分类"
      @save="addClassSub"
      @cancel="
        () => {
          addClass = false;
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
            <img :src="classImgUrl" alt="" v-if="classImgUrl" />
            <img
              src="@/assets/img/backstage/assembly/cross.png"
              alt=""
              v-else
              style="width: 0.35rem; height: 0.35rem"
            />
          </div>
          <div class="cover_upload">
            <span>说明：封面图片格式为.jpg或.png，尺寸建议200px*130px。</span>
            <el-upload
              class="uploader"
              action=""
              :show-file-list="false"
              :auto-upload="false"
              :on-change="coverUpload2"
            >
              <button>本地上传</button>
            </el-upload>
          </div>
        </div>
      </div>
    </backstage-dialog> -->

    <backstage-popup
      class="add_class_box"
      :show.sync="addClass"
      title="新增分类"
      @save="addClassSub"
      @cancel="
        () => {
          addClass = false;
          addClassName = '';
          classImgUrl = '';
        }
      "
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
    <!-- 新增或编辑 -->
    <backstage-dialog
      class="addOrEdit"
      :show.sync="addOrEditShow"
      title="新增/编辑视频"
      :isCloseCancel="false"
      :isAutoSaveClose="false"
      @save="addOrEditSub"
      @cancel="addOrEditShow = false"
      :isSaveLoading="addOrEditLoading"
    >
      <div class="video">
        <div class="name">
          <span>视频名称:</span>
          <input type="text" v-model="addOrEdotName" />
        </div>
        <div class="where_class">
          <span>所属分类:</span>
          <selectVue
            :options="whereClassList"
            :value="whereClassVal"
            label="title"
            ItemValue="id"
            placeholder="所属分类"
            @changeValue="changeWhereClass"
          >
          </selectVue>
        </div>
        <div class="cover">
          <span>视频封面:</span>
          <div class="cover_img">
            <img :src="coverImgUrl" alt="" v-if="coverImgUrl" />
            <img
              src="@/assets/img/backstage/assembly/cross.png"
              alt=""
              v-else
              style="width: 0.35rem; height: 0.35rem"
            />
          </div>
          <div class="cover_upload">
            <span>说明：封面图片格式为.jpg或.png，尺寸建议250px*160px。</span>
            <el-upload
              class="uploader"
              action=""
              :show-file-list="false"
              :auto-upload="false"
              :on-change="coverUpload"
            >
              <button>本地上传</button>
            </el-upload>
          </div>
        </div>
        <div class="video_file">
          <span>视频文件:</span>
          <input type="text" v-model="videoFileUrl" disabled />
          <VideoUploadVue
            v-model="videoFileUrl"
            @change="changeVideoUpload"
          ></VideoUploadVue>
        </div>
      </div>
    </backstage-dialog>
  </div>
</template>

<script>
import {
  videoClassBackApiList,
  videoBackApiList,
  videoClassBackApiAdd,
  videoClassBackApiDel,
  videoBackApiAdd,
  videoBackApiEdit,
  videoBackApiDel,
} from "@/server/api/video2";
import { fileApiImage, fileApiMusic } from "@/server/api/file";
import VideoUploadVue from "@/components/backstage/VideoUploadVue";
import { base64ToFile } from "@/utils/url";

export default {
  components: { VideoUploadVue },
  data() {
    return {
      //新增或编辑 文件路径
      videoFileUrl: "",
      //新增或编辑 封面图片
      coverImgUrl: "",
      img_url: "",
      //新增或编辑 所属分类
      whereClassList: [],
      whereClassVal: "",
      //新增或编辑 名称
      addOrEdotName: "",
      // 新增或编辑视频弹框
      addOrEditShow: false,
      //新增或编辑视频 1新增 2编辑
      addOrEdit: "",
      //删除分类或当前视频 1分类 2当前视频
      delClassOrVideo: "",
      //删除弹框文字
      popupMsg: "",

      //删除弹框
      delPopup: false,
      // 新增分类弹框
      addClass: false,
      //新增分类名称
      addClassName: "",
      //分类数组
      classList: [],
      //分类id
      video_class_id: "",
      //左边切换
      leftTab: 0,
      //搜索参数
      searchObj: {
        name: "",
        startData: "",
        endData: "",
      },
      // 视频列表
      videoList: [],
      // 选择视频的值
      videoObj: "",
      // 当前分页
      currentPage: 1,
      // 总分页数
      pageTotal: 10,
      // 总条数
      total: 0,
      // 选择的个数
      selectCount: 0,
      // 选择的id
      selectIds: "",
      // 是否全选
      allSelect: false,
      classImgUrl: "",
      img_url_class: "",

      addOrEditLoading: false,
    };
  },

  computed: {},
  watch: {
    // 全选or全不选
    allSelect(newAllSelect) {
      let strArr = [];
      if (newAllSelect) {
        for (let i = 0; i < this.videoList.length; i++) {
          strArr.push(this.videoList[i].id);
        }
        this.videoList.forEach((i) => {
          i.isChecked = true;
        });
        this.selectCount = strArr.length;
        this.selectIds = strArr.join(",");

        //console.log(this.selectIds);
      } else {
        this.selectIds = "";
        this.videoList.forEach((i) => {
          i.isChecked = false;
        });
      }
    },
    "searchObj.startData": function () {
      this.getList();
    },
    "searchObj.endData": function () {
      this.getList();
    },
  },
  methods: {
    //新增或编辑 视频上传
    async changeVideoUpload(file) {
      this.addOrEditLoading = true;
      let params = {
        file_upload: file,
      };
      const f = new FormData();
      Object.keys(params).forEach((k) => f.append(k, params[k]));
      try {
        const { data } = await fileApiMusic(f);
        if (data.code == 200) {
          if (data.data) {
            this.videoFileUrl = data.data;
            this.$message.success("上传视频成功");
            this.addOrEdotName ? "" : (this.addOrEdotName = file.name);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.addOrEditLoading = false;
      }
    },
    //新增或编辑 图片上传
    async coverUpload(file) {
      console.log(file);
      const isJPG = file.raw.type === "image/jpeg";
      const isPNG = file.raw.type === "image/png";
      //const isLt2M = file.raw.size / 1024 / 1024 < 2;
      if (!isPNG && !isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
        return false;
      } else if (isPNG || isJPG) {
        const data = await this.$imgCutting.asyncShow(file.raw, 250, 160);
        let cuttingFile = base64ToFile(data);

        this.coverImgUrl = data; //图片的url
        this.subImg(cuttingFile);
      }
    },
    async coverUpload2(file) {
      console.log(file);
      const isJPG = file.raw.type === "image/jpeg";
      const isPNG = file.raw.type === "image/png";
      //const isLt2M = file.raw.size / 1024 / 1024 < 2;
      if (!isPNG && !isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
        return false;
      } else if (isPNG || isJPG) {
        const data = await this.$imgCutting.asyncShow(file.raw, 200, 130);
        let cuttingFile = base64ToFile(data);

        this.classImgUrl = data; //图片的url
        this.subImg2(cuttingFile);
      }
    },
    //图片上传完成发起请求
    async subImg(file) {
      //console.log(file);
      let params = {
        file_upload: file,
      };
      const f = new FormData();
      Object.keys(params).forEach((k) => f.append(k, params[k]));
      const { data } = await fileApiImage(f);
      console.log(data);
      if (data.code == 200) {
        this.img_url = data.data;
      }
    },
    //图片上传完成发起请求
    async subImg2(file) {
      //console.log(file);
      let params = {
        file_upload: file,
      };
      const f = new FormData();
      Object.keys(params).forEach((k) => f.append(k, params[k]));
      const { data } = await fileApiImage(f);
      console.log(data);
      if (data.code == 200) {
        this.img_url_class = data.data;
      }
    },
    //新增或编辑 选择分类
    changeWhereClass(val) {
      this.whereClassVal = val;
    },
    //新增或编辑 提交
    async addOrEditSub() {
      if (this.addOrEdotName == "") return this.$message.error("请输入名称");
      if (this.whereClassVal == "") return this.$message.error("请选择分类");
      if (this.img_url == "") return this.$message.error("请上传图片");
      if (this.videoFileUrl == "" || typeof this.videoFileUrl != "string")
        return this.$message.error("请上传视频");
      const params = {
        title: this.addOrEdotName,
        video_class_id: this.whereClassVal,
        video_url: this.videoFileUrl,
        img_url: this.img_url,
        version: "v2",
      };
      //新增
      if (this.addOrEdit == 1) {
        const { data } = await videoBackApiAdd(params);
        if (data.code == 200) {
          this.$message.success("新增成功");
          this.getClass();
          this.addOrEditShow = false;
        }
      } else {
        //编辑
        params.id = this.videoObj.id;
        const { data } = await videoBackApiEdit(params);
        if (data.code == 200) {
          this.$message.success("编辑成功");
          this.videoObj = "";
          this.getClass();
          this.addOrEditShow = false;
        }
      }
    },
    //打开新增、编辑视频弹框
    addOrEditVideo(val) {
      if (this.classList.length == 0)
        return this.$message.error("请先新增分类");
      this.addOrEdit = val;
      if (val == 1) {
        this.addOrEdotName = "";
        this.whereClassVal = this.video_class_id;
        this.coverImgUrl = "";
        this.img_url = "";
        this.videoFileUrl = "";
      } else {
        this.addOrEdotName = "";
        this.whereClassVal = "";
        this.coverImgUrl = "";
        this.img_url = "";
        this.videoFileUrl = "";
        if (this.videoObj == "") return this.$message.error("请选择一条");
        this.addOrEdotName = this.videoObj.title;
        this.whereClassVal = this.videoObj.video_class_id;
        this.img_url = this.videoObj.img_url;
        this.coverImgUrl =
          this.$ip + this.videoObj.img_url + "?" + new Date().getTime();
        this.videoFileUrl = this.videoObj.video_url;
      }
      this.addOrEditShow = true;
    },

    //删除分类或视频 提交
    async delSub() {
      //删除分类
      if (this.delClassOrVideo == 1) {
        const { data } = await videoClassBackApiDel({
          ids: this.video_class_id,
        });
        if (data.code == 200) {
          this.$message.success("删除成功");
          this.leftTab -= 1;
          if (this.classList.length > 0 && this.leftTab == -1) {
            this.leftTab = 0;
          }
          if (this.classList.length == 0) return;
          this.getClass();
        }
      } else {
        //删除当前视频
        const { data } = await videoBackApiDel({ ids: this.selectIds });
        if (data.code == 200) {
          this.$message.success("删除成功");
          this.selectId = "";
          this.getList();
        }
      }
    },

    //打开删除弹框
    del(val) {
      this.delClassOrVideo = val;
      if (val == 1) {
        this.popupMsg = "删除分类将删除分类下的所有内容，是否继续？";
      } else {
        if (this.selectIds == "")
          return this.$message.error("请选择要删除的内容");
        this.popupMsg = "是否删除当前视频？";
      }
      this.delPopup = true;
    },
    // 新增分类提交
    async addClassSub() {
      const params = {
        pid: 0,
        title: this.addClassName,
        img: this.img_url_class,
      };
      const { data } = await videoClassBackApiAdd(params);
      if (data.code == 200) {
        if (this.classList.length == 1 || this.leftTab == -1) {
          this.leftTab = 0;
        }
        this.$message.success("新增成功");
        this.addClassName = "";
        this.classImgUrl = "";
        this.img_url_class = "";
        this.getClass();
      }
    },
    //左边切换
    clickTab(val, idx) {
      this.leftTab = idx;
      this.allSelect = false;
      this.video_class_id = val.id;
      this.currentPage = 1;
      this.searchObj.startData = "";
      this.searchObj.endData = "";
      this.searchObj.name = "";
      this.getList();
    },
    // 搜索
    search() {
      //console.log('搜索');
      this.getList();
    },
    // 重置
    reset() {
      //console.log('重置');
      this.currentPage = 1;
      this.searchObj.startData = "";
      this.searchObj.endData = "";
      this.searchObj.name = "";
      this.getList();
    },
    pageBtnChange(page) {
      this.currentPage = page;
      //this.theTrainingResults();
      this.getList();
    },
    //切换分页
    changePage(value) {
      //console.log(value);
      this.currentPage = value;
      //this.theTrainingResults();
      this.getList();
    },
    // 单选
    changeChecked(d, val, idx) {
      if (d) {
        this.videoObj = val;
        this.videoList[idx].isChecked = true;
      } else {
        this.videoObj = "";
        this.videoList[idx].isChecked = false;
      }
      let strArr = [];
      for (let i = 0; i < this.videoList.length; i++) {
        if (this.videoList[i].isChecked) {
          strArr.push(this.videoList[i].id);
        }
      }
      this.selectCount = strArr.length;
      if (strArr.length == this.videoList.length) {
        this.allSelect = true;
      } else if (strArr.length == 0) {
        this.allSelect = false;
      }
      this.selectIds = strArr.join(",");

      if (d) {
        if (strArr.length >= 2) {
          this.videoObj = "";
        }
      } else {
        if (strArr.length == 1 && this.videoObj == "") {
          this.videoObj = this.videoList.find((v) => v.isChecked);
        }
      }
    },
    //获取分类
    async getClass() {
      const { data } = await videoClassBackApiList();
      if (data.code == 200) {
        this.classList = data.data;
        this.whereClassList = data.data;
        //console.log(this.classList);
        this.getList();
      }
    },
    //获取列表
    async getList() {
      if (this.classList.length == 0) {
        this.videoList = "";
        this.total = 0;
        return;
      }
      this.video_class_id = this.classList[this.leftTab].id;
      const params = {
        page: this.currentPage,
        page_size: 10,
        video_class_id: this.video_class_id,
        start_time: this.searchObj.startData
          ? this.$getTime(this.searchObj.startData) - 28801
          : "",
        end_time: this.searchObj.endData
          ? this.$getTime(this.searchObj.endData)
          : "",
        title: this.searchObj.name,
      };
      const { data } = await videoBackApiList(params);
      //console.log(data)
      if (data.code == 200) {
        this.videoList = data.data.data;
        this.videoList.forEach((i) => {
          i.isChecked = false;
        });
        this.total = data.data.total;
        // 设置总条数
        this.pageTotal = Math.ceil(data.data.total / 10);
      }
    },
  },

  mounted() {},

  created() {
    this.getClass();
  },
};
</script>
<style lang="less" scoped>
.class-box {
  span {
    display: block;
  }

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
    //width: 905px;
    height: 40px;
    display: flex;
    //justify-content: space-between;
    align-items: center;
    margin-top: 23px;

    .search-input {
      width: 315px;
      height: 40px;
      margin-right: 10px;
    }

    .startAndendData {
      width: 350px;
      height: 40px;
      margin-right: 10px;
    }

    button {
      margin-right: 10px;
    }
  }

  .add-del_change {
    //width: 690px;
    height: 40px;
    display: flex;
    //justify-content: space-between;
    margin-top: 25px;

    button {
      margin-right: 10px;
    }
  }

  .total {
    width: 300px;
    font-size: 16px;
    text-align: right;
    margin-top: -20px;
    float: right;
  }

  .content {
    height: 720px;
    width: 100%;
    margin-top: 29px;
    display: flex;

    .left {
      width: 230px;
      border-right: 1px solid #e6e6e6;
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
        .left_list {
          height: 615px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: auto;
          &::-webkit-scrollbar {
            display: none; //滚动条隐藏
          }

          .i {
            width: 200px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 14px;
            color: #333333;
            margin-top: 15px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .iAddClass {
            background: #2e8ae6;
            border-radius: 6px;
            color: #ffffff;
          }
        }
      }
    }

    .right {
      width: 1330px;
      box-sizing: border-box;
      position: relative;

      .right_title {
        width: 100%;
        height: 46px;
        line-height: 46px;
        text-align: center;
        background: #eeeeee;
        border-radius: 0px 6px 0px 0px;
        font-size: 14px;
        color: #333333;
      }

      .right_list {
        padding: 25px 0 0 25px;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;

        .i {
          margin: 0 20px 35px 0px;

          span {
            display: block;
            font-size: 14px;
            color: #333333;
          }

          .sele {
            display: flex;
            align-items: center;

            span {
              margin-left: 10px;
            }
          }

          img {
            width: 240px;
            height: 135px;
            border-radius: 10px;
            margin-top: 10px;
          }

          .name {
            margin-top: 18px;
            width: 240px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .time {
            font-size: 15px;
            color: rgba(85, 85, 85, 0.5);
            margin-top: 10px;
          }
        }
      }

      .empty {
        width: 100%;
        height: 580px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: #999;

        img {
          width: 1.9rem;
          height: 1.77rem;
        }
      }

      .footer {
        width: 100%;
        height: 90px;
        display: flex;
        align-items: center;
        margin-top: 23px;
        border-top: 1px #e6e6e6 solid;
        position: absolute;
        bottom: 0;

        .allSelectBtn {
          margin-left: 25px;
        }

        .text {
          color: #333333;
          font-size: 16px;
          margin: 0 34px 0 10px;
        }
      }
    }
  }

  /deep/ .add_class_box {
    .content-box {
      span {
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

  /deep/ .el-loading-mask {
    background-color: rgba(255, 255, 255, 0.7);
    left: -2px;
    right: -2px;
    .el-loading-spinner {
      margin-top: -15px;
      .circular {
        width: 32px;
        height: 32px;
      }
    }
  }
}
</style>
