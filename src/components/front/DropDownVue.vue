<template>
  <div class="selectTool">
    <el-select
      v-model="selectValue"
      placeholder="请选择"
      @visible-change="selectShow"
      :placeholder="placeholder"
      @change="selectChange"
      :popper-append-to-body="false"
      :disabled="disabled"
    >
      <el-option
        v-for="item in options"
        :key="item[`${ItemValue}`]"
        :label="item[`${label}`]"
        :value="item[`${ItemValue}`]"
      >
      </el-option>
    </el-select>
    <div class="sele">
      <img
        src="./img/sele.png"
        alt=""
        :style="isFocus ? 'transform:rotate(0deg)' : 'transform:rotate(180deg)'"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "placeholder",
    "options",
    "value",
    "label",
    "ItemValue",
    "initOne",
    "size",
    "disabled",
  ],
  model: {
    prop: "value",
    event: "changeValue",
  },
  data() {
    return {
      // 下拉框是否展开
      isFocus: true,
      // 选择的值
      selectValue: "",
    };
  },

  computed: {},

  watch: {
    value(newValue) {
      this.selectValue = newValue;
    },
  },

  methods: {
    // 选择内容变化的时候执行
    selectChange(value) {
      this.$emit("changeValue", value);
    },
    //下拉框出现和隐藏
    selectShow(isSelect) {
      this.isFocus = !isSelect;
    },
    // 把开始的默认值给selectValue
    initSelectValue() {
      this.selectValue = this.value;
    },
  },

  mounted() {},

  created() {
    this.initSelectValue();
  },
};
</script>
<style lang="less" scoped>
.selectTool {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  ::v-deep .el-select {
    width: 100%;
    height: 100%;
    border: none;
    .el-input__inner {
      border: none;
      font-size: 16px;
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

    .el-input--suffix {
      width: 100%;
      height: 100%;
      outline: none;
      border: none;
      .el-input__suffix {
        display: none;
      }
      .el-input__inner {
        height: 100%;
      }
    }
    /* .el-select-dropdown{
      left: 0px!important;
    } */
  }

  .sele {
    position: absolute;
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
}
</style>
