# Report Index Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify the report list page logic while preserving the current UI and behavior.

**Architecture:** Keep the existing Vue single-file component. Add a small report type configuration layer and shared helpers inside `src/views/front/views/report/index.vue` to remove repeated branching and fix known inconsistent branches.

**Tech Stack:** Vue 2, Element UI, ECharts, existing project API modules.

---

### Task 1: Refactor Report Type Dispatch

**Files:**
- Modify: `src/views/front/views/report/index.vue`

- [ ] Add constants for the three report type values in the component module.
- [ ] Add `currentReportConfig`, `isScaleReport`, `isDetectionReport`, and `maxPage` computed values.
- [ ] Replace repeated list dispatch branches with one `loadReportList(page)` method.
- [ ] Use the same dispatcher from `watch.reportType`, `searchBtn`, `changePage`, and `activated`.

### Task 2: Fix Export/Data Branch Issues

**Files:**
- Modify: `src/views/front/views/report/index.vue`

- [ ] Fix the training report template branch to match the actual psychological training report type.
- [ ] Remove the duplicate `xlzs` key by preserving the intended four index values under distinct keys.
- [ ] Build export-only `recommend` data without mutating `this.infoData`.
- [ ] Remove page-local debug logging and unused data entries introduced by older iterations.

### Task 3: Verify

**Files:**
- Verify: project build output

- [ ] Run `npm run build`.
- [ ] Confirm the build completes successfully.
