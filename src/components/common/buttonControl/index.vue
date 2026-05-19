<template>
  <div class="index">
    <div class="sound">
      <img src="./img/声音.png" @click="volumeShow = !volumeShow" />
      音量

      <div class="volume_box" v-show="volumeShow">
        <p class="number">{{ musicVolume }}%</p>
        <el-slider
          v-model="musicVolume"
          :show-tooltip="false"
          :max="100"
          :step="1"
          vertical
          height="1.8rem"
          @change="volumeChange"
        >
        </el-slider>
        <img class="icon" src="./img/音量.png" />
      </div>
    </div>
    <img class="dizuo" src="./img/底座.png" />
    <div class="back" @click="goRetreat()">
      <img src="./img/返回.png" />
      返回
    </div>
  </div>
</template>

<script>
import { sphereApiSet } from "@/server/api/system"
import { mapGetters } from "vuex"
export default {
  data() {
    return {
      volumeShow: false,
      musicVolume: 0,
    }
  },
  computed: {
    ...mapGetters(["sysInfo"]),
  },
  created() {
    this.setValue()
  },
  mounted() {},
  methods: {
    volumeChange(v) {
      this.musicVolume = v
      // this.$refs.audioref.volume = this.musicVolume / 100;
      // this.$emit("volumeCurrent", this.musicVolume);
      this.subSet()
    },

    async subSet() {
      const params = {
        sphere_effects: this.musicVolume,
      }
      const { data } = await sphereApiSet(params)
      //console.log(data);
      if (data.code == 200) {
        this.$store.commit("UPDATE_SYS_INFO", {
          sphere_effects: this.musicVolume,
        })
        this.$myMessage({
          type: "font-success",
          message: data.msg,
        })
        this.setValue()
      }
    },
    setValue() {
      this.musicVolume = Number(this.sysInfo.sphere_effects)
    },

    goRetreat() {
      if (window.goHistoryFn) {
        window.goHistoryFn()
      } else {
        this.$goRetreat()
      }
    },
  },
  beforeDestroy() {},
}
</script>

<style scoped lang="scss">
.index {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 280px;
  box-sizing: border-box;
  pointer-events: none;
  z-index: 1;
  .dizuo {
    width: 646px;
    height: 287px;
  }
  .sound,
  .back {
    width: 90px;
    height: 140px;
    text-align: center;
    color: #fff;
    font-family: "ziyuanyuanti400W";
    font-size: 18px;
    margin-top: 130px;
    position: relative;
    > img {
      width: 90px;
      height: 110px;
      pointer-events: auto; /* 子元素恢复交互 */
      cursor: pointer;
    }
    .volume_box {
      width: 80px;
      height: 300px;
      border-radius: 10px;
      position: absolute;
      right: 6px;
      bottom: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #00000050;
      pointer-events: auto; /* 子元素恢复交互 */
      .number {
        position: absolute;
        top: 20px;
        font-size: 16px;
        font-family: Resource Han Rounded CN, Resource Han Rounded CN-Bold;
        color: #fefefe;
      }
      .icon {
        width: 24px;
        height: 23px;
        position: absolute;
        bottom: 15px;
      }
      ::v-deep .el-slider {
        .el-slider__runway {
          width: 40px;
          height: 200px;
          margin: 0;
          border-radius: 5px;
          background: #0d3c6a;
          .el-slider__bar {
            width: 40px;
            border-radius: 5px;
            background: linear-gradient(0deg, #1b64fc 0%, #00d2ff 100%);
          }
          .el-slider__button-wrapper {
            width: 40px;
            left: 0;
            .el-slider__button {
              width: 40px;
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>
