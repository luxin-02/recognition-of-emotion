<template>
  <div class="info-warp">
    <p class="info_title">用户基础资料表</p>
    <div class="title-row">
      <div class="icon"></div>
      <span>基础资料</span>
    </div>
    <table class="bottom_20">
      <!-- <div >
        <div>
          <div class="title">用户姓名:</div>
          <div>
            <input placeholder="请输入" class="table_input" />
          </div>
        </div>
        <div>
          <div class="title">性别:</div>
          <div>
            <input placeholder="请输入" class="table_input" />
          </div>
        </div>
        <div>
          <div class="title">年龄:</div>
          <dvi>
            <input placeholder="请输入" class="table_input" />
          </dvi>
        </div>
      </div> -->

      <tr>
        <td class="title">用户姓名:</td>
        <td>
          <input
            v-model="userData.nickname"
            placeholder="请输入"
            class="table_input"
          />
        </td>
        <td class="title">性别:</td>
        <td>
          <input
            v-model="userData.sex"
            placeholder="请输入"
            class="table_input"
          />
        </td>
        <td class="title">年龄:</td>
        <td>
          <input
            v-model="userData.birthdate"
            placeholder="请输入"
            class="table_input"
          />
        </td>
      </tr>
      <tr>
        <td class="title">所在单位:</td>
        <td>
          <input
            v-model="userData.unit"
            placeholder="请输入"
            class="table_input"
          />
        </td>
        <td class="title">所在部门:</td>
        <td>
          <input
            v-model="userData.class_name"
            placeholder="请输入"
            class="table_input"
            disabled
          />
        </td>
        <td class="title">编号:</td>
        <td>
          <input
            v-model="userData.studentID"
            placeholder="请输入"
            class="table_input"
            disabled
          />
        </td>
      </tr>
      <tr>
        <td class="title">学制类型:</td>
        <td>
          <input
            v-model="userData.length_schooling"
            placeholder="请输入"
            class="table_input"
          />
        </td>
        <td class="title">当前年级:</td>
        <td colspan="3">
          <input
            v-model="userData.current_grade"
            placeholder="请输入"
            class="table_input"
          />
        </td>
      </tr>
    </table>
    <div class="title-row">
      <div class="icon"></div>
      <span>基础身份信息</span>
    </div>
    <table class="">
      <tr>
        <td class="title">身份证号:</td>
        <td>
          <input
            v-model="userData.sfz"
            placeholder="请输入"
            class="table_input"
          />
        </td>
        <td class="title">出生日期:</td>
        <td>
          <el-date-picker
            v-model="userData.date_of_birth"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
            :default-value="new Date()"
          >
          </el-date-picker>
        </td>
        <td class="title">联系方式:</td>
        <td>
          <input
            v-model="userData.phone"
            placeholder="请输入"
            class="table_input"
          />
        </td>
      </tr>
      <tr>
        <td class="title">籍贯:</td>
        <td>
          <input
            v-model="userData.native_place"
            placeholder="请输入"
            class="table_input"
          />
        </td>
        <td class="title">政治面貌:</td>
        <td>
          <el-select v-model="userData.politics_status" placeholder="请选择">
            <el-option
              v-for="item in zzmm"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
        <td class="title">民族:</td>
        <td>
          <input
            v-model="userData.nation"
            placeholder="请输入"
            class="table_input"
          />
        </td>
      </tr>
      <tr>
        <td class="title">婚姻状况:</td>
        <td>
          <el-select v-model="userData.family_status" placeholder="请选择">
            <el-option
              v-for="item in hyzk"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
        <td class="title">职业：</td>
        <td>
          <input
            v-model="userData.occupation"
            placeholder="请输入"
            class="table_input"
          />
        </td>

        <td class="title">兴趣爱好：</td>
        <td colspan="3">
          <input
            v-model="userData.hobbies"
            placeholder="请输入"
            class="table_input"
          />
        </td>
      </tr>
      <tr>
        <td class="title">详细住址:</td>
        <td colspan="5">
          <input
            v-model="userData.family_addr"
            placeholder="请输入"
            class="table_input"
          />
        </td>
      </tr>
    </table>
    <print ref="print" :userData="userData"></print>
  </div>
</template>

<script>
// import { marriageOptions, politicsOptions } from "@/utils/options";
import { getRecordDetails, setRecordDetails } from "@/server/api/record";
import { mapGetters } from "vuex";
import Print from "./print.vue";
import { exportWord } from "@/utils/export";
export default {
  name: "theUserBaseInfo",
  inject: ["parentDoms"],
  props: ["userId"],

  mounted() {
    // console.log(this.parentDoms.$refs.parentDom);
    this.getRecordDetails();
  },

  data() {
    return {
      userData: {
        nickname: "",
        sex: "",
        birthdate: "",
        unit: "",
        class_name: "",
        studentID: "",
        length_schooling: "",
        current_grade: "",
        sfz: "",
        date_of_birth: "",
        phone: "",
        native_place: "",
        politics_status: "",
        nation: "",
        family_status: "",
        occupation: "",
        hobbies: "",
        family_addr: "",
      },

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
      zzmm: [
        { value: "中共党员" },
        { value: "中共预备党员" },
        { value: "共青团员" },
        { value: "群众" },
        { value: "其他" },
      ],
    };
  },
  components: { Print },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    async getRecordDetails() {
      const { data } = await getRecordDetails({
        // uid: this.userInfo.id,
        uid: this.userId.id,
      });
      if (data.code == this.$global.successCode) {
        this.userData = { ...data.data };
        if (this.userData.date_of_birth == "") return;
        this.userData.date_of_birth = Number(data.data.date_of_birth) * 1000;
      }
    },
    async setRecordDetails() {
      this.userData.date_of_birth = Number(this.userData.date_of_birth) / 1000;
      let serveData = this.userData;
      delete serveData.class_name;
      const { data } = await setRecordDetails({
        // id: this.userInfo.id,
        id: this.userId.id,
        ...serveData,
      });
      if (data.code == this.$global.successCode) {
        this.$myMessage.success(data.msg);
      }
    },
    printFn() {
      this.$refs.print.print(this.userId.nickname + "的基础资料表");
    },
    replaceNullWithEmptyString(obj) {
      for (const key in obj) {
        if (obj[key] === null || obj[key] === undefined) {
          obj[key] = "";
        }
      }
    },
    async exportFn() {
      // this.replaceNullWithEmptyString(this.userData);
      let name = this.userId.nickname + "的基础资料表";
      if (this.userData.date_of_birth != "") {
        var date_of_birth = this.$formatDate(
          this.userData.date_of_birth,
          "yyyy-MM-dd"
        );
      }

      let docx = {
        name: name,
        ...this.userData,
        date_of_birth,
      };
      exportWord("/docxTemplate/基础资料.docx", docx, name, {
        // exportWord("/docxTemplate/DOCX.docx", data, {
      });
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

  table {
    border-radius: 5px;
    &.bottom_20 {
      margin-bottom: 20px;
    }

    td {
      width: 200px;
      background: rgba($box-bg-gradient, 0);
      border: 1px solid rgba($text-primary, 0.2);
      // border-radius: 0px 0px 4px 4px;
      font-size: 13px;
      font-family: Resource Han Rounded CN, Resource Han Rounded CN-Regular;
      font-weight: 400;
      text-align: left;
      color: $text-secondary;
      box-sizing: border-box;
      position: relative;

      &.title {
        width: 100px;
        height: 40px;
        color: $text-primary;
        padding-left: 14px;
        background: rgba($box-color-shut, 0.2);
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
}
</style>
