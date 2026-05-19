<!-- 浮动按钮 -->
<template>
  <div class="bear-box" ref="bear" @mousedown="move" @touchstart="move">
    <div @click="clickFoo()" class="bear-img"></div>
    <ul class="box" v-show="keyShow" @click.stop>
      <li class="xzx-keyboard" @click.stop="keyboardSys()">
        <img src="./assets/keyboard.png" />
        <p>输入法</p>
      </li>
      <li class="xzx-small" @click.stop="gosmall()">
        <img src="./assets/hide.png" />
        <p>隐藏窗口</p>
      </li>
      <li class="xzx-scale" @click.stop="scaleSys()">
        <img
          :src="
            isFullScreen
              ? require('./assets/windowing.png')
              : require('./assets/fullScreen.png')
          "
        />
        <p>{{ isFullScreen ? "窗口" : "全屏" }}</p>
      </li>
      <li class="xzx-offsys" @click.stop="offSys()">
        <img src="./assets/exit.png" />
        <p>退出</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    const configData = {
      defaultW: 1920, // 设计图原始宽度，用来计算当前缩放比例
      boxW: 300, // 展开后的宽
      boxH: 300, // 展开后的高
      boxBorder: 112.5, // 展开后黑圈的宽
    };
    return {
      configData,

      keyShow: false, // 是否展开
      isDragging: false, // 是否在拖动中
      oldXY: {
        // 记录展开前的坐标
        X: 0,
        Y: 0,
      },
      oldDraggingData: {
        // 记录拖动前的坐标
        X: 0,
        Y: 0,
      },
      isFullScreen: false, // 是否全屏状态
    };
  },
  created() {},
  mounted() {
    this.oldDraggingData.X = this.$refs.bear.style.left;
    this.oldDraggingData.Y = this.$refs.bear.style.top;
  },
  methods: {
    /**
     * px转rem
     * @param {Number} val px
     * @returns {Number} rem
     */
    pxToRem(val) {
      return val / 100;
    },
    /**
     * 点击处理
     */
    clickFoo(keyShow = !this.keyShow) {
      let configData = this.configData;
      if (keyShow == this.keyShow) {
        return;
      }
      console.log(this.isDragging);
      if (!this.isDragging) {
        this.keyShow = !this.keyShow;
        if (this.keyShow) {
          this.isFullScreen =
            document.body.clientWidth >= window.screen.width - 50; // 判断当前是否全屏
          let proportion = configData.defaultW / window.innerWidth; // 计算当前界面缩放比例
          let bear = this.$refs.bear;
          let boxW = configData.boxW / proportion;
          let boxH = configData.boxH / proportion;
          let boxBorder = configData.boxBorder / proportion;
          var divX = bear.offsetLeft;
          var divY = bear.offsetTop;
          this.oldXY.X = bear.style.left;
          this.oldXY.Y = bear.style.top;
          //设置菜单不超出页面可视范围
          if (divX <= boxBorder) {
            divX = boxBorder;
          } else if (divX >= document.body.clientWidth - boxW + boxBorder) {
            divX = document.body.clientWidth - boxW + boxBorder;
          }
          if (divY <= boxBorder) {
            divY = boxBorder;
          } else if (divY >= document.body.clientHeight - boxH + boxBorder) {
            divY = document.body.clientHeight - boxH + boxBorder;
          }
          //给小熊赋值
          bear.style.left = this.pxToRem(divX * proportion) + "rem";
          bear.style.top = this.pxToRem(divY * proportion) + "rem";
        } else {
          this.$refs.bear.style.left = this.oldXY.X;
          this.$refs.bear.style.top = this.oldXY.Y;
        }
      }
    },
    /**
     * 拖动处理
     */
    move(e) {
      let _this = this;
      let configData = this.configData;
      let proportion = configData.defaultW / window.innerWidth; // 计算当前界面缩放比例
      e = e || window.event;
      console.log(e);
      let bear = this.$refs.bear;
      //小熊的宽高
      let bearW = bear.offsetWidth;
      let bearH = bear.offsetHeight;
      if (e.type === "touchstart") {
        e.clientX = e.touches[0].clientX;
        e.clientY = e.touches[0].clientY;
      }
      //鼠标位置减掉小熊偏移量
      var positionX = e.clientX - bear.offsetLeft;
      var positionY = e.clientY - bear.offsetTop;
      document.addEventListener("mousemove", onDragging);
      document.addEventListener("mouseup", onDragEnd);
      document.addEventListener("touchmove", onDragging); //触摸屏移动
      document.addEventListener("touchend", onDragEnd);
      function onDragging(e) {
        if (e.type === "touchmove") {
          e.clientX = e.touches[0].clientX;
          e.clientY = e.touches[0].clientY;
        }
        //获取小熊的位置
        var divX = e.clientX - positionX;
        var divY = e.clientY - positionY;
        //设置小熊不超出页面可视范围
        if (divX <= 0) {
          divX = 0;
        } else if (divX >= document.body.clientWidth - bearW) {
          divX = document.body.clientWidth - bearW;
        }
        if (divY <= 0) {
          divY = 0;
        } else if (divY >= document.body.clientHeight - bearH) {
          divY = document.body.clientHeight - bearH;
        }
        //给小熊赋值
        bear.style.left = _this.pxToRem(divX * proportion) + "rem";
        bear.style.top = _this.pxToRem(divY * proportion) + "rem";
        if (
          _this.oldDraggingData.X != bear.style.left &&
          _this.oldDraggingData.Y != bear.style.top
        ) {
          _this.isDragging = true;
        }
        _this.oldDraggingData.X = bear.style.left;
        _this.oldDraggingData.Y = bear.style.top;
        _this.oldXY.X = bear.style.left;
        _this.oldXY.Y = bear.style.top;
      }
      function onDragEnd() {
        setTimeout(() => {
          _this.isDragging = false;
          console.log(_this.isDragging);
        }, 1);
        document.removeEventListener("mousemove", onDragging);
        document.removeEventListener("touchmove", onDragging);
        document.removeEventListener("touchend", onDragEnd);
        document.removeEventListener("mouseup", onDragEnd);
      }
    },
    offSys() {
      this.clickFoo(false);
      this.$popup({
        title: "提示",
        content: "确定要退出本系统？",
        saveFoo: () => {
          if ("FingerprintObj" in window) {
            FingerprintObj.closeWindow();
          } else {
            this.$message("当前状态下，没有此功能！");
          }
        },
      });
    },
    scaleSys() {
      this.clickFoo(false);
      if ("FingerprintObj" in window) {
        FingerprintObj.min_max_click();
      } else {
        this.$message("当前状态下，没有此功能！");
      }
    },
    keyboardSys() {
      this.clickFoo(false);
      if ("FingerprintObj" in window) {
        FingerprintObj.openKeyboard();
      } else {
        this.$message("当前状态下，没有此功能！");
      }
    },
    gosmall() {
      this.clickFoo(false);
      if ("FingerprintObj" in window) {
        FingerprintObj.setMinSize();
      } else {
        this.$message("当前状态下，没有此功能！");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
p,
ul,
li {
  padding: 0;
}
li {
  list-style: none;
}
.bear-box {
  position: fixed;
  z-index: 100;
  bottom: 70px;
  left: 10px;
  width: 75px;
  height: 75px;
  // opacity: .6;
  border-radius: 50%;
  .bear-img {
    position: absolute;
    z-index: 20;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-image: url(./assets/bear.png);
    // background-image: url(./assets/logo.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .box {
    position: absolute;
    top: 50%;
    left: 50%;
    overflow: hidden;
    width: 300px;
    height: 300px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-color: #002EAD70;
    box-sizing: border-box;
    border: 2px solid #005DF2;
    li {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      width: 112px;
      height: 112px;
    }
    p {
      margin: 0;
      margin-top: 10px;
      color: #ffffff;
      font-size: 18px;
    }
    img {
      width: 30px;
      height: 30px;
    }
    .xzx-keyboard {
      position: absolute;
      bottom: 0;
      left: 94px;
      text-align: center;
    }
    .xzx-small {
      position: absolute;
      top: 0;
      left: 94px;
      text-align: center;
    }
    .xzx-scale {
      position: absolute;
      top: 94px;
      left: 0;
      text-align: center;
    }
    .xzx-offsys {
      position: absolute;
      top: 94px;
      right: 0;
      text-align: center;
    }
  }
}
</style>
