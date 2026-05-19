<template>
  <div class="index">
    <div class="back_wrap">
      <div @click="$router.go(-1)"></div>
    </div>

    <div class="relaxSet">
      <div class="module_title">
        <i>-----------</i>
        <img src="@/assets/img/front/relax/module_title.png" alt="" />
        训练设置
        <i>-----------</i>
      </div>

      <div class="switchover">
        <div class="left">
          <div :class="{ active: atCalss == 1 }" @click="atCalss = 1">
            <button class="yellow">眼动脱敏</button>
          </div>
          <div :class="{ active: atCalss == 2 }" @click="atCalss = 2">
            <button class="purple">呼吸训练</button>
          </div>
          <div :class="{ active: atCalss == 3 }" @click="atCalss = 3">
            <button class="red">呼吸球训练</button>
          </div>
        </div>
        <div class="line"></div>
        <div class="right">
          <template v-if="atCalss == 1 || atCalss == 3">
            <div class="right_title"><i></i> 训练设置</div>
            <div class="set_time">
              <div>训练时间：</div>
              <el-select v-model="tmOrhx.time" placeholder="请选择">
                <el-option
                  v-for="item in frequencyData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="right_title"><i></i> 呼吸频率设置</div>
            <div class="set_time">
              <div>运动频率：</div>
              <el-input-number
                v-model="tmOrhx.frequency"
                :min="1"
                :max="10"
                label="秒"
              ></el-input-number>
            </div>
          </template>

          <template v-else>
            <div class="right_title"><i></i> 训练设置</div>
            <div class="flex">
              <div class="set_time">
                <div>训练时间：</div>
                <el-select v-model="hxDrill.time" placeholder="请选择">
                  <el-option
                    v-for="item in frequencyData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="set_time">
                <div>声音设置：</div>
                <el-select v-model="hxDrill.sound" placeholder="请选择">
                  <el-option
                    v-for="item in soundData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="right_title"><i></i> 呼吸频率设置</div>
            <div class="flex">
              <div class="set_time">
                <div>频率设置：</div>
                <el-input-number
                  v-model="hxDrill.xiru"
                  :min="1"
                  :max="10"
                  label="秒"
                ></el-input-number>
              </div>

              <div class="set_time">
                <div>吐气时长：</div>
                <el-input-number
                  v-model="hxDrill.tuqi"
                  :min="1"
                  :max="10"
                  label="秒"
                ></el-input-number>
              </div>

              <div class="set_time">
                <div>屏气时长：</div>
                <el-input-number
                  v-model="hxDrill.binqi"
                  :min="0"
                  :max="10"
                  label="秒"
                ></el-input-number>
              </div>
            </div>
          </template>

          <div class="btn_wrap">
            <div class="blue" @click="begin">开始训练</div>
            <div class="red" @click="reset">恢复默认</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tmOrhx: {
        time: 180,
        frequency: 0,
      },
      hxDrill: {
        time: 180,
        sound: true,
        xiru: 4,
        tuqi: 4,
        binqi: 0,
      },
      frequencyData: [
        {
          label: "1分钟",
          value: 60,
        },
        {
          label: "3分钟",
          value: 180,
        },
        {
          label: "5分钟",
          value: 300,
        },
        {
          label: "10分钟",
          value: 600,
        },
        {
          label: "15分钟",
          value: 900,
        },
      ],
      soundData: [
        {
          label: "开启",
          value: true,
        },
        {
          label: "关闭",
          value: false,
        },
      ],

      atCalss: 1,
    }
  },
  created() {},
  mounted() {
    if (this.$route.query.atCalss) {
      this.atCalss = this.$route.query.atCalss
    }
  },
  methods: {
    begin() {
      if (this.atCalss == 1 || this.atCalss == 3) {
        console.log(this.tmOrhx)
        var path = this.atCalss == 1 ? "/relax/eve" : "/relax/hrball"
        this.$router.push({
          path: path,
          query: {
            time: this.tmOrhx.time,
            frequency: this.tmOrhx.frequency,
          },
        })
      }
      if (this.atCalss == 2) {
        console.log(this.hxDrill)
        this.$router.push({
          path: "/relax/hxdrill",
          query: {
            time: this.hxDrill.time,
            sound: this.hxDrill.sound ? 1 : 2,
            xiru: this.hxDrill.xiru,
            tuqi: this.hxDrill.tuqi,
            binqi: this.hxDrill.binqi,
          },
        })
      }
    },
    reset() {
      this.tmOrhx = {
        time: 180,
        frequency: 0,
      }
      this.hxDrill = {
        time: 180,
        sound: true,
        xiru: 0,
        tuqi: 0,
        binqi: 0,
      }
    },
  },
  beforeDestroy() {},
}
</script>

<style scoped lang="scss">
.index {
  width: 100vw;
  height: 100vh;
  background-size: 100% 100%;
  background-image: url("@/assets/img/front/relax/bg.png");
  position: relative;
  z-index: 10;
  .back_wrap {
    width: 100%;
    height: 80px;
    background: #00000030;
    padding: 10px 0 0 30px;
    box-sizing: border-box;
    -webkit-app-region: no-drag;
    > div {
      z-index: 99999;
      width: 60px;
      height: 60px;
      background-size: 100% 100%;
      background-image: url("@/assets/img/front/relax/back.png");
      cursor: pointer;
    }
  }
  .relaxSet {
    width: 1350px;
    height: 760px;
    background-image: url(@/assets/img/front/index/biankuang.png);
    background-size: 100% 100%;
    position: relative;
    margin: 50px auto 0 auto;

    .module_title {
      position: absolute;
      top: 55px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 24px;
      font-family: "ziyuanyuanti500W";
      color: #fff;
      > img {
        width: 60px;
        height: 60px;
      }
      > i {
        font-size: 30px;
        font-weight: 400;
        font-family: "ziyuanyuanti400W";
        color: #aed6ffad;
        display: inline-block;
        margin: 0 10px;
      }
    }

    .switchover {
      width: 100%;
      height: 500px;
      padding: 180px 0 0 50px;
      box-sizing: border-box;
      display: flex;
      .left {
        width: 450px;
        height: 100%;
        margin-top: 50px;
        > div {
          width: 230px;
          height: 100px;
          border-radius: 50px;
          margin: 0 auto;
          text-align: center;
          margin-bottom: 20px;
          &.active {
            background: #31374c;
          }
          > button {
            width: 200px;
            height: 70px;
            border-radius: 35px;
            font-size: 24px;
            font-family: "ziyuanyuanti500W";
            font-weight: 500;
            color: #ffffff;
            background: #00000000;
            margin: 15px auto 0 auto;
            background-size: 100% 100%;
            &.yellow {
              background-image: url(@/assets/img/front/relax/yellow.png);
            }
            &.purple {
              background-image: url(@/assets/img/front/relax/purple.png);
            }
            &.red {
              background-image: url(@/assets/img/front/relax/red.png);
            }
          }
        }
      }
      .right {
        width: 800px;
        height: 100%;
        padding: 0 0 0 80px;
        box-sizing: border-box;
        .right_title {
          font-size: 22px;
          font-family: "ziyuanyuanti500W";
          font-weight: 500;
          color: #ffffff;
          display: flex;
          align-items: center;
          > i {
            width: 8px;
            height: 20px;
            background: #00a6fc;
            border-radius: 4px;
            display: inline-block;
            margin: 5px 10px 0 0;
          }
        }
        .set_time {
          margin: 30px 0;
          display: flex;
          align-items: center;
          > div {
            font-size: 18px;
            font-family: "ziyuanyuanti400W";
            font-weight: 400;
            color: #ffffff;
            margin-right: 20px;
          }
          ::v-deep .el-input__inner {
            background-color: #1f4178;
            border: none;
            color: #fff;
          }
          ::v-deep .el-input-number__decrease,
          ::v-deep .el-input-number__increase {
            background: #00a6fc;
            color: #fff;
            border: none;
          }
        }
        .flex {
          display: flex;
          flex-wrap: wrap;
        }

        .btn_wrap {
          display: flex;
          > div {
            width: 150px;
            height: 55px;
            text-align: center;
            background: #00000000;
            background-size: 100% 100%;
            font-size: 22px;
            font-family: "ziyuanyuanti500W";
            font-weight: 500;
            color: #ffffff;
            margin: 25px 25px 0 0;
            line-height: 50px;
            &.blue {
              background-image: url(@/assets/img/front/relax/begin.png);
            }
            &.red {
              background-image: url(@/assets/img/front/relax/red.png);
            }
          }
        }
      }
      .line {
        width: 1px;
        height: 100%;
        margin-top: 90px;
        background-size: 100% 100%;
        background-image: url(@/assets/img/front/userInfo/line.png);
      }
    }
  }
}
</style>
