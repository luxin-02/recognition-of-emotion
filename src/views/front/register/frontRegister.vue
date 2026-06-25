<template>
  <div class="login">
    <div class="core_warp">
      <div class="retrieve_box">
        <div class="title_text">用户注册</div>
        <div class="form_box">
          <div class="user_form">
            输入账号 &nbsp;
            <input
              v-model="form.account"
              type="text"
              placeholder="你要注册的账号"
            />
            <!-- <img class="icon" src="@/assets/img/front/register/账号.png" /> -->
            <p>*字母、数字组成;长度5-16位</p>
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
            输入密码 &nbsp;
            <input
              v-model="form.pwd"
              type="text"
              placeholder="请设置你的密码"
            />
            <!-- <img class="icon" src="@/assets/img/front/register/密码.png" /> -->
            <p>*5-16个字符组成</p>
            <template v-if="form.pwd != ''">
              <img
                class="ifimg"
                v-if="isPwdIcon"
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
            输入姓名 &nbsp;
            <input
              v-model="form.username"
              type="text"
              placeholder="请输入姓名"
            />
            <!-- <img
              class="icon"
              style="width: 0.24rem; height: 0.18rem; margin-top: 0.03rem"
              src="@/assets/img/front/register/姓名.png"
            /> -->
            <p>*填写你的真实姓名</p>
          </div>

          <div class="user_form">
            选择部门 &nbsp;
            <el-cascader
              class="depCascader"
              v-model="depId"
              :options="depList"
              :emitPath="false"
              :show-all-levels="false"
              @change="selectChange"
              placeholder="请选择你所在的部门"
              :props="{
                value: 'id',
                label: 'class_name',
                emitPath: false,
                checkStrictly: true,
              }"
            ></el-cascader>
            <!-- <img
              class="icon"
              style="width: 0.2rem; height: 0.18rem"
              src="@/assets/img/front/register/部门.png"
            /> -->
            <p>*选择你的部门，方便管理员确认</p>
          </div>
        </div>
        <div class="agreement_box">
          <div class="agreement_check" @click="agreement = !agreement">
            <img v-if="agreement" src="@/assets/img/front/login/sele_yes.png" />
          </div>
          <p class="agreement_text" @click="dialog.show = true">
            我已阅读并同意本平台《
            <a href="javascript:;">用户协议</a> 》
          </p>
        </div>

        <button class="submit_btn" @click="submitBtn" v-loading="submitloading">
          提交注册
        </button>
      </div>

      <div class="btn_box">
        <button @click="$router.push('/login')"></button>
        <button></button>
        <button @click="$router.push('/retrievePassword')"></button>
      </div>
    </div>
    <AnimationPopup :show.sync="dialog.show">
      <div class="popup_body">
        <h1 class="title">用户协议</h1>
        <div class="content">
          <div class="box">
            <div class="titleText">
              <strong>{{ $store.getters.sysInfo.unit }}软件使用许可协议</strong>
            </div>
            <div style="text-indent: 2em">
              <strong>1.前言</strong>
            </div>
            <div style="text-indent: 2em">
              <strong>重要提示，请仔细阅读：</strong>
            </div>
            <div class="stemFrom">
              本协议是您与{{
                $store.getters.sysInfo.unit
              }}签定的软件使用许可协议。如果您已安装、复制、下载或以其他任何方式使用该软件，则视为已经接受本协议。如果您不接受本协议的全部或部分条款，您将无权使用本软件。请立即终止安装、拷贝或以其他方式使用该软件，删除您已经安装或保留的该软件的任何组件，并和{{
                $store.getters.sysInfo.unit
              }}联系退货退款事宜。如您对协议有任何疑问，可向客服咨询，客服电话：0731-82203243。
            </div>
            <div style="text-indent: 2em"><strong>2. 定义</strong></div>
            <div style="text-indent: 2em">
              软件：本协议中的“软件”是指由若干模块或功能组成的已经植入或即将植入{{
                $store.getters.sysInfo.unit
              }}指定产品内的信息处理程序或支持文件，其中支持文件具体包括软件的源代码、目标码以及相关软件中所包含的图片、照片、图标、动画、录音、录像、音乐、文字、代码的全部或一部分，还包括与许可软件或{{
                $store.getters.sysInfo.unit
              }}产品相关的所有描述其功能、特点、内容、质量、测试、用户手册、用户许可协议等纸质或电子版的资料、技术文档等（以下统称“软件产品”或“软件”）。
            </div>
            <div style="text-indent: 2em">
              您：本协议中的“您”是指取得{{
                $store.getters.sysInfo.unit
              }}合法许可使用本软件权利的个人或单个法人实体，法人实体包括公司、企业、机构、组织或单位等。
            </div>
            <div style="text-indent: 2em">
              试用期：本协议中的试用期是指用户在没有完成正式注册软件前，{{
                $store.getters.sysInfo.unit
              }}授权用户为评估本软件目的而在内部使用的特定期间，在没有特别说明的情况下，一般为自用户首次使用本软件之日起30日内。
            </div>
            <div style="text-indent: 2em"><strong>3.软件许可</strong></div>
            <div style="text-indent: 2em">
              在您遵守本协议内容的前提下，{{
                $store.getters.sysInfo.unit
              }}授予您的许可权利包括：
            </div>
            <div style="text-indent: 2em">3.1试用期许可</div>
            <div style="text-indent: 2em">
              在试用期间，您可以以评估本软件为目的而免费在{{
                $store.getters.sysInfo.unit
              }}生产的一台指定型号设备上安装本软件，并使用本软件提供的全部功能。
            </div>
            <div style="text-indent: 2em">3.2商用许可</div>
            <div style="text-indent: 2em">
              安装和使用权利：您可以以商用为目的在{{
                $store.getters.sysInfo.unit
              }}生产的一台指定型号设备上安装和使用本软件，使用本软件提供的全部功能。
            </div>
            <div style="text-indent: 2em">
              备份：您可以以存档为目的复制一份单一备份副本。除非本协议另有规定，否则您不得以其他任何目的、其他任何方式复制软件的副本，包括软件随附的印刷材料、电子文档。
            </div>
            <div style="text-indent: 2em"><strong>4.权利限制</strong></div>
            <div style="text-indent: 2em">
              4.1单一使用限制：您不得同时在一台以上的设备上进行安装使用本软件。
            </div>
            <div style="text-indent: 2em">
              4.2共享软件限制：您不得通过共享软件的全部或部分，在多台设备上使用软件的部分或全部功能。
            </div>
            <div style="text-indent: 2em">
              4.3软件分解限制：您不得通过分解软件在不同的设备上使用软件的不同功能或把软件的不同部分嵌入到其他软件系统。
            </div>
            <div style="text-indent: 2em">
              4.4软件完整性限制：您不得删除软件中的任何版权申明或提示，亦不得对软件中出现的任何商标或标识进行涂抹、修改或删除。
            </div>
            <div style="text-indent: 2em">
              4.5反向工程、反编译、反汇编限制：您不得对软件进行反向工程、反编译、反汇编，除非法律明确规定允许这些行为除外。
            </div>
            <div style="text-indent: 2em">
              4.6转让限制：未经{{
                $store.getters.sysInfo.unit
              }}的书面同意，您不得公开、转让、出租、出借、再许可、分发该软件的全部或任何部分或软件单一备份副本给第三方。
            </div>
            <div style="text-indent: 2em">
              4.7保密限制：未经{{
                $store.getters.sysInfo.unit
              }}书面同意，您不得将本软件的性能或其他任何评估、测试结果、技术秘密透露给任何第三方。
            </div>
            <div style="text-indent: 2em"><strong>5.权利保留</strong></div>
            <div style="text-indent: 2em">
              5.1{{
                $store.getters.sysInfo.unit
              }}依法保留未在本协议中明确授予给您的其他一切在法律上属于{{
                $store.getters.sysInfo.unit
              }}的权利。
            </div>
            <div style="text-indent: 2em">
              5.2本软件受著作权法、国际著作权条约和其他的知识产权法律或国际条约保护。根据本协议，在此仅许可您非独占性的、非排他性的一般许可使用该软件的权利，而不是出售或转让。
            </div>
            <div style="text-indent: 2em">
              5.3商标权：本协议不授予您{{
                $store.getters.sysInfo.unit
              }}或其供应商的任何商标或服务标志相关的任何权利。
            </div>
            <div style="text-indent: 2em">
              5.4本软件所涉及到的一切知识产权，包括但不限于专利权、著作权、商标权、商业秘密、技术秘密，均属于各自内容拥有者的财产，{{
                $store.getters.sysInfo.unit
              }}保留从其所拥有的知识产权获取利益的权利。不包含在软件中，但可以通过使用软件访问的内容，其一切的所有权和知识产权也分属于各自内容的拥有者，并可能受适用版权或其他知识产权法和条约的保护。
            </div>
            <div style="text-indent: 2em"><strong>6.技术支持</strong></div>
            <div style="text-indent: 2em">
              对于本软件在安装、使用过程中产生的任何疑问，您可以向{{
                $store.getters.sysInfo.unit
              }}提出并得到相应的技术支持，{{
                $store.getters.sysInfo.unit
              }}将及时给予解答或解决。
            </div>
            <div style="text-indent: 2em"><strong>7.升级版本</strong></div>
            <div style="text-indent: 2em">
              7.1本软件将来是否提供版本升级将由{{
                $store.getters.sysInfo.unit
              }}决定。
            </div>
                     
            <div style="text-indent: 2em">
              7.2升级版本的许可：如果该软件经{{
                $store.getters.sysInfo.unit
              }}同意升级，除非升级版本有替代的软件使用许可协议，否则升级版本仍应遵循本协议条款。
            </div>
                     
            <div style="text-indent: 2em">
              7.3如果本软件标明为升级版本，您必须遵守本协议。
            </div>
                     
            <div style="text-indent: 2em"><strong>8.有限担保</strong></div>
                     
            <div style="text-indent: 2em">
              8.1除{{
                $store.getters.sysInfo.unit
              }}明确保证的事项以外，对其他任何默示、适销性、特定用途不做任何默示或明示的保证，由此引起的风险由您自己承担。
            </div>
                     
            <div style="text-indent: 2em">
              8.2有关本软件的保证，将依照{{
                $store.getters.sysInfo.unit
              }}的软件产品标准保修政策规定。
            </div>
                     
            <div style="text-indent: 2em"><strong>9.有限责任</strong></div>
                     
            <div style="text-indent: 2em">
              9.1{{
                $store.getters.sysInfo.unit
              }}不对试用期间因使用本软件而产生的损失承担任何明示或暗示的责任。
            </div>
                     
            <div style="text-indent: 2em">
              9.2{{
                $store.getters.sysInfo.unit
              }}承担的所有责任以您购买该软件所支付的价款为限。
            </div>
                     
            <div style="text-indent: 2em">
              9.3对因意外事故、滥用、错误使用、擅自修改所引起的软件使用问题，{{
                $store.getters.sysInfo.unit
              }}不承担任何责任，也不做任何保证。
            </div>
                     
            <div style="text-indent: 2em">
              9.4对因使用软件引起的其他任何附带的、间接的或惩罚性的损失，包括但不限于商业利润的损失、贸易的中断、信息或数据的丢失，{{
                $store.getters.sysInfo.unit
              }}都不承担任何责任，即使{{
                $store.getters.sysInfo.unit
              }}已被告知存在此种损害的可能性也不例外。
            </div>
                     
            <div style="text-indent: 2em"><strong>10. 协议终止</strong></div>
                     
            <div style="text-indent: 2em">
              如果您没有遵守本协议的部分或全部条款，{{
                $store.getters.sysInfo.unit
              }}可以随时终止本协议。协议终止后，您必须立即停止使用该软件，删除已经复制、安装在设备上的软件所有内容及备份的副本，如果由于您违反了本协议的规定给{{
                $store.getters.sysInfo.unit
              }}造成损失，您将或应该对该损失承担赔偿责任。
            </div>
                     
            <div style="text-indent: 2em"><strong>11. 出口限制</strong></div>
                     
            <div style="text-indent: 2em">
              您应当遵守本软件所适用的国家出口/进口法律，以及依该国政府颁布的对最终用户、最终使用、目的地的限制。您不得在未先行获得必要的政府机关批准或许可的情况下，向任何依照该国法律限制出口的国家/地区直接或间接地出口或再出口本软件。该义务不因本协议终止而失效。
            </div>
                     
            <div style="text-indent: 2em"><strong>12. 适用法律</strong></div>
                     
            <div style="text-indent: 2em">
              本协议依照中华人民共和国法律解释，任何因本协议产生的或与之相关的争议，双方同意提交中国国际经济贸易仲裁委员会（CIETAC）仲裁，并根据提交仲裁时该委员会当时有效的仲裁规则在上海进行。仲裁裁决是终局的，对双方均有约束力。
            </div>
            <div style="text-indent: 2em"><strong>13. 其他</strong></div>
            <div style="text-indent: 2em">
              本协议中双方未约定的，由双方其他协议或另行协商约定。
            </div>
            <div style="text-indent: 2em">
              本协议的所有标题仅仅是为了醒目及阅读方便，本身并没有实际涵义，不能作为解释本协议涵义的依据。
            </div>
          </div>
        </div>
        <div class="button_warp">
          <div
            class="button"
            @click="
              () => {
                dialog.show = false
                agreement = false
              }
            "
          >
            取消
          </div>
          <div
            class="button"
            @click="
              () => {
                agreement = true
                dialog.show = false
              }
            "
          >
            同意
          </div>
        </div>
      </div>
    </AnimationPopup>
  </div>
</template>

<script>
import AnimationPopup from "@/components/front/AnimationPopup/AnimationPopup.vue"
import { mapGetters } from "vuex"
import { deptApiList } from "@/server/api/dept"
import { userBackApiSignin } from "@/server/api/user"
export default {
  components: { AnimationPopup },
  data() {
    return {
      submitloading: false,
      form: {
        username: "",
        dep: "",
        account: "",
        pwd: "",
        fsz: "",
        jg: "",
      },
      depId: "",
      depList: [],
      //用户协议
      agreement: false,
      dialog: {
        show: false,
      },
      deplist: [],
    }
  },
  computed: {
    ...mapGetters({ sysInfo: "system/sysInfo" }),
    isUsernameIcon() {
      let reg = new RegExp("^.{5,16}$")
      return reg.test(this.form.account)
    },
    isPwdIcon() {
      let reg = new RegExp("^.{5,16}$")
      return reg.test(this.form.pwd)
    },
  },

  created() {
    this.getdep()
  },
  methods: {
    save() {
      this.dialog.show = false
    },
    //提交
    async submitBtn() {
      if (this.form.account == "") {
        this.$myMessage({
          type: "font-error",
          message: "请输入账号!",
        })
        return
      }
      if (this.form.pwd == "") {
        this.$myMessage({
          type: "font-error",
          message: "请输入密码!",
        })
        return
      }
      if (this.form.username == "") {
        this.$myMessage({
          type: "font-error",
          message: "请输入姓名!",
        })
        return
      }
      if (this.form.dep == "") {
        this.$myMessage({
          type: "font-error",
          message: "请选择部门!",
        })
        return
      }
      if (!this.agreement) {
        this.$myMessage({
          type: "font-error",
          message: "请勾选用户协议!",
        })
        return
      }

      var reg = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{5,16}$/
      if (!reg.test(this.form.account)) {
        this.$myMessage({
          type: "font-error",
          message: "账号由5-16个字符由字母、数字组成 !",
        })
        return
      }
      if (this.form.pwd.length < 5) {
        this.$myMessage({
          type: "font-error",
          message: "请输入5-16个字符的密码 !",
        })
        return
      }
      try {
        this.submitloading = true
        const { data } = await userBackApiSignin({
          username: this.form.account,
          password: this.form.pwd,
          nickname: this.form.username,
          deptid: this.form.dep,
          sfz: this.form.sfz,
          native_place: this.form.jg,
        })
        if (data.code == this.$global.successCode) {
          this.$router.push("/login")
          this.$myMessage({
            type: "font-success",
            message: "注册成功！正在跳转登录页...",
          })
        }
      } catch (error) {
      } finally {
        this.submitloading = false
      }
    },
    selectChange(e) {
      this.form.dep = e
    },
    //获取部门
    async getdep() {
      const { data } = await deptApiList()
      if (data.code == this.$global.successCode) {
        // console.log(data.data);
        this.depList = data.data[0].children
      }
    },
  },
}
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
    padding: 100px 110px 0 110px;
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
        color: #fff;
        .form_title,
        .form_title_name,
        .form_title_dep {
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
          padding-left: 20px;
          color: #fff;

          background: #0e274e;
          border: 1px solid #00a6fc;
          border-radius: 4px;

          // &:focus {
          //   border: #00aeff 1px solid;
          // }
        }
        input::-webkit-input-placeholder {
          color: #c0c4cc;
          font-size: 14px;
        }

        .icon {
          width: 18px;
          height: 20px;
          position: absolute;
          left: 25px;
          top: 16px;
        }
        > p {
          font-size: 14px;
          font-family: "ziyuanyuanti400W";
          font-weight: 400;
          text-align: left;
          color: #ccc;
          margin: 0 0 25px 100px;
        }
        .ifimg {
          width: 18px;
          height: 18px;
          position: absolute;
          right: 30px;
          top: 16px;
        }
      }
      ::v-deep .el-select {
        width: 280px;
        height: 45px;
        .el-input__inner {
          height: 45px;
          background: #0e274e;
          font-size: 18px;
        }
      }

      ::v-deep .el-input__inner {
        font-size: 16px;
        padding-left: 20px;
        width: 300px;
        height: 50px;
        border: none;
        background: #0e274e;
        border: 1px solid #00a6fc;
        border-radius: 4px;
        color: #fff;
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

    .submit_btn {
      width: 220px;
      height: 50px;
      position: absolute;
      top: 500px;
      left: 50%;
      transform: translate(-50%);
      font-size: 18px;
      font-family: "ziyuanyuanti600W";
      color: #ffffff;

      background: #275BEF;
      border: 1px solid #fff;
      border-radius: 4px;
      box-shadow: 0px 0px 20px 0px #0078ff;
    }
    .agreement_box {
      display: flex;
      margin: 0px 0 0 80px;
      .agreement_check {
        width: 16px;
        height: 16px;
        margin: 5px 10px 0 0;
        background-image: url(@/assets/img/front/login/sele_no.png);
        background-size: 100% 100%;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
      }

      .agreement_text {
        font-size: 14px;
        font-family: "ziyuanyuanti400W";
        text-align: justifyLeft;
        color: #fff;
        a {
          color: #1391cf;
          text-decoration: none;
        }
      }
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

.popup_body {
  width: 1000px;
  height: 670px;
  // background: #ffffff;
  border-radius: 25px;
  padding: 10px;
  box-sizing: border-box;
  background-image: url(@/assets/img/front/register/bk.png);
  background-size: 100% 100%;

  &::-webkit-scrollbar-track {
    display: none;
  }

  .title {
    font-size: 22px;
    font-family: "ziyuanyuanti500W";
    font-weight: 500;
    text-align: center;
    color: #ffffff;
    line-height: 60px;
    letter-spacing: 0.45px;
    width: 100%;
    height: 60px;
    // background: #64c3fa;
    border-radius: 25px 25px 0 0;
    margin-top: 30px;
  }

  .content {
    font-size: 20px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: left;
    color: #fff;
    line-height: 30px;
    letter-spacing: 0.96px;
    overflow: scroll;
    margin: 0 auto;
    overflow-x: hidden;
    overflow-y: scroll;
    height: 380px;
    width: 850px;
    border-radius: 10px;
    margin-top: 20px;
    padding: 12px 0 12px 12px;
    box-sizing: content-box;

    .box {
      font-size: 16px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: left;
      color: #fff;

      > div:nth-last-child(1) {
        padding-bottom: 20px;
      }
    }
  }

  .button_warp {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    width: 100%;
    box-sizing: border-box;
    padding: 0 250px 0 250px;
    top: 30px;

    .button {
      width: 140px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-family: "ziyuanyuanti500W";
      text-align: center;
      color: #fff;
      border-radius: 15px;
      cursor: pointer;
      background: #ff9500;
      &:nth-child(2) {
        background: #1a71c2;
      }
    }
  }
}
</style>
