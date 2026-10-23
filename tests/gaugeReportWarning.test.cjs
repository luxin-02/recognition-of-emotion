const assert = require("node:assert/strict")
const { test } = require("node:test")
const fs = require("node:fs")
const path = require("node:path")
const vm = require("node:vm")
const Vue = require("vue")
const compiler = require("vue-template-compiler")
const { transformSync } = require("@babel/core")

const filename = path.resolve(__dirname, "../src/views/front/views/report/details.vue")
const source = fs.readFileSync(filename, "utf8")
const parsed = compiler.parseComponent(source)
const compiled = compiler.compile(parsed.template.content)
assert.deepEqual(compiled.errors, [])
const { code } = transformSync(parsed.script.content, {
  filename,
  configFile: false,
  babelrc: false,
  plugins: ["@babel/plugin-transform-modules-commonjs"],
})

function createHarness(type = "测评报告") {
  const requestedIds = []
  let response = Promise.resolve({ data: { code: 200, data: { record_result: [] } } })
  const module = { exports: {} }
  vm.runInNewContext(code, {
    module,
    exports: module.exports,
    console: { log() {} },
    require(id) {
      if (id === "@/server/api/guage") {
        return { frontGaugeReportApiInfo(params) { requestedIds.push(params.id); return response } }
      }
      return {}
    },
  }, { filename })
  const instance = new Vue({
    ...module.exports.default,
    render: new Function(compiled.render),
    staticRenderFns: compiled.staticRenderFns.map((render) => new Function(render)),
    beforeCreate() {
      this.$route = { query: { type, id: "report-27" } }
      this.$store = { getters: { roleInfo: { name: "测试账号" } } }
      this.$global = { successCode: 200 }
      this.$formatTime = () => "00:00:16"
      this.$formatDate2 = () => "2026-10-09"
    },
  })
  return {
    instance,
    requestedIds,
    setReport(report) { instance.reportData = { record_result: [], ...report } },
    setResponse(promise) { response = promise },
  }
}

function vnodeText(node) {
  return node.text || (node.children || []).map(vnodeText).join("")
}

function findVNode(node, predicate) {
  if (predicate(node)) return node
  for (const child of node.children || []) {
    const found = findVNode(child, predicate)
    if (found) return found
  }
}

function basicRows(instance) {
  const info = findVNode(instance._render(), (node) => node.data && node.data.staticClass === "user_info")
  assert.ok(info, "basic information must be rendered")
  return info.children.filter((node) => node.tag === "div")
}

function assertWarning(instance, expectedText, expectedColor) {
  const rows = basicRows(instance)
  assert.equal(rows.length, 5, "assessment warning belongs in the fifth basic information row")
  assert.ok(vnodeText(rows[4]).includes("是否预警"))
  const status = findVNode(rows[4], (node) => node.tag === "i")
  assert.ok(status, "warning status must use the existing basic information value element")
  assert.equal(vnodeText(status).trim(), expectedText)
  assert.equal(status.data.style.color, expectedColor)
}

test("numeric and string warning counts determine the current report status", () => {
  const harness = createHarness()
  for (const count of [1, 2, "1", "2", " 2 "]) {
    harness.setReport({ gauge_warning: count, is_warning: 0, warning_records: [{ is_clear: 1 }] })
    assertWarning(harness.instance, "是", "#ff7875")
  }
  for (const count of [0, "0"]) {
    harness.setReport({ gauge_warning: count, is_warning: 1, warning_records: [] })
    assertWarning(harness.instance, "否", "#c2efff")
  }
})

test("only a nonempty list with every warning cleared shows the cleared state", () => {
  const harness = createHarness()
  for (const count of [0, "0"]) {
    harness.setReport({ gauge_warning: count, is_warning: 1, warning_records: [{ is_clear: 1 }, { is_clear: "1" }] })
    assertWarning(harness.instance, "否（已解除）", "#40a9ff")
  }
  for (const records of [undefined, [], {}, [{ is_clear: 1 }, { is_clear: 0 }], [{ is_clear: true }], [null], [{}]]) {
    harness.setReport({ gauge_warning: 0, is_warning: 1, warning_records: records })
    assertWarning(harness.instance, "否", "#c2efff")
  }
})

test("initial, missing and invalid warning counts stay unknown despite historical flags", () => {
  const harness = createHarness()
  assertWarning(harness.instance, "--", "#bfbfbf")
  for (const count of [undefined, null, "", "   ", "invalid", -1, "-1", 0.5, "1.5", NaN, Infinity, "Infinity", false, true, [], {}]) {
    harness.setReport({ gauge_warning: count, is_warning: 1, warning_records: [{ is_clear: 1 }] })
    assertWarning(harness.instance, "--", "#bfbfbf")
  }
})

test("refreshing another report clears the old warning while loading and uses the report ID", async () => {
  const harness = createHarness()
  harness.setReport({ gauge_warning: 1, test_id: "gauge-3", report_id: "report-27" })
  assertWarning(harness.instance, "是", "#ff7875")
  let resolveResponse
  harness.setResponse(new Promise((resolve) => { resolveResponse = resolve }))
  harness.instance.$route.query.id = "report-28"
  const pending = harness.instance.getGaugeInfo()
  assert.equal(harness.instance.detailsLoading, true)
  assert.equal(harness.instance.reportData, "")
  assertWarning(harness.instance, "--", "#bfbfbf")
  resolveResponse({ data: { code: 200, data: {
    record_result: [], gauge_warning: "0", is_warning: 1,
    warning_records: [{ is_clear: "1" }], test_id: "gauge-3", report_id: "report-28",
  } } })
  await pending
  assert.deepEqual(harness.requestedIds, ["report-28"])
  assert.equal(harness.instance.detailsLoading, false)
  assertWarning(harness.instance, "否（已解除）", "#40a9ff")
})

test("a failed detail refresh stays unknown instead of displaying no warning", async () => {
  for (const failure of [() => Promise.reject(new Error("request failed")), () => Promise.resolve({ data: { code: 500 } })]) {
    const harness = createHarness()
    harness.setReport({ gauge_warning: 0 })
    assertWarning(harness.instance, "否", "#c2efff")
    harness.setResponse(failure())
    await harness.instance.getGaugeInfo()
    assert.equal(harness.instance.detailsLoading, false)
    assertWarning(harness.instance, "--", "#bfbfbf")
  }
})

test("training, detection and other route types do not display the assessment warning row", () => {
  for (const type of ["心理训练", "检测报告", undefined, "", new String("测评报告")]) {
    const harness = createHarness(type)
    harness.instance.$route.query.type = type
    harness.setReport({ gauge_warning: 2 })
    const rows = basicRows(harness.instance)
    assert.equal(rows.length, 4)
    assert.equal(rows.map(vnodeText).join("").includes("是否预警"), false)
  }
})
