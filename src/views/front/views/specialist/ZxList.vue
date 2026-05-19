<template>
  <div class="index">
    <div class="module_title">
      <i>-----------</i>
      <img src="@/assets/img/front/specialist/1.png" alt="" />
      {{ $route.meta.title }}
      <i>-----------</i>
    </div>
    <div class="top_opt">
      <div class="left_btn">
        <div class="all_sele" @click="allselectFn">
          <div>
            <img
              v-show="isAllChecked"
              src="@/assets/img/front/specialist/sele_yes.png"
            />
          </div>
          全选
        </div>
        <div class="del_wrap" @click="batchDel">
          <img src="@/assets/img/front/specialist/del.png" />
          批量删除
        </div>
        <div class="del_wrap" @click="allRead" v-if="!$store.getters.isAdmin">
          <img src="@/assets/img/front/specialist/read.png" />
          全部已读
        </div>
      </div>

      <div class="search_wrap">
        <el-input
          placeholder="搜索用户"
          v-model="searchText"
          prefix-icon="el-icon-search"
        >
        </el-input>

        <el-date-picker
          v-model="searchDate"
          type="daterange"
          range-separator=":"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
        >
        </el-date-picker>

        <button class="confirm" @click="getList">确定</button>
        <button class="reset" @click="reset">重置</button>
      </div>
    </div>

    <div class="info_wrap">
      <div class="left">
        <ul>
          <li
            v-for="item in listData"
            :key="item.id"
            :class="[atUser.id == item.id ? 'active' : '']"
            @click="getInfo(item)"
          >
            <div
              class="sele"
              @click.stop
              @click="
                () => {
                  item.opt = !item.opt
                  selectFn()
                }
              "
            >
              <img
                v-show="item.opt"
                src="@/assets/img/front/specialist/sele_yes.png"
              />
            </div>
            <div class="tx_wrap">
              <img class="tx" :src="$ip + item.avatar" />
              <div
                class="dian"
                v-show="!$store.getters.isAdmin && item.read != 1"
              ></div>
            </div>
            <div class="name_wrap">
              <div class="name">{{ item.nickname }}</div>
              <div class="date">
                {{ $formatDate2(item.add_time * 1000, "yyyy-MM-dd HH:mm:ss") }}
              </div>
              <div class="delbs" v-show="item.is_delete == 1">用户删除对话</div>
            </div>
          </li>
        </ul>
      </div>

      <div class="middle">
        <template v-if="infoData">
          <div
            class="zxs"
            v-if="
              $store.getters.roleInfo.name != '心理咨询师' &&
              !$store.getters.roleInfo.isAdmin
            "
          >
            <img class="tx" :src="$ip + infoData.avatar" />
            <div class="name_zxnum">
              <div class="name">{{ infoData.nickname }}</div>
              <div class="num">{{ infoData.num }}人咨询过</div>
            </div>
            <div class="age_sex">
              性别：{{
                infoData.sex
              }}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              工龄：{{ infoData.position }}
            </div>
            <div class="bq">
              标签：
              <div
                class="bq_img"
                v-for="item in infoData.consultant_tag"
                :key="item.id"
              >
                <el-popover
                  popper-class="black small"
                  placement="top"
                  trigger="click"
                  :content="item.title"
                >
                  <img
                    slot="reference"
                    class="bq-img"
                    :src="$ip + item.img_url"
                  />
                </el-popover>
                <!-- <img :src="$ip + item.img_url" />
                <i>{{ item.title }}</i> -->
              </div>
            </div>
            <div class="jianjie">
              {{ infoData.remark }}
            </div>
          </div>
          <div class="user" v-else>
            <div class="name">{{ infoData.nickname }}</div>
            <div class="age_sex">
              性别：{{
                infoData.sex
              }}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              年龄：{{ infoData.age }}
            </div>
            <div class="dep">部门：{{ infoData.class_name }}</div>
            <div class="wt">
              问题类型：<i style="color: #0080ff;">{{ infoData.type }}</i>
            </div>
            <div class="wt">问题说明：</div>
            <div class="wt_sm">
              {{ infoData.content }}
            </div>
          </div>
        </template>
      </div>

      <div class="right">
        <div class="chatting_records">
          <template v-for="item in dialog">
            <div class="infobox" :key="item.id" v-if="item.view != 1">
              <img :src="$ip + item.avatar" />
              <div class="info">
                <div class="age_date">
                  <div class="name">{{ item.nickname }}</div>
                  <div class="date">
                    {{ $formatDate2(item.add_time * 1000) }}
                  </div>
                  <span class="text">{{ item.content }}</span>
                </div>
              </div>
            </div>

            <div
              class="infobox"
              style="justify-content: flex-end"
              :key="item.id"
              v-else
            >
              <div class="info">
                <div class="age_date">
                  <div class="name" style="text-align: right">
                    {{ item.nickname }}
                  </div>
                  <div class="date" style="text-align: right">
                    {{ $formatDate2(item.add_time * 1000) }}
                  </div>
                  <div class="text">{{ item.content }}</div>
                </div>
              </div>
              <img :src="$ip + item.avatar" />
            </div>
          </template>
        </div>

        <div class="input">
          <el-input
            type="textarea"
            :resize="'none'"
            class="textarea"
            placeholder="说点什么吧"
            :disabled="$store.getters.roleInfo.name == '超级管理员'"
            v-model="message"
          />
          <button class="send_btn" @click="send" v-loading="sendLoading">
            <img src="@/assets/img/front/specialist/jilu_icon.png" />
            发送消息
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  reservationApiListMsg,
  reservationApiDelMsg,
  reservationApiInfoMsg,
  reservationApiReply,
  reservationApiReadAll,
} from "@/server/api/consult"
export default {
  data() {
    return {
      ids: "",
      allChecked: false,
      searchText: "",
      searchDate: "",
      listData: "",
      atUser: "",
      infoData: "",
      dialog: "",
      message: "",

      sendLoading: false,
    }
  },
  computed: {
    isAllChecked() {
      if (!this.listData.length) return
      var allChecked = true
      for (var i = 0; i < this.listData.length; i++) {
        if (!this.listData[i].opt) {
          allChecked = false
          break
        }
      }
      return allChecked
    },
  },
  mounted() {
    const box = document.querySelector(".chatting_records")
    box.scrollTo(0, box.scrollHeight - box.clientHeight)
    this.getList()
  },
  methods: {
    async getList() {
      if (this.searchDate) {
        var start_time = this.searchDate[0] / 1000
        var end_time = this.searchDate[1] / 1000 + 86399
      } else {
        var start_time = ""
        var end_time = ""
      }
      const { data } = await reservationApiListMsg({
        version: "v2",
        title: this.searchText,
        start_time,
        end_time,
      })
      if (data.code == this.$global.successCode) {
        console.log(data)
        this.listData = data.data.map((item, index) => {
          return {
            ...item,
            opt: false,
          }
        })
        if (this.listData.length) {
          this.getInfo(this.listData[0])
        } else {
          this.atUser = ""
          this.infoData = ""
          this.dialog = ""
        }
      }
    },
    async getInfo(item) {
      item.read = 1
      this.atUser = item
      const { data } = await reservationApiInfoMsg({
        id: item.id,
        uid: item.uid,
      })
      if (data.code == this.$global.successCode) {
        this.infoData = data.user
        this.dialog = data.data
        this.$nextTick(() => {
          const box = document.querySelector(".chatting_records")
          box.scrollTo(0, box.scrollHeight - box.clientHeight)
        })
      }
    },
    async batchDel() {
      if (!this.ids) {
        this.$myMessage({
          type: "font-error",
          message: "请勾选记录!",
        })
        return
      }
      const flag = await this.$popup.asyncShow("确定要删除吗？")
      if (!flag) {
        return
      }
      const res = await reservationApiDelMsg({ ids: this.ids })
      if (res.data.code == this.$global.successCode) {
        this.$myMessage({
          type: "font-success",
          message: res.data.msg,
        })
        this.getList()
        this.infoData = ""
        this.dialog = ""
      }
    },
    async send() {
      if (!this.atUser) return
      if (this.sendLoading || !this.message) return
      try {
        this.sendLoading = true
        const { data } = await reservationApiReply({
          msg_id: this.atUser.id,
          content: this.message,
        })
        if (data.code == this.$global.successCode) {
          this.message = ""
          this.$myMessage({
            type: "font-success",
            message: data.msg,
          })
          this.getInfo(this.atUser)
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.sendLoading = false
      }
    },
    selectFn() {
      this.ids = this.listData
        .filter((obj) => obj.opt)
        .map((item) => item.id)
        .join(",")
    },
    allselectFn() {
      if (this.isAllChecked) {
        this.listData.map((item) => (item.opt = false))
      } else {
        this.listData.map((item) => (item.opt = true))
      }
      this.ids = this.listData
        .filter((obj) => obj.opt)
        .map((item) => item.id)
        .join(",")
    },
    reset() {
      this.searchText = ""
      this.searchDate = ""
      this.getList()
    },
    async allRead() {
      const { data } = await reservationApiReadAll({
        version: "v2",
      })
      if (data.code == this.$global.successCode) {
        this.getList()
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
  top: 44%;
  transform: translate(-50%, -50%);
  background-image: url(@/assets/img/front/index/biankuang.png);
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: 136px 0 0 50px;

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

  .top_opt {
    width: 1410px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px #0c6ba9 solid;
    box-sizing: border-box;
    padding: 0 30px 0 70px;
    .left_btn {
      display: flex;
      align-items: center;
      .all_sele {
        display: flex;
        align-items: center;
        font-size: 20px;
        color: #ffffff;
        font-family: "ziyuanyuanti400W";
        > div {
          width: 20px;
          height: 20px;
          background-image: url(@/assets/img/front/specialist/sele_no.png);
          background-size: 100% 100%;
          margin: 0 5px 0 0;
          position: relative;
          > img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        }
      }
      .del_wrap {
        display: flex;
        align-items: center;
        font-size: 20px;
        color: #ffffff;
        font-family: "ziyuanyuanti400W";
        margin-left: 40px;
        > img {
          width: 15px;
          height: 18px;
          margin-right: 5px;
        }
      }
    }

    .search_wrap {
      width: 830px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      ::v-deep {
        .el-input {
          width: 280px;
          height: 42px;
          .el-input__inner {
            width: 280px;
            height: 42px;
            background: #0e274e;
            border: 1px solid #00a6fc;
            border-radius: 8px;
            color: #fff;
            padding-left: 45px;
            font-size: 18px;
          }
          .el-input__icon {
            color: #fff;
            font-size: 20px;
            margin-left: 8px;
            margin-top: 3px;
          }
        }

        .el-date-editor {
          width: 350px;
          height: 42px;
          background: #0e274e;
          border: 1px solid #00a6fc;
          > input {
            background: #0e274e;
            color: #fff;
          }
          .el-range-separator {
            color: #fff;
          }
          .el-input__icon {
            font-size: 20px;
            margin-left: 10px;
            color: #fff;
          }
        }
      }

      .confirm,
      .reset {
        width: 80px;
        height: 42px;
        background: #00a6fc;
        border-radius: 6px;
        font-size: 20px;
        color: #ffffff;
        font-family: "ziyuanyuanti400W";
      }
      .reset {
        background: #ed9414;
      }
    }
  }

  .info_wrap {
    display: flex;
    .left {
      width: 316px;
      height: 600px;
      > ul {
        height: 550px;
        overflow: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
        > li {
          width: 100%;
          height: 90px;
          display: flex;
          align-items: center;
          border-bottom: 1px #086093 solid;
          &.active {
            background: #0d3d5e;
          }
          .sele {
            width: 20px;
            height: 20px;
            margin-left: 30px;
            background-image: url(@/assets/img/front/specialist/sele_no.png);
            background-size: 100% 100%;
            position: relative;
            > img {
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
            }
          }
          .tx_wrap {
            width: 50px;
            height: 50px;
            margin: 0 15px;
            position: relative;
            > .tx {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
            > .dian {
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: #ff5a00;
              position: absolute;
              top: 1px;
              right: 0px;
            }
          }
          .name_wrap {
            width: 180px;
            font-size: 20px;
            font-family: "ziyuanyuanti400W";
            text-align: left;
            color: #ffffff;
            > .name {
              width: 180px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              margin-top: 12px;
            }
            > .date {
              font-size: 16px;
            }
            > .delbs {
              line-height: 14px;
              font-size: 14px;
              text-align: text;
              color: #ff6e6e;
            }
          }
        }
      }
    }
    .middle {
      width: 280px;
      height: 600px;
      background: #0509137e;
      border-left: 1px #00a4fa solid;
      border-right: 1px #00a4fa solid;
      padding: 20px 30px 0 30px;
      box-sizing: border-box;
      .zxs {
        width: 100%;
        font-family: "ziyuanyuanti400W";
        color: #ffffff;
        .tx {
          width: 200px;
          height: 183px;
          border-radius: 10px;
          margin-bottom: 30px;
        }
        .name_zxnum {
          display: flex;
          justify-content: space-between;
          .name {
            font-size: 27px;
          }
          .num {
            font-size: 18px;
            opacity: 0.5;
          }
        }
        .age_sex {
          font-size: 13px;
          color: #ffffff;
          margin-top: 30px;
        }
        .bq {
          font-size: 14px;
          display: flex;
          align-items: center;
          margin: 20px 0;
          > .bq_img {
            width: 26px;
            height: 26px;
            border-radius: 4px;
            margin: 0 3px;
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
        .jianjie {
          opacity: 0.7;
          font-size: 13px;
          height: 200px;
          overflow: scroll;
          &::-webkit-scrollbar {
            display: none;
          }
        }
      }
      .user {
        color: #fff;
        font-family: "ziyuanyuanti400W";
        .name {
          font-size: 27px;
          margin: 30px 0;
        }
        .wt,
        .age_sex,
        .dep,
        .wt_sm {
          font-size: 14px;
          margin: 10px 0;
        }

        .wt_sm {
          opacity: 0.7;
          height: 300px;
          overflow: scroll;
          &::-webkit-scrollbar {
            display: none;
          }
        }
      }
    }
    .right {
      .chatting_records {
        width: 813px;
        height: 400px;
        border-bottom: 1px #00a4fa solid;
        padding: 10px 30px;
        box-sizing: border-box;
        overflow: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
        .infobox {
          width: 100%;
          margin-bottom: 10px;
          display: flex;
          > img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
          }
          .info {
            box-sizing: border-box;
            padding: 8px 15px 0 15px;
            .age_date {
              font-family: "ziyuanyuanti400W";
              font-size: 20px;
              text-align: left;
              color: #ffffff;
              .date {
                font-size: 14px;
              }
              .text {
                padding: 15px 25px 20px 25px;
                font-size: 16px;
                text-align: left;
                color: #ffffff;
                font-family: "ziyuanyuanti400W";
                background: #00a4fa;
                border-radius: 15px;
                margin-top: 5px;
                letter-spacing: 1px;
                display: inline-block;
              }
            }
          }
        }
      }
      .input {
        width: 812px;
        height: 198px;
        background: #0e274e;
        margin: 2px 0 0 2px;
        border-radius: 0 0 19px 0;
        position: relative;
        ::v-deep .el-textarea {
          width: 100%;
          height: 130px;
          > textarea {
            width: 100%;
            height: 100%;
            background: #0e274e;
            border: none;
            color: #ffffff;
            font-family: "ziyuanyuanti400W";
            font-size: 17px;
          }
        }
        .send_btn {
          width: 220px;
          height: 45px;
          background: #00a6fc;
          border-radius: 23px;
          font-size: 20px;
          color: #ffffff;
          letter-spacing: 1px;
          font-family: "ziyuanyuanti400W";
          position: absolute;
          left: 50%;
          bottom: 10px;
          transform: translate(-50%);
          > img {
            width: 21px;
            height: 20px;
            margin-bottom: 2px;
          }

          ::v-deep .el-loading-mask {
            border-radius: 23px;
            background: #00000070;
          }
        }
      }
    }
  }
}
</style>
