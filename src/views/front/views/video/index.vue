<template>
  <div class="muscle_video" @mouseup="isChange = false">
    <div class="content">
      <div class="module_title">视频详情</div>
      <div class="class_wrap">
        <div class="line"></div>
        <div class="scroll_box">
          <button
            v-for="(i, index) in videoClass"
            :key="index"
            :class="page.video_class_id == i.id ? 'active' : ''"
            @click="clickClass(i.id)"
          >
            {{ i.title }}
          </button>
        </div>
      </div>
      <div class="content_bottom">
        <div class="top">
          <div class="num">
            视频数量：<span>{{ page.total }}</span
            >个
          </div>
          <div class="title">选择视频观看</div>
          <div class="search">
            <input type="text" placeholder="请输入" v-model="page.title" />
            <button @click="getTableList()">搜索</button>
          </div>
        </div>
        <div class="line"></div>
        <div class="list" v-loading="listLoading">
          <div class="item">
            <div
              class="i"
              v-for="(i, index) in list"
              :key="index"
              @click="clickVideo(i)"
            >
              <img :src="$ip + i.img_url" alt="" />
              <div>
                <img src="@/assets/img/front/video/播放.png" alt="" /><span>{{
                  i.title
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination">
          <button class="sye" @click="getTableList(1)">首页</button>
          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="getTableList"
            :total="page.total"
            :page-size="8"
            :current-page="page.page"
            prev-text="<<上一页"
            next-text="下一页>>"
          >
          </el-pagination>
          <button class="wye" @click="getTableList(Math.ceil(page.total / 8))">
            尾页
          </button>
        </div>
      </div>
    </div>
    <AnimationPopup :show="isShow">
      <div class="pop" @mouseup="end">
        <div class="video">
          <video
            :src="$ip + currObj.video_url"
            ref="video"
            @canplay="canplay"
            @timeupdate="timeupdateFoo"
            @ended="videoEnded"
            preload="auto"
            :poster="$ip + currObj.img_url"
            disablePictureInPicture
            oncontextmenu="return false"
            controlslist="nodownload noremoteplayback disablePictureInPicture noplaybackrate"
          ></video>
          <div class="progress_bar">
            <el-slider
              v-model="videoProgress"
              :show-tooltip="false"
              :min="0"
              :max="Number(currObj.duration)"
              :step="0.1"
              @change="progressChange"
              @input="sliderStop"
              @mousedown.native="isChange = true"
            >
            </el-slider>
          </div>
        </div>
        <div class="pop_bottom">
          <div
            class="play_pause"
            @click.stop="
              () => {
                playAndPause = !playAndPause
                playVideo()
              }
            "
          >
            <img
              v-if="!playAndPause"
              src="@/assets/img/front/video/pause.png"
              alt=""
              style="width: 0.12rem; height: 0.16rem"
            />
            <img
              src="@/assets/img/front/video/play.png"
              alt=""
              style="width: 0.08rem; height: 0.13rem"
              v-else
            />
          </div>
          <div class="time">
            {{ videoProgress ? timeStr(videoProgress) : "00:00"
            }}<span
              >/{{
                currObj.duration ? timeStr(currObj.duration) : "00:00"
              }}</span
            >
          </div>
          <div class="name">{{ currObj.title }}</div>
          <div class="volume">
            <div @click="isVolume = !isVolume">
              <img src="@/assets/img/front/video/音量.png" alt="" />
              音量
            </div>

            <!-- <div class="volume_box">
              <volumeVue
                :value="volumeProgress"
                :isShowVolume="isVolume"
                :dragging="dragging"
                @volumeChange="volumeChange"
                @draggingChange="
                  (val) => {
                    dragging = val;
                  }
                "
              />
            </div> -->

            <div class="volume_box" v-show="isVolume">
              <p class="number">{{ volumeProgress }}%</p>
              <el-slider
                v-model="volumeProgress"
                :show-tooltip="false"
                :max="100"
                :step="1"
                vertical
                height="1.8rem"
                @change="volumeChange"
              >
              </el-slider>
              <img class="icon" src="@/assets/img/front/video/音量.png" />
            </div>
          </div>

          <div class="full" @click="clickFull">
            <img src="@/assets/img/front/video/全屏.png" alt="" />
            全屏
          </div>
          <div class="colse" @click="isShow = false">
            <img src="@/assets/img/front/video/关闭.png" alt="" />
            关闭
          </div>
        </div>
      </div>
    </AnimationPopup>
  </div>
</template>

<script>
import { videoClassBackApiList, videoBackApiList } from "@/server/api/video"
export default {
  data() {
    return {
      isShow: false,
      isVolume: false, //是否显示音量弹框
      dragging: false, //是否拖动音量
      isChange: false, //是否正在被拖动
      videoProgress: 0,
      volumeProgress: 0,
      page: {
        page: 1,
        page_size: 8,
        video_class_id: "",
        total: 0,
        title: "",
      },
      list: [],
      videoClass: [], //分类列表
      playAndPause: false,
      idx: 0,
      currObj: {},
      isFull: false,
      listLoading: false,
    }
  },
  components: {},
  computed: {},
  watch: {
    isShow(val) {
      if (!val) {
        this.videoProgress = 0
        this.currObj = {}
        this.$forceUpdate()
      }
    },
  },
  methods: {
    clickFull() {
      let video = this.$refs.video
      if (!document.fullscreenElement) {
        video.requestFullscreen().catch((err) => {
          console.error(err.message)
        })
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
    },
    clickVideo(i) {
      this.isShow = true
      this.isChange = false
      this.$nextTick(function () {
        this.currObj = i
        this.canplay()
      })
    },
    /* -----音量开始----- */
    volumeChange(val) {
      //console.log(val);
      this.volumeProgress = val
      const video = this.$refs.video
      video.volume = this.volumeProgress / 100
      this.$store.getters.sysInfo.sphere_effects = val
    },
    end() {
      if (this.isVolume) {
        this.dragging = false
      }
    },
    changePage(val) {
      console.log(val)
    },
    timeStr(val) {
      var duration = parseInt(val)
      var minute = parseInt(duration / 60)
      var sec = (duration % 60) + ""
      var isM0 = ":"
      if (minute === 0) {
        minute = "00"
      } else if (minute < 10) {
        minute = "0" + minute
      }
      if (sec.length === 1) {
        sec = "0" + sec
      }
      return minute + isM0 + sec
    },
    sliderStop() {
      if (this.list.length == 0 && !this.currObj.duration) return
      if (this.isChange) {
        this.$refs.video.pause()
        this.playPause = false
      }
    },
    timeupdateFoo() {
      if (this.playAndPause) {
        this.videoProgress = Number(this.$refs.video.currentTime.toFixed(1))
      } else {
        setTimeout(() => {
          this.videoProgress = Number(this.$refs.video.currentTime.toFixed(1))
        }, 800)
      }
    },
    //进度条
    progressChange(v) {
      if (this.list.length == 0 && !this.currObj.duration) return
      this.$refs.video.currentTime = v
      this.videoProgress = v
      setTimeout(() => {
        this.playAndPause = true
        this.playVideo()
      }, 200)
    },

    //播放暂停
    playVideo() {
      if (this.list.length == 0 && !this.currObj.duration) return
      if (this.playAndPause) {
        this.$nextTick(() => {
          this.$refs.video.play()
        })
        this.playAndPause = true
      } else {
        this.$refs.video.pause()
        this.playAndPause = false
      }
    },
    //播放结束
    videoEnded() {
      this.videoProgress = Number(this.currObj.duration)
      this.playAndPause = false
    },
    //初始化
    canplay() {
      const video = this.$refs.video
      this.volumeProgress = this.$store.getters.sysInfo.sphere_effects
      video.volume = this.volumeProgress / 100
      //this.videoProgress = 0
      this.$nextTick(() => {
        this.$refs.video.play()
        this.playAndPause = true
      })
    },
    clickClass(id) {
      this.page.video_class_id = id
      this.page.page = 1
      this.page.title = ""
      this.getTableList()
    },
    async getVideoClassList() {
      const res = await videoClassBackApiList()
      if (res.data.code == 200) {
        this.videoClass = res.data.data
        console.log(this.videoClass)
        this.videoClass.length
          ? (this.page.video_class_id = this.videoClass[0].id)
          : ""
        this.getTableList(1)
      }
    },
    async getTableList(page) {
      if (page) {
        this.page.page = page
      }
      const params = {
        ...this.page,
      }
      this.listLoading = true
      try {
        const res = await videoBackApiList(params)
        if (res.data.code == 200) {
          this.page.page = res.data.data.current_page
          this.page.total = res.data.data.total
          this.list = res.data.data.data
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.listLoading = false
      }
    },
  },
  mounted() {},
  created() {
    this.getVideoClassList()
  },
  beforeDestroy() {},
}
</script>

<style lang="scss" scoped>
.muscle_video {
  width: 100%;
  height: 100%;
  padding-top: 160px;
  box-sizing: border-box;
  position: absolute;
  .content {
    width: 1580px;
    height: 872px;
    border-radius: 20px;
    padding: 70px 0 0 100px;
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    background-image: url(@/assets/img/front/index/kuang.png);
    background-size: 100% 100%;
    z-index: 3;
    .module_title {
      position: absolute;
      top: 90px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 32px;
      height: 33px;
      line-height: 33px;
      font-family: "ziyuanyuanti600W";
      color: #fff;
      background: linear-gradient(0deg, #85a7ff 0%, #ffffff 100%);
      -webkit-background-clip: text;
      color: transparent;
    }
    .class_wrap {
      width: 180px;
      height: 600px;
      position: relative;
      padding: 160px 0 0 0;
      box-sizing: border-box;

      .scroll_box {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        &::-webkit-scrollbar {
          display: none;
        }
        > button {
          width: 140px;
          height: 50px;
          border-radius: 25px;
          font-size: 20px;
          color: #ffffff;
          letter-spacing: 1px;
          font-family: "ziyuanyuanti400W";
          line-height: 40px;
          margin-bottom: 20px;
          background: #00000000;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &.active {
            background: #0080ff;
          }
        }
      }

      .line {
        position: absolute;
        right: 0;
        top: 100px;
        width: 1px;
        height: 440px;
        background-image: url(@/assets/img/front/video/line.png);
        background-size: 100% 100%;
      }
    }
    .content_bottom {
      width: 1150px;
      height: 500px;
      background-size: contain;
      margin: 100px 0 0 80px;
      box-sizing: border-box;
      position: relative;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 1100px;
        .num {
          height: 40px;
          font-size: 18px;
          line-height: 50px;
          color: #fff;
          font-family: "ziyuanyuanti400W";
          span {
            color: #00a6fc;
          }
        }
        .title {
          font-size: 24px;
          font-family: "ziyuanyuanti500W";
          color: #fff;
          margin-right: 50px;
        }
        .search {
          display: flex;
          align-items: center;
          // background: rgba(255, 255, 255, 0.15);
          background: #112340;
          width: 250px;
          height: 40px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          input {
            width: 196px;
            height: 40px;
            color: #fff;
            border-radius: 20px;
            font-size: 16px;
            padding-left: 25px;
            box-sizing: border-box;
            // background: url("@/assets/img/front/music/4.png") no-repeat;
            background-size: 17px 18px;
            background-position: 18px center;
            background: #112340;
            &::placeholder {
              color: rgba(255, 255, 255, 0.5);
            }
          }
          button {
            width: 50px;
            height: 30px;
            background: #00a6fc;
            border-radius: 18px;
            font-size: 14px;
            color: #ffffff;
            text-align: center;
          }
        }
      }
      .line {
        width: 1104px;
        height: 1px;
        background: #184DE3;
        margin: 30px 0 50px;
      }
      .list {
        width: 1105px;
        height: 390px;
        ::v-deep .el-loading-mask {
          border-radius: 17px;
          background: #00000050;
        }
        .item {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          .i {
            width: 250px;
            height: 160px;
            border-radius: 17px;
            overflow: hidden;
            margin: 0 35px 35px 0;
            position: relative;
            &:nth-child(4n) {
              margin-right: 0;
            }
            > img {
              display: block;
              width: 100%;
              height: 100%;
              border-radius: 20px;
            }
            div {
              display: flex;
              align-items: center;
              width: 100%;
              background: #003f6d;
              padding: 0 16px;
              box-sizing: border-box;
              height: 40px;
              line-height: 40px;
              position: absolute;
              bottom: 0px;
              font-size: 16px;
              img {
                display: block;
                width: 25px;
                height: 25px;
                margin-right: 10px;
              }
              span {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #fff;
              }
            }
          }
        }
      }

      .pagination {
        position: absolute;
        right: 50px;
        bottom: -80px;
        display: flex;
        align-items: center;
        .sye,
        .wye {
          width: 80px;
          height: 40px;
          background: #002b5f;
          border: 1px solid #0abdff;
          border-radius: 6px;
          box-shadow: 0px 0px 20px 0px #00baff inset;
          color: #fff;
          font-size: 14px;
          font-family: "ziyuanyuanti400W";
        }

        ::v-deep .number {
          color: #ffffff;
          width: 40px;
          height: 40px;
          background: #002b5f;
          border: 1px solid #0abdff;
          border-radius: 6px;
          box-shadow: 0px 0px 20px 0px #00baff inset;
          line-height: 40px;
          font-family: "ziyuanyuanti400W";
        }
        ::v-deep .el-pager {
          .active {
            color: #fff;
            background: #002b5f;
            border: 1px solid #ff9600;
            border-radius: 6px;
            box-shadow: 0px 0px 20px 0px #ff9500 inset;
          }
        }
        ::v-deep .btn-next {
          color: #ffffff;
          width: 110px;
          height: 40px;
          background: #002b5f;
          border: 1px solid #0abdff;
          border-radius: 6px;
          box-shadow: 0px 0px 20px 0px #00baff inset;
          font-family: "ziyuanyuanti400W";
        }
        ::v-deep .btn-prev {
          color: #ffffff;
          width: 110px;
          height: 40px;
          background: #002b5f;
          border: 1px solid #0abdff;
          border-radius: 6px;
          box-shadow: 0px 0px 20px 0px #00baff inset;
          font-family: "ziyuanyuanti400W";
        }
        ::v-deep .btn-quicknext {
          color: #ffffff;
          width: 40px;
          height: 40px;
          background: #002b5f;
          border: 1px solid #0abdff;
          border-radius: 6px;
          box-shadow: 0px 0px 20px 0px #00baff inset;
          line-height: 40px;
        }
        ::v-deep .btn-quickprev {
          color: #ffffff;
          width: 40px;
          height: 40px;
          background: #002b5f;
          border: 1px solid #0abdff;
          border-radius: 6px;
          box-shadow: 0px 0px 20px 0px #00baff inset;
          line-height: 40px;
        }
      }
    }
  }
  .pop {
    width: 1055px;
    height: 683px;
    background: url("@/assets/img/front/video/video_bg.png") no-repeat;
    background-size: contain;
    padding: 30px 30px 0 28px;
    box-sizing: border-box;
    .video {
      width: 100%;
      height: 559px;
      background: #ffffff;
      border-radius: 40px 40px 0px 0px;
      position: relative;
      video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 40px 40px 0px 0px;
      }
      .progress_bar {
        width: 100%;
        height: 2px;
        position: absolute;
        bottom: 0;
        ::v-deep .el-slider__runway {
          height: 2px;
          margin: 0;
          border-radius: 0px;
          background: #84878b;
        }
        ::v-deep .el-slider__bar {
          background-color: #00baff;
          height: 2px;
          //border-radius: 5px;
        }
        ::v-deep .el-slider__button-wrapper {
          //display: none;
          top: -17px;
        }

        ::v-deep .el-slider__button {
          //display: none;
          width: 12px;
          height: 12px;
          background: linear-gradient(
              0deg,
              rgba(6, 27, 52, 0.2) 0%,
              rgba(0, 163, 255, 0.2) 100%
            ),
            #159be0;
          border: 1px solid #00baff;
        }
      }
    }
    .pop_bottom {
      display: flex;
      align-items: center;
      padding: 10px 0 0 20px;
      .play_pause {
        width: 41px;
        height: 41px;
        background: #01a3f9;
        box-shadow: 0px 0px 10px NaNpx rgba(0, 165, 251, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      .time {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #00baff;
        margin-left: 20px;
        span {
          color: #015c7e;
        }
      }
      .name {
        width: 500px;
        margin-left: 15px;
        font-size: 16px;
        color: #00baff;
      }
      .volume,
      .full,
      .colse {
        display: flex;
        align-items: center;
        color: #01a3f9;
        font-size: 18px;
        margin-left: 35px;
        img {
          margin-right: 5px;
        }
      }
      .volume {
        position: relative;
        div {
          display: flex;
          align-items: center;
          img {
            width: 16px;
            height: 15px;
          }
        }
        .volume_box {
          width: 80px;
          height: 300px;
          border-radius: 10px;
          position: absolute;
          right: -310px;
          bottom: -30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #00000050;
          .number {
            position: absolute;
            top: 20px;
            font-size: 16px;
            font-family: Resource Han Rounded CN, Resource Han Rounded CN-Bold;
            color: #fefefe;
          }
          .icon {
            width: 24px;
            height: 23px;
            position: absolute;
            bottom: 15px;
          }
          ::v-deep .el-slider {
            .el-slider__runway {
              width: 40px;
              height: 200px;
              margin: 0;
              border-radius: 5px;
              background: #0d3c6a;
              .el-slider__bar {
                width: 40px;
                border-radius: 5px;
                background: linear-gradient(0deg, #1b64fc 0%, #00d2ff 100%);
              }
              .el-slider__button-wrapper {
                width: 40px;
                left: 0;
                .el-slider__button {
                  width: 40px;
                  display: none;
                }
              }
            }
          }
        }
      }
      .full {
        img {
          width: 18px;
          height: 17px;
        }
      }
      .colse {
        img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}
</style>
