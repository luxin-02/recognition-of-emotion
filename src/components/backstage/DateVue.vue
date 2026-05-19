<template>
  <div class="date">
    <el-date-picker type="date" :placeholder="placeholder" v-model="data" @focus="isFocus = false"
                    @blur="isFocus = true" @change="changeValue" :append-to-body="false" :picker-options="pickerOptions"
                    ref="datePicker">
    </el-date-picker>
    <div class="icon">
      <img src="@/assets/img/backstage/assembly/select.png"
           :style="isFocus ? 'transform:rotate(0deg)' : 'transform:rotate(180deg)'"/>
    </div>
    <!-- 遮罩层  用来实现日期组件的展开和隐藏 -->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
export default {
  // timestamp  传过来的时间戳
  model: {
    prop: 'timestamp',
    event: 'change'
  },
  props: ["timestamp", "placeholder", "showMsgColor", "pickerOptions"],
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


      this.$emit("change", valueDate)
    },
  },
  watch: {
    // 监听props传过来的日期值然后赋值给组件
    timestamp: {
      deep: true,
      immediate: true,
      handler(newTimestamp) {
        if (newTimestamp == '' || newTimestamp == undefined || newTimestamp == null) {
          this.data = '';
          return
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
  border: 1px solid #e6e6e6;
  border-radius: 4px;

  .mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    position: absolute;
    left: 0;
    border-radius: 14px 14px 14px 14px;
    top: 0;
    pointer-events: none;
    cursor: pointer;
  }

  .icon {
    position: absolute;
    right: 0;
    pointer-events: none;
    width: 16px;
    height: 100%;
    padding-right: 11px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 16px;
      height: 16px;
      transition: 0.5s all;
    }
  }

  ::v-deep .el-date-editor {
    width: 100%;
    height: 100%;

    border-radius: 4px;
    border: 0 none;
    cursor: pointer;

    ::v-deep .el-input__icon {
      display: none;
    }

    .el-input__inner {
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 4px;
      border: 0 none;
      font-size: 14px;

      color: #242424;
      font-weight: 400;
      letter-spacing: 2px;
      padding-left: 15px;
      border: 1px solid rgba(0, 0, 0, 0);
      border-radius: 4px;
      box-sizing: border-box;

      &::-webkit-input-placeholder {
        color: #595959;
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