//==============================
// 其他不常用设置
//==============================

const uncommon = {
    namespaced: false,
    state: () => ({
        // 硬件配置
        deviceConfig: {
            dIp: '',
            rackName: '',
        },
        musicObj: {
            show: false,
            playPause: false,
            currentMusic: {},
            playMusic: ()=>{},
            playMusic2: ()=>{},
            closeBtn: false,
        },
    }),
    getters: {
        deviceConfig(state) {
            return state.deviceConfig;
        },
        musicObj(state) {
            return state.musicObj;
        },
    },
    mutations: {
        UPDATE_DEVICE_CONFIG(state, args) {
            let newV = Object.assign(state.deviceConfig, args);
            state.deviceConfig = newV;
        },
    },
    actions: {
  
    }
};
export default uncommon;