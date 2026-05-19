<template>
  <div class="info-warp" v-on:scroll="scroll">
    <p class="info_title">用户家庭情况表</p>
    <div class="title-row">
      <div class="icon"></div>
      <span>家庭背景概况</span>
    </div>
    <table class="table">
      <tr>
        <td class="title">家庭概况：</td>
        <td>
          <el-select
            ref="selectRef1"
            v-model="familyMember.family"
            placeholder="请选择"
          >
            <el-option
              v-for="item in jtgk"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
        <td class="title">家庭人口数：</td>
        <td>
          <input class="table_input" v-model="familyMember.population" />
        </td>
        <td class="title no_warp">父母婚姻状况：</td>
        <td>
          <input type="text" v-model="familyMember.family_status" />
          <!-- <el-select v-model="familyMember.family_status" placeholder="请选择">
            <el-option
              v-for="item in hyzk"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
        </td>
      </tr>
      <tr>
        <td class="title no_warp">家庭经济实力：</td>
        <td>
          <el-select
            ref="selectRef2"
            v-model="familyMember.economics"
            placeholder="请选择"
          >
            <el-option
              v-for="item in jtjjsl"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
        <td class="title no_warp">有无兄弟姐妹：</td>
        <td>
          <input type="text" v-model="familyMember.member_of_family" />
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
        <td class="title">家中排行：</td>
        <td>
          <input type="text" v-model="familyMember.status_in_family" />
        </td>
      </tr>
    </table>
    <table class="bottom_20 table">
      <tr>
        <td class="title">与父母关系：</td>
        <td>
          <input type="text" v-model="familyMember.family_close_and_distant" />
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
        <td class="title no_warp">与其他成员关系：</td>
        <td>
          <input type="text" v-model="familyMember.member_close_and_distant" />
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
        <td class="title wid_190" style="width: 1.91rem">
          是否烈士或优抚对象子女：
        </td>
        <td class="wid_109">
          <el-select
            ref="selectRef3"
            v-model="familyMember.marty"
            placeholder="请选择"
          >
            <el-option
              v-for="item in yesOrno"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
      </tr>
    </table>

    <div class="title-row">
      <div class="icon"></div>
      <span>家庭主要成员</span>
    </div>

    <table class="jiatin">
      <tr>
        <td style="width: 0.77rem">姓名：</td>
        <td style="width: 0.47rem">年龄</td>
        <td style="width: 0.77rem">亲属关系：</td>
        <td style="width: 1.57rem">职业：</td>
        <td style="width: 1.07rem">联系方式：</td>
        <td style="width: 0.77rem">收入：</td>
        <td style="width: 0.77rem">文化程度：</td>
        <td style="width: 1.5rem">健康/残疾状况</td>
        <td style="width: 1.04rem" class="no_warp">学校配合情况：</td>
      </tr>
      <tr class="rshu" v-for="(item, i) in memberList" :key="i">
        <td style="width: 0.77rem">
          <input type="text" v-model="item.name" />
        </td>
        <td style="width: 0.47rem">
          <input type="text" v-model="item.age" />
        </td>
        <td style="width: 0.77rem">
          <input type="text" v-model="item.kinship" />
        </td>
        <td style="width: 1.57rem">
          <input type="text" v-model="item.occupation" />
        </td>
        <td style="width: 1.07rem">
          <input type="text" v-model="item.phone" />
        </td>
        <td style="width: 0.77rem">
          <input type="text" v-model="item.income" />
        </td>
        <td style="width: 0.77rem">
          <input type="text" v-model="item.culture" />
        </td>
        <td style="width: 1.5rem">
          <input type="text" v-model="item.physical_condition" />
        </td>
        <td style="width: 1.04rem">
          <!-- <i class="el-icon-caret-bottom" @click="$refs.zzmmSelect.focus()"></i> -->
          <el-select
            ref="selectRef4"
            filterable
            v-model="item.coordinate"
            placeholder="请选择"
          >
            <el-option
              v-for="v in phqk"
              :key="v.value"
              :label="v.value"
              :value="v.value"
            >
            </el-option>
          </el-select>
        </td>
      </tr>
    </table>

    <table class="bottom_20 table">
      <tr>
        <td class="wid_450 border-right-none">
          <div class="button add right_align" @click="addMemberFn">
            <img
              class="icon"
              src="@/assets/img/front/account/table_add_icon.png"
            />
            <span>在最后新增一行</span>
          </div>
        </td>
        <td class="wid_450 border-left-none">
          <div class="button" @click="memberList.pop()">
            <img
              class="icon"
              src="@/assets/img/front/account/table_remove_icon.png"
            />
            <span>删除最后一行</span>
          </div>
        </td>
      </tr>
    </table>

    <div class="title-row">
      <div class="icon"></div>
      <span>家庭关系问卷</span>
    </div>
    <div class="content_box">
      <div class="row">1.目前父母关系：</div>
      <div class="row">
        <el-radio v-model="familyMember.parental" label="很好">很好</el-radio>
        <el-radio v-model="familyMember.parental" label="一般">一般</el-radio>
        <el-radio v-model="familyMember.parental" label="矛盾较多"
          >矛盾较多</el-radio
        >
        <el-radio v-model="familyMember.parental" label="已离异"
          >已离异</el-radio
        >
      </div>

      <div class="row">2.家庭其他成员对本人的态度：</div>
      <div class="row">
        <el-radio v-model="familyMember.for_me_manner" label="关心帮助"
          >关心帮助</el-radio
        >
        <el-radio v-model="familyMember.for_me_manner" label="冷漠"
          >冷漠</el-radio
        >
        <el-radio v-model="familyMember.for_me_manner" label="看不起"
          >看不起</el-radio
        >
      </div>

      <div class="row">3.家长对学生的态度：</div>
      <div class="row">
        <el-radio v-model="familyMember.jz_for_xs_manner" label="尊重"
          >尊重</el-radio
        >
        <el-radio v-model="familyMember.jz_for_xs_manner" label="帮助"
          >帮助</el-radio
        >
        <el-radio v-model="familyMember.jz_for_xs_manner" label="打击"
          >打击</el-radio
        >

        <el-radio v-model="familyMember.jz_for_xs_manner" label="冷漠"
          >冷漠</el-radio
        >
        <el-radio v-model="familyMember.jz_for_xs_manner" label="歧视"
          >歧视</el-radio
        >
        <el-radio v-model="familyMember.jz_for_xs_manner" label="特别关心"
          >特别关心</el-radio
        >
        <el-radio v-model="familyMember.jz_for_xs_manner" label="放任不管"
          >放任不管</el-radio
        >
        <el-radio v-model="familyMember.jz_for_xs_manner" label="溺爱"
          >溺爱</el-radio
        >
      </div>

      <div class="row">4.当学生遭到冷漠，歧视，嘲讽时，家长的态度：</div>
      <div class="row">
        <textarea v-model="familyMember.Parent_to_student"></textarea>
      </div>
    </div>

    <div class="title-row">
      <div class="icon"></div>
      <span>日常家庭生活情况</span>
    </div>

    <div class="content_box">
      <div class="row">1.日常生活中对阅读的兴趣：</div>
      <div class="row">
        <el-radio v-model="familyMember.read" label="很喜欢">很喜欢</el-radio>
        <el-radio v-model="familyMember.read" label="一般">一般</el-radio>
        <el-radio v-model="familyMember.read" label="不喜欢">不喜欢</el-radio>
      </div>
      <div class="row">2.日常生活中最常接触到的阅读方式:：</div>
      <div class="row">
        <el-radio v-model="familyMember.contact_read" label="家长讲述，孩子听"
          >家长讲述，孩子听</el-radio
        >
        <el-radio v-model="familyMember.contact_read" label="家长指图，孩子讲"
          >家长指图，孩子讲</el-radio
        >
        <el-radio v-model="familyMember.contact_read" label="孩子自己读"
          >孩子自己读</el-radio
        >
        <el-radio v-model="familyMember.contact_read" label="其他方式"
          >其他方式</el-radio
        >
      </div>

      <div class="row">3.平时最爱吃的食物:</div>
      <div class="row">
        <textarea v-model="familyMember.love_to_eat"></textarea>
      </div>
      <div class="row">4.平时最喜欢的玩具:</div>
      <div class="row">
        <textarea v-model="familyMember.Favorite_toy"></textarea>
      </div>
      <div class="row">5.兴趣爱好:</div>
      <div class="row">
        <textarea v-model="familyMember.interest"></textarea>
      </div>
      <div class="row">6.最喜欢的图书:</div>
      <div class="row">
        <textarea v-model="familyMember.Favorite_book"></textarea>
      </div>
      <div class="row">7.最爱做的事情:</div>
      <div class="row">
        <textarea v-model="familyMember.labour_love"></textarea>
      </div>
      <div class="row">8.生活中最喜欢最依赖的人:</div>
      <div class="row">
        <textarea v-model="familyMember.dependant"></textarea>
      </div>
    </div>
    <print
      ref="print"
      :familyMember="familyMember"
      :memberList="memberList"
    ></print>
  </div>
</template>

<script>
import { userFamilyDetails, userRecordSave } from "@/server/api/user";
import { mapGetters } from "vuex";
import Print from "./print.vue";
import { exportWord } from "@/utils/export";
export default {
  name: "theFamilyInfo",
  props: ["userId"],
  data() {
    return {
      value: "",
      radio: "",

      hyzk: [
        {
          value: "已婚",
          label: "已婚",
        },
        {
          value: "未婚",
          label: "未婚",
        },
        {
          value: "离异",
          label: "离异",
        },
      ],
      jtgk: [
        {
          value: "原生家庭",
          label: "原生家庭",
        },
        {
          value: "重组家庭",
          label: "重组家庭",
        },
        {
          value: "单亲家庭",
          label: "单亲家庭",
        },
      ],
      jtjjsl: [
        {
          value: "困难",
          label: "困难",
        },
        {
          value: "一般",
          label: "一般",
        },
        {
          value: "良好",
          label: "良好",
        },
      ],
      phqk: [
        {
          value: "高度配合",
        },
        {
          value: "偶尔配合",
        },
        {
          value: "从不配合",
        },
      ],

      yesOrno: [
        {
          value: "是",
        },
        {
          value: "否",
        },
      ],

      familyMember: {
        family: "",
        population: "",
        family_status: "",
        economics: "",
        member_of_family: "",
        status_in_family: "",
        family_close_and_distant: "",
        member_close_and_distant: "",
        marty: "",
        parental: "",
        for_me_manner: "",
        jz_for_xs_manner: "",
        Parent_to_student: "",
        read: "",
        contact_read: "",
        love_to_eat: "",
        Favorite_toy: "",
        interest: "",
        Favorite_book: "",
        labour_love: "",
        dependant: "",
      },
      memberList: [],
      Iid: "",
    };
  },
  components: { Print },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  mounted() {
    this.getFamilyMember();
  },
  methods: {
    async getFamilyMember() {
      const { data } = await userFamilyDetails({
        // uid: this.userInfo.id,
        uid: this.userId.id,
        type_id: "5",
      });
      if (data.code == this.$global.successCode) {
        if (data.data != null) {
          this.familyMember = { ...data.data.info };
          this.Iid = data.data.id;
        }
        if (this.familyMember.memberList) {
          var Obj = JSON.parse(this.familyMember.memberList);
          this.memberList = Obj;
        }
      }
    },

    async setRecordDetails() {
      const jsonStr = JSON.stringify(this.memberList);
      this.familyMember.memberList = jsonStr;
      const { data } = await userRecordSave({
        // uid: this.userInfo.id,
        uid: this.userId.id,
        type_id: "5",
        familyMember: this.familyMember,
        i_id: this.Iid,
      });
      if (data.code == this.$global.successCode) {
        this.$myMessage.success(data.msg);
      }
    },
    addMemberFn() {
      this.memberList.push({
        name: "",
        age: "",
        kinship: "",
        occupation: "",
        phone: "",
        income: "",
        culture: "",
        physical_condition: "",
        coordinate: "",
      });
    },

    printFn() {
      this.$refs.print.print(this.userId.nickname + "的家庭情况表");
    },
    async exportFn() {
      let name = this.userId.nickname + "的家庭情况表";
      let docx = {
        name: name,
        ...this.familyMember,
        memberList: this.memberList,
      };
      exportWord("/docxTemplate/家庭情况.docx", docx, name);
    },
    scroll() {
      this.$refs.selectRef1.blur();
      this.$refs.selectRef2.blur();
      this.$refs.selectRef3.blur();
      if (this.$refs.selectRef4) {
        this.$refs.selectRef4.forEach((v, i) => {
          this.$refs.selectRef4[i].blur();
        });
      }
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
    // background: linear-gradient(
    //     0deg,
    //     rgba($box-bg-gradient, 0.2) 0%,
    //     rgba($box-bg-gradient, 0) 100%
    //   )
    //   $table-th-bg;
    // border: 1px solid $table-th-border;
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

  .table {
    width: 100%;
    &.bottom_20 {
      margin-bottom: 20px;
    }

    td {
      width: 200px;
      background: rgba($box-bg-gradient, 0);
      // border: 1px solid rgba($text-primary, 0.2);
      border-top: none !important;
      border-radius: 0px 0px 4px 4px;
      font-size: 13px;
      font-family: Resource Han Rounded CN, Resource Han Rounded CN-Regular;
      font-weight: 400;
      text-align: left;
      color: #333;
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

  .jiatin {
    tr {
      width: 900px;
    }
    .rshu {
      td {
        background-color: #fff;
        > input {
          width: 100%;
          padding: 0 5px;
          box-sizing: border-box;
          text-align: center;
        }
      }
    }
    td {
      text-align: center;
      height: 38px;
      font-size: 13px;
      background-color: #f7f7f7;
    }
  }

  .content_box {
    width: 100%;
    //background: rgba($box-bg-gradient, .25);
    // border: 1px solid rgba($text-primary, 0.2);
    border-left: 1px #e3e3e3 solid;
    border-right: 1px #e3e3e3 solid;
    border-bottom: 1px #e3e3e3 solid;
    border-radius: 0px 0px 4px 4px;
    margin-bottom: 22px;
    box-sizing: border-box;
    .row {
      width: 100%;
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
