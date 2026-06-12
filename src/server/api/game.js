import { post } from "@/server/axios";

export const game = {
  angle: {
    game_name: "钓鱼小能手",
    game_id: 1,
    cat_name: "身体运动智能",
  },
  chick: {
    game_name: "飞行大挑战",
    game_id: 2,
    cat_name: "自省智能训练",
  },
  guessingRiddle: {
    game_name: "猜谜语",
    game_id: 3,
    cat_name: "自省智能训练",
  },
  mobileStick: {
    game_name: "移动小棒",
    game_id: 4,
    cat_name: "数理逻辑智能",
  },
  useYourLittleBrain: {
    game_name: "动动小脑筋",
    game_id: 5,
    cat_name: "数理逻辑智能",
  },
  symbolMatching: {
    game_name: "符号匹配",
    game_id: 6,
    cat_name: "数理逻辑智能",
  },
  flowerDiscrimination: {
    game_name: "花朵辨别",
    cat_name: "自然观察训练",
    game_id: 7,
  },
  understandingMusical: {
    game_name: "认识乐器",
    cat_name: "音乐智能训练",
    game_id: 8,
  },
  colorGame: {
    game_name: "颜色对对碰",
    cat_name: "视觉空间智能",
    game_id: 9,
  },
  masterMemoryGame: {
    game_name: "记忆大师",
    cat_name: "视觉空间智能",
    game_id: 10,
  },
  tangram: {
    game_name: "七巧板",
    cat_name: "视觉空间智能",
    game_id: 11,
  },
};

//添加游戏报告
export function gameReportApiAdd(params) {
  return post("/api/game/save", params);
}

//游戏报告列表
export function gameReportApiList(params) {
  let arr = [];
  for (const param of Object.keys(game)) {
    arr.push(game[param].game_id);
  }
  params.game_id = arr.join(",");
  return post("/api/game/list", params);
}

//删除游戏报告
export function gameReportApiDel(params) {
  return post("/api/game/del", params);
}

//游戏报告详情
export function gameReportApiDetail(params) {
  return post("/api/game/info", params);
}

//评论游戏报告
export function gameReportApiComment(params) {
  return post("/api/game/comment", params);
}

export function getGameReportRecycleList(params) {
  params.is_recycle = 1;
  return post("/api/game/list", params);
}

export function delGameReportRecycleList(params) {
  let ids = params.rows.map((v) => v.id).join(",");
  return post("/api/game/truedel", { ids });
}

export function reductionGameReportRecycleList(params) {
  let ids = params.rows.map((v) => v.id).join(",");
  return post("/api/game/restore", { ids });
}

// 认知训练
export function newcogMode(params) {
  return post("/backend/newcog/mode", params);
}

//单车游戏
export function goBikeGame(params) {
  return post("api/Bike/goBike", params);
}
//新增
export function addBikeGame(params) {
  return post("api/Bike/saveBike", params);
}
//删除
export function delBikeGame(params) {
  return post("api/Bike/delBike", params);
}
//详情
export function infoBikeGame(params) {
  return post("api/Bike/infoBike", params);
}
