export let classNameData = []
export let scoreData = []
// 左顶部图表数据
export const LeftTopXData = ["焦虑", "抑郁", "压力", "失眠", "疲劳", "易怒", "放松"]
export let leftValueData = []
const leftTopSimilarMap = {
  焦虑: ["焦虑", "担心", "害怕", "忧郁"],
  抑郁: ["忧郁", "悲伤", "痛苦", "受挫"],
  压力: ["紧张", "不满", "痛苦", "焦虑", "悲伤"],
  失眠: ["忧郁", "压力", "焦虑"],
  疲劳: ["痛苦", "压力", "失眠"],
  易怒: ["愤怒", "狂躁", "不满"],
  放松: ["正常", "幸福", "快乐", "兴奋"],
}
// 新增：左顶部各维度的分数配置
const leftTopScoreConfig = {
  焦虑: { base: 20, ratio: 0.60, max: 95 },
  抑郁: { base: 20, ratio: 0.56, max: 95 },
  压力: { base: 15, ratio: 0.65, max: 90 },
  失眠: { base: 10, ratio: 0.63, max: 95 },
  疲劳: { base: 20, ratio: 0.62, max: 95 },
  易怒: { base: 8, ratio: 0.55, max: 70 },
  放松: { base: 20, ratio: 0.50, max: 75 },
}

// 新增：格式化函数，与 leftBottom 同理
function formatLeftTopScore(name, score) {
  const config = leftTopScoreConfig[name] || { base: 30, ratio: 0.65, max: 95 }
  const value = Math.ceil(config.base + score * config.ratio)
  return Math.min(value, config.max)
}
// 左顶部图表数据

// 左底部图表数据
export let leftBottomValueData = []
let leftBottomXData = [
  "抗压指数",
  "记忆力指数",
  "适应力指数",
  "专注力指数",
  "自控力指数",
  "心理负荷指数",
  "情绪平衡指数",
  "情绪稳定指数",
]
const leftBottomSimilarMap = {
  抗压指数: ["正常", "放松", "幸福", "快乐"],
  记忆力指数: ["正常", "兴奋", "快乐"],
  适应力指数: ["正常", "放松", "幸福", "兴奋"],
  专注力指数: ["正常", "兴奋", "快乐"],
  自控力指数: ["正常", "放松", "不满"],
  心理负荷指数: ["压力", "焦虑", "紧张", "痛苦", "忧郁"],
  情绪平衡指数: ["正常", "放松", "幸福", "快乐"],
  情绪稳定指数: ["正常", "放松", "幸福"],
}
const leftBottomScoreConfig = {
  抗压指数: { base: 36, ratio: 0.42, max: 82 },
  记忆力指数: { base: 32, ratio: 0.38, max: 78 },
  适应力指数: { base: 34, ratio: 0.4, max: 80 },
  专注力指数: { base: 30, ratio: 0.36, max: 76 },
  自控力指数: { base: 33, ratio: 0.35, max: 75 },
  心理负荷指数: { base: 18, ratio: 0.5, max: 72 },
  情绪平衡指数: { base: 35, ratio: 0.37, max: 79 },
  情绪稳定指数: { base: 38, ratio: 0.34, max: 76 },
}
// 左底部图表数据

// 右上部图表数据
let rightTopXData = ["满足指数", "放松指数", "兴奋指数", "乐观指数", "自信指数"]
export let rightTopValueData = []
const rightTopSimilarMap = {
  满足指数: ["幸福", "快乐", "正常", "兴奋"],
  放松指数: ["放松", "正常", "幸福"],
  兴奋指数: ["兴奋", "快乐", "幸福"],
  乐观指数: ["正常", "幸福", "快乐", "兴奋"],
  自信指数: ["正常", "幸福", "快乐"],
}
const rightTopScoreConfig = {
  满足指数: { base: 24, ratio: 0.56, max: 88 },
  放松指数: { base: 28, ratio: 0.5, max: 86 },
  兴奋指数: { base: 30, ratio: 0.54, max: 84 },
  乐观指数: { base: 26, ratio: 0.48, max: 82 },
  自信指数: { base: 30, ratio: 0.42, max: 80 },
}
// 右上部图表数据

// 右下部图表数据
let rightBottomXData = ["正面情绪", "负面情绪", "心理能力"]
export let ZMrightBottom = [] //正面情绪
export let FMrightBottom = [] //负面情绪
export let XLrightBottom = [] //心理能力
const MAX_HISTORY = 12 // 保留最多12个历史数据点
const rightBottomSimilarMap = {
  正面情绪: ["正常", "幸福", "快乐", "兴奋"],
  负面情绪: [
    "焦虑",
    "抑郁",
    "压力",
    "失眠",
    "疲劳",
    "易怒",
    "担心",
    "害怕",
    "忧郁",
    "悲伤",
    "痛苦",
    "受挫",
    "紧张",
    "不满",
    "愤怒",
    "狂躁",
  ],
  心理能力: ["正常", "幸福", "快乐", "兴奋"],
}
// 右下部图表数据

export function getEmotionResult(e) {
  const result = Array.isArray(e) ? e : e.detail?.data?.data
  if (!result || !Array.isArray(result)) {
    console.warn("情绪识别结果无效")
    return null
  }
  classNameData = []
  scoreData = []
  result.forEach((item) => {
    item.score = Math.ceil(item.score * 100)
    classNameData.push(item.class_name)
    scoreData.push(item.score)
  })
  leftValueData = getLeftValueData(result)
  leftBottomValueData = getLeftBottomValueData(result)
  rightTopValueData = getRightTopValueData(result)
  const rightBottomData = getRightBottomValueData(result)

  // 将新的数据点添加到历史数组中
  ZMrightBottom.push(rightBottomData.正面情绪)
  FMrightBottom.push(rightBottomData.负面情绪)
  XLrightBottom.push(rightBottomData.心理能力)

  // 保持最多 MAX_HISTORY 个数据点
  if (ZMrightBottom.length > MAX_HISTORY) {
    ZMrightBottom.shift()
  }
  if (FMrightBottom.length > MAX_HISTORY) {
    FMrightBottom.shift()
  }
  if (XLrightBottom.length > MAX_HISTORY) {
    XLrightBottom.shift()
  }

  // console.log("情绪识别结果", result)
  return {
    result,
    classNameData,
    scoreData,
    leftValueData,
    leftBottomValueData,
    rightTopValueData,
    ZMrightBottom,
    FMrightBottom,
    XLrightBottom,
  }
}

function getLeftValueData(result) {
  const emotionScoreMap = result.reduce((map, item) => {
    map[item.class_name] = item.score
    return map
  }, {})

  return LeftTopXData.map((name) => {
    if (emotionScoreMap[name] !== undefined) {
      return formatLeftTopScore(name, emotionScoreMap[name]) // ← 修改
    }
    const similarNames = leftTopSimilarMap[name] || []
    const matchedNames = similarNames.filter((similarName) => {
      return emotionScoreMap[similarName] !== undefined
    })
    if (!matchedNames.length) {
      return 30 // ← 兜底从 0 改为 30（保证最低分）
    }
    const randomIndex = Math.floor(Math.random() * matchedNames.length)
    return formatLeftTopScore(name, emotionScoreMap[matchedNames[randomIndex]]) // ← 修改
  })
}

function formatLeftBottomScore(name, score) {
  const config = leftBottomScoreConfig[name] || {
    base: 30,
    ratio: 0.4,
    max: 80,
  }
  const value = Math.ceil(config.base + score * config.ratio)
  return Math.min(value, config.max)
}

function getLeftBottomValueData(result) {
  const emotionScoreMap = result.reduce((map, item) => {
    map[item.class_name] = item.score
    return map
  }, {})

  return leftBottomXData.map((name) => {
    if (emotionScoreMap[name] !== undefined) {
      return formatLeftBottomScore(name, emotionScoreMap[name])
    }
    const similarNames = leftBottomSimilarMap[name] || []
    const matchedNames = similarNames.filter((similarName) => {
      return emotionScoreMap[similarName] !== undefined
    })
    if (!matchedNames.length) {
      return 0
    }
    const randomIndex = Math.floor(Math.random() * matchedNames.length)
    return formatLeftBottomScore(name, emotionScoreMap[matchedNames[randomIndex]])
  })
}

function getRightTopValueData(result) {
  const emotionScoreMap = result.reduce((map, item) => {
    map[item.class_name] = item.score
    return map
  }, {})

  return rightTopXData.map((name) => {
    if (emotionScoreMap[name] !== undefined) {
      return {
        value: formatRightTopScore(name, emotionScoreMap[name]),
        name,
      }
    }
    const similarNames = rightTopSimilarMap[name] || []
    const matchedNames = similarNames.filter((similarName) => {
      return emotionScoreMap[similarName] !== undefined
    })
    if (!matchedNames.length) {
      return {
        value: 0,
        name,
      }
    }
    const randomIndex = Math.floor(Math.random() * matchedNames.length)
    return {
      value: formatRightTopScore(name, emotionScoreMap[matchedNames[randomIndex]]),
      name,
    }
  })
}

function formatRightTopScore(name, score) {
  const config = rightTopScoreConfig[name] || {
    base: 24,
    ratio: 0.5,
    max: 85,
  }
  const value = Math.ceil(config.base + score * config.ratio)
  return Math.min(value, config.max)
}

function getRightBottomValueData(result) {
  const emotionScoreMap = result.reduce((map, item) => {
    map[item.class_name] = item.score
    return map
  }, {})

  const rightBottomData = {}

  rightBottomXData.forEach((name) => {
    let score = 0

    if (emotionScoreMap[name] !== undefined) {
      score = emotionScoreMap[name]
    } else {
      const similarNames = rightBottomSimilarMap[name] || []
      const matchedNames = similarNames.filter((similarName) => {
        return emotionScoreMap[similarName] !== undefined
      })
      if (matchedNames.length) {
        const randomIndex = Math.floor(Math.random() * matchedNames.length)
        score = emotionScoreMap[matchedNames[randomIndex]]
      }
    }

    rightBottomData[name] = formatRightBottomScore(name, score)
  })

  return rightBottomData
}

function formatRightBottomScore(name, score) {
  // score 已经被转换为 0-100 的范围（在 getEmotionResult 中）
  // 需要将其进一步转换为特定指标的分数
  const normalizedScore = score / 100 // 转回 0-1 范围

  if (name === "正面情绪") {
    // 正面情绪: 基础30, 比例0.5, 最大85
    return Math.ceil(Math.min(30 + score * 0.5, 85))
  } else if (name === "负面情绪") {
    // 负面情绪: 基础20, 比例0.4, 最大75
    return Math.ceil(Math.min(20 + score * 0.4, 75))
  } else if (name === "心理能力") {
    // 心理能力: 基础40, 比例0.45, 最大90
    return Math.ceil(Math.min(40 + score * 0.45, 90))
  }
  return score
}
