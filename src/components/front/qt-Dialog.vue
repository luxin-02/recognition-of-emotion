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
            <!-- <button class="cel" @click="cancel()" v-show="cancelBtn">
              {{ cancelContent }}
            </button> -->
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
  z-index: 999999999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #00000050;
}
.dialog_box {
  width: 711px;
  height: 471px;
  background-color: #002858;
  position: fixed;
  z-index: 999999999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 40px;
  .title {
    height: 55px;
    background-color: #009dde;
    text-align: center;
    line-height: 55px;
    border-radius: 40px 40px 0 0;

    font-size: 26px;
    font-family: "ziyuanyuanti400W";
    font-weight: 400;
    color: #ffffff;
  }
  .content {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 415px;
    padding: 20px 60px 80px 60px;
    .btn-box {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60px;
      background: #003769;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0 0 40px 40px;
      button {
        width: 120px;
        height: 40px;
        border-radius: 6px;
        color: #fff;
        font-family: "ziyuanyuanti400W";
        font-size: 20px;
      }
      .cel {
        background-color: #888888;
        margin-right: 100px;
      }
      .sub {
        background: linear-gradient(to right, #5376f3, #1dd2e3);
        background: #00baff;
        border-radius: 12px;
        box-shadow: 0px 5px 15px 1px rgba(5, 187, 255, 0.8);
      }
    }
  }
}
</style>
