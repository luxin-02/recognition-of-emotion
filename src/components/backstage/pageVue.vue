<template>
  <div class="page">
    <button @click="$emit('change', 1)">首页</button>
    <el-pagination
      :layout="`prev , pager , next,slot ${goPage ? ',jumper' : ''} `"
      :current-page="currentPage"
      @current-change="change"
      :total="total"
      :page-size="pageSize"
      prev-text="<<上一页"
      next-text="下一页>>"
      :pager-count="5"
    >
      <button class="tail" @click="$emit('change', Math.ceil(total / 10))">
        尾页
      </button>
      <span class="total-page">共{{ pageCount }}页</span>
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: ["currentPage", "paeSizes", "goPage", "total", "pageSize"],
  data() {
    return {
      totalPage: "",
    };
  },
  watch: {
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

  > button {
    display: block;
    width: 80px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #eeeeee;
    border-radius: 6px;
    font-size: 16px;
    color: #333333;
    margin-right: 10px;
    padding: 0 0.06rem;
  }

  /deep/ .el-pagination {
    width: 100%;
    height: 100%;
    padding: 0;
    display: flex;
    align-items: center;

    .tail {
      width: 80px;
      height: 40px;
      background: #eeeeee;
      border-radius: 6px;
      margin-left: 10px;
      font-size: 16px;
      color: #333333;
      font-weight: 400;
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
        width: 0.48rem;
        height: 0.32rem;
        background: #ffffff;
        border-radius: 0.02rem;
        border: 1px solid #d9d9d9;
        margin: 0 0.08rem;

        .el-input__inner {
          border: 0;
          background-color: transparent;
          height: 0.32rem !important;
          transform: translateY(-1px);
        }
      }
    }

    /* .el-pagination__sizes {
        pointer-events: none;
        width: 0.82rem;
        height: 0.32rem;
        background: #ffffff;
        box-sizing: border-box;
        border-radius: 2px;
        margin-right: 0;
        .el-input__inner:hover {
          border: 0;
        }
        .el-input__inner:focus {
          border: 0;
        }
        .el-input__inner {
          padding: 0;
          border: 0;
          text-align: center;
        }
        .el-input__suffix {
          display: none;
        }
        .el-input {
          width: 0.82rem;
          height: 0.32rem;
          border: 1px solid #d9d9d9;
          box-sizing: border-box;
        }
      } */

    .btn-prev {
      width: 110px;
      height: 40px;
      background: #eeeeee;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        font-size: 16px;
        color: #333333;
      }
    }

    .btn-next {
      width: 110px;
      height: 40px;
      background: #eeeeee;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        font-size: 16px;
        color: #333333;
      }
    }

    ul {
      li {
        width: 26px !important;
        height: 35px;
        box-sizing: border-box;
        background: #ffffff;
        border: 1px solid #dddddd;
        border-radius: 6px;
        line-height: 32px;
        font-size: 0.1rem;
        //font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: center;
        color: #333;
        margin-right: 10px;

        &:nth-child(1) {
          margin-left: 10px;
        }
      }

      .active {
        color: #ffff;
        background: #008fcc;
      }
    }
  }
}
</style>
