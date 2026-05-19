<template>
  <div class="date">
    <el-date-picker
      type="date"
      :placeholder="placeholder"
      v-model="data"
      @focus="isFocus = false"
      @blur="isFocus = true"
      @change="changeValue"
      :append-to-body="false"
      :picker-options="pickerOptions"
      ref="datePicker"
    >
    </el-date-picker>
    <div class="icon">
      <img
        src="./img/sele.png"
        alt=""
        :style="isFocus ? 'transform:rotate(0deg)' : 'transform:rotate(180deg)'"
      />
    </div>
    <!-- 遮罩层  用来实现日期组件的展开和隐藏 -->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
export default {
  // timestamp  传过来的时间戳
  model: {
    prop: "timestamp",
    event: "change",
  },
  props: ["timestamp", "placeholder", "pickerOptions"],
  data() {
    return {
      //日期的值
      data: "",
      //   是否展开
      isFocus: true,
    };
  },
  methods: {
    //获取日期的值
    changeValue(valueDate) {
      this.$emit("change", valueDate);
    },
  },
  watch: {
    // 监听props传过来的日期值然后赋值给组件
    timestamp: {
      deep: true,
      immediate: true,
      handler(newTimestamp) {
        if (
          newTimestamp == "" ||
          newTimestamp == undefined ||
          newTimestamp == null
        ) {
          this.data = "";
          return;
        }

        this.data = newTimestamp;
        this.$emit("change", this.data);
      },
    },
    // 监听日期是否展开  如果展开再点击就关闭
    isFocus(newIsFocus) {
      if (!newIsFocus) {
        this.$refs.mask.style.pointerEvents = "auto";
      } else {
        this.$refs.mask.style.pointerEvents = "none";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.date {
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;

  .mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    position: absolute;
    left: 0;
    border-radius: 15px;
    top: 0;
    pointer-events: none;
    cursor: pointer;
  }

  .icon {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;

    img {
      display: block;
      width: 8px;
      height: 4px;
      pointer-events: none;
      transition: 0.5s all;
    }
  }

  ::v-deep .el-date-editor {
    width: 100%;
    height: 100%;

    border-radius: 15px;
    border: 0 none;
    cursor: pointer;

    ::v-deep .el-input__icon {
      display: none;
    }

    .el-input__inner {
      width: 100%;
      height: 100%;
      border: none;
      font-size: 16px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: left;
      color: #fff;
      box-sizing: border-box;
      background: #002a5d;
      border-radius: 4px;
      padding-left: 20px;
      border: 1px solid #00a6fc;
      box-sizing: border-box;
      &::placeholder {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.5) !important;
      }
    }

    .el-input__icon {
      display: none;
    }

    .el-date-table td {
      height: 40px;
    }

    .el-date-table td div {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .el-date-table td div span {
      display: block;
      width: 90%;
      height: 90%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
