<template>
  <div class="index">
    <div class="module_title">
      <i>-----------</i>
      <img src="@/assets/img/front/specialist/1.png" alt="" />
      {{ $route.meta.title }}
      <i>-----------</i>
    </div>
    <div class="left">
      <img class="tx" :src="$ip + doctor.avatar" />
      <div class="name_wrap">
        <div class="name">{{ doctor.nickname }}</div>
        <div class="zx_num">
          {{ doctor.num }} <span style="font-size: 0.14rem">人咨询过</span>
        </div>
      </div>
      <div class="sex_age">
        <div>性别：{{ doctor.sex }}</div>
        <div>工龄：{{ doctor.position }}</div>
      </div>

      <div class="bq_wrap">
        <div>标签：</div>
        <div
          class="bq_img"
          v-for="item in doctor.consultant_tag"
          :key="item.id"
        >
          <el-popover
            popper-class="black small"
            placement="top"
            trigger="click"
            :content="item.title"
          >
            <img slot="reference" class="bq-img" :src="$ip + item.img_url" />
          </el-popover>
          <!-- <img :src="$ip + item.img_url" />
          <i>{{ item.title }}</i> -->
        </div>
      </div>

      <div class="jieshao">
        {{ doctor.remark }}
      </div>
    </div>

    <div class="line"></div>

    <div class="right">
      <div class="class_btn">
        <button
          :class="[subType == 'subscribe' ? 'active' : '']"
          @click="subType = 'subscribe'"
        >
          线下预约
        </button>
        <button
          :class="[subType == 'consult' ? 'active' : '']"
          @click="subType = 'consult'"
        >
          在线咨询
        </button>
      </div>
      <div class="row">
        <div class="label">预约用户：</div>
        <div class="box">{{ user.nickname }}({{ user.class_name }})</div>
      </div>
      <div class="row" v-if="subType == 'subscribe'">
        <div class="label">预约日期：</div>
        <div class="date box">
          <el-date-picker
            :picker-options="pickerOptions"
            v-model="details.activeDate"
            placeholder="选择日期"
            class="hidden"
          ></el-date-picker>
        </div>

        <div class="label">预约时间：</div>
        <div class="date box">
          <el-select
            :no-data-text="details.activeDate ? '已排满' : ''"
            v-model="details.time"
            placeholder="选择时间"
            class="hidden"
          >
            <el-option
              v-for="(item, i) in selectTimeList"
              :key="i"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </div>

        <div class="label">预约电话：</div>
        <div class="box date">
          <el-input
            placeholder="请输入内容"
            v-model="user.emergency_phone"
          ></el-input>
        </div>
      </div>
      <div class="row">
        <div class="label">问题类型：</div>
        <div class="sele_class">
          <el-select
            v-model="form.target"
            placeholder="选择类型"
            class="hidden"
          >
            <el-option
              v-for="(item, i) in selectClassList"
              :key="i"
              :value="item.value"
              :label="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="row" v-if="subType == 'subscribe'">
        <div class="label">咨询地址：</div>
        <input type="text" v-model="user.location" />
      </div>
      <div class="row" style="align-items: flex-start">
        <div class="label">问题说明：</div>
        <el-input
          type="textarea"
          :resize="'none'"
          class="textarea"
          v-model="form.problem"
        />
      </div>

      <button class="subBtn" @click="submit">
        <img src="@/assets/img/front/specialist/sub_icon.png" />
        {{ subType == "subscribe" ? "提交预约" : "在线咨询" }}
      </button>
    </div>
  </div>
</template>

<script>
import {
  reservationApiGetConsultantAdd,
  reservationApiGetConsultantDetails,
  reservationApiOnlinemsg,
} from "@/server/api/consult"
import { formatDate2 } from "@/utils/time"
export default {
  data() {
    return {
      subType: "subscribe",
      loading: {
        init: false,
        add: false,
      },
      user: {
        birthdate: "",
        // class_name: "",
        email: "",
        emergency_contact: "",
        emergency_phone: "",
        location: "",
        marital: "",
        marital_spt: "",
        nation: "",
        nickname: "",
        second_sex: "",
        sex: "",
        sex_spt: "",
      },
      doctor: {
        avatar: "",
        nickname: "",
        occupation: "",
        remark: "",
      },
      date: [],
      details: {
        activeDate: "",
        time: "",
      },
      form: {
        problem: "",
        target: "",
      },
      selectClassList: [
        {
          value: "情感",
        },
        {
          value: "家庭",
        },
      ],
    }
  },
  computed: {
    pickerOptions() {
      const that = this
      return {
        disabledDate(time) {
          const year = time.getFullYear()
          const month = time.getMonth() + 1
          const day = time.getDate()
          const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
            day < 10 ? "0" + day : day
          }`
          const today = new Date()
          time.setHours(17, today.getMinutes(), today.getSeconds())

          return (
            that.date.find((item) => item.work_day === formattedDate) ==
              undefined || time.getTime() < today.getTime()
          )
        },
      }
    },
    activeSelectObject() {
      if (!this.details.activeDate) {
        return null
      }

      let date = formatDate2(this.details.activeDate, "yyyy-MM-dd")

      const find = this.date.find((v) => {
        return date == v.work_day
      })

      console.log(find)
      return find ? find : null
    },
    selectTimeList() {
      if (!this.activeSelectObject) {
        return []
      }
      let am_start_time = parseInt(this.activeSelectObject.am_start_time)
      let am_end_time = parseInt(this.activeSelectObject.am_end_time)
      let pm_start_time = parseInt(this.activeSelectObject.pm_start_time)
      let pm_end_time = parseInt(this.activeSelectObject.pm_end_time)
      let selectHours = this.activeSelectObject.hours.split(",")
      let times = []
      for (let i = am_start_time; i <= am_end_time; i++) {
        times.push({
          label: `${i < 10 ? "0" + i : i}:00`,
          value: i,
        })
      }

      for (let i = pm_start_time; i <= pm_end_time; i++) {
        times.push({
          label: `${i < 10 ? "0" + i : i}:00`,
          value: i,
        })
      }

      function isTimePassed(time, hours) {
        const currentDate = new Date() // 获取当前日期和时间
        const currentTimestamp = currentDate.getTime() // 获取当前时间戳

        const targetDate = new Date(time) // 将传入的时间转换为Date对象
        targetDate.setHours(hours)

        const targetTimestamp = targetDate.getTime() // 获取传入时间的时间戳

        return targetTimestamp < currentTimestamp // 判断传入的时间是否已经过去
      }

      times = times.filter((v) => {
        let flag = !selectHours.some((h) => h == v.value)
        return flag && !isTimePassed(this.activeSelectObject.work_day, v.value)
      })

      return times
    },
  },
  async created() {
    this.loading.init = true
    const res = await reservationApiGetConsultantDetails({
      did: this.$route.query.uid,
    })

    if (res.data.code == this.$global.successCode) {
      this.user = res.data.data.user

      this.doctor = res.data.data.doctor

      this.date = res.data.data.date
    }
    this.loading.init = false
  },
  watch: {
    activeSelectObject() {
      this.details.time = ""
    },
  },
  methods: {
    async submit() {
      if (this.subType == "subscribe") {
        if (!this.activeSelectObject) {
          this.$myMessage({
            type: "font-error",
            message: "请选择预约日期！",
          })
          return
        }
        if (!this.details.time) {
          this.$myMessage({
            type: "font-error",
            message: "请选择预约时间！",
          })
          return
        }
        if (!this.user.emergency_phone) {
          this.$myMessage({
            type: "font-error",
            message: "请填写电话号码！",
          })
          return
        }
        if (!this.form.target) {
          this.$myMessage({
            type: "font-error",
            message: "请填写问题类型！",
          })
          return
        }
        if (!this.user.location) {
          this.$myMessage({
            type: "font-error",
            message: "请填写地址！",
          })
          return
        }
        if (!this.form.problem) {
          this.$myMessage({
            type: "font-error",
            message: "请填写问题说明！",
          })
          return
        }

        // try {
        //   this.loading.add = true;
        const res = await reservationApiGetConsultantAdd({
          user: this.user,
          ...this.form,
          r_hour: this.details.time,
          wid: this.activeSelectObject.id,
        })

        if (res.data.code == this.$global.successCode) {
          this.$myMessage({
            type: "font-success",
            message: "提交成功请等待咨询师回应！",
          })
          this.$router.go(-1)
          return
        }
        //   this.loading.add = false;
        // } catch (e) {
        //   this.loading.add = false;
        //   console.error(e);
        // } finally {
        // }
      } else {
        if (!this.form.target) {
          this.$myMessage({
            type: "font-error",
            message: "请填写问题类型！",
          })
          return
        }
        if (!this.form.problem) {
          this.$myMessage({
            type: "font-error",
            message: "请填写问题说明！",
          })
          return
        }

        const { data } = await reservationApiOnlinemsg({
          target: this.$route.query.uid,
          type: this.form.target,
          content: this.form.problem,
        })
        if (data.code == this.$global.successCode) {
          this.$myMessage({
            type: "font-success",
            message: data.msg,
          })
          this.$router.go(-1)
        }
      }
    },
  },
}
</script>

<style scoped lang="scss">
.index {
  width: 1500px;
  height: 840px;
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  background-image: url(@/assets/img/front/index/biankuang.png);
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: 190px 0 0 110px;
  display: flex;
  .module_title {
    position: absolute;
    top: 65px;
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
    width: 230px;
    height: 520px;
    margin-top: 20px;
    .tx {
      width: 200px;
      height: 180px;
    }
    .name_wrap {
      width: 230px;
      margin-top: 18px;
      display: flex;
      flex-wrap: wrap;
      .name {
        width: 140px;
        font-size: 25px;
        font-family: "ziyuanyuanti400W";
        color: #ffffff;
      }
      .zx_num {
        font-size: 17px;
        font-family: "ziyuanyuanti400W";
        color: #ffffff;
        opacity: 0.5;
      }
    }
    .sex_age {
      display: flex;
      font-size: 13px;
      color: #ffffff;
      font-family: "ziyuanyuanti400W";
      margin: 30px 0 15px 0;
      > div {
        &:nth-child(1) {
          margin-right: 90px;
        }
      }
    }
    .bq_wrap {
      font-size: 14px;
      font-family: "ziyuanyuanti400W";
      color: #ffffff;
      display: flex;
      align-items: center;
      > .bq_img {
        width: 26px;
        height: 26px;
        margin-right: 5px;
        display: inline-block;
        position: relative;
        &:hover {
          > i {
            opacity: 1;
          }
        }
        > img {
          width: 26px;
          height: 26px;
          border-radius: 4px;
        }
        > i {
          position: absolute;
          top: -45px;
          left: 50%;
          transform: translate(-50%);
          white-space: nowrap;
          font-size: 14px;
          line-height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.5s ease;
          color: #fff;
          background: #003e61;
          display: inline-block;
          border-radius: 10px;
          padding: 8px;
          border: 1px solid #00c6ff;
          box-sizing: border-box;
        }
        .bq-img {
          width: 26px;
          height: 26px;
          border-radius: 4px;
        }
      }
    }
    .jieshao {
      width: 230px;
      height: 180px;
      margin-top: 20px;
      opacity: 0.7;
      font-size: 13px;
      font-family: "ziyuanyuanti400W";
      color: #ffffff;
      line-height: 26px;
      overflow: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  .line {
    width: 1px;
    height: 443px;
    margin: 0 50px;
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
        border: 1px solid #00a6fc;
        &.active {
          background: #00a6fc;
        }
      }
    }
    .row {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      .label,
      .box {
        font-size: 20px;
        color: #ffffff;
        font-family: "ziyuanyuanti400W";
      }
      .date {
        margin-right: 30px;
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
      }

      .sele_class {
        ::v-deep .el-input {
          width: 250px;
          .el-input__inner {
            width: 250px;
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
      }

      > input {
        width: 830px;
        height: 40px;
        background: #001434;
        border: 1px solid #00c6ff;
        border-radius: 4px;
        color: #ffffff;
        font-size: 17px;
      }
      ::v-deep .el-textarea {
        width: 830px;
        height: 150px;
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
      bottom: 20px;
      left: 100px;
      > img {
        width: 23px;
        height: 18px;
      }
    }
  }
}
</style>
