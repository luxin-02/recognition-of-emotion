<template>
  <div class="class-box">
    <div class="illustrate-box">
      <span>数据同步功能说明：</span>
      <div>
        将本机的MAC地址与物联网大数据平台设备的MAC地址进行绑定，即可将本设备上存储的用户数据云同步至大数据平台。同步后您可以在{{ $store.getters.sysInfo.unit }}物联网大数据平台内，查看到本设备当前的使用状况、用户使用记录等一系列数据。
      </div>
    </div>
    <div class="binding-box">
      <span>同步设备绑定：</span>
      <div class="address-box">
        <div class="address-title_box">
          <span>本机MAC地址：</span>
          <span>{{ $store.getters.sysInfo.unit }}物联网大数据平台MAC地址：</span>
        </div>
        <div class="address-ipt_box">
          <div>
            <input type="text">
            <img src="@/assets/img/backstage/other/fill.png" alt="">
            <span>已填写</span>
          </div>
          <img src="@/assets/img/backstage/other/link.png" alt="">
          <div>
            <input type="text">
            <img src="@/assets/img/backstage/other/unFill.png" alt="">
            <span>已填写</span>
          </div>
          <button>开始同步</button>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="setup-box">
      <span>数据同步设置：</span>
      <div class="check-box">
        <div class="data-check_box">
          <div class="data-box">
            <img
                :src="dataCheck == 0 ? require('@/assets/img/backstage/other/unCancel.png') : require('@/assets/img/backstage/other/cancel.png')"
                alt="">
            <span>按时间自动同步</span>
          </div>
          <div class="data-list_box">
            <div>
              <img src="@/assets/img/backstage/other/unCheck.png" alt="">
              <span>仅在软件启动时同步</span>
            </div>
            <div>
              <img src="@/assets/img/backstage/other/unCheck.png" alt="">
              <span>每4小时一次</span>
            </div>
            <div>
              <img src="@/assets/img/backstage/other/check.png" alt="">
              <span>每1小时一次</span>
            </div>
            <div>
              <img src="@/assets/img/backstage/other/unCheck.png" alt="">
              <span>每30分钟一次</span>
            </div>
          </div>
        </div>
        <div class="hand-check_box">
          <div class="hand-box">
            <img
                :src="dataCheck == 0 ? require('@/assets/img/backstage/other/unCancel.png') : require('@/assets/img/backstage/other/cancel.png')"
                alt="">
            <span>按时间自动同步</span>
          </div>
        </div>
        <div class="regular-check_box">
          <div class="regular-box">
            <img
                :src="dataCheck == 0 ? require('@/assets/img/backstage/other/unCancel.png') : require('@/assets/img/backstage/other/cancel.png')"
                alt="">
            <span>固定时间同步</span>
          </div>
          <div class="regular-list_box">
            <span>固定每日：</span>
            <div class="sele">
              <selectVue :options="dataList" :value="dataVal" label="name" ItemValue="id"
                         @changeValue="changeData">
              </selectVue>
            </div>

            <span>时</span>
          </div>
        </div>
      </div>


    </div>
    <div class="last-time_data">
      上次同步时间：2023-04-11 14:26:35
    </div>
    <div class="line" style="margin: 19px 0 0 0;"></div>
    <div class="footer">
      <div class="footer-content">
        <span>同步进度：{{ progress }}%</span>
        <el-progress :text-inside="true" :stroke-width="16" :percentage="progress" :show-text="false"></el-progress>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      // MAC
      dataCheck: 1,//时间同步
      dataList: [
        {name: 1, id: 1},
        {name: 2, id: 23},
        {name: 3, id: 3},
        {name: 4, id: 4},
        {name: 5, id: 5},
        {name: 6, id: 6},
        {name: 7, id: 7},
        {name: 8, id: 8},
        {name: 9, id: 9},
      ],
      dataVal: '',
      progress: 55
    };
  },

  computed: {},

  watch: {},

  methods: {
    changeData(val) {
      this.dataVal = val
    },
  },

  mounted() {
  },

  created() {
  },

}

</script>
<style lang='less' scoped>
.class-box {
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 25px;
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

      .data-check_box, .hand-check_box {
        width: 100%;
        height: 18px;
        display: flex;
        align-items: center;

        .data-box, .hand-box {
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
    margin-top: 300px;
    font-size: 16px;
    color: #333333;
  }

  .footer {
    height: 111px;
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
}</style>