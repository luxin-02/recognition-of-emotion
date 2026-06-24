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
export default {
  props: ["volueNum"],
  data() {
    return {
      musicLoading: false,
      MusicProgress: 0,
      musicActive: "",
      classActive: "",
      //播放暂停
      playPause: false,
      //当前播放
      currentMusic: {},
      classList: [],
      musicList: {
        list: [],
        total: 0,
        fimlActive: 0,
        page: 1,
        page_size: 5,
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
    },
    volueNum(newv) {
      this.musicVolume = newv
      this.$refs.audioref.volume = newv / 100
    },
    "$store.getters.isLogin"(e) {
      if (e) {
        // this.getMusicClass();
        // this.musicVolume = Number(this.$store.getters.sysInfo.sphere_effects);
      }
    },
    "$store.getters.sysInfo.sphere_effects"(newValue) {
      this.musicVolume = Number(newValue)
      if (this.$refs.audioref) {
        this.$refs.audioref.volume = this.musicVolume / 100
      }
    },
  },
  mounted() {
    this.getMusicClass()
    this.musicVolume = Number(this.$store.getters.sysInfo.sphere_effects)
    this.$refs.audioref.volume = this.musicVolume / 100
  },
  computed: {
    imgState() {
      return this.playPause ? true : false
    },
  },
  methods: {
    async getMusicClass() {
      const { data } = await frontMusicClassApiList()
      if (data.code == this.$global.successCode) {
        this.classList = data.data
        this.classBtn(data.data[0].id, 1)
      }
    },
    async classBtn(id, page) {
      this.classActive = id
      this.musicList.page = page
      this.musicLoading = true
      try {
        const { data } = await frontMusicApiList({
          music_class_id: id,
          page: this.musicList.page,
          page_size: this.musicList.page_size,
          title: this.searchText,
        })
        if (data.code == this.$global.successCode) {
          this.musicList.total = data.data.total
          this.musicList.list = data.data.data.map((item, index) => {
            return {
              no: (page - 1) * 5 + index + 1,
              ...item,
            }
          })
        }
      } catch (error) {
      } finally {
        this.musicLoading = false
      }
    },
    pageChange(type) {
      if (type == "next") {
        if (Math.ceil(this.musicList.total / 5) <= this.musicList.page) return
        this.musicList.page += 1
      } else {
        if (this.musicList.page === 1) return
        this.musicList.page -= 1
      }
      // this.musicList.page = v;
      this.classBtn(this.classActive, this.musicList.page)
    },
    musicBtn(item, i) {
      // console.log(item);
      this.musicActive = item.id
      this.$refs.audioref.load()
      this.currentMusic = item
      this.musicList.fimlActive = i
      this.currentMusic.duration = Number(this.currentMusic.duration)
      // this.$nextTick(() => {
      //   this.$refs.audioref.play();
      this.playPause = true
      this.currentMusic.page = this.musicList.page
      // });
    },
    canplay() {
      if (this.MusicProgress !== 0) return
      this.$refs.audioref.play()
    },
    //进度条
    progressChange(v) {
      this.$refs.audioref.currentTime = v
    },
    volumeChange(v) {
      this.musicVolume = v
      this.$refs.audioref.volume = this.musicVolume / 100
      this.$emit("volumeCurrent", this.musicVolume)
    },
    //监听音乐播放进度
    timeupdateFoo() {
      this.MusicProgress = Number(this.$refs.audioref.currentTime.toFixed(1))
      // console.log(Number(this.$refs.audioref.currentTime.toFixed(1)));
      if (this.playPause) {
        this.$refs.audioref.play()
      }
      if (!this.playPause) {
        this.$refs.audioref.pause()
      }
    },
    audioEnded() {
      if (this.playMode == "order") {
        this.nextSong()
      } else {
        this.RandMusic()
      }
    },
    async RandMusic() {
      const { data } = await frontMusicRandMusic({
        class_id: this.classActive,
      })
      if (data.code == this.$global.successCode) {
        console.log(data.data)
        this.musicList.page = data.data.page
        this.classBtn(this.classActive, this.musicList.page)
        this.$nextTick(() => {
          let fimlActive = this.musicList.list.findIndex((v) => v.id == data.data.id)
          this.musicBtn(data.data, fimlActive)
        })
        return
      }
    },
    //上一首
    async Previous() {
      if (!this.currentMusic.music_url) return
      if (this.musicList.fimlActive <= 0) {
        if (this.musicList.page <= 1) return
        try {
          this.musicLoading = true
          this.musicList.page--
          const { data } = await frontMusicApiList({
            music_class_id: this.classActive,
            page: this.musicList.page,
            page_size: this.musicList.page_size,
          })
          if (data.code == this.$global.successCode) {
            this.musicList.list = data.data.data.map((item, index) => {
              return {
                no: (this.musicList.page - 1) * 5 + index + 1,
                ...item,
              }
            })
            var item = this.musicList.list[this.musicList.page_size - 1]
            this.musicBtn(item, this.musicList.page_size - 1)
          }
        } catch (error) {
        } finally {
          this.musicLoading = false
        }
      } else {
        // var item = this.musicList.list[(this.musicList.fimlActive -= 1)];
        // this.musicBtn(item, this.musicList.fimlActive);

        if (this.musicList.page == this.currentMusic.page) {
          var item = this.musicList.list[(this.musicList.fimlActive -= 1)]
          this.musicBtn(item, this.musicList.fimlActive)
        } else {
          try {
            this.musicLoading = true
            this.musicList.page = this.currentMusic.page
            const { data } = await frontMusicApiList({
              music_class_id: this.classActive,
              page: this.currentMusic.page,
              page_size: this.musicList.page_size,
            })
            if (data.code == this.$global.successCode) {
              this.musicList.list = data.data.data.map((item, index) => {
                return {
                  no: (this.musicList.page - 1) * 5 + index + 1,
                  ...item,
                }
              })
              var item = this.musicList.list[(this.musicList.fimlActive -= 1)]
              this.musicBtn(item, this.musicList.fimlActive)
            }
          } catch (error) {
          } finally {
            this.musicLoading = false
          }
        }
      }
    },
    //播放暂停
    playMusic() {
      if (!this.currentMusic.music_url) {
        if (this.musicList.list.length > 0) {
          this.musicBtn(this.musicList.list[0], 0)
        }
        return
      }
      if (this.playPause) {
        this.$refs.audioref.pause()
        this.playPause = false
      } else {
        this.$refs.audioref.play()
        this.playPause = true
      }
    },
    playMusic2() {
      if (!this.currentMusic.music_url) {
        this.RandMusic()
        return
      }
      if (this.playPause) {
        this.$refs.audioref.pause()
        this.playPause = false
      } else {
        this.$refs.audioref.play()
        this.playPause = true
      }
    },
    //下一首
    async nextSong() {
      if (!this.currentMusic.music_url) return
      // if (this.musicList.total <= this.musicList.list.length) return;
      if (this.musicList.fimlActive >= this.musicList.list.length - 1) {
        let maxPage = Math.ceil(this.musicList.total / this.musicList.page_size)
        // if (this.musicList.page >= maxPage) return;
        if (this.musicList.page >= maxPage) {
          if (
            this.musicList.page == this.currentMusic.page &&
            this.musicList.fimlActive >= this.musicList.list.length - 1
          )
            return
          const { data } = await frontMusicApiList({
            music_class_id: this.classActive,
            page: this.musicList.page,
            page_size: this.musicList.page_size,
          })
          if (data.code == this.$global.successCode) {
            this.musicList.list = data.data.data.map((item, index) => {
              return {
                no: (this.musicList.page - 1) * 5 + index + 1,
                ...item,
              }
            })

            var item = this.musicList.list[0]
            this.musicBtn(item, 0)
          }
          return
        }
        try {
          this.musicLoading = true
          this.musicList.page++
          const { data } = await frontMusicApiList({
            music_class_id: this.classActive,
            page: this.musicList.page,
            page_size: this.musicList.page_size,
          })
          if (data.code == this.$global.successCode) {
            this.musicList.list = data.data.data.map((item, index) => {
              return {
                no: (this.musicList.page - 1) * 5 + index + 1,
                ...item,
              }
            })
            var item = this.musicList.list[0]
            this.musicBtn(item, 0)
          }
        } catch (error) {
        } finally {
          this.musicLoading = false
        }
      } else {
        if (this.musicList.page == this.currentMusic.page) {
          var item = this.musicList.list[(this.musicList.fimlActive += 1)]
          this.musicBtn(item, this.musicList.fimlActive)
        } else {
          try {
            this.musicLoading = true
            this.musicList.page = this.currentMusic.page
            const { data } = await frontMusicApiList({
              music_class_id: this.classActive,
              page: this.currentMusic.page,
              page_size: this.musicList.page_size,
            })
            if (data.code == this.$global.successCode) {
              this.musicList.list = data.data.data.map((item, index) => {
                return {
                  no: (this.musicList.page - 1) * 5 + index + 1,
                  ...item,
                }
              })
              var item = this.musicList.list[(this.musicList.fimlActive += 1)]
              this.musicBtn(item, this.musicList.fimlActive)
            }
          } catch (error) {
          } finally {
            this.musicLoading = false
          }
        }
      }
    },
    enterFullScreen() {
      if (!this.currentMusic.id) {
        this.$myMessage.error("请先选择音乐播放后再进入全屏")
        return
      }
      this.fullShow = true
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
