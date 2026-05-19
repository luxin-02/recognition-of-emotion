<template>
  <button
    :class="disabled ? 'disabled' : ''"
    :style="{
      backgroundColor: disabled
        ? '#cccccc'
        : backgroundColor
        ? backgroundColor
        : bgColor,
    }"
    :disabled="disabled"
    @click="clickBtn"
  >
    <img
      :src="iconUrl ? iconUrl : imgUrl"
      v-if="iconUrl || imgUrl"
      :style="{
        width: iconSize.split(',')[0] / 100 + 'rem',
        height: iconSize.split(',')[1] / 100 + 'rem',
      }"
    />

    {{ text }}
  </button>
</template>

<script>
import fa from "element-ui/src/locale/lang/fa";

export default {
  name: "backstage-Button-Vue",
  data() {
    return {
      imgUrl: "",
      bgColor: "",
      disabled: false,
    };
  },
  props: {
    type: {},
    //背景颜色
    backgroundColor: {
      type: String,
      default: "",
    },
    //图标路径
    iconUrl: {
      type: String,
      default: "",
    },
    //图标大小
    iconSize: {
      type: String,
      default: "16,16",
    },
    //内容文字
    text: {
      type: String,
      default: "",
    },
    // 是否禁用
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},

  watch: {
    isDisabled(nvl) {
      this.disabled = nvl;
    },
  },

  methods: {
    clickBtn() {
      this.$emit("click");
      this.$emit("clickBtn");
    },
  },

  mounted() {},

  created() {
    if (this.iconUrl == "") {
      //console.log(11);
      this.imgUrl =
        this.text == "搜索"
          ? require("@/assets/img/backstage/assembly/btnSearch.png")
          : this.text == "重置"
          ? require("@/assets/img/backstage/assembly/btnResetting.png")
          : this.text == "新增"
          ? require("@/assets/img/backstage/assembly/btnAdd.png")
          : this.text == "修改"
          ? require("@/assets/img/backstage/assembly/btnModify.png")
          : this.text == "删除"
          ? require("@/assets/img/backstage/assembly/btnDelete.png")
          : "";
    }
    if (this.backgroundColor == "") {
      this.bgColor =
        this.text == "搜索"
          ? "#2e8ae6"
          : this.text == "重置"
          ? "#18b6c9"
          : this.text == "新增"
          ? "#2e8ae6"
          : this.text == "修改"
          ? "#1bc7ba"
          : this.text == "删除"
          ? "#ff6161"
          : "";
    }

    if (this.type) {
      this.imgUrl =
        this.type == "search"
          ? require("@/assets/img/backstage/assembly/btnSearch.png")
          : this.type == "reset"
          ? require("@/assets/img/backstage/assembly/btnResetting.png")
          : this.type == "add"
          ? require("@/assets/img/backstage/assembly/btnAdd.png")
          : this.type == "update"
          ? require("@/assets/img/backstage/assembly/btnModify.png")
          : this.type == "remove"
          ? require("@/assets/img/backstage/assembly/btnDelete.png")
          : this.type == "record"
          ? require("@/assets/img/backstage/assembly/record.png")
          : "";
    }
    if (this.backgroundColor == "" && this.type) {
      this.bgColor =
        this.type == "search"
          ? "#2e8ae6"
          : this.type == "reset"
          ? "#18b6c9"
          : this.type == "add"
          ? "#2e8ae6"
          : this.type == "update"
          ? "#1bc7ba"
          : this.type == "remove"
          ? "#ff6161"
          : "";
    }
  },
};
</script>
<style lang="less" scoped>
.disabled {
  cursor: not-allowed;
}

button {
  padding: 9px 15px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  font-size: 16px;
  color: #ffffff;
  cursor: pointer;

  img {
    display: block;
    margin-right: 9px;
  }
}
</style>
