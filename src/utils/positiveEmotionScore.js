export function clampSmileIndex(value) {
  const score = Number(value)
  return Math.min(100, Math.max(50, Number.isFinite(score) ? Math.round(score) : 50))
}

export function getSmileIndex(happy) {
  const happyScore = Number(happy)
  const normalizedHappy = Number.isFinite(happyScore) ? Math.min(1, Math.max(0, happyScore)) : 0
  return clampSmileIndex(Math.round(50 + normalizedHappy * 50))
}

export function getPositiveEmotionScore(smileIndex, offset = Math.floor(Math.random() * 11) - 5) {
  const smileScore = Math.min(100, Math.max(0, Number(smileIndex) || 0))
  // 情绪检测的微笑指数为 0-100 分，正面分映射到 60-100 分，随机波动最多上下 5 分。
  return Math.min(100, Math.max(60, Math.round(60 + smileScore * 0.4 + offset)))
}

export function getSmileCheckEmotionScore(smileIndex, offset = Math.floor(Math.random() * 11) - 5) {
  const smileScore = Math.min(100, Math.max(50, Number(smileIndex) || 50))
  // 微笑打卡的微笑指数为 50-100 分，正面分映射到 60-100 分。
  return Math.min(100, Math.max(60, Math.round(60 + (smileScore - 50) * 0.8 + offset)))
}

export function getNegativeEmotionScore(smileIndex, offset = Math.floor(Math.random() * 11) - 5) {
  const smileScore = Math.min(100, Math.max(0, Number(smileIndex) || 0))
  // 微笑指数越高，负面情绪分越低，保持与正面情绪相反的趋势。
  return Math.min(100, Math.max(10, Math.round(20 + (100 - smileScore) * 0.8 + offset)))
}
