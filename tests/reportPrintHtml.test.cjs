const assert = require("node:assert/strict")
const { test } = require("node:test")
const fs = require("node:fs")
const path = require("node:path")
const vm = require("node:vm")
const Vue = require("vue")
const compiler = require("vue-template-compiler")
const { transformSync } = require("@babel/core")

function createPrint(reportData, type = "测评报告", file = "print.vue") {
  const filename = path.resolve(__dirname, "../src/views/front/views/report", file)
  const parsed = compiler.parseComponent(fs.readFileSync(filename, "utf8"))
  const compiled = compiler.compile(parsed.template.content)
  assert.deepEqual(compiled.errors, [])
  const { code } = transformSync(parsed.script.content, {
    filename, configFile: false, babelrc: false,
    plugins: ["@babel/plugin-transform-modules-commonjs"],
  })
  const module = { exports: {} }
  vm.runInNewContext(code, {
    module, exports: module.exports,
    require: () => ({ name: "print-box" }),
    setTimeout: (callback) => callback(),
  }, { filename })
  return new Vue({
    ...module.exports.default,
    propsData: { reportData, type, chartImg: "radar-image", emotionChartImg1: "rose-image", emotionChartImg2: "bar-image" },
    render: new Function(compiled.render),
    staticRenderFns: compiled.staticRenderFns.map((render) => new Function(render)),
    beforeCreate() {
      this.$store = { getters: { roleInfo: { name: "测试账号" } } }
      this.$formatTime = () => "00:00:16"
      this.$formatDate2 = () => "2026-10-10"
    },
  })
}

function children(node) {
  return node.children || (node.componentOptions && node.componentOptions.children) || []
}

function nodes(node) {
  return [node, ...children(node).flatMap(nodes)]
}

function text(node) {
  return node.text || children(node).map(text).join("")
}

function result(overrides = {}) {
  return {
    gradeName: "总分", scores: 50, prop: 50,
    degree: "<p><strong>结果：中间型</strong></p>",
    result: "<p>诊断说明</p><ul><li>你喜欢独处</li></ul>",
    ...overrides,
  }
}

function assertRichText(root, value) {
  const container = nodes(root).find((node) => node.data && node.data.domProps && node.data.domProps.innerHTML === value)
  assert.ok(container, "print content must retain the supplied rich text as DOM innerHTML")
  assert.equal(container.tag, "div", "paragraph HTML needs a block container")
  assert.equal(text(root).includes(value), false, "HTML must not become literal text in the print content")
}

function assertPrintCall(instance, reportData) {
  const original = JSON.stringify(reportData)
  const titles = []
  instance.$refs.print_box = { printWord: (title) => titles.push(title) }
  instance.$refs.targetHtml = { querySelectorAll: () => [] }
  instance.print("测试用户的报告详情")
  assert.deepEqual(titles, ["测试用户的报告详情"])
  assert.equal(instance.reportData, reportData)
  assert.equal(JSON.stringify(reportData), original)
}

test("a single-result assessment prints diagnostic HTML without literal tags or a chart", () => {
  const item = result()
  const data = { nickname: "测试用户", record_result: [item] }
  const instance = createPrint(data)
  const root = instance._render()
  assertRichText(root, item.degree)
  assertRichText(root, item.result)
  assert.equal(nodes(root).some((node) => node.tag === "img" && node.data.staticClass === "radarMap"), false)
  assert.ok(text(root).includes("说明："))
  assert.ok(text(root).includes("得分：50 , 分数占比：50%"))
  assertPrintCall(instance, data)
})

test("a multi-result assessment retains its chart and every rich diagnostic section", () => {
  const items = [result(), result({ gradeName: "躯体化", degree: "<p>程度：较低</p>", result: "<p>第二项说明</p>" })]
  const root = createPrint({ record_result: items })._render()
  const chart = nodes(root).find((node) => node.tag === "img" && node.data.staticClass === "radarMap")
  assert.ok(chart)
  assert.equal(chart.data.attrs.src, "radar-image")
  for (const item of items) {
    assertRichText(root, item.degree)
    assertRichText(root, item.result)
  }
})

test("plain diagnostic text remains present in the printed DOM content", () => {
  const item = result({ degree: "结果：中间型", result: "你喜欢独处，享受独处的时光。" })
  const root = createPrint({ record_result: [item] })._render()
  assertRichText(root, item.degree)
  assertRichText(root, item.result)
})

test("psychological training retains its result and suggestion rich text", () => {
  const data = { result: "<p>训练结果</p>", suggest: "<p>训练建议</p>" }
  const instance = createPrint(data, "心理训练")
  const root = instance._render()
  assertRichText(root, data.result)
  assertRichText(root, data.suggest)
  assert.ok(text(root).includes("心理体验分析报告"))
  assertPrintCall(instance, data)
})

test("detection keeps its independent print component, chart images and print call", () => {
  const data = {
    negative: { name: ["焦虑"], value: [20], level: ["正常"], result: ["情绪平稳"] },
    image_analysis: { name: ["微笑", "心理", "负面", "正面"], value: [70, 80, 20, 60], level: ["正常", "正常", "正常", "正常"], result: [] },
  }
  const instance = createPrint(data, "检测报告", "emotionPrint.vue")
  const root = instance._render()
  const chartImages = nodes(root).filter((node) => node.tag === "img" && node.data.attrs.id)
  assert.deepEqual(chartImages.map((node) => [node.data.attrs.id, node.data.attrs.src]), [
    ["radarMap", "radar-image"], ["roseChart", "rose-image"], ["barGraph", "bar-image"],
  ])
  assert.ok(text(root).includes("情绪检测分析报告"))
  assert.ok(text(root).includes("情绪平稳"))
  assertPrintCall(instance, data)
})
