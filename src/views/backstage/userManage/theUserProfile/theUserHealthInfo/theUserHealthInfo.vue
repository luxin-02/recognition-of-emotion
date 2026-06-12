<template>
  <div class="info-warp" v-on:scroll="scroll">
    <p class="info_title">用户健康情况表</p>
    <div class="title-row" style="width: 9.01rem">
      <div class="icon"></div>
      <span>基本健康情况</span>
    </div>
    <table class="bottom_20" style="width: 9.01rem">
      <tr>
        <td class="title">发育状况：</td>
        <td>
          <el-select
            ref="selectRef1"
            v-model="healthyCondition.growth"
            placeholder="请选择"
          >
            <el-option
              v-for="item in growth"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
          <!-- <el-select
            v-model="healthyCondition.height_assess"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
          <input class="table_input" v-model="healthyCondition.height_assess" />
        </td>
        <td class="title">智力评估：</td>
        <td>
          <el-select
            ref="selectRef2"
            v-model="healthyCondition.IQ_assess"
            placeholder="请选择"
          >
            <el-option
              v-for="item in intelligence"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
        <td class="title">听力：</td>
        <td>
          <el-select
            ref="selectRef3"
            v-model="healthyCondition.hearing"
            placeholder="请选择"
          >
            <el-option
              v-for="item in zcjr"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td class="title">左眼视力：</td>
        <td>
          <input v-model="healthyCondition.left_vision" class="table_input" />
        </td>
        <td class="title">右眼视力：</td>
        <td>
          <input v-model="healthyCondition.right_vision" class="table_input" />
        </td>
        <td class="title">辨色能力：</td>
        <td>
          <el-select
            ref="selectRef4"
            v-model="healthyCondition.achromatopsia"
            placeholder="请选择"
          >
            <el-option
              v-for="item in zcjr"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td class="title">语言能力：</td>
        <td>
          <el-select
            ref="selectRef5"
            v-model="healthyCondition.language"
            placeholder="请选择"
          >
            <el-option
              v-for="item in zcjr"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
        <td class="title">注意力：</td>
        <td>
          <el-select
            ref="selectRef6"
            v-model="healthyCondition.attention"
            placeholder="请选择"
          >
            <el-option
              v-for="item in zcjr"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
            <div class="row">
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
            <div class="row">
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
              <!-- <el-checkbox @click.native="value = item" :value="item == value">
                {{ item.title }}
              </el-checkbox> -->
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
    <div class="title-row" style="width: 9.01rem">
      <div class="icon"></div>
      <span>残疾情况</span>
    </div>
    <table class="bottom_20" style="width: 9.01rem">
      <tr>
        <td class="title">是否残疾:</td>
        <td>
          <el-select
            ref="selectRef7"
            v-model="healthyCondition.disability"
            placeholder="请选择"
          >
            <el-option
              v-for="item in whether"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
        <td class="title">残疾原因:</td>
        <td>
          <!-- <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select> -->

          <input class="table_input" v-model="healthyCondition.cj_cause" />
        </td>
        <td class="title">残疾分类:</td>
        <td>
          <el-select
            ref="selectRef8"
            v-model="healthyCondition.disabilityType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in disabilityType"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td class="title">残疾级别:</td>
        <td>
          <el-select
            ref="selectRef9"
            v-model="healthyCondition.disabilityGrade"
            placeholder="请选择"
          >
            <el-option
              v-for="item in disabilityGrade"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
    <div class="title-row" style="width: 9.01rem">
      <div class="icon"></div>
      <span>近期健康状态评估</span>
    </div>
    <table class="bottom_20" style="width: 9.01rem">
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
          <input class="table_input" v-model="healthyCondition.symptom_small" />
        </td>
      </tr>

      <tr>
        <td class="title">是否服药:</td>

        <td>
          <el-select
            ref="selectRef10"
            v-model="healthyCondition.take_medicine"
            placeholder="请选择"
          >
            <el-option
              v-for="item in whether"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
        <td class="title">药物名称:</td>
        <td colspan="3">
          <!-- <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option> 
          </el-select> -->
          <input class="table_input" v-model="healthyCondition.drug_name" />
        </td>
      </tr>
      <tr>
        <td class="title">是否忌口:</td>
        <td>
          <el-select
            ref="selectRef11"
            v-model="healthyCondition.be_on_a_diet"
            placeholder="请选择"
          >
            <el-option
              v-for="item in whether"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
          <input class="table_input" v-model="healthyCondition.special_like" />
        </td>
        <td class="title">特殊厌恶:</td>
        <td>
          <input class="table_input" v-model="healthyCondition.boring" />
        </td>
      </tr>
    </table>

    <div class="title-row" style="width: 9.01rem">
      <div class="icon"></div>
      <span>健康状况问卷</span>
    </div>
    <div class="content_box">
      <div class="row">1.学生有无视觉障碍：</div>
      <div class="row">
        <!-- <pf-radio>有</pf-radio>
        <pf-radio>无</pf-radio> -->
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
        <el-radio v-model="healthyCondition.sociability" label="表达能力非常强"
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

    <print ref="print" :healthyCondition="healthyCondition"></print>
  </div>
</template>

<script>
import { eatOptions, wineTypeOptions } from "../data";
import { getRecordDetails2, setRecordDetails } from "@/server/api/record";
import { mapGetters } from "vuex";
import Print from "./print.vue";
import { exportWord } from "@/utils/export";
export default {
  name: "theUserHealthInfo",
  props: ["userId"],
  data() {
    return {
      eatOptions: { ...eatOptions },
      wineTypeOptions: { ...wineTypeOptions },
      healthyCondition: {
        dietary_habit: [],
        liquor_type: [],
        growth: "",
        weight: "",
        height: "",
        height_assess: "",
        IQ_assess: "",
        hearing: "",
        left_vision: "",
        right_vision: "",
        achromatopsia: "",
        language: "",
        attention: "",
        genetic_disease: "",
        dietary_else: "",
        smoke: "",
        day_smoke_num: "",
        smoke_year: "",
        quit_smoking: "",
        drink: "",
        giveUp_drink: "",
        drink_frequency: "",
        drink_howMany: "",
        drunkenness: "",
        drink_time: "",
        liquor_else: "",
        disability: "",
        cj_cause: "",
        disabilityType: "",
        disabilityGrade: "",
        disabilityCard: "",
        health: "",
        diagnose: "",
        symptom: "",
        symptom_small: "",
        take_medicine: "",
        drug_name: "",
        be_on_a_diet: "",
        Avoid_sw: "",
        Avoid_yw: "",
        abnormal: "",
        special_like: "",
        boring: "",
        dysopia: "",
        hearing_disorder: "",
        passive: "",
        intelligence: "",
        attention_level: "",
        language_level: "",
        adaptation: "",
        sociability: "",
        motor_restriction: "",
        psychology: "",
        emotion_notice: "",
        taboo: "",
        medical_history: "",
        elseRemark: "",
      },
      detailsId: "",
      whether: [
        {
          value: "是",
        },
        {
          value: "否",
        },
      ],

      disabilityType: [
        {
          value: "视力残疾",
        },
        {
          value: "听力残疾",
        },
        {
          value: "言语残疾",
        },
        {
          value: "智力残疾",
        },
        {
          value: "肢体残疾",
        },
        {
          value: "精神残疾",
        },
        {
          value: "多重残疾",
        },
      ],
      disabilityGrade: [
        {
          value: "一级",
        },
        {
          value: "二级",
        },
        {
          value: "三级",
        },
        {
          value: "四级",
        },
      ],
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      growth: [
        {
          value: "正常",
        },
        {
          value: "较快",
        },
        {
          value: "较慢",
        },
      ],
      intelligence: [
        {
          value: "正常",
        },
        {
          value: "较高",
        },
        {
          value: "较低",
        },
      ],
      zcjr: [
        {
          value: "正常",
        },
        {
          value: "较弱",
        },
      ],
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
        type_id: "2",
      });
      if (data.code == this.$global.successCode) {
        if (data.data) {
          this.healthyCondition = data.data.info;
          this.detailsId = data.data.id;
          console.log(data.data);
        }
        console.log(this.healthyCondition);
      }
    },
    async setRecordDetails() {
      const jsonStr = JSON.stringify(this.healthyCondition);
      var serveData = {
        // uid: this.userInfo.id,
        uid: this.userId.id,
        id: this.detailsId,
        type_id: "2",
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
      this.$refs.print.print(this.userId.nickname + "的健康情况表");
    },
    async exportFn() {
      let name = this.userId.nickname + "的健康情况表";
      let docx = {
        name: name,
        ...this.healthyCondition,
      };
      exportWord("/docxTemplate/健康情况.docx", docx, name);
    },
    scroll() {
      this.$refs.selectRef1.blur();
      this.$refs.selectRef2.blur();
      this.$refs.selectRef3.blur();
      this.$refs.selectRef4.blur();
      this.$refs.selectRef5.blur();
      this.$refs.selectRef6.blur();
      this.$refs.selectRef7.blur();
      this.$refs.selectRef8.blur();
      this.$refs.selectRef9.blur();
      this.$refs.selectRef10.blur();
      this.$refs.selectRef11.blur();
    },
  },
};
</script>

<style scoped lang="scss">
.info-warp {
  padding-top: 30px;
  padding-left: 50px;

  .title-row {
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
