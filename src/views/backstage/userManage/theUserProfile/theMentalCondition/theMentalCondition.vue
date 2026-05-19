<template>
  <div class="info-warp" v-on:scroll="scroll">
    <p class="info_title">用户精神状态情况表</p>
    <div class="title-row" style="width: 9.01rem">
      <div class="icon"></div>
      <span>精神状态概况</span>
    </div>
    <table class="bottom_20" style="width: 9.01rem">
      <tr>
        <td class="title">精神状态：</td>
        <td>
          <input class="table_input" v-model="spirit.spirit" />
        </td>
        <td class="title">是否嗜睡：</td>
        <td>
          <el-select
            ref="selectRef1"
            v-model="spirit.drowsiness"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
        <td class="title">攻击行为：</td>
        <td>
          <el-select
            ref="selectRef2"
            v-model="spirit.attack"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td class="title">出现幻觉：</td>
        <td>
          <el-select
            ref="selectRef3"
            v-model="spirit.illusion"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
        <td class="title">容易悲观：</td>
        <td>
          <el-select
            ref="selectRef4"
            v-model="spirit.pessimism"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
        <td class="title">睡眠情况：</td>
        <td>
          <input class="table_input" v-model="spirit.sleep" />
        </td>
      </tr>
      <tr>
        <td class="title">丢三落四：</td>
        <td>
          <el-select
            ref="selectRef5"
            v-model="spirit.forgetful"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
        <td class="title">喜怒无常：</td>
        <td colspan="3">
          <el-select
            ref="selectRef6"
            v-model="spirit.moody"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td class="title">备注：</td>
        <td colspan="5">
          <input class="table_input" v-model="spirit.descr" />
        </td>
      </tr>
    </table>
    <div class="title-row" style="width: 9.01rem">
      <div class="icon"></div>
      <span>精神状态概况</span>
    </div>
    <div class="content_box">
      <div class="row">1.工作或学习注意力无法集中</div>
      <div class="row">
        <el-radio v-model="spirit.overview1" label="无此情况"
          >无此情况</el-radio
        >
        <el-radio v-model="spirit.overview1" label="偶尔">偶尔</el-radio>
        <el-radio v-model="spirit.overview1" label="经常">经常</el-radio>
        <el-radio v-model="spirit.overview1" label="非常频繁"
          >非常频繁</el-radio
        >
      </div>
      <div class="row">2.经常言三语四，说一些别人听不懂的话</div>
      <div class="row">
        <el-radio v-model="spirit.overview2" label="无此情况"
          >无此情况</el-radio
        >
        <el-radio v-model="spirit.overview2" label="偶尔">偶尔</el-radio>
        <el-radio v-model="spirit.overview2" label="经常">经常</el-radio>
        <el-radio v-model="spirit.overview2" label="非常频繁"
          >非常频繁</el-radio
        >
      </div>
      <div class="row">3.无饮酒状态下无故喧哗、打人</div>
      <div class="row">
        <el-radio v-model="spirit.overview3" label="无此情况"
          >无此情况</el-radio
        >
        <el-radio v-model="spirit.overview3" label="偶尔">偶尔</el-radio>
        <el-radio v-model="spirit.overview3" label="经常">经常</el-radio>
        <el-radio v-model="spirit.overview3" label="非常频繁"
          >非常频繁</el-radio
        >
      </div>
      <div class="row">4.对人冷漠，不回应他人的问候或沟通</div>
      <div class="row">
        <el-radio v-model="spirit.overview4" label="无此情况"
          >无此情况</el-radio
        >
        <el-radio v-model="spirit.overview4" label="偶尔">偶尔</el-radio>
        <el-radio v-model="spirit.overview4" label="经常">经常</el-radio>
        <el-radio v-model="spirit.overview4" label="非常频繁"
          >非常频繁</el-radio
        >
      </div>
      <div class="row">5.过分话多，无意义活动多，乱管闲事</div>
      <div class="row">
        <el-radio v-model="spirit.overview5" label="无此情况"
          >无此情况</el-radio
        >
        <el-radio v-model="spirit.overview5" label="偶尔">偶尔</el-radio>
        <el-radio v-model="spirit.overview5" label="经常">经常</el-radio>
        <el-radio v-model="spirit.overview5" label="非常频繁"
          >非常频繁</el-radio
        >
      </div>
      <div class="row">6.动作迟钝，反应慢</div>
      <div class="row">
        <el-radio v-model="spirit.overview6" label="无此情况"
          >无此情况</el-radio
        >
        <el-radio v-model="spirit.overview6" label="偶尔">偶尔</el-radio>
        <el-radio v-model="spirit.overview6" label="经常">经常</el-radio>
        <el-radio v-model="spirit.overview6" label="非常频繁"
          >非常频繁</el-radio
        >
      </div>
      <div class="row">7.想过自杀，或自残</div>
      <div class="row">
        <el-radio v-model="spirit.overview7" label="无此情况"
          >无此情况</el-radio
        >
        <el-radio v-model="spirit.overview7" label="偶尔">偶尔</el-radio>
        <el-radio v-model="spirit.overview7" label="经常">经常</el-radio>
        <el-radio v-model="spirit.overview7" label="非常频繁"
          >非常频繁</el-radio
        >
      </div>
      <div class="row">8.思惑特别大，总觉得周围的人在谈论自己或要伤害自己</div>
      <div class="row">
        <el-radio v-model="spirit.overview8" label="无此情况"
          >无此情况</el-radio
        >
        <el-radio v-model="spirit.overview8" label="偶尔">偶尔</el-radio>
        <el-radio v-model="spirit.overview8" label="经常">经常</el-radio>
        <el-radio v-model="spirit.overview8" label="非常频繁"
          >非常频繁</el-radio
        >
      </div>
      <div class="row">9.喜欢独处，排斥与他人接触</div>
      <div class="row">
        <el-radio v-model="spirit.overview9" label="无此情况"
          >无此情况</el-radio
        >
        <el-radio v-model="spirit.overview9" label="偶尔">偶尔</el-radio>
        <el-radio v-model="spirit.overview9" label="经常">经常</el-radio>
        <el-radio v-model="spirit.overview9" label="非常频繁"
          >非常频繁</el-radio
        >
      </div>
      <div class="row">10.其它异常精神状态补充说明：</div>
      <div class="row">
        <textarea v-model="spirit.overview10"></textarea>
      </div>
    </div>
    <print ref="print" :spirit="spirit"></print>
  </div>
</template>

<script>
import { getRecordDetails2, setRecordDetails } from "@/server/api/record";
import { mapGetters } from "vuex";
import Print from "./print.vue";
import { exportWord } from "@/utils/export";
export default {
  name: "theMentalcondition",
  props: ["userId"],
  data() {
    return {
      options: [
        {
          value: "有",
        },
        {
          value: "无",
        },
      ],
      spirit: {
        spirit: "",
        drowsiness: "",
        attack: "",
        illusion: "",
        pessimism: "",
        sleep: "",
        forgetful: "",
        moody: "",
        descr: "",
        overview1: "",
        overview2: "",
        overview3: "",
        overview4: "",
        overview5: "",
        overview6: "",
        overview7: "",
        overview8: "",
        overview9: "",
        overview10: "",
      },
      detailsId: "0",
    };
  },
  components: { Print },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  mounted() {
    this.getRecordDetails();
  },
  methods: {
    async getRecordDetails() {
      const { data } = await getRecordDetails2({
        // uid: this.userInfo.id,
        uid: this.userId.id,
        type_id: "7",
      });
      if (data.code == this.$global.successCode) {
        if (data.data) {
          this.detailsId = data.data.id;
          this.spirit = data.data.info;
        }
      }
    },

    async setRecordDetails() {
      const jsonStr = JSON.stringify(this.spirit);
      var serveData = {
        // uid: this.userInfo.id,
        uid: this.userId.id,
        id: this.detailsId,
        type_id: "7",
        info: jsonStr,
      };
      if (this.detailsId == "0") {
        delete serveData.id;
      }
      const { data } = await setRecordDetails(serveData);
      if (data.code == this.$global.successCode) {
        this.$myMessage.success(data.msg);
      }
    },

    printFn() {
      this.$refs.print.print(this.userId.nickname + "的精神状态情况表");
    },
    async exportFn() {
      let name = this.userId.nickname + "的精神状态情况表";
      let docx = {
        name: name,
        ...this.spirit,
      };
      exportWord("/docxTemplate/精神状态.docx", docx, name);
    },
    scroll() {
      this.$refs.selectRef1.blur();
      this.$refs.selectRef2.blur();
      this.$refs.selectRef3.blur();
      this.$refs.selectRef4.blur();
      this.$refs.selectRef5.blur();
      this.$refs.selectRef6.blur();
    },
  },
};
</script>

<style scoped lang="scss">
.info-warp {
  padding-top: 30px;
  padding-left: 50px;

  .title-row {
    width: 899px;
    height: 40px;
    border-radius: 4px 4px 0px 0px;
    display: flex;
    align-items: center;

    .icon {
      width: 6px;
      height: 15px;
      background: $topic;
      border-radius: 3px;
      margin: 0 10px 0 15px;
    }

    span {
      font-size: 13px;
      font-family: Resource Han Rounded CN, Resource Han Rounded CN-Regular;
      font-weight: 400;
      text-align: left;
      color: $text-primary;
    }
  }

  table {
    &.bottom_20 {
      margin-bottom: 20px;
    }

    td {
      width: 200px;
      background: rgba($box-bg-gradient, 0);
      border: 1px solid rgba($text-primary, 0.2);
      border-radius: 0px 0px 4px 4px;
      font-size: 13px;
      font-family: Resource Han Rounded CN, Resource Han Rounded CN-Regular;
      font-weight: 400;
      text-align: left;
      color: $text-secondary;
      box-sizing: border-box;
      position: relative;
      height: 38px;

      &.title {
        width: 100px;
        height: 38px;
        color: $text-primary;
        padding-left: 14px;
        background: rgba($box-color-shut, 0.2);

        &.row-2 {
          height: 76px;
        }

        &.row-3 {
          height: 114px;
        }

        &.row-4 {
          height: 152px;
        }
      }

      &.no_warp {
        white-space: nowrap;
        padding-left: 0;
        text-align: center;
        max-width: 100px;
      }

      &.wid_190 {
        width: 190px;
      }

      &.wid_109 {
        width: 109px;
      }

      &.wid_88 {
        width: 88px;
      }

      &.wid_55 {
        width: 55px;
      }

      &.wid_78 {
        width: 78px;
      }

      &.wid_158 {
        width: 158px;
      }

      &.wid_110 {
        width: 110px;
      }

      &.wid_80 {
        width: 80px;
      }

      &.wid_144 {
        width: 144px;
      }

      &.wid_109 {
        width: 109px;
      }

      &.wid_450 {
        width: 450px;
      }

      &.color_white {
        color: $text-primary;
      }

      &.center {
        text-align: center;
        padding-left: 0;
      }

      &.border-right-none {
        border-right: none;
      }

      &.border-left-none {
        border-left: none;
      }

      .row {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
      }

      .other_input {
        &.wid_217 {
          width: 217px;
        }

        &.left_-36 {
          left: -36px;
        }

        position: relative;
        width: 100px;
        height: 28px;
        background-color: rgba($box-bg-gradient, 0);
        font-size: 13px;
        font-family: Resource Han Rounded CN, Resource Han Rounded CN-Regular;
        font-weight: 400;
        text-align: left;
        color: $text-secondary;
        border-bottom: 1px solid rgba($box-border-other, 0.2);
      }

      .other_input_row {
        display: flex;
        align-items: center;
        height: 38px;
        font-size: 13px;
        font-family: Resource Han Rounded CN, Resource Han Rounded CN-Regular;
        font-weight: 400;
        text-align: left;
        color: $text-secondary;
        margin-right: 49px;
      }

      .other {
        height: 38px;
        display: flex;
        align-items: center;
      }

      .button {
        display: flex;

        align-items: center;
        padding: 0 25px;
        cursor: pointer;

        &.right_align {
          justify-content: flex-end;
        }

        .icon {
          width: 16px;
          height: 16px;
          margin-right: 9px;
        }
      }

      .check_box {
        padding-left: 12px;
        margin-right: 40px;
        line-height: 38px;

        min-width: 100px;

        &.right_0 {
          margin-right: 0;
        }

        ::v-deep {
          div.pf-check {
            > div {
              margin-right: 9px;
            }

            span {
              font-size: 13px;
              font-family: Resource Han Rounded CN,
                Resource Han Rounded CN-Regular;
              font-weight: 400;
              text-align: left;
              color: $text-secondary;
            }
          }
        }
      }

      .table_select {
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        position: absolute;
        border-color: rgba($box-bg-gradient, 0);
        background-color: rgba($box-bg-gradient, 0);
        box-shadow: none;
        border-radius: 0;

        ::v-deep img {
          opacity: 0.3;
        }

        ::v-deep div.pf-select-input {
          width: 100%;
          border-radius: 0;
          border-color: rgba($box-bg-gradient, 0);
          background-color: rgba($box-bg-gradient, 0);
          box-shadow: none;
          border-radius: 0;

          input {
            font-size: 13px;
            font-family: Resource Han Rounded CN,
              Resource Han Rounded CN-Regular;
            font-weight: 400;
            text-align: left;
            color: $text-secondary;
            padding-left: 14px;
          }
        }

        ::v-deep div.pf-select-list-wrap {
          z-index: 1;
          width: 100%;
        }
      }

      .table_input {
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        position: absolute;
        border-color: rgba($box-bg-gradient, 0);
        background-color: rgba($box-bg-gradient, 0);
        box-shadow: none;
        border-radius: 0;

        &.center {
          ::v-deep input.pf-input-inner {
            text-align: center;
          }
        }

        &.color_white {
          ::v-deep input.pf-input-inner {
            color: white;
          }
        }

        ::v-deep input.pf-input-inner {
          padding-left: 14px;
          font-size: 13px;
          font-family: Resource Han Rounded CN, Resource Han Rounded CN-Regular;
          font-weight: 400;
          text-align: left;
          color: $text-secondary;
          border: none;

          &::-webkit-input-placeholder {
            font-size: 13px;
            color: $text-secondary;
          }
        }
      }
    }
  }

  .content_box {
    width: 899px;
    //background: rgba($box-bg-gradient, .25);
    // border: 1px solid rgba($text-primary, 0.2);
    border-left: 1px #e3e3e3 solid;
    border-right: 1px #e3e3e3 solid;
    border-bottom: 1px #e3e3e3 solid;
    border-radius: 0px 0px 4px 4px;
    margin-bottom: 22px;
    .row {
      width: 899px;
      min-height: 36px;
      font-size: 13px;
      font-family: Resource Han Rounded CN, Resource Han Rounded CN-Regular;
      font-weight: 400;
      text-align: left;
      color: #333;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      padding-left: 16px;
      line-height: 36px;

      textarea {
        height: 82px;
        box-sizing: border-box;
        padding-top: 5px;
        font-size: 13px;
        font-family: Resource Han Rounded CN, Resource Han Rounded CN-Regular;
        color: #333;
        background-color: rgba($box-bg-gradient, 0);
        padding-left: 0;
        width: 100%;
        @include scroll(10px, rgba($color: $text-primary, $alpha: 0.3));
        overflow-y: auto;
        border: none;

        &::-webkit-input-placeholder {
          opacity: 0.5;
          font-size: 13px;
          font-family: Resource Han Rounded CN, Resource Han Rounded CN-Regular;
          color: #b4b4b4;
        }
      }

      ::v-deep .pf-radio {
        margin-right: 43px;

        .text {
          margin-left: 10px;
          font-size: 13px;
          font-family: Resource Han Rounded CN, Resource Han Rounded CN-Regular;
          font-weight: 400;
          text-align: left;
          color: $text-primary;
        }
      }

      &:nth-child(odd) {
        background: rgba($box-color-shut, 0.15);
        background-color: #f7f7f7;
        border-top: 1px solid rgba($box-bg-gradient, 0.1);
        border-bottom: 1px solid rgba($box-bg-gradient, 0.1);
      }

      &:nth-child(even) {
        border-top: 1px solid rgba($text-primary, 0.2);

        border-bottom: 1px solid rgba($text-primary, 0.2);
      }
    }
  }
}
</style>
