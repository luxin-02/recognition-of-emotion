# Guest Detection and Report Access Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent guests from starting emotion detection or entering the report center from the home page, with the existing “游客暂无权限” message.

**Architecture:** Add local guards at the two requested click boundaries using the existing Vuex `isGuest` getter and `$myMessage.error` API. Return before camera startup or route navigation, leaving all non-guest behavior unchanged.

**Tech Stack:** Vue 2, Vuex, Vue Router, Vue CLI

---

### Task 1: Guard emotion detection startup

**Files:**
- Modify: `src/views/front/views/detection/components/middle.vue:172-178`

- [ ] **Step 1: Confirm the unguarded behavior**

Verify that `startCheck()` currently calls `openCamera()` without checking `$store.getters.isGuest`. A guest click therefore reaches camera startup.

- [ ] **Step 2: Add the guest guard**

Change `startCheck()` to:

```js
startCheck() {
  if (this.$store.getters.isGuest) {
    this.$myMessage.error("游客暂无权限")
    return
  }

  try {
    this.openCamera()
  } catch (e) {
    console.log(e)
  }
},
```

- [ ] **Step 3: Verify the click paths manually**

Verify that a guest receives “游客暂无权限” and camera startup does not run. Verify that a normal user still starts detection.

### Task 2: Guard the home report-center entry

**Files:**
- Modify: `src/views/front/index/Home.vue:71`
- Modify: `src/views/front/index/Home.vue:148-166`

- [ ] **Step 1: Replace the inline report navigation**

Change the report-center block to:

```vue
<div @click="toReport"><i>报告中心</i></div>
```

- [ ] **Step 2: Add the guarded navigation method**

Add this method inside the existing `methods` object:

```js
toReport() {
  if (this.$store.getters.isGuest) {
    this.$myMessage.error("游客暂无权限")
    return
  }

  this.$router.push("/report")
},
```

- [ ] **Step 3: Verify the navigation paths manually**

Verify that a guest receives “游客暂无权限” and remains on `/home`. Verify that a normal user reaches `/report`.

### Task 3: Validate and commit

**Files:**
- Verify: `src/views/front/views/detection/components/middle.vue`
- Verify: `src/views/front/index/Home.vue`

- [ ] **Step 1: Run the production build**

Run: `npm run build`

Expected: exit code 0 and a successful Vue production build. Existing unrelated warnings may remain.

- [ ] **Step 2: Review the focused diff**

Run:

```bash
git diff --check -- src/views/front/views/detection/components/middle.vue src/views/front/index/Home.vue
git diff -- src/views/front/views/detection/components/middle.vue src/views/front/index/Home.vue
```

Expected: no whitespace errors; the diff contains only the two guest guards and the report click-handler replacement.

- [ ] **Step 3: Commit only the implementation files**

```bash
git add src/views/front/views/detection/components/middle.vue src/views/front/index/Home.vue
git commit -m "fix: restrict guest detection and report access"
```
