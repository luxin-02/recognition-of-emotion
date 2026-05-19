<template>
  <div class="index">
    <div class="module_title">
      <i>-----------</i>
      <img src="@/assets/img/front/specialist/1.png" alt="" />
      {{ $route.meta.title }}
      <i>-----------</i>
    </div>
    <div class="left" v-if="infoData.user">
      <div class="name">{{ infoData.user.nickname }}</div>
      <div class="row">
        性别：{{ infoData.user.sex }} &nbsp;&nbsp;&nbsp; 年龄：{{
          infoData.user.age
        }}
      </div>
      <div class="row">部门：{{ infoData.user.class_name }}</div>
      <div class="row">电话：{{ infoData.user.emergency_phone }}</div>
      <div class="row">
        问题类型：<i style="color: #00a6fc">{{ infoData.register.target }}</i>
      </div>
      <div class="row">
        预约时段:
        <div class="date">{{ infoData.register.work_day }}</div>
        <div class="date">{{ infoData.register.end_time }}</div>
      </div>
      <div class="row">咨询地址：</div>
      <div class="row">
        {{ infoData.user.location }}
      </div>
    </div>

    <div class="line"></div>

    <div class="right" v-if="infoData.register">
      <div class="class_btn">
        <button class="active">
          {{ $route.query.type == "hf" ? "预约回复" : "记录信息" }}
        </button>
      </div>
      <div class="row">
        <div class="label">问题说明：</div>
        <div class="wenti">
          {{ infoData.register.problem }}
        </div>
      </div>
      <template v-if="$route.query.type == 'jl'">
        <div class="row" style="align-items: center">
          <div class="label">赴约情况：</div>
          <el-select placeholder="请选择" class="hidden" v-model="appointment">
            <el-option
              v-for="(item, i) in fy"
              :key="i"
              :value="item.value"
              :label="item.value"
            ></el-option>
          </el-select>
          &nbsp; &nbsp; &nbsp; &nbsp;
          <div class="label">问题情况：</div>
          <el-select placeholder="请选择" class="hidden" v-model="situation">
            <el-option
              v-for="(item, i) in wt"
              :key="i"
              :value="item.value"
              :label="item.value"
            ></el-option>
          </el-select>
        </div>

        <div class="row">
          <div class="label">问题记录：</div>
          <el-input
            type="textarea"
            :resize="'none'"
            class="textarea"
            v-model="problemLog"
          />
        </div>

        <div class="row">
          <div class="label">治疗方案：</div>
          <el-input
            style="height: 1.4rem"
            type="textarea"
            :resize="'none'"
            class="textarea"
            v-model="therapeutic"
          />
        </div>
      </template>

      <div class="row" v-else>
        <div class="label">回复信息：</div>
        <el-input
          v-if="!infoData.register.reply"
          style="height: 1.4rem"
          type="textarea"
          :resize="'none'"
          class="textarea"
          v-model="hfData"
        />
        <el-input
          v-else
          style="height: 1.4rem"
          type="textarea"
          :resize="'none'"
          class="textarea"
          disabled
          v-model="infoData.register.reply"
        />
      </div>

      <button class="subBtn" v-if="$route.query.type == 'jl'" @click="saveBtn">
        <img src="@/assets/img/front/specialist/sub_icon.png" />
        保存记录
      </button>
      <button
        class="subBtn"
        @click="subBtn"
        v-if="
          $route.query.type != 'jl' &&
          !infoData.register.reply &&
          $store.getters.roleInfo.name == '心理咨询师'
        "
      >
        <img src="@/assets/img/front/specialist/sub_icon.png" />
        提交回复
      </button>
    </div>
  </div>
</template>

<script>
import {
  visitorApiGetDoctorInfo,
  visitorApiDoctorEdit,
  visitorApiDoctorSubmit,
} from "@/server/api/consult"
export default {
  data() {
    return {
      infoData: "",
      hfData: "",
      fy: [
        {
          value: "正常赴约",
        },
        {
          value: "未准时赴约",
        },
        {
          value: "未赴约",
        },
      ],
      wt: [
        {
          value: "已解决",
        },
        {
          value: "未解决",
        },
      ],

      problemLog: "", //问题记录
      therapeutic: "", //治疗方案
      appointment: "", //赴约情况
      situation: "", //问题情况
    }
  },
  async created() {
    console.log(this.$store.getters.roleInfo)

    const { data } = await visitorApiGetDoctorInfo({
      id: this.$route.query.id,
    })
    if (data.code == this.$global.successCode) {
      this.infoData = data.data

      this.problemLog = data.data.register.problem_log
      this.therapeutic = data.data.register.therapeutic
      this.appointment = data.data.register.appointment
      this.situation = data.data.register.situation
    }
  },
  methods: {
    async subBtn() {
      const { data } = await visitorApiDoctorEdit({
        id: this.$route.query.id,
        reply: this.hfData,
      })
      if (data.code == this.$global.successCode) {
        this.$myMessage({
          type: "font-success",
          message: data.msg,
        })
        this.$router.go(-1)
      }
    },
    async saveBtn() {
      const { data } = await visitorApiDoctorSubmit({
        id: this.$route.query.id,
        problem_log: this.problemLog, //问题记录,
        therapeutic: this.therapeutic, //治疗方案,
        appointment: this.appointment, //赴约情况,
        situation: this.situation, //问题情况,
      })
      if (data.code == this.$global.successCode) {
        this.$myMessage({
          type: "font-success",
          message: data.msg,
        })
        this.$router.go(-1)
      }
    },
  },
}
</script>

<style scoped lang="scss">
.index {
  width: 1500px;
  height: 750px;
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  background-image: url(@/assets/img/front/index/biankuang.png);
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: 150px 0 0 110px;
  display: flex;
  .module_title {
    position: absolute;
    top: 55px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px;
    font-family: "ziyuanyuanti500W";
    color: #fff;
    > img {
      width: 60px;
      height: 60px;
    }
    > i {
      font-size: 30px;
      font-weight: 400;
      font-family: "ziyuanyuanti400W";
      color: #aed6ffad;
      display: inline-block;
      margin: 0 10px;
    }
  }
  .left {
    width: 260px;
    height: 520px;
    margin-top: 20px;
    .name {
      font-size: 28px;
      font-family: "ziyuanyuanti400W";
      text-align: left;
      color: #ffffff;
      margin-bottom: 30px;
    }
    .row {
      font-size: 13px;
      font-family: "ziyuanyuanti400W";
      text-align: left;
      color: #ffffff;
      margin-bottom: 15px;
      .date {
        display: inline-block;
        width: 100px;
        height: 33px;
        border-radius: 5px;
        background-size: 100% 100%;
        text-align: center;
        line-height: 25px;
        &:nth-child(1) {
          background-image: url(@/assets/img/front/specialist/date_bg2.png);
        }
        &:nth-child(2) {
          background-image: url(@/assets/img/front/specialist/date_bg.png);
        }
      }
    }
  }

  .line {
    width: 1px;
    height: 443px;
    margin: 0 40px;
    background-image: url(@/assets/img/front/specialist/line.png);
    background-size: 100% 100%;
  }

  .right {
    width: 960px;
    height: 560px;
    position: relative;
    .class_btn {
      border-bottom: 1px #00a6fc solid;
      height: 60px;
      margin-bottom: 20px;
      > button {
        width: 140px;
        height: 45px;
        border-radius: 23px;
        background: #122440;
        color: #fff;
        font-size: 20px;
        font-family: "ziyuanyuanti400W";
        margin-right: 20px;
        &.active {
          background: #00a6fc;
        }
      }
    }
    .row {
      display: flex;
      margin-bottom: 20px;
      .label {
        font-size: 18px;
        color: #ffffff;
        font-family: "ziyuanyuanti400W";
      }
      .wenti {
        width: 800px;
        color: #fff;
        opacity: 0.7;
        font-size: 16px;
        color: #ffffff;
        font-family: "ziyuanyuanti400W";
        max-height: 250px;
        overflow: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
      }
      ::v-deep .el-input {
        width: 190px;
        .el-input__inner {
          width: 190px;
          background: #001434;
          border: 1px solid #00c6ff;
          color: #fff;
          font-size: 17px;
          ::placeholder {
            opacity: 0.5;
            font-size: 18px;
            color: #ffffff;
          }
        }
      }
      ::v-deep .el-textarea {
        width: 830px;
        height: 100px;
        border-radius: 6px;
        > textarea {
          width: 100%;
          height: 100%;
          background: #001434;
          border: 1px solid #00c6ff;
          color: #ffffff;
          font-size: 17px;
        }
      }
    }

    .subBtn {
      width: 220px;
      height: 45px;
      background: #00a6fc;
      border-radius: 23px;
      font-size: 20px;
      font-family: "ziyuanyuanti500W";
      color: #ffffff;
      letter-spacing: 1px;
      position: absolute;
      bottom: 60px;
      left: 150px;
      > img {
        width: 23px;
        height: 18px;
      }
    }
  }
}
</style>
