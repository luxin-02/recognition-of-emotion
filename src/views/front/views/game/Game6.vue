<template>
    <div class="maze-page">
        <!-- 背景装饰层 -->
        <div class="bg-layer">
            <div class="bg-aurora"></div>
            <div class="bg-stars"></div>
            <div class="bg-stars s2"></div>
            <div class="bg-glow glow-1"></div>
            <div class="bg-glow glow-2"></div>
            <div class="bg-glow glow-3"></div>
            <span
                v-for="f in fireflies" :key="'f'+f.id"
                class="firefly"
                :style="{ left: f.left+'%', top: f.top+'%', animationDelay: f.delay+'s', animationDuration: f.dur+'s' }"
            ></span>
        </div>

        <!-- 顶部导航 -->
        <div class="page-header">
            <div class="back-btn" @click="$router.go(-1)">
                <span class="back-arrow">‹</span>
                <span>返回</span>
            </div>
            <div class="header-title" v-if="curStatus == 2">
                <span class="title-icon">🧭</span> 迷宫探险
            </div>
            <div class="header-right"></div>
        </div>

        <div class="page-body">
            <!-- 开始界面 -->
            <div v-if="curStatus == 1" class="start-screen" @dblclick="start()">
                <div class="start-card">
                    <div class="start-badge">MAZE ADVENTURE</div>
                    <div class="start-img-wrap">
                        <img src="@/assets/images/game/game6/start.png" alt="">
                        <div class="start-ring"></div>
                    </div>
                    <h2>迷宫探险</h2>
                    <p class="start-sub">穿越魔法迷宫，找到回家的路</p>
                    <div class="start-features">
                        <span><i>💎</i>收集宝石</span>
                        <span><i>⌨️</i>键盘操作</span>
                        <span><i>🏆</i>五星通关</span>
                    </div>
                    <div class="start-action">
                        <span class="pulse-dot"></span>
                        双击任意位置开始
                    </div>
                </div>
            </div>

            <!-- 游戏界面 -->
            <div v-else class="game-screen">
                <!-- 状态栏 -->
                <div class="status-bar">
                    <div class="status-chip chip-level">
                        <span class="chip-icon">🗺️</span>
                        <span class="chip-label">关卡</span>
                        <span class="chip-value">{{level}}<em>/5</em></span>
                    </div>
                    <div class="status-chip chip-steps">
                        <span class="chip-icon">👣</span>
                        <span class="chip-label">步数</span>
                        <span class="chip-value">{{steps}}</span>
                    </div>
                    <div class="status-chip chip-gem">
                        <span class="chip-icon">💎</span>
                        <span class="chip-label">宝石</span>
                        <span class="chip-value">{{gems}}<em>/3</em></span>
                    </div>
                    <div class="status-chip chip-time">
                        <span class="chip-icon">⏱️</span>
                        <span class="chip-label">总用时</span>
                        <span class="chip-value">{{time}}<em>s</em></span>
                    </div>
                    <div class="status-chip chip-tip">
                        <span class="chip-icon">💡</span>
                        <span class="chip-text">{{tips}}</span>
                    </div>
                </div>

                <!-- 主游戏区 -->
                <div class="play-area" ref="playArea">
                    <!-- 迷宫 -->
                    <div class="maze-panel" ref="mazePanel">
                        <div class="maze-frame" :style="frameStyle">
                            <ul id="maze" :style="mazeStyle" @touchstart="onTouchStart" @touchend="onTouchEnd">
                                <template v-for="(item, rindex) in map">
                                    <li
                                        v-for="(sitem, sindex) in item" :key="rindex+'-'+sindex"
                                        class="block"
                                        :class="[sitem.className, { 'gem-cell': sitem.gem && !sitem.got, 'bump': sitem.bump }]"
                                        :style="cellStyle"
                                    >
                                        <span v-if="sitem.gem && !sitem.got" class="gem-mark">💎</span>
                                    </li>
                                </template>
                            </ul>
                            <!-- 玩家角色 -->
                            <div class="player" :class="{ 'player-shake': playerShake }" :style="playerStyle">
                                <span class="player-face">🐾</span>
                                <span class="player-trail"></span>
                            </div>
                        </div>
                        <div class="legend">
                            <span class="legend-item"><i class="legend-dot d-start"></i>起点</span>
                            <span class="legend-item"><i class="legend-dot d-end"></i>家</span>
                            <span class="legend-item"><i class="legend-dot d-path"></i>已走路径</span>
                            <span class="legend-item"><i class="legend-dot d-gem"></i>宝石</span>
                        </div>
                    </div>

                    <!-- 右侧控制面板 -->
                    <div class="control-panel">
                        <!-- 关卡进度 -->
                        <div class="level-dots">
                            <span v-for="n in 5" :key="n" class="dot" :class="{ active: n===level, done: n<level }"></span>
                        </div>

                        <div class="btn-group">
                            <button class="game-btn btn-restart" @click="start(1)">
                                <span>🔄</span> 再玩一次
                            </button>
                            <!-- <button class="game-btn btn-next" @click="start(2)">
                                {{level == 5 ? '返回' : '下一关'}} <span>▶</span>
                            </button> -->
                        </div>

                        <div class="info-card rules-card">
                            <h3>📜 游戏规则</h3>
                            <p>使用方向键或下方按钮控制小精灵移动，穿过迷宫墙壁间的道路找到家。沿途别忘了收集宝石！</p>
                            <div class="keyboard-tip">
                                <span>⌨️ 支持键盘方向键 / WASD</span>
                            </div>
                        </div>

                        <div class="info-card dpad-card">
                            <h3>🎮 方向控制</h3>
                            <div class="dpad">
                                <button class="dpad-btn dpad-up" @click="animation([-1, 0])">▲</button>
                                <button class="dpad-btn dpad-left" @click="animation([0, -1])">◀</button>
                                <button class="dpad-btn dpad-right" @click="animation([0, 1])">▶</button>
                                <button class="dpad-btn dpad-down" @click="animation([1, 0])">▼</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 通关弹窗 -->
        <div class="modal-mask" v-if="isVisible">
            <div class="modal-card">
                <div class="modal-stars-row">
                    <span v-for="n in 3" :key="n" class="m-star" :class="{ lit: n <= starRating }">⭐</span>
                </div>
                <h2 class="modal-title">{{modalTitle}}</h2>
                <div class="modal-body" v-html="strText"></div>
                <div class="modal-btns" v-if="!isReporting">
                    <button class="modal-btn btn-replay" @click="replayLevel">再玩一次</button>
                    <button v-if="level < 5" class="modal-btn btn-next-level" @click="nextLevel">下一关</button>
                    <button v-else class="modal-btn btn-finish" @click="finishGame">完成</button>
                </div>
                <div class="modal-loading" v-else>正在保存成绩...</div>
            </div>
        </div>
    </div>
</template>

<script>
import { reportApiAdd } from "@/server/api/report"
export default {
    data() {
        return {
            curStatus: 1,
            timer: null,
            time: 0,
            isVisible: false,
            strText: '',
            modalTitle: '恭喜通关',
            starRating: 3,
            isReporting: false,

            map: [],
            tips: '',
            rows: 0,
            cols: 0,
            lock: 0,
            x: 1,
            y: 2,
            endX: 0,
            endY: 0,
            level: 1,
            isClick: true,

            // 新增玩法数据
            steps: 0,
            gems: 0,
            playerShake: false,
            cellSize: 48,
            bestRecords: {},

            // 累计
            totalTime: 0,
            totalSteps: 0,
            totalGems: 0,
            levelStats: {},

            // 触摸
            touchStartX: 0,
            touchStartY: 0,

            // 萤火虫
            fireflies: [],
        }
    },
    computed: {
        mazeStyle() {
            return {
                width: (this.cols * this.cellSize) + 'px',
                height: (this.rows * this.cellSize) + 'px',
            }
        },
        frameStyle() {
            return {
                padding: Math.max(8, this.cellSize * 0.18) + 'px',
                borderRadius: Math.max(12, this.cellSize * 0.3) + 'px',
            }
        },
        cellStyle() {
            return {
                width: this.cellSize + 'px',
                height: this.cellSize + 'px',
                fontSize: this.cellSize + 'px',
            }
        },
        playerStyle() {
            const pad = Math.max(8, this.cellSize * 0.18)
            return {
                width: this.cellSize + 'px',
                height: this.cellSize + 'px',
                left: (pad + this.x * this.cellSize) + 'px',
                top: (pad + this.y * this.cellSize) + 'px',
                fontSize: this.cellSize + 'px',
            }
        },
    },
    methods: {
        start(val) {
            this.isClick = true;
            this.curStatus = 2;
            this.steps = 0;
            this.gems = 0;
            this.isVisible = false;
            this.isReporting = false;
            // 计时器全程累计，仅全新开始（从开始页双击进入）时归零并启动
            if (val === undefined) {
                this.clearTimer();
                this.time = 0;
                this.level = 1;
                this.totalTime = 0;
                this.totalSteps = 0;
                this.totalGems = 0;
                this.levelStats = {};
            }
            if (val == 2) {
                if (this.level < 5) {
                    this.level++;
                } else {
                    this.$router.go(-1);
                    return;
                }
            }
            if (this.level == 1) {
                this.rows = 7; this.cols = 7;
            } else if (this.level == 2) {
                this.rows = 8; this.cols = 8;
            } else if (this.level == 3) {
                this.rows = 14; this.cols = 14;
            } else if (this.level == 4) {
                this.rows = 16; this.cols = 16;
            } else {
                this.rows = 28; this.cols = 28;
            }
            // 下一关/重玩时计时器保持运行，不重新计时
            if (val === undefined) this.countTime();
            this.$nextTick(() => {
                this.calcCellSize();
                this.init();
                this.clearStyle();
            })
        },
        clearTimer() {
            clearInterval(this.timer);
            this.timer = null;
        },
        countTime() {
            this.timer = setInterval(() => {
                this.time++;
            }, 1000);
        },
        // 根据容器尺寸计算格子大小
        calcCellSize() {
            this.$nextTick(() => {
                const play = this.$refs.playArea;
                if (!play) return;
                const playRect = play.getBoundingClientRect();
                const controlWidth = 280;
                const gap = 36;
                const padding = 20;
                const availW = playRect.width - controlWidth - gap - padding;
                const availH = playRect.height - 50;
                let size = Math.floor(Math.min(availW / this.cols, availH / this.rows));
                const maxSize = this.level <= 2 ? 72 : (this.level <= 4 ? 52 : 30);
                const minSize = this.level >= 5 ? 14 : 22;
                size = Math.max(minSize, Math.min(maxSize, size));
                this.cellSize = size;
            });
        },
        randomSort(arr) {
            arr.sort(function () {
                return Math.random() - 0.5;
            });
        },
        clearStyle() {
            var liArr = document.getElementById('maze').getElementsByTagName('li');
            for (var i = 0; i < liArr.length; i++) {
                liArr[i].style.backgroundColor = '';
                liArr[i].style.boxShadow = '';
            }
        },
        init() {
            this.lock = 0;
            this.tips = "按方向键或下方按钮开始冒险";
            this.x = 1;
            this.y = 2;
            this.createMap();
            this.randomMap();
            this.placeGems();
            this.renderTips();
        },
        createMap() {
            this.map = new Array(this.rows);
            for (var i = 0; i < this.rows; i++) {
                this.map[i] = new Array(this.cols);
                for (var j = 0; j < this.cols; j++) {
                    if (i == 0 || i == this.rows - 1) {
                        this.map[i][j] = { className: 'road', isThrough: -1, gem: false, got: false, bump: false };
                    } else if (j == 0 || j == this.cols - 1) {
                        this.map[i][j] = { className: 'road', isThrough: -1, gem: false, got: false, bump: false };
                    } else {
                        this.map[i][j] = { className: 'wall', isThrough: -1, gem: false, got: false, bump: false };
                    }
                }
            }
        },
        randomMap() {
            var X = [], Y = [];
            X.push(2);
            Y.push(2);
            while (X.length != 0) {
                var r = Math.floor(Math.random() * X.length);
                var x = X[r],
                    y = Y[r];
                var count = 0;
                for (var i = x - 1; i < x + 2; i++) {
                    for (var j = y - 1; j < y + 2; j++) {
                        if (Math.abs(x - i) + Math.abs(y - j) == 1 && this.map[i][j].className == 'road') {
                            ++count;
                        }
                    }
                }
                if (count <= 1) {
                    this.map[x][y].className = 'road';
                    this.map[x][y].isThrough = 0;
                    for (var i = x - 1; i < x + 2; i++) {
                        for (var j = y - 1; j < y + 2; j++) {
                            if (Math.abs(x - i) + Math.abs(y - j) == 1 && this.map[i][j].className == 'wall') {
                                X.push(i);
                                Y.push(j);
                            }
                        }
                    }
                }
                X.splice(r, 1);
                Y.splice(r, 1);
            }
            this.map[2][1] = {
                className: 'in',
                isThrough: 1,
                gem: false, got: false, bump: false
            }
            for (var i = this.rows - 3; i >= 0; i--) {
                if (this.map[i][this.cols - 3].className == 'road') {
                    this.map[i][this.cols - 2].className = 'out';
                    this.map[i][this.cols - 2].isThrough = 0;
                    this.map[i][this.cols - 2].gem = false;
                    this.endX = this.cols - 2;
                    this.endY = i;
                    break;
                }
            }
        },
        // 在迷宫道路上随机放置3个宝石
        placeGems() {
            const roads = [];
            for (let i = 1; i < this.rows - 1; i++) {
                for (let j = 1; j < this.cols - 1; j++) {
                    if (this.map[i][j].className === 'road' && this.map[i][j].isThrough === 0) {
                        // 避开起点附近和终点
                        const distFromStart = Math.abs(i - 2) + Math.abs(j - 1);
                        const distFromEnd = Math.abs(i - this.endY) + Math.abs(j - this.endX);
                        if (distFromStart > 2 && distFromEnd > 1) {
                            roads.push([i, j]);
                        }
                    }
                }
            }
            this.randomSort(roads);
            const count = Math.min(3, roads.length);
            for (let k = 0; k < count; k++) {
                const [i, j] = roads[k];
                this.map[i][j].gem = true;
            }
        },
        // BFS 计算最短路径长度（用于星级评价）
        shortestPathLen() {
            const visited = {};
            const queue = [[2, 1, 0]];
            visited['2,1'] = true;
            const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            while (queue.length) {
                const [y, x, d] = queue.shift();
                if (y === this.endY && x === this.endX) return d;
                for (const [dy, dx] of dirs) {
                    const ny = y + dy, nx = x + dx;
                    const key = ny + ',' + nx;
                    if (ny >= 0 && ny < this.rows && nx >= 0 && nx < this.cols &&
                        !visited[key] && this.map[ny][nx].isThrough !== -1) {
                        visited[key] = true;
                        queue.push([ny, nx, d + 1]);
                    }
                }
            }
            return 0;
        },
        renderTips(status) {
            if (!this.lock) {
                this.tips = '按方向键或下方按钮开始冒险';
            }
            if (this.lock) {
                if (status == 'wall') {
                    this.tips = '前面是墙壁，换条路试试吧！';
                } else if (status == 'back') {
                    this.tips = '你正在原路返回';
                } else if (status == 'up') {
                    this.tips = '你正在往上走';
                } else if (status == 'down') {
                    this.tips = '你正在往下走';
                } else if (status == 'right') {
                    this.tips = '你正在往右走';
                } else if (status == 'left') {
                    this.tips = '你正在往左走';
                } else if (status == 'gem') {
                    this.tips = '✨ 捡到一颗宝石！';
                }
            }
        },
        // 运动函数
        animation(directionArr) {
            if (this.isClick == true) {
                this.lock = 1;
                var up = directionArr[0];
                var right = directionArr[1];
                var liArr = document.getElementById('maze').getElementsByTagName('li');
                const nextY = this.y + up;
                const nextX = this.x + right;
                if (this.map[nextY] && this.map[nextY][nextX] && this.map[nextY][nextX].isThrough == -1) {
                    // 下一个是墙
                    this.renderTips('wall');
                    this.triggerBump(nextY, nextX);
                    this.playerShake = true;
                    setTimeout(() => { this.playerShake = false; }, 300);
                } else if (this.map[nextY][nextX].isThrough == 0) {
                    // 下一个是未走过的路
                    this.steps++;
                    if (this.map[nextY][nextX].className == 'out') {
                        var num = nextY * this.cols + nextX;
                        this.map[nextY][nextX].isThrough = 1;
                        liArr[num].style.backgroundColor = 'rgba(168, 230, 255, 0.55)';
                        this.x = nextX;
                        this.y = nextY;
                        this.handleWin();
                    } else {
                        var num = nextY * this.cols + nextX;
                        this.map[nextY][nextX].isThrough = 1;
                        liArr[num].style.backgroundColor = 'rgba(168, 230, 255, 0.55)';
                        liArr[num].style.boxShadow = 'inset 0 0 8px rgba(100, 200, 255, 0.4)';
                        this.x = nextX;
                        this.y = nextY;
                        // 拾取宝石
                        if (this.map[nextY][nextX].gem && !this.map[nextY][nextX].got) {
                            this.map[nextY][nextX].got = true;
                            this.gems++;
                            this.renderTips('gem');
                        } else {
                            if (right == 1 && up == 0) this.renderTips('right');
                            else if (right == -1 && up == 0) this.renderTips('left');
                            else if (right == 0 && up == -1) this.renderTips('up');
                            else if (right == 0 && up == 1) this.renderTips('down');
                        }
                    }
                } else {
                    // 返回走
                    this.steps++;
                    var num = this.y * this.cols + this.x;
                    liArr[num].style.backgroundColor = '';
                    liArr[num].style.boxShadow = '';
                    this.map[this.y][this.x].isThrough = 0;
                    this.x = nextX;
                    this.y = nextY;
                    this.renderTips('back');
                }
            } else {
                this.$toast("", "请点击按钮才能玩哦！")
            }
        },
        triggerBump(y, x) {
            if (this.map[y] && this.map[y][x]) {
                this.map[y][x].bump = true;
                setTimeout(() => { this.map[y][x].bump = false; }, 350);
            }
        },
        handleWin() {
            // 仅全部通关时停止计时，前 4 关计时器继续累计
            if (this.level === 5) this.clearTimer();
            this.isClick = false;
            // 记录本关成绩（重玩会覆盖）；time 全程累计即总用时，不再分关相加
            this.$set(this.levelStats, this.level, { steps: this.steps, gems: this.gems });
            const stats = Object.values(this.levelStats);
            this.totalTime = this.time;
            this.totalSteps = stats.reduce((s, v) => s + v.steps, 0);
            this.totalGems = stats.reduce((s, v) => s + v.gems, 0);

            // 计算星级
            const optimal = this.shortestPathLen();
            const ratio = optimal > 0 ? this.steps / optimal : 1;
            if (ratio <= 1.5 && this.gems >= 2) this.starRating = 3;
            else if (ratio <= 2.5) this.starRating = 2;
            else this.starRating = 1;

            // 最佳记录
            const key = 'maze6_best_lvl' + this.level;
            const prev = this.bestRecords[key];
            if (!prev || this.time < prev.time || (this.time === prev.time && this.steps < prev.steps)) {
                this.bestRecords[key] = { time: this.time, steps: this.steps, gems: this.gems, stars: this.starRating };
                try { localStorage.setItem(key, JSON.stringify(this.bestRecords[key])); } catch (e) {}
            }

            const best = this.bestRecords[key];

            if (this.level < 5) {
                this.modalTitle = '第 ' + this.level + ' 关通过';
                this.strText = `
                    <div class="result-stats">
                        <div class="rs-row"><span>⏱️ 总用时</span><b>${this.time} 秒</b></div>
                        <div class="rs-row"><span>👣 步数</span><b>${this.steps} 步</b></div>
                        <div class="rs-row"><span>💎 宝石</span><b>${this.gems} / 3</b></div>
                        <div class="rs-row best"><span>🏆 最佳</span><b>${best.time}秒 / ${best.steps}步</b></div>
                    </div>
                    <p class="rs-tip">${this.level < 5 ? '准备好挑战下一关了吗？' : ''}</p>
                `;
            } else {
                this.modalTitle = '🎉 全部通关！';
                this.strText = `
                    <div class="result-stats">
                        <div class="rs-row"><span>⏱️ 总用时</span><b>${this.totalTime} 秒</b></div>
                        <div class="rs-row"><span>👣 总步数</span><b>${this.totalSteps} 步</b></div>
                        <div class="rs-row"><span>💎 总宝石</span><b>${this.totalGems} / 15</b></div>
                    </div>
                    <p class="rs-tip">你成功穿越了所有迷宫，太棒了！</p>
                `;
            }
            this.isVisible = true;
        },
        replayLevel() {
            this.isVisible = false;
            this.start(1);
        },
        nextLevel() {
            this.isVisible = false;
            this.start(2);
        },
        async finishGame() {
            this.isReporting = true;
            try {
                await reportApiAdd({
                    cat_name: "心理训练",
                    game_name: "迷宫",
                    score: 100,
                    seconds: this.totalTime || this.time,
                }).then(({ data }) => {
                    if (data.code == this.$global.successCode) {
                        this.$router.go(-1);
                    } else {
                        this.isReporting = false;
                        this.$toast("", "保存失败，请重试");
                    }
                })
            } catch (e) {
                this.isReporting = false;
                this.$toast("", "网络异常，请重试");
            }
        },
        // 键盘控制
        onKeyDown(e) {
            if (this.curStatus !== 2 || !this.isClick) return;
            const key = e.key;
            if (key === 'ArrowUp' || key === 'w' || key === 'W') { e.preventDefault(); this.animation([-1, 0]); }
            else if (key === 'ArrowDown' || key === 's' || key === 'S') { e.preventDefault(); this.animation([1, 0]); }
            else if (key === 'ArrowLeft' || key === 'a' || key === 'A') { e.preventDefault(); this.animation([0, -1]); }
            else if (key === 'ArrowRight' || key === 'd' || key === 'D') { e.preventDefault(); this.animation([0, 1]); }
        },
        onTouchStart(e) {
            const t = e.touches[0];
            this.touchStartX = t.clientX;
            this.touchStartY = t.clientY;
        },
        onTouchEnd(e) {
            const t = e.changedTouches[0];
            const dx = t.clientX - this.touchStartX;
            const dy = t.clientY - this.touchStartY;
            const absX = Math.abs(dx), absY = Math.abs(dy);
            if (Math.max(absX, absY) < 24) return;
            if (absX > absY) {
                this.animation([0, dx > 0 ? 1 : -1]);
            } else {
                this.animation([dy > 0 ? 1 : -1, 0]);
            }
        },
        onResize() {
            if (this.curStatus === 2) this.calcCellSize();
        },
        genFireflies() {
            const arr = [];
            for (let i = 0; i < 14; i++) {
                arr.push({
                    id: i,
                    left: Math.random() * 100,
                    top: Math.random() * 100,
                    delay: Math.random() * 6,
                    dur: 5 + Math.random() * 6,
                });
            }
            this.fireflies = arr;
        },
        loadBestRecords() {
            for (let i = 1; i <= 5; i++) {
                const key = 'maze6_best_lvl' + i;
                try {
                    const v = localStorage.getItem(key);
                    if (v) this.bestRecords[key] = JSON.parse(v);
                } catch (e) {}
            }
        },
    },
    mounted() {
        this.genFireflies();
        this.loadBestRecords();
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('resize', this.onResize);
    },
    beforeDestroy() {
        this.clearTimer();
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('resize', this.onResize);
    },
    destroyed() {
        this.clearTimer();
    }
}
</script>

<style lang="scss" scoped>
/* ============ 页面背景：魔法星夜 ============ */
.maze-page {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: linear-gradient(165deg, #1a1040 0%, #2d1b5e 35%, #1e3a5f 70%, #0f2847 100%);
    font-family: "ziyuanyuanti400W", "Microsoft YaHei", sans-serif;
}

.bg-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
}

/* 极光 */
.bg-aurora {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse 60% 40% at 20% 20%, rgba(120, 80, 220, 0.25), transparent),
        radial-gradient(ellipse 50% 35% at 80% 30%, rgba(60, 180, 220, 0.18), transparent),
        radial-gradient(ellipse 60% 45% at 50% 90%, rgba(180, 100, 220, 0.15), transparent);
}

/* 星空 */
.bg-stars {
    position: absolute;
    inset: 0;
    background-image:
        radial-gradient(1.5px 1.5px at 20px 30px, rgba(255,255,255,0.9), transparent),
        radial-gradient(1px 1px at 60px 80px, rgba(255,255,255,0.7), transparent),
        radial-gradient(1.5px 1.5px at 120px 50px, rgba(255,255,255,0.8), transparent),
        radial-gradient(1px 1px at 180px 120px, rgba(255,255,255,0.6), transparent),
        radial-gradient(2px 2px at 240px 60px, rgba(255,255,255,0.9), transparent),
        radial-gradient(1px 1px at 300px 150px, rgba(255,255,255,0.7), transparent),
        radial-gradient(1.5px 1.5px at 360px 90px, rgba(255,255,255,0.8), transparent),
        radial-gradient(1px 1px at 420px 180px, rgba(255,255,255,0.5), transparent);
    background-size: 450px 220px;
    background-repeat: repeat;
    animation: twinkle 4s ease-in-out infinite alternate;
}
.bg-stars.s2 {
    background-size: 380px 200px;
    background-position: 60px 40px;
    opacity: 0.6;
    animation-duration: 6s;
}
@keyframes twinkle {
    from { opacity: 0.5; }
    to { opacity: 1; }
}

.bg-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
}
.glow-1 {
    width: 460px; height: 460px;
    background: #7c5cfc;
    top: -140px; left: -100px;
    opacity: 0.3;
}
.glow-2 {
    width: 400px; height: 400px;
    background: #3ec6ff;
    bottom: -160px; right: -80px;
    opacity: 0.22;
}
.glow-3 {
    width: 320px; height: 320px;
    background: #c77dff;
    top: 40%; right: 20%;
    opacity: 0.18;
}

/* 萤火虫 */
.firefly {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ffe066;
    box-shadow: 0 0 10px 3px rgba(255, 224, 102, 0.7), 0 0 20px 6px rgba(255, 224, 102, 0.3);
    animation: floatUp linear infinite;
    opacity: 0;
}
@keyframes floatUp {
    0% { transform: translateY(0) translateX(0); opacity: 0; }
    10% { opacity: 1; }
    50% { transform: translateY(-50vh) translateX(20px); }
    90% { opacity: 1; }
    100% { transform: translateY(-100vh) translateX(-10px); opacity: 0; }
}

/* ============ 顶部导航 ============ */
.page-header {
    position: relative;
    z-index: 2;
    height: 60px;
    padding: 0 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 40px;
    padding: 0 20px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #e9f5ff;
    font-size: 17px;
    cursor: pointer;
    backdrop-filter: blur(8px);
    transition: all 0.25s;
    &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateX(-3px);
    }
    .back-arrow {
        font-size: 26px;
        line-height: 1;
        font-weight: bold;
    }
}

.header-title {
    font-size: 24px;
    font-weight: 700;
    color: #f1f0ff;
    letter-spacing: 3px;
    display: flex;
    align-items: center;
    gap: 8px;
    text-shadow: 0 2px 12px rgba(124, 92, 252, 0.6);
    .title-icon { font-size: 26px; }
}

.header-right {
    width: 90px;
}

/* ============ 主体容器 ============ */
.page-body {
    position: relative;
    z-index: 2;
    height: calc(100% - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ============ 开始界面 ============ */
.start-screen {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.start-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 44px 72px 40px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(16px);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
    animation: cardFloat 4s ease-in-out infinite;
}

@keyframes cardFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.start-badge {
    padding: 5px 20px;
    border-radius: 14px;
    background: linear-gradient(135deg, #7c5cfc, #c77dff);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 3px;
    margin-bottom: 22px;
    box-shadow: 0 4px 14px rgba(124, 92, 252, 0.5);
}

.start-img-wrap {
    position: relative;
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124, 92, 252, 0.25), rgba(62, 198, 255, 0.1));
    margin-bottom: 26px;
    img {
        width: 150px;
        height: 150px;
        filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.4));
        position: relative;
        z-index: 2;
    }
}
.start-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid rgba(124, 92, 252, 0.4);
    animation: ringPulse 2.5s ease-out infinite;
}
@keyframes ringPulse {
    0% { transform: scale(0.85); opacity: 1; }
    100% { transform: scale(1.25); opacity: 0; }
}

.start-card h2 {
    font-size: 46px;
    font-weight: 700;
    color: #f1f0ff;
    letter-spacing: 8px;
    margin: 0 0 12px;
    text-shadow: 0 4px 16px rgba(124, 92, 252, 0.5);
}

.start-sub {
    font-size: 19px;
    color: #b8c5ff;
    margin: 0 0 24px;
    letter-spacing: 2px;
}

.start-features {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
    span {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 15px;
        color: #d4d9ff;
        i { font-style: normal; font-size: 17px; }
    }
}

.start-action {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 19px;
    color: #ffe066;
    letter-spacing: 1px;
}

.pulse-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffe066;
    box-shadow: 0 0 0 0 rgba(255, 224, 102, 0.7);
    animation: pulse 1.6s infinite;
}

@keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(255, 224, 102, 0.7); }
    70% { box-shadow: 0 0 0 14px rgba(255, 224, 102, 0); }
    100% { box-shadow: 0 0 0 0 rgba(255, 224, 102, 0); }
}

/* ============ 游戏界面 ============ */
.game-screen {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 32px 20px;
    box-sizing: border-box;
}

/* 状态栏 */
.status-bar {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    justify-content: center;
}

.status-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 44px;
    padding: 0 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.16);
    backdrop-filter: blur(10px);
    color: #e9f0ff;
    font-size: 16px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
    .chip-icon { font-size: 17px; }
}

.chip-label {
    font-size: 14px;
    color: #9fa8da;
}

.chip-value {
    font-size: 21px;
    font-weight: 700;
    color: #ffe066;
    em {
        font-size: 13px;
        font-style: normal;
        color: #9fa8da;
        font-weight: 400;
    }
}

.chip-time .chip-value { color: #80deea; }
.chip-steps .chip-value { color: #b388ff; }
.chip-gem .chip-value { color: #84ffff; }

.chip-tip {
    min-width: 260px;
    max-width: 360px;
    justify-content: center;
    .chip-text {
        font-size: 16px;
        color: #e0e7ff;
    }
}

/* 主游戏区 */
.play-area {
    flex: 1;
    width: 100%;
    max-width: 1200px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 36px;
    min-height: 0;
}

/* 迷宫面板 */
.maze-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 1;
    min-width: 0;
}

.maze-frame {
    position: relative;
    background: linear-gradient(145deg, #2a1f5e, #1a1340);
    box-shadow:
        0 0 0 2px rgba(124, 92, 252, 0.35),
        0 0 30px rgba(124, 92, 252, 0.25),
        0 16px 40px rgba(0, 0, 0, 0.5),
        inset 0 2px 6px rgba(255, 255, 255, 0.08);
}

#maze {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: row wrap;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    &::after {
        content: '';
        display: block;
        clear: both;
    }
    li {
        box-sizing: border-box;
        transition: background-color 0.18s, box-shadow 0.18s;
        position: relative;

        &.wall {
            background:
                linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%),
                linear-gradient(135deg, #4a2d8a 0%, #2d1b5e 100%);
            box-shadow:
                inset 0 1px 2px rgba(180, 140, 255, 0.2),
                inset 0 -1px 2px rgba(0, 0, 0, 0.3);
        }
        &.road {
            background: rgba(230, 225, 250, 0.88);
        }
        &.in {
            background: radial-gradient(circle, #ff80ab 0%, #c77dff 100%);
            box-shadow: inset 0 0 10px rgba(255, 128, 171, 0.6);
            &::after {
                content: '🚪';
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.55em;
            }
        }
        &.out {
            position: relative;
            background: radial-gradient(circle, #ffe066 0%, #ff9a3c 100%);
            box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.6);
            animation: endGlow 1.8s ease-in-out infinite;
            &::after {
                content: '🏠';
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.6em;
                line-height: 1;
            }
        }
        &.bump.wall {
            animation: wallBump 0.35s ease;
        }
        &.gem-cell .gem-mark {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.5em;
            animation: gemFloat 1.5s ease-in-out infinite;
            pointer-events: none;
            z-index: 2;
        }
    }
}

@keyframes endGlow {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.3); }
}
@keyframes wallBump {
    0%, 100% { background-color: inherit; }
    50% { background: #ff5252 !important; }
}
@keyframes gemFloat {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-2px) scale(1.15); }
}

/* 玩家角色 */
.player {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: left 0.16s cubic-bezier(0.34, 1.4, 0.64, 1), top 0.16s cubic-bezier(0.34, 1.4, 0.64, 1);
    z-index: 5;
    pointer-events: none;
    margin: 0;
    padding: 0;
    .player-face {
        width: 72%;
        height: 72%;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 35%, #fff9c4 0%, #ffd54f 45%, #ff8a3c 100%);
        box-shadow:
            0 0 12px rgba(255, 213, 79, 0.9),
            0 0 24px rgba(255, 138, 60, 0.5),
            inset 0 -2px 4px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 2;
        font-size: 0.5em;
        line-height: 1;
    }
    .player-trail {
        position: absolute;
        width: 50%;
        height: 50%;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 213, 79, 0.5), transparent);
        animation: trailPulse 1.2s ease-out infinite;
    }
}
.player-shake {
    animation: playerShake 0.3s ease;
}
@keyframes playerShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
@keyframes trailPulse {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(2.2); opacity: 0; }
}

.legend {
    display: flex;
    gap: 20px;
    margin-top: 14px;
    flex-wrap: wrap;
    justify-content: center;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #c5cae9;
}

.legend-dot {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    display: inline-block;
    &.d-start { background: radial-gradient(circle, #ff80ab, #c77dff); }
    &.d-end { background: radial-gradient(circle, #ffe066, #ff9a3c); }
    &.d-path { background: rgba(168, 230, 255, 0.7); }
    &.d-gem { background: #84ffff; border-radius: 50%; }
}

/* 控制面板 */
.control-panel {
    width: 270px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* 关卡进度点 */
.level-dots {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 10px 0;
    .dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: rgba(255,255,255,0.15);
        border: 2px solid rgba(255,255,255,0.25);
        transition: all 0.3s;
        &.active {
            background: #ffe066;
            border-color: #ffe066;
            box-shadow: 0 0 12px rgba(255, 224, 102, 0.7);
            transform: scale(1.25);
        }
        &.done {
            background: #7c5cfc;
            border-color: #7c5cfc;
        }
    }
}

.btn-group {
    display: flex;
    gap: 12px;
}

.game-btn {
    flex: 1;
    height: 48px;
    border: none;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    cursor: pointer;
    letter-spacing: 1px;
    font-family: inherit;
    transition: all 0.2s;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    &:active {
        transform: translateY(2px);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
    }
}

.btn-restart {
    background: linear-gradient(135deg, #ff7a59, #ff5252);
    &:hover { background: linear-gradient(135deg, #ff8c6e, #ff6b6b); }
}

.btn-next {
    background: linear-gradient(135deg, #7c5cfc, #5e35b1);
    &:hover { background: linear-gradient(135deg, #9170ff, #7045c7); }
}

.info-card {
    padding: 18px 20px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.14);
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    h3 {
        margin: 0 0 10px;
        font-size: 17px;
        font-weight: 700;
        color: #ffe066;
        letter-spacing: 1px;
    }
    p {
        margin: 0;
        font-size: 14px;
        line-height: 1.65;
        color: #d4d9ff;
    }
}

.keyboard-tip {
    margin-top: 8px;
    font-size: 12px;
    color: #9fa8da;
    background: rgba(124, 92, 252, 0.15);
    padding: 6px 10px;
    border-radius: 8px;
    text-align: center;
}

/* 方向键 */
.dpad-card {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.dpad {
    display: grid;
    grid-template-columns: repeat(3, 58px);
    grid-template-rows: repeat(3, 58px);
    gap: 8px;
    margin-top: 4px;
}

.dpad-btn {
    border: none;
    border-radius: 14px;
    background: linear-gradient(145deg, #7c5cfc, #4527a0);
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
        0 4px 10px rgba(0, 0, 0, 0.35),
        inset 0 2px 3px rgba(255, 255, 255, 0.25),
        inset 0 -2px 3px rgba(0, 0, 0, 0.2);
    transition: all 0.12s;
    font-family: inherit;
    &:hover {
        background: linear-gradient(145deg, #9170ff, #5e35b1);
        transform: translateY(-1px);
    }
    &:active {
        transform: translateY(2px);
        box-shadow:
            0 2px 5px rgba(0, 0, 0, 0.35),
            inset 0 2px 4px rgba(0, 0, 0, 0.2);
    }
}

.dpad-up    { grid-column: 2; grid-row: 1; }
.dpad-left  { grid-column: 1; grid-row: 2; }
.dpad-right { grid-column: 3; grid-row: 2; }
.dpad-down  { grid-column: 2; grid-row: 3; }

/* ============ 通关弹窗 ============ */
.modal-mask {
    position: absolute;
    inset: 0;
    z-index: 99;
    background: rgba(10, 8, 30, 0.7);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.modal-card {
    position: relative;
    width: 420px;
    max-width: 90vw;
    padding: 36px 40px 32px;
    border-radius: 26px;
    background: linear-gradient(160deg, #2a1f5e 0%, #1e1645 100%);
    border: 2px solid rgba(124, 92, 252, 0.5);
    box-shadow:
        0 0 0 4px rgba(124, 92, 252, 0.15),
        0 24px 60px rgba(0, 0, 0, 0.6),
        0 0 50px rgba(124, 92, 252, 0.3);
    text-align: center;
    box-sizing: border-box;
    animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    overflow: visible;
}

@keyframes popIn {
    from { transform: scale(0.7); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}

.modal-stars-row {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 16px;
    .m-star {
        font-size: 42px;
        display: inline-block;
        filter: grayscale(1) opacity(0.3);
        transition: all 0.3s;
        &.lit {
            filter: none;
            animation: starPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
    }
}

@keyframes starPop {
    0% { transform: scale(0) rotate(-30deg); }
    100% { transform: scale(1) rotate(0); }
}

.modal-title {
    margin: 0 0 20px;
    font-size: 30px;
    font-weight: 700;
    color: #ffe066;
    letter-spacing: 4px;
    line-height: 1.4;
    text-shadow: 0 2px 12px rgba(255, 224, 102, 0.4);
    white-space: nowrap;
    padding: 0 8px;
    box-sizing: border-box;
}

.modal-body {
    font-size: 18px;
    color: #d4d9ff;
    line-height: 1.7;
    p { margin: 6px 0; }
}

.result-stats {
    background: rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 14px 18px;
    margin-bottom: 14px;
    .rs-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
        font-size: 16px;
        color: #b8c5ff;
        b {
            color: #ffe066;
            font-size: 18px;
        }
        &.best b { color: #84ffff; }
    }
}
.rs-tip {
    font-size: 15px;
    color: #9fa8da;
    margin: 8px 0 0;
}

.modal-btns {
    display: flex;
    gap: 12px;
    margin-top: 22px;
}

.modal-btn {
    flex: 1;
    height: 46px;
    border: none;
    border-radius: 13px;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    cursor: pointer;
    font-family: inherit;
    letter-spacing: 1px;
    transition: all 0.2s;
    &:active { transform: translateY(2px); }
}
.btn-replay {
    background: linear-gradient(135deg, #ff7a59, #ff5252);
    box-shadow: 0 4px 12px rgba(255, 82, 82, 0.3);
}
.btn-next-level {
    background: linear-gradient(135deg, #7c5cfc, #5e35b1);
    box-shadow: 0 4px 12px rgba(124, 92, 252, 0.4);
}
.btn-finish {
    background: linear-gradient(135deg, #ffe066, #ff9a3c);
    color: #4a2c00;
    box-shadow: 0 4px 12px rgba(255, 154, 60, 0.4);
}

.modal-loading {
    margin-top: 20px;
    font-size: 16px;
    color: #9fa8da;
}
</style>
