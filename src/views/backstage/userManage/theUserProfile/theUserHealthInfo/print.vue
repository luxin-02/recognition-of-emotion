<template>
  <print-box ref="print_box">
    <div class="info-warp">
      <p class="info_title">用户健康情况表</p>
      <div class="title-row">
        <div class="icon"></div>
        <span>基本健康情况</span>
      </div>
      <table class="bottom_20">
        <tr>
          <td class="title">发育状况：</td>
          <td>
            <input class="table_input" v-model="healthyCondition.growth" />
          </td>
          <td class="title">体重(kg)：</td>
          <td>
            <input class="table_input" v-model="healthyCondition.weight" />
          </td>
          <td class="title">身高(cm)：</td>
          <td>
            <input class="table_input" v-model="healthyCondition.height" />
          </td>
        </tr>
        <tr>
          <td class="title">身型评估：</td>
          <td>
            <input
              class="table_input"
              v-model="healthyCondition.height_assess"
            />
          </td>
          <td class="title">智力评估：</td>
          <td>
            <input class="table_input" v-model="healthyCondition.IQ_assess" />
          </td>
          <td class="title">听力：</td>
          <td>
            <input class="table_input" v-model="healthyCondition.hearing" />
          </td>
        </tr>
        <tr>
          <td class="title">左眼视力：</td>
          <td>
            <input v-model="healthyCondition.left_vision" class="table_input" />
          </td>
          <td class="title">右眼视力：</td>
          <td>
            <input
              v-model="healthyCondition.right_vision"
              class="table_input"
            />
          </td>
          <td class="title">辨色能力：</td>
          <td>
            <input
              v-model="healthyCondition.achromatopsia"
              class="table_input"
            />
          </td>
        </tr>
        <tr>
          <td class="title">语言能力：</td>
          <td>
            <input v-model="healthyCondition.language" class="table_input" />
          </td>
          <td class="title">注意力：</td>
          <td>
            <input v-model="healthyCondition.attention" class="table_input" />
          </td>
          <td class="title">遗传病史：</td>
          <td>
            <input
              v-model="healthyCondition.genetic_disease"
              class="table_input"
            />
          </td>
        </tr>
        <tr>
          <td class="title row-2">饮食习惯：</td>
          <td colspan="5">
            <div class="row">
              <div class="check_box" :key="i" v-for="(item, i) in eatOptions">
                <!-- <el-checkbox>{{ item.title }}</el-checkbox> -->
                <el-checkbox-group v-model="healthyCondition.dietary_habit">
                  <el-checkbox :label="item.title"></el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="other">
                <input
                  v-model="healthyCondition.dietary_else"
                  style="color: #333"
                  class="other_input left_-36 wid_217"
                />
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="title row-3">吸烟情况：</td>
          <td colspan="5">
            <div class="col">
              <div class="row">
                <div class="check_box">
                  <el-radio v-model="healthyCondition.smoke" label="不吸烟"
                    >不吸烟</el-radio
                  >
                </div>
              </div>
              <div class="row" style="margin-top: 0.1rem">
                <div class="check_box">
                  <el-radio v-model="healthyCondition.smoke" label="吸烟"
                    >吸烟</el-radio
                  >
                </div>
                <div class="other_input_row">
                  <div>日吸烟量：</div>
                  <input
                    v-model="healthyCondition.day_smoke_num"
                    class="other_input"
                    :disabled="healthyCondition.smoke != '吸烟'"
                  />
                  <div>支/天</div>
                </div>
                <div class="other_input_row">
                  <div>累计烟龄：</div>
                  <input
                    v-model="healthyCondition.smoke_year"
                    class="other_input"
                    :disabled="healthyCondition.smoke != '吸烟'"
                  />
                  <div>年</div>
                </div>
              </div>
              <div class="row">
                <div class="check_box">
                  <el-radio v-model="healthyCondition.smoke" label="已戒烟"
                    >已戒烟</el-radio
                  >
                </div>
                <div class="other_input_row">
                  <div>戒烟时长：</div>
                  <input
                    v-model="healthyCondition.quit_smoking"
                    class="other_input"
                    :disabled="healthyCondition.smoke != '已戒烟'"
                  />
                  <div>年</div>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="title row-4">饮酒情况</td>
          <td colspan="5">
            <div class="col">
              <div class="row">
                <div class="check_box">
                  <el-radio label="不饮酒" v-model="healthyCondition.drink"
                    >不饮酒</el-radio
                  >
                </div>
              </div>
              <div class="row" style="margin-top: 0.1rem">
                <div class="check_box">
                  <el-radio label="已戒酒" v-model="healthyCondition.drink"
                    >已戒酒</el-radio
                  >
                </div>
                <div class="other_input_row">
                  <div>戒酒时长：</div>
                  <input
                    class="other_input"
                    v-model="healthyCondition.giveUp_drink"
                  />
                  <div>年</div>
                </div>
              </div>
              <div class="row">
                <div class="check_box">
                  <el-radio label="饮酒" v-model="healthyCondition.drink"
                    >饮酒</el-radio
                  >
                </div>
                <div class="other_input_row">
                  <div>饮酒频率：</div>
                  <input
                    class="other_input"
                    v-model="healthyCondition.drink_frequency"
                  />
                  <div>次/年</div>
                </div>
                <div class="other_input_row">
                  <div>平均一次：</div>
                  <input
                    class="other_input"
                    v-model="healthyCondition.drink_howMany"
                  />
                  <div>两</div>
                </div>
              </div>
              <div class="row">
                <div class="check_box"></div>
                <div class="other_input_row">
                  <div>醉酒次数：</div>
                  <input
                    class="other_input"
                    v-model="healthyCondition.drunkenness"
                  />
                  <div>次/年</div>
                </div>
                <div class="other_input_row">
                  <div>累计酒龄：</div>
                  <input
                    class="other_input"
                    v-model="healthyCondition.drink_time"
                  />
                  <div>年</div>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="title">饮酒种类:</td>
          <td colspan="5">
            <div class="row">
              <div
                class="check_box right_0"
                v-for="(item, i) in wineTypeOptions"
                :key="i"
              >
                <el-checkbox-group v-model="healthyCondition.liquor_type">
                  <el-checkbox :label="item.title"></el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="other">
                <input
                  class="other_input left_-36"
                  v-model="healthyCondition.liquor_else"
                />
              </div>
            </div>
          </td>
        </tr>
      </table>
      <div class="title-row">
        <div class="icon"></div>
        <span>残疾情况</span>
      </div>
      <table class="bottom_20">
        <tr>
          <td class="title">是否残疾:</td>
          <td>
            <input class="table_input" v-model="healthyCondition.disability" />
          </td>
          <td class="title">残疾原因:</td>
          <td>
            <input class="table_input" v-model="healthyCondition.cj_cause" />
          </td>
          <td class="title">残疾分类:</td>
          <td>
            <input
              class="table_input"
              v-model="healthyCondition.disabilityType"
            />
          </td>
        </tr>
        <tr>
          <td class="title">残疾级别:</td>
          <td>
            <input
              class="table_input"
              v-model="healthyCondition.disabilityGrade"
            />
          </td>
          <td class="title">残疾证号:</td>
          <td colspan="3">
            <input
              class="table_input"
              v-model="healthyCondition.disabilityCard"
            />
          </td>
        </tr>
      </table>
      <div class="title-row">
        <div class="icon"></div>
        <span>近期健康状态评估</span>
      </div>
      <table class="bottom_20">
        <tr>
          <td class="title">健康程度:</td>
          <td>
            <input class="table_input" v-model="healthyCondition.health" />
          </td>
          <td class="title">医院诊断结果:</td>
          <td colspan="3">
            <input class="table_input" v-model="healthyCondition.diagnose" />
          </td>
        </tr>
        <tr>
          <td class="title">主要症状:</td>
          <td>
            <input class="table_input" v-model="healthyCondition.symptom" />
          </td>
          <td class="title">伴随症状:</td>
          <td colspan="3">
            <input
              class="table_input"
              v-model="healthyCondition.symptom_small"
            />
          </td>
        </tr>

        <tr>
          <td class="title">是否服药:</td>

          <td>
            <input
              class="table_input"
              v-model="healthyCondition.take_medicine"
            />
          </td>
          <td class="title">药物名称:</td>
          <td colspan="3">
            <input class="table_input" v-model="healthyCondition.drug_name" />
          </td>
        </tr>
        <tr>
          <td class="title">是否忌口:</td>
          <td>
            <input
              class="table_input"
              v-model="healthyCondition.be_on_a_diet"
            />
          </td>
          <td class="title">忌口食物:</td>
          <td>
            <input class="table_input" v-model="healthyCondition.Avoid_sw" />
          </td>
          <td class="title">忌服药物:</td>
          <td>
            <input class="table_input" v-model="healthyCondition.Avoid_yw" />
          </td>
        </tr>

        <tr>
          <td class="title">异常行为:</td>
          <td>
            <input class="table_input" v-model="healthyCondition.abnormal" />
          </td>
          <td class="title">特殊喜好:</td>
          <td>
            <input
              class="table_input"
              v-model="healthyCondition.special_like"
            />
          </td>
          <td class="title">特殊厌恶:</td>
          <td>
            <input class="table_input" v-model="healthyCondition.boring" />
          </td>
        </tr>
      </table>

      <div class="title-row">
        <div class="icon"></div>
        <span>健康状况问卷</span>
      </div>
      <div class="content_box">
        <div class="row">1.学生有无视觉障碍：</div>
        <div class="row">
          <el-radio v-model="healthyCondition.dysopia" label="有">有</el-radio>
          <el-radio v-model="healthyCondition.dysopia" label="无">无</el-radio>
        </div>
        <div class="row">2.学生有无听觉障碍：</div>
        <div class="row">
          <el-radio v-model="healthyCondition.hearing_disorder" label="有"
            >有</el-radio
          >
          <el-radio v-model="healthyCondition.hearing_disorder" label="无"
            >无</el-radio
          >
        </div>
        <div class="row">3.有无对正常的学习、生活造成消极影响的疾病？</div>
        <div class="row">
          <el-radio v-model="healthyCondition.passive" label="有">有</el-radio>
          <el-radio v-model="healthyCondition.passive" label="无">无</el-radio>
        </div>
        <div class="row">4.生活中的一般智力表现：</div>
        <div class="row">
          <!-- <pf-radio>正常</pf-radio>
        <pf-radio>智力偏差</pf-radio> -->

          <el-radio v-model="healthyCondition.intelligence" label="正常"
            >正常</el-radio
          >
          <el-radio v-model="healthyCondition.intelligence" label="智力偏差"
            >智力偏差</el-radio
          >
        </div>
        <div class="row">5.注意力水平：</div>
        <div class="row">
          <!-- <pf-radio>注意力正常集中</pf-radio>
        <pf-radio>不能长时间集中</pf-radio>
        <pf-radio>完全无法集中</pf-radio> -->

          <el-radio
            v-model="healthyCondition.attention_level"
            label="注意力正常集中"
            >注意力正常集中</el-radio
          >
          <el-radio
            v-model="healthyCondition.attention_level"
            label="不能长时间集中"
            >不能长时间集中</el-radio
          >
          <el-radio
            v-model="healthyCondition.attention_level"
            label="完全无法集中"
            >完全无法集中</el-radio
          >
        </div>

        <div class="row">6.言语表达水平：</div>
        <div class="row">
          <!-- <pf-radio>正常</pf-radio>
        <pf-radio>表达不清晰</pf-radio>
        <pf-radio>表达能力差</pf-radio>
        <pf-radio>表达能力非常差</pf-radio> -->

          <el-radio v-model="healthyCondition.language_level" label="正常"
            >正常</el-radio
          >
          <el-radio v-model="healthyCondition.language_level" label="表达不清晰"
            >表达不清晰</el-radio
          >
          <el-radio v-model="healthyCondition.language_level" label="表达能力差"
            >表达能力差</el-radio
          >
          <el-radio
            v-model="healthyCondition.language_level"
            label="表达能力非常差"
            >表达能力非常差</el-radio
          >
        </div>

        <div class="row">7.适应性行为：</div>
        <div class="row">
          <!-- <pf-radio>适应性很强</pf-radio>
        <pf-radio>适应性一般</pf-radio>
        <pf-radio>适应能力较差</pf-radio>
        <pf-radio>适应能力极差</pf-radio> -->

          <el-radio v-model="healthyCondition.adaptation" label="适应性很强"
            >适应性很强</el-radio
          >
          <el-radio v-model="healthyCondition.adaptation" label="适应性一般"
            >适应性一般</el-radio
          >
          <el-radio v-model="healthyCondition.adaptation" label="适应能力较差"
            >适应能力较差</el-radio
          >
          <el-radio v-model="healthyCondition.adaptation" label="适应能力极差"
            >适应能力极差</el-radio
          >
        </div>
        <div class="row">8.社会交往能力：</div>
        <div class="row">
          <!-- <pf-radio>正常</pf-radio>
        <pf-radio>社交达人</pf-radio>
        <pf-radio>表达能力较差</pf-radio>
        <pf-radio>表达能力非常强</pf-radio> -->
          <el-radio v-model="healthyCondition.sociability" label="正常"
            >正常</el-radio
          >
          <el-radio v-model="healthyCondition.sociability" label="社交达人"
            >社交达人</el-radio
          >
          <el-radio v-model="healthyCondition.sociability" label="表达能力较差"
            >表达能力较差</el-radio
          >
          <el-radio
            v-model="healthyCondition.sociability"
            label="表达能力非常强"
            >表达能力非常强</el-radio
          >
        </div>
        <div class="row">9.运动上的限制：</div>
        <div class="row">
          <textarea
            v-model="healthyCondition.motor_restriction"
            placeholder="请根据实际情况进行描述。"
          ></textarea>
        </div>

        <div class="row">10.心理发展现状：</div>
        <div class="row">
          <textarea
            v-model="healthyCondition.psychology"
            placeholder="请根据实际情况进行描述。"
          ></textarea>
        </div>

        <div class="row">11.情绪行为上的特别注意的事项：</div>
        <div class="row">
          <textarea
            v-model="healthyCondition.emotion_notice"
            placeholder="请根据实际情况进行描述。"
          ></textarea>
        </div>

        <div class="row">12.食物药物的禁忌，健康上需特别注意的事项：</div>
        <div class="row">
          <textarea
            v-model="healthyCondition.taboo"
            placeholder="请根据实际情况进行描述。"
          ></textarea>
        </div>

        <div class="row">
          13.有无过往病史，如果有请备注好过往病史，发病时间，服药情况：
        </div>
        <div class="row">
          <textarea
            v-model="healthyCondition.medical_history"
            placeholder="请根据实际情况进行描述。"
          ></textarea>
        </div>

        <div class="row">14.其它情况说明及备注：</div>
        <div class="row">
          <textarea
            v-model="healthyCondition.elseRemark"
            placeholder="请根据实际情况进行描述。"
          ></textarea>
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
import { eatOptions, wineTypeOptions } from "../data";
export default {
  name: "print",
  props: ["healthyCondition"],
  data() {
    return {
      eatOptions: { ...eatOptions },
      wineTypeOptions: { ...wineTypeOptions },
    };
  },
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
        color: #333;
        border-bottom: 1px solid #e2e2e2;
      }

      .other_input_row {
        display: flex;
        align-items: center;
        height: 38px;
        font-size: 13px;
        font-family: Resource Han Rounded CN, Resource Han Rounded CN-Regular;
        font-weight: 400;
        text-align: left;
        color: #333;
        margin-right: 49px;
      }

      .other {
        height: 38px;
        display: flex;
        align-items: center;
      }

      .check_box {
        padding-left: 12px;
        margin-right: 40px;
        line-height: 38px;

        color: #333;
        min-width: 100px;

        &.right_0 {
          margin-right: 0;
        }
        &:nth-of-type(7) {
          margin-right: 0;
        }

        ::v-deep {
          div.el-checkbox {
            > div {
              margin-right: 9px;
            }

            span {
              font-size: 13px;
              font-family: Resource Han Rounded CN,
                Resource Han Rounded CN-Regular;
              font-weight: 400;
              text-align: left;
              color: #333;
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
