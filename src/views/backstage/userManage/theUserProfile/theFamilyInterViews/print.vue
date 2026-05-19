<template>
  <print-box ref="print_box">
    <div class="info-warp">
      <p class="info_title">用户家庭访谈情况表</p>
      <div class="title-row">
        <div class="icon"></div>
        <span>经济及教育子女情况</span>
      </div>
      <div class="content_box">
        <div class="row">1.家庭经济状况（人均收入）：</div>
        <div class="row">
          <el-radio v-model="interview.income" label="低保收入"
            >低保收入</el-radio
          >
          <el-radio v-model="interview.income" label="2000元以下"
            >2000元以下</el-radio
          >
          <el-radio v-model="interview.income" label="2000-4000元"
            >2000-4000元</el-radio
          >
          <el-radio v-model="interview.income" label="4000-6000元"
            >4000-6000元</el-radio
          >
          <el-radio v-model="interview.income" label="6000元以上"
            >6000元以上</el-radio
          >
        </div>
        <div class="row">2.主要监护人：</div>
        <div class="row">
          <el-radio v-model="interview.guardian" label="父亲">父亲</el-radio>
          <el-radio v-model="interview.guardian" label="母亲">母亲</el-radio>
          <el-radio v-model="interview.guardian" label="其他">其他</el-radio>
        </div>

        <div class="row">3.对孩子的态度：</div>
        <div class="row">
          <el-radio v-model="interview.manner" label="理智型">理智型</el-radio>
          <el-radio v-model="interview.manner" label="严厉型">严厉型</el-radio>
          <el-radio v-model="interview.manner" label="溺爱型">溺爱型</el-radio>
          <el-radio v-model="interview.manner" label="放弃型">放弃型</el-radio>
        </div>

        <div class="row">4.主要负责教育孩子的人：</div>
        <div class="row">
          <el-radio v-model="interview.principal" label="父亲">父亲</el-radio>
          <el-radio v-model="interview.principal" label="母亲">母亲</el-radio>
          <el-radio v-model="interview.principal" label="爷爷奶奶"
            >爷爷奶奶</el-radio
          >
          <el-radio v-model="interview.principal" label="外公外婆"
            >外公外婆</el-radio
          >
          <el-radio v-model="interview.principal" label="其他监护人"
            >其他监护人</el-radio
          >
        </div>

        <div class="row">5.孩子接受教育的主要渠道：</div>
        <div class="row">
          <el-radio v-model="interview.channel" label="进入普校/幼儿园接受教育"
            >进入普校/幼儿园接受教育</el-radio
          >
          <el-radio
            v-model="interview.channel"
            label="送入特殊学校/幼儿园接受教育"
            >送入特殊学校/幼儿园接受教育</el-radio
          >
          <el-radio v-model="interview.channel" label="外请家教"
            >外请家教</el-radio
          >
          <el-radio v-model="interview.channel" label="家人教育"
            >家人教育</el-radio
          >
          <el-radio v-model="interview.channel" label="其他">其他</el-radio>
        </div>

        <div class="row">
          6.当孩子出现攻击行为时，通常用什么方法改变其行为和稳定情绪？
        </div>
        <div class="row">
          <textarea v-model="interview.input6"></textarea>
        </div>
        <div class="row">
          7.当孩子出现异常动作时，通常用什么方法改变其行为和稳定情绪？
        </div>
        <div class="row">
          <textarea v-model="interview.input7"></textarea>
        </div>
        <div class="row">
          8.当孩子出现注意力不集中时，通常用什么方法改变其行为和稳定情绪？
        </div>
        <div class="row">
          <textarea v-model="interview.input8"></textarea>
        </div>
        <div class="row">
          9.当孩子出现说谎，拿别人东西时，通常用什么方法改变其行为和稳定情绪？
        </div>
        <div class="row">
          <textarea v-model="interview.input9"></textarea>
        </div>

        <div class="row">10.平时用什么样的方法，夸奖孩子？</div>
        <div class="row">
          <textarea v-model="interview.input10"></textarea>
        </div>
      </div>

      <div class="title-row">
        <div class="icon"></div>
        <span>生活习惯与能力</span>
      </div>
      <table class="bottom_20">
        <tr>
          <td class="title">日常进食:</td>
          <td>
            <input class="table_input" v-model="interview.eat" />
          </td>
          <td class="title">起床穿衣:</td>
          <td>
            <input class="table_input" v-model="interview.clad" />
          </td>
          <td class="title">生活盥洗:</td>
          <td>
            <input class="table_input" v-model="interview.scrub" />
          </td>
        </tr>
        <tr>
          <td class="title">如厕:</td>
          <td>
            <input class="table_input" v-model="interview.wc" />
          </td>
          <td class="title">外出:</td>
          <td>
            <input class="table_input" v-model="interview.go_out" />
          </td>
          <td class="title">整理物品:</td>
          <td>
            <input class="table_input" v-model="interview.clear_up" />
          </td>
        </tr>
      </table>

      <div class="title-row">
        <div class="icon"></div>
        <span>居住环境</span>
      </div>
      <div class="content_box">
        <div class="row">1.居住环境：</div>
        <div class="row">
          <el-radio v-model="interview.dwell" label="商品房">商品房</el-radio>
          <el-radio v-model="interview.dwell" label="自建房">自建房</el-radio>
          <el-radio v-model="interview.dwell" label="别墅">别墅</el-radio>
          <el-radio v-model="interview.dwell" label="公寓">公寓</el-radio>
          <el-radio v-model="interview.dwell" label="租房住">租房住</el-radio>
        </div>

        <div class="row">2.居室大小：</div>
        <div class="row">
          <el-radio v-model="interview.House_size" label="一居室"
            >一居室</el-radio
          >
          <el-radio v-model="interview.House_size" label="两居室"
            >两居室</el-radio
          >
          <el-radio v-model="interview.House_size" label="三室及以上"
            >三室及以上</el-radio
          >
        </div>
        <div class="row">3.居室人数：</div>
        <div class="row">
          <el-radio v-model="interview.dwell_num" label="独居">独居</el-radio>
          <el-radio v-model="interview.dwell_num" label="2人">2人</el-radio>
          <el-radio v-model="interview.dwell_num" label="3人">3人</el-radio>
          <el-radio v-model="interview.dwell_num" label="3人以上"
            >3人以上</el-radio
          >
        </div>
        <div class="row">4.参加社区集体活动：</div>
        <div class="row">
          <el-radio v-model="interview.activity" label="经常参加"
            >经常参加</el-radio
          >
          <el-radio v-model="interview.activity" label="偶尔参加"
            >偶尔参加</el-radio
          >
          <el-radio v-model="interview.activity" label="不参加"
            >不参加</el-radio
          >
        </div>

        <div class="row">5.社区辅助支持程度：</div>
        <div class="row">
          <el-radio v-model="interview.help" label="很大">很大</el-radio>
          <el-radio v-model="interview.help" label="一般">一般</el-radio>
          <el-radio v-model="interview.help" label="很少">很少</el-radio>
          <el-radio v-model="interview.help" label="无">无</el-radio>
        </div>
        <div class="row">6.备注：</div>
        <div class="row">
          <textarea v-model="interview.descr"></textarea>
        </div>
      </div></div
  ></print-box>
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
  props: ["interview"],
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

  table {
    &.bottom_20 {
      margin-bottom: 20px;
    }

    td {
      width: 200px;
      background: #ffffff;
      border: 1px solid #e3e3e3;
      font-size: 13px;
      font-family: Resource Han Rounded CN, Resource Han Rounded CN-Regular;
      font-weight: 400;
      text-align: left;
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
