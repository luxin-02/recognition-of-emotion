<template>
  <div class="index">
    <div class="top_box">
      <div>
        <div class="back" @click="$router.back()"></div>
        <div class="square_plp">
          <img src="@/assets/img/front/EmotionSquare/gc_icon.png" />
          情绪广场漂流瓶
        </div>
      </div>
      <div>
        <div
          class="my_plp"
          @click="
            () => {
              myDrift = true
              getMyBottleList()
            }
          "
        >
          我的漂流瓶
        </div>
      </div>
    </div>

    <div class="drift_bottle_wrap">
      <div
        v-for="bottle in activeBottles"
        :key="bottle.id"
        class="driftBottle"
        :style="{
          animationDuration: bottle.duration + 's',
          animationDelay: bottle.delay + 's',
          top: bottle.top + 'px',
        }"
        @click="
          () => {
            getBottleInfoData(bottle.plpId)
            gatherShow = true
          }
        "
      >
        <img class="phImg" :src="$ip + bottle.avatar" />
        <div class="content">{{ bottle.title }}</div>
        <img class="moreImg" src="@/assets/img/front/EmotionSquare/more.png" />
        <img class="plpImg" src="@/assets/img/front/EmotionSquare/漂流瓶.png" />
      </div>
    </div>

    <div class="btn_box">
      <div
        @click="
          () => {
            getBottleInfoData(getRandomArrayElements(this.randomIdList, 1)[0])
            gatherShow = true
          }
        "
      >
        随机收取
      </div>
      <div @click="issueShow = true">投放心情</div>
    </div>

    <AnimationPopup :show.sync="myDrift">
      <div class="myDrift_wrap">
        <div class="myDrift_title">
          我的漂流瓶
          <img
            @click="myDrift = false"
            class="close"
            src="@/assets/img/front/EmotionSquare/close.png"
          />
        </div>
        <div class="drift_list">
          <div class="issue_gather">
            <button
              v-if="$store.getters.isAdmin"
              :class="{ active: classActive == 3 }"
              @click="classActive = 3"
            >
              所有列表
            </button>
            <button
              :class="{ active: classActive == 1 }"
              @click="classActive = 1"
            >
              我发布的
            </button>
            <button
              :class="{ active: classActive == 2 }"
              @click="classActive = 2"
            >
              我收取的
            </button>
          </div>

          <div class="teble_head">
            <div class="w10">序号</div>
            <div class="w20">发布者</div>
            <div class="w30">主题</div>
            <div class="w20">发布时间</div>
            <div class="w20">操作</div>
          </div>
          <div class="scroll_wrap">
            <div
              class="table_row"
              v-for="(item, i) in myBottleListData"
              :key="item.id"
            >
              <div class="w10">{{ i + 1 }}</div>
              <div class="w20">{{ item.nickname }}</div>
              <div class="w30">{{ item.title }}</div>
              <div class="w20">{{ $formatDate(item.add_time * 1000) }}</div>
              <div class="w20">
                <button
                  class="look"
                  @click="
                    () => {
                      gatherShow = true
                      getBottleInfoData(item.id)
                    }
                  "
                >
                  查看
                </button>
                <button
                  v-show="classActive != 2"
                  class="del"
                  @click="
                    () => {
                      delMyBottle(item.id)
                    }
                  "
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimationPopup>

    <AnimationPopup :show.sync="issueShow">
      <div class="myDrift_wrap">
        <div class="myDrift_title">
          发布漂流瓶
          <img
            @click="issueShow = false"
            class="close"
            src="@/assets/img/front/EmotionSquare/close.png"
          />
        </div>

        <div class="drift_list">
          <div class="anonymity">
            匿名发布者：
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="isAnonymous"
                class="checkbox-input"
              />
              <span class="checkbox-custom"></span>
              匿名
            </label>
          </div>

          <div class="theme_wrap">
            <div class="theme_title">主题：</div>
            <el-input
              placeholder="请输入主题"
              v-model="themeText"
              :maxlength="30"
            >
            </el-input>
          </div>

          <div class="textarea_wrap">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="issueText"
            >
            </el-input>
          </div>

          <div class="submit" @click="submitIssue">发布</div>
        </div>
      </div>
    </AnimationPopup>

    <AnimationPopup :show.sync="gatherShow">
      <div class="myDrift_wrap">
        <div class="myDrift_title">
          {{ bottleInfoData.title }}
          <img
            @click="gatherShow = false"
            class="close"
            src="@/assets/img/front/EmotionSquare/close.png"
          />
        </div>

        <div class="drift_list">
          <div class="flex_wrap">
            <div class="left_nimText">{{ bottleInfoData.nickname }}：</div>
            <div class="right_comment">
              <div class="plp_title">
                {{ bottleInfoData.content }}
                <p>发布于：{{ $formatDate(bottleInfoData.add_time * 1000) }}</p>
              </div>

              <div
                class="others_comment"
                v-for="item in bottleInfoData.comment"
                :key="item.id"
              >
                <div class="others_left">{{ item.nickname }}：</div>
                <div class="others_right">
                  <div class="plp_title">
                    {{ item.comment }}
                    <p>发布于：{{ $formatDate(item.add_time * 1000) }}</p>
                  </div>
                </div>
                <div
                  class="del_box"
                  v-show="$store.getters.userInfo.id == item.uid"
                  @click="delComment(item.comment_id)"
                >
                  <img src="@/assets/img/front/EmotionSquare/删除.png" />
                  &nbsp; 删除
                </div>
              </div>
            </div>
          </div>

          <div class="input_wrap">
            <input type="text" placeholder="说点什么？" v-model="commentText" />
            <label class="checkbox-label">
              <input type="checkbox" v-model="nmfbTF" class="checkbox-input" />
              <span class="checkbox-custom"></span>
              匿名
            </label>

            <button @click="addComment">发布评论</button>
          </div>
        </div>
      </div>
    </AnimationPopup>
  </div>
</template>

<script>
import {
  bottleAdd,
  bottleList,
  myBottleList,
  bottleInfo,
  bottleCommentAdd,
  bottleDel,
  bottleCommentDel,
} from "@/server/api/bottle"
import { getRandomArrayElements } from "@/utils/number"
export default {
  data() {
    return {
      getRandomArrayElements,
      classActive: 1,
      driftBottleList: [],
      activeBottles: [],
      animationInterval: null,
      maxActiveBottles: 5,
      containerWidth: 0,
      containerHeight: 580,
      bottleWidth: 350,
      bottleHeight: 85,
      usedContentIndexes: [], // 记录已使用的内容索引，避免重复

      myDrift: false,
      issueShow: false,
      gatherShow: false,
      isAnonymous: false,
      issueText: "",
      themeText: "",
      nmfbTF: false,

      myBottleListData: [],
      bottleInfoData: {},
      commentText: "",
      randomIdList: [],
    }
  },
  watch: {
    classActive() {
      this.getMyBottleList()
    },
  },
  created() {
    this.startAnimation()
  },
  mounted() {
    this.updateContainerSize()
    window.addEventListener("resize", this.updateContainerSize)
    this.getDriftBottleList()
  },
  methods: {
    updateContainerSize() {
      // 获取容器宽度
      this.containerWidth = window.innerWidth - 100 // 减去左右边距50px*2
    },
    startAnimation() {
      this.updateContainerSize()

      // 每4秒创建一个新的漂流瓶
      this.animationInterval = setInterval(() => {
        if (this.activeBottles.length >= this.maxActiveBottles) {
          return
        }

        this.createBottle()
      }, 4000)

      // 初始创建漂流瓶
      for (let i = 0; i < Math.min(2, this.maxActiveBottles); i++) {
        setTimeout(() => {
          this.createBottle()
        }, i * 1500)
      }
    },
    createBottle() {
      // 获取不重复的内容索引
      const contentIndex = this.getUniqueContentIndex()
      if (contentIndex === -1) {
        return // 如果没有可用的不重复内容，跳过创建
      }

      const randomBottle = this.driftBottleList[contentIndex]
      if (!randomBottle) {
        console.warn("randomBottle is undefined at index:", contentIndex)
        return
      }

      // 标记该内容为已使用
      this.usedContentIndexes.push(contentIndex)

      // 获取不重叠的随机位置
      const top = this.getNonOverlappingTop()

      const bottle = {
        ...randomBottle,
        top: top,
        duration: this.getRandomDuration(),
        delay: 0,
        id: Date.now() + Math.random(),
        contentIndex: contentIndex,
        plpId: randomBottle.id,
      }

      this.activeBottles.push(bottle)

      // 漂流瓶移动完成后自动移除
      setTimeout(() => {
        this.removeBottle(bottle.id)
      }, bottle.duration * 1000)
    },
    removeBottle(id) {
      const bottleIndex = this.activeBottles.findIndex(
        (bottle) => bottle.id === id,
      )
      if (bottleIndex !== -1) {
        const contentIndex = this.activeBottles[bottleIndex].contentIndex
        // 移除已使用的内容索引标记
        this.usedContentIndexes = this.usedContentIndexes.filter(
          (index) => index !== contentIndex,
        )
        this.activeBottles.splice(bottleIndex, 1)
      }
    },
    getUniqueContentIndex() {
      // 获取可用的不重复内容索引
      const availableIndexes = []
      for (let i = 0; i < this.driftBottleList.length; i++) {
        if (!this.usedContentIndexes.includes(i)) {
          availableIndexes.push(i)
        }
      }

      if (availableIndexes.length === 0) {
        // 如果所有内容都已使用，重置已使用列表
        this.usedContentIndexes = []
        return this.getRandomContentIndex()
      }

      // 随机选择一个可用的内容索引
      const randomIndex = Math.floor(Math.random() * availableIndexes.length)
      return availableIndexes[randomIndex]
    },
    getRandomContentIndex() {
      return Math.floor(Math.random() * this.driftBottleList.length)
    },
    getNonOverlappingTop() {
      if (this.activeBottles.length === 0) {
        return this.getRandomTop()
      }

      let attempts = 0
      const maxAttempts = 20

      while (attempts < maxAttempts) {
        const candidateTop = this.getRandomTop()
        let isOverlapping = false

        // 检查是否与现有漂流瓶重叠
        for (const existingBottle of this.activeBottles) {
          const existingTop = existingBottle.top

          // 检查垂直方向是否重叠（考虑安全间距）
          if (Math.abs(candidateTop - existingTop) < this.bottleHeight + 20) {
            isOverlapping = true
            break
          }
        }

        if (!isOverlapping) {
          return candidateTop
        }

        attempts++
      }

      // 如果多次尝试后仍然找不到不重叠的位置，返回一个随机位置
      return this.getRandomTop()
    },
    getRandomTop() {
      // 在漂流瓶容器高度范围内随机位置，确保漂流瓶完全在容器内
      const minTop = 0
      const maxTop = this.containerHeight - this.bottleHeight
      return minTop + Math.random() * maxTop
    },
    getRandomDuration() {
      // 随机移动时间 12-18秒
      return 12 + Math.random() * 6
    },
    async submitIssue() {
      if (!this.themeText.trim() || !this.issueText.trim()) {
        this.$myMessage({
          type: "font-error",
          message: "请输入主题和内容",
        })
        return
      }

      const { data } = await bottleAdd({
        title: this.themeText,
        content: this.issueText,
        anon: this.isAnonymous ? 1 : 0,
      })
      if (data.code == this.$global.successCode) {
        this.$myMessage({
          type: "font-success",
          message: data.msg,
        })
        this.themeText = ""
        this.issueText = ""
        this.issueShow = false
      }
    },
    async getDriftBottleList() {
      const { data } = await bottleList()
      if (data.code == this.$global.successCode) {
        this.driftBottleList = data.data
        this.randomIdList = data.gather
      }
    },
    async getMyBottleList() {
      const { data } = await myBottleList({
        type:
          this.classActive == 1 ? "pub" : this.classActive == 2 ? "get" : "g",
        page: 1,
        page_size: 99999,
      })
      if (data.code == this.$global.successCode) {
        this.myBottleListData = data.data
      }
    },
    async getBottleInfoData(id) {
      const { data } = await bottleInfo({
        id: id,
      })
      if (data.code == this.$global.successCode) {
        this.bottleInfoData = data.data
      }
    },
    async addComment() {
      if (!this.commentText.trim()) {
        this.$myMessage({
          type: "font-error",
          message: "请输入评论内容",
        })
        return
      }
      const { data } = await bottleCommentAdd({
        id: this.bottleInfoData.id,
        comment: this.commentText,
        anon: this.nmfbTF ? 1 : 0,
      })
      if (data.code == this.$global.successCode) {
        this.$myMessage({
          type: "font-success",
          message: data.msg,
        })
        this.commentText = ""
        this.getBottleInfoData(this.bottleInfoData.id)
      }
    },
    async delMyBottle(id) {
      this.$popup({
        title: "提示",
        content: "确定要删除本条漂流瓶吗？",
        saveFoo: async () => {
          const { data } = await bottleDel({
            ids: id,
          })
          if (data.code == this.$global.successCode) {
            this.$myMessage({
              type: "font-success",
              message: data.msg,
            })
            this.getMyBottleList()
          }
        },
      })
    },
    async delComment(comment_id) {
      this.$popup({
        title: "提示",
        content: "确定要删除本条评论吗？",
        saveFoo: async () => {
          const { data } = await bottleCommentDel({
            ids: comment_id,
          })
          if (data.code == this.$global.successCode) {
            this.$myMessage({
              type: "font-success",
              message: data.msg,
            })
            this.getBottleInfoData(this.bottleInfoData.id)
          }
        },
      })
    },
  },
  beforeDestroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval)
    }
    window.removeEventListener("resize", this.updateContainerSize)
  },
}
</script>

<style scoped lang="scss">
.index {
  width: 100vw;
  height: 100vh;
  background-image: url(@/assets/img/front/EmotionSquare/bg.png);
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;

  .top_box {
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    left: 50px;
    right: 50px;
    top: 50px;
    z-index: 9;

    -webkit-app-region: no-drag;
    > div {
      display: flex;
      .back {
        width: 70px;
        height: 70px;
        background-image: url(@/assets/img/front/EmotionSquare/back.png);
        background-size: 100% 100%;
        margin-right: 20px;
      }
      .square_plp,
      .my_plp {
        height: 70px;
        width: 250px;
        background-image: url(@/assets/img/front/EmotionSquare/btnbg.png);
        background-size: 100% 100%;
        line-height: 65px;
        > img {
          width: 42px;
          height: 34px;
          margin: 0 2px 0 20px;
        }
        font-size: 22px;
        font-family: "ziyuanyuanti500W";
        font-weight: 500;
        color: #ffffff;
        &.my_plp {
          padding-left: 100px;
          box-sizing: border-box;
          background-image: url(@/assets/img/front/EmotionSquare/myplp.png);
        }
      }
    }
  }

  .btn_box {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    > div {
      width: 312px;
      height: 127px;
      text-align: center;
      line-height: 115px;
      margin: 0 20px;
      background-size: 100% 100%;
      font-size: 40px;
      color: #fff;
      font-family: "ziyuanyuanti500W";
      &:nth-child(1) {
        background-image: url(@/assets/img/front/EmotionSquare/收取.png);
      }
      &:nth-child(2) {
        background-image: url(@/assets/img/front/EmotionSquare/投放.png);
      }
    }
  }

  .drift_bottle_wrap {
    position: absolute;
    left: 50px;
    right: 50px;
    top: 160px;
    border-radius: 20px;
    height: 720px;
    overflow: hidden;

    .driftBottle {
      width: 350px;
      height: 85px;
      background-image: url(@/assets/img/front/EmotionSquare/plp.png);
      background-size: 100% 100%;
      padding: 0 13px 10px 13px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      position: absolute;
      right: -350px; /* 从右侧开始，完全在容器外 */
      animation: driftLeft linear forwards;

      > .phImg {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #fff;
      }
      > .moreImg {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
      > .content {
        width: 220px;
        font-size: 22px;
        font-family: "ziyuanyuanti500W";
        font-weight: 500;
        color: #092545;
        margin: 0 auto;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      > .plpImg {
        width: 154px;
        height: 126px;
        position: absolute;
        top: 85px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

  .myDrift_wrap {
    width: 1250px;
    height: 753px;
    background: #ffffff70;
    border-radius: 25px;
    padding: 0 35px;
    box-sizing: border-box;
    .myDrift_title {
      width: 100%;
      height: 126px;
      background-size: 100% 100%;
      background-image: url(@/assets/img/front/EmotionSquare/myDrift_title.png);
      position: relative;
      text-align: center;
      line-height: 150px;
      font-size: 32px;
      font-family: "ziyuanyuanti500W";
      font-weight: 500;
      color: #ffffff;
      > .close {
        width: 40px;
        height: 40px;
        background-image: url(@/assets/img/front/EmotionSquare/close.png);
        background-size: 100% 100%;
        position: absolute;
        top: 60px;
        right: 30px;
      }
    }
    .drift_list {
      height: 590px;
      width: 100%;
      background-color: #ebf3ff;
      border-radius: 0 0 25px 25px;
      .issue_gather {
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        > button {
          width: 200px;
          height: 60px;
          font-size: 22px;
          font-family: "ziyuanyuanti500W";
          font-weight: 500;
          color: #fff;
          background-color: #bebebe;
          border-radius: 30px;
          margin: 0 15px;
          &.active {
            background-color: #0370ff;
          }
        }
      }
      .teble_head {
        padding-right: 10px;
      }
      .teble_head,
      .table_row {
        height: 50px;
        font-size: 20px;
        font-family: "ziyuanyuanti500W";
        display: flex;
        align-items: center;
        text-align: center;
        box-sizing: border-box;
        border-bottom: 1px solid #fff;
        > div {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .w10 {
          width: 10%;
        }
        .w20 {
          width: 20%;
          > .del,
          .look {
            width: 90px;
            height: 40px;
            border-radius: 20px;
            font-size: 20px;
            color: #fff;
            font-family: "ziyuanyuanti400W";
            margin: 0 5px;
          }
          > .look {
            background: #0370ff;
          }
          > .del {
            background: #ff3636;
          }
        }
        .w30 {
          width: 30%;
          text-align: left;
        }
      }
      .table_row {
        font-family: "ziyuanyuanti400W";
        &:hover {
          background: #a0c9ff;
        }
      }
      .scroll_wrap {
        width: 100%;
        height: 460px;
        border-radius: 0 0 25px 25px;
        overflow-y: scroll;
        /* 蓝色滚动条样式 */
        &::-webkit-scrollbar {
          width: 10px; /* 滚动条宽度 */
          height: 8px; /* 水平滚动条高度 */
        }
        &::-webkit-scrollbar-thumb {
          background: #007bff; /* 蓝色滚动条滑块 */
          border-radius: 10px;
          display: block !important;
        }
        &::-webkit-scrollbar-thumb:hover {
          background: #0056b3; /* 鼠标悬停时更深的蓝色 */
        }
      }

      .anonymity {
        padding: 30px 0;
        display: flex;
        align-items: center;
        font-size: 22px;
        color: #0370ff;
        font-family: "ziyuanyuanti500W";
        margin-left: 40px;

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 22px;
          font-family: "ziyuanyuanti500W";
          color: #333333;

          .checkbox-input {
            display: none;

            &:checked + .checkbox-custom {
              background-color: #0370ff;
              border-color: #0370ff;

              &::after {
                content: "✓";
                color: white;
                font-size: 14px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }
            }
          }

          .checkbox-custom {
            width: 18px;
            height: 18px;
            border: 2px solid #bebebe;
            border-radius: 3px;
            margin-right: 10px;
            margin-top: 3px;
            position: relative;
            transition: all 0.3s ease;

            &:hover {
              border-color: #0370ff;
            }
          }
        }
      }
      .theme_wrap {
        display: flex;
        align-items: center;
        width: 100%;
        margin-bottom: 20px;
        .theme_title {
          width: 80px;
          font-size: 0.22rem;
          color: #0370ff;
          font-family: "ziyuanyuanti500W";
          margin: 0 0 0 40px;
        }
        ::v-deep .el-input__inner {
          width: 96%;
          border-radius: 10px;
        }
      }
      .textarea_wrap {
        width: 1100px;
        height: 340px;
        background: #ffffff;
        border-radius: 11px;
        margin-left: 40px;
        border-radius: 20px;
        ::v-deep .el-textarea__inner {
          height: 340px;
          resize: none;
          font-size: 22px;
          font-family: "ziyuanyuanti400W";
          border-radius: 20px;
        }
      }

      > .submit {
        width: 180px;
        height: 60px;
        background: #0370ff;
        border-radius: 26px;
        font-size: 22px;
        font-family: "ziyuanyuanti500W";
        color: #fff;
        margin: 20px auto;
        line-height: 60px;
        text-align: center;
      }

      .flex_wrap {
        display: flex;
        .left_nimText {
          font-size: 20px;
          font-family: "ziyuanyuanti500W";
          font-weight: 500;
          text-align: left;
          color: #0270ff;
          padding: 30px 20px 0 40px;
        }
        .right_comment {
          width: 920px;
          height: 460px;
          // background-color: #007bff;
          margin: 25px 0 0 0;
          box-sizing: border-box;
          overflow-y: scroll;
          overflow-x: hidden;
          /* 蓝色滚动条样式 */
          &::-webkit-scrollbar {
            width: 10px; /* 滚动条宽度 */
            height: 8px; /* 水平滚动条高度 */
          }
          &::-webkit-scrollbar-thumb {
            background: #007bff; /* 蓝色滚动条滑块 */
            border-radius: 10px;
            display: block !important;
          }
          &::-webkit-scrollbar-thumb:hover {
            background: #0056b3; /* 鼠标悬停时更深的蓝色 */
          }

          .plp_title {
            font-size: 22px;
            font-family: "ziyuanyuanti500W";
            font-weight: 500;
            text-align: left;
            color: #333333;
            line-height: 36px;
            > p {
              font-size: 20px;
              font-family: "ziyuanyuanti500W";
              font-weight: 500;
              text-align: left;
              color: #9d9d9d;
            }
          }
          .others_comment {
            width: 900px;
            padding: 28px;
            box-sizing: border-box;
            background: #fff;
            border-radius: 12px;
            margin-top: 20px;
            display: flex;
            position: relative;
            .others_left {
              font-size: 18px;
              font-family: "ziyuanyuanti500W";
              font-weight: 500;
              text-align: left;
              color: #0270ff;
              margin-top: 5px;
            }
            .others_right {
              width: 710px;
              .plp_title {
                font-size: 20px;
                color: #555555;
                > p {
                  font-size: 16px;
                }
              }
            }
            .del_box {
              color: #ff8686;
              font-size: 14px;
              display: flex;
              align-items: center;
              position: absolute;
              right: 20px;
              bottom: 10px;
              > img {
                width: 14px;
                height: 15px;
              }
            }
          }
        }
      }

      .input_wrap {
        width: 1180px;
        height: 80px;
        background: #ffffff;
        border-radius: 26px;
        margin-top: 24px;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        > input {
          width: 830px;
          height: 60px;
          background: #e2e2e2;
          border-radius: 26px;
          margin-right: 20px;
          font-size: 22px;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 22px;
          font-family: "ziyuanyuanti500W";
          color: #333333;

          .checkbox-input {
            display: none;

            &:checked + .checkbox-custom {
              background-color: #0370ff;
              border-color: #0370ff;

              &::after {
                content: "✓";
                color: white;
                font-size: 14px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }
            }
          }

          .checkbox-custom {
            width: 18px;
            height: 18px;
            border: 2px solid #bebebe;
            border-radius: 3px;
            margin-right: 10px;
            margin-top: 3px;
            position: relative;
            transition: all 0.3s ease;

            &:hover {
              border-color: #0370ff;
            }
          }
        }
        > button {
          width: 180px;
          height: 60px;
          background: #0370ff;
          border-radius: 26px;
          margin: 0 25px;
          font-size: 22px;
          font-family: "ziyuanyuanti500W";
          font-weight: 500;
          color: #ffffff;
        }
      }
    }
  }
}

@keyframes driftLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(
      calc(-100vw - 350px)
    ); /* 移动到左侧超出漂流瓶宽度再消失 */
  }
}
</style>
