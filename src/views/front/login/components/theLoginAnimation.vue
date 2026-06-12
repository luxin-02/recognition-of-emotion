<script>
const types = ['face', 'fingerprint'];
export default {
  props: {
    type: {
      type: String,
      default: () => {
        return 'face'
      }
    },


  },
  name: "theLoginAnimation"
}
</script>

<template>
  <div class="animation_warp">
    <img src="./img/1.png"/>
    <img src="./img/2.png"/>
    <div class="core">
      <div :class="type"></div>
    </div>
  </div>

</template>

<style scoped lang="less">
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes move {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(80px);
  }
}


.animation_warp {

  width: 160px;
  height: 160px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  img:nth-child(1) {
    width: 160px;
    height: 160px;
    position: absolute;
    animation: rotate 4s linear infinite;

  }

  img:nth-child(2) {
    width: 130px;
    height: 126px;
    position: absolute;
    top: 17px;
    left: 15px;

    animation: rotate 4s linear infinite reverse;

  }

  .core {
    width: 80px;
    height: 80px;
    background: #157cd6;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border-radius: 50%;

    &:after {
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      width: 78px;
      height: 1px;
      background: #f7a648;
      border-radius: 1px;
      animation: move 2s linear infinite alternate;

    }

    .face {
      width: 30px;
      height: 34px;
      background-image: url("./img/face.png");
      background-size: 100% 100%;
    }

    .fingerprint {
      width: 30px;
      height: 32px;
      background-image: url("./img/fingerprint.png");
      background-size: 100% 100%;
    }

  }
}
</style>