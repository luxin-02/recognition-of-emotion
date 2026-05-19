<template>
  <input v-model="inputContent" :placeholder="placeholder" :type="type" :disabled="disabled" :maxlength="maxlength"/>
</template>

<script>
export default {
  model: {
    prop: 'input',
    event: 'input'
  },
  props: {
    maxlength: {
      // 输入的长度
      type: [String, Number],
      default: () => {
        return 16;
      },
    },
    //是否禁用
    disabled: {
      type: Boolean,
      default: () => {
      },
    },
    // 输入的内容
    input: {
      type: String,
      default: () => {
      },
    },
    // 未输入前显示的内容
    placeholder: {
      type: String,
      default: () => {
        return "请输入";
      },
    },
    // 表单类型
    type: {
      type: String,
      default: () => {
      },
    },
  },
  watch: {
    // 监听表单输入内容返回给父组件
    inputContent(newInputContent) {
      this.$emit("input", newInputContent);
    },
    // 监听表单输入的内容
    input(newInput) {
      this.inputContent = newInput;
    },
  },
  data() {
    return {
      // 表单信息
      inputContent: "",
    };
  },
  methods: {
    // 初始化表单数据
    initInput() {
      this.inputContent = this.input;
    },
  },
  created() {
    this.initInput();
  },
};
</script>

<style lang="less" scoped>
input {
  width: 100%;
  height: 100%;
  display: block;
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  background: #eeeeee;
  padding-left: 37px;
  box-sizing: border-box;
  background-image: url('@/assets/img/backstage/assembly/iptSearch.png');
  background-size: 0.16rem 0.16rem;
  background-repeat: no-repeat;
  background-position: 0.1rem center;
  color: #313131;
  font-size: 16px;
  &::placeholder{
    color: #333333b2;
  }
}
</style>