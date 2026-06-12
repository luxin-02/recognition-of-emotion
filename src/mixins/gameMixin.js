import gameTimerMixin from "./gameTimerMixin";
import gameAudioMixin from "./gameAudioMixin";



//混入合集
export default {
    mixins: [gameAudioMixin, gameTimerMixin],
    data() {
        return {
            isEnd: '',//是否结束
        }

    },
    computed: {

    },
    watch: {
        isEnd(n_val) {
            if (n_val) {


                clearInterval(this.GameTimer)
            } else {
                this.startTime();
            }
        },
    },

}