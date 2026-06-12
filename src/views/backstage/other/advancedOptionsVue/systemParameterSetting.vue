<template>
  <div class="system_parameter_setting">
    <div class="title_box">
        测评功能设置
    </div>
    <div class="content">
        <div class="list">
            <span>测评模式：</span>
            <div class="select">
                <div class="i" @click="isSelect = '集成模式'">
                    <img :src="isSelect == '集成模式' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>集成模式</span>
                </div>
                <div class="i" @click="isSelect = '分流模式'">
                    <img :src="isSelect == '分流模式' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>分流模式</span>
                </div>
            </div>
        </div>
        <div class="list">
            <span>是否允许续评：</span>
            <div class="select">
                <div class="i" @click="isSelect = '允许'">
                    <img :src="isSelect == '允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>允许</span>
                </div>
                <div class="i" @click="isSelect = '不允许'">
                    <img :src="isSelect == '不允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>不允许</span>
                </div>
            </div>
        </div>
        <div class="list">
            <span>是否允许重做：</span>
            <div class="select">
                <div class="i" @click="isSelect = '允许'">
                    <img :src="isSelect == '允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>允许</span>
                </div>
                <div class="i" @click="isSelect = '不允许'">
                    <img :src="isSelect == '不允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>不允许</span>
                </div>
            </div>
        </div>
        <div class="list">
            <span>报告样式：</span>
            <div class="select">
                <div class="i" @click="isSelect = '允许'">
                    <img :src="isSelect == '允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>指导模式（非医疗）</span>
                </div>
                <div class="i" @click="isSelect = '不允许'">
                    <img :src="isSelect == '不允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>诊断模式（医疗）</span>
                </div>
            </div>
        </div>
        <div class="list">
            <span>报告导出格式：</span>
            <div class="select">
                <div class="i" @click="isSelect = '允许'">
                    <img :src="isSelect == '允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>word格式</span>
                </div>
                <div class="i" @click="isSelect = '不允许'">
                    <img :src="isSelect == '不允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>PDF格式</span>
                </div>
            </div>
        </div>
        <div class="list">
            <span>报告字体大小：</span>
            <div class="select">
                <div class="i" @click="isSelect = '允许'">
                    <img :src="isSelect == '允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>12号</span>
                </div>
                <div class="i" @click="isSelect = '不允许'">
                    <img :src="isSelect == '不允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>14号</span>
                </div>
                <div class="i" @click="isSelect = '不允许'">
                    <img :src="isSelect == '不允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>16号</span>
                </div>
                <div class="i" @click="isSelect = '不允许'">
                    <img :src="isSelect == '不允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>18号</span>
                </div>
            </div>
        </div>
        <div class="list">
            <span>报告打印纸张：</span>
            <div class="select">
                <div class="i" @click="isSelect = '允许'">
                    <img :src="isSelect == '允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>A1</span>
                </div>
                <div class="i" @click="isSelect = '不允许'">
                    <img :src="isSelect == '不允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>A2</span>
                </div>
                <div class="i" @click="isSelect = '不允许'">
                    <img :src="isSelect == '不允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>A3</span>
                </div>
                <div class="i" @click="isSelect = '不允许'">
                    <img :src="isSelect == '不允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>A4</span>
                </div>
                <div class="i" @click="isSelect = '不允许'">
                    <img :src="isSelect == '不允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>A5</span>
                </div>
                <div class="i" @click="isSelect = '不允许'">
                    <img :src="isSelect == '不允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>A6</span>
                </div>
            </div>
        </div>
        <div class="list">
            <span>报告显示用户信息：</span>
            <div class="select">
                <div class="i" @click="isSelect = '允许'">
                    <img :src="isSelect == '允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>开启</span>
                </div>
                <div class="i" @click="isSelect = '不允许'">
                    <img :src="isSelect == '不允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>关闭</span>
                </div>
            </div>
        </div>
        <div class="list">
            <span>开启测评同意书：</span>
            <div class="select">
                <div class="i" @click="isSelect = '允许'">
                    <img :src="isSelect == '允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>开启</span>
                </div>
                <div class="i" @click="isSelect = '不允许'">
                    <img :src="isSelect == '不允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>关闭</span>
                </div>
            </div>
        </div>
        <div class="list">
            <span>用户登录方式：</span>
            <div class="select">
                <div class="i" @click="isSelect = '允许'">
                    <img :src="isSelect == '允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>开启账号登录</span>
                </div>
                <div class="i" @click="isSelect = '不允许'">
                    <img :src="isSelect == '不允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>开启扫码登录</span>
                </div>
                <div class="i" @click="isSelect = '不允许'">
                    <img :src="isSelect == '不允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>开启刷脸登录</span>
                </div>
                <div class="i" @click="isSelect = '不允许'">
                    <img :src="isSelect == '不允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>开启指纹登录</span>
                </div>
                <div class="i" @click="isSelect = '不允许'">
                    <img :src="isSelect == '不允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>开启感应登录</span>
                </div>
                <div class="i" @click="isSelect = '不允许'">
                    <img :src="isSelect == '不允许' ? require('./images/check.png') : require('./images/unCheck.png')" alt="">
                    <span>开启游客登录</span>
                </div>
            </div>
        </div>
    </div>
    <button>保存</button>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        isSelect: '集成模式',
      };
    },

    computed: {},

    watch: {},

    methods: {},

    mounted() {},

    created() {},

  }

</script>
<style lang='less' scoped>
.system_parameter_setting{
    width: 1363px;
    height: 100%;
    box-sizing: border-box;
    .title_box{
        height: 50px;
        width:100%;
        background: #eeeeee;
        box-sizing: border-box;
        padding-left: 20px;
        font-size: 16px;
        color: #333333;
        line-height:50px;
        
    }
    span{
        display:block;
        font-size: 14px;
        color: #333333;
    }
    img{
        display: block;
        width: 14px;
        height: 14px;
    }
    .content{
        padding: 40px 0 0 20px;
        box-sizing: border-box;
        .list{
            display: flex;
            align-items: center;
            height: 14px;
            margin-bottom: 35px;
            >span{
                width: 167px;
            }
            .select{
                display: flex;
                align-items: center;

                .i{
                    display: flex;
                    align-items: center;
                    margin-right: 20px;
                    img{
                        margin-right: 9px;
                    }
                }
            }
            
        }
    }
    button{
      display: block;
      width: 1.8rem;
      height: 0.4rem;
      margin:  150px auto 0;
      background: #2e8ae6;
      border-radius: 0.06rem;
      font-size: 18px;
      color: #fff;
    }
}
</style>