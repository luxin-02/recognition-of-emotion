const MIN_PANEL_SCORE = 10
const PANEL_MOTION_INTERVAL = 1200

export const LEFT_TOP_LABELS = ["焦虑", "抑郁", "压力", "失眠", "疲惫", "易怒", "放松"]

export const LEFT_BOTTOM_LABELS = [
  "抗压指数",
  "记忆力指数",
  "适应力指数",
  "专注力指数",
  "自控力指数",
  "心理负荷指数",
  "情绪平衡指数",
  "情绪稳定指数",
]

const RIGHT_TOP_NAMES = ["满足指数", "放松指数", "兴奋指数", "乐观指数", "自信指数"]

export const RIGHT_BOTTOM_META = [
  { key: "psychologyData", name: "心理能力", color: "#38BDF8" },
  { key: "positiveData", name: "正面情绪", color: "#34D399" },
  { key: "negativeData", name: "负面情绪", color: "#F87171" },
]

function getExpressionValue(expressions, key) {
  const value = Number(expressions && expressions[key])
  return Number.isFinite(value) ? value : 0
}

function clamp(value) {
  return Math.min(1, Math.max(0, value))
}

function clampPanelScore(value) {
  return Math.min(100, Math.max(MIN_PANEL_SCORE, Math.round(value)))
}

function toScore(value) {
  return clampPanelScore(clamp(value) * 100)
}

function getMotionOffset(index, amplitude = 14, motionInterval = PANEL_MOTION_INTERVAL) {
  const tick = Math.floor(Date.now() / motionInterval)
  const wave = Math.sin((tick + 1) * (index + 3) * 1.37)
  const secondWave = Math.cos((tick + 2) * (index + 5) * 0.91)
  return Math.round(((wave + secondWave) / 2) * amplitude)
}

function moveScore(score, index, amplitude = 14, motionInterval = PANEL_MOTION_INTERVAL) {
  return clampPanelScore(score + getMotionOffset(index, amplitude, motionInterval))
}

function moveScores(scores, amplitude = 14, motionInterval = PANEL_MOTION_INTERVAL) {
  return scores.map((score, index) => moveScore(score, index, amplitude, motionInterval))
}

function createTrendData(baseScore, offsets, groupIndex = 0, motionInterval = PANEL_MOTION_INTERVAL) {
  return offsets.map((offset, index) => {
    return moveScore(baseScore + offset, index + groupIndex * 10, 12, motionInterval)
  })
}

function createRightTopData(values) {
  return RIGHT_TOP_NAMES.map((name, index) => ({
    name,
    value: values[index],
  }))
}

export function createInitialPanelState() {
  return {
    leftTopData: [0, 0, 0, 0, 0, 0, 0],
    leftBottomData: [0, 0, 0, 0, 0, 0, 0, 0],
    rightTopData: createRightTopData([0, 0, 0, 0, 0]),
    rightBottomData: {
      psychologyData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      positiveData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      negativeData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  }
}

export function getPanelRows(labels, values) {
  return labels.map((name, index) => ({
    name,
    value: values[index],
  }))
}

export function getTrendHeight(value, data) {
  const maxValue = Math.max(...data, 1)
  return `${Math.max((value / maxValue) * 100, 8)}%`
}

export function createRightBottomGroups(rightBottomData) {
  return RIGHT_BOTTOM_META.map((item) => ({
    ...item,
    data: rightBottomData[item.key],
  }))
}

export function createPanelDataFromExpressions(expressions, options = {}) {
  const motionInterval = options.motionInterval || PANEL_MOTION_INTERVAL
  const angry = getExpressionValue(expressions, "angry")
  const disgusted = getExpressionValue(expressions, "disgusted")
  const fearful = getExpressionValue(expressions, "fearful")
  const happy = getExpressionValue(expressions, "happy")
  const neutral = getExpressionValue(expressions, "neutral")
  const sad = getExpressionValue(expressions, "sad")
  const surprised = getExpressionValue(expressions, "surprised")

  const anxiety = toScore(fearful * 0.55 + angry * 0.2 + surprised * 0.15 + sad * 0.1)
  const depression = toScore(sad * 0.65 + neutral * 0.25 - happy * 0.2)
  const pressure = toScore(fearful * 0.35 + angry * 0.25 + surprised * 0.2 + disgusted * 0.1)
  const insomnia = toScore(fearful * 0.3 + sad * 0.25 + neutral * 0.25 + angry * 0.1)
  const fatigue = toScore(sad * 0.35 + neutral * 0.35 + disgusted * 0.15)
  const irritable = toScore(angry * 0.65 + disgusted * 0.2 + surprised * 0.1)
  const relax = toScore(neutral * 0.45 + happy * 0.35 - fearful * 0.2 - angry * 0.15)
  const positive = toScore(happy * 0.65 + neutral * 0.2 + surprised * 0.1)
  const negative = toScore(sad * 0.35 + fearful * 0.3 + angry * 0.22 + disgusted * 0.13)
  const focus = toScore(neutral * 0.7 + happy * 0.15 - surprised * 0.12 - fearful * 0.15)
  const stressResistance = toScore(neutral * 0.35 + happy * 0.25 + relax / 100 * 0.25 - pressure / 100 * 0.2)
  const memory = toScore(neutral * 0.45 + happy * 0.2 + focus / 100 * 0.25)
  const adaptability = toScore(happy * 0.35 + neutral * 0.3 + surprised * 0.1 - fearful * 0.12)
  const selfControl = toScore(neutral * 0.45 + relax / 100 * 0.3 - angry * 0.18)
  const mentalLoad = pressure
  const emotionBalance = clampPanelScore(100 - Math.abs(positive - negative))
  const emotionStability = toScore(neutral * 0.55 + (1 - Math.max(happy, sad, angry, fearful, surprised, disgusted)) * 0.35)
  const satisfaction = toScore(happy * 0.45 + neutral * 0.25 - sad * 0.2)
  const excitement = toScore(happy * 0.5 + surprised * 0.35)
  const optimism = toScore(happy * 0.55 + neutral * 0.2 - sad * 0.18 - fearful * 0.12)
  const confidence = toScore(happy * 0.35 + neutral * 0.35 - fearful * 0.2 - sad * 0.1)

  return {
    leftTopData: moveScores([anxiety, depression, pressure, insomnia, fatigue, irritable, relax], 18, motionInterval),
    leftBottomData: moveScores([
      stressResistance,
      memory,
      adaptability,
      focus,
      selfControl,
      mentalLoad,
      emotionBalance,
      emotionStability,
    ], 16, motionInterval),
    rightTopData: createRightTopData(moveScores([satisfaction, relax, excitement, optimism, confidence], 18, motionInterval)),
    rightBottomData: {
      psychologyData: createTrendData(Math.round((stressResistance + focus + selfControl) / 3), [-15, -8, 4, -3, 9, 14, 6, 17, 11, 20], 0, motionInterval),
      positiveData: createTrendData(positive, [-14, -4, 7, 0, 11, 18, 8, 21, 15, 24], 1, motionInterval),
      negativeData: createTrendData(negative, [-12, 3, 11, 5, 15, 7, 13, 4, -2, -9], 2, motionInterval),
    },
  }
}

export function createPanelDataSnapshot(panelState) {
  return {
    leftTopData: panelState.leftTopData,
    leftBottomData: panelState.leftBottomData,
    rightTopData: panelState.rightTopData,
    rightBottomData: panelState.rightBottomData,
  }
}
