
        for (let i = users.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[users[i], users[j]] = [users[j], users[i]]
        }
        users = users.slice(0, this.maxAvatars)
      }

      const N = users.length
      const R = this.sphereRadius
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
          size: this.avatarSize,
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

        // 计算旋转后每个头像在视空间的 z（与 CSS rotateX→rotateY 矩阵一致）
        const z1 = item.py * sinRx + item.pz * cosRx
        const z2 = -item.px * sinRy + z1 * cosRy
        const norm = z2 / R // [-1, 1]
        const opacity = minOpacity + (1 - minOpacity) * ((norm + 1) / 2)
        el.style.opacity = opacity
      }
    },

    // ---------- 拖动 / 惯性 ----------

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
