<template>
  <div class="pwd_wrap">
    <div class="row">软件设置详情如下：</div>
    <div class="row">
      <div class="row_text">账号信息： {{ userInfo.username }}</div>
    </div>
    <div class="row">
      <div class="col">
        <div>旧密码：</div>
        <div><input type="text" v-model="userData.old_pwd" /></div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div>新密码：</div>
        <div><input type="text" v-model="userData.new_pwd" /></div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div>确认新密码：</div>
        <div><input type="text" v-model="userData.new_pwd2" /></div>
      </div>
    </div>

    <div class="row">
      <button @click="save()">修改密码</button>
    </div>
  </div>
</template>

<script>
import { userPasswordFrontApiEdit, userBackApiLogout } from "@/server/api/user"
import { mapGetters } from "vuex"
export default {
  data() {
    return {
      userData: {
        old_pwd: "",
        new_pwd: "",
        new_pwd2: "",
      },
      listData: {
        class: [
          // {label: '测试1', value: 1},
          // {label: '测试2', value: 2},
        ],
      },
    }
  },
  computed: {
    ...mapGetters(["userInfo", "sysInfo"]),
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    save() {
      if (!this.userData.old_pwd.trim()) {
        this.$myMessage({
          type: "font-error",
          message: "请输入旧密码",
        })
        return
      }
      if (!this.userData.new_pwd.trim()) {
        this.$myMessage({
          type: "font-error",
          message: "请输入新密码",
        })
        return
      }
      if (this.userData.new_pwd.trim() != this.userData.new_pwd2.trim()) {
        this.$myMessage({
          type: "font-error",
          message: "两次密码不一致",
        })
        return
      }

      userPasswordFrontApiEdit({
        uid: this.userInfo.id,
        old_password: this.userData.old_pwd,
        new_password: this.userData.new_pwd,
      }).then(({ data }) => {
        if (data.code == this.$global.successCode) {
          this.$myMessage({
            type: "success",
            message: "密码修改成功，请重新登录",
          })
          userBackApiLogout()
          setTimeout(() => {
            localStorage.removeItem("loginform")
            this.$store.commit("SET_USER_INFO", null)
            this.$router.push("/login")
          }, 200)
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.pwd_wrap {
  width: 100%;
  height: 100%;
  .row {
    width: 85%;
    font-size: 18px;
    font-family: "ziyuanyuanti400W";
    font-weight: 400;
    text-align: left;
    color: #00b4ff;
    line-height: 70px;
    display: flex;
    align-items: center;
    > .col {
      > div {
        line-height: 40px;
        > input {
          width: 300px;
          height: 40px;
          background: #0e274e;
          border: 1px solid #00a6fc;
          box-sizing: border-box;
          border-radius: 6px;
          font-size: 15px;
          color: #fff;
          &::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }
    }
    > button {
      width: 120px;
      height: 40px;
      border: 1px solid #ffffff80;
      border-radius: 4px;
      font-size: 16px;
      font-family: "ziyuanyuanti500W";
      font-weight: 500;
      color: #ffffff;
      margin-top: 30px;
      &:nth-child(1) {
        background: #1a71c2;
        box-shadow: 0px 0px 10px 0px #0054ff;
      }
    }
  }
}
</style>
