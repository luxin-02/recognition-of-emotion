<template>
  <transition name="fade">
    <div v-if="show && isIF" class="anm_main" :class="isEvents ? 'events' : ''">
      <div class="mask"></div>
      <div class="warp">
        <div class="box">
          <slot></slot>
        </div>
      </div>
    </div>
    <div v-if="!isIF" v-show="show" class="anm_main">
      <div class="mask"></div>
      <div class="warp">
        <div class="box">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "AnimationPopup",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    isIF: {
      type: Boolean,
      default: true,
    },
    isEvents: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active {
  animation: none-in 0.5s;

  .mask {
    animation: fade-in 0.5s;
  }

  .box {
    animation: bounce-in 0.5s;
  }
}

.fade-leave-active {
  animation: none-in 0.5s;

  .mask {
    animation: fade-in reverse 0.5s forwards;
  }

  .box {
    animation: bounce-in reverse 0.5s forwards;
  }
}

@keyframes none-in {
  0% {
  }

  100% {
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.events {
  pointer-events: none;
}

.mask {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
}

.warp {
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  pointer-events: auto;
}

.anm_main {
  position: fixed;
  z-index: 20;
}
</style>
