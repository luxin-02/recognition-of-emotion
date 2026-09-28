const assert = require("node:assert/strict")
const { test } = require("node:test")
const fs = require("node:fs")
const path = require("node:path")
const vm = require("node:vm")
const { transformSync } = require("@babel/core")

const root = path.resolve(__dirname, "..")
const detectionPanel = "src/views/front/views/detection/composables/usePanelData.js"
const livePanel = "src/views/front/views/EmotionDetector/composables/usePanelData.js"
const middle = "src/views/front/views/detection/components/middle.vue"
const shoot = "src/views/front/views/smileCheck/components/shoot.vue"

function loadModule(file, globals = {}) {
  const filename = path.resolve(root, file)
  let source = fs.readFileSync(filename, "utf8")
  if (filename.endsWith(".vue")) source = source.match(/<script>([\s\S]*?)<\/script>/)[1]
  const { code } = transformSync(source, {
    filename,
    configFile: false,
    babelrc: false,
    plugins: ["@babel/plugin-transform-modules-commonjs"],
  })
  const module = { exports: {} }
  vm.runInNewContext(code, {
    module,
    exports: module.exports,
    require(id) {
      if (id.startsWith(".") || id.startsWith("@/utils/")) {
        const resolved = id.startsWith("@/")
          ? path.resolve(root, "src", id.slice(2))
          : path.resolve(path.dirname(filename), id)
        return loadModule(path.extname(resolved) ? resolved : `${resolved}.js`, globals)
      }
      return {}
    },
    ...globals,
  }, { filename })
  return module.exports
}

function expressions(happy) {
  return { happy, neutral: 1 - happy, angry: 0, disgusted: 0, fearful: 0, sad: 0, surprised: 0 }
}

function assertPositive(scores, minimum = 60) {
  for (const score of scores) {
    assert.ok(Number.isInteger(score) && score >= minimum && score <= 100, `unexpected positive score: ${score}`)
  }
}

test("smile check maps 50-100 smiles to rising positive scores", () => {
  const endpoints = new Set()
  for (const random of [0, 0.5, 1 - Number.EPSILON]) {
    const math = Object.create(Math)
    math.random = () => random
    const { clampSmileIndex, getSmileIndex, getPositiveEmotionScore, getSmileCheckEmotionScore, getNegativeEmotionScore } = loadModule("src/utils/positiveEmotionScore.js", { Math: math })
    assert.equal(clampSmileIndex(10), 50)
    assert.equal(clampSmileIndex(120), 100)
    assert.equal(getSmileIndex(0, [0, 0, 0]), 50)
    assert.equal(getSmileIndex(1, [100, 100, 100]), 100)
    let previous = 60
    for (let smile = 0; smile <= 100; smile += 1) {
      const score = getPositiveEmotionScore(smile)
      assertPositive([score], smile >= 100 ? 95 : 60)
      assert.ok(score >= previous)
      assert.ok(Math.abs(score - (60 + smile * 0.4)) <= 5.5)
      previous = score
      endpoints.add(score)
    }
    assertPositive([getSmileCheckEmotionScore(50)], 60)
    assertPositive([getSmileCheckEmotionScore(100)], 95)
    let previousSmileCheckScore = 60
    for (let smile = 50; smile <= 100; smile += 1) {
      const score = getSmileCheckEmotionScore(smile, 0)
      assert.ok(score >= previousSmileCheckScore)
      previousSmileCheckScore = score
    }
    let previousNegativeScore = 101
    for (let smile = 0; smile <= 100; smile += 1) {
      const score = getNegativeEmotionScore(smile, 0)
      assert.ok(Number.isInteger(score) && score >= 10 && score <= 100)
      assert.ok(score <= previousNegativeScore)
      previousNegativeScore = score
    }
    assert.ok(getNegativeEmotionScore(100, 0) < getNegativeEmotionScore(0, 0))
  }
  assert.ok(endpoints.has(60))
  assert.ok(endpoints.has(100))
})

test("smile check-in derives its positive score from the generated smile score", () => {
  for (const randomSmile of [0, 0.5, 1 - Number.EPSILON]) {
    for (const randomOffset of [0, 0.5, 1 - Number.EPSILON]) {
      const randomValues = [randomSmile, randomOffset]
      const math = Object.create(Math)
      math.random = () => randomValues.length ? randomValues.shift() : 0
      const component = loadModule(shoot, { Math: math, setTimeout: () => 1 }).default
      const state = { ...component.data(), capturedExpressions: { happy: randomSmile }, clearAnalysisTimer() {} }
      component.methods.analyzePhoto.call(state)
      assert.ok(state.analysisData.smileIndex >= 50 && state.analysisData.smileIndex <= 100)
      assertPositive([state.analysisData.positiveEmotion])
      if (state.analysisData.smileIndex >= 95) assertPositive([state.analysisData.positiveEmotion], 90)
      assertPositive([state.analysisData.mentalAbility])
      if (state.analysisData.smileIndex >= 95) assertPositive([state.analysisData.mentalAbility], 90)
      assert.notEqual(state.analysisData.positiveEmotion, state.analysisData.mentalAbility)
      assert.ok(Number.isInteger(state.analysisData.negativeEmotion) && state.analysisData.negativeEmotion >= 10 && state.analysisData.negativeEmotion <= 100)
      if (state.analysisData.smileIndex >= 95) assert.ok(state.analysisData.negativeEmotion <= 30)
      if (state.analysisData.smileIndex <= 55) assert.ok(state.analysisData.negativeEmotion >= 50)
    }
  }
})

for (const panelFile of [detectionPanel, livePanel]) {
  test(`${panelFile}: positive trends stay in range and rise with smiles`, () => {
    let now = 0
    let differentAverages = 0
    let firstNegativeAverage = null
    let lastNegativeAverage = null
    const panel = loadModule(panelFile, { Date: { now: () => now } })
    assert.ok(panel.createInitialPanelState().rightBottomData.positiveData.every(value => value === 0))
    for (let tick = 1; tick <= 200; tick += 1) {
      now = tick * 1200
      let previousAverage = 0
      for (const happy of [0, 0.25, 0.5, 0.75, 1]) {
        const scores = panel.createPanelDataFromExpressions(expressions(happy)).rightBottomData.positiveData
        assertPositive(scores, happy === 1 ? 95 : 60)
        const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
        assert.ok(average >= previousAverage)
        previousAverage = average

        const psychologyScores = panel.createPanelDataFromExpressions(expressions(happy)).rightBottomData.psychologyData
        assertPositive(psychologyScores, happy === 1 ? 95 : 60)
        const psychologyAverage = psychologyScores.reduce((sum, score) => sum + score, 0) / psychologyScores.length
        if (psychologyAverage !== average) differentAverages += 1

        const negativeScores = panel.createPanelDataFromExpressions(expressions(happy)).rightBottomData.negativeData
        assert.ok(negativeScores.every((score) => Number.isInteger(score) && score >= 10 && score <= 100))
        const negativeAverage = negativeScores.reduce((sum, score) => sum + score, 0) / negativeScores.length
        if (firstNegativeAverage === null) firstNegativeAverage = negativeAverage
        lastNegativeAverage = negativeAverage
      }
    }
    assert.ok(differentAverages > 100)
    assert.ok(lastNegativeAverage < firstNegativeAverage)
  })
}

test("detection summary and the full report trend keep high smiles in the high score range", () => {
  let now = 0
  const globals = { Date: { now: () => now } }
  const panel = loadModule(detectionPanel, globals)
  const component = loadModule(middle, globals).default
  const state = { ...component.data(), ...component.methods }
  const page = loadModule("src/views/front/views/detection/index.vue", globals).default
  for (let tick = 1; tick <= 200; tick += 1) {
    now = tick * 300
    const result = panel.createPanelDataFromExpressions(expressions(1), { motionInterval: 300 })
    state.updateAnalysisFromPanel(result, expressions(1))
    assert.equal(state.analysisData.smileIndex, 100)
    assertPositive([state.analysisData.positiveEmotion], 95)
    assertPositive([state.analysisData.mentalAbility], 95)
    assert.ok(state.analysisData.negativeEmotion <= 30)
    const payload = state.createDetectionPayload(result)
    assert.equal(payload.ZMrightBottom.length, 12)
    assertPositive(payload.ZMrightBottom, 95)
    const pageState = { analysisData: state.analysisData }
    page.methods.handleEmotionChange.call(pageState, payload)
    const report = page.methods.createReportPayload.call(pageState)
    assert.equal(report.image_analysis.value[1], state.analysisData.positiveEmotion)
    assert.equal(report.image_analysis.value[2], state.analysisData.negativeEmotion)
    assert.ok(report.image_analysis.value[2] <= 30)
    assertPositive(report.comprehensive[0].value, 95)
    assertPositive(report.comprehensive[1].value, 95)
  }
})
