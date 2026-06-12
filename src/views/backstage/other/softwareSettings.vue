<template>
  <div class="software_settings">
    <div class="tab">
      <div @click="tab = 1" :class="tab == 1 ? 'addClass' : ''">单位信息设置</div>
      <div @click="tab = 2" :class="tab == 2 ? 'addClass' : ''">数据同步</div>
    </div>
    <div class="gd">
      <unitSettings v-if="tab == 1" v-auth="'/index/unitSettings'" />
      <dataSynchronous v-if="tab == 2" v-auth="'/index/dataSynchronous'" />
    </div>

  </div>
</template>

<script>
import unitSettings from './SoftwareSettingsVue/unitSettings.vue'
import dataSynchronous from './SoftwareSettingsVue/dataSynchronous.vue'
export default {
  data() {
    return {
      tab: 1,
    };
  },
  components: { unitSettings, dataSynchronous },
  computed: {},

  watch: {},

  methods: {},

  mounted() { },

  created() { },

}

</script>
<style lang='less' scoped>
.software_settings {
  width: 100%;
  height: 100%;
  position: relative;
  //padding-top: 24px;
  box-sizing: border-box;

  .tab {
    height: 60px;
    background: #eeeeee;
    padding: 5px 0 0 30px;
    box-sizing: border-box;
    display: flex;

    div {
      width: 200px;
      height: 55px;
      //background: #ffffff;
      //border-radius: 10px 10px 0px 0px;
      font-size: 16px;
      color: #333333;
      line-height: 55px;
      text-align: center;
      transition: all .3s;
    }

    .addClass {
      background: #ffffff;
      border-radius: 10px 10px 0px 0px;
    }
  }

  .gd {
    width: auto;
    height: 860px;
    overflow-y: scroll;
    box-sizing: border-box;
    //margin-bottom: 30px;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: #eee;
    }

    &::-webkit-scrollbar-track {
      width: 6px;
      background: transparent;
      border-radius: 4px;
    }
  }
}
</style>