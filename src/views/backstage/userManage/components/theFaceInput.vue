<template>
  <backstage-dialog
    class="face"
    @update:show="update"
    :show="show"
    title="录入人脸信息"
    @save="save"
  >
    <div class="content_box">
      <div class="tips">请将人像保持在方框内，并确认脸部无遮挡</div>
      <div class="tips">
        {{
          curStatus == 2
            ? "正在识别中"
            : curStatus == 1
            ? "点击下方拍照..."
            : "识别成功"
        }}
      </div>
      <div class="image_box">
        <el-image class="image" :src="activeImage" />
      </div>
      <button @click="start()" v-if="curStatus == 1">
        {{ isFirst ? "开始拍照" : "重新开始" }}
      </button>
      <div v-if="curStatus == 2" class="tips" style="margin-top: 0.21rem">
        正在拍照中，请用户注视摄像头...
      </div>
    </div>
  </backstage-dialog>
</template>

<script>
export default {
  props: ["show", "faceImg", "face"],

  data() {
    return {
      curStatus: 1,
      isFirst: true,
      activeImage: "",
      activeFace: "",
      result: null,
    };
  },
  watch: {
    faceImg(n_val) {
      this.activeImage = n_val;
    },
    face(n_val) {
      this.activeFace = n_val;
    },
    show(n_val) {
      this.curStatus = 1;
      this.isFirst = true;
      this.result = "";
    },
  },
  methods: {
    save() {
      this.$emit("change", {
        face_img: this.activeImage,
        face: this.activeFace,
      });
      this.$emit("update:faceImg", this.activeImage);
      this.$emit("update:face", this.activeFace);
    },
    update(value) {
      this.$emit("update:show", value);
    },
    start() {
      try {
        //判断是否可以打开摄像头
        if (
          !(
            FingerprintObj &&
            JSON.parse(FingerprintObj.isOpenCamera()).success == true
          )
        ) {
          this.$message({
            type: "error",
            message: "没有连接到设备，请检查！",
          });
          //this.$refs.msg.messagePopup(true,false,"没有连接到设备，请检查！")
          return;
        }
        this.curStatus = 2;
        setTimeout(() => {
          this.setFace();
        }, 500);
      } catch (error) {
        console.error(error);
        this.$message({
          type: "error",
          message: "没有连接到设备，请检查！",
        });
      }
    },
    //截取字符串
    getFileName(data) {
      return data.substring(0, data.indexOf("."));
    },
    //匹配人脸 成功登录，不成功提示错误
    setFace() {
      //记录上一个人脸识别信息
      const firstResult = JSON.parse(FingerprintObj.getVideoFile());
      FingerprintObj.OpenCamera();
      const that = this;
      const result = JSON.parse(FingerprintObj.getVideoFile());
      if (!result.success) {
        that.curStatus = 1;
        return;
      }
      if (
        firstResult.data &&
        firstResult.data.filePath == result.data.filePath
      ) {
        that.curStatus = 1;
        return;
      }
      const imgName = that.getFileName(result.data.filePath);
      that.curStatus = 3;
      this.activeImage = result.data.imgSrc;
      this.activeFace = imgName;

      setTimeout(() => {
        that.curStatus = 1;
      }, 1000);

      // this.$post('/api/System/setmenface', { imgName: imgName, uid: this.userInfo.id }).then(res => {
      //     if (res.data.code == 200) {
      //         this.$message({
      //             type: "success",
      //             message: '设置人脸成功,正在跳转中.....'
      //         })
      //         //this.$refs.msg.messagePopup(true,true,"设置人脸成功,正在跳转中.....");
      //         setTimeout(() => {
      //             that.$router.go(-1);
      //         }, 1000)

      //     } else {
      //         that.curStatus = 2;
      //     }
      // })
    },
  },
};
</script>
<style lang="less" scoped>
.face {
  z-index: 1000;

  .dialog-box {
    width: 1000px;
    height: 680px;

    .content_box {
      height: 570px;
      border-top: 1px solid #dddddd;
      box-sizing: border-box;
      padding-top: 35px;

      .tips {
        text-align: center;
        font-size: 16px;
        color: #333333;

        &:nth-of-type(2) {
          font-size: 20px;
          margin-top: 19px;
        }
      }

      .image_box {
        width: 300px;
        height: 300px;
        background: #ffffff;
        border: 1px solid #e6e6e6;
        border-radius: 6px;
        margin: 25px auto 0;

        .image {
          width: 300px;
          height: 300px;
          background: #ffffff;
          border: 1px solid #e6e6e6;
          border-radius: 6px;
        }
      }

      button {
        display: block;
        width: 100px;
        height: 40px;
        background: #2e8ae6;
        border-radius: 6px;
        margin: 30px auto 0;
        font-size: 16px;
        color: #ffffff;
      }
    }
  }
}
</style>
