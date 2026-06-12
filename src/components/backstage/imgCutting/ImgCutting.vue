<template>
  <transition name='fade'>
    <div class="dialog-mask" v-show="isShow">
      <div class="dialog-box">
        <div class="title">
          <img class="ic-prompt" src="@/assets/img/backstage/popup/ic-edit.png">
          <span>{{ title }}</span>
          <img class="ic-close" src="@/assets/img/backstage/popup/ic-close.png" @click="cancel()">
        </div>
        <div class="content" :style="calcStyle">

          <div class="content-box" :style="{transform:`scale(${scale})`, transformOrigin: 'top left'}">
            <vue-cropper
                class="cropper"
                ref="cropper"
                v-if="imgData"
                :style="cropSize"
                :img="imgData"
                :outputType="outputType"
                :outputSize="1"
                :enlarge="1"
                :autoCrop="true"
                :autoCropWidth="cropWidth"
                :autoCropHeight="cropHeight"
                :fixed="true"
                :fixedNumber="[cropWidth, cropHeight]"
                :fixedBox="fixedBox"
            ></vue-cropper>
          </div>

        </div>

        <div class="btn-box" v-show="isbtn">
          <button class="sub" @click="save()" v-show="isbtn === true || isbtn == 'save'">
            <img v-if="saveImgUrl" :src="saveImgUrl">
            <span>{{ saveContent }}</span>
          </button>
          <button class="cel" @click="cancel()" v-show="isbtn === true || isbtn == 'cancel'">
            <img v-if="cancelImgUrl" :src="cancelImgUrl">
            <span>{{ cancelContent }}</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {VueCropper} from 'vue-cropper'

const baseSize = 100 // 基准值


function getRem(number) {
  return number / baseSize;
}

function calculateScale() {
  const baseFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
  const scale = (baseFontSize / baseSize)
  return scale;
}


export default {
  components: {
    'vue-cropper': VueCropper,
  },
  data() {
    return {
      isShow: false,
      imgData: '',
    };
  },
  props: {
    saveContent: {
      type: String,
      default: '保存',
    },
    saveImgUrl: {
      type: String,
      default: require('@/assets/img/backstage/popup/save.png'),
    },
    cancelContent: {
      type: String,
      default: '取消',
    },
    cancelImgUrl: {
      type: String,
      default: require('@/assets/img/backstage/popup/close.png'),
    },
    title: {
      type: String,
      default: '图片裁剪',
    },
    show: {
      type: Boolean,
      default: false,
    },
    isbtn: {
      type: [Boolean, String],
      default: true,
    },
    /**裁剪的图片 */
    img: {
      type: [String, File],
      default: ""
    },
    /**裁剪生成图片的格式 */
    outputType: {
      type: String,
      default: "png"
    },
    /**截图框宽 */
    cropWidth: {
      type: Number,
      default: 300
    },
    /**截图框高 */
    cropHeight: {
      type: Number,
      default: 300
    },
    /**固定大小 禁止改变截图框大小 */
    fixedBox: {
      type: Boolean,
      default: true
    },
    /**取消按钮的回调 */
    cancelFoo: {
      type: Function,
      default: () => {
      },
    },
    /**确定按钮的回调 */
    saveFoo: {
      type: Function,
      default: () => {
      },
    },
    /**函数式调用时使用，关闭时销毁组件 */
    remove: {
      type: Function,
      default: () => {
      },
    },
  },
  computed: {
    scale() {
      let scale = calculateScale();
      return (this.cropWidth > 1300 || this.cropHeight > 768) ? scale : 1;
    },
    calcStyle() {
      let w = getRem(this.cropWidth),
          h = getRem(this.cropHeight)
      let style = (this.cropWidth > 1300 || this.cropHeight > 768) ? {
        'width': w + 'rem',
        'height': h + 'rem',
      } : {}
      return style

    },

    cropSize() {
      //
      // getRem(this.cropWidth),
      //     getRem(this.cropHeight)
      let w = this.cropWidth,
          h = this.cropHeight
      return {
        'min-width': w + 'px',
        'min-height': h + 'px',
      }
    },
  },
  watch: {
    show(newV) {
      this.isShow = newV
      if (newV) {
        this.upDateImgData()
      } else {
        setTimeout(() => {
          this.imgData = ''
        }, 500);
      }
    },
    img() {
      this.upDateImgData()
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.isShow = this.show
      this.upDateImgData()
    })
  },
  methods: {
    getRem,
    upDateImgData() {
      if (!this.isShow) {
        return
      }
      let imgV = this.img

      if (Object.prototype.toString.call(imgV) == '[object String]') {
        this.imgData = imgV
        return
      }
      console.log(Object.prototype.toString.call(imgV))

      if (Object.prototype.toString.call(imgV) == '[object File]') {
        let reader = new FileReader()
        reader.readAsDataURL(imgV)
        reader.onloadend = (e) => {

          let content = e.target.result;
          let blob = new Blob([content], {type: 'image/png'});
          // this.imgData = reader.result
          // console.log(blob)
          this.imgData = content;
        }
        reader.onerror = (error) => {
          console.error(error)
        }
        return
      }

      console.log('图片数据异常')
    },
    cancel() {
      this.isShow = false
      this.$emit('update:show', false)
      this.$emit('cancel')
      this.cancelFoo()
      this.remove()
    },
    save() {
      this.$refs.cropper.getCropData(data => {
        this.isShow = false
        this.$emit('update:show', false)


        this.$emit("save", data);
        this.saveFoo(data)
        this.remove()
      })
    },
  },
};
</script>

<style lang='scss' scoped>
.dialog-mask {
  position: fixed;
  z-index: 1000;
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
    background: #FFFFFF;

    .title {
      position: relative;
      display: flex;
      align-items: center;
      height: 50px;
      text-align: center;
      color: #2E8AE6;
      border-radius: 20px 20px 0 0;
      background-color: #EEEEEE;
      background-image: url(~@/assets/img/backstage/popup/dialog-box.png);
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

    .btn-box {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
      background: #EEEEEE80;
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
      background: #FF9500;
    }

    .content {
      box-sizing: border-box;

      .content-box {
        min-width: 700px;
        min-height: 250px;
        color: #333333;

        font-size: 16px;

        .cropper {
          width: 720px;
          height: 405px;
        }
      }


    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: all .5s;

  .dialog-box {
    transition: all .5s;
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