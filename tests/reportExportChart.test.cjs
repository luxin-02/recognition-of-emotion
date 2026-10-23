const assert = require("node:assert/strict")
const { test } = require("node:test")
const fs = require("node:fs")
const path = require("node:path")
const vm = require("node:vm")
const { transformSync } = require("@babel/core")
const PizZip = require("pizzip")

const root = path.resolve(__dirname, "..")
const chartImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aN1sAAAAASUVORK5CYII="

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
      if (id.startsWith("@/utils/")) return loadModule(`src/${id.slice(2)}.js`, mocks, globals)
      if (id.startsWith("@/server/")) return {}
      return require(id)
    },
    Buffer,
    Uint8Array,
    ArrayBuffer,
    ...globals,
  }, { filename })
  return module.exports
}

function scaleResult(gradeName) {
  return { gradeName, scores: 50, prop: 50, degree: "中间型", result: "诊断说明" }
}

function createHarness(type = "测评报告", recordResult = [scaleResult("总分")]) {
  let scaleReport = { record_result: recordResult }
  const saved = []
  const chartIds = []
  const templates = []
  const section = (name, value) => JSON.stringify({ name, value, result: ["分析说明"], level: ["正常"] })
  const baseReport = {
    nickname: "测试用户",
    gauge_title: "测试量表",
    total_seconds: 16,
    add_time: 1791504000,
  }
  const globals = {
    document: { getElementById: (id) => id },
    window: { atob: (value) => Buffer.from(value, "base64").toString("binary") },
    setTimeout: (callback) => callback(),
  }
  const mocks = {
    "@/server/api/guage": {
      async frontGaugeReportApiInfo() {
        return { data: { code: 200, data: { ...baseReport, ...scaleReport } } }
      },
    },
    "@/server/api/report": {
      async reportApiInfo() {
        return { data: { code: 200, data: {
          ...baseReport,
          game_name: "心理训练项目",
          seconds: 30,
          userinfo: { nickname: "训练用户" },
          result: "训练结果",
          suggest: "训练建议",
        } } }
      },
    },
    "@/server/api/detection": {
      async getSmileAssessDetail() {
        return { data: { code: 200, data: {
          ...baseReport,
          image_analysis: section(["微笑", "心理", "负面", "正面"], [70, 80, 20, 60]),
          negative: section(["焦虑", "愤怒"], [20, 30]),
          positive: section(["愉快"], [{ name: "愉快", value: 60 }]),
          mental_ability: section(["注意力"], [80]),
          comprehensive: "{}",
        } } }
      },
    },
    echarts: {
      init(id) {
        chartIds.push(id)
        return { setOption() {}, getDataURL: () => chartImage, dispose() {} }
      },
    },
    "jszip-utils": {
      getBinaryContent(template, callback) {
        templates.push(template)
        callback(null, fs.readFileSync(path.join(root, "public", template)))
      },
    },
    "file-saver": { saveAs: (blob, name) => saved.push({ blob, name }) },
  }
  const component = loadModule("src/views/front/views/report/index.vue", mocks, globals).default
  const state = {
    ...component.data(),
    reportType: type,
    detailsId: "report-1",
    $global: { successCode: 200 },
    $store: { getters: { roleInfo: { name: "测试账号" } } },
    $formatDate: () => "2026-10-09",
    $formatTime: () => "00:00:16",
    $nextTick: (callback) => callback(),
  }
  for (const [name, method] of Object.entries(component.methods)) state[name] = method.bind(state)
  for (const [name, getter] of Object.entries(component.computed)) {
    Object.defineProperty(state, name, { get: getter.bind(state) })
  }
  return {
    state,
    chartIds,
    templates,
    setScaleResults(results) { scaleReport = { record_result: results } },
    async exportDocument() {
      const previousCount = saved.length
      await state.exportWord()
      assert.equal(saved.length, previousCount + 1)
      const buffer = await saved.at(-1).blob.arrayBuffer()
      const xml = new PizZip(buffer).file("word/document.xml").asText()
      return { xml, text: xml.replace(/<[^>]+>/g, ""), drawings: (xml.match(/<w:drawing(?:\s|>)/g) || []).length }
    },
  }
}

test("a single-result assessment exports no chart", async () => {
  const harness = createHarness()
  const document = await harness.exportDocument()
  assert.equal(document.drawings, 0)
  assert.equal(document.text.includes("报告分析"), false)
  assert.deepEqual(harness.chartIds, [])
  assert.ok(document.xml.includes("诊断说明"))
})

test("an assessment without results exports no chart", async () => {
  const harness = createHarness("测评报告", [])
  const document = await harness.exportDocument()
  assert.equal(document.drawings, 0)
  assert.equal(document.text.includes("报告分析"), false)
  assert.deepEqual(harness.chartIds, [])
})

test("a multi-result assessment keeps its exported chart", async () => {
  const harness = createHarness("测评报告", [scaleResult("总分"), scaleResult("躯体化")])
  const document = await harness.exportDocument()
  assert.equal(document.drawings, 1)
  assert.ok(document.text.includes("报告分析"))
  assert.deepEqual(harness.chartIds, ["radarMap"])
  assert.ok(document.xml.includes("躯体化"))
})

test("exporting a single-result assessment after a chart report clears the previous chart", async () => {
  const harness = createHarness("测评报告", [scaleResult("总分"), scaleResult("躯体化")])
  const chartDocument = await harness.exportDocument()
  assert.equal(chartDocument.drawings, 1)
  assert.ok(chartDocument.text.includes("报告分析"))
  harness.setScaleResults([scaleResult("总分")])
  const textDocument = await harness.exportDocument()
  assert.equal(textDocument.drawings, 0)
  assert.equal(textDocument.text.includes("报告分析"), false)
  assert.equal(harness.state.chartImg, "")
  assert.deepEqual(harness.chartIds, ["radarMap"])
})

test("psychological training retains its template and text without chart generation", async () => {
  const harness = createHarness("心理训练")
  const document = await harness.exportDocument()
  assert.deepEqual(harness.templates, ["/docxTemplate/训练报告.docx"])
  assert.deepEqual(harness.chartIds, [])
  assert.equal(document.drawings, 0)
  assert.ok(document.xml.includes("训练结果"))
  assert.ok(document.xml.includes("训练建议"))
})

test("detection retains all three exported charts and its own template", async () => {
  const harness = createHarness("检测报告")
  const document = await harness.exportDocument()
  assert.deepEqual(harness.templates, ["/docxTemplate/检测报告.docx"])
  assert.deepEqual(harness.chartIds, ["radarMap", "roseChart", "barGraph"])
  assert.equal(document.drawings, 3)
  assert.ok(document.xml.includes("分析说明"))
})
