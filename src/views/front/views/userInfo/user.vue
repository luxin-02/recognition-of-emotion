<template>
  <div class="user_wrap">
    <div class="row">个人资料详情如下：</div>
    <div class="row">
      <div class="col" v-if="userInfo.depts">
        <p>账号信息： {{ userInfo.username }}</p>
        <p>所在部门： {{ userInfo.depts.length ? userInfo.depts[0].class_name : "无" }}</p>
      </div>
      <div class="col" style="display: flex; align-items: center">
        <img class="tx_ph" :src="userAvatar" />
        <el-upload
          class="uploader"
          action=""
          :show-file-list="false"
          :auto-upload="false"
          :on-change="headSculptureUpload"
        >
          <button>上传</button>
        </el-upload>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <p>姓名:</p>
        <input type="text" v-model="userInfo.nickname" placeholder="请输入" />
      </div>
      <div class="col">
        <p>出生日期:</p>
        <div class="date_of_birth">
          <user-info-date
            :picker-options="pickerOptions"
            placeholder="选择生日"
            v-model="userInfo.date_of_birth"
          ></user-info-date>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <p>编号:</p>
        <input type="text" class="ipt" disabled v-model="userInfo.studentID" />
      </div>

      <div class="col">
        <p>性别:</p>
        <div class="sex">
          <DropDownVue
            item-value="value"
            label="value"
            v-model="userInfo.sex"
            :options="sex"
          />
        </div>
      </div>
    </div>

    <div class="row">
      <button class="save" @click="sub">保存设置</button>
    </div>
  </div>
</template>

<script>
import { fileApiImage } from "@/server/api/file"
import { userBackApiDetails, userNormalerBackApiEdit } from "@/server/api/user"
import userInfoDate from "@/components/front/userInfoDate.vue"
import DropDownVue from "@/components/front/DropDownVue.vue"
export default {
  data() {
    return {
      userInfo: {
        nickname: "",
        sex: "",
        date_of_birth: "",
        studentID: "",
        avatar: "",
        education: "",
        phone: "",
      },
      sex: [
        { key: "男", value: "男" },
        { key: "女", value: "女" },
      ],
      pickerOptions: {
        disabledDate(time) {
          // 获取当前日期
          const today = new Date()
          // 如果输入的日期大于当前日期，则返回true，否则返回false
          return time.getTime() > today.getTime()
        },
      },
    }
  },
  components: { userInfoDate, DropDownVue },
  computed: {
    userAvatar() {
      if (/^data:/.test(this.userInfo.avatar)) {
        return this.userInfo.avatar
      }
      if (this.userInfo.avatar) {
        return this.$ip + this.userInfo.avatar
      }
      return this.$store.getters.userAvatar
    },
  },
  watch: {},
  methods: {
    async headSculptureUpload(file) {
      const isJPG = file.raw.type === "image/jpeg"
      const isPNG = file.raw.type === "image/png"
      //const isLt2M = file.raw.size / 1024 / 1024 < 2;
      if (!isPNG && !isJPG) {
        this.$myMessage.error("上传图片只能是 JPG/PNG 格式!")
        return
      }
      try {
        const cuttingFile = await this.$imgCutting.asyncShowByFile(
          file.raw,
          80,
          80,
        )
        console.log(cuttingFile)
        // 创建FileReader对象
        const reader = new FileReader()
        // 读取文件内容
        reader.readAsDataURL(cuttingFile)
        // 当文件读取完成时的回调函数
        reader.onload = () => {
          // 将文件内容转换为base64格式
          //console.log(reader.result);
          this.userInfo.avatar = reader.result
        }
        const res = await fileApiImage(cuttingFile)
        if (res.data.code == 200) {
          this.userInfo.avatar = res.data.data
        }
      } catch (e) {
        console.error(error)
      }
    },
    sub() {
      if (!this.userInfo.nickname.trim()) {
        this.$myMessage({
          type: "font-error",
          message: "用户名不能为空!",
        })
        return
      }
      if (!this.userInfo.avatar) {
        this.$myMessage({
          type: "font-error",
          message: "头像不能为空!",
        })
        return
      }
      if (!this.userInfo.sex) {
        this.$myMessage({
          type: "font-error",
          message: "性别不能为空!",
        })
        return
      }
      if (!this.userInfo.date_of_birth) {
        this.$myMessage({
          type: "font-error",
          message: "出生日期不能为空!",
        })
        return
      }
    
      userNormalerBackApiEdit({
        uid: this.$store.getters.userInfo.id,
        nickname: this.userInfo.nickname,
        date_of_birth: this.userInfo.date_of_birth / 1000,
        sex: this.userInfo.sex,
        studentID: this.userInfo.studentID,
        avatar: this.userInfo.avatar,
        education: this.userInfo.education,
        phone: this.userInfo.phone,
      }).then(({ data }) => {
        if (data.code == this.$global.successCode) {
          this.$myMessage({
            type: "font-success",
            message: data.msg,
          })
          this.getUserData()
        }
      })
    },
    async getUserData() {
      userBackApiDetails({
        uid: this.$store.getters.userInfo.id,
      }).then(({ data }) => {
        if (data.code == this.$global.successCode) {
          this.userInfo = data.data
          this.userInfo.date_of_birth = new Date(data.data.date_of_birth * 1000)
          console.log(this.userInfo);
          this.$store.commit("UPDATE_USER_INFO", data.data)
        }
      })
    },
  },
  mounted() {},
  created() {
    this.getUserData()
  },
  beforeDestroy() {},
}
</script>

<style scoped lang="scss">
.user_wrap {
  width: 100%;
  height: 100%;
  .row {
    width: 85%;
    font-size: 18px;
    font-family: "ziyuanyuanti400W";
    font-weight: 400;
    text-align: left;
    color: #00b4ff;
    line-height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .col {
      // margin-right: 100px;
      > .tx_ph {
        width: 80px;
        height: 80px;
        border: 1px solid #fff;
        border-radius: 10px;
        margin-right: 20px;
      }
      > .uploader {
        width: 100px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        button {
          font-family: "ziyuanyuanti400W";
          color: #ffffff;
          width: 100px;
          height: 70px;
          font-size: 16px;
          background: none;
          background-image: url(@/assets/img/front/userInfo/active.png);
          background-size: 100% 100%;
        }
      }

      > input {
        width: 300px;
        height: 46px;
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
      .date_of_birth {
        margin-left: 10px;
        width: 300px;
        height: 46px;
      }
      .sex {
        width: 300px;
        height: 46px;
      }
    }

    .save {
      color: #fff;
      font-size: 18px;
      font-family: "ziyuanyuanti500W";
      margin-top: 50px;
      background: #00000000;
      width: 140px;
      height: 70px;
      background-image: url(@/assets/img/front/userInfo/active.png);
      background-size: 100% 100%;
    }
  }
}
</style>
