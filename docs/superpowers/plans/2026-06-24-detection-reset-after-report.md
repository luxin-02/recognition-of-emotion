# Detection Report Reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reset the detection page's score and chart display data after a report is sent successfully while preserving access to that report.

**Architecture:** Keep reset ownership in the detection parent page, where all chart props and summary data already live. A dedicated method restores fresh copies of the initial values; the existing child watchers update ECharts, while `detailsId` remains untouched for report navigation.

**Tech Stack:** Vue 2 Options API, ECharts 5, Vue CLI

---

### Task 1: Reset detection display state after a successful report submission

**Files:**
- Modify: `src/views/front/views/detection/index.vue`
- Verify: `src/views/front/views/detection/index.vue`

- [ ] **Step 1: Add a focused reset method**

Add this method inside the existing `methods` object, next to the detection event handlers:

```js
resetDetectionData() {
  this.LeftTopValueData = [0, 0, 0, 0, 0, 0, 0]
  this.leftBottomValueData = [0, 0, 0, 0, 0, 0, 0, 0]
  this.rightTopValueData = [
    { value: 0, name: "满足指数" },
    { value: 0, name: "放松指数" },
    { value: 0, name: "兴奋指数" },
    { value: 0, name: "乐观指数" },
    { value: 0, name: "自信指数" },
  ]
  this.psychologyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  this.positiveData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  this.negativeData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  this.analysisData = ""
},
```

Use the exact Chinese labels already present in `data()`; do not change surrounding labels, formatting, or component code.

- [ ] **Step 2: Invoke the reset only on success**

In the successful `addSmileAssess` branch, preserve the returned report ID before resetting:

```js
if (data.code == this.$global.successCode) {
  this.$myMessage({
    type: "font-success",
    message: data.msg,
  })
  this.detailsId = data.data.id
  this.resetDetectionData()
}
```

Do not add reset behavior outside this success branch. This keeps current values available when the request throws or returns a non-success code.

- [ ] **Step 3: Run lint for the modified page**

Run `npx eslint src/views/front/views/detection/index.vue`.

Expected: exit code `0`. If existing lint errors appear outside the changed lines, report them without refactoring unrelated code.

- [ ] **Step 4: Run the production build**

Run `npm run build`.

Expected: exit code `0` and a completed Vue production build. Existing non-fatal warnings may be reported but do not require unrelated cleanup.

- [ ] **Step 5: Review the surgical diff**

Run `git diff --check -- src/views/front/views/detection/index.vue` and `git diff -- src/views/front/views/detection/index.vue`.

Expected: no whitespace errors; the diff contains only the reset method and its success-branch invocation. Confirm `detailsId` is assigned and never reset.

- [ ] **Step 6: Commit the implementation**

Run `git add -- src/views/front/views/detection/index.vue` followed by `git commit -m "fix: reset detection charts after report"`.

Expected: one commit containing only `src/views/front/views/detection/index.vue`.
