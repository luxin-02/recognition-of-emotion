<template>
  <div class="index">
    <div class="music_wrap">
      <div class="module_title">音乐详情</div>
      <button v-show="$store.getters.musicObj.closeBtn" class="close" @click="$store.getters.musicObj.show = false">
        X
      </button>

      <div class="class_wrap">
        <div class="line"></div>
        <div class="scroll_box">
          <button
            @click="
              () => {
                classBtn(item.id, 1)
                currentMusic = {}
                playPause = false
                musicActive = ''
              }
            "
            :class="['class', item.id == classActive ? 'active' : '']"
            v-for="(item, i) in classList"
            :key="i"
          >
            {{ item.title }}
          </button>
        </div>
      </div>

      <div class="list_wrap">
        <!-- <div class="zzbf">{{ playPause ? "正在播放:" : "暂未播放" }}</div>
      <div class="namewrap">
        <p class="musicname">
          {{ currentMusic.id ? currentMusic.title : "—— - ——" }}
        </p>
        <p class="musictime">
          {{
            currentMusic.id
              ? "总时长" + $formatTime(currentMusic.duration, "HH:mmm:sss")
              : ""
          }}
        </p>
      </div> -->

        <div class="search_wrap">
          <el-input placeholder="搜索歌曲" v-model="searchText" prefix-icon="el-icon-search">
            <el-button slot="append" @click="classBtn(classActive, 1)">搜索</el-button>
          </el-input>
          <button class="sx" @click="playMode = 'order'" :class="[playMode == 'order' ? 'active' : '']">
            <img src="@/assets/img/front/music/顺序.png" />顺序播放
          </button>
          <button class="sj" @click="playMode = 'random'" :class="[playMode == 'random' ? 'active' : '']">
            <img src="@/assets/img/front/music/随机.png" />随机播放
          </button>
        </div>

        <div class="list_box">
          <ul>
            <li>
              <div class="xh h50 lfbr">序号</div>
              <div class="name h50">名称</div>
              <div class="duration h50">时长</div>
              <div class="cz h50 ribr">操作</div>
            </li>
            <li
              class="border_b"
              :class="['border_b', item.id == musicActive ? 'active' : '']"
              v-for="(item, i) in musicList.list"
              :key="i"
              @click="musicBtn(item, i)"
            >
              <div class="xh">{{ item.no }}</div>
              <div class="name">{{ item.title }}</div>
              <div class="duration">
                {{ $formatTime(item.duration, "HH:mmm:sss") }}
              </div>
              <div class="cz" v-if="playPause && item.id == currentMusic.id" style="color: #00a6fc">正在播放</div>
              <div class="cz" v-else>开始播放</div>
            </li>
          </ul>

          <div class="total">
            {{ musicList.page }}
            <span style="color: #fff">/{{ Math.ceil(this.musicList.total / 5) }}</span>
          </div>
          <div class="page_turning">
            <button @click="pageChange('pre')">上一页</button>
            <button @click="pageChange('next')">下一页</button>
          </div>
        </div>
      </div>

      <div class="playing_status">
        <div class="vinyl_record_box">
          <img v-if="!currentMusic.img_url" class="vinyl_record_img" src="@/assets/img/front/music/唱片.png" />
          <img v-else class="vinyl_record_img" :src="$ip + currentMusic.img_url" />
        </div>
        <div class="introductory">
          <div class="music_name">
            {{ currentMusic.id ? "名称:" + currentMusic.title : "" }}
          </div>
          <!-- <div class="introductory_box">
          {{ currentMusic.id ? currentMusic.title : "" }}
        </div> -->
        </div>

        <div class="schedule_box" v-if="currentMusic.id">
          <span>
            {{ $formatTime(MusicProgress, "HH:mmm:sss") }}
            <i style="color: #fff">/{{ $formatTime(currentMusic.duration, "HH:mmm:sss") }} </i>
          </span>

          <div class="slider">
            <el-slider
              v-model="MusicProgress"
              :show-tooltip="false"
              :min="1"
              :max="currentMusic.duration"
              :step="0.1"
              @change="progressChange"
            ></el-slider>
          </div>
        </div>

        <div class="action_bar">
          <div @click="playMusic">
            <img v-if="playPause" src="@/assets/img/front/music/播放.png" />
            <img v-else src="@/assets/img/front/music/暂停.png" />
            暂停播放
          </div>
          <i class="line"></i>
          <div @click="Previous">上一首</div>
          <i class="line"></i>
          <div @click="nextSong">下一首</div>
          <i class="line"></i>
          <div @click="enterFullScreen">
            <img style="width: 0.18rem; height: 0.18rem" src="@/assets/img/front/music/全屏.png" />全屏
          </div>
        </div>

        <div class="volume_box" v-show="volumeShow">
          <p class="number">{{ musicVolume }}%</p>
          <el-slider
            v-model="musicVolume"
            :show-tooltip="false"
            :max="100"
            :step="1"
            vertical
            height="1.8rem"
            @change="volumeChange"
          >
          </el-slider>
          <img class="icon" src="@/assets/img/front/music/音量.png" />
        </div>
      </div>
    </div>

    <AnimationPopup :show.sync="fullShow">
      <div class="full_music">
        <div class="full_disc">
          <img v-if="!currentMusic.img_url" src="@/assets/img/front/music/唱片.png" />
          <img v-else :src="$ip + currentMusic.img_url" />
        </div>

        <div class="full_slider">
          <el-slider
            v-model="MusicProgress"
            :show-tooltip="false"
            :min="1"
            :max="currentMusic.duration"
            :step="0.1"
            @change="progressChange"
          ></el-slider>
        </div>

        <div class="full_action_bar">
          <div class="full_duration">
            <i> {{ $formatTime(MusicProgress, "HH:mmm:sss") }}</i
            >/{{ $formatTime(currentMusic.duration, "HH:mmm:sss") }}
          </div>
          <div class="full_play_pause">
            <img @click="Previous" src="@/assets/img/front/music/full_上一首.png" />
            <img v-show="!playPause" @click="playMusic" src="@/assets/img/front/music/full_暂停.png" />
            <img v-show="playPause" @click="playMusic" src="@/assets/img/front/music/full_播放.png" />
            <img @click="nextSong" src="@/assets/img/front/music/full_下一首.png" />
          </div>
          <div class="sound_close">
            <div class="full_sound" @click="fullVolumeShow = !fullVolumeShow">声音</div>
            <div class="full_close" @click="fullShow = false">退出全屏</div>
          </div>
        </div>

        <div class="dynamic_effect">
          <img src="@/assets/img/front/music/音符1.gif" />
          <img src="@/assets/img/front/music/音符2.gif" />
        </div>

        <div class="full_musicName">
          {{ currentMusic.id ? currentMusic.title : "" }}
        </div>

        <div class="volume_box" v-show="fullVolumeShow">
          <p class="number">{{ musicVolume }}%</p>
          <el-slider
            v-model="musicVolume"
            :show-tooltip="false"
            :max="100"
            :step="1"
            vertical
            height="1.8rem"
            @change="volumeChange"
          >
          </el-slider>
          <img class="icon" src="@/assets/img/front/music/音量.png" />
        </div>
      </div>
    </AnimationPopup>

    <audio
      v-show="false"
      ref="audioref"
      id="audio"
      :src="$ip + currentMusic.music_url"
      @timeupdate="timeupdateFoo"
      @canplay="canplay"
      @ended="audioEnded"
    ></audio>
  </div>
</template>

<script>
import { frontMusicClassApiList, frontMusicApiList, frontMusicRandMusic } from "@/server/api/music"

const PAGE_SIZE = 5

export default {
  props: ["volueNum"],
  data() {
    return {
      musicLoading: false,
      MusicProgress: 0,
      musicActive: "",
      classActive: "",
      playPause: false,
      currentMusic: {},
      classList: [],
      musicList: {
        list: [],
        total: 0,
        fimlActive: 0,
        page: 1,
        page_size: PAGE_SIZE,
      },
      musicVolume: 0,
      searchText: "",
      playMode: "order",
      volumeShow: false,
      fullShow: false,
      fullVolumeShow: false,
    }
  },
  watch: {
    currentMusic() {
      this.$emit("current", this.currentMusic)
      this.$store.getters.musicObj.currentMusic = this.currentMusic
    },
    playPause() {
      this.$emit("musicPlay", this.playPause)
      this.$store.getters.musicObj.playPause = this.playPause
      if (!this.playPause && this.$refs.audioref) {
        this.$refs.audioref.pause()
      }
    },
    volueNum(newValue) {
      this.setVolume(newValue)
    },
    "$store.getters.sysInfo.sphere_effects"(newValue) {
      this.setVolume(newValue)
    },
  },
  mounted() {
    this.getMusicClass()
    this.setVolume(this.$store.getters.sysInfo.sphere_effects)
  },
  methods: {
    // 初始化分类，分类为空时清空播放状态，避免访问空数组报错。
    async getMusicClass() {
      const { data } = await frontMusicClassApiList()
      if (data.code != this.$global.successCode) return

      this.classList = Array.isArray(data.data) ? data.data : []
      if (this.classList.length) {
        await this.classBtn(this.classList[0].id, 1)
      } else {
        this.resetMusicList()
      }
    },
    // 按分类和页码加载音乐列表，返回当前页列表供随机/切歌复用。
    async classBtn(id, page = 1) {
      if (!id) {
        this.resetMusicList()
        return []
      }

      this.classActive = id
      this.musicList.page = page
      this.musicLoading = true

      try {
        const { data } = await this.fetchMusicList(page)
        if (data.code == this.$global.successCode) {
          this.setMusicList(data.data, page)
          return this.musicList.list
        }
      } catch (error) {
        this.showError("音乐列表加载失败")
      } finally {
        this.musicLoading = false
      }

      return []
    },
    fetchMusicList(page) {
      return frontMusicApiList({
        music_class_id: this.classActive,
        page,
        page_size: this.musicList.page_size,
        title: this.searchText,
      })
    },
    // 统一补充分页序号和时长类型，避免各处重复 map。
    setMusicList(pageData = {}, page = 1) {
      const list = Array.isArray(pageData.data) ? pageData.data : []
      this.musicList.total = Number(pageData.total) || 0
      this.musicList.page = page
      this.musicList.list = list.map((item, index) => ({
        ...item,
        no: (page - 1) * this.musicList.page_size + index + 1,
        duration: Number(item.duration) || 0,
      }))
    },
    // 清空列表和播放状态，适用于无分类或接口返回空数据。
    resetMusicList() {
      this.musicList.list = []
      this.musicList.total = 0
      this.musicList.fimlActive = 0
      this.musicList.page = 1
      this.currentMusic = {}
      this.musicActive = ""
      this.playPause = false
      this.MusicProgress = 0
    },
    pageChange(type) {
      if (!this.classActive) return

      const maxPage = Math.max(Math.ceil(this.musicList.total / this.musicList.page_size), 1)
      if (type == "next") {
        if (this.musicList.page >= maxPage) return
        this.musicList.page += 1
      } else {
        if (this.musicList.page === 1) return
        this.musicList.page -= 1
      }

      this.classBtn(this.classActive, this.musicList.page)
    },
    // 选中音乐后重新加载 audio；用户点击播放时立即尝试播放。
    musicBtn(item, index, autoPlay = false) {
      if (!item || !item.music_url) return

      this.musicActive = item.id
      this.currentMusic = {
        ...item,
        duration: Number(item.duration) || 0,
        page: this.musicList.page,
      }
      this.musicList.fimlActive = index
      this.playPause = true
      this.MusicProgress = 0

      this.$nextTick(() => {
        if (!this.$refs.audioref) return
        this.$refs.audioref.load()
        if (autoPlay) this.playAudio()
      })
    },
    canplay() {
      if (this.playPause) this.playAudio()
    },
    progressChange(value) {
      if (this.$refs.audioref) this.$refs.audioref.currentTime = value
    },
    volumeChange(value) {
      this.setVolume(value)
      this.$emit("volumeCurrent", this.musicVolume)
    },
    // 音量来源可能是系统设置或滑块，统一限制在 0-100。
    setVolume(value) {
      const volume = Math.min(Math.max(Number(value) || 0, 0), 100)
      this.musicVolume = volume
      if (this.$refs.audioref) {
        this.$refs.audioref.volume = volume / 100
      }
    },
    timeupdateFoo() {
      if (!this.$refs.audioref) return
      this.MusicProgress = Number(this.$refs.audioref.currentTime.toFixed(1))
    },
    audioEnded() {
      if (this.playMode == "order") {
        this.nextSong()
      } else {
        this.RandMusic()
      }
    },
    // 随机接口返回目标音乐和页码，先切到对应页再高亮播放。
    async RandMusic() {
      const { data } = await frontMusicRandMusic({ class_id: this.classActive })
      if (data.code != this.$global.successCode || !data.data) return

      const page = Number(data.data.page) || 1
      const list = await this.classBtn(this.classActive, page)
      const index = list.findIndex((item) => item.id == data.data.id)
      this.musicBtn(data.data, index >= 0 ? index : 0)
    },
    async Previous() {
      await this.changeSong(-1)
    },
    async nextSong() {
      await this.changeSong(1)
    },
    // step 为 1 表示下一首，-1 表示上一首；跨页时自动加载相邻页。
    async changeSong(step) {
      if (!this.currentMusic.music_url || this.musicLoading) return

      const nextIndex = this.musicList.fimlActive + step
      if (nextIndex >= 0 && nextIndex < this.musicList.list.length) {
        this.musicBtn(this.musicList.list[nextIndex], nextIndex)
        return
      }

      const maxPage = Math.ceil(this.musicList.total / this.musicList.page_size)
      const nextPage = this.musicList.page + step
      if (nextPage < 1 || nextPage > maxPage) return

      const list = await this.classBtn(this.classActive, nextPage)
      const index = step > 0 ? 0 : list.length - 1
      if (list[index]) this.musicBtn(list[index], index)
    },
    playMusic() {
      console.log('123');
      
      if (!this.currentMusic.music_url) {
        if (this.musicList.list.length) this.musicBtn(this.musicList.list[0], 0, true)
        return
      }

      if (this.playPause) {
        this.$refs.audioref.pause()
        this.playPause = false
      } else {
        this.playPause = true
        this.playAudio()
      }
    },
    playMusic2() {
      if (!this.currentMusic.music_url) {
        this.RandMusic()
        return
      }
      this.playMusic()
    },
    // 浏览器可能拦截自动播放，失败时同步恢复暂停状态。
    playAudio() {
      const audio = this.$refs.audioref
      if (!audio) return

      const playPromise = audio.play()
      if (playPromise && playPromise.catch) {
        playPromise.catch(() => {
          this.playPause = false
        })
      }
    },
    enterFullScreen() {
      if (!this.currentMusic.id) {
        this.showError("请先选择音乐播放后再进入全屏")
        return
      }
      this.fullShow = true
    },
    showError(message) {
      if (this.$myMessage && this.$myMessage.error) {
        this.$myMessage.error(message)
      } else if (this.$message && this.$message.error) {
        this.$message.error(message)
      }
    },
  },
}
</script>

<style scoped lang="scss">
.index {
  width: 100%;
  height: 100%;
  .music_wrap {
    width: 1580px;
    height: 872px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-image: url(@/assets/img/front/index/kuang.png);
    background-size: 100% 100%;
    padding: 180px 0 0 100px;
    box-sizing: border-box;
    display: flex;
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
    .close {
      position: absolute;
      right: 60px;
      top: 60px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #fff;
      font-weight: 600;
      font-size: 16px;
    }
    .class_wrap {
      width: 170px;
      height: 600px;
      position: relative;
      padding: 80px 0 0 0;
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

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &.active {
            background: #285bf0;
          }
        }
      }

      .line {
        position: absolute;
        right: 0;
        top: 0;
        width: 1px;
        height: 440px;
        background-image: url(@/assets/img/front/index/line.png);
        background-size: 100% 100%;
      }
    }

    .list_wrap {
      width: 670px;
      height: 630px;
      // background: pink;
      margin: 0 0 0 35px;
      .zzbf {
        font-size: 24px;
        font-family: "ziyuanyuanti600W";
        color: #ffffff;
        letter-spacing: 1.2px;
        margin: 0 0 15px 0;
      }
      .namewrap {
        display: flex;
        .musicname {
          max-width: 500px;
          font-size: 20px;
          color: #ffffff;
          letter-spacing: 1px;
          font-family: "ziyuanyuanti500W";
          margin: 0 20px 0 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .musictime {
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0.8px;
          font-family: "ziyuanyuanti500W";
        }
      }
      .search_wrap {
        display: flex;
        margin: 28px 0 0 0;
        ::v-deep {
          .el-input {
            width: 300px;
            height: 50px;
            .el-input__inner {
              width: 300px;
              height: 50px;
              border-radius: 25px;
              background: #3a4c68;
              border: none;
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
            .el-input-group__append {
              width: 35px;
              height: 36px;
              background: #285bf0;
              border-radius: 18px;
              border: none;
              color: #fff;
              font-size: 16px;
              position: absolute;
              right: 10px;
              top: 7px;
              line-height: 33px;
            }
          }
        }

        > button {
          width: 60px;
          width: 150px;
          height: 50px;
          border-radius: 25px;
          font-size: 18px;
          color: #ffffff;
          letter-spacing: 0.9px;
          background: #3a4e6d;
          font-family: "ziyuanyuanti500W";
          &.sx {
            margin: 0 20px 0 40px;
            > img {
              width: 21px;
              height: 21px;
              margin: 0 5px 0 0;
            }
            &.active {
              background: #ffaf00;
            }
          }
          &.sj {
            > img {
              width: 19px;
              height: 16px;
              margin: 0 5px 0 0;
            }
            &.active {
              background: #ae2ce4;
            }
          }
        }
      }
      .list_box {
        width: 670px;
        height: 375px;
        margin-top: 27px;
        position: relative;
        > ul {
          > li {
            display: flex;
            width: 100%;
            height: 100%;
            &.border_b {
              border-bottom: 1px #285bf0 solid;
              &.active {
                background: #0d2144;
              }
            }
            > div {
              height: 65px;
              text-align: center;
              color: #fff;
              line-height: 65px;
              letter-spacing: 0.9px;
              font-family: "ziyuanyuanti500W";
              font-size: 18px;
              &.lfbr {
                border-radius: 10px 0px 0px 0px;
              }
              &.ribr {
                border-radius: 0 10px 0px 0px;
              }

              &.h50 {
                height: 50px;
                line-height: 50px;
                background: #324665;
              }
              &.xh {
                width: 70px;
              }
              &.name {
                width: 300px;
                text-align: left;
                padding: 0 0 0 20px;
                box-sizing: border-box;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              &.duration {
                width: 160px;
              }
              &.cz {
                width: 140px;
                cursor: pointer;
              }
            }
          }
        }

        .total {
          font-size: 18px;
          color: #285bf0;
          letter-spacing: 0.9px;
          font-family: "ziyuanyuanti500W";
          margin-top: 5px;
          position: absolute;
          left: 0;
          bottom: -30px;
        }
        .page_turning {
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 150px;
          box-sizing: border-box;
          position: absolute;
          left: 0;
          bottom: -80px;
          > button {
            width: 140px;
            height: 50px;
            background: #193d6d;
            border-radius: 25px;
            font-family: "ziyuanyuanti500W";
            color: #ffffff;
            letter-spacing: 0.9px;
            font-size: 18px;
          }
        }
      }
    }

    .playing_status {
      width: 510px;
      height: 580px;
      background: #0f1f39;
      border-radius: 30px;
      margin: 0 0 0 35px;
      position: relative;
      padding: 40px 0 0 0;
      box-sizing: border-box;
      .vinyl_record_box {
        width: 340px;
        height: 340px;
        background-image: url("@/assets/img/front/music/椭圆.png");
        background-size: 100% 100%;
        margin: 0 auto;
        position: relative;
        .vinyl_record_img {
          width: 251px;
          height: 245px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
        }
      }

      .introductory {
        width: 420px;
        margin: 0 0 0 45px;
        .music_name {
          width: 100%;
          font-size: 18px;
          color: #ffffff;
          letter-spacing: 0.9px;
          font-family: "ziyuanyuanti500W";
          margin: 20px 0 0 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .introductory_box {
          width: 420px;
          height: 70px;
          font-size: 14px;
          font-family: "ziyuanyuanti500W";
          color: #ffffff;
          line-height: 24px;
          letter-spacing: 0.7px;
          overflow-y: scroll;
          overflow-x: hidden;
          &::-webkit-scrollbar {
            display: none;
          }
        }
      }

      .schedule_box {
        width: 420px;
        margin: 0 0 10px 45px;
        > span {
          width: 100%;
          text-align: right;
          display: inline-block;
          font-size: 14px;
          color: #285bf0;
          letter-spacing: 0.7px;
        }
        .slider {
          width: 100%;
          margin-top: 10px;
          ::v-deep.slider {
            height: 10px;
            .el-slider__runway {
              height: 10px;
              margin: 0;
              border-radius: 5px;
              background: #fff;
              .el-slider__bar {
                height: 10px;
                border-radius: 5px;
                background: #285bf0;
              }
              .el-slider__button-wrapper {
                display: none;
              }
            }
          }
        }
      }
      .action_bar {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 80px;
        background: #214bc5;
        border-radius: 0 0 30px 30px;
        display: flex;
        padding: 15px 0 0 20px;
        box-sizing: border-box;
        > div {
          font-size: 18px;
          font-family: Resource Han Rounded CN, Resource Han Rounded CN-Medium;
          font-weight: 500;
          text-align: left;
          color: #ffffff;
          line-height: 50px;
          letter-spacing: 0.9px;
          font-family: "ziyuanyuanti500W";
          cursor: pointer;
          > img {
            width: 18px;
            height: 18px;
            margin: 0 3px 3px 0;
          }
        }
        .line {
          width: 1px;
          height: 50px;
          margin: 0 30px;
          background-size: 100% 100%;
          background-image: url(@/assets/img/front/index/line.png);
        }
      }

      .volume_box {
        width: 80px;
        height: 300px;
        border-radius: 10px;
        position: absolute;
        right: -150px;
        bottom: -50px;
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
  }
  .full_music {
    width: 100vw;
    height: 100vh;
    background-image: url(@/assets/img/front/music/full_bg.png);
    background-size: 100% 100%;
    position: relative;
    .full_disc {
      width: 410px;
      height: 410px;
      position: absolute;
      left: 50%;
      top: 40%;
      transform: translate(-50%, -50%);
      background-image: url(@/assets/img/front/music/椭圆.png);
      background-size: 100% 100%;
      > img {
        width: 335px;
        height: 335px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
      }
    }
    .full_slider {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 110px;
      ::v-deep .el-slider {
        height: 10px;
        .el-slider__runway {
          height: 10px;
          margin: 0;
          background: #858ee6;
          .el-slider__bar {
            height: 10px;
            background: #00afff;
          }
          .el-slider__button-wrapper {
            // display: none;
            width: 26px;
            background-image: url(@/assets/img/front/music/进度条.png);
            background-size: 100% 100%;
            top: -20px;
            .el-slider__button {
              display: none;
            }
          }
        }
      }
    }
    .full_action_bar {
      width: 100%;
      height: 110px;
      background: #00000060;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      box-sizing: border-box;
      > .full_duration {
        font-size: 18px;
        font-weight: 500;
        font-family: "ziyuanyuanti500W";
        letter-spacing: 0.9px;
        color: #fff;
        > i {
          color: #29c0ff;
        }
      }
      > .full_play_pause {
        position: absolute; // 添加绝对定位
        left: 50%; // 水平居中
        transform: translateX(-50%); // 调整居中位置
        > img {
          width: 62px;
          height: 62px;
          margin: 5px;
          &:nth-child(2) {
            width: 72px;
            height: 72px;
          }
          &:nth-child(3) {
            width: 72px;
            height: 72px;
          }
        }
      }
      > .sound_close {
        font-size: 20px;
        font-family: "ziyuanyuanti500W";
        font-weight: 400;
        color: #ffffff;
        letter-spacing: 1px;
        display: flex;
        align-items: center;
        > div {
          box-sizing: border-box;
          background-size: 100% 100%;
          height: 50px;
          line-height: 50px;
          padding: 0 0 0 45px;
          margin-right: 20px;
        }
        > .full_sound {
          width: 100px;
          background-image: url(@/assets/img/front/music/全屏音量.png);
        }
        > .full_close {
          width: 150px;
          background-image: url(@/assets/img/front/music/退出全屏.png);
        }
      }
    }
    .dynamic_effect {
      height: 300px;
      position: absolute;
      left: 48.5%;
      top: 56%;
      transform: translate(-50%, -50%);
      > img {
        width: 330px;
        height: 300px;
        margin: 0 25px;
      }
    }
    .full_musicName {
      position: absolute;
      left: 50%;
      top: 75%;
      transform: translate(-50%, -50%);
      font-size: 24px;
      font-weight: 500;
      font-family: "ziyuanyuanti500W";
      letter-spacing: 1.2px;
      color: #fff;
    }
    .volume_box {
      width: 80px;
      height: 300px;
      border-radius: 10px;
      position: absolute;
      right: 225px;
      bottom: 150px;
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
}
</style>
