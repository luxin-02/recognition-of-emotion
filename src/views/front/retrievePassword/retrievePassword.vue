<template>
  <div class="login">
    <div class="core_warp">
      <div class="retrieve_box">
        <div class="title_text">密码找回</div>
        <div class="form_box">
          <div class="user_form" style="margin-left: 0.32rem">
            输入账号 &nbsp;
            <input
              v-model="form.account"
              type="text"
              placeholder="请输入您的账号"
            />
            <!-- <img class="icon" src="@/assets/img/front/register/账号.png" /> -->
            <template v-if="form.account != ''">
              <img
                class="ifimg"
                v-if="isUsernameIcon"
                src="@/assets/img/front/login/正确.png"
              />
              <img
                class="ifimg"
                v-else
                src="@/assets/img/front/login/错误.png"
              />
            </template>
          </div>
          <div class="user_form">
            选择部门 &nbsp;
            <el-cascader
              v-model="depId"
              :options="depList"
              :emitPath="false"
              :show-all-levels="false"
              @change="selectChange"
              :props="{
                value: 'id',
                label: 'class_name',
                emitPath: false,
                checkStrictly: true,
              }"
            ></el-cascader>
            <!-- <img
              class="icon"
              style="height: 0.17rem; margin-top: 0.02rem"
              src="@/assets/img/front/register/部门.png"
            /> -->
          </div>
        </div>
        <div class="username">
          申诉原因 &nbsp;&nbsp;&nbsp;&nbsp;
          <el-input
            type="textarea"
            placeholder="输入申诉原因"
            v-model="form.reason"
            show-word-limit
          >
          </el-input>
          <!-- <img
            class="icon"
            src="@/assets/img/front/retrievePassword/原因.png"
          /> -->
        </div>
        <button class="submit_btn" v-loading="appealloading" @click="appealBtn">
          提交申诉
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { deptApiList } from "@/server/api/dept"
import { userBackApiAppeal } from "@/server/api/user"
export default {
  data() {
    return {
      appealloading: false,
      form: {
        reason: "",
        dep: "",
        account: "",
      },
      depList: [],
      depId: "",
    }
  },
  created() {
    this.getdep()
  },
  computed: {
    isUsernameIcon() {
      let reg = new RegExp("^.{5,16}$")
      return reg.test(this.form.account)
    },
  },
  methods: {
    //获取部门
    async getdep() {
      const { data } = await deptApiList()
      if (data.code == this.$global.successCode) {
        this.depList = data.data[0].children
      }
    },
    selectChange(e) {
      this.form.dep = e
    },
    async appealBtn() {
      if (this.form.account == "") {
        this.$myMessage({
          type: "font-error",
          message: "请输入账号 !",
        })
        return
      }

      if (this.form.dep == "") {
        this.$myMessage({
          type: "font-error",
          message: "请选择部门 !",
        })
        return
      }
      if (this.form.reason == "") {
        this.$myMessage({
          type: "font-error",
          message: "请输入原因 !",
        })
        return
      }
      this.appealloading = true
      try {
        const { data } = await userBackApiAppeal({
          username: this.form.account,
          deptid: this.form.dep,
          reason: this.form.reason,
        })
        if (data.code == this.$global.successCode) {
          this.$myMessage({
            type: "font-success",
            message: "提交成功,等待审核 !",
          })
          this.form.account = ""
          this.form.username = ""
          this.form.reason = ""
          this.depId = ""
        }
      } catch (error) {
      } finally {
        this.appealloading = false
      }
    },
  },
} //去掉字符串左右空格 params = trimStringProperties(params);
</script>

<style scoped lang="scss">
.login {
  position: fixed;
  width: 100%;
  height: 100%;
}

.core_warp {
  width: 1100px;
  height: 685px;
  background-image: url("@/assets/img/front/index/biankuang.png");
  background-size: 100% 100%;
  display: flex;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .retrieve_box {
    width: 1100px;
    height: 685px;
    padding: 100px 110px 0 80px;
    box-sizing: border-box;
    .title_text {
      font-size: 30px;
      font-family: "ziyuanyuanti600W";
      font-weight: 600;
      text-align: center;
      color: #fff;
      letter-spacing: 3px;
      margin-bottom: 80px;
    }
    .form_box {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .user_form {
        position: relative;
        margin-bottom: 30px;
        color: #fff;
        p {
          font-size: 16px;
          font-family: "ziyuanyuanti400W";
          text-align: justifyLeft;
          color: #fff;
          margin: 0 15px 0 0;
          > i {
            color: red;
            margin-right: 3px;
          }
        }
        input {
          width: 300px;
          height: 50px;
          font-size: 16px;
          box-sizing: border-box;
          padding-left: 30px;
          color: #fff;
          background: #0e274e;
          border: 1px solid #00a6fc;
          border-radius: 4px;
        }
        input::-webkit-input-placeholder {
          color: #c0c4cc;
        }
        .icon {
          width: 18px;
          height: 20px;
          position: absolute;
          left: 25px;
          top: 15px;
        }
        .ifimg {
          width: 18px;
          height: 18px;
          position: absolute;
          right: 30px;
          top: 16px;
        }
      }
      ::v-deep .el-input__inner {
        width: 300px;
        height: 50px;
        border: none;
        font-size: 16px;
        padding-left: 30px;
        color: #fff;
        background: #0e274e;
        border: 1px solid #00a6fc;
        border-radius: 4px;
      }

      ::v-deep .el-input {
        .el-input__icon {
          width: 20px;
        }
        .el-input__suffix {
          right: 20px;
          .el-input__suffix-inner {
            // background: #64c3fa;
            border-radius: 50%;
            color: #fff;
          }
        }
      }
    }
    .username {
      margin-left: 30px;
      position: relative;
      display: flex;
      color: #fff;
      p {
        font-size: 16px;
        font-family: "ziyuanyuanti400W";
        text-align: justifyLeft;
        color: #fff;
        margin: 0 15px 0 0;
        white-space: nowrap;

        > i {
          color: red;
          margin-right: 3px;
        }
      }
      ::v-deep .el-textarea__inner {
        height: 150px;
        font-size: 16px;
        border: none;
        color: #fff;
        text-indent: 20px;
        padding: 16px 5px 0 5px;
        background: #0e274e;
        border: 1px solid #00a6fc;
        border-radius: 4px;
      }

      .icon {
        width: 20px;
        height: 16px;
        position: absolute;
        left: 25px;
        top: 20px;
      }
    }
    .submit_btn {
      width: 250px;
      height: 50px;
      position: absolute;
      top: 500px;
      left: 50%;
      transform: translate(-50%);
      font-size: 18px;
      font-family: "ziyuanyuanti600W";
      color: #ffffff;
      background: #285bf0;
      border: 1px solid #fff;
      border-radius: 4px;
      box-shadow: 0px 0px 20px 0px #0078ff;
    }
  }
  .btn_box {
    position: absolute;
    top: 88px;
    right: 12px;
    width: 30px;
    > button {
      width: 30px;
      height: 45px;
      margin-bottom: 10px;
      background: #00000000;
    }
  }
}
</style>
