<template>
  <div class="set_wrap">
    <div class="row">软件设置详情如下：</div>
    <div class="row">
      <div class="row_text">悬浮球默认：</div>
      <div class="switchover">
        <div @click="form.sphere = true">
          <img src="@/assets/img/front/set/勾选.png" v-show="form.sphere" />
          <img src="@/assets/img/front/set/未勾.png" v-show="!form.sphere" />
          默认开启
        </div>
        <div @click="form.sphere = false">
          <img src="@/assets/img/front/set/勾选.png" v-show="!form.sphere" />
          <img src="@/assets/img/front/set/未勾.png" v-show="form.sphere" />
          默认关闭
        </div>
      </div>
    </div>
    <!-- <div class="row">
      <div class="row_text">检测栏默认：</div>
      <div class="switchover">
        <div>
          <img src="@/assets/img/front/set/勾选.png" />
          <img src="@/assets/img/front/set/未勾.png" />
          默认开启
        </div>
        <div>
          <img src="@/assets/img/front/set/勾选.png" />
          <img src="@/assets/img/front/set/未勾.png" />
          默认关闭
        </div>
      </div>
    </div> -->
    <div class="row">
      <div class="row_text">媒体声音：</div>

      <div class="voice">
        <img
          src="@/assets/img/front/set/jian.png"
          @click="
            () => {
              if (form.sphere_effects == 0) return
              form.sphere_effects--
            }
          "
        />
        <el-slider
          class="slider"
          :show-tooltip="false"
          v-model="form.sphere_effects"
          :max="100"
          :step="1"
        ></el-slider>
        <img
          src="@/assets/img/front/set/jia.png"
          @click="
            () => {
              if (form.sphere_effects == 100) return
              form.sphere_effects++
            }
          "
        />
      </div>
    </div>
    <div class="row">
      <div class="row_text last">悬浮球透明度：</div>
      <div class="voice">
        <img
          src="@/assets/img/front/set/jian.png"
          @click="
            () => {
              if (form.sphere_transparency == 0) return
              form.sphere_transparency--
            }
          "
        />
        <el-slider
          class="slider"
          :show-tooltip="false"
          v-model="form.sphere_transparency"
          :max="100"
          :step="1"
        ></el-slider>
        <img
          src="@/assets/img/front/set/jia.png"
          @click="
            () => {
              if (form.sphere_transparency == 100) return
              form.sphere_transparency++
            }
          "
        />
      </div>
    </div>

    <div class="btn_wrap">
      <button @click="save">保存设置</button>
      <button @click="resetting">恢复默认</button>
      <button
        @click="$router.push('/index/home')"
        v-if="$store.getters.isAdmin || $store.getters.userInfo.role == 4"
      >
        切换后台
      </button>
    </div>
  </div>
</template>

<script>
import { frontApiSettingInfoInLogin, sphereApiSet } from "@/server/api/system"
import { mapGetters } from "vuex"
export default {
  data() {
    return {
      form: {
        sphere: true,
        sphere_transparency: 100,
        sphere_effects: 100,
        sphere_game_effects: 100,
      },

      resetShow: false,
    }
  },
  computed: {
    ...mapGetters(["sysInfo"]),
  },
  mounted() {
    this.form.sphere = this.sysInfo.sphere == "0"
    this.form.sphere_transparency = +this.sysInfo.sphere_transparency
    this.form.sphere_effects = +this.sysInfo.sphere_effects
    this.form.sphere_game_effects = +this.sysInfo.sphere_game_effects
    this.getSystemInfo()
  },
  methods: {
    async getSystemInfo() {
      const { data } = await frontApiSettingInfoInLogin()
      if (data.code == 200) {
        data.data.sphere = data.data.sphere ?? "0"
        data.data.sphere_transparency = +(data.data.sphere_transparency ?? 100)
        data.data.sphere_effects = +(data.data.sphere_effects ?? 50)
        data.data.sphere_game_effects = +(data.data.sphere_game_effects ?? 50)
        this.form.sphere = data.data.sphere == "0"
        this.form.sphere_transparency = data.data.sphere_transparency
        this.form.sphere_effects = data.data.sphere_effects
        this.form.sphere_game_effects = data.data.sphere_game_effects
        this.$store.commit("UPDATE_SYS_INFO", data.data)
      }
    },
    resetting() {
      this.form.sphere = true
      this.form.sphere_transparency = 100
      this.form.sphere_effects = 100
      this.form.sphere_game_effects = 100
    },
    save() {
      sphereApiSet({
        sphere: this.form.sphere ? "0" : "1",
        sphere_transparency: this.form.sphere_transparency,
        sphere_effects: this.form.sphere_effects,
        sphere_game_effects: this.form.sphere_game_effects,
      })
        .then(() => {
          this.$myMessage({
            type: "font-success",
            message: "保存成功",
          })

          this.getSystemInfo()
        })
        .finally(() => {
          this.resetShow = false
        })

      let from = {
        sphere: this.form.sphere ? "0" : "1",
        sphere_transparency: this.form.sphere_transparency,
        sphere_effects: this.form.sphere_effects,
        sphere_game_effects: this.form.sphere_game_effects,
      }
      this.$store.commit("UPDATE_SYS_INFO", from)
    },
  },
}
</script>

<style scoped lang="scss">
.set_wrap {
  width: 100%;
  height: 100%;
  .row {
    width: 85%;
    font-size: 18px;
    font-family: "ziyuanyuanti400W";
    font-weight: 400;
    text-align: left;
    color: #00b4ff;
    line-height: 70px;
    display: flex;
    align-items: center;
    > .row_text {
      margin-right: 35px;
      &.last {
        margin-right: 0;
      }
    }

    .switchover {
      display: flex;
      > div {
        display: flex;
        align-items: center;
        margin-right: 25px;
        > img {
          width: 30px;
          height: 30px;
        }
      }
    }
    .voice {
      display: flex;
      align-items: center;
      > img {
        width: 55px;
        height: 55px;
        margin: 0 18px;
      }
      ::v-deep .slider {
        width: 300px;
        height: 45px;
        background: #0d3c6a;
        border-radius: 4px;
        .el-slider__runway {
          height: 45px;
          background: #0d3c6a;
          border-radius: 4px;
          margin: 0;
          .el-slider__bar {
            background: linear-gradient(to right, #1b64fc, #00d2ff);
            height: 45px;
            border-radius: 4px;
          }
          .el-slider__button-wrapper {
            display: none;
            top: 0px;
            .el-tooltip {
              width: 25px;
              height: 40px;
            }
          }
        }
      }
    }
  }
  .btn_wrap {
    margin-top: 50px;
    > button {
      width: 120px;
      height: 40px;
      border: 2px solid #ffffff80;
      border-radius: 4px;
      font-size: 16px;
      font-family: "ziyuanyuanti500W";
      font-weight: 500;
      color: #ffffff;
      margin-right: 30px;
      &:nth-child(1) {
        background: #1a71c2;
        box-shadow: 0px 0px 10px 0px #0054ff;
      }
      &:nth-child(2) {
        background: #ff6162;
        box-shadow: 0px 0px 10px 0px #ff6162;
      }
      &:nth-child(3) {
        background: #ff9703;
        box-shadow: 0px 0px 10px 0px #ff9703;
      }
    }
  }
}
</style>
