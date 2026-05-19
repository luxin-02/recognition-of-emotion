<template>
    <div class="user-info-box">
        <div class="bread">
            <span>当前位置：首页 > 游戏训练 > 拼图</span>
        </div>
        <div>
            <div v-if="curStatus == 1" class="step1" @dblclick="start()">
                <div>开始游戏</div>
                <div>欢迎来到拼图挑战</div>
                <img src="../../../assets/images/game/game2/start.png" alt="">
                <div>双击即可开始</div>
            </div>
            <div v-else class="step2">
                <div class="top">
                    <div>模式：{{returnLevelCtt(level)}}</div>
                    <div>你已经移动了 {{move}} 步</div>
                    <div>用时：{{time}} 秒</div>
                </div>
                <div class="body">
                    <div class="left">
                        <div class="left">
                            <div class="img">
                                <img :src="curImage" alt="" style="width: 240px;height: 240px;">
                            </div>
                            <div class="btn" @click="select(1), selectR()">简单模式</div>
                            <div class="btn" @click="select(2), selectR()">一般模式</div>
                            <div class="btn" @click="select(3), selectR()">困难模式</div>
                        </div>
                        <div class="right picBox">
                            <ul class="list"></ul>
                        </div>
                    </div>
                    <div class="right">
                        <div>
                            <p>游戏规则</p>
                            <div>请移动拼图进行交换，当拼图和左边 参考图片一样时，游戏就通关了。可以自 行选择下一关或者重新开始。</div>
                        </div>
                        <div>
                            <div @click="btnClick(1)">再玩一次</div>
                            <div @click="btnClick(2)">换类型</div>
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
export default {
    data() {
        return {
            curStatus: 1,
            typeList: [
                require('@/assets/images/game/game2/1.jpg'),
                require('@/assets/images/game/game2/2.jpg'),
                require('@/assets/images/game/game2/3.jpg'),
                require('@/assets/images/game/game2/4.jpg'),
            ],
            timer: null,
            time: 0,
            list: '',
            listW: '',
            listH: '',
            imgW: '',
            imgH: '',
            origArr: [],
            randArr: [],
            key: true,
            imgCell: '',
            num: 3,
            step: 0,//交换次数
            timer: null,//定时器
            isVisible: false,
            strText: '',
            time: 0,//时长
            curImage: '',
            curTypeIndex: 0,
            curImageIndex: 0,
            typeName: '',
            isTypeVisiable: false,
            level: 1,
            move: 0
        }
    },
    mixins: [],
    watch: {},
    directives: {},
    filters: {},
    components: {},
    methods: {
        start() {
            this.curStatus = 2;
            this.curImage = this.typeList[this.curImageIndex];
            this.$nextTick(()=>{
                this.list = $('.picBox .list');
                this.listW = this.list.width();
                this.listH = this.list.height();
                this.imgW = this.listW / this.num;
                this.imgH = this.listH / this.num;
                this.init();
                if(this.num == 3) {
                    this.select(1)
                }
            })
        },
        clearTimer() {
            clearInterval(this.timer);
            this.timer = null;
        },
        countTime(){
            this.timer = setInterval(()=>{
                this.time++;
            }, 1000);
        },
        btnClick(type) {
            if(type == 2) {
                this.next();
            }
            this.key = true;
            this.start();
            this.isVisible = false;
            this.move = 0;
            this.time = 0;
            this.clearTimer();
        },
        randomSort(arr){
            arr.sort(function(){
                return Math.random()-0.5;
            });
        },
        selectR() {
            this.start();
            this.isVisible = false;
            this.move = 0;
            this.time = 0;
            this.clearTimer();
            console.log(this.num)
        },
        returnLevelCtt(level) {
            if(level == 1) {
                return "简单";
            } else if(level == 2) {
                return "一般";
            } else {
                return "困难";
            }
        },
        init() {
            this.render(this.num)
            this.gameState()
        },
        next() {
            if(this.curImageIndex<this.typeList.length-1){
                this.curImageIndex++;
                this.curImage = this.typeList[this.curImageIndex];
                this.render(this.num)
            } else {
                this.curImageIndex = 0;
                this.curImage = this.typeList[0];
                this.render(this.num)
            }
        },
        render(n) {
            this.list.html('')
            this.imgW = this.listW / n;
            this.imgH = this.listH / n;
            this.origArr = [];
            for (var i = 0; i < n; i++) {
                for (var j = 0; j < n; j++) {
                    this.origArr.push(i * n + j);
                    var li = $('<li>')
                    li.css({
                        left: j * this.imgW + 'px',
                        top: i * this.imgH + 'px',
                        background: `url(${this.curImage})`,
                        backgroundPosition: -j * this.imgW + 'px ' + -i * this.imgH + 'px',
                        width: this.imgW + 'px',
                        height: this.imgH + 'px',
                        position: 'absolute'
                    })
                    this.list.append(li)
                    this.imgCell = this.list.find('li')
                }
            }
        },
        select(index) {
            this.level = index + 1;
            this.num = Math.floor(index) + 2;
            this.key = true;
        },
        //游戏状态改变
        gameState() {
            var _this = this;
            if (_this.key) {
                _this.clearTimer();
                _this.countTime();
                _this.key = false;
                _this.render(_this.num)
                _this.randomArr()
                _this.cellOrder(_this.randArr, _this.num)
                _this.drag()
                $(_this.imgCell).css('cursor','move')
            } else {
                _this.key = true;
                _this.cellOrder(_this.origArr,_this.num)
                _this.imgCell.off('pointermove pointerup pointerdown pointerover pointerout')
                $(_this.imgCell).css('cursor','pointer')
            }
        },
        //乱序数组
        randomArr() {
            this.randArr = [];
            var len = this.origArr.length;
            var order;
            var temp = {}
            for (var i = 0; i < len; i++) {
                order = Math.floor(Math.random() * len)
                if (this.randArr.length > 0) {
                    while ($.inArray(order, this.randArr) > -1) {
                        order = Math.floor(Math.random() * len)
                    }
                }
                this.randArr.push(order)
            }
            return
        },
        //改变图片位置
        cellOrder(arr, n) {
            var len = arr.length;
            for (var a = 0; a < len; a++) {
                var j = arr[a] % n;
                var i = Math.floor(arr[a] / n);
                this.animateFn(a, j, i,n)
            }
        },
        //拖拽图片
        drag() {
            var disX, disY
            var initL = this.list.offset().left;
            var initT = this.list.offset().top;
            var _this = this;
            this.imgCell.on('pointerdown', function (e) {
                var e = e || window.e;
                disX = e.pageX - $(this).offset().left
                disY = e.pageY - $(this).offset().top
                var self = this
                var index1 = $(this).index()
                $(document).on('pointermove', function (e) {
                    e.preventDefault()
                    var e = e || window.e
                    var l = e.pageX - disX - initL
                    var t = e.pageY - disY - initT
                    $(self).css({
                        left: l + 'px',
                        top: t + 'px',
                        zIndex: 1000,
                        opacity: '0.6'
                    })
                }).on('pointerup', function (e) {
                    var e = e || window.e
                    var l = e.pageX - initL
                    var t = e.pageY - initT
                    var index2 = _this.changeIndex(l, t, index1, _this.num)
                    if (index1 == index2) {
                        _this.cellReturn(index1, _this.num)
                    } else {
                        _this.cellChange(index1, index2, _this.num)
                        _this.move++;
                    }
                    $(this).off('pointermove').off('pointerup').off('pointercancel')
                }).on('pointercancel', function (e) {
                    var e = e || window.e
                    var l = e.pageX - initL
                    var t = e.pageY - initT
                    var index2 = _this.changeIndex(l, t, index1, _this.num)
                    if (index1 == index2) {
                        _this.cellReturn(index1, _this.num)
                    } else {
                        _this.cellChange(index1, index2, _this.num)
                        _this.move++;
                    }
                    $(this).off('pointermove').off('pointerup').off('pointercancel')
                })
            }).on('pointerover', function () {
                $(this).css({
                    opacity: '0.8'
                })
            }).on('pointerout', function () {
                $(this).css({
                    opacity: '1'
                })
            })
        },
        //改变index值
        changeIndex(x, y, index, n) {
            if (x < 0 || x > this.listW || y < 0 || y > this.listH) {
                return index
            }
            var row = Math.floor(y / this.imgH);
            var col = Math.floor(x / this.imgW);
            var l = row * n + col;
            var i = 0;
            var len = this.randArr.length;
            while ((i < len) && (this.randArr[i] !== l)) {
                i++
            }
            return i;
        },
        //飞回原来位置
        cellReturn(index, n) {
            var i = Math.floor(this.randArr[index] / n);
            var j = this.randArr[index] % n;
            this.animateFn(index, j, i,this.num)
        },
        //图片交换位置
        cellChange(from, to,n) {
            var fromI = Math.floor(this.randArr[from] / n);
            var fromJ = this.randArr[from] % n;
            var toI = Math.floor(this.randArr[to] / n);
            var toJ = this.randArr[to] % n;
            var temp = this.randArr[from];
            this.animateFn(from, toJ, toI,this.num)
            var _this = this;
            _this.animateFn(to, fromJ, fromI,_this.num, function () {
                _this.randArr[from] = _this.randArr[to]
                _this.randArr[to] = temp
                _this.check()
            })
        },
        //检查是否正确
        check() {
            if (this.origArr.toString() == this.randArr.toString()) {
                this.key = true;
                this.isVisible = true;
                this.clearTimer();
                this.strText = `
                    <p>恭喜你，游戏通关！总共用了<span class="lighten">${this.move}</span>步</p>
                    <p>总用时<span class="lighten">${this.time}秒</span></p>
                `;
                setTimeout(()=>{
                    this.isVisible = false
                }, 5000);
            }
        },
        //动画执行
        animateFn(index, j, i,n, callBack) {
            this.imgW = this.listW / n;
            this.imgH = this.listH / n;
            this.imgCell.eq(index).animate({
                left: j * this.imgW + 'px',
                top: i * this.imgH + 'px'
            }, function () {
                $(this).css({
                    zIndex: '0',
                    opacity: '1'
                })
                typeof callBack == 'function' ? callBack.call(this, arguments) : ''
            })
        },
        touch(event) {
            if(event.targetTouches.length > 1){
                event.preventDefault();
            }
        }
    },
    beforeCreate() {},
    created() {},
    beforeMount() {},
    mounted() {
        document.addEventListener('touchstart', this.touch, false);
        document.addEventListener('touchmove', this.touch, false);
        document.addEventListener('touchend', this.touch, false);
        var _this = this;
        window.onresize=function() {
            setTimeout(()=>{
                if(_this.curStatus == 2) {
                    _this.curImage = _this.typeList[_this.curImageIndex];
                    _this.$nextTick(()=>{
                        _this.move = 0;
                        _this.time = 0;
                        _this.list = $('.picBox .list');
                        _this.listW = _this.list.width();
                        _this.listH = _this.list.height();
                        _this.imgW = _this.listW / _this.num;
                        _this.imgH = _this.listH / _this.num;
                        _this.init();
                        _this.select(_this.num-2);
                        _this.btnClick(1);
                    })
                }
            }, 100);
        }
    },
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
    touch-action: none;
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
                    width: 240px;
                    height: 240px;
                    margin-bottom: 108px;
                    border-radius: 10px;
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
                        margin-bottom: 101px;
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
                    margin-bottom: 30px;
                }
                >div.body{
                    display: flex;
                    >div.left{
                        width: 920px;
                        margin-right: 60px;
                        display: flex;
                        >div.left{
                            width: 240px;
                            margin-right: 60px;
                            >div.img{
                                width: 240px;
                                height: 240px;
                                overflow: hidden;
                                margin-bottom: 40px;
                            }
                            >div.btn{
                                width: 220px;
                                height: 48px;
                                line-height: 48px;
                                background: #c2c2c2;
                                border-radius: 10px;
                                margin-bottom: 30px;
                                color: #FFFFFF;
                                font-size: 24px;
                            }
                        }
                        >div{
                            width: 600px;
                            height: 600px;
                            >ul{
                                width: 600px;
                                height: 600px;
                                &.list{
                                    position:relative;
                                    li{
                                        position: absolute;
                                        overflow: hidden;
                                        border-radius:0;
                                        box-shadow:0 0px 6px rgba(255,255,255,0.6);
                                        cursor:pointer;
                                    }
                                }
                            }
                        }
                    }
                    >div.right{
                        width: 440px;
                        >div{
                            &:nth-child(1){
                                width: 440px;
                                height: 300px;
                                background: url(../../../assets/images/game/game2/dialog.png) no-repeat;
                                background-size: 440px 300px;
                                margin-bottom: 100px;
                                padding: 49px 31px 0;
                                box-sizing: border-box;
                                position: relative;
                                &:after{
                                    content: '';
                                    position: absolute;
                                    width: 64px;
                                    height: 65px;
                                    display: block;
                                    background: url(../../../assets/images/game/game2/bee.png) no-repeat;
                                    background-size: 64px 65px;
                                    bottom: 24px;
                                    left: 200px;
                                }
                                >p{
                                    height: 24px;
                                    line-height: 24px;
                                    font-size: 24px;
                                    font-weight: 700;
                                    color: #333333;
                                    margin-bottom: 24px;
                                }
                                >div{
                                    width: 378px;
                                    height: 34px;
                                    line-height: 34px;
                                    font-size: 21px;
                                    color: #333333;
                                    text-align: left;
                                }
                            }
                            &:nth-child(2){
                                >div{
                                    width: 220px;
                                    height: 48px;
                                    border-radius: 10px;
                                    line-height: 48px;
                                    font-size: 24px;
                                    color: #ffffff;
                                    text-align: center;
                                    margin: 0 110px 30px;
                                    &:nth-child(1){
                                        background: #FFB846;
                                    }
                                    &:nth-child(2){
                                        background: #2BBF6D;
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
            background: url(../../../assets/images/game/game1/open.png) no-repeat;
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
                background: url(../../../assets/images/game/game1/star.png) no-repeat;
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

