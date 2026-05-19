<template>
  <div class="home_control">
    <transition name="bar">
      <div
        key="hidden"
        @click="show = true"
        v-if="!show"
        class="show_home_control"
      >
        <img src="./img/right_Icon.png" />
      </div>
      <div key="show" v-else class="bar">
        <div class="icon_box" @click="keyboardSys">
          <div class="icon">
            <img src="./img/keyboard.png" />
          </div>
          <div class="text">键盘</div>
        </div>
        <div class="icon_box" @click="gosmall">
          <div class="icon">
            <img src="./img/small_windows.png" />
          </div>
          <div class="text zxh">最小化</div>
        </div>
        <div class="icon_box" @click="scaleSys">
          <div class="icon">
            <img src="./img/big_windows.png" />
          </div>
          <div class="text qp">窗口/全屏</div>
        </div>
        <div class="hidden_icon" @click="show = false">
          <img src="./img/left_icon.png" />
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: "homeControl",
  data() {
    return {
      show: false,
    };
  },
  methods: {
    offSys() {
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
      if ("FingerprintObj" in window) {
        FingerprintObj.min_max_click();
      } else {
        this.$message("当前状态下，没有此功能！");
      }
    },
    keyboardSys() {
      if ("FingerprintObj" in window) {
        FingerprintObj.openKeyboard();
      } else {
        this.$message("当前状态下，没有此功能！");
      }
    },
    gosmall() {
      if ("FingerprintObj" in window) {
        FingerprintObj.setMinSize();
      } else {
        this.$message("当前状态下，没有此功能！");
      }
    },
  },
};
</script>

<style scoped lang="less">
.bar-enter,
.bar-leave-to {
  transform: translateX(-200px);
}

.bar-enter-active,
.bar-leave-active {
  transition: 0.5s all ease;
}

.bar-enter-to,
.bar-leave {
  transform: translateX(0px);
}

.home_control {
  position: fixed;
  z-index: 50;
}

.bar {
  width: 60px;
  height: 340px;

  background: rgba(189, 225, 235, 0.5);
  border-radius: 30px;
  position: fixed;
  top: 410px;
  left: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding-top: 20px;

  .icon_box {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 22px;
    cursor: pointer;

    .icon {
      width: 40px;
      height: 40px;

      background: rgba(6, 118, 189, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;

      img {
        height: 18px;
      }
    }

    .text {
      font-size: 16px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: left;
      color: #ffffff;
      line-height: 16px;
      margin-top: 12px;
    }

    .qp {
      font-size: 12px;
    }
    .zxh {
      font-size: 14px;
    }
  }

  .hidden_icon {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 8px;
    cursor: pointer;

    img {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
  }
}

.show_home_control {
  left: 16px;
  top: 576px;

  position: fixed;
  cursor: pointer;
  z-index: 20;
  width: 18px;
  height: 18px;
  padding: 10px;

  img {
    width: 18px;
    height: 18px;
  }
}
</style>
