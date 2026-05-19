<template>
  <div class="userInfo">
    <div class="module_title">设置详情</div>

    <div class="switchover">
      <div class="left">
        <div :class="active == 0 ? 'active' : ''" @click="active = 0">
          软件设置
        </div>
        <div :class="active == 1 ? 'active' : ''" @click="active = 1">
          用户密码
        </div>
      </div>
      <div class="line"></div>
      <div class="right">
        <set v-if="active == 0"></set>
        <pwd v-if="active == 1"></pwd>
      </div>
    </div>
  </div>
</template>

<script>
import set from "./set.vue"
import pwd from "./pwd.vue"
export default {
  components: {
    set,
    pwd,
  },
  data() {
    return {
      active: 0,
    }
  },
  created() {},
  mounted() {},
  methods: {
    pre() {},
    next() {},
  },
  beforeDestroy() {},
}
</script>

<style scoped lang="scss">
.userInfo {
  width: 1350px;
  height: 760px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-image: url(@/assets/img/front/index/kuang.png);
  background-size: 100% 100%;
  padding: 160px 100px 0 100px;
  box-sizing: border-box;

  .module_title {
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 32px;
    height: 33px;
    line-height: 33px;
    font-family: "ziyuanyuanti600W";
    color: #fff;
    background: linear-gradient(0deg, #85a7ff 0%, #ffffff 100%);
    -webkit-background-clip: text;
    color: transparent;
  }

  .switchover {
    width: 100%;
    height: 500px;
    display: flex;
    .left {
      width: 250px;
      height: 100%;
      > div {
        width: 180px;
        height: 85px;
        text-align: center;
        line-height: 85px;
        margin: 0 auto;
        font-size: 18px;
        font-family: "ziyuanyuanti400W";
        font-weight: 400;
        color: #ffffff;
        background-size: 100% 100%;
        &.active {
          background-image: url(@/assets/img/front/userInfo/active.png);
        }
      }
    }
    .right {
      width: 890px;
      height: 100%;
      padding: 0 0 0 80px;
      box-sizing: border-box;
    }
    .line {
      width: 1px;
      height: 100%;
      background-size: 100% 100%;
      background-image: url(@/assets/img/front/userInfo/line.png);
    }
  }
}
</style>
