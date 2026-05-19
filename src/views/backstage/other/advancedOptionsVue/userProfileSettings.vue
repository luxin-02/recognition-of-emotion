<template>
  <div class="user_profile_settings">
    <div class="title_box">
        用户基本资料可填写项设置
    </div>
    <div class="select">
      <div class="select_all" @click="isSelectAll = !isSelectAll">
        <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
        <span>全选此类</span>
      </div>
      <div class="list">
        <div class="row">
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>姓名</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>性别</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>年龄</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>民族</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>学历</span>
          </div>
        </div>
        <div class="row">
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>所在单位</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>所在部门</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>用户编号</span>
          </div>
          
          
        </div>
        <div class="row">
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>手机号</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>婚姻状况</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>籍贯</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>政治面貌</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>联系方式</span>
          </div>
        </div>
        <div class="row">
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>现居住址</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>职业</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>专长</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>兴趣爱好</span>
          </div>
          
        </div>
      </div>
    </div>
    <div class="title_box">
      用户家庭情况可填写项设置
    </div>
    <div class="select">
      <div class="select_all" @click="isSelectAll = !isSelectAll">
        <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
        <span>全选此类</span>
      </div>
      <div class="list">
        <div class="row">
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>家庭概况</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>家庭人口数</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>父母婚姻状况</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>家庭经济实力</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>有无兄弟姐妹</span>
          </div>
        </div>
        <div class="row">
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>家中排行</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>与父母关系</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>与其他人关系</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>是否烈士/优抚对象子女</span>
          </div>
          
        </div>
        
      </div>
    </div>
    <div class="title_box">
      用户健康状况可填写项设置
    </div>
    <div class="select">
      <div class="select_all" @click="isSelectAll = !isSelectAll">
        <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
        <span>全选此类</span>
      </div>
      <div class="list">
        <div class="row">
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>身高</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>体重</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>发育状况</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>身型评估</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>是否残疾</span>
          </div>
        </div>
        <div class="row">
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>左眼视力</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>右眼视力</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>听力</span>
          </div>
          
          
        </div>
        <div class="row">
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>吸烟情况</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>饮酒情况</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>饮酒种类</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>精神状态</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>是否嗜睡</span>
          </div>
        </div>
        <div class="row">
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>睡眠情况描述</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>是否丢三落四</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>是否有攻击行为</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>是否出现幻觉</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>是否容易悲观</span>
          </div>
        </div>
        <div class="row">
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>是否喜怒无常</span>
          </div>
          <div>
            <img :src="isSelectAll ? require('@/assets/img/backstage/other/cancel.png') : require('@/assets/img/backstage/other/unCancel.png')" alt="" >
            <span>其它状态勾选表</span>
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
        isSelectAll: false,
      };
    },

    computed: {},

    watch: {},

    methods: {
      

    },

    mounted() {},

    created() {},

  }

</script>
<style lang='less' scoped>
.user_profile_settings{
    width: 1363px;
    height: 919px;
    box-sizing: border-box;
    overflow-y: scroll;
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
        width: 18px;
        height: 18px;
    }
    .select{
      width: 1145px;
      height: auto;
      margin-bottom: 22px;
      .select_all{
        display: flex;
        align-items: center;
        margin: 20px 0 0 41px;
        box-sizing: border-box;
        img{
          margin-right: 20px;
        }
        
      }
      .list{
        margin: 20px 0 0 20px;
        .row{
          display: flex;
          flex-wrap: wrap;
          div{
            width: 220px;
            height: 40px;
            background: rgba(255, 255, 255, .8);
            border: 1px solid #dddddd;
            border-radius: 4px;
            display: flex;
            align-items: center;
            padding-left: 15px;
            box-sizing: border-box;
            margin: 0 0 8px 5px;
            img{
              margin-right: 20px;
            }
          }
        }
      }
    }
    button{
      display: block;
      width: 1.8rem;
      height: 0.4rem;
      margin:  40px auto;
      background: #2e8ae6;
      border-radius: 0.06rem;
      font-size: 18px;
      color: #fff;
    }
}
.user_profile_settings::-webkit-scrollbar {
    width: 6px;
}

.user_profile_settings::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: #eee;
}

.user_profile_settings::-webkit-scrollbar-track {
    width: 6px;
    background: transparent;
    border-radius: 2px;
}
</style>