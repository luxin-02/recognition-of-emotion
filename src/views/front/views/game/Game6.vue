<template>
    <div class="user-info-box">
        <div class="bread" @click="$router.go(-1)">
      <span>&nbsp;&nbsp;&nbsp;返回</span>
    </div>
        <div>
            <div v-if="curStatus == 1" class="step1" @dblclick="start()">
                <div>开始游戏</div>
                <div>你能找到最近的路吗</div>
                <img src="@/assets/images/game/game6/start.png" alt="">
                <div>双击即可开始</div>
            </div>
            <div v-else class="step2">
                <div class="top">
                    <div>提示：{{tips}}</div>
                    <div>用时：{{time}} 秒</div>
                </div>
                <div class="body">
                    <div class="left">
                        <ul id="maze">
                            <template v-for="item  in map">
                                <li 
                                    v-for="(sitem, sindex) in item" :key="sindex"
                                    class="block"
                                    :class="[ sitem.className,  'col'+level ]"></li>
                            </template>
                        </ul>
                    </div>
                    <div class="right">
                        <div class="btn">
                            <!-- <div @click="autoFindWay(1, 2)">自动寻路</div> -->
                            <div @click="start(1)">再玩一次</div>
                            <div @click="start(2)">{{level == 5 ? '返回' : '下一关'}}</div>
                        </div>
                        <div class="tip">
                            <p>游戏规则</p>
                            <div>
                                请使用上下左右键控制小方块移动，帮 小方块找到回家的路，你可以观看左上角提 示。点击自动寻路会出现路线提示。
                            </div>
                        </div>
                        <div class="sorrow">
                            <div>
                                <img @click="animation([-1, 0])" src="@/assets/images/game/game6/top.png" alt="">
                            </div>
                            <div>
                                <img @click="animation([0, -1])" src="@/assets/images/game/game6/left.png" alt="">
                                <img @click="animation([1, 0])" src="@/assets/images/game/game6/bottom.png" alt="">
                                <img @click="animation([0, 1])" src="@/assets/images/game/game6/right.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="open" v-if="isVisible">
            <div>
                <p>恭喜通关</p>
                <div v-html="strText"></div>
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

            map: [],
            tips: '',
            row: 0,// 行
            col: 0,// 列
            lock: 0,// 判断是否开始
            rightWay: [],
            x: 1,
            y: 2,
            level: 1,//1:7 2:8 3:14 4:16 5:28
            isClick: true,
        }
    },
    mixins: [],
    watch: {},
    directives: {},
    filters: {},
    components: {},
    computed: {
        col() {
            return `col${this.level}`
        }
    },
    methods: {
        start(val) {
            this.clearTimer();
            this.isClick = true;
            this.curStatus = 2;
            this.time = 0;
            this.countTime();
            if(val == 2) {
                if(this.level<5) {
                    this.level++;
                } else {
                    this.$router.go(-1);
                }
            }
            if(this.level == 1) {
                this.row = 7;
                this.col = 7;
            } else if(this.level == 2) {
                this.row = 8;
                this.col = 8;
            } else if(this.level == 3) {
                this.row = 14;
                this.col = 14;
            } else if(this.level == 4) {
                this.row = 16;
                this.col = 16;
            } else {
                this.row = 28;
                this.col = 28;
            }
            this.$nextTick(()=>{
                this.init();
                this.clearStyle();
            })

        },
        clearTimer() {
            clearInterval(this.timer);
            this.timer = null;
        },
        countTime() {
            this.timer = setInterval(()=>{
                this.time++;
            }, 1000);
        },
        btn1Click() {
            this.isVisible = false;
            this.$router.go(-1);
        },
        btn2Click() {
            this.isVisible = false;
            location.reload();
            this.lock = 0;
        },
        randomSort(arr){
            arr.sort(function(){
                return Math.random()-0.5;
            });
        },
        clearStyle() {
            var liArr = document.getElementById('maze').getElementsByTagName('li');
            for(var i = 0; i< liArr.length; i++) {
                liArr[i].style = '';
            }
        },
        init() {
            this.lock = 0;
            this.tips = "按右边按钮玩游戏";
            this.x = 1;
            this.y = 2;
            // 1.初始化迷宫外的方块
            this.createMap();
            // 2.随机生成迷宫内绿点（开始位置）和红点（结束位置）
            this.randomMap();
            // 刷新提示
            this.renderTips();
        },
        createMap() {
            this.map = new Array(this.row);
            for (var i = 0; i < this.row; i++) {
                this.map[i] = new Array(this.col);
                for (var j = 0; j < this.col; j++) {
                    if (i == 0 || i == this.row - 1) {
                        this.map[i][j] = {
                            className: 'road',
                            isThrough: -1
                        };
                    } else if (j == 0 || j == this.col - 1) {
                        this.map[i][j] = {
                            className: 'road',
                            isThrough: -1
                        };
                    } else {
                        this.map[i][j] = {
                            className: 'wall',
                            isThrough: -1
                        };
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
                isThrough: 1
            }
            for (var i =this. row - 3; i >= 0; i--) {
                if (this.map[i][this.col - 3].className == 'road') {
                    this.map[i][this.col - 2].className = 'out';
                    this.map[i][this.col - 2].isThrough = 0;
                    break;
                }
            }
        },
        // status 状态 表示按下键盘之后的状态是什么
        renderTips(status) {
            if (!this.lock) {
                this.tips = '按右边按钮玩游戏';
            }
            if (this.lock) {
                if (status == 'wall') {
                    this.tips = '往下走是墙壁，请走另外的路。';
                } else if (status == 'back') {
                    this.tips = '你正在返回走';
                } else if (status == 'up') {
                    this.tips = '你正在往上走';
                } else if (status == 'down') {
                    this.tips = '你正在往下走';
                } else if (status == 'right') {
                   this.tips = '你正在往右走';
                } else if (status == 'left') {
                    this.tips = '你正在往左走';
                }
            }
        },
        // 运动函数
        // 传入参数说明
        // [0,1]  -> right
        // [0,-1] -> left
        // [1,0]  -> down
        // [-1,0] -> up
        animation(directionArr) {
            if(this.isClick == true) {
                this.lock = 1;
                var up = directionArr[0];
                var right = directionArr[1];
                var liArr = document.getElementById('maze').getElementsByTagName('li');
                if (this.map[this.y + up][this.x + right].isThrough == -1) {
                    // 下一个是墙
                    this.renderTips('wall');
                } else if (this.map[this.y + up][this.x + right].isThrough == 0) {
                    // 下一个是未走过的路
                    if (this.map[this.y + up][this.x + right].className == 'out') {
                        var num = (this.y + up) * this.col + (this.x + right);
                        this.map[this.y + up][this.x + right].isThrough = 1;
                        liArr[num].style.backgroundColor = '#E1FF78';
                        this.x = this.x + right;
                        this.y = this.y + up;
                        this.isVisible = true;
                        this.clearTimer();
                        this.strText = `
                            <p>恭喜你，游戏通关！</p>
                            <p>总用时${this.time}秒</p>
                        `;
                        setTimeout(async()=>{
                            this.isVisible = false;
                            this.isClick = false;
                             await reportApiAdd({
                                cat_name: "心理训练",
                                game_name: "迷宫",
                                score: 100,
                                seconds: this.time,
                            }).then(({ data }) => {
                                if (data.code == this.$global.successCode) {
                                this.$router.go(-1) // 返回上一页
                                }
                            })
                        }, 5000);
                    } else {
                        var num = (this.y + up) * this.col + (this.x + right);
                        this.map[this.y + up][this.x + right].isThrough = 1;
                        liArr[num].style.backgroundColor = '#E1FF78';
                        this.x = this.x + right;
                        this.y = this.y + up;
                        if (right == 1 && up == 0) {
                            this.renderTips('right');
                        } else if (right == -1 && up == 0) {
                            this.renderTips('left');
                        } else if (right == 0 && up == -1) {
                            this.renderTips('up');
                        } else if (right == 0 && up == 1) {
                            this.renderTips('down');
                        }
                    }

                } else {
                    var num = (this.y) * this.col + (this.x);
                    liArr[num].style.backgroundColor = '#fff';
                    this.map[this.y][this.x].isThrough = 0;
                    this.x = this.x + right;
                    this.y = this.y + up;
                    this.renderTips('back');
                }
            } else {
                this.$toast("", "请点击按钮才能玩哦！")
            }
        },
        autoFindWay(nowX, nowY) {
            if (this.map[nowY][nowX].className == 'out') {
                for (var i = 0; i < this.row; i++) {
                    for (var j = 0; j < this.col; j++) {
                        if (this.map[i][j].isThrough == 1) {
                            this.map[i][j].className = "in";
                        }
                    }
                }
                this.tips = '自动寻路';
                this.isVisible = true;
                this.clearTimer();
                this.strText = `
                    <p>恭喜你，游戏通关！</p>
                    <p>总用时${this.time}秒</p>
                `;
                setTimeout(()=>{
                    this.isVisible = false;
                }, 5000);
                return true;
            }
            var next = [
                [0, 1],
                [0, -1],
                [1, 0],
                [-1, 0]
            ];
            next.sort(function() {
                return Math.random() - 0.5;
            });
            for (var i = 0; i < next.length; i++) {

                if (nowX + next[i][1] < 2 || nowX + next[i][1] > this.col - 2 || nowY + next[i][0] < 2 || nowY + next[i][0] > this.row - 2) {
                    continue;
                } else if (this.map[nowY + next[i][0]][nowX + next[i][1]].isThrough == 0) {
                    this.map[nowY + next[i][0]][nowX + next[i][1]].isThrough = 1;
                    if (!this.autoFindWay(nowX + next[i][1], nowY + next[i][0])) {
                        this.map[nowY + next[i][0]][nowX + next[i][1]].isThrough = 0;
                    }
                }
            }
            return false;
        }
    },
    beforeCreate() {},
    beforeMount() {},
    mounted() {},
    beforeUpdate() {},
    updated() {},
    activated() {},
    deactivated() {},
    beforeDestroy() {},
    destroyed() {
        this.clearTimer();
    },
    errorCaptured(){}
}
</script>

<style lang="scss" scoped>
div.user-info-box{
    width: 100%;
    height: 100%;
    >div.bread{
        width: 100%;
        height: 74px;
        line-height: 74px;
        text-align: left;
        font-size: 20px;
        
        font-weight: normal;
        color: #999999;
        border-bottom: 2px solid rgba(153, 153, 153, 0.34901960784313724);
    }
    >div.bread+div{
        height: calc( 100% - 74px);
        display: flex;
        >div{
            width: 100%;
            height: 100%;
            &.step1{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                >img{
                    width: 252px;
                    height: 224px;
                    margin-bottom: 126px;
                }
                >div{
                    &:nth-child(1){
                        height: 52px;
                        line-height: 52px;
                        font-size: 53px;
                        color: #333333;
                        margin-bottom: 30px;
                    }
                    &:nth-child(2){
                        line-height: 24px;
                        height: 24px;
                        font-size: 24px;
                        color: #333333;
                        margin-bottom: 99px;
                    }
                    &:nth-child(4){
                        height: 24px;
                        line-height: 24px;
                        font-size: 24px;
                        color: #333333;
                    }
                }
            }
            &.step2{
                padding: 62px 50px 0;
                box-sizing: border-box;
                >div.top{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 59px;
                }
                >div.body{
                    display: flex;
                    >div{
                       &.left{
                            #maze {
                                margin: 5px auto;
                            }
                            #maze::after {
                                content: '';
                                display: block;
                                clear: both;
                            }
                            >ul{
                                width: 560px;
                                display: flex;
                                flex-flow: row wrap;
                                li{
                                    &.col1 {
                                        width: 80px;
                                        height: 80px;
                                    }
                                    &.col2 {
                                        width: 70px;
                                        height: 70px;
                                    }
                                    &.col3 {
                                        width: 40px;
                                        height: 40px;
                                    }
                                    &.col4 {
                                        width: 35px;
                                        height: 35px;
                                    }
                                    &.col5 {
                                        width: 20px;
                                        height: 20px;
                                    }
                                    &.in {
                                        background-color: #E1FF78;
                                    }

                                    &.out {
                                        background-color: #fff;
                                    }

                                    &.road {
                                        background-color: #fff;
                                    }

                                    &.wall {
                                        background-color: #83CB00;
                                    }
                                }
                            }
                       }
                       &.right{
                           width: 490px;
                           margin-left: 200px;
                           >div.btn{
                               display: flex;
                               margin-bottom: 89px;
                               >div{
                                   width: 220px;
                                    height: 48px;
                                    line-height: 48px;
                                    border-radius: 10px;
                                    font-size: 24px;
                                    margin: 0 25px;
                                    color: #fff;
                                    text-align: center;
                                    &:nth-child(1){
                                        background: #ffb846;
                                    }
                                    &:nth-child(2){
                                        background: #60AF00;
                                    }
                               }
                           }
                           >div.tip{
                               padding: 0 45px;
                               box-sizing: border-box;
                               margin-bottom: 100px;
                               >p{
                                    height: 24px;
                                    line-height: 24px;
                                    font-size: 24px;
                                    font-weight: 700;
                                    color: #333333;
                                    margin-bottom: 15px;
                                }
                                >div{
                                    width: 400px;
                                    font-size: 20px;
                                    text-align: left;
                                    color: #333333;
                                    line-height: 36px;
                                }
                           }
                           >div.sorrow{
                                >div{
                                   display: flex;
                                   justify-content: center;
                                   align-items: center;
                                   &:nth-child(2){
                                       margin-top: 10px;
                                   }
                                    >img{
                                        width: 80px;
                                        height: 80px;
                                        &:nth-child(2){
                                            margin: 0 10px;
                                        }
                                    }
                                }
                           }
                       }
                    }
                }
            }
        }
    }
    >div.open {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        >div{
            width: 457px;
            height: 300px;
            border-radius: 10px;
            background: url(@/assets/images/game/game1/open.png) no-repeat;
            background-size: 457px 300px;
            position: relative;
            padding: 61px 51px 0 51px;
            box-sizing: border-box;
            &:after{
                content: '';
                position: absolute;
                width: 262px;
                height: 100px;
                display: block;
                background: url(@/assets/images/game/game1/star.png) no-repeat;
                background-size: 262px 100px;
                top: -47px;
                left: 99px;
            }
            >p{
                height: 24px;
                line-height: 24px;
                font-size: 24px;
                font-weight: 700;
                color: #333333;
                margin-bottom: 15px;
            }
            >div{
                width: 355px;
                font-size: 20px;
                text-align: left;
                color: #333333;
                line-height: 36px;
            }
        }
    }
}
</style>

