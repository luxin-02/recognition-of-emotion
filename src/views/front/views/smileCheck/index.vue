<template>
  <div class="smile_check">
    <div class="star_field" ref="starField">
      <div
        v-for="item in smileUsers"
        :key="item.id"
        :class="['avatar_dot', { visible: item.visible }]"
        :style="avatarStyle(item)"
        @click="
          () => {
            detailsId = item.detailId
            shootDetailsShow = true
            $nextTick(() => {
              $refs.shootRef.getDetails()
            })
          }
        "
      >
        <img :src="item.avatar" />
      </div>
    </div>

    <div class="bottom_panel">
      <div v-for="item in tabs" :key="item.name" class="tab_item" :class="item.className" @click="openPopup(item)">
        <span>{{ item.name }}</span>
      </div>
    </div>

    <shoot :show.sync="shootShow" />
    <shootDetails ref="shootRef" :show.sync="shootDetailsShow" :detailsId="detailsId" />
  </div>
</template>

<script>
import shoot from "./components/shoot.vue"
import shootDetails from "./components/shootDetails.vue"
import { smileClockRandom, deleteSmileClock } from "@/server/api/smileCheck"

export default {
  components: {
    shoot,
    shootDetails,
  },
  data() {
    return {
      smileUsers: [],
      tabs: [
        { name: "打卡统计", className: "statistics" },
        { name: "微笑打卡", className: "check" },
        { name: "随机查看", className: "random" },
      ],
      swapIntervalId: null,
      defaultAvatar: null,
      avatarPool: [],
      poolIndex: 0,
      recentQueue: [],
      recentMax: 12,
      retryLimit: 60,
      container: {
        width: 900,
        height: 600,
        cx: 450,
        cy: 300,
      },
      shootShow: false,
      shootDetailsShow: false,
      detailsId: null,
    }
  },
  async mounted() {
    await this.$nextTick()
    this.updateContainerConfig()
    await this.initSmileUsers()
    this.startAvatarSwap()
    window.addEventListener("resize", this.onResize)
  },
  beforeDestroy() {
    if (this.swapIntervalId) {
      clearInterval(this.swapIntervalId)
      this.swapIntervalId = null
    }
    window.removeEventListener("resize", this.onResize)
  },

  methods: {
    async initSmileUsers() {
      this.defaultAvatar = this.$store.getters.userAvatar || require("@/assets/img/userAvatar/1.png")
      const avatarData = await this.loadSmileUserData()
      this.generateSmileUsers(avatarData)
    },

    getStarFieldRect() {
      const starField = this.$refs.starField
      if (!starField || !starField.getBoundingClientRect) {
        return null
      }
      const rect = starField.getBoundingClientRect()
      return {
        width: rect.width,
        height: rect.height,
        cx: rect.width / 2,
        cy: rect.height / 2,
      }
    },

    updateContainerConfig() {
      const rect = this.getStarFieldRect()
      if (rect && rect.width > 0 && rect.height > 0) {
        this.container = rect
      } else {
        this.container = {
          width: 900,
          height: 600,
          cx: 450,
          cy: 300,
        }
      }
    },

    onResize() {
      const oldWidth = this.container.width
      const oldHeight = this.container.height
      this.updateContainerConfig()
      if (this.container.width !== oldWidth || this.container.height !== oldHeight) {
        this.generateSmileUsers(this.avatarPool)
      }
    },

    async loadSmileUserData() {
      try {
        const { data } = await smileClockRandom()
        if (data.code == this.$global.successCode) {
          console.log(data.data)
          var mockData = data.data
        }
      } catch (error) {
        throw error
      }
      return mockData.map((item) => ({
        id: item.id,
        avatar: this.$ip + item.avatar,
        name: item.nickname,
      }))
    },

    generateSmileUsers(avatarData = []) {
      this.avatarPool = avatarData && avatarData.length ? avatarData : [{ avatar: this.defaultAvatar }]
      this.poolIndex = 0
      const maxCount = Math.min(this.avatarPool.length, 15)
      this.smileUsers = []
      const container = {
        width: this.container.width,
        height: this.container.height,
        cx: this.container.cx,
        cy: this.container.cy,
      }
      const resizeScale = Math.min(container.width / 900, container.height / 600, 1)
      const minSize = Math.max(32, Math.floor(56 * resizeScale))
      const maxSize = Math.max(minSize + 10, Math.floor(94 * resizeScale))
      const margin = 8
      const placed = []

      const inEllipse = (cx, cy, a, b, x, y) => {
        const dx = x - cx
        const dy = y - cy
        return (dx * dx) / (a * a) + (dy * dy) / (b * b) <= 1
      }

      const collides = (item, others) => {
        return others.some((other) => {
          const dx = item.cx - other.cx
          const dy = item.cy - other.cy
          const minDist = item.radius + other.radius + margin
          return dx * dx + dy * dy < minDist * minDist
        })
      }

      let assignIndex = 0
      const tryPlaceItem = (id) => {
        const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize
        const radius = size / 2
        const a = container.width / 2 - radius - margin
        const b = container.height / 2 - radius - margin
        if (a <= 0 || b <= 0) {
          return null
        }

        for (let attempt = 0; attempt < 120; attempt += 1) {
          const angle = Math.random() * Math.PI * 2
          const r = Math.sqrt(Math.random())
          const x = container.cx + a * r * Math.cos(angle)
          const y = container.cy + b * r * Math.sin(angle)
          if (!inEllipse(container.cx, container.cy, a, b, x, y)) {
            continue
          }
          const poolItem = this.avatarPool[assignIndex % this.avatarPool.length] || { avatar: this.defaultAvatar }
          const item = {
            id,
            detailId: poolItem.id,
            avatar: poolItem.avatar,
            size,
            radius,
            cx: x,
            cy: y,
            visible: false,
            renderKey: `${id}-${Date.now()}`,
          }
          if (!collides(item, placed)) {
            item.left = x - radius
            item.top = y - radius
            placed.push(item)
            assignIndex += 1
            return item
          }
        }
        return null
      }

      for (let i = 0; i < maxCount; i += 1) {
        const item = tryPlaceItem(i + 1)
        if (item) {
          this.smileUsers.push(item)
        }
      }

      this.smileUsers.sort(() => Math.random() - 0.5)
      const minHidden = Math.min(2, Math.max(0, maxCount - 1))
      const initialVisible = Math.max(1, Math.min(maxCount - minHidden, this.smileUsers.length))
      this.smileUsers.forEach((item, index) => {
        item.visible = index < initialVisible
        item.renderKey = `${item.id}-${item.visible ? "v" : "h"}-${Date.now()}`
      })
      const visibleAvatarIds = this.smileUsers
        .slice(0, initialVisible)
        .map((it) => it.avatar)
        .map((a) => {
          const found = this.avatarPool.find((p) => p.avatar === a)
          return found ? found.id : null
        })
        .filter(Boolean)
      this.recentQueue = Array.from(new Set(visibleAvatarIds)).slice(-this.recentMax)
      if (this.avatarPool && this.avatarPool.length) {
        this.poolIndex = this.smileUsers.length % this.avatarPool.length
      } else {
        this.poolIndex = 0
      }
    },

    startAvatarSwap() {
      const swapDelay = 3200
      this.swapIntervalId = setInterval(() => {
        const visibleItems = this.smileUsers.filter((item) => item.visible)
        const hiddenItems = this.smileUsers.filter((item) => !item.visible)
        if (!visibleItems.length || !hiddenItems.length) {
          return
        }
        const swapCount = Math.min(2, visibleItems.length, hiddenItems.length)
        const shuffle = (arr) => arr.sort(() => Math.random() - 0.5)
        const outs = shuffle(visibleItems.slice()).slice(0, swapCount)
        const ins = shuffle(hiddenItems.slice()).slice(0, swapCount)
        outs.forEach((item) => {
          item.visible = false
        })
        const tempPickedIds = new Set()
        const pickNonRecentFromPool = (excludeSet) => {
          const pool = this.avatarPool || []
          if (!pool.length) return null
          const effectiveRecentLimit = Math.min(this.recentMax, Math.max(1, Math.floor(pool.length * 0.6)))
          let tries = 0
          while (tries++ < this.retryLimit) {
            const idx = Math.floor(Math.random() * pool.length)
            const p = pool[idx]
            if (!p) continue
            const pid = p.id || idx
            if (excludeSet && excludeSet.has(pid)) continue
            if (!this.recentQueue.includes(pid)) return p
          }
          for (let i = 0; i < pool.length; i += 1) {
            const p = pool[i]
            const pid = p.id || i
            if (excludeSet && excludeSet.has(pid)) continue
            return p
          }
          return pool[0]
        }

        ins.forEach((item) => {
          const poolItem = pickNonRecentFromPool(tempPickedIds) || {
            avatar: this.defaultAvatar,
          }
          item.avatar = poolItem.avatar
          item.detailId = poolItem.id
          const pid = poolItem.id || null
          if (pid !== null && pid !== undefined) {
            tempPickedIds.add(pid)
            this.recentQueue.push(pid)
            if (this.recentQueue.length > this.recentMax) {
              this.recentQueue.shift()
            }
          }
          item.visible = true
          if (this.avatarPool && this.avatarPool.length) {
            this.poolIndex = (this.poolIndex + 1) % this.avatarPool.length
          }
        })
      }, swapDelay)
    },

    avatarStyle(item) {
      return {
        left: `${item.left}px`,
        top: `${item.top}px`,
        width: `${item.size}px`,
        height: `${item.size}px`,
      }
    },

    async openPopup(item) {
      if (item.className === "check") {
        this.shootShow = true
      }
      if (item.className === "statistics") {
        this.$router.push("/smileCheck/statistics")
      }
      if (item.className === "random") {
        if (!this.avatarPool || !this.avatarPool.length) {
          this.$message.warning("暂无数据可查看")
          return
        }
        const randomIndex = Math.floor(Math.random() * this.avatarPool.length)
        const randomItem = this.avatarPool[randomIndex]
        this.detailsId = randomItem.id
        this.shootDetailsShow = true
        this.$nextTick(() => {
          this.$refs.shootRef.getDetails()
        })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.smile_check {
  width: 100vw;
  height: 100vh;
  position: relative;
  background-size: 100% 100%;
  background-image: url(@/assets/img/front/smileCheck/bg.png);

  .star_field {
    width: min(900px, 92vw);
    height: min(600px, 62vh);
    position: absolute;
    left: 50%;
    top: 46%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    border-radius: 40%;

    .avatar_dot {
      position: absolute;
      border-radius: 50%;
      padding: 10px;
      background-image: url(@/assets/img/front/smileCheck/气泡.png);
      background-size: 100% 100%;
      opacity: 0;
      transform: scale(0.2);
      transition: opacity 0.8s ease, transform 0.8s ease;

      &.visible {
        opacity: 1;
        transform: scale(1);
      }

      > img {
        width: 70%;
        height: 70%;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  .bottom_panel {
    height: 162px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 26px;
    border-radius: 58px 58px 0 0;
    background-image: url(@/assets/img/front/smileCheck/底座.png);
    background-size: 100% 100%;

    .tab_item {
      width: 250px;
      height: 100px;
      border-radius: 18px;
      color: #fff;
      font-size: 28px;
      font-family: "ziyuanyuanti500W";
      cursor: pointer;
      line-height: 100px;
      padding-left: 30px;
      box-sizing: border-box;
      background-size: 100% 100%;
      &.statistics {
        background-image: url(@/assets/img/front/smileCheck/统计打卡.png);
      }
      &.check {
        background-image: url(@/assets/img/front/smileCheck/微笑打卡.png);
      }
      &.random {
        background-image: url(@/assets/img/front/smileCheck/随机查看.png);
      }
    }
  }
}
</style>
