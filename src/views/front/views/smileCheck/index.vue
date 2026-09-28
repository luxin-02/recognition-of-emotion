<template>
  <div class="smile_check">
    <div
      class="star_field"
      ref="starField"
      :class="{ dragging: isDragging }"
      @mousedown="onMouseDown"
      @touchstart="onTouchStart"
    >
      <div class="sphere" ref="sphere">
        <div
          v-for="item in smileUsers"
          :key="item.id"
          ref="dots"
          :class="['avatar_dot', item.bubbleClass]"
          :style="avatarStyle(item)"
          @click="openAvatarDetails(item)"
        >
          <img :src="item.avatar" draggable="false" />
        </div>
      </div>
    </div>

    <div class="bottom_panel">
      <div v-for="item in tabs" :key="item.name" class="tab_item" :class="item.className" @click="openPopup(item)">
        <span>{{ item.name }}</span>
      </div>
    </div>

    <shoot :show.sync="shootShow" @published="refreshSmileUsers" />
    <shootDetails ref="shootRef" :show.sync="shootDetailsShow" :detailsId="detailsId" />
  </div>
</template>

<script>
import shoot from "./components/shoot.vue"
import shootDetails from "./components/shootDetails.vue"
import { smileClockRandom } from "@/server/api/smileCheck"

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
      defaultAvatar: null,
      avatarPool: [],
      // 球面最多展示头像数：超过则随机抽取，避免重叠过密和性能下降
      maxAvatars: 120,
      container: {
        width: 900,
        height: 600,
      },
      sphereRadius: 220,
      baseAvatarSize: 56,
      // 球体当前旋转角度（弧度）
      rotation: { x: 0, y: 0 },
      // 松手后的惯性速度
      velocity: { x: 0, y: 0 },
      isDragging: false,
      dragMoved: false,
      suppressMouse: false,
      dragLast: { x: 0, y: 0 },
      dragSensitivity: 0.005,
      autoRotateSpeed: 0.0025,
      inertiaDamping: 0.95,
      rafId: null,
      shootShow: false,
      shootDetailsShow: false,
      detailsId: null,
    }
  },
  async mounted() {
    await this.$nextTick()
    this.updateContainerConfig()
    await this.initSmileUsers()
    this.startAnimation()
    window.addEventListener("resize", this.onResize)
    document.addEventListener("visibilitychange", this.onVisibilityChange)
  },
  beforeDestroy() {
    this.stopAnimation()
    window.removeEventListener("resize", this.onResize)
    document.removeEventListener("visibilitychange", this.onVisibilityChange)
    this.removeDragListeners()
  },

  methods: {
    async initSmileUsers() {
      this.defaultAvatar = this.$store.getters.userAvatar || require("@/assets/img/userAvatar/1.png")
      const avatarData = await this.loadSmileUserData()
      this.generateSmileUsers(avatarData)
    },

    async refreshSmileUsers() {
      await this.initSmileUsers()
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
      }
    },

    updateContainerConfig() {
      const rect = this.getStarFieldRect()
      if (rect && rect.width > 0 && rect.height > 0) {
        this.container = rect
      } else {
        this.container = { width: 900, height: 600 }
      }
      const minDim = Math.min(this.container.width, this.container.height)
      this.sphereRadius = minDim * 0.44
      this.baseAvatarSize = Math.max(40, Math.min(64, minDim * 0.085))
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
      let mockData = []
      try {
        const { data } = await smileClockRandom()
        if (data.code == this.$global.successCode) {
          mockData = Array.isArray(data.data) ? data.data : []
        }
      } catch (error) {
        throw error
      }

      // TODO: 临时假数据 START —— 页面调整完后删除此段
      // const localAvatars = [
      //   require("@/assets/img/userAvatar/1.png"),
      //   require("@/assets/img/userAvatar/2.png"),
      //   require("@/assets/img/userAvatar/3.png"),
      //   require("@/assets/img/userAvatar/4.png"),
      //   require("@/assets/img/userAvatar/5.png"),
      //   require("@/assets/img/userAvatar/6.png"),
      // ]
      // const mockNames = [
      //   "笑笑",
      //   "阳光",
      //   "甜甜",
      //   "阿橙",
      //   "小鱼",
      //   "豆豆",
      //   "木木",
      //   "糖糖",
      //   "星星",
      //   "阿狸",
      //   "果果",
      //   "团团",
      //   "奶茶",
      //   "布丁",
      //   "柠檬",
      //   "小熊",
      //   "小鹿",
      //   "小兔",
      //   "小猫",
      //   "小狗",
      //   "小猪",
      //   "笑笑",
      //   "阳光",
      //   "甜甜",
      //   "阿橙",
      //   "小鱼",
      //   "豆豆",
      //   "木木",
      //   "糖糖",
      // ]
      // console.log(mockNames.length, "mockNames.length")

      // const fakeData = mockNames.map((name, index) => ({
      //   id: -(index + 1),
      //   avatar: localAvatars[index % localAvatars.length],
      //   name,
      // }))
      // TODO: 临时假数据 END

      return mockData
        .filter((item) => item && item.id !== undefined && item.id !== null && item.id !== "")
        .map((item) => ({
          id: item.id,
          // 球体头像使用本次微笑打卡的照片，历史数据没有照片时再回退到用户头像。
          avatar: this.getImageUrl(item.image || item.avatar),
          name: item.nickname,
        }))
      // TODO: 临时假数据 —— 页面调整完后删除此段
      // .concat(fakeData)
      // TODO: 临时假数据 —— 页面调整完后删除此句
    },

    getImageUrl(url) {
      if (!url) return this.defaultAvatar
      if (/^(https?:)?\/\//.test(url) || /^data:/.test(url)) return url
      return this.$ip + url
    },

    // 根据头像数量分档：数量越少头像越大
    getAvatarSize(count) {
      const tiers = [
        { max: 30, scale: 1 },
        { max: 50, scale: 0.78 },
        { max: 65, scale: 0.64 },
        { max: 80, scale: 0.56 },
        { max: 100, scale: 0.4 },
      ]
      // 默认取最后一档（最小），新增档位后自动生效
      let scale = tiers[tiers.length - 1].scale
      for (let i = 0; i < tiers.length; i += 1) {
        if (count <= tiers[i].max) {
          scale = tiers[i].scale
          break
        }
      }
      return Math.max(20, Math.round(this.baseAvatarSize * scale))
    },

    // Fibonacci 球面均匀分布
    generateSmileUsers(avatarData = []) {
      this.avatarPool = Array.isArray(avatarData) ? avatarData : []
      let users = this.avatarPool.slice()

      if (users.length > this.maxAvatars) {
        // Fisher-Yates 洗牌后取前 maxAvatars 个
        for (let i = users.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[users[i], users[j]] = [users[j], users[i]]
        }
        users = users.slice(0, this.maxAvatars)
      }

      const N = users.length
      const R = this.sphereRadius
      // 分档依据：整个池子的数据总条数，而非截取后的展示数量
      const size = this.getAvatarSize(this.avatarPool.length)
      const goldenAngle = Math.PI * (1 + Math.sqrt(5))

      this.smileUsers = users.map((u, i) => {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / N)
        const theta = goldenAngle * i
        const px = R * Math.sin(phi) * Math.cos(theta)
        const py = R * Math.cos(phi)
        const pz = R * Math.sin(phi) * Math.sin(theta)
        const id = u.id !== undefined && u.id !== null ? u.id : `u-${i}`
        return {
          id,
          detailId: u.id,
          avatar: u.avatar || this.defaultAvatar,
          bubbleClass: i % 2 === 0 ? "bubble" : "bubble_alt",
          size,
          px,
          py,
          pz,
        }
      })
    },

    // ---------- 动画循环 ----------

    startAnimation() {
      this.stopAnimation()
      const loop = () => {
        this.rafId = requestAnimationFrame(loop)
        this.tick()
      }
      this.rafId = requestAnimationFrame(loop)
    },

    stopAnimation() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId)
        this.rafId = null
      }
    },

    // 页面隐藏时暂停渲染，可见时恢复，避免后台空转耗 GPU
    onVisibilityChange() {
      if (document.hidden) {
        this.stopAnimation()
        this.onDragEnd()
      } else if (!this.rafId) {
        this.startAnimation()
      }
    },

    tick() {
      if (!this.isDragging) {
        const vx = this.velocity.x
        const vy = this.velocity.y
        if (Math.abs(vx) > 0.0001 || Math.abs(vy) > 0.0001) {
          // 惯性衰减
          this.rotation.x += vx
          this.rotation.y += vy
          this.velocity.x = vx * this.inertiaDamping
          this.velocity.y = vy * this.inertiaDamping
        } else {
          this.velocity.x = 0
          this.velocity.y = 0
          // 无人操作时从左向右缓慢自转
          this.rotation.y += this.autoRotateSpeed
        }
      }
      this.renderFrame()
    },

    renderFrame() {
      const sphere = this.$refs.sphere
      if (!sphere) return

      const rx = this.rotation.x
      const ry = this.rotation.y
      sphere.style.transform = `rotateX(${rx}rad) rotateY(${ry}rad)`

      const dots = this.$refs.dots
      if (!dots || !dots.length) return

      const R = this.sphereRadius
      if (R <= 0) return

      const sinRx = Math.sin(rx)
      const cosRx = Math.cos(rx)
      const sinRy = Math.sin(ry)
      const cosRy = Math.cos(ry)
      const minOpacity = 0.25

      for (let i = 0; i < this.smileUsers.length; i += 1) {
        const item = this.smileUsers[i]
        const el = dots[i]
        if (!el) continue

        // 视空间 z：父级 rotateX→rotateY（矩阵 Rx*Ry，点先经 Ry 再经 Rx）
        const z1 = -item.px * sinRy + item.pz * cosRy
        const z2 = item.py * sinRx + z1 * cosRx
        const norm = z2 / R // [-1, 1]
        const opacity = minOpacity + (1 - minOpacity) * ((norm + 1) / 2)
        el.style.opacity = opacity

        // 公告牌：位置随球转动，自身反向旋转抵消父级转动，始终正面朝向镜头
        const half = item.size / 2
        el.style.transform =
          `translate3d(${item.px - half}px, ${item.py - half}px, ${item.pz}px)` +
          ` rotateY(${-ry}rad) rotateX(${-rx}rad)`
      }
    },

    // ---------- 拖动 / 惯性 ----------

    onTouchStart(e) {
      // 标记本次为触摸操作，抑制随后浏览器补发的模拟 mousedown
      this.suppressMouse = true
      this.onDragStart(e)
    },

    onMouseDown(e) {
      if (this.suppressMouse) {
        this.suppressMouse = false
        return
      }
      this.onDragStart(e)
    },

    onDragStart(e) {
      this.isDragging = true
      this.dragMoved = false
      const point = e.touches ? e.touches[0] : e
      this.dragLast = { x: point.clientX, y: point.clientY }
      window.addEventListener("mousemove", this.onDragMove)
      window.addEventListener("mouseup", this.onDragEnd)
      window.addEventListener("touchmove", this.onDragMove, { passive: false })
      window.addEventListener("touchend", this.onDragEnd)
      window.addEventListener("touchcancel", this.onDragEnd)
    },

    onDragMove(e) {
      if (!this.isDragging) return
      if (e.cancelable) e.preventDefault()
      const point = e.touches ? e.touches[0] : e
      const dx = point.clientX - this.dragLast.x
      const dy = point.clientY - this.dragLast.y
      this.dragLast = { x: point.clientX, y: point.clientY }

      if (Math.abs(dx) + Math.abs(dy) > 2) {
        this.dragMoved = true
      }

      const sens = this.dragSensitivity
      // 水平拖动 → 绕 Y 轴；垂直拖动 → 绕 X 轴（方向跟随手指）
      this.rotation.y += dx * sens
      this.rotation.x -= dy * sens
      this.velocity.x = -dy * sens
      this.velocity.y = dx * sens
    },

    onDragEnd() {
      this.isDragging = false
      this.removeDragListeners()
    },

    removeDragListeners() {
      window.removeEventListener("mousemove", this.onDragMove)
      window.removeEventListener("mouseup", this.onDragEnd)
      window.removeEventListener("touchmove", this.onDragMove)
      window.removeEventListener("touchend", this.onDragEnd)
      window.removeEventListener("touchcancel", this.onDragEnd)
    },

    // ---------- 业务逻辑 ----------

    avatarStyle(item) {
      return {
        width: `${item.size}px`,
        height: `${item.size}px`,
        transform: `translate3d(${item.px - item.size / 2}px, ${item.py - item.size / 2}px, ${item.pz}px)`,
      }
    },

    openAvatarDetails(item) {
      // 拖动松手时不触发点击
      if (this.dragMoved) return
      if (!item || item.detailId === undefined || item.detailId === null || item.detailId === "") {
        this.$myMessage({
          type: "font-error",
          message: "暂无数据可查看!",
        })
        return
      }
      this.detailsId = item.detailId
      this.shootDetailsShow = true
      this.$nextTick(() => {
        this.$refs.shootRef.getDetails()
      })
    },

    async openPopup(item) {
      if (item.className === "check") {
        this.shootShow = true
      }
      if (item.className === "statistics") {
        this.$router.push("/smileCheck/statistics")
      }
      if (item.className === "random") {
        const validPool = (this.avatarPool || []).filter(
          (poolItem) => poolItem && poolItem.id !== undefined && poolItem.id !== null && poolItem.id !== "",
        )
        if (!validPool.length) {
          this.$myMessage({
            type: "font-error",
            message: "暂无数据可查看!",
          })
          return
        }
        const randomIndex = Math.floor(Math.random() * validPool.length)
        const randomItem = validPool[randomIndex]
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
  overflow: hidden;
  background-size: 100% 100%;
  background-image: url(@/assets/img/front/smileCheck/bg.png);

  .star_field {
    width: min(900px, 92vw);
    height: min(600px, 62vh);
    position: absolute;
    left: 50%;
    top: 46%;
    transform: translate(-50%, -50%);
    perspective: 1000px;
    perspective-origin: 50% 50%;
    touch-action: none;
    user-select: none;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }

    &.dragging,
    &.dragging .avatar_dot {
      cursor: grabbing;
    }

    .sphere {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 0;
      height: 0;
      transform-style: preserve-3d;
      transform-origin: 0 0;

      .avatar_dot {
        position: absolute;
        left: 0;
        top: 0;
        transform-origin: 50% 50%;
        border-radius: 0;
        overflow: visible;
        border: 0;
        box-shadow: none;
        background-image: url(@/assets/img/front/smileCheck/气泡.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        &.bubble_alt {
          background-image: url(@/assets/img/front/smileCheck/气泡2.png);
        }

        > img {
          width: 70%;
          height: 77%;
          display: block;
          border-radius: 50%;
          object-fit: cover;
          pointer-events: none;
          transition: transform 0.2s ease;
        }

        &:hover > img {
          transform: scale(1.12);
        }
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
