<template>
  <div class="box">
    <keep-alive>
      <router-view v-if="keepAlive" />
    </keep-alive>
    <router-view v-if="!keepAlive" />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    keepAlive() {
      return this.$route.meta && this.$route.meta.keepAlive;
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
}
</style>
