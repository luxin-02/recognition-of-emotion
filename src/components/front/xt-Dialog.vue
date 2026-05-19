<template>
  <transition name="fade">
    <div class="dialog-mask" v-if="isShow">
      <div class="dialog_box">
        <p class="title">{{ title }}</p>
        <div class="content">
          <div class="content-box">
            <slot> </slot>
          </div>
          <div class="btn-box">
            <button class="cel" @click="cancel()" v-show="cancelBtn">
              {{ cancelContent }}
            </button>
            <button
              class="sub"
              @click="save()"
              v-show="isbtn === true || isbtn == 'save'"
            >
              {{ saveContent }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "qt-Dialog",
  data() {
    return {
      isShow: false,
    };
  },
  props: {
    saveContent: {
      type: String,
      default: "确定",
    },
    cancelContent: {
      type: String,
      default: "取消",
    },
    title: {
      type: String,
      default: "提示",
    },
    show: {
      type: Boolean,
      default: false,
    },
    isbtn: {
      type: [Boolean, String],
      default: true,
    },
    cancelBtn: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.isShow = this.show;
    });
  },
  methods: {
    cancel() {
      this.isShow = false;
      this.$emit("cancel");
    },
    save() {
      this.$emit("save");
    },
  },
  watch: {
    show(newV) {
      this.isShow = newV;
    },
    isShow(newV) {
      if (this.show != newV) {
        this.$emit("update:show", newV);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.dialog-mask {
  position: fixed;
  z-index: 99;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #00000050;
}
.dialog_box {
  width: 371px;
  height: 241px;
  background-color: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 15px;
  .title {
    height: 50px;
    background-color: #2880e8;
    text-align: center;
    line-height: 50px;
    font-family: Resource Han Rounded CN, Resource Han Rounded CN-Regular;
    border-radius: 15px 15px 0 0;
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
  }
  .content {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 180px;
    padding: 20px 60px 80px 60px;
    .btn-box {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translate(-50%);
      display: flex;
      button {
        width: 100px;
        height: 40px;
        background: #297dcc;
        border-radius: 6px;
        color: #fff;
      }
      .cel {
        background-color: #888888;
        margin-right: 85px;
      }
      .sub {
        background: linear-gradient(to right, #5376f3, #1dd2e3);
      }
    }
  }
}
</style>
