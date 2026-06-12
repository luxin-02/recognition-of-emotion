<template>
  <print-box ref="print_box">
    <div class="info-warp">
      <p class="info_title">用户家庭情况表</p>
      <div class="title-row">
        <div class="icon"></div>
        <span>家庭背景概况</span>
      </div>
      <table class="table">
        <tr>
          <td class="title">家庭概况：</td>
          <td>
            <input class="table_input" v-model="familyMember.family" />
          </td>
          <td class="title">家庭人口数：</td>
          <td>
            <input class="table_input" v-model="familyMember.population" />
          </td>
          <td class="title no_warp">父母婚姻状况：</td>
          <td>
            <input type="text" v-model="familyMember.family_status" />
          </td>
        </tr>
        <tr>
          <td class="title no_warp">家庭经济实力：</td>
          <td>
            <input type="text" v-model="familyMember.economics" />
          </td>
          <td class="title no_warp">有无兄弟姐妹：</td>
          <td>
            <input type="text" v-model="familyMember.member_of_family" />
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
            <input
              type="text"
              v-model="familyMember.family_close_and_distant"
            />
          </td>
          <td class="title no_warp">与其他成员关系：</td>
          <td>
            <input
              type="text"
              v-model="familyMember.member_close_and_distant"
            />
          </td>
          <td class="title wid_190" style="width: 1.91rem">
            是否烈士或优抚对象子女：
          </td>
          <td class="wid_109">
            <input
              type="text"
              style="width: 0.1rem"
              v-model="familyMember.marty"
            />
          </td>
        </tr>
      </table>

      <div class="title-row">
        <div class="icon"></div>
        <span>家庭背景概况</span>
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
            <input type="text" v-model="item.coordinate" />
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
    </div>
  </print-box>
</template>

<script>
import PrintBox from "@/components/common/print/PrintBox.vue";
function generateCircleImage(color, width = 12, height = 12) {
  // 获取 canvas 元素和绘图上下文
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // 绘制圆形
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();

  // 将画布转换为base64编码的字符串
  return canvas.toDataURL("image/png");
}
export default {
  name: "print",
  props: ["familyMember", "memberList"],
  components: {
    PrintBox,
  },
  methods: {
    generateCircleImage,
    print(title) {
      this.$refs.print_box.printWord(title);
    },
  },
};
</script>

<style scoped lang="scss">
.info-warp {
  padding-top: 30px;
  padding-left: 120px;
  margin-bottom: 50px;

  .title-row {
    width: 899px;
    height: 40px;
    display: flex;
    align-items: center;
    background-color: #f7f7f7;
    border-top: 1px #e3e3e3 solid;
    border-right: 1px #e3e3e3 solid;
    border-left: 1px #e3e3e3 solid;

    .icon {
      width: 10px;
    }

    span {
      font-size: 13px;
      font-family: Resource Han Rounded CN, Resource Han Rounded CN-Regular;
      font-weight: 400;
      text-align: left;
      margin: 8px 0;
    }
  }

  .table {
    &.bottom_20 {
      margin-bottom: 20px;
    }

    td {
      width: 200px;
      background: #ffffff;
      border: 1px solid #e3e3e3;
      border-top: none !important;
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
        padding-left: 14px;
        color: #333333;
        background-color: #f7f7f7;

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
        border: 1px #e3e3e3 solid;
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
      border: 1px #e3e3e3 solid;
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
