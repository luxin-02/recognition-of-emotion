<template>
  <print-box ref="print_box">
    <div class="info-warp">
      <p class="info_title">用户基础资料表</p>
      <div class="title-row">
        <div class="icon"></div>
        <span>用户部门信息</span>
      </div>
      <table class="bottom_20">
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
            <input
              v-model="userData.date_of_birth"
              placeholder="请输入"
              class="table_input"
            />
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
            <input
              v-model="userData.politics_status"
              placeholder="请输入"
              class="table_input"
            />
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
            <input
              v-model="userData.family_status"
              placeholder="请输入"
              class="table_input"
            />
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
export default {
  name: "print",
  props: ["userData"],
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
    border-radius: 5px;
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
        height: 40px;
        padding-left: 14px;
        color: #333333;
        background-color: #f7f7f7;
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
