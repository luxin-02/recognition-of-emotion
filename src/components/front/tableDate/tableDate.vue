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
      <img src="./img/dateIcon.png" />
    </div>
    <!-- 遮罩层  用来实现日期组件的展开和隐藏 -->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
import { isNumber, isString } from "lodash";

export default {
  // timestamp  传过来的时间戳
  model: {
    prop: "timestamp",
    event: "change",
  },
  props: {
    placeholder: {
      type: [String],
      default: () => {
        return "请选择";
      },
    },
    timestamp: {},
    pickerOptions: {},
    timeConfig: {
      type: [Object],
      default() {
        return { hours: 0, min: 0, sec: 0 };
      },
    },
  },
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
      let date = valueDate;
      if (this.timeConfig && valueDate) {
        let { hours, min, sec } = this.timeConfig;

        if (isString(valueDate) || isNumber(valueDate)) {
          date = new Date(valueDate);
        }

        date.setHours(hours, min, sec);
      }
      this.data = date;
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
        let date = newTimestamp;

        if (this.timeConfig) {
          let { hours, min, sec } = this.timeConfig;

          if (isString(newTimestamp) || isNumber(newTimestamp)) {
            date = new Date(newTimestamp);
          }

          date.setHours(hours, min, sec);
        }
        this.data = date;
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
    border-radius: 14px 14px 14px 14px;
    top: 0;
    pointer-events: none;
    cursor: pointer;
  }

  .icon {
    position: absolute;
    //top: 0px;
    right: 0px;
    padding-right: 20px;

    border-radius: 0px 4px 4px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 8px;
    height: 100%;

    img {
      width: 18px;
      height: 16px;
    }
  }

  ::v-deep .el-date-editor {
    width: 100%;
    height: 100%;

    border-radius: 6px;
    border: 0 none;
    cursor: pointer;

    ::v-deep .el-input__icon {
      display: none;
    }

    .el-input__inner {
      width: 100%;
      height: 100%;
      background: #fff;

      font-size: 16px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: left;
      color: #333333;

      letter-spacing: 2px;
      padding-left: 10px;
      border: none;
      border-radius: 4px;
      box-sizing: border-box;

      &::placeholder {
        font-size: 16px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: left;
        color: #cccccc;
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
