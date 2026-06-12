<template>
  <div class="index-wrap">
    <div class="left-box">
      <div class="logo-box">
        <img class="logo" :src="$ip + sysInfo.logo">
        <p class="title">{{ sysInfo.name }}</p>
      </div>
      <div class="menu-box">

        <div class="menu-class" v-for="(item, index) in menuData.routes" :key="index">
          <p class="class" v-if="item.group_name">{{ item.group_name }}</p>
          <div class="item" v-for="route in item.children" :key="route.route">
            <div class="box" :class="{ 'on': route.route == menuData.nowPath }" @click="toUrl(route)">
              <img class="menu-icon" v-show="route.icon"
                :src="route.route == menuData.nowPath ? $ip + route.icon_over : $ip + route.icon">
              <span class="menu-title">{{ route.title }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="right-box">
      <div class="top-box">
        <div class="top-left_box">
          <div class="user-box">
            <img class="user-avatar" :src="userAvatar">
            <span>欢迎您 {{ userInfo.nickname }}！</span>
            <span class="exit-account" @click="logout()">[退出账号]</span>
          </div>
          <i class="divider"></i>
          <div class="return-user" @click="goUserHome()">
            <img src="@/assets/img/backstage/index/switch.png" />
            <span>切换用户端</span>
          </div>
          <i class="divider"></i>
        </div>
        <div class="top-right_box">
          <img class="btn" src="@/assets/img/backstage/index/btn-min.png" @click="gosmall()" />
          <img class="btn" src="@/assets/img/backstage/index/btn-max.png" @click="scaleSys()" />
          <img class="btn" src="@/assets/img/backstage/index/btn-close.png" @click="offSys()" />
        </div>
      </div>
      <div class="interface-box">
        <div class="info-box" v-if="!($route.meta && $route.meta.hideTopInfo)">
          <div class="info-box_left">
            <p class="box-title">{{ $route.meta.title }}</p>
            <p class="box-notes">{{ $route.meta.notes }}</p>
          </div>
          <div class="info-box_right">
            <span class="sys-name">{{ sysInfo.name }}</span>
          </div>
        </div>
        <div class="min-box">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {userBackApiLogout} from '@/server/api/user'
import {userGruntApiList} from '@/server/api/role'
import { mapGetters } from 'vuex';
// import menuList from './testMenuList.js';
export default {
  data() {
    return {
      menuData: {
        nowPath: '',
        routes: [
        ],
      },

    };
  },
  computed: {
    ...mapGetters(['userInfo', 'sysInfo', 'userAvatar'])
  },
  created() {
    this.menuData.nowPath = this.$route.path
    this.getSidebarData()
    // this.getTestSidebarData()
  },
  mounted() {
    
  },
  methods: {
    // 获取测试菜单
    getTestSidebarData() {
      this.menuData.routes = menuList
      this.menuData.routes = this.menuData.routes.filter(r => {
        return r.check != 0
      });
      this.menuData.routes.forEach(v => {
        v.children ? v.children = v.children.filter(v => v.check != 0) : '';
      })

      this.$store.commit('SET_MENU_LIST', this.menuData.routes)
    },
    // 获取导航栏
    async getSidebarData() {
      const { data } = await userGruntApiList({ username: this.userInfo.username });
      
      this.menuData.routes = data.data
      this.menuData.routes = this.menuData.routes.filter(r => {
        return r.check != 0
      });
      this.menuData.routes.forEach(v => {
        v.children ? v.children = v.children.filter(v => v.check != 0) : '';

      })

      this.$store.commit('SET_MENU_LIST', this.menuData.routes)
    
    },
    //退出账号
    logout() {
      this.$backstagePopup({
        title: '提示',
        content: '确认退出登录？',
        saveFoo: () => {
          userBackApiLogout()
          setTimeout(() => {
            localStorage.setItem('loginform', '');
            this.$store.commit('SET_USER_INFO', null);
            this.$router.push({ name: 'Login' });
          }, 200);
        },
      })
    },
    toUrl(itemObj) {
      console.log(itemObj);
      this.menuData.nowPath = itemObj.route
      this.$router.replace(itemObj.route);
    },
    /* handleOpen(key, keyPath) {
      if (key != this.$route.path) {
        this.$router.replace(key);
      }
    }, */
    //切换用户端
    goUserHome() {
      this.$router.replace({ name: 'Home' });
    },
    //关闭系统
    offSys() {
      this.$backstagePopup({
        title: '提示',
        content: '是否退出系统？',
        saveFoo: () => {
          if ('FingerprintObj' in window) {
            FingerprintObj.closeWindow()
          } else {
            this.$message('当前状态下，没有此功能！')
          }
        },
      })
    },
    // 窗口化
    scaleSys() {
      if ('FingerprintObj' in window) {
        FingerprintObj.min_max_click()
      } else {
        this.$message('当前状态下，没有此功能！')
      }
    },
    // 最小化
    gosmall() {
      if ('FingerprintObj' in window) {
        FingerprintObj.setMinSize()
      } else {
        this.$message('当前状态下，没有此功能！')
      }
    },
  },
};
</script>

<style scoped lang="scss">
.index-wrap {
  position: relative;
  display: flex;
  box-sizing: border-box;
  width: 1920px;
  height: 1080px;
  background: #F7F7F7;
  user-select: none;

  .left-box {
    width: 300px;
    height: 1080px;

    .logo-box {
      box-sizing: border-box;
      height: 100px;
      padding: 13px 20px 0;
      background: #EEEEEE;
      font-size: 0;

      .logo {
        width: 260px;
        height: 40px;
      }

      .title {
        text-align: left;
        color: #333333;
        font-size: 18px;
        font-weight: 400;
        line-height: 47px;
      }
    }

    .menu-box {
      overflow: auto;
      height: 963px;
      margin: 7px 0 0 0;
      padding: 10px 0 10px 10px;
      background: #EEEEEE;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        background-color: rgba(255, 255, 255, .4);
      }

      &::-webkit-scrollbar-thumb {
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        background-color: #008FCC;
      }

      .menu-class {
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;

        .class {
          height: 54px;
          padding-left: 20px;
          color: #888888;
          font-size: 16px;
          font-weight: 400;
          line-height: 54px;
        }

        .item {
          width: 280px;
          padding: 5px 0;
          cursor: pointer;

          .box {
            display: flex;
            align-items: center;
            height: 44px;
            padding-left: 20px;
            border-radius: 22px;
          }

          .on {
            background: #2E8AE6;

            .menu-title {
              color: #FFFFFF;
            }
          }
        }

        .menu-icon {
          width: 16px;
          height: 16px;
          margin-right: 20px;
        }

        .menu-title {
          color: #333333;
          font-size: 16px;
          font-weight: 400;
        }
      }
    }
  }

  .right-box {
    width: 1620px;
    height: 1080px;

    .top-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      background: #FFFFFF;
      -webkit-app-region: drag;
      .top-left_box {
        display: flex;
        align-items: center;
        height: 50px;
      }

      .user-box {
        display: flex;
        align-items: center;
        padding-left: 30px;
        color: #333333;
        font-size: 15px;

        .user-avatar {
          width: 36px;
          height: 36px;
          margin-right: 10px;
          vertical-align: middle;
          border-radius: 50%;
        }

        .exit-account {
          margin-left: 16px;
          cursor: pointer;
          color: #2E8AE6;
          -webkit-app-region: no-drag;
        }
      }

      .divider {
        display: inline-block;
        width: 1px;
        height: 20px;
        margin: 0 20px;
        background: #DCDCDC;
      }

      .return-user {
        display: flex;
        align-items: center;
        cursor: pointer;
        color: #333333;
        font-size: 0.15rem;
        -webkit-app-region: no-drag;
        img {
          width: 14px;
          height: 14px;
          margin-right: 9px;
        }

        span {}
      }

      .top-right_box {
        padding-right: 15px;
        font-size: 0;

        .btn {
          width: 24px;
          height: 24px;
          cursor: pointer;
          -webkit-app-region: no-drag;
        }

        .btn+.btn {
          margin-left: 15px;
        }
      }
    }

    .interface-box {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      height: 1023px;
      margin: 7px auto 0;
      padding: 0 30px;
      border-radius: 6px;
      background: #FFFFFF;

      .info-box {
        display: flex;
        justify-content: space-between;
        flex-shrink: 0;
        height: 103px;
        border-bottom: 1px solid #E6E6E6;
      }

      .info-box_left {
        .box-title {
          margin-top: 30px;
          color: #333333;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-size: 24px;
          font-weight: bold;
          line-height: 1;
        }

        .box-notes {
          margin-top: 15px;
          color: #31313180;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-size: 14px;
          font-weight: 400;
          line-height: 1;
        }
      }

      .info-box_right {
        position: relative;
        width: 938px;
        background-image: url(@/assets/img/backstage/index/text-box.png);
        background-size: 100% 100%;

        .sys-name {
          position: absolute;
          top: 40px;
          left: 240px;
          color: #FFFFFF;
          font-family: 书体坊赵九江钢笔行书;
          font-size: 24px;
          font-weight: bold;
        }
      }

      .min-box {
        flex-grow: 1;
        //height: 919px;
        height: auto;
      }
    }
  }

}
</style>