# Music Default First Track Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the music page play the first song in the current visible list when the play/pause control is clicked before any song has been selected.

**Architecture:** Keep the behavior inside the existing music page component and reuse `musicBtn`, which already selects, loads, highlights, and starts a song. Preserve the existing pause/resume branch and return safely when the current list is empty.

**Tech Stack:** Vue 2 single-file components, JavaScript, Vue CLI

---

### Task 1: Default the play control to the first visible song

**Files:**
- Modify: `src/views/front/views/music/index.vue:461`

- [ ] **Step 1: Record the current build baseline**

Run: `npm run build`

Expected: The existing project either builds successfully, or any pre-existing failure is recorded before changing the component.

- [ ] **Step 2: Add the minimal empty-selection branch**

Replace the start of `playMusic` with this implementation:

```js
playMusic() {
  if (!this.currentMusic.music_url) {
    if (this.musicList.list.length > 0) {
      this.musicBtn(this.musicList.list[0], 0)
    }
    return
  }
  if (this.playPause) {
    this.$refs.audioref.pause()
    this.playPause = false
  } else {
    this.$refs.audioref.play()
    this.playPause = true
  }
},
```

This selects only the first item in the current visible list. An empty list returns without indexing `undefined`, while the existing selected-song pause/resume behavior remains unchanged.

- [ ] **Step 3: Inspect the focused diff**

Run: `git diff -- src/views/front/views/music/index.vue`

Expected: The only functional change is the new non-empty-list branch inside `playMusic`; no adjacent formatting or unrelated logic changes appear.

- [ ] **Step 4: Verify the production build**

Run: `npm run build`

Expected: Exit code `0` and a successful Vue production build. If Step 1 exposed a pre-existing build failure, confirm this change introduces no new error involving `src/views/front/views/music/index.vue`.

- [ ] **Step 5: Manually verify the three states**

Run: `npm run serve`

Expected:

1. Open `/music`, wait for a non-empty list, and click the play/pause control without selecting a song; the first visible song becomes active and plays.
2. Pause and resume that song with the same control; both actions still work.
3. Use a search with no results and click the control; no song starts and no console error occurs.

- [ ] **Step 6: Commit the focused implementation**

```bash
git add src/views/front/views/music/index.vue
git commit -m "fix: play first music track by default"
```
