# Guest Home Department Guard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent the guest home page from crashing when `userInfo.depts` is absent, while hiding the department row for guests.

**Architecture:** Keep the fix local to the home-page template. Guard the department row with an array-and-length check, then render the first department only inside that guarded block.

**Tech Stack:** Vue 2 template, Vuex, Vue CLI

---

### Task 1: Guard the home-page department row

**Files:**
- Modify: `src/views/front/index/Home.vue:26-28`

- [ ] **Step 1: Confirm the failing render path**

Inspect the current template and verify it directly evaluates:

```vue
<div v-if="$store.getters.userInfo.depts.length">
```

With guest data that has no `depts` property, the expected result is `TypeError: Cannot read properties of undefined (reading 'length')`.

- [ ] **Step 2: Add the minimal template guard**

Replace the department block with:

```vue
<div
  v-if="
    Array.isArray($store.getters.userInfo.depts) &&
    $store.getters.userInfo.depts.length
  "
>
  部门：{{ $store.getters.userInfo.depts[0].class_name }}
</div>
```

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: exit code 0 and a successful Vue production build.

- [ ] **Step 4: Verify both login cases manually**

Run: `npm run serve`

Verify:

- Guest login reaches `/home` without a Vue render error and shows no department row.
- A normal user with a non-empty `depts` array still sees the first department name.

- [ ] **Step 5: Commit only the implementation file**

```bash
git add src/views/front/index/Home.vue
git commit -m "fix: guard guest home department data"
```
