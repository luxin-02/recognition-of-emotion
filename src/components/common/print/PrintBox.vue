<template>
  <teleport to="body">
    <div>
      <div style="margin-top:100%"></div>
      <div class="printBox_print" ref="printBox" id="printBox">
        <slot></slot>
        <div class="footer" style="color: #666; text-align: center; width: 100%;bottom: 0">
          *此报告仅供参考，不作为诊断依据 。
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（负责人签字）
        </div>
      </div>


    </div>
  </teleport>
</template>
<script>
import {Print} from './print'

export default {
  name: 'printBox',
  methods: {
    printWord(title) {
      Print(this.$refs.printBox, {title: title ? title : '文档'})
    },
  },

}

</script>
<style lang="less" scoped>
</style>