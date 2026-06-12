<template>
  <div class="the-user-profile">
    <backstage-dialog
      class="backstage_dialog"
      :show="true"
      title="用户档案"
      cancelContent="关闭窗口"
      :print="true"
      :allprint="7 - allnum != 1"
      :export1="true"
      @save="save"
      @print="printFn"
      @export="exportFn"
      @cancel="cancel"
      @allprint="allprint"
    >
      <div class="title_list">
        <template v-for="(item, i) in list">
          <div
            @click="activeIndex = i"
            :key="i"
            :class="activeIndex == i ? 'active' : ''"
            class="item"
            v-if="item.is_delete == '0'"
          >
            <span>{{ item.title }}</span>
          </div>
        </template>
      </div>

      <component
        :is="activeView.componentsName"
        :userId="userId"
        ref="formRef"
      ></component>
    </backstage-dialog>
  </div>
</template>
<script>
import TheUserBaseInfo from "./theUserBaseInfo/theUserBaseInfo.vue";
import TheUserHealthInfo from "./theUserHealthInfo/theUserHealthInfo.vue";
import TheFamilyInfo from "./theFamilyInfo/theFamilyInfo.vue";
import TheEducationInfo from "./theEducationInfo/theEducationInfo.vue";
import TheDisabilitylevel from "./theDisabilitylevel/theDisabilitylevel.vue";
import TheFamilyInterViews from "./theFamilyInterViews/theFamilyInterViews.vue";
import TheMentalcondition from "./theMentalCondition/theMentalCondition.vue";

import { getRecordList } from "@/server/api/record";
export default {
  name: "theUserProfile",
  props: {
    show: {},
    userId: "",
    DanganShow: {
      type: Boolean,
    },
  },
  computed: {
    activeView() {
      return this.list[this.activeIndex];
    },
  },
  provide() {
    return {
      parentDoms: this,
    };
  },
  mounted() {
    // console.log(this.$refs.parentDom);
    this.getRecordList();
    console.log(this.userId);
  },
  components: {
    TheMentalcondition,
    TheFamilyInterViews,
    TheDisabilitylevel,
    TheEducationInfo,
    TheFamilyInfo,
    TheUserHealthInfo,
    TheUserBaseInfo,
  },
  data() {
    return {
      list: [
        {
          title: "基础资料",
          componentsName: "TheUserBaseInfo",
        },
        {
          title: "健康情况",
          componentsName: "the-user-health-info",
        },
        {
          title: "教育情况",
          componentsName: "the-education-info",
        },
        {
          title: "残障等级",
          componentsName: "the-disabilitylevel",
        },
        {
          title: "家庭情况",
          componentsName: "the-family-info",
        },
        {
          title: "家庭访谈",
          componentsName: "the-family-inter-views",
        },
        {
          title: "精神状态",
          componentsName: "the-mentalcondition",
        },
      ],
      activeIndex: 0,
      timer: null,
      allnum: 0,
    };
  },
  methods: {
    save() {
      this.$refs.formRef.setRecordDetails();
      this.$emit("update:DanganShow", false);
    },
    printFn() {
      this.$refs.formRef.printFn();
    },
    allprint() {
      // var element  = document.getElementById('ul'); // assuming ul exists
      // var fragment = document.createDocumentFragment();
      // var code = document.createElement("div");
      // console.log(code);
      // this.activeIndex = 0;
      // this.timer = setInterval(() => {
      //   if (this.list[this.activeIndex].is_delete == "0") {
      //     console.log(this.$refs.formRef.$el);
      //   }
      //   this.activeIndex++;
      //   if (this.activeIndex >= 6) {
      //     clearInterval(this.timer);
      //   }
      // }, 200);

      clearInterval(this.timer);
      this.activeIndex = 0;
      this.timer = setInterval(() => {
        if (this.list[this.activeIndex].is_delete == "0") {
          this.$refs.formRef.printFn();
        }
        this.activeIndex++;
        if (this.activeIndex >= 6) {
          clearInterval(this.timer);
        }
      }, 200);
    },
    exportFn() {
      this.$refs.formRef.exportFn();
    },
    cancel() {
      this.$emit("update:DanganShow", false);
    },
    async getRecordList() {
      const { data } = await getRecordList();
      if (data.code == this.$global.successCode) {
        var RecordList = data.data;

        this.list = this.list.map((v, i) => {
          return {
            ...v,
            ...RecordList[i],
          };
        });

        this.list.forEach((v) => {
          this.allnum += +v.is_delete;
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
// ::v-deep div.pf-popup-wrpper.user-profile-popup {
//   > div.pf-popup-box {
//     width: 1000px;
//     height: 660px;

//   }
// }

::v-deep .backstage_dialog {
  .dialog-box {
    width: 1000px;
    height: 900px;
    position: relative;
    .title_list {
      width: 1000px;
      height: 52px;
      margin-top: 20px;
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      display: flex;
      background-color: #eeeeee;
      box-sizing: border-box;
      padding: 6px 45px 0 45px;
      > div {
        width: 130px;
        height: 46px;
        background: #dddddd;
        border-radius: 10px 10px 0px 0px;
        line-height: 46px;
        text-align: center;
      }
      .active {
        background-color: #fff;
      }
    }

    .info-warp {
      height: 600px;
      position: absolute;
      top: 120px;
      overflow: auto;
      margin-top: 30px;
      padding-top: 0;
      z-index: 2;
      .info_title {
        font-size: 20px;
        font-family: Microsoft YaHei, Microsoft YaHei-Bold;
        font-weight: 600;
        text-align: center;
        color: #333333;
        margin-bottom: 20px;
      }
      .title-row {
        // width: 899px;
        width: 100%;
        height: 40px;
        background-color: #f7f7f7;
        border-top: 1px #e3e3e3 solid;
        border-right: 1px #e3e3e3 solid;
        border-left: 1px #e3e3e3 solid;
        box-sizing: border-box;
        > span {
          color: #333333;
        }
      }
      table {
        border-collapse: collapse;
        td {
          border: 1px #e3e3e3 solid;
          &.title {
            color: #333333;
            background-color: #f7f7f7;
          }
        }
        .el-date-editor {
          width: 100%;
          height: 37px;
        }
        .el-select {
          width: 100%;
        }
        .el-input__inner {
          border: none;
          padding-left: 16px;
          height: 37px;
        }
        .el-input__icon {
          display: none;
        }
        .el-input__suffix {
          width: 40px;
          height: 40px;
          background-image: url(@/assets/img/front/account/xiala.png);
          background-size: 100% 100%;
        }
      }
    }
  }
}
.pf-popup-box-body {
  height: 545px;

  .user-profile-popup-body {
    width: 100%;
    height: 100%;
    @include scroll(10px, rgba($color: $text-primary, $alpha: 0.3));
    overflow-y: scroll;

    .change_type_row {
      width: 1000px;
      height: 60px;
      box-sizing: border-box;
      padding-left: 30px;
      display: flex;
      align-items: flex-end;
      background: rgba($box-popup-change-bg, 0.2);

      .item {
        width: 130px;
        height: 46px;
        background: rgba($box-bg-gradient, 0.1);
        border-radius: 8px 8px 0px 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &:hover {
          position: relative;

          &::before {
            border-radius: 8px 8px 0px 0px;
            width: 100%;
            height: 100%;
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            background: rgba($color: $box-bg-gradient, $alpha: 0.2);
          }
        }

        &.active {
          background-image: linear-gradient(
            0deg,
            rgba($color: $box-bg-gradient, $alpha: 0.3) 0%,
            rgba($color: $box-bg-gradient, $alpha: 0) 100%
          );
          background-color: $topic;
          @include box_colorful_shadow;
          // opacity: 1;
        }

        //&.active {
        //  background: linear-gradient(0deg, rgba($box-bg-gradient, 0.30) 0%, rgba($box-bg-gradient, 0.00) 100%) $topic;
        //  border-radius: 8px 8px 0px 0px;
        //  @include box_colorful_shadow;
        //}
      }
    }
  }
}

> div.pf-popup-box-footer {
  height: 70px;
  background: rgba($color: $pagination-bg-box, $alpha: 0.7);
  border-radius: 6px 6px 12px 12px;

  > div.user-profile-popup-footer {
    @include flex(row, center, center);

    > div {
      @include button_round(110px, 46px, 24px, 15px);

      &.big {
        @include button_round(130px, 46px, 24px, 15px);
      }
    }
  }
}
</style>
