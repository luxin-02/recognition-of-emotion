<template>
  <div class="smile_check">
    <div class="star_field" ref="starField">
      <div
        v-for="item in smileUsers"
        :key="item.id"
        :class="['avatar_dot', { visible: item.visible }]"
        :style="avatarStyle(item)"
      >
        <img :src="item.avatar" />
      </div>
    </div>

    <div class="bottom_panel">
      <div
        v-for="item in tabs"
        :key="item.name"
        class="tab_item"
        :class="item.className"
        @click="openPopup(item)"
      >
        <span>{{ item.name }}</span>
      </div>
    </div>

    <shoot :show.sync="shootShow" />
    <shootDetails :show.sync="shootDetailsShow" />
  </div>
</template>

<script>
import shoot from "./components/shoot.vue"
import shootDetails from "./components/shootDetails.vue"

export default {
  components: {
    shoot,
    shootDetails,
  },
  data() {
    return {
      // smileUsers: 组件渲染的固定数量 DOM 列表（最多 15 个）
      // 每个对象包含：id, avatar, left, top, size, visible, renderKey 等字段
      smileUsers: [],
      // 底部 tab 列表
      tabs: [
        { name: "打卡统计", className: "statistics" },
        { name: "微笑打卡", className: "check" },
        { name: "随机查看", className: "random" },
      ],
      // 定时器 id（用于自动替换头像）
      swapIntervalId: null,
      // 默认占位头像（从 store 或本地文件获得）
      defaultAvatar: null,
      // avatarPool: 从后端获取的头像池（例如 50 条），组件在 15 个位置中循环展示
      avatarPool: [],
      // poolIndex: 指向下一个从 avatarPool 取出的索引
      poolIndex: 0,
      // recentQueue: 记录最近展示过的 avatar id，避免短期内重复显示
      recentQueue: [],
      // recentMax: 最近队列最大长度（可根据同时可见数量调整）
      recentMax: 12,
      // retryLimit: 在寻找非 recent 项时的重试上限，防止死循环
      retryLimit: 60,
      // container: 组件实际渲染的星域尺寸，用于动态位置计算
      container: {
        width: 900,
        height: 600,
        cx: 450,
        cy: 300,
      },
      shootShow: false,
      shootDetailsShow: false,
    }
  },
  // Vue 生命周期：组件挂载后初始化数据并启动自动替换
  async mounted() {
    await this.$nextTick()
    this.updateContainerConfig()
    await this.initSmileUsers()
    this.startAvatarSwap()
    window.addEventListener("resize", this.onResize)
  },
  // 组件销毁前清理定时器
  beforeDestroy() {
    if (this.swapIntervalId) {
      clearInterval(this.swapIntervalId)
      this.swapIntervalId = null
    }
    window.removeEventListener("resize", this.onResize)
  },
  methods: {
    // initSmileUsers：初始化入口
    // - 从 store 获取默认头像
    // - 调用 loadSmileUserData 获取本地假数据（用户头像池）
    // - 调用 generateSmileUsers 在椭圆区域内生成固定数量的位置/尺寸，并用 avatarPool 填充初始头像
    async initSmileUsers() {
      this.defaultAvatar =
        this.$store.getters.userAvatar || require("@/assets/img/front/ph/1.png")
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
      if (
        this.container.width !== oldWidth ||
        this.container.height !== oldHeight
      ) {
        this.generateSmileUsers(this.avatarPool)
      }
    },

    // loadSmileUserData：返回本地假数据（用户头像池）
    // - 目前后端接口暂未开发，使用本地假数据
    // - TODO: 当后端接口准备就绪时，替换为真实接口调用
    // - 假数据格式：{ id, name, imgurl }，imgurl 指向本地头像图片路径
    async loadSmileUserData() {
      // TODO: 当后端接口准备好后，替换为以下代码：
      // try {
      //   const { userFrontApiList } = await import("@/server/api/user")
      //   const res = await userFrontApiList({ page: 1, pageSize: 100 })
      //   // ... 处理返回数据 ...
      // } catch (error) {
      //   throw error // 接口请求失败时抛出错误
      // }

      // 当前使用本地假数据
      const mockData = [
        {
          id: 1,
          name: "管理员",
          imgurl: require("@/assets/img/front/ph/1.png"),
        },
        {
          id: 2,
          name: "用户A",
          imgurl: require("@/assets/img/front/ph/1.png"),
        },
        {
          id: 3,
          name: "用户B",
          imgurl: require("@/assets/img/front/ph/1.png"),
        },
        {
          id: 4,
          name: "用户C",
          imgurl: require("@/assets/img/front/ph/1.png"),
        },
        {
          id: 5,
          name: "用户D",
          imgurl: require("@/assets/img/front/ph/1.png"),
        },
        {
          id: 6,
          name: "用户E",
          imgurl: require("@/assets/img/front/ph/1.png"),
        },
        {
          id: 7,
          name: "用户F",
          imgurl: require("@/assets/img/front/ph/1.png"),
        },
        {
          id: 8,
          name: "用户G",
          imgurl: require("@/assets/img/front/ph/1.png"),
        },
        {
          id: 9,
          name: "用户H",
          imgurl: require("@/assets/img/front/ph/1.png"),
        },
        {
          id: 10,
          name: "用户I",
          imgurl: require("@/assets/img/front/ph/1.png"),
        },
        {
          id: 11,
          name: "用户J",
          imgurl: require("@/assets/img/front/ph/1.png"),
        },
        {
          id: 12,
          name: "用户K",
          imgurl: require("@/assets/img/front/ph/1.png"),
        },
        {
          id: 13,
          name: "用户L",
          imgurl: require("@/assets/img/front/ph/1.png"),
        },
        {
          id: 14,
          name: "用户M",
          imgurl: require("@/assets/img/front/ph/1.png"),
        },
        {
          id: 15,
          name: "用户N",
          imgurl: require("@/assets/img/front/ph/1.png"),
        },
      ]
      return mockData.map((item) => ({
        id: item.id,
        avatar: item.imgurl,
        name: item.name,
      }))
    },

    // generateSmileUsers：在椭圆容器内生成固定数量的位置与尺寸（默认 15）
    // - 将后端返回的 avatarData 保存为 `avatarPool`（池子用于后续轮换）
    // - 使用极坐标 + sqrt 随机分布并做圆碰撞检测以避免头像重叠
    // - 初始分配头像时按顺序从 `avatarPool` 取值（poolIndex 用于记录下一次取值的位置）
    generateSmileUsers(avatarData = []) {
      // 保存池到组件状态，后续替换会基于这个池循环取值
      this.avatarPool =
        avatarData && avatarData.length
          ? avatarData
          : [{ avatar: this.defaultAvatar }]
      this.poolIndex = 0
      const maxCount = 15
      this.smileUsers = []
      const container = {
        width: this.container.width,
        height: this.container.height,
        cx: this.container.cx,
        cy: this.container.cy,
      }
      const resizeScale = Math.min(
        container.width / 900,
        container.height / 600,
        1,
      )
      const minSize = Math.max(32, Math.floor(56 * resizeScale))
      const maxSize = Math.max(minSize + 10, Math.floor(94 * resizeScale))
      const margin = 8 // 最小间距，避免贴边或重叠
      const placed = [] // 已放置的头像，用于碰撞检测

      // 判断点 (x,y) 是否在椭圆内（中心(cx,cy)，长轴 a，短轴 b）
      const inEllipse = (cx, cy, a, b, x, y) => {
        const dx = x - cx
        const dy = y - cy
        return (dx * dx) / (a * a) + (dy * dy) / (b * b) <= 1
      }

      // 简单的圆碰撞检测：判断 item 与 placed 中任一项是否重叠
      const collides = (item, others) => {
        return others.some((other) => {
          const dx = item.cx - other.cx
          const dy = item.cy - other.cy
          const minDist = item.radius + other.radius + margin
          return dx * dx + dy * dy < minDist * minDist
        })
      }

      // tryPlaceItem：尝试在椭圆内随机放置单个头像（最多 120 次），避免与已放置项碰撞
      // - 会根据随机 size 计算半径，并在缩小的椭圆区域内随机取点
      // - 成功时返回包含坐标/尺寸/头像等字段的 item，否则返回 null
      let assignIndex = 0
      const tryPlaceItem = (id) => {
        const size =
          Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize
        const radius = size / 2
        const a = container.width / 2 - radius - margin
        const b = container.height / 2 - radius - margin
        if (a <= 0 || b <= 0) {
          return null
        }

        for (let attempt = 0; attempt < 120; attempt += 1) {
          // 使用极坐标在椭圆内随机分布，sqrt 保持密度均匀
          const angle = Math.random() * Math.PI * 2
          const r = Math.sqrt(Math.random())
          const x = container.cx + a * r * Math.cos(angle)
          const y = container.cy + b * r * Math.sin(angle)
          if (!inEllipse(container.cx, container.cy, a, b, x, y)) {
            continue
          }
          // 从 avatarPool 顺序分配初始头像（循环使用池内头像）
          const poolItem = this.avatarPool[
            assignIndex % this.avatarPool.length
          ] || { avatar: this.defaultAvatar }
          const item = {
            id,
            avatar: poolItem.avatar,
            size,
            radius,
            cx: x,
            cy: y,
            visible: false,
            renderKey: `${id}-${Date.now()}`,
          }
          if (!collides(item, placed)) {
            // left/top 用于绑定到元素的绝对定位
            item.left = x - radius
            item.top = y - radius
            placed.push(item)
            assignIndex += 1
            return item
          }
        }
        return null
      }

      // 生成上下文中的头像对象（不直接改变 DOM，仅准备数据）
      for (let i = 0; i < maxCount; i += 1) {
        const item = tryPlaceItem(i + 1)
        if (item) {
          this.smileUsers.push(item)
        }
      }

      // 随机打乱并让前 12 项可见（保证至少 12 个同时显示）
      this.smileUsers.sort(() => Math.random() - 0.5)
      const initialVisible = Math.min(12, this.smileUsers.length)
      this.smileUsers.forEach((item, index) => {
        item.visible = index < initialVisible
        item.renderKey = `${item.id}-${item.visible ? "v" : "h"}-${Date.now()}`
      })
      // 初始化 recentQueue：使用当前可见头像对应的 avatar id（若有），避免刚开始就重复出现
      const visibleAvatarIds = this.smileUsers
        .slice(0, initialVisible)
        .map((it) => it.avatar)
        .map((a) => {
          // 在池中查找与 avatar URL 对应的 id（avatarPool 中应包含 id 字段）
          const found = this.avatarPool.find((p) => p.avatar === a)
          return found ? found.id : null
        })
        .filter(Boolean)
      this.recentQueue = Array.from(new Set(visibleAvatarIds)).slice(
        -this.recentMax,
      )
      // poolIndex 指向下一个未分配的池项（从已分配数量开始）
      if (this.avatarPool && this.avatarPool.length) {
        this.poolIndex = this.smileUsers.length % this.avatarPool.length
      } else {
        this.poolIndex = 0
      }
    },

    // startAvatarSwap：定时交换可见/隐藏头像并从 avatarPool 轮换新头像
    // 行为要点：
    // - 每次交换隐藏若干当前可见项，并从隐藏项上显示新的头像
    // - 新头像从 `avatarPool` 中随机挑选，但会尽量避开 `recentQueue`（最近展示队列），以减少短期重复
    // - 在同一替换周期内使用 `tempPickedIds` 避免选到相同头像两次
    // - 若找不到非 recent 的头像，会有退避回退策略以避免死循环
    startAvatarSwap() {
      const swapDelay = 3200 // 每次交换的间隔（毫秒）
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
        // 本轮已选中的 avatar id，避免在同一替换周期内重复选中
        const tempPickedIds = new Set()
        const pickNonRecentFromPool = (excludeSet) => {
          const pool = this.avatarPool || []
          if (!pool.length) return null
          // 当池子较小时，允许更小的 recent 限制
          const effectiveRecentLimit = Math.min(
            this.recentMax,
            Math.max(1, Math.floor(pool.length * 0.6)),
          )
          let tries = 0
          while (tries++ < this.retryLimit) {
            const idx = Math.floor(Math.random() * pool.length)
            const p = pool[idx]
            if (!p) continue
            const pid = p.id || idx
            if (excludeSet && excludeSet.has(pid)) continue
            if (!this.recentQueue.includes(pid)) return p
          }
          // 回退：尽量不与本轮已选冲突
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
          // 记录本轮已选，避免重复以及维护最近队列
          const pid = poolItem.id || null
          if (pid !== null && pid !== undefined) {
            tempPickedIds.add(pid)
            this.recentQueue.push(pid)
            if (this.recentQueue.length > this.recentMax) {
              this.recentQueue.shift()
            }
          }
          item.visible = true
          // advance poolIndex for backward compatibility (keeps sequential pointer moving)
          if (this.avatarPool && this.avatarPool.length) {
            this.poolIndex = (this.poolIndex + 1) % this.avatarPool.length
          }
        })
      }, swapDelay)
    },

    // avatarStyle：返回内联样式以定位与设置大小
    avatarStyle(item) {
      return {
        left: `${item.left}px`,
        top: `${item.top}px`,
        width: `${item.size}px`,
        height: `${item.size}px`,
      }
    },

    openPopup(item) {
      if (item.className === "check") {
        this.shootShow = true
      }
      if (item.className === "statistics") {
        this.$router.push("/smileCheck/statistics")
      }
      if (item.className === "random") {
        this.shootDetailsShow = true
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
