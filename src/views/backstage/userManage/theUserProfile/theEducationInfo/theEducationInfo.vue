<template>
  <div class="info-warp">
    <p class="info_title">用户教育情况表</p>
    <div class="title-row">
      <div class="icon"></div>
      <span>目前教育情况概况</span>
    </div>
    <table class="bottom_20">
      <tr>
        <td class="title">学历程度:</td>
        <td>
          <input class="table_input" v-model="education.qualification" />
          <!-- <el-select v-model="education.qualification" placeholder="请选择">
            <el-option
              v-for="item in xlcd"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
        </td>

        <td class="title">就读状态:</td>
        <td>
          <input class="table_input" v-model="education.attend" />
          <!-- <el-select v-model="education.attend" placeholder="请选择">
            <el-option
              v-for="item in jdzt"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
        </td>
        <td class="title">是否住校:</td>
        <td>
          <input class="table_input" v-model="education.put_up" />
          <!-- <el-select v-model="education.put_up" placeholder="请选择">
            <el-option
              v-for="item in shiorfou"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
        </td>
      </tr>
      <tr>
        <td class="title">入学时间:</td>
        <td>
          <input class="table_input" v-model="education.entrance" />
          <!-- <el-date-picker
            v-model="education.entrance"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
          >
          </el-date-picker> -->
        </td>

        <td class="title">就读年级:</td>
        <td>
          <input class="table_input" v-model="education.Grade_enrolled" />
          <!-- <el-select v-model="education.Grade_enrolled" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
        </td>
        <td class="title">学期:</td>
        <td>
          <input class="table_input" v-model="education.semester" />
          <!-- <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
        </td>
      </tr>

      <tr>
        <td class="title">班主任:</td>
        <td>
          <input class="table_input" v-model="education.teacher" />
        </td>

        <td class="title">班主任电话:</td>
        <td>
          <input class="table_input" v-model="education.teacher_phone" />
        </td>
        <td class="title">家长电话:</td>
        <td>
          <input class="table_input" v-model="education.patriarch_phone" />
        </td>
      </tr>

      <tr>
        <td class="title">两免一补:</td>
        <td>
          <input class="table_input" v-model="education.qt1" />
        </td>

        <td class="title">安置类型:</td>
        <td colspan="3">
          <input class="table_input" v-model="education.qt2" />
        </td>
      </tr>
      <tr>
        <td class="title">备注信息:</td>
        <td colspan="5">
          <input class="table_input" v-model="education.qt3" />
        </td>
      </tr>
    </table>

    <div class="title-row">
      <div class="icon"></div>
      <span>小学教育经历</span>
    </div>
    <table class="bottom_20">
      <tr>
        <td class="title">学历程度:</td>
        <td>
          <input class="table_input" v-model="education.primary_school1" />
        </td>

        <td class="title">是否毕业:</td>
        <td>
          <input class="table_input" v-model="education.primary_school2" />
        </td>
        <td class="title">是否住校:</td>
        <td>
          <input class="table_input" v-model="education.primary_school3" />
        </td>
      </tr>
      <tr>
        <td class="title">开始时间:</td>
        <td>
          <input class="table_input" v-model="education.primary_school4" />
        </td>

        <td class="title">结束时间:</td>
        <td>
          <input class="table_input" v-model="education.primary_school5" />
        </td>
        <td class="title">有否获奖:</td>
        <td>
          <input class="table_input" v-model="education.primary_school6" />
        </td>
      </tr>
      <tr>
        <td class="title">获奖情况：</td>
        <td colspan="5">
          <input class="table_input" v-model="education.primary_school7" />
        </td>
      </tr>

      <tr>
        <td class="title">其它备注：</td>
        <td colspan="5">
          <input class="table_input" v-model="education.primary_school8" />
        </td>
      </tr>
    </table>

    <div class="title-row">
      <div class="icon"></div>
      <span>初中教育经历</span>
    </div>
    <table class="bottom_20">
      <tr>
        <td class="title">学历程度:</td>
        <td>
          <input class="table_input" v-model="education.middle_school1" />
        </td>

        <td class="title">是否毕业:</td>
        <td>
          <input class="table_input" v-model="education.middle_school2" />
        </td>
        <td class="title">是否住校:</td>
        <td>
          <input class="table_input" v-model="education.middle_school3" />
        </td>
      </tr>
      <tr>
        <td class="title">开始时间:</td>
        <td>
          <input class="table_input" v-model="education.middle_school4" />
        </td>

        <td class="title">结束时间:</td>
        <td>
          <input class="table_input" v-model="education.middle_school5" />
        </td>
        <td class="title">有否获奖:</td>
        <td>
          <input class="table_input" v-model="education.middle_school6" />
        </td>
      </tr>
      <tr>
        <td class="title">获奖情况：</td>
        <td colspan="5">
          <input class="table_input" v-model="education.middle_school7" />
        </td>
      </tr>

      <tr>
        <td class="title">其它备注：</td>
        <td colspan="5">
          <input class="table_input" v-model="education.middle_school8" />
        </td>
      </tr>
    </table>

    <div class="title-row">
      <div class="icon"></div>
      <span>高中教育经历</span>
    </div>

    <table class="bottom_20">
      <tr>
        <td class="title">学历程度:</td>
        <td>
          <input class="table_input" v-model="education.high_school1" />
        </td>

        <td class="title">是否毕业:</td>
        <td>
          <input class="table_input" v-model="education.high_school2" />
        </td>
        <td class="title">是否住校:</td>
        <td>
          <input class="table_input" v-model="education.high_school3" />
        </td>
      </tr>
      <tr>
        <td class="title">开始时间:</td>
        <td>
          <input class="table_input" v-model="education.high_school4" />
        </td>

        <td class="title">结束时间:</td>
        <td>
          <input class="table_input" v-model="education.high_school5" />
        </td>
        <td class="title">有否获奖:</td>
        <td>
          <input class="table_input" v-model="education.high_school6" />
        </td>
      </tr>
      <tr>
        <td class="title">获奖情况：</td>
        <td colspan="5">
          <input class="table_input" v-model="education.high_school7" />
        </td>
      </tr>
      <tr>
        <td class="title">其它备注：</td>
        <td colspan="5">
          <input class="table_input" v-model="education.high_school8" />
        </td>
      </tr>
    </table>

    <div class="title-row">
      <div class="icon"></div>
      <span>大学教育经历</span>
    </div>
    <table class="bottom_20">
      <tr>
        <td class="title">学历程度:</td>
        <td>
          <input class="table_input" v-model="education.university1" />
        </td>

        <td class="title">是否毕业:</td>
        <td>
          <input class="table_input" v-model="education.university2" />
        </td>
        <td class="title">是否住校:</td>
        <td>
          <input class="table_input" v-model="education.university3" />
        </td>
      </tr>
      <tr>
        <td class="title">开始时间:</td>
        <td>
          <input class="table_input" v-model="education.university4" />
        </td>

        <td class="title">结束时间:</td>
        <td>
          <input class="table_input" v-model="education.university5" />
        </td>
        <td class="title">有否获奖:</td>
        <td>
          <input class="table_input" v-model="education.university6" />
        </td>
      </tr>
      <tr>
        <td class="title">获奖情况：</td>
        <td colspan="5">
          <input class="table_input" v-model="education.university7" />
        </td>
      </tr>
      <tr>
        <td class="title">其它备注：</td>
        <td colspan="5">
          <input class="table_input" v-model="education.university8" />
        </td>
      </tr>
    </table>

    <div class="title-row">
      <div class="icon"></div>
      <span>其它教育经历</span>
    </div>
    <table class="">
      <tr>
        <td class="title">教育类型:</td>
        <td>
          <input class="table_input" v-model="education.else_experience1" />
        </td>

        <td class="title">是否毕业:</td>
        <td>
          <input class="table_input" v-model="education.else_experience2" />
        </td>
        <td class="title">是否住校:</td>
        <td>
          <input class="table_input" v-model="education.else_experience3" />
        </td>
      </tr>
      <tr>
        <td class="title">开始时间:</td>
        <td>
          <input class="table_input" v-model="education.else_experience4" />
        </td>

        <td class="title">结束时间:</td>
        <td>
          <input class="table_input" v-model="education.else_experience5" />
        </td>
        <td class="title">有否获奖:</td>
        <td>
          <input class="table_input" v-model="education.else_experience6" />
        </td>
      </tr>
      <tr>
        <td class="title">获奖情况：</td>
        <td colspan="5">
          <input class="table_input" v-model="education.else_experience7" />
        </td>
      </tr>

      <tr>
        <td class="title">其它备注：</td>
        <td colspan="5">
          <input class="table_input" v-model="education.else_experience8" />
        </td>
      </tr>
    </table>

    <!-- <div class="title-row">
      <div class="icon"></div>
      <span>其它教育经历</span>
    </div> -->
    <table style="margin-top: 0.2rem" v-for="(v, i) in addElse" :key="i">
      <tr>
        <td class="title">教育类型:</td>
        <td>
          <input class="table_input" v-model="v.else1" />
        </td>

        <td class="title">是否毕业:</td>
        <td>
          <input class="table_input" v-model="v.else2" />
        </td>
        <td class="title">是否住校:</td>
        <td>
          <input class="table_input" v-model="v.else3" />
        </td>
      </tr>
      <tr>
        <td class="title">开始时间:</td>
        <td>
          <input class="table_input" v-model="v.else4" />
        </td>

        <td class="title">结束时间:</td>
        <td>
          <input class="table_input" v-model="v.else5" />
        </td>
        <td class="title">有否获奖:</td>
        <td>
          <input class="table_input" v-model="v.else6" />
        </td>
      </tr>
      <tr>
        <td class="title">获奖情况：</td>
        <td colspan="5">
          <input class="table_input" v-model="v.else7" />
        </td>
      </tr>

      <tr>
        <td class="title">其它备注：</td>
        <td colspan="5">
          <input class="table_input" v-model="v.else8" />
        </td>
      </tr>
    </table>

    <table class="bottom_20" style="margin-top: 0.2rem; background: #f7f7f7">
      <tr>
        <td class="wid_450 border-right-none">
          <div class="button add right_align" @click="addUndergoFn">
            <img
              class="icon"
              src="@/assets/img/front/account/table_add_icon.png"
            />
            <span style="color: #333">在最后新增一行</span>
          </div>
        </td>
        <td class="wid_450 border-left-none">
          <div class="button" @click="addElse.pop()">
            <img
              class="icon"
              src="@/assets/img/front/account/table_remove_icon.png"
            />
            <span style="color: #333">删除最后一行</span>
          </div>
        </td>
      </tr>
    </table>

    <print ref="print" :education="education" :addElse="addElse"></print>
  </div>
</template>

<script>
import { getRecordDetails2, setRecordDetails } from "@/server/api/record";
import { mapGetters } from "vuex";
import Print from "./print.vue";
import { exportWord } from "@/utils/export";
export default {
  name: "theEducationInfo",
  props: ["userId"],
  data() {
    return {
      education: {
        qualification: "",
        attend: "",
        put_up: "",
        entrance: "",
        Grade_enrolled: "",
        semester: "",
        teacher: "",
        teacher_phone: "",
        patriarch_phone: "",
        qt1: "",
        qt2: "",
        qt3: "",
        primary_school1: "",
        primary_school2: "",
        primary_school3: "",
        primary_school4: "",
        primary_school5: "",
        primary_school6: "",
        primary_school7: "",
        primary_school8: "",
        middle_school1: "",
        middle_school2: "",
        middle_school3: "",
        middle_school4: "",
        middle_school5: "",
        middle_school6: "",
        middle_school7: "",
        middle_school8: "",
        high_school1: "",
        high_school2: "",
        high_school3: "",
        high_school4: "",
        high_school5: "",
        high_school6: "",
        high_school7: "",
        high_school8: "",
        university1: "",
        university2: "",
        university3: "",
        university4: "",
        university5: "",
        university6: "",
        university7: "",
        university8: "",
        else_experience1: "",
        else_experience2: "",
        else_experience3: "",
        else_experience4: "",
        else_experience5: "",
        else_experience6: "",
        else_experience7: "",
        else_experience8: "",
      },
      addElse: [],
      xlcd: [
        {
          value: "小学",
        },
        {
          value: "初中",
        },
        {
          value: "高中",
        },
        {
          value: "大专",
        },
        {
          value: "本科",
        },
        {
          value: "研究生",
        },
        {
          value: "硕士/博士",
        },
      ],
      jdzt: [
        {
          value: "就读",
        },
        {
          value: "毕业",
        },
        {
          value: "退学",
        },
        {
          value: "休学",
        },
        {
          value: "保留学籍",
        },
      ],
      shiorfou: [
        {
          value: "是",
        },
        {
          value: "否",
        },
      ],
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
        type_id: "3",
      });
      if (data.code == this.$global.successCode) {
        if (data.data) {
          this.detailsId = data.data.id;
          this.education = data.data.info;
          if (this.education.addElse) {
            // var Obj = JSON.parse(this.education.addElse);
            this.addElse = this.education.addElse;
          }
        }
        console.log(data.data);
      }
    },

    async setRecordDetails() {
      this.education.addElse = this.addElse;
      const jsonStr = JSON.stringify(this.education);
      var serveData = {
        // uid: this.userInfo.id,
        uid: this.userId.id,
        id: this.detailsId,
        type_id: "3",
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

    addUndergoFn() {
      this.addElse.push({
        else1: "",
        else2: "",
        else3: "",
        else4: "",
        else5: "",
        else6: "",
        else7: "",
        else8: "",
      });
    },

    printFn() {
      this.$refs.print.print(this.userId.nickname + "的教育情况表");
    },
    async exportFn() {
      let name = this.userId.nickname + "的教育情况表";
      let docx = {
        name: name,
        ...this.education,
        addElse: this.addElse,
      };
      exportWord("/docxTemplate/教育情况.docx", docx, name);
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
    width: 900px;
    //background: rgba($box-bg-gradient, .25);
    border: 1px solid rgba($text-primary, 0.2);
    border-radius: 0px 0px 4px 4px;
    margin-bottom: 22px;

    .row {
      width: 898px;
      min-height: 36px;
      font-size: 13px;
      font-family: Resource Han Rounded CN, Resource Han Rounded CN-Regular;
      font-weight: 400;
      text-align: left;
      color: $text-primary;
      box-sizing: border-box;
      display: flex;
      align-items: center;

      padding-left: 16px;
      line-height: 36px;

      textarea {
        height: 82px;
        box-sizing: border-box;
        padding: 15px;
        font-size: 13px;
        font-family: Resource Han Rounded CN, Resource Han Rounded CN-Regular;
        color: $text-primary;
        background-color: rgba($box-bg-gradient, 0);
        padding-left: 0;
        width: 100%;
        @include scroll(10px, rgba($color: $text-primary, $alpha: 0.3));
        overflow-y: auto;

        &::-webkit-input-placeholder {
          opacity: 0.5;
          font-size: 13px;
          font-family: Resource Han Rounded CN, Resource Han Rounded CN-Regular;
          color: $text-primary;
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
