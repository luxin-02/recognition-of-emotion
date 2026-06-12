<template>
  <transition name="fade">
    <div class="dialog-mask" v-if="isShow">
      <div v-if="!isIfType || isShow" class="dialog-box">
        <div class="title">
          <img
            class="ic-prompt"
            :src="
              iconType == 'edit'
                ? require('@/assets/img/backstage/popup/ic-edit.png')
                : require('@/assets/img/backstage/popup/ic-prompt.png')
            "
          />
          <span>{{ title }}</span>
          <img
            class="ic-close"
            src="@/assets/img/backstage/popup/ic-close.png"
            @click="close()"
          />
        </div>
        <div class="content">
          <div class="content-box">
            <slot></slot>
          </div>
          <div class="btn-box" v-show="isbtn">
            <slot name="button_row">
              <button
                v-loading="isSaveLoading"
                class="sub"
                @click="save()"
                v-show="isbtn === true || isbtn == 'save'"
              >
                <img v-if="saveImgUrl" :src="saveImgUrl" />
                <span>{{ saveContent }}</span>
              </button>
              <button class="print" @click="printFn()" v-show="print == true">
                <img
                  v-if="cancelImgUrl"
                  src="@/assets/img/backstage/popup/print.png"
                />
                <span>打印本页</span>
              </button>

              <button
                class="allprint"
                @click="allprintFn()"
                v-show="allprint == true"
              >
                <img
                  v-if="cancelImgUrl"
                  src="@/assets/img/backstage/popup/print.png"
                />
                <span>打印整个档案</span>
              </button>

              <button
                class="export"
                @click="exportFn()"
                v-show="export1 == true"
              >
                <img
                  v-if="cancelImgUrl"
                  src="@/assets/img/backstage/popup/export.png"
                />
                <span>导出</span>
              </button>

              <button
                class="cel"
                @click="cancel()"
                v-show="isbtn === true || isbtn == 'cancel'"
              >
                <img v-if="cancelImgUrl" :src="cancelImgUrl" />
                <span>{{ cancelContent }}</span>
              </button>
            </slot>
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
    };
  },
  props: {
    //是否为v-if展示模式
    isIfType: {
      type: Boolean,
      default: false,
    },
    iconType: {
      type: String,
      default: "edit",
    },

    saveContent: {
      type: String,
      default: "保存",
    },
    saveImgUrl: {
      type: String,
      default: require("@/assets/img/backstage/popup/save.png"),
    },
    cancelContent: {
      type: String,
      default: "取消",
    },
    cancelImgUrl: {
      type: String,
      default: require("@/assets/img/backstage/popup/close.png"),
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
    print: {
      type: Boolean,
      default: false,
    },
    allprint: {
      type: Boolean,
      default: false,
    },
    export1: {
      type: Boolean,
      default: false,
    },
    //close时是否执行cancel回调
    isCloseCancel: {
      type: Boolean,
      default: () => {
        return true;
      },
    },

    //点击保存按钮时是否自动关闭
    isAutoSaveClose: {
      type: Boolean,
      default: true,
    },

    //保存按钮加载状态
    isSaveLoading: {
      type: Boolean,
      default: false,
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
      this.$emit("update:show", false);
      this.$emit("cancel");
    },
    close() {
      this.isShow = false;
      this.$emit("update:show", false);
      if (this.isCloseCancel) {
        this.$emit("cancel");
      }
    },
    save() {
      if (this.isAutoSaveClose) {
        this.isShow = false;
        this.$emit("update:show", false);
      }
      this.$emit("save");
    },
    printFn() {
      this.$emit("print");
    },
    allprintFn() {
      this.$emit("allprint");
    },
    exportFn() {
      this.$emit("export");
    },
  },
  watch: {
    show(newV) {
      this.isShow = newV;
    },
  },
};
</script>

<style lang="less" scoped>
.dialog-mask {
  position: fixed;
  z-index: 99;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #00000080;
  font-size: 0;

  .dialog-box {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    border-radius: 20px;
    background: #ffffff;

    .title {
      position: relative;
      display: flex;
      align-items: center;
      height: 50px;
      text-align: center;
      color: #2e8ae6;
      border-radius: 20px 20px 0 0;
      background-color: #eeeeee;
      background-image: url("../../assets/img/backstage/popup/dialog-box.png");
      background-repeat: no-repeat;
      background-position: right top;
      background-size: 481px 50px;
      font-size: 16px;
      font-weight: bold;

      .ic-prompt {
        width: 16px;
        height: 16px;
        margin: 0 10px 0 20px;
      }

      .ic-close {
        position: absolute;
        top: 13px;
        right: 15px;
        width: 24px;
        height: 24px;
        cursor: pointer;
      }
    }

    .content {
      box-sizing: border-box;

      .content-box {
        min-width: 700px;
        min-height: 250px;
        color: #333333;
        font-size: 16px;
      }

      .btn-box {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60px;
        background: #eeeeee80;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
      }

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        margin: 0 10px;
        padding: 0 20px;
        cursor: pointer;
        color: #ffffff;
        border: none;
        border-radius: 6px;
        font-size: 16px;

        > img {
          width: 16px;
          height: 16px;
          margin-right: 10px;
        }
      }

      .sub {
        background: #2e8ae6;
      }

      .cel {
        background: #ff9500;
      }
      .print {
        background: #1bc7ba;
      }
      .allprint {
        background: #ff6161;
      }
      .export {
        background: #8962d9;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;

  .dialog-box {
    transition: all 0.5s;
  }
}

.fade-enter {
  opacity: 0;

  .dialog-box {
    transform: scale(0, 0);
  }
}

.fade-enter-to {
  opacity: 1;

  .dialog-box {
    transform: scale(1, 1);
  }
}

.fade-leave {
  opacity: 1;

  .dialog-box {
    transform: scale(1, 1);
  }
}

.fade-leave-to {
  opacity: 0;

  .dialog-box {
    transform: scale(0, 0);
  }
}
</style>
