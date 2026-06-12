<template>
  <transition name="fade">
    <div class="popup-mask" v-show="isShow">
      <div class="popup-box">
        <div class="title">
          {{ title }}
        </div>
        <div class="content">
          <slot>
            <div class="content-text">
              <p v-html="content"></p>
            </div>
          </slot>
          <div class="btn-box" v-show="isbtn">
            <button
              class="cel"
              @click="cancel()"
              v-show="isbtn === true || isbtn == 'cancel'"
            >
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
  data() {
    return {
      isShow: false,
    }
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
    content: {
      type: String,
      default: "",
    },
    show: {
      type: Boolean,
      default: false,
    },
    isbtn: {
      type: [Boolean, String],
      default: true,
    },
    cancelFoo: {
      type: Function,
      default: () => {},
    },
    saveFoo: {
      type: Function,
      default: () => {},
    },
    remove: {
      type: Function,
      default: () => {},
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.isShow = this.show
    })
  },
  methods: {
    cancel() {
      this.cancelFoo()
      this.isShow = false
      this.$emit("cancel")
      this.remove()
    },
    save() {
      this.saveFoo()
      this.isShow = false
      this.$emit("save")
      this.remove()
    },
  },
  watch: {
    show(newV) {
      this.isShow = newV
    },
  },
}
</script>

<style lang="scss" scoped>
.popup-mask {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 99;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #00000080;
  font-size: 0;

  .popup-box {
    position: relative;
    box-sizing: border-box;
    width: 600px;
    height: 400px;
    // background: #fff;
    border-radius: 25px;
    padding: 10px;
    background-image: url("@/assets/img/front/index/底.png");
    background-size: 100% 100%;
    .title {
      width: 100%;
      height: 100px;
      font-size: 23px;
      font-family: "ziyuanyuanti600W";
      text-align: center;
      color: #fff;
      // background: #64c3fa;
      border-radius: 25px 25px 0 0;
      line-height: 100px;
    }

    .content {
      box-sizing: border-box;
      padding: 20px 30px;
      // padding-top: 39px;
      border-radius: 0 0 25px 25px;
      // background: #ffffff;
      // width: 440px;
      // min-height: 200px;

      width: 100%;
      height: 100%;

      .content-text {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 90px;
        font-size: 24px;
        font-family: "ziyuanyuanti600W";
        font-weight: 600;
        color: #fff;
        text-align: center;
        margin: 20px 80px 0 80px;
      }

      .btn-box {
        text-align: center;
        display: flex;
        position: absolute;
        bottom: 70px;
        left: 50%;
        transform: translate(-50%);
      }

      button {
        margin: 0 50px;
        cursor: pointer;
        border: none;
        text-align: center;
        width: 120px;
        height: 40px;
        background: #00000000;
        border-radius: 10px;
        font-size: 18px;
        font-family: "ziyuanyuanti500W";
        color: #fff;
      }

      .sub {
        background: #00a8ff;
      }

      .cel {
        background: #ff9500;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;

  .popup-box {
    transition: all 0.5s;
  }
}

.fade-enter {
  opacity: 0;

  .popup-box {
    transform: scale(0, 0);
  }
}

.fade-enter-to {
  opacity: 1;

  .popup-box {
    transform: scale(1, 1);
  }
}

.fade-leave {
  opacity: 1;

  .popup-box {
    transform: scale(1, 1);
  }
}

.fade-leave-to {
  opacity: 0;

  .popup-box {
    transform: scale(0, 0);
  }
}
</style>
