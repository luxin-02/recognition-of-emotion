<template>
  <div class="page">
    <button
      class="button"
      :disabled="elPage <= 1"
      @click="$emit('change', 1)"
    >
      首页
    </button>
    <el-pagination
      :layout="`prev , pager , next,slot ${goPage ? ',jumper' : ''} `"
      :current-page.sync="elPage"
      @current-change="change"
      :total="total"
      :page-size="pageSize"
      prev-text="<"
      next-text=">"
      :pager-count="5"
    >
      <button
        class="button"
        :disabled="elPage == pageCount"
        @click="$emit('change', pageCount)"
      >
        尾页
      </button>
      <div class="text">跳转至</div>
      <input type="number" @keydown.enter="change" minlength="0" />
      <div class="text">页</div>
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: ["currentPage", "paeSizes", "goPage", "total", "pageSize"],
  data() {
    return {
      elPage: this.currentPage,
      totalPage: "",
    };
  },
  watch: {
    currentPage() {
      if (this.elPage == this.currentPage) return
      this.elPage = this.currentPage
    },
    elPage() {
      if (this.elPage == this.currentPage) return
      this.$emit("update:currentPage", this.elPage);
    },
    // 当按钮条数变化时把分页赋值成1
    pageCount(pageBtnChange) {
      this.$emit("change", 1);
    },
  },
  computed: {
    
    pageCount() {
      let total = this.total;
      let pageSize = this.pageSize;

      let count = parseInt(total / pageSize);
      if (count > 0) {
        total % pageSize == 0 ? "" : count++;
      }
      count = count > 0 ? count : 1;

      return count;
    },
  },
  methods: {
    // 分页改变执行的方法
    change(value) {
      if (value instanceof KeyboardEvent) {
        let page = parseInt(value.target.value);
        if (isNaN(page)) {
          return;
        }
        if (page <= 0) {
          value.target.value = 1;
          this.$emit("change", 1);
          return;
        }

        if (page == this.elPage) {
          return;
        }

        if (page > this.pageCount) {
          value.target.value = this.pageCount;
          this.$emit("change", this.pageCount);
          return;
        }

        this.$emit("change", page);
        return;
      }

      this.$emit("change", value);
    },
  },
  created() {},
};
</script>

<style lang="less" scoped>
.page {
  height: 0.4rem;
  display: flex;
  justify-content: space-between;
  position: relative;

  .top-enter {
    transform: translateY(-100%);
  }

  .top-enter-active {
    transition: 0.5s all;
  }

  .top-enter-to {
    transform: translateY(0%);
  }

  ::v-deep {
    button[disabled] {
      opacity: 0.8;
    }
  }

  .button {
    display: block;
    width: 60px;
    height: 40px;
    background: #2899fc;
    border-radius: 6px;
    font-size: 18px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: center;
    color: #ffffff;
    line-height: 40px;
    cursor: pointer;
    margin-right: 10px;
  }

  ::v-deep .el-pagination {
    padding: 0;
    display: flex;
    align-items: center;

    .text {
      font-size: 18px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: left;
      color: #ffffff;
      margin-right: 10px;
    }

    input {
      width: 80px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      font-size: 18px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: left;
      color: #ffffff;
      margin-right: 10px;

      &::-webkit-inner-spin-button {
        display: none;
      }
    }

    .total-page {
      font-size: 16px;
      color: #333333;
      margin-left: 10px;
      font-weight: 400;
    }

    .el-icon-arrow-left {
      width: 100%;
      height: 100%;
      //background: url('@/assets/img/backstage/left.png') no-repeat center;
      background-size: 0.16rem 0.25rem;

      &:before {
        content: "";
      }
    }

    .el-icon-arrow-right {
      width: 100%;
      height: 100%;
      //background: url('@/assets/img/backstage/right.png') no-repeat center;
      background-size: 0.16rem 0.25rem;

      &:before {
        content: "";
      }
    }

    .el-pagination__jump {
      height: 0.32rem;
      margin-left: 0.2rem;
      line-height: 0.32rem;
      color: #333333;

      .el-pagination__editor {
        width: 40px;
        height: 40px;
        background: #2899fc;
        border-radius: 6px;
        border: none;
        margin: 0 10px;

        .el-input__inner {
          border: 0;
          background-color: transparent;
          height: 0.32rem !important;
          transform: translateY(-1px);
        }
      }
    }

    .btn-prev,
    .btn-next {
      margin-right: 10px;
      width: 40px;
      height: 40px;
      background: #2899fc;
      border-radius: 6px;
      border: none;
      font-size: 18px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      padding: 0;
      color: #ffffff;

      text-align: center;
    }

    ul {
      li {
        width: 40px;
        height: 40px;
        background: #2899fc;
        border-radius: 6px;
        border: none;

        line-height: 40px;
        font-size: 18px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: left;
        color: #ffffff;
        font-weight: 400;
        text-align: center;

        margin-right: 10px;

        &:nth-child(1) {
          margin-left: 0px;
        }
      }

      .active {
        color: #ffff;
        background: #ff9500;
      }
    }
  }
}
</style>
