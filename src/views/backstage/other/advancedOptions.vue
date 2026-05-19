<template>
  <div class="advanced_options">
    <div class="left">
        <div @click="tab = 1" :class="{'addClass': tab == 1} ">用户资料设置</div>
        <div @click="tab = 2" :class="{'addClass': tab == 2} ">系统参数设置</div>
    </div>
    <userProfileSettings v-if="tab == 1"/>
    <systemParameterSetting v-if="tab == 2"/>
  </div>
</template>

<script>
import userProfileSettings from "./advancedOptionsVue/userProfileSettings.vue";
import systemParameterSetting from "./advancedOptionsVue/systemParameterSetting.vue";
  export default {
    data () {
      return {
        tab:1,
      };
    },
    components:{userProfileSettings,systemParameterSetting},
    computed: {},

    watch: {},

    methods: {},

    mounted() {},

    created() {},

  }

</script>
<style lang='less' scoped>
.advanced_options{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    .left{
        width: 197px;
        height: 100%;
        display: flex;
        flex-direction: column;
        border-right: 1px solid #e6e6e6;
        div{
            width: 179px;
            height: 40px;
            font-size: 14px;
            color: #333333;
            margin-top: 20px;
            text-align: center;
            line-height: 40px;
        }
        .addClass{
            background: #2e8ae6;
            color: #ffffff;
            border-radius: 6px;
        }
    }
}
</style>