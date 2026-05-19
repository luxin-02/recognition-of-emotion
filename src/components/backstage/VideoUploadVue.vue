<template>
  <div class="video_warp">
    <el-upload
      class="upload-demo"
      action=""
      :auto-upload="false"
      :multiple="false"
      :show-file-list="false"
      :on-change="change"
    >
      <button>{{ btnText }}</button>
    </el-upload>
  </div>
</template>

<script>
export default {
  model: {
    prop: "file",
    event: "change",
  },
  props: {
    file: {},
    btnText: {
      type: String,
      default: "选择",
    },
  },
  created() {},
  data() {
    return {};
  },
  methods: {
    change(data) {
      const file = data.raw;
      const isMp4 =
        file.type === "video/mp4" ||
        file.type === "video/ogg" ||
        file.type === "video/avi" ||
        file.type === "video/flv" ||
        file.type === "video/rmvb" ||
        file.type === "video/wmv";
      console.log(file.type);
      if (!isMp4) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }

      this.$emit("change", file);
    },
  },
};
</script>

<style lang="less" scoped>
.video_warp {
  width: 100%;
  height: 100%;
  .upload-demo {
    width: 100%;
    height: 100%;
  }
}
</style>
