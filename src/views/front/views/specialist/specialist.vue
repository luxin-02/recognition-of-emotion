<template>
  <div class="index">
    <div class="module_title">
      <i>-----------</i>
      <img src="@/assets/img/front/specialist/1.png" alt="" />
      {{ $route.meta.title }}
      <i>-----------</i>
    </div>

    <div class="title">
      {{
        $store.getters.roleInfo.name == "心理咨询师" ||
        $store.getters.roleInfo.isAdmin
          ? "咨询专家列表"
          : "点击选择咨询专家"
      }}
    </div>
    <div class="zj_num">心理专家：{{ page.total }}人</div>

    <div class="zj_list">
      <button class="pre" @click="preBtn"></button>
      <div class="scroll" id="zjscroll">
        <div v-for="(item, i) in list" :key="i" @click="gotoDetails(item)">
          <div class="photograph">
            <el-image class="tx" :src="$ip + item.avatar" />

            <div class="bq" v-for="bq in item.consultant_tag" :key="bq.id">
              <el-popover
                popper-class="black"
                placement="top"
                trigger="click"
                :content="bq.title"
              >
                <img slot="reference" class="bq-img" :src="$ip + bq.img_url" />
              </el-popover>
              <!-- <img :src="$ip + bq.img_url" />
              <i>{{ bq.title }}</i> -->
            </div>
          </div>

          <div class="name_wrap">
            <div class="name">{{ item.nickname }}</div>
            <div class="zx_num">
              {{ item.num }} <span style="font-size: 0.14rem">人咨询过</span>
            </div>
          </div>
          <div class="jieshao">
            {{ item.remark }}
          </div>
        </div>
      </div>
      <button class="next" @click="nextBtn"></button>
    </div>

    <div class="btn_box">
      <div @click="$toUrl('/specialist/YyList')">
        <img src="@/assets/img/front/specialist/yy_icon.png" />预约记录
      </div>
      <div @click="$toUrl('/specialist/ZxList')">
        <img src="@/assets/img/front/specialist/jilu_icon.png" />咨询记录
      </div>
    </div>
  </div>
</template>

<script>
import { reservationApiGetConsultant } from "@/server/api/consult"
export default {
  data() {
    return {
      page: {
        page: 1,
        page_size: 9999,
        total: 0,
        name: "",
        online: 0,
      },
      list: [],
    }
  },
  created() {
    this.getTableList()
  },
  activated() {
    if (this.Ls_firstComplete) {
      this.getTableList()
    } else {
      this.Ls_firstComplete = true
    }
  },

  methods: {
    preBtn() {
      var element = document.getElementById("zjscroll")
      element.scrollLeft -= 200
    },
    nextBtn() {
      var element = document.getElementById("zjscroll")
      element.scrollLeft += 200
    },

    gotoDetails(item) {
      // if (item.is_register != 1) {
      //   return;
      // }
      if (
        this.$store.getters.roleInfo.name == "心理咨询师" ||
        this.$store.getters.roleInfo.isAdmin
      )
        return
      this.$router.push({
        path: "/specialist/reservation",
        query: {
          uid: item.id,
        },
      })
    },

    async getTableList() {
      const res = await reservationApiGetConsultant(this.page)
      console.log(res)
      if (res.data.code == this.$global.successCode) {
        this.page.total = res.data.data.total
        this.list = res.data.data.data
        this.page.online = res.data.data.online
      }
    },
  },
}
</script>

<style scoped lang="scss">
.index {
  width: 1580px;
  height: 840px;
  position: absolute;
  left: 50%;
  top: 44%;
  transform: translate(-50%, -50%);
  background-image: url(@/assets/img/front/index/biankuang.png);
  background-size: 100% 100%;
  box-sizing: border-box;
  z-index: 2;
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
  .title {
    font-size: 24px;
    color: #ffffff;
    font-family: "ziyuanyuanti500W";
    position: absolute;
    left: 50%;
    top: 180px;
    transform: translate(-50%);
  }
  .zj_num {
    font-size: 18px;
    color: #ffffff;
    font-family: "ziyuanyuanti500W";
    position: absolute;
    left: 150px;
    top: 180px;
  }
  .zj_list {
    width: 1300px;
    height: 450px;
    position: absolute;
    left: 50%;
    top: 55%;
    transform: translate(-50%, -50%);
    .scroll {
      width: 100%;
      height: 100%;
      display: flex;
      flex: 1;
      overflow: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
      > div {
        min-width: 305px;
        height: 450px;
        background-image: url(@/assets/img/front/specialist/box_bg.png);
        background-size: 100% 100%;
        margin: 0 25px 0 0;
        padding: 30px 0 0 27px;
        box-sizing: border-box;

        .photograph {
          width: 250px;
          height: 280px;
          background: #0d2b45;
          border-radius: 10px;
          padding: 5px 0 0 5px;
          box-sizing: border-box;
          .tx {
            width: 240px;
            height: 220px;
            border-radius: 10px;
            margin-bottom: 8px;
          }
          .bq {
            width: 40px;
            height: 40px;
            background-size: 100% 100%;
            border-radius: 4px;
            margin-right: 10px;
            display: inline-block;
            position: relative;
            &:hover {
              > i {
                opacity: 1;
              }
            }
            &:last-child {
              margin-right: 0;
            }
            > img {
              width: 40px;
              height: 40px;
            }
            > i {
              position: absolute;
              top: -45px;
              left: 50%;
              transform: translate(-50%);
              white-space: nowrap;
              font-size: 16px;
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
              padding: 10px;
              border: 1px solid #00c6ff;
              box-sizing: border-box;
            }
            .bq-img {
              width: 40px;
              height: 40px;
            }
          }
        }

        .name_wrap {
          width: 250px;
          margin-top: 18px;
          display: flex;
          justify-content: space-between;
          .name {
            width: 160px;
            font-size: 26px;
            font-family: "ziyuanyuanti400W";
            color: #ffffff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .zx_num {
            // width: 100px;
            font-size: 16px;
            font-family: "ziyuanyuanti400W";
            color: #ffffff;
            opacity: 0.5;
            // background: #ffffff;
          }
        }

        .jieshao {
          width: 250px;
          height: 50px;
          opacity: 0.5;
          font-size: 16px;
          margin-top: 20px;
          font-family: "ziyuanyuanti400W";
          color: #ffffff;
          letter-spacing: -0.4px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .pre,
    .next {
      width: 54px;
      height: 57px;
      background: #00000000;
      position: absolute;
      top: 200px;
      background-size: 100% 100%;
      &.pre {
        background-image: url(@/assets/img/front/specialist/pre.png);
        left: -50px;
      }
      &.next {
        right: -50px;
        background-image: url(@/assets/img/front/specialist/next.png);
      }
    }
  }
  .btn_box {
    width: 480px;
    display: flex;
    justify-content: space-between;
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translate(-50%);
    > div {
      width: 220px;
      height: 45px;
      border-radius: 23px;
      text-align: center;
      font-family: "ziyuanyuanti400W";
      font-size: 20px;
      color: #ffffff;
      line-height: 45px;
      letter-spacing: 1px;
      background: #00a6fc;
      &:nth-child(2) {
        background: #ffaf00;
      }
      > img {
        width: 20px;
        height: 20px;
        margin: 0 5px 2px 0;
      }
    }
  }
}
</style>
