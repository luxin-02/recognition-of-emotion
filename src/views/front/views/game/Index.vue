<template>
  <div class="user-info-box">
    <div class="module_title">游戏列表</div>
    <ul v-if="imgList.length > 0">
      <li
        v-for="(item, index) in imgList"
        :key="index"
        :class="{ hasRight: (index + 1) % 4 != 0 }"
        :style="{ marginBottom: returnFlag(index) ? '0' : '' }"
        @click="$router.push(item.serf)"
      >
        <img :src="item.img" alt="" />
        <div>{{ item.name }}</div>
      </li>
    </ul>
    <div v-else>
      <img :src="empty" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgList: [
        {
          img: require("@/assets/images/game/1.png"),
          name: "翻牌",
          serf: "/game1",
        },
        {
          img: require("@/assets/images/game/2.png"),
          name: "扫雷大战",
          serf: "/game2",
        },
        {
          img: require("@/assets/images/game/3.png"),
          name: "眼力大比拼",
          serf: "/game3",
        },
        {
          img: require("@/assets/images/game/4.png"),
          name: "舒特尔测试",
          serf: "/game4",
        },
        {
          img: require("@/assets/images/game/5.png"),
          name: "大家来找茬",
          serf: "/game5",
        },
        {
          img: require("@/assets/images/game/6.png"),
          name: "迷宫",
          serf: "/game6",
        },
        {
          img: require("@/assets/images/game/7.png"),
          name: "板块迭代",
          serf: "/game7",
        },
        {
          img: require("@/assets/images/game/8.png"),
          name: "旋转拼图",
          serf: "/game8",
        },
      ],
      empty: require("@/assets/images/empty.png"),
    }
  },
  mixins: [],
  watch: {},
  computed: {},
  directives: {},
  filters: {},
  components: {},
  methods: {
    returnFlag(_index) {
      let compareIndex = this.imgList.length % 4
      let page = Math.floor(this.imgList.length / 4)
      let a = []
      for (var i = 0; i < compareIndex; i++) {
        a.push(page * 4 + i)
      }
      if (a.indexOf(_index) > -1) {
        return true
      } else {
        return false
      }
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  errorCaptured() {},
}
</script>

<style lang="scss" scoped>
div.user-info-box {
  width: 1580px;
  height: 872px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-image: url(@/assets/img/front/index/kuang.png);
  background-size: 100% 100%;
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
  > ul {
    display: flex;
    flex-wrap: wrap;
    padding: 210px 280px 0 280px;

    > li {
      width: 210px;
      height: 210px;
      text-align: center;
      margin: 0 20px 50px 20px;
      background-size: 100% 100%;
      &:hover {
        background-image: url(@/assets/images/选中光效.png);
      }
      > img {
        width: 125px;
        height: 125px;
        margin: 42px 0 15px 1px;
        border-radius: 15px;
        // border: 1px solid #00a6fc;
        // box-sizing: border-box;
      }
      > div {
        font-size: 24px;
        font-family: "ziyuanyuanti500W";
        color: #fff;
      }
    }
  }
}
</style>
