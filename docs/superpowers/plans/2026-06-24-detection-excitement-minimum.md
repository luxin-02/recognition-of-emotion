# Detection Excitement Minimum Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure every actual detection result gives the excitement index at least 5 points in both the chart and submitted report.

**Architecture:** Apply the minimum at the existing right-top calculation source, specifically its no-match fallback. The page and report already consume the same `rightTopValueData`, so no component or API changes are needed.

**Tech Stack:** JavaScript, Vue 2, Vue CLI

---

### Task 1: Set the excitement no-match fallback to 5

**Files:**
- Modify: `src/utils/emotionCalculation.js:185-190`
- Verify: `src/utils/emotionCalculation.js`

- [ ] **Step 1: Change only the right-top no-match fallback**

Replace the existing zero fallback in `getRightTopValueData` with:

```js
if (!matchedNames.length) {
  return {
    value: name === "兴奋指数" ? 5 : 0,
    name,
  }
}
```

This preserves zero fallbacks for the other four indicators. Do not change `formatRightTopScore`, because matched excitement data already produces at least 30 points.

- [ ] **Step 2: Run the production build**

Run `npm run build`.

Expected: exit code `0` and a completed Vue production build. Existing warnings may be reported without unrelated cleanup.

- [ ] **Step 3: Review the surgical diff**

Run `git diff --check -- src/utils/emotionCalculation.js` and `git diff -- src/utils/emotionCalculation.js`.

Expected: no whitespace errors, and exactly one value expression changes. Confirm initial/reset arrays in `src/views/front/views/detection/index.vue` remain unchanged at zero.

- [ ] **Step 4: Commit the implementation**

Run `git add -- src/utils/emotionCalculation.js` followed by `git commit -m "fix: set excitement minimum score"`.

Expected: one commit containing only `src/utils/emotionCalculation.js`.
