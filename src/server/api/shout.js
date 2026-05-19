import { post } from "@/server/axios";

/** 呐喊主题列表 */
export function shoutApiThemeList(params, config) {
  return post("api/theme/detList", params, config);
}

/** 呐喊主题对应的音频 */
export function shoutApiAboutMusic(params, config) {
  return post("api/theme/aboutList", params, config);
}

/** 呐喊主题对应的助力音频 */
export function shoutApiZhuliMusic(params, config) {
  return post("api/theme/zhuliList", params, config);
}

/** 呐喊背景音乐 */
export function shoutApiBackgroundMusic(params, config) {
  return post("api/theme/backgroundMusic", params, config);
}
