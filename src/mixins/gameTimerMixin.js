//游戏定时器混入


export default {
    data() {
        return {
            GameTimer: null,//定时器相关
            timerTime: 0,//游戏时长
        }

    },
    mounted() {
        if (this.GameTimer) {
            return;
        }
        //开始计时
        this.startTime();
    },
    methods: {
        startTime() {
            clearInterval(this.GameTimer)
            this.timerTime = 0;
            this.GameTimer = setInterval(() => {
                this.timerTime++;
            }, 1000)
        },
    },
    computed: {

        timerTimeStr() {
            let time = this.timerTime;

            const h = parseInt(time / 3600)
            const minute = parseInt(time / 60 % 60)
            const second = Math.ceil(time % 60)
            const hours = h < 10 ? '0' + h : h
            const formatSecond = second > 59 ? 59 : second
            return `${minute < 10 ? '0' + minute : minute}:${formatSecond < 10 ? '0' + formatSecond : formatSecond}`

        },


    },
    beforeDestroy() {
        clearInterval(this.GameTimer)
    },
}