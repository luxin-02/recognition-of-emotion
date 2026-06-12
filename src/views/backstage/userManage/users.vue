<template>
  <div class="class-box">
    <div class="tab">
      <div
        v-auth="'normaluserlist'"
        @click="tab = 1"
        :class="tab == 1 ? 'addClass' : ''"
      >
        普通用户列表
      </div>
      <div
        v-auth="'adminlist'"
        @click="tab = 2"
        :class="tab == 2 ? 'addClass' : ''"
      >
        管理员列表
      </div>
      <div
        v-auth="'consultantlist'"
        @click="tab = 3"
        :class="tab == 3 ? 'addClass' : ''"
      >
        咨询师列表
      </div>
    </div>

    <ordinaryUsers v-auth="'normaluserlist'" v-if="tab == 1"></ordinaryUsers>
    <administrators v-auth="'adminlist'" v-if="tab == 2"></administrators>
    <consultant v-auth="'consultantlist'" v-if="tab == 3"></consultant>
  </div>
</template>

<script>
import ordinaryUsers from "./usersViews/ordinaryUsers";
import administrators from "./usersViews/administrators";
import consultant from "./usersViews/consultant";

export default {
  data() {
    return {
      tab: 1,
    };
  },
  components: { ordinaryUsers, administrators, consultant },
  computed: {},

  watch: {
    allSelect(newAllSelect) {
      if (newAllSelect) {
        // 获取表格dom
        const tableDom = this.$refs.tableRef;
        // 全选功能
        this.tableConfig.tableData.forEach((item) => {
          tableDom.$children[0].toggleRowSelection(item, true);
        });
      } else {
        // 获取表格dom
        const tableDom = this.$refs.tableRef;
        // 全选功能
        tableDom.$children[0].clearSelection();
      }
    },
  },

  mounted() {
    if (this.$store.getters.userInfo.role == 4) {
      this.tab = 3;
    }
  },

  created() {
    this.$route.query.tab ? (this.tab = this.$route.query.tab) : "";
  },
};
</script>
<style lang="less" scoped>
.class-box {
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 24px;
  box-sizing: border-box;

  .tab {
    height: 60px;
    background: #eeeeee;
    padding: 5px 0 0 30px;
    box-sizing: border-box;
    display: flex;

    div {
      width: 200px;
      height: 55px;
      //background: #ffffff;
      //border-radius: 10px 10px 0px 0px;
      font-size: 16px;
      color: #333333;
      line-height: 55px;
      text-align: center;
      transition: all 0.3s;
    }

    .addClass {
      background: #ffffff;
      border-radius: 10px 10px 0px 0px;
    }
  }

  /deep/ .popup-mask {
    .content-box {
      display: flex;
      justify-content: center;
      align-items: center;

      .my-popup-box {
        width: 288px;
        color: #333333;
        line-height: 32px;
        text-align: center;
        font-size: 16px;

        span {
          color: #2e8ae6;
        }
      }
    }
  }

  /deep/ .edit {
    .dialog-box {
      width: 1000px;
      height: 680px;

      .content-box {
        height: 570px;
        border-top: 1px solid #dddddd;
        box-sizing: border-box;

        // padding: 35px 0 0 85px;
        .scroll {
          height: 570px;
          overflow-y: scroll;
          padding: 35px 0 30px 134px;
          box-sizing: border-box;

          span {
            display: block;
            font-size: 14px;
            color: #333333;
          }

          .title {
            font-size: 16px;
            color: #333333;
            display: flex;

            span {
              opacity: 0.5;

              font-size: 14px;
              margin-left: 15px;
            }
          }

          input {
            background: #ffffff;
            border: 1px solid #e6e6e6;
            border-radius: 4px;
            outline: none;
            font-size: 14px;
            color: #333333;
          }

          .register {
            margin-top: 28px;
            display: flex;
            align-items: center;

            > input {
              width: 300px;
              height: 38px;
              margin-left: 18px;
            }

            & > span:nth-of-type(2) {
              margin-left: 28px;
            }

            .paw {
              display: flex;
              align-items: center;
              margin-left: 19px;
              width: 300px;
              height: 38px;
              background: #ffffff;
              border: 1px solid #e6e6e6;
              border-radius: 4px;

              input {
                background: none;
                border: none;
                height: 100%;
                width: 239px;
              }

              button {
                width: 58px;
                height: 32px;
                background: #2e8ae6;
                border-radius: 4px;
                font-size: 14px;
                color: #ffffff;
              }
            }
          }

          .illustrate {
            opacity: 0.5;
            font-size: 14px;
            color: #333333;
            margin: 14px 0 39px 58px;
          }

          .name_age_sex {
            display: flex;
            align-items: center;
            margin-top: 28px;

            input {
              height: 38px;
              margin-left: 19px;

              &:nth-of-type(1) {
                width: 300px;
              }

              &:nth-of-type(2) {
                width: 110px;
              }

              &:nth-of-type(3) {
                width: 100px;
                margin-left: 15px;
              }
            }

            span:nth-of-type(2) {
              margin-left: 29px;
            }

            span:nth-of-type(3) {
              margin-left: 29px;
            }
          }

          .unit {
            display: flex;
            align-items: center;
            margin-top: 15px;

            input {
              width: 685px;
              height: 38px;
              margin-left: 20px;
            }
          }

          .depart {
            display: flex;
            align-items: center;
            margin-top: 15px;

            .class_sele {
              width: 490px;
              height: 38px;
              margin-left: 20px;

              .el-select {
                border: 1px solid #e6e6e6;
                border-radius: 4px;

                .el-input__inner {
                  background: #ffff;
                  border: none;
                }
              }
            }

            span:nth-of-type(2) {
              margin-left: 39px;
            }

            > input {
              width: 100px;
              height: 38px;
              margin-left: 15px;
            }
          }

          .phone_career {
            display: flex;
            align-items: center;
            margin-top: 15px;

            input {
              margin-left: 18px;
              width: 300px;
              height: 38px;
            }

            span:nth-of-type(2) {
              margin-left: 29px;
            }
          }

          .address {
            display: flex;
            // align-items: center;
            margin: 15px 0 29px 0;

            span {
              line-height: 30px;
            }

            textarea {
              width: 688px;
              height: 76px;
              background: #ffffff;
              border: 1px solid #e6e6e6;
              border-radius: 4px;
              margin-left: 20px;
            }
          }

          .face_fingerprint {
            display: flex;
            margin-top: 28px;

            > span {
              line-height: 30px;
            }

            > img,
            > .images {
              display: block;
              width: 90px;
              height: 90px;
              margin-left: 20px;

              .image-slot {
                border: 1px solid #e6e6e6;
                width: 90px;
                height: 90px;
                display: flex;
                justify-content: center;
                align-items: center;

                background-color: rgba(238, 238, 238, 0.5);

                i {
                  color: #d9d9d9;
                }
              }
            }

            .fingerprint_img {
              width: 90px;
              height: 90px;
              background: rgba(238, 238, 238, 0.5);
              border: 1px solid #e6e6e6;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: 20px;

              img {
                display: block;
                width: 40px;
                height: 47px;
                opacity: 0.7;
              }
            }

            .face_fingerprint_btn {
              margin-left: 15px;

              .enter_or_not {
                display: flex;
                align-items: center;
                font-size: 14px;
                color: #333333;

                img {
                  display: block;
                  width: 16px;
                  height: 16px;
                  margin-right: 5px;
                }
              }

              button {
                width: 86px;
                height: 38px;
                background: #2e8ae6;
                border-radius: 6px;
                font-size: 14px;
                color: #ffffff;
                margin-top: 14px;
              }
            }
          }
        }

        .scroll::-webkit-scrollbar {
          width: 8px;
        }

        .scroll::-webkit-scrollbar-thumb {
          border-radius: 4px;
          background: #eee;
        }

        .scroll::-webkit-scrollbar-track {
          width: 8px;
          background: transparent;
          border-radius: 4px;
        }
      }
    }
  }

  /deep/ .fingerprint {
    z-index: 1000;

    .dialog-box {
      width: 1000px;
      height: 680px;

      .content_box {
        height: 570px;
        border-top: 1px solid #dddddd;
        box-sizing: border-box;
        padding-top: 65px;

        .tips {
          text-align: center;
          font-size: 20px;
          color: #333333;
        }

        .list_box {
          width: 670px;
          height: 220px;
          display: flex;
          justify-content: space-between;
          margin: 54px auto 0;

          .itme {
            width: 180px;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;

            span {
              font-size: 16px;
              color: #333333;
            }

            div {
              width: 180px;
              height: 180px;
              background: #ffffff;
              border: 1px solid #e6e6e6;
              border-radius: 6px;
              display: flex;
              justify-content: center;
              align-items: center;

              img {
                display: block;
                width: 90px;
                height: 140px;
              }
            }
          }
        }

        .success {
          width: 670px;
          display: flex;
          justify-content: space-between;
          margin: 16px auto 0;

          div {
            width: 33.3%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #333;

            img {
              display: block;
              width: 16px;
              height: 16px;
              margin-right: 8px;
            }
          }
        }

        button {
          display: block;
          width: 100px;
          height: 40px;
          background: #2e8ae6;
          border-radius: 6px;
          margin: 50px auto 0;
          font-size: 16px;
          color: #ffffff;
        }

        .order {
          font-size: 14px;
          text-align: center;
          color: #333333;
          margin-top: 30px;
        }
      }
    }
  }

  /deep/ .appeal {
    .dialog-box {
      width: 840px;
      height: 480px;

      .content_box {
        height: 370px;
        border-top: 1px solid #dddddd;
        box-sizing: border-box;
        padding: 35px 74px 0 85px;

        span {
          width: 75px;
          white-space: nowrap;
          display: block;
          font-size: 14px;
          color: #333333;
        }

        .user_account {
          display: flex;
          align-items: center;
          justify-content: space-between;

          img {
            display: block;
            width: 16px;
            height: 16px;
            margin-right: 5px;
          }

          div {
            display: flex;
            align-items: center;
          }
        }

        .class_box {
          display: flex;
          align-items: center;
          margin-top: 10px;

          span:nth-of-type(2) {
            margin-left: 0.29rem;
          }
        }

        .reason {
          display: flex;
          margin-top: 20px;

          textarea {
            margin-left: 20px;
            width: 590px;
            height: 76px;
            background: #ffffff;
            border: 1px solid #e6e6e6;
            border-radius: 4px;
            font-size: 14px;
            color: #333333;
          }
        }
      }

      .cel {
        width: 200px;
      }
    }
  }

  /deep/ .import_box {
    .dialog-box {
      width: 840px;
      height: 480px;

      .content_box {
        height: 370px;
        border-top: 1px solid #dddddd;
        box-sizing: border-box;
        padding: 35px 40px 0;

        span {
          display: block;
          font-size: 16px;
          color: #333333;
        }

        .download_template {
          width: 100%;
          height: 60px;
          background: rgba(51, 51, 51, 0);
          border: 1px dashed #cccccc;
          border-radius: 10px;
          margin-top: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px 0 15px;
          box-sizing: border-box;

          a {
            font-size: 16px;
            color: #002aff;
            text-decoration: underline;

            &.error {
              color: red;
              margin-left: 30px;
            }
          }

          button {
            width: 100px;
            height: 40px;
            background: #2e8ae6;
            border-radius: 6px;
            font-size: 16px;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;

            a {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
            }

            img {
              display: block;
              width: 21px;
              height: 16px;
              margin-right: 9px;
            }
          }
        }

        .schedule {
          width: 100%;
          height: 138px;
          background: rgba(51, 51, 51, 0);
          border: 1px dashed #cccccc;
          border-radius: 10px;
          margin-top: 18px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;

          .upload {
            width: 100%;
            height: 100%;
            opacity: 0;
            position: absolute;
            left: 0;
            top: 0;

            .el-upload {
              width: 100%;
              height: 100%;
              opacity: 0;
              position: absolute;
              left: 0;
              top: 0;
            }
          }

          .click_schedule {
            display: flex;
            align-items: center;
            margin-top: 34px;

            img {
              display: block;
              width: 21px;
              height: 16px;
              margin-right: 12px;
            }

            a {
              font-size: 16px;
              color: #2e8ae6;
            }
          }

          .success_progress {
            .el-progress-bar {
              .el-progress-bar__outer {
                border: none;
              }

              .el-progress-bar__inner {
                border: 1px solid #2e8ae6;
                box-sizing: border-box;
              }
            }
          }

          .el-progress {
            line-height: 0px;
            height: 20px;
            width: 500px;
            margin-top: 15px;
            white-space: nowrap;
            //&::before {
            //  content: '';
            //  display: block;
            //  position: absolute;
            //  top: -1px;
            //  left: -1px;
            //  height: 20px;
            //  width: 450px;
            //  border: 1PX solid #2e8ae6;
            //  border-radius: 11px;
            //}

            .el-progress-bar__outer {
              border-radius: 11px;
              height: 20px !important;
              border: 1px solid #2e8ae6;
              background: #ffffff;
              position: relative;
              box-sizing: border-box;

              .el-progress-bar__inner {
                border-radius: 11px;
                background-color: unset;
                background-image: linear-gradient(to right, #05aafa, #2e8ae6);
              }
            }

            .el-progress__text {
              font-size: 16px;
              color: #2e8ae6;
              margin-left: 16px;
            }
          }

          span {
            font-size: 14px;
            margin-top: 15px;
          }
        }
      }
    }
  }

  /deep/ .admin_box {
    .dialog-box {
      width: 1000px;
      height: 560px;

      .content_box {
        height: 450px;
        border-top: 1px solid #dddddd;
        box-sizing: border-box;
        padding: 35px 0 0 85px;

        .select {
          display: flex;
          align-items: center;

          img {
            display: block;
            width: 18px;
            height: 18px;
            margin-right: 15px;
          }

          span {
            display: block;
            font-size: 16px;
            color: #333333;
          }
        }

        span {
          font-size: 14px;
          color: #333;
        }

        .existing {
          display: flex;
          align-items: center;
          margin: 30px 0 30px 33px;

          .selectTool {
            width: 300px;
            height: 38px;
            margin-left: 19px;

            .el-select {
              .el-input__inner {
                background: #ffffff;
                border: 1px solid #e6e6e6;
                border-radius: 4px;
              }

              /* .el-select-dropdown {
              left: 0px !important;
          } */
            }
          }
        }

        .new_box {
          margin: 30px 0 30px 33px;

          .register_paw {
            display: flex;
            align-items: center;

            .register {
              display: flex;
              align-items: center;

              > input {
                width: 328px;
                height: 38px;
                background: #ffffff;
                border: 1px solid #e6e6e6;
                border-radius: 4px;
                margin-left: 19px;
              }

              & > span:nth-of-type(2) {
                margin-left: 36px;
              }

              .paw {
                display: flex;
                align-items: center;
                margin-left: 19px;
                width: 328px;
                height: 38px;
                background: #ffffff;
                border: 1px solid #e6e6e6;
                border-radius: 4px;

                input {
                  background: none;
                  border: none;
                  height: 100%;
                  width: 267px;
                }

                button {
                  width: 58px;
                  height: 32px;
                  background: #2e8ae6;
                  border-radius: 4px;
                  font-size: 14px;
                  color: #ffffff;
                }
              }
            }
          }

          .illustrate {
            opacity: 0.5;
            font-size: 14px;
            color: #333333;
            margin: 14px 0 21px 58px;
          }

          .name_age_sex {
            display: flex;
            align-items: center;

            input {
              background: #ffffff;
              border: 1px solid #e6e6e6;
              border-radius: 4px;
              font-size: 14px;
              color: #333333;
              width: 328px;
              height: 38px;
              margin-left: 19px;

              &:nth-of-type(2) {
                width: 120px;
              }

              &:nth-of-type(3) {
                width: 120px;
              }
            }

            span:nth-of-type(2) {
              margin-left: 36px;
            }

            span:nth-of-type(3) {
              margin-left: 30px;
            }
          }

          .not_supertube {
            display: flex;
            align-items: center;
            margin-top: 50px;

            img {
              display: block;
              width: 18px;
              height: 18px;
            }

            span {
              font-size: 14px;
              color: #333333;
              margin-left: 15px;
            }
          }
        }
      }
    }
  }

  /deep/ .edit_admin {
    .dialog-box {
      width: 1000px;
      height: 680px;

      .content-box {
        height: 570px;
        border-top: 1px solid #dddddd;
        box-sizing: border-box;

        // padding: 35px 0 0 85px;
        .scroll {
          height: 570px;
          overflow-y: scroll;
          padding: 35px 0 30px 100px;
          box-sizing: border-box;

          span {
            display: block;
            font-size: 14px;
            color: #333333;
          }

          .title {
            font-size: 16px;
            color: #333333;
            display: flex;

            span {
              opacity: 0.5;
              font-size: 14px;
              margin-left: 15px;
            }
          }

          input {
            background: #ffffff;
            border: 1px solid #e6e6e6;
            border-radius: 4px;
            outline: none;
            font-size: 14px;
            color: #333333;
          }

          .register {
            //margin-top: 28px;
            display: flex;
            align-items: center;

            > input {
              width: 328px;
              height: 38px;
              margin-left: 18px;
            }

            & > span:nth-of-type(2) {
              margin-left: 28px;
            }

            .paw {
              display: flex;
              align-items: center;
              margin-left: 19px;
              width: 328px;
              height: 38px;
              background: #ffffff;
              border: 1px solid #e6e6e6;
              border-radius: 4px;

              input {
                background: none;
                border: none;
                height: 100%;
                width: 267px;
              }

              button {
                width: 58px;
                height: 32px;
                background: #2e8ae6;
                border-radius: 4px;
                font-size: 14px;
                color: #ffffff;
              }
            }
          }

          .name_age_sex {
            display: flex;
            align-items: center;
            margin-top: 20px;

            input {
              height: 38px;
              margin-left: 19px;

              &:nth-of-type(1) {
                width: 328px;
              }

              &:nth-of-type(2) {
                width: 120px;
              }

              &:nth-of-type(3) {
                width: 120px;
                margin-left: 15px;
              }
            }

            span:nth-of-type(2) {
              margin-left: 29px;
            }

            span:nth-of-type(3) {
              margin-left: 29px;
            }
          }

          .manage_class {
            display: flex;
            margin: 30px 0 40px 0;

            .class_box {
              margin-left: 19px;
              display: flex;
              flex-direction: column;

              div {
                width: 455px;
                font-size: 14px;
                color: #aaaaaa;
                margin-top: 19px;
              }
            }
          }

          .face_fingerprint {
            display: flex;
            margin-top: 28px;

            > span {
              line-height: 30px;
            }

            > img {
              display: block;
              width: 90px;
              height: 90px;
              margin-left: 20px;
            }

            .fingerprint_img {
              width: 90px;
              height: 90px;
              background: rgba(238, 238, 238, 0.5);
              border: 1px solid #e6e6e6;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: 20px;

              img {
                display: block;
                width: 40px;
                height: 47px;
                opacity: 0.7;
              }
            }

            .face_fingerprint_btn {
              margin-left: 15px;

              .enter_or_not {
                display: flex;
                align-items: center;
                font-size: 14px;
                color: #333333;

                img {
                  display: block;
                  width: 16px;
                  height: 16px;
                  margin-right: 5px;
                }
              }

              button {
                width: 86px;
                height: 38px;
                background: #2e8ae6;
                border-radius: 6px;
                font-size: 14px;
                color: #ffffff;
                margin-top: 14px;
              }
            }
          }

          .face_fingerprint {
            display: flex;
            margin-top: 28px;

            > span {
              line-height: 30px;
            }

            > img,
            > .images {
              display: block;
              width: 90px;
              height: 90px;
              margin-left: 20px;

              .image-slot {
                border: 1px solid #e6e6e6;
                width: 90px;
                height: 90px;
                display: flex;
                justify-content: center;
                align-items: center;

                background-color: rgba(238, 238, 238, 0.5);

                i {
                  color: #d9d9d9;
                }
              }
            }

            .fingerprint_img {
              width: 90px;
              height: 90px;
              background: rgba(238, 238, 238, 0.5);
              border: 1px solid #e6e6e6;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: 20px;

              img {
                display: block;
                width: 40px;
                height: 47px;
                opacity: 0.7;
              }
            }

            .face_fingerprint_btn {
              margin-left: 15px;

              .enter_or_not {
                display: flex;
                align-items: center;
                font-size: 14px;
                color: #333333;

                img {
                  display: block;
                  width: 16px;
                  height: 16px;
                  margin-right: 5px;
                }
              }

              button {
                width: 86px;
                height: 38px;
                background: #2e8ae6;
                border-radius: 6px;
                font-size: 14px;
                color: #ffffff;
                margin-top: 14px;
              }
            }
          }
        }

        .scroll::-webkit-scrollbar {
          width: 8px;
        }

        .scroll::-webkit-scrollbar-thumb {
          border-radius: 4px;
          background: #eee;
        }

        .scroll::-webkit-scrollbar-track {
          width: 8px;
          background: transparent;
          border-radius: 4px;
        }
      }
    }
  }

  /deep/ .remove_permissions {
    .popup-box {
      width: 420px;
      height: 250px;

      .content-box {
        display: flex;
        flex-direction: column;
        align-items: center;

        //justify-content: center;
        .tips {
          margin: 40px 0 20px 0;
        }

        .selectTool {
          width: 340px;
          height: 40px;

          .el-select {
            .el-input__inner {
              background: #ffffff;
              border: 1px solid #e6e6e6;
              border-radius: 4px;
            }

            /* .el-select-dropdown {
            left: 0px !important;
        } */
          }
        }
      }
    }
  }

  /deep/ .edit_consultant {
    .dialog-box {
      width: 1000px;
      height: 680px;

      .content-box {
        height: 570px;
        border-top: 1px solid #dddddd;
        box-sizing: border-box;

        // padding: 35px 0 0 85px;
        .scroll {
          height: 570px;
          overflow-y: scroll;
          padding: 35px 0 30px 134px;
          box-sizing: border-box;

          span {
            display: block;
            font-size: 14px;
            color: #333333;
          }

          .title {
            font-size: 16px;
            color: #333333;
            display: flex;

            span {
              opacity: 0.5;
              font-size: 14px;
              margin-left: 15px;
            }
          }

          input {
            background: #ffffff;
            border: 1px solid #e6e6e6;
            border-radius: 4px;
            outline: none;
            font-size: 14px;
            color: #333333;
          }

          .register {
            margin-top: 28px;
            display: flex;
            align-items: center;

            > input {
              width: 300px;
              height: 38px;
              margin-left: 18px;
            }

            & > span:nth-of-type(2) {
              margin-left: 28px;
            }

            .paw {
              display: flex;
              align-items: center;
              margin-left: 19px;
              width: 300px;
              height: 38px;
              background: #ffffff;
              border: 1px solid #e6e6e6;
              border-radius: 4px;

              input {
                background: none;
                border: none;
                height: 100%;
                width: 239px;
              }

              button {
                width: 58px;
                height: 32px;
                background: #2e8ae6;
                border-radius: 4px;
                font-size: 14px;
                color: #ffffff;
              }
            }
          }

          .illustrate {
            opacity: 0.5;
            font-size: 14px;
            color: #333333;
            margin: 14px 0 39px 58px;
          }

          .name_age_sex {
            display: flex;
            align-items: center;
            margin-top: 28px;

            input {
              height: 38px;
              margin-left: 19px;

              &:nth-of-type(1) {
                width: 210px;
              }

              &:nth-of-type(2) {
                width: 110px;
              }

              &:nth-of-type(3) {
                width: 100px;
                margin-left: 5px;
              }

              &:nth-of-type(4) {
                width: 100px;
                margin-left: 5px;
              }
            }

            span:nth-of-type(2) {
              margin-left: 15px;
            }

            span:nth-of-type(3) {
              margin-left: 15px;
            }

            span:nth-of-type(4) {
              margin-left: 15px;
            }
          }

          .introduction {
            display: flex;
            // align-items: center;
            margin: 15px 0 29px 0;

            span {
              line-height: 30px;
            }

            textarea {
              width: 688px;
              height: 130px;
              background: #ffffff;
              border: 1px solid #e6e6e6;
              border-radius: 4px;
              margin-left: 20px;
            }
          }

          .user_img {
            display: flex;
            margin-top: 20px;
            box-sizing: border-box;

            > span {
              margin-right: 19px;
              line-height: 35px;
            }

            .img_box {
              width: 120px;
              height: 120px;
              background: #ffffff;
              border: 1px solid #e6e6e6;
              border-radius: 4px;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;

              img {
                display: block;
                width: 260px;
                height: 42px;
              }

              span {
                opacity: 0.5;
                font-size: 14px;
                color: #333333;
              }
            }

            .upload {
              margin-left: 10px;

              .el-upload__tip {
                font-size: 14px;
                color: #333333;
                margin: 0 0 9px 0;
              }

              .uploader {
                width: 80px;
                height: 38px;

                .el-upload {
                  display: block;
                  width: 80px;
                  height: 38px;

                  button {
                    display: block;
                    width: 80px;
                    height: 38px;
                    background: #2e8ae6;
                    border-radius: 6px;
                    padding: 0;

                    span {
                      font-size: 14px;
                      color: #ffffff;
                    }
                  }
                }
              }
            }
          }

          .add-label {
            display: flex;
            align-items: center;
            margin-top: 20px;

            .add-select {
              width: 240px;
              height: 38px;
              background: #ffffff;
              //border: 1px solid #e6e6e6;
              border-radius: 4px;
              box-sizing: border-box;
              margin-left: 19px;
            }

            button {
              display: block;
              width: 80px;
              height: 38px;
              background: #2e8ae6;
              border-radius: 6px;
              margin-left: 10px;
              font-size: 14px;
              color: #ffffff;
            }
          }

          .notes-box {
            width: 559px;
            font-size: 13px;
            opacity: 0.7;
            color: #333333;
            //line-height: 32px;
            margin: 15px 0 0 90px;
          }

          .label-list {
            display: flex;
            height: auto;
            width: 650px;
            margin: 35px 0 40px 0;

            span {
              //width: 100px;
              margin-top: 10px;
            }

            .label-list_box {
              width: 550px;
              height: auto;
              display: flex;
              justify-content: flex-start;
              flex-wrap: wrap;
              box-sizing: border-box;
              margin-left: 19px;

              div {
                width: 130px;
                height: 38px;
                background: #ffffff;
                border: 1px solid #e6e6e6;
                border-radius: 4px;
                padding: 0 10px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                color: #333333;
                margin-bottom: 10px;
                margin-right: 10px;

                img {
                  display: block;
                  width: 10px;
                  height: 10px;
                }
              }
            }
          }

          .face_fingerprint {
            display: flex;
            margin-top: 28px;

            > span {
              line-height: 30px;
            }

            > img {
              display: block;
              width: 90px;
              height: 90px;
              margin-left: 20px;
            }

            .fingerprint_img {
              width: 90px;
              height: 90px;
              background: rgba(238, 238, 238, 0.5);
              border: 1px solid #e6e6e6;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: 20px;

              img {
                display: block;
                width: 40px;
                height: 47px;
                opacity: 0.7;
              }
            }

            .face_fingerprint_btn {
              margin-left: 15px;

              .enter_or_not {
                display: flex;
                align-items: center;
                font-size: 14px;
                color: #333333;

                img {
                  display: block;
                  width: 16px;
                  height: 16px;
                  margin-right: 5px;
                }
              }

              button {
                width: 86px;
                height: 38px;
                background: #2e8ae6;
                border-radius: 6px;
                font-size: 14px;
                color: #ffffff;
                margin-top: 14px;
              }
            }
          }
        }

        .scroll::-webkit-scrollbar {
          width: 8px;
        }

        .scroll::-webkit-scrollbar-thumb {
          border-radius: 4px;
          background: #eee;
        }

        .scroll::-webkit-scrollbar-track {
          width: 8px;
          background: transparent;
          border-radius: 4px;
        }
      }
    }
  }

  /deep/ .consultant_scheduling {
    .dialog-box {
      width: 1000px;
      height: 680px;

      .content-box {
        height: 570px;
        border-top: 1px solid #dddddd;
        box-sizing: border-box;

        // padding: 35px 0 0 85px;
        .scroll {
          height: 570px;
          overflow-y: scroll;
          padding: 30px 0 0px 60px;
          box-sizing: border-box;

          span {
            //display: block;
            font-size: 14px;
            color: #333333;
          }

          .scheduling_obj {
            display: flex;
            align-items: center;

            h3 {
              font-size: 20px;

              font-family: Microsoft YaHei, Microsoft YaHei-Regular;
              font-weight: 400;
              text-align: left;
              color: #333333;
            }

            span {
              font-size: 20px;
              color: #2e8ae6;
            }
          }

          .scheduling_date {
            display: flex;
            align-items: center;
            margin-top: 24px;

            .date {
              width: 150px;
              height: 38px;

              .icon {
                img {
                  display: block;
                  width: 8px !important;
                  height: 4px !important;
                }
              }

              &:nth-of-type(1) {
                margin-left: 14px;
              }
            }

            .divider {
              margin: 0 19px;
            }
          }

          .scheduling_am_pm {
            display: flex;
            align-items: center;
            margin-top: 10px;

            span {
              margin-right: 14px;

              &:nth-of-type(2) {
                margin-left: 30px;
              }
            }

            .selectTool {
              width: 90px;
              height: 38px;

              .el-select {
                .el-input__inner {
                  background: #ffffff;
                  border: 1px solid #e6e6e6;
                  border-radius: 4px;
                }

                /* .el-select-dropdown {
                left: 0px !important;
            } */
              }
            }

            .divider {
              margin: 0 19px;
              color: #333333;
            }

            button {
              display: block;
              width: 233px;
              height: 40px;
              background: #2e8ae6;
              border-radius: 6px;
              font-size: 16px;
              color: #ffffff;
              margin-left: 52px;
            }
          }

          .stop_scheduling_title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 39px auto 0 auto;
            width: 388px;

            div {
              width: 120px;
              height: 1px;
              background: #dddddd;
            }

            span {
              font-size: 18px;
            }
          }

          .stop_scheduling_content {
            display: flex;
            margin-top: 29px;

            > div {
              height: 300px;
              //border: 1px solid #e6e6e6;
              border-radius: 0px 0px 4px 4px;
            }

            .content_left {
              width: 340px;

              .content_left_top {
                width: 100%;
                height: 42px;
                background: #eeeeee;
                border: 1px solid #e6e6e6;
                border-radius: 4px 4px 0px 0px;
                padding: 0 5px;
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: none;
              }
            }

            .content_right {
              width: 530px;
              margin-left: 10px;
              position: relative;

              .content_right_top {
                width: 530px;
                height: 42px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #eeeeee;
                border: 1px solid #e6e6e6;
                border-radius: 4px 4px 0px 0px;
                padding: 0px 5px 0 20px;
                box-sizing: border-box;
                font-size: 16px;
                border-bottom: none;
                color: #333333;

                button {
                  width: 100px;
                  height: 34px;
                  background: #2e8ae6;
                  border-radius: 6px;
                  font-size: 14px;
                  color: #ffffff;
                }
              }

              .content_right_list {
                padding: 10px 0 0 10px;
                box-sizing: border-box;
                display: flex;
                flex-wrap: wrap;

                .i {
                  width: 120px;
                  height: 60px;
                  background: #ffffff;
                  border: 1px solid #d9d9d9;
                  border-radius: 4px;
                  padding: 10px 0;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  flex-direction: column;
                  margin: 0 10px 10px 0;
                  box-sizing: border-box;
                  font-size: 14px;
                  color: #333333;

                  &:nth-of-type(4) {
                    margin-right: 0px;
                  }

                  &:nth-of-type(8) {
                    margin-right: 0px;
                  }

                  img {
                    display: block;
                    width: 16px;
                    height: 16px;
                    //margin-top: 5px;
                  }
                }
              }

              .tips_box {
                display: flex;
                align-items: center;
                position: absolute;
                left: 15px;
                bottom: 12px;

                img {
                  display: block;
                  width: 16px;
                  height: 16px;
                }

                span {
                  margin-left: 10px;
                }
              }
            }
          }
        }

        .scroll::-webkit-scrollbar {
          width: 8px;
        }

        .scroll::-webkit-scrollbar-thumb {
          border-radius: 4px;
          background: #eee;
        }

        .scroll::-webkit-scrollbar-track {
          width: 8px;
          background: transparent;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
