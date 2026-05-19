<!--
    类别筛选组件
-->
<template>
  <div class="box_warp">
    <div class="class_change_title">{{ title }}</div>
    <div class="core_warp">
      <div
        class="item"
        @click="change(item)"
        v-for="(item, i) in array"
        :key="i"
        :class="value === item[value_key] ? 'active' : ''"
      >
        {{ item[label] }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    array: {
      type: Array,
      default: () => {
        return [];
      },
    },
    label: {
      type: String,
      default: () => {
        return "label";
      },
    },
    value_key: {
      type: String,
      default: () => {
        return "value";
      },
    },

    value: {},
    title: {
      type: String,
      default: () => {
        return "分类名称";
      },
    },
  },
  data() {
    return {
      change(item) {
        let key = this.value_key;
        this.$emit("change", item[key]);
      },
    };
  },
};
</script>
<style lang="less" scoped>
.box_warp {
  width: 229px;

  .class_change_title {
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: center;
    color: #333333;
    height: 46px;
    width: 229px;
    background: #eeeeee;
    border-radius: 6px 6px 0px 0px;
    line-height: 46px;
  }

  .core_warp {
    height: 590px;
    width: 100%;
    margin-top: 15px;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none; //滚动条隐藏
    }

    .item {
      margin: 0 auto;
      width: 199px;
      height: 40px;
      border-radius: 6px;
      margin-bottom: 15px;
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: center;
      line-height: 40px;

      &.active {
        color: #ffffff;
        background: #2e8ae6;
      }
    }
  }
}
</style>
