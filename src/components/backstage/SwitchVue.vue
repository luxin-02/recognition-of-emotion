<template>
  <el-switch
    v-model="value"
    :active-color="activeColor"
    :inactive-color="inactiveColor"
    @change="changeSwitch"
    :disabled="disabled"
  >
  </el-switch>
</template>

<script>
export default {
  props: {
    //   开关打开时的颜色
    activeColor: {
      type: String,
      default: () => {},
    },
    // 开关关闭时的颜色
    inactiveColor: {
      type: String,
      default: () => {},
    },
    // 传入的状态
    status: {
      type: [Boolean, Number],
      default: () => {},
    },
    //是否禁用
    disabled:{}
  },
  watch: {
    //   监听父组件状态传给开给
    status(newStatus) {
      if(newStatus == 0){
        this.value = true
      }else{
        this.value = false
      }
    },
  },
  data() {
    return {
      //开关的状态
      value: "",
    };
  },
  methods: {
    //   改变值时返回的参数
    changeSwitch(val) {
      this.$emit("swtichValue", val ? 0 : 1);
    },
    // 初始化状态
    initStatus() {
      if(this.status == 0){
        this.value = true
      }else{
        this.value = false
      }
    },
  },
  created() {
    this.initStatus();
  },
};
</script>

<style lang="less" scoped>
.is-checked {
  /deep/ .el-switch__core {
    &::after {
      left: 92% !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
    }
  }
}
.el-switch {
  /deep/ .el-switch__core {
    &::after {
      top: 50% !important;
      transform: translateY(-50%) !important;
    }
  }
}
.el-switch {
  //margin-left: 1.42rem;
  /deep/ .el-switch__core {
    width: 0.48rem !important;
    height: 0.24rem;
    border-radius: 0.12rem;
    &::after {
      width: 0.2rem;
      height: 0.2rem;
      background: #ffffff;
      border-radius: 50%;
    }
  }
}
</style>