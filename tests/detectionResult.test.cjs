const assert = require("node:assert/strict")
const { test } = require("node:test")
const fs = require("node:fs")
const path = require("node:path")
const vm = require("node:vm")
const { transformSync } = require("@babel/core")

const root = path.resolve(__dirname, "..")
const pageFile = "src/views/front/views/detection/index.vue"
const middleFile = "src/views/front/views/detection/components/middle.vue"
const reportFile = "src/views/front/views/report/emotionReport.vue"
const reportSections = ["image_analysis", "comprehensive", "negative", "positive", "mental_ability"]
const plain = (value) => JSON.parse(JSON.stringify(value))

function loadModule(file, mocks, globals) {
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
      if (Object.hasOwn(mocks, id)) return mocks[id]
      if (id.endsWith(".vue")) return {}
      if (id.startsWith(".") || id.startsWith("@/utils/")) {
        const resolved = id.startsWith("@/")
          ? path.resolve(root, "src", id.slice(2))
          : path.resolve(path.dirname(filename), id)
        return loadModule(path.extname(resolved) ? resolved : `${resolved}.js`, mocks, globals)
      }
      return {}
    },
    ...globals,
  }, { filename })
  return module.exports
}

function componentState(component, overrides = {}) {
  const state = { ...component.data(), ...overrides }
  for (const [name, method] of Object.entries(component.methods)) state[name] = method.bind(state)
  return state
}

function expressions(happy) {
  return { happy, neutral: 1 - happy, angry: 0, disgusted: 0, fearful: 0, sad: 0, surprised: 0 }
}

function createHarness() {
  let now = 3000
  let detectionPromise = Promise.resolve(null)
  let storedReport
  const submitted = []
  const requestedIds = []
  const events = []
  const pendingEvents = []
  const chartOptions = {}
  const globals = {
    Date: { now: () => now },
    document: { getElementById: (id) => id },
    requestAnimationFrame: () => 1,
    cancelAnimationFrame() {},
    clearInterval() {},
    console: { log() {}, error(error) { throw error } },
  }
  const mocks = {
    "@/server/api/detection": {
      async addSmileAssess(payload) {
        submitted.push(plain(payload))
        storedReport = Object.fromEntries(reportSections.map((key) => [key, JSON.stringify(payload[key])]))
        return { data: { code: 200, msg: "保存成功", data: { id: "report-42" } } }
      },
      async getSmileAssessDetail({ id }) {
        requestedIds.push(id)
        return { data: { code: 200, data: plain(storedReport) } }
      },
    },
    "face-api.js": {
      matchDimensions() {},
      TinyFaceDetectorOptions: function () {},
      detectSingleFace: () => ({ withFaceExpressions: () => detectionPromise }),
      resizeResults: (detection) => detection,
    },
    echarts: {
      init: (id) => ({ setOption: (option) => { chartOptions[id] = option } }),
    },
  }
  const shared = { $global: { successCode: 200 }, $myMessage() {} }
  const page = componentState(loadModule(pageFile, mocks, globals).default, shared)
  const middleTag = fs.readFileSync(path.resolve(root, pageFile), "utf8").match(/<Middle\b[^>]*>/)[0]
  const handlers = Object.fromEntries([...middleTag.matchAll(/@([\w-]+)="(\w+)"/g)].map((match) => [match[1], match[2]]))
  const middle = componentState(loadModule(middleFile, mocks, globals).default, {
    ...shared,
    $refs: {},
    $emit(name, payload) {
      events.push(name)
      if (handlers[name]) {
        const pending = page[handlers[name]](payload)
        if (pending && typeof pending.then === "function") pendingEvents.push(pending)
      }
    },
  })
  middle.currentState = "shooting"
  middle.faceDetecting = true
  middle.video = { clientWidth: 500, clientHeight: 450, pause() {} }
  middle.canvas = { width: 500, height: 450, toDataURL: () => "data:image/jpeg;base64,snapshot" }
  middle.ctx = { clearRect() {} }
  const report = componentState(loadModule(reportFile, mocks, globals).default, {
    ...shared,
    $refs: {},
    $route: { query: { id: "report-42" } },
    $nextTick: (callback) => callback(),
  })
  return {
    page, middle, report, submitted, requestedIds, events, chartOptions,
    advanceTime: () => { now += 600 },
    setDetectionPromise: (promise) => { detectionPromise = promise },
    flushEvents: () => Promise.all(pendingEvents),
  }
}

test("completed detection keeps all chart data and matches the saved report readback", async () => {
  const harness = createHarness()
  const { page, middle, report, submitted, requestedIds, chartOptions } = harness
  middle.handleFaceResult({ expressions: expressions(0.68) })
  const displayed = plain(page.createReportPayload())
  const summary = plain(middle.analysisData)
  assert.ok(displayed.negative.value.some((value) => value > 0))

  middle.captureAndCompleteDetection()
  await harness.flushEvents()
  await report.getSmileDetail()

  assert.equal(submitted.length, 1)
  assert.deepEqual(submitted[0], displayed)
  assert.deepEqual(requestedIds, [page.detailsId])
  for (const key of reportSections) {
    const readback = report.reportData[key]
    assert.deepEqual(plain(key === "comprehensive" ? readback : { name: readback.name, value: readback.value }), displayed[key])
  }
  assert.deepEqual(plain(chartOptions.radarMap.series[0].data[0].value), displayed.negative.value)
  assert.deepEqual(plain(chartOptions.roseChart.series[0].data), displayed.positive.value)
  assert.deepEqual(plain(chartOptions.barGraph.series[1].data), displayed.mental_ability.value)
  assert.equal(middle.currentState, "analyzed")
  assert.deepEqual(plain(middle.analysisData), summary)
  assert.deepEqual(plain(page.createReportPayload()), displayed)
})

test("an in-flight face result cannot change the completed snapshot or report", async () => {
  const harness = createHarness()
  const { page, middle, submitted, events } = harness
  middle.handleFaceResult({ expressions: expressions(0.9) })
  const summary = plain(middle.analysisData)
  const displayed = plain(page.createReportPayload())
  let resolveDetection
  harness.setDetectionPromise(new Promise((resolve) => { resolveDetection = resolve }))
  const pendingDetection = middle.runFaceDetection()

  middle.captureAndCompleteDetection()
  await harness.flushEvents()
  const completedPage = plain(page.createReportPayload())
  const emotionEvents = events.filter((name) => name === "emotion-change").length
  harness.advanceTime()
  resolveDetection({ expressions: expressions(0.1) })
  await pendingDetection

  assert.equal(events.filter((name) => name === "emotion-change").length, emotionEvents)
  assert.deepEqual(plain(middle.analysisData), summary)
  assert.deepEqual(plain(page.createReportPayload()), completedPage)
  assert.deepEqual(submitted, [displayed])
})

test("a face result from the previous session is ignored after restarting detection", async () => {
  const harness = createHarness()
  const { page, middle, events } = harness
  middle.handleFaceResult({ expressions: expressions(0.85) })
  let resolvePreviousDetection
  harness.setDetectionPromise(new Promise((resolve) => { resolvePreviousDetection = resolve }))
  const pendingPreviousDetection = middle.runFaceDetection()

  middle.captureAndCompleteDetection()
  await harness.flushEvents()
  middle.restartFaceDetection()
  middle.faceDetecting = true
  const resetEvents = events.filter((name) => name === "emotion-change").length

  resolvePreviousDetection({ expressions: expressions(0.05) })
  await pendingPreviousDetection

  assert.equal(events.filter((name) => name === "emotion-change").length, resetEvents)
  assert.deepEqual(plain(middle.analysisData), { smileIndex: 0, positiveEmotion: 0, negativeEmotion: 0, mentalAbility: 0 })
  assert.ok(page.createReportPayload().image_analysis.value.every((value) => value === 0))
  assert.ok(page.createReportPayload().negative.value.every((value) => value === 0))
})

test("restarting detection clears all charts and summaries while preserving report access", async () => {
  const harness = createHarness()
  const { page, middle } = harness
  middle.handleFaceResult({ expressions: expressions(0.7) })
  middle.captureAndCompleteDetection()
  await harness.flushEvents()
  assert.equal(page.detailsId, "report-42")

  middle.restartFaceDetection()

  assert.equal(middle.currentState, "prescoring")
  assert.equal(page.detailsId, "report-42")
  assert.deepEqual(plain(middle.analysisData), { smileIndex: 0, positiveEmotion: 0, negativeEmotion: 0, mentalAbility: 0 })
  assert.deepEqual(plain(page.analysisData), plain(middle.analysisData))
  const cleared = page.createReportPayload()
  const allScores = [
    ...cleared.image_analysis.value,
    ...cleared.negative.value,
    ...cleared.positive.value.map((item) => item.value),
    ...cleared.mental_ability.value,
    ...cleared.comprehensive.flatMap((item) => item.value),
  ]
  assert.ok(allScores.every((value) => value === 0))
})
