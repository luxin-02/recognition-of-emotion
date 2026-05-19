//==============================
// 系统设置
//==============================

const system = {
  namespaced: false,
  state: () => ({
    // 系统设置
    sysInfo: {
      name: "系统", // 软件名称
      unit: "公司", // 左上角单位名称
      logo: "", // 左上角logo
      volume: 1, // 媒体音量

      sphere: "0", // 悬浮球  0 开启
      sphere_transparency: 100, // 悬浮球透明度
      sphere_effects: 100, // 媒体音量
      sphere_game_effects: 100, // 游戏音量

      user_pwd: "0", // 账密登录  0 开启
      guest: "0", // 游客登录  0 开启
      fingerprint: "0", // 指纹登录  0 开启
      face: "0", // 人脸登录  0 开启

      mute: false, // 静音

    },
  }),
  getters: {
    //系统信息
    sysInfo(state) {
      return state.sysInfo;
    },
    //是否开启账号登录
    isOpenPwd(state) {
      return state.sysInfo.user_pwd == 0;
    },
    //是否开启游客登录
    isOpenGuest(state) {
      return state.sysInfo.guest == 0;
    },
    //是否开启指纹
    isOpenFingerprint(state) {
      return state.sysInfo.fingerprint == 0;
    },
    //是否开启人脸
    isOpenFace(state) {
      return state.sysInfo.face == 0;
    },
  },
  mutations: {
    /**更新系统信息 */
    UPDATE_SYS_INFO(state, args) {
      let newV = Object.assign(state.sysInfo, args);
      state.sysInfo = newV;
    },
  },
  actions: {},
};
export default system;
