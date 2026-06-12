<template>
  <transition name='fade'>
    <div class="popup-mask" v-show="isShow">
      <div class="popup-box">
        <div class="title">
          <img class="ic-prompt" src="@/assets/img/backstage/popup/ic-prompt.png">
          <span>{{title}}</span>
          <img class="ic-close" src="@/assets/img/backstage/popup/ic-close.png" @click="cancel()">
        </div>
        <div class="content">
          <div class="content-box">
            <slot>
              <div class="content-box_text">
                <p v-html="content"></p>
              </div>
            </slot>
          </div>
          <div class="btn-box" v-show="isbtn">
            <button class="sub" @click="save()" v-show="isbtn === true || isbtn == 'save'">
              <img v-if="saveImgUrl" :src="saveImgUrl">
              <span>{{saveContent}}</span>
            </button>
            <button class="cel" @click="cancel()" v-show="isbtn === true || isbtn == 'cancel'">
              <img v-if="cancelImgUrl" :src="cancelImgUrl">
              <span>{{cancelContent}}</span>
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
    };
  },
  props: {
    saveContent: {
      type: String,
      default: '确定',
    },
    saveImgUrl: {
      type: String,
      default: require('@/assets/img/backstage/popup/determine.png'),
    },
    cancelContent: {
      type: String,
      default: '取消',
    },
    cancelImgUrl: {
      type: String,
      default: require('@/assets/img/backstage/popup/cancel.png'),
    },
    title: {
      type: String,
      default: '提示',
    },
    content: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false,
    },
    isbtn: {
      type: [ Boolean, String ],
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
  mounted () {
    this.$nextTick(() => {
      this.isShow = this.show
    })
  },
  methods: {
    cancel() {
      this.isShow = false
      this.$emit('update:show', false)
      this.cancelFoo()
      this.$emit('cancel')
      this.remove()
    },
    save() {
      this.isShow = false
      this.$emit('update:show', false)
      this.saveFoo()
      this.$emit('save')
      this.remove()
    },
  },
  watch: {
    show(newV) {
      this.isShow = newV
    },
  },
};
</script>

<style lang='less' scoped>
.popup-mask {
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
  .popup-box {
    position: relative;
    box-sizing: border-box;
    width: 420px;
    border-radius: 20px;
    background: #FFFFFF;
    .title {
      position: relative;
      display: flex;
      align-items: center;
      height: 40px;
      text-align: center;
      color: #333333;
      border-radius: 20px 20px 0 0;
      background-color: #EEEEEE;
      background-image: url('../../../assets/img/backstage/popup/popup-box.png');
      background-repeat: no-repeat;
      background-position: right top;
      background-size: 288px 40px;
      font-size: 17px;
      font-weight: bold;
      .ic-prompt {
        width: 20px;
        height: 20px;
        margin: 0 10px 0 15px;
      }
      .ic-close {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        cursor: pointer;
      }
    }
    .content {
      box-sizing: border-box;
      padding: 0 0 25px 0;
      .content-box {
        min-height: 120px;
        color: #333333;
        font-size: 16px;
      }
      .content-box_text {
        padding: 20px 65px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100px;
        text-align: center;
        color: #333333;
        font-size: 16px;
        font-weight: 400;
      }
      .btn-box {
        display: flex;
        justify-content: center;
        margin-top: 25px;
      }
      button {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        margin: 0 10px;
        padding: 0 20px;
        cursor: pointer;
        color: #FFFFFF;
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
        background: #2E8AE6;
      }
      .cel {
        background: #ff9500;
      }
    }
  }
}
.fade-enter-active, .fade-leave-active {
  transition: all .5s;
  .popup-box {
    transition: all .5s;
  }
}
.fade-enter {
  opacity: 0;
  .popup-box {
    transform: scale(0,0);
  }
}
.fade-enter-to {
  opacity: 1;
  .popup-box {
    transform: scale(1,1);
  }
}
.fade-leave {
  opacity: 1;
  .popup-box {
    transform: scale(1,1);
  }
}
.fade-leave-to {
  opacity: 0;
  .popup-box {
    transform: scale(0,0);
  }
}

</style>