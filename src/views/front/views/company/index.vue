<template>
  <div class="courseVideo">
    <div class="module_title">企业详情</div>

    <div class="basic_info">
      <img :src="$ip + $store.getters.sysInfo.cover_photo2" />
      <div>
        <div class="logo">
          <div>公司详情如下：</div>
          <div>
            <img :src="$ip + $store.getters.sysInfo.logo" />
          </div>
        </div>
        <div>
          <div>软件名称：</div>
          <div>{{ $store.getters.sysInfo.name }}</div>
        </div>

        <div>
          <div>软件版本：</div>
          <div>V1.0</div>
        </div>

        <div>
          <div>公司网站：</div>
          <div>{{ $store.getters.sysInfo.website }}</div>
        </div>

        <div>
          <div>公司名称：</div>
          <div>{{ $store.getters.sysInfo.unit }}</div>
        </div>

        <div>
          <div style="white-space: nowrap">公司地址：</div>
          <div>{{ $store.getters.sysInfo.addr }}</div>
        </div>
      </div>
    </div>

    <div class="introduce">
      <div>公司介绍：</div>
      <div>
        {{ $store.getters.sysInfo.text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
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
.courseVideo {
  width: 1580px;
  height: 872px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-image: url(@/assets/img/front/index/kuang.png);
  background-size: 100% 100%;
  padding: 60px 200px 0 200px;
  box-sizing: border-box;

  .module_title {
    position: absolute;
    top: 90px;
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

  .basic_info {
    width: 100%;
    height: 300px;
    margin-top: 160px;
    display: flex;
    font-size: 18px;
    font-family: "ziyuanyuanti400W";
    font-weight: 400;
    color: #00b4ff;
    line-height: 30px;
    > img {
      width: 400px;
      height: 240px;
      border-radius: 10px;
      margin-right: 50px;
    }
    > div {
      > div {
        display: flex;
        > div {
          margin: 3px 0;
          margin-right: 20px;
          > img {
            width: 260px;
            height: 40px;
          }
        }
      }
    }
  }
  .introduce {
    width: 100%;
    height: 250px;
    font-size: 18px;
    font-family: "ziyuanyuanti400W";
    font-weight: 400;
    color: #00b4ff;
    line-height: 30px;
    overflow: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
