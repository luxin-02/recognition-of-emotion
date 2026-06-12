<template>
  <div class="article">
    <div class="module_title">
      <!-- {{ $route.meta.title }} -->
      文章详情
    </div>

    <div class="class_list">
      <div
        :class="{ active: currentClass == item.id }"
        v-for="(item, index) in classList"
        :key="index"
        @click="
          () => {
            currentClass = item.id
            getList()
          }
        "
      >
        {{ item.title }}
      </div>
    </div>

    <div class="item_list" v-loading="listLoading">
      <div
        v-for="(item, index) in articleList.list"
        :key="index"
        @click="toDetails(item.id)"
      >
        <img :src="$ip + item.cover" />
        <div>
          <div class="item_title">{{ item.title }}</div>
          <p>上传用户：{{ item.author }}</p>
          <!-- <p>所属单位：{{item.unit}}</p> -->
          <p>上传时间：{{ item.add_time }}</p>
        </div>
      </div>
    </div>

    <div class="pre_next">
      <div class="pre" @click="pre"></div>
      <div class="next" @click="next"></div>
    </div>
  </div>
</template>

<script>
import {
  articleFrontApiList,
  articleBehindApiClassList,
} from "@/server/api/article"
export default {
  data() {
    return {
      listLoading: false,
      articleList: { list: [], total: 0, page: 1 },
      classList: [],
      currentClass: "",
    }
  },
  created() {},
  mounted() {
    this.getClass()
  },
  methods: {
    async getClass() {
      const { data } = await articleBehindApiClassList()
      if (data.code == this.$global.successCode) {
        this.classList = data.data
        console.log(this.classList)
        this.currentClass = this.classList[0].id
        this.getList()
      }
    },
    async getList(page) {
      if (page) {
        this.articleList.page = page
      }
      try {
        this.listLoading = true
        const { data } = await articleFrontApiList({
          page: this.articleList.page,
          page_size: 6,
          is_show: 1,
          art_class_id: this.currentClass,
        })
        if (data.code == this.$global.successCode) {
          this.articleList.list = data.data.data
          this.articleList.total = data.data.total
          console.log(data.data.data)
        }
      } catch (error) {
      } finally {
        this.listLoading = false
      }
    },
    toDetails(id) {
      this.$router.push({
        path: "/article/detail",
        query: {
          id: id,
        },
      })
    },
    pre() {
      if (this.articleList.page > 1) {
        this.getList(this.articleList.page - 1)
      }
    },
    next() {
      if (this.articleList.page < this.articleList.total / 6) {
        this.getList(this.articleList.page + 1)
      }
    },
  },
  beforeDestroy() {},
}
</script>

<style scoped lang="scss">
.article {
  width: 1580px;
  height: 872px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-image: url(@/assets/img/front/index/kuang.png);
  background-size: 100% 100%;
  z-index: 2;

  .module_title {
    position: absolute;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 32px;
    height: 33px;
    line-height: 33px;
    font-family: "ziyuanyuanti600W";
    color: #fff;
    background: linear-gradient(0deg, #85a7ff 0%, #ffffff 100%);
    -webkit-background-clip: text;
    color: transparent;
  }

  .class_list {
    width: 1200px;
    height: 40px;
    position: absolute;
    top: 190px;
    left: 215px;
    font-size: 18px;
    font-family: "ziyuanyuanti400W";
    font-weight: 400;
    color: #fff;
    display: flex;
    overflow-x: auto; // 水平滚动
    overflow-y: hidden;
    &::-webkit-scrollbar {
      display: none; // 隐藏滚动条
    }
    > div {
      flex-shrink: 0;
      max-width: 200px;
      height: 40px;
      background: #123e73;
      border-radius: 20px;
      text-align: center;
      line-height: 40px;
      margin-right: 10px;
      padding: 0 20px;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis; // 超出显示省略号
      white-space: nowrap;
      &.active {
        background: #0080ff;
      }
    }
  }

  .item_list {
    width: 1170px;
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    top: 260px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    > div {
      width: 550px;
      height: 150px;
      background: #071325;
      border: 1px solid #c2efff36;
      border-radius: 6px;
      margin: 0 30px 15px 0;
      padding: 15px;
      box-sizing: border-box;
      display: flex;
      > img {
        width: 213px;
        height: 120px;
        margin-right: 20px;
        border-radius: 5px;
      }
      > div {
        > .item_title {
          font-size: 16px;
          font-family: "ziyuanyuanti500W";
          font-weight: 500;
          color: #fff;
          margin-top: 10px;
          height: 40px;
          line-height: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 2; /* 显示的行数 */
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        > p {
          color: #c6c8cd;
          font-size: 12px;
        }
      }
    }
  }

  .pre_next {
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 400px;
    padding: 0 80px;
    box-sizing: border-box;
    > .pre,
    .next {
      width: 76px;
      height: 76px;
      background-size: 100% 100%;
      &.pre {
        background-image: url(@/assets/img/front/article/pre.png);
      }
      &.next {
        background-image: url(@/assets/img/front/article/next.png);
      }
    }
  }
}
</style>
