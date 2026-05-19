<template>
  <div class="class-box">
    <div class="illustrate-box">
      <span>数据同步功能说明：</span>
      <div>
        将本机的MAC地址与物联网大数据平台设备的MAC地址进行绑定，即可将本设备上存储的用户数据云同步至大数据平台。同步后您可以在物联网大数据平台内，查看到本设备当前的使用状况、用户使用记录等一系列数据。
      </div>
    </div>
    <div class="binding-box">
      <span>同步设备绑定：</span>
      <div class="address-box">
        <div class="address-title_box">
          <span>本机MAC地址：</span>
          <span>大数据平台MAC地址：</span>
        </div>
        <div class="address-ipt_box">
          <div>
            <input type="text" v-model="dataObj.mac" />
            <img
              :src="
                dataObj.mac != ''
                  ? require('@/assets/img/backstage/other/fill.png')
                  : require('@/assets/img/backstage/other/unFill.png')
              "
              alt=""
            />
            <span>{{ dataObj.mac != "" ? "已填写" : "未填写" }}</span>
          </div>
          <img src="@/assets/img/backstage/other/link.png" alt="" />
          <div>
            <input type="text" v-model="dataObj.target_ip" />
            <img
              :src="
                dataObj.target_ip != ''
                  ? require('@/assets/img/backstage/other/fill.png')
                  : require('@/assets/img/backstage/other/unFill.png')
              "
              alt=""
            />
            <span>{{ dataObj.target_ip != "" ? "已填写" : "未填写" }}</span>
          </div>
          <el-button @click="sub" :loading="loading">开始同步</el-button>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="setup-box">
      <span>数据同步设置：</span>
      <div class="check-box">
        <div class="data-check_box">
          <div class="data-box" @click="isSeleTime(dataObj.type)">
            <img
              :src="
                dataObj.type == 1
                  ? require('@/assets/img/backstage/other/cancel.png')
                  : require('@/assets/img/backstage/other/unCancel.png')
              "
              alt=""
            />
            <span>按时间自动同步</span>
          </div>
          <div class="data-list_box">
            <div @click="seleTime(0)">
              <img
                :src="
                  dataObj.press_type == 0
                    ? require('@/assets/img/backstage/other/check.png')
                    : require('@/assets/img/backstage/other/unCheck.png')
                "
                alt=""
              />
              <span>仅在软件启动时同步</span>
            </div>
            <div @click="seleTime(1)">
              <img
                :src="
                  dataObj.press_type == 1
                    ? require('@/assets/img/backstage/other/check.png')
                    : require('@/assets/img/backstage/other/unCheck.png')
                "
                alt=""
              />
              <span>每4小时一次</span>
            </div>
            <div @click="seleTime(2)">
              <img
                :src="
                  dataObj.press_type == 2
                    ? require('@/assets/img/backstage/other/check.png')
                    : require('@/assets/img/backstage/other/unCheck.png')
                "
                alt=""
              />
              <span>每1小时一次</span>
            </div>
            <div @click="seleTime(3)">
              <img
                :src="
                  dataObj.press_type == 3
                    ? require('@/assets/img/backstage/other/check.png')
                    : require('@/assets/img/backstage/other/unCheck.png')
                "
                alt=""
              />
              <span>每30分钟一次</span>
            </div>
          </div>
        </div>
        <div class="hand-check_box">
          <div class="hand-box" @click="isSeleHandTime(dataObj.hand_type)">
            <img
              :src="
                dataObj.hand_type == 1
                  ? require('@/assets/img/backstage/other/cancel.png')
                  : require('@/assets/img/backstage/other/unCancel.png')
              "
              alt=""
            />
            <span>手动点击同步</span>
          </div>
        </div>
        <div class="regular-check_box">
          <div
            class="regular-box"
            @click="isSeleRegularTime(dataObj.regular_type)"
          >
            <img
              :src="
                dataObj.regular_type == 1
                  ? require('@/assets/img/backstage/other/cancel.png')
                  : require('@/assets/img/backstage/other/unCancel.png')
              "
              alt=""
            />
            <span>固定时间同步</span>
          </div>
          <div class="regular-list_box">
            <span>固定每日：</span>
            <div class="sele">
              <selectVue
                :options="dataList"
                :value="dataObj.regular_time"
                label="name"
                ItemValue="id"
                @changeValue="changeData"
                :disabled="dataObj.regular_type == 0"
              >
              </selectVue>
            </div>
            <span>时</span>
          </div>
        </div>
      </div>
    </div>
    <div class="last-time_data">上次同步时间：{{ dataObj.add_time }}</div>
    <div class="line" style="margin: 19px 0 0 0"></div>
    <div class="footer">
      <div class="footer-content">
        <span>同步进度：{{ progress }}%</span>
        <el-progress
          :text-inside="true"
          :stroke-width="16"
          :percentage="progress"
          :show-text="false"
        ></el-progress>
      </div>
    </div>
  </div>
</template>

<script>
import {
  dataSynchronizationApiInfo,
  dataSynchronizationApiSave,
} from "@/server/api/system"; //数据同步查看、保存接口
export default {
  data() {
    return {
      //设置 loading 状态
      loading: false,
      //固定时间数组
      dataList: [
        { name: 1, id: 1 },
        { name: 2, id: 2 },
        { name: 3, id: 3 },
        { name: 4, id: 4 },
        { name: 5, id: 5 },
        { name: 6, id: 6 },
        { name: 7, id: 7 },
        { name: 8, id: 8 },
        { name: 9, id: 9 },
        { name: 10, id: 10 },
        { name: 11, id: 11 },
        { name: 12, id: 12 },
        { name: 13, id: 13 },
        { name: 14, id: 14 },
        { name: 15, id: 15 },
        { name: 16, id: 16 },
        { name: 17, id: 17 },
        { name: 18, id: 18 },
        { name: 19, id: 19 },
        { name: 20, id: 20 },
        { name: 21, id: 21 },
        { name: 22, id: 22 },
        { name: 23, id: 23 },
        { name: 24, id: 24 },
      ],
      // 进度条
      progress: 0,
      progressTime: null,
      // 存储数据
      dataObj: {},
    };
  },

  computed: {},

  watch: {},

  methods: {
    //选择固定时间更新
    changeData(val) {
      this.dataVal = val;
    },
    //保存
    async sub() {
      this.progress = 0;
      this.loading = true;
      const params = {
        mac: this.dataObj.mac,
        target_ip: this.dataObj.target_ip,
        type: this.dataObj.type,
        press_type: this.dataObj.press_type,
        hand_type: this.dataObj.hand_type,
        regular_type: this.dataObj.regular_type,
        regular_time: this.dataObj.regular_time,
        last_time: parseInt(new Date().getTime() / 1000),
      };

      try {
        const { data } = await dataSynchronizationApiSave(params);
        console.log(data);
        if (data.code == 200) {
          this.progress = 100;
          setTimeout(() => {
            this.$message.success(data.msg);
            // this.loading = false;
            this.progress = 0;
            this.getDataSynchronizationSee();
          }, 2000);
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    // 是否固定时间同步
    isSeleRegularTime(num) {
      if (num == 1) {
        this.dataObj.regular_type = 0;
      } else {
        this.dataObj.regular_type = 1;
      }
    },
    // 是否手动点击同步
    isSeleHandTime(num) {
      if (num == 1) {
        this.dataObj.hand_type = 0;
      } else {
        this.dataObj.hand_type = 1;
      }
    },
    //是否按时间自动同步
    isSeleTime(num) {
      if (num == 1) {
        this.dataObj.type = 0;
        this.dataObj.press_type = -1;
      } else {
        this.dataObj.type = 1;
      }
    },
    //按时间自动同步 就选择一条
    seleTime(num) {
      if (this.dataObj.type == 0) return;
      this.dataObj.press_type = num;
    },
    //获取数据同步数据
    async getDataSynchronizationSee() {
      const { data } = await dataSynchronizationApiInfo();
      if (data.code == 200) {
        this.dataObj = data.data;
        if (this.dataObj.regular_type == 0) {
          this.dataObj.regular_time = "";
          return;
        }
        this.dataObj.regular_time = +this.dataObj.regular_time;
      }
    },
  },

  mounted() {},

  created() {
    this.getDataSynchronizationSee();
  },
};
</script>
<style lang="less" scoped>
.class-box {
  width: 100%;
  // height: 100%;
  position: relative;
  padding-top: 29px;
  box-sizing: border-box;

  .illustrate-box {
    display: flex;
    justify-content: space-between;
    width: 1100px;

    span {
      display: block;
      width: 145px;
      font-size: 16px;
      color: #313131;
      line-height: 32px;
    }

    div {
      width: 940px;
      font-size: 15px;
      color: #333333;
      line-height: 30px;
    }
  }

  .binding-box {
    display: flex;
    justify-content: space-between;
    width: 1100px;
    margin-top: 62px;

    > span {
      display: block;
      width: 145px;
      font-size: 16px;
      color: #313131;
      line-height: 32px;
    }

    .address-box {
      width: 940px;
      height: 85px;
      font-size: 16px;
      color: #333333;
      line-height: 30px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .address-title_box {
        width: 100%;
        display: flex;

        span {
          display: block;
          width: 45.7%;
          height: 23px;
        }
      }

      .address-ipt_box {
        display: flex;
        justify-content: space-between;
        align-items: center;

        div {
          width: 370px;
          height: 42px;
          background: #eeeeee;
          border: 1px solid #e6e6e6;
          border-radius: 4px;
          padding-right: 10px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;

          input {
            width: 284px;
            padding: 15px 0 15px 11px;
            box-sizing: border-box;
            background: none;
            border: none;
            outline: none;
            font-size: 14px;
            color: #333333;
          }

          img {
            display: block;
            width: 16px;
            height: 16px;
          }

          span {
            display: block;
            font-size: 14px;
            color: #333333;
          }
        }

        > img {
          display: block;
          width: 20px;
          height: 6px;
        }

        button {
          width: 120px;
          height: 40px;
          background: #2e8ae6;
          border-radius: 6px;
          font-size: 16px;
          color: #ffffff;
        }
        /deep/ .el-button:hover {
          opacity: 1;
        }
      }
    }
  }

  .line {
    width: 100%;
    height: 1px;
    background: #e6e6e6;
    margin-top: 40px;
  }

  .setup-box {
    display: flex;
    justify-content: space-between;
    width: 1100px;
    margin-top: 40px;
    //align-items: center;
    > span {
      display: block;
      width: 145px;
      font-size: 16px;
      color: #313131;
    }

    .check-box {
      width: 940px;
      height: auto;
      display: flex;
      flex-direction: column;
      .data-check_box {
        margin-bottom: 40px;
      }
      .hand-check_box {
        margin-bottom: 30px;
      }
      .data-check_box,
      .hand-check_box {
        width: 100%;
        height: 18px;
        display: flex;
        align-items: center;

        .data-box,
        .hand-box {
          display: flex;
          align-items: center;
          img {
            display: block;
            width: 18px;
            height: 18px;
            margin-right: 15px;
          }
          span {
            display: block;
            font-size: 15px;
            color: #333333;
            //line-height: 30px;
          }
        }
        .data-list_box {
          margin-left: 25px;
          height: 18px;
          display: flex;
          div {
            display: flex;
            align-items: center;
            margin-right: 56px;
            img {
              display: block;
              width: 18px;
              height: 18px;
              margin-right: 15px;
            }
            span {
              font-size: 15px;
              color: #333333;
            }
          }
        }
      }
      .regular-check_box {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        .regular-box {
          display: flex;
          align-items: center;
          img {
            display: block;
            width: 18px;
            height: 18px;
            margin-right: 15px;
          }
          span {
            display: block;
            font-size: 15px;
            color: #333333;
            //line-height: 30px;
          }
        }
        .regular-list_box {
          margin-left: 42px;
          display: flex;
          align-items: center;
          span {
            font-size: 15px;
            color: #333333;
            opacity: 0.5;
          }
          .sele {
            width: 90px;
            height: 40px;
            margin: 0 14px 0 24px;
            /deep/ .el-select {
              .el-input__inner {
                opacity: 0.5;
                background: #eeeeee;
                border: 1px solid #e6e6e6;
                border-radius: 4px;
              }

              .el-select-dropdown {
                left: 0px !important;
              }
            }
          }
        }
      }
    }
  }
  .last-time_data {
    margin-top: 240px;
    font-size: 16px;
    color: #333333;
  }
  .footer {
    height: 105px;
    display: flex;
    align-items: center;
    .footer-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      span {
        display: block;
        width: 100%;
        font-size: 16px;
        color: #333333;
        margin-bottom: 14px;
      }
      /deep/ .el-progress {
        line-height: 0px;
        height: 16px;
        .el-progress-bar__outer {
          border-radius: 8px;
          .el-progress-bar__inner {
            border-radius: 8px;
            background-color: unset;
            background-image: linear-gradient(to right, #05aafa, #2e8ae6);
          }
        }
      }
    }
  }
}
</style>
