const OBSERVING_STATE = Object.freeze({
  key: 'observing',
  label: '状态观察中',
  description: '当前特征还不足以形成稳定的辅助状态。',
  color: '#94A3B8',
  active: false
})

export const COMPOSITE_EMOTIONS = Object.freeze({
  focused: Object.freeze({
    label: '专注',
    description: '表情较为稳定，呈现出专注趋势。',
    color: '#38BDF8'
  }),
  tense: Object.freeze({
    label: '紧张',
    description: '面部特征呈现出一定的紧张趋势。',
    color: '#F59E0B'
  }),
  excited: Object.freeze({
    label: '兴奋',
    description: '愉悦与惊讶特征同时较为明显。',
    color: '#F97316'
  }),
  low: Object.freeze({
    label: '低落',
    description: '面部特征呈现出一定的低落趋势。',
    color: '#818CF8'
  })
})

export function createInitialCompositeScores() {
  return {
    focused: 0,
    tense: 0,
    excited: 0,
    low: 0
  }
}

function getExpression(expressions, key) {
  const value = Number(expressions && expressions[key])
  return Number.isFinite(value) ? value : 0
}

function clamp(value) {
  return Math.min(1, Math.max(0, value))
}

function roundScore(value) {
  return Math.round(value * 10000) / 10000
}

export function calculateCompositeScores(expressions = {}) {
  const angry = getExpression(expressions, 'angry')
  const disgusted = getExpression(expressions, 'disgusted')
  const fearful = getExpression(expressions, 'fearful')
  const happy = getExpression(expressions, 'happy')
  const neutral = getExpression(expressions, 'neutral')
  const sad = getExpression(expressions, 'sad')
  const surprised = getExpression(expressions, 'surprised')

  return {
    focused: roundScore(clamp(
      neutral * 0.65 + happy * 0.15 - surprised * 0.2 - fearful * 0.25 - angry * 0.2
    )),
    tense: roundScore(clamp(
      fearful * 0.45 + surprised * 0.25 + angry * 0.2 + disgusted * 0.1
    )),
    excited: roundScore(clamp(happy * 0.6 + surprised * 0.4)),
    low: roundScore(clamp(sad * 0.7 + neutral * 0.2 - happy * 0.25))
  }
}

export function getDominantCompositeEmotion(scores, minimumScore = 0.35) {
  let dominantKey = 'focused'
  let dominantScore = 0

  for (const key of Object.keys(COMPOSITE_EMOTIONS)) {
    const score = clamp(getExpression(scores, key))
    if (score > dominantScore) {
      dominantKey = key
      dominantScore = score
    }
  }

  if (dominantScore < minimumScore) {
    return {
      ...OBSERVING_STATE,
      score: roundScore(dominantScore)
    }
  }

  return {
    key: dominantKey,
    ...COMPOSITE_EMOTIONS[dominantKey],
    score: roundScore(dominantScore),
    active: true
  }
}

export function createCompositeEmotionTracker(options = {}) {
  const windowMs = options.windowMs ?? 1500
  const minimumScore = options.minimumScore ?? 0.35
  let samples = []

  function createState(scores = createInitialCompositeScores()) {
    return {
      scores,
      dominant: getDominantCompositeEmotion(scores, minimumScore)
    }
  }

  function update(expressions, timestamp = Date.now()) {
    samples.push({
      timestamp,
      scores: calculateCompositeScores(expressions)
    })
    samples = samples.filter((sample) => timestamp - sample.timestamp <= windowMs)

    const totals = createInitialCompositeScores()
    for (const sample of samples) {
      for (const key of Object.keys(totals)) {
        totals[key] += sample.scores[key]
      }
    }

    const scores = createInitialCompositeScores()
    for (const key of Object.keys(scores)) {
      scores[key] = roundScore(totals[key] / samples.length)
    }

    return createState(scores)
  }

  function reset() {
    samples = []
    return createState()
  }

  return {
    update,
    reset
  }
}
