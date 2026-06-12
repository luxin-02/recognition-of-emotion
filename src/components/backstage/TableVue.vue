<template>
  <div class="table">
    <el-table
      :data="tableConfig.tableData"
      style="width: 100%"
      header-align="center"
      align="center"
      :header-cell-style="{ background: '#eee', color: '#333' }"
      ref="tableRefChildren"
      @selection-change="$emit('changeSelect', $event)"
      :cell-class-name="tableCellClassName"
      :highlight-current-row="tableConfig.currentRow"
      @row-dblclick="$emit('row-dblclick', $event)"
      @current-change="$emit('currentChange', $event)"
    >
      <el-table-column
        type="selection"
        :width="getWidth(50)"
        v-if="tableConfig.isSelect"
      >
      </el-table-column>

      <template v-for="(item, index) in tableConfig.headerTitle">
        <el-table-column
          v-if="item.type == 'function'"
          :label="item.label"
          :key="index"
          :prop="item.prop"
          :width="getWidth(item.width)"
        >
          <template v-slot="{ row }">
            <div
              v-html="item.callback && item.callback(row)"
              :class="item.class"
            ></div>
          </template>
        </el-table-column>

        <el-table-column
          v-else-if="item.type == 'slot'"
          :label="item.label"
          :key="index"
          :prop="item.prop"
          :width="getWidth(item.width)"
        >
          <template v-slot="{ row }">
            <div class="slot" :class="item.className">
              <slot
                :name="item.slotName ? item.slotName : item.type"
                :row="row"
              ></slot>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          v-else
          :label="item.label"
          :key="index"
          :prop="item.prop"
          :class="item.className && item.className"
          :width="getWidth(item.width)"
        >
        </el-table-column>
      </template>
      <template slot="empty">
        <el-empty v-if="true" description="暂无数据"></el-empty>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableConfig: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currentFontSize: 0,
    };
  },
  methods: {
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      // console.log('row:',row, 'column:',column, 'rowIndex:',rowIndex, 'columnIndex:',columnIndex)
      row.index = rowIndex;
      column.index = columnIndex;
    },
    getWidth(width) {
      if (!width) {
        return width;
      }
      let scale = this.currentFontSize / 100;

      return parseInt(width * scale);
    },
    handleFontSizeChange() {
      // Get the new font size
      setTimeout(() => {
        const newFontSize = parseFloat(
          getComputedStyle(document.documentElement).fontSize
        );

        this.currentFontSize = newFontSize;
      }, 100);
    },
  },
  mounted() {
    // Get and save the initial font size
    this.currentFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );

    window.addEventListener("resize", this.handleFontSizeChange);
  },
  beforeDestroy() {
    // Remove the resize event listener when the component is unmounted
    window.removeEventListener("resize", this.handleFontSizeChange);
  },
};
</script>
<style lang="less" scoped>
.table {
  :deep(.el-empty) {
    margin-top: 1.3rem;

    .el-empty__image {
      width: 1.9rem;
      height: 1.77rem;
      background: url("@/assets/img/backstage/assembly/tableNull.png");
      margin-left: 0.265rem;
      -moz-background-size: 100% 100%;
      background-size: 100% 100%;
    }

    .el-empty__image svg {
      display: none;
    }
  }

  ::v-deep {
    .current-row {
      td {
        &:nth-child(1) {
          border-left: 1px solid;
        }

        &:nth-last-child(1) {
          border-right: 1px solid;
        }

        border-top: 1px solid;
        border-color: #2e8ae6 !important;
      }
    }
  }

  ::v-deep .el-table {
    border-radius: 6px 6px 0px 0px;

    .el-table__header-wrapper .el-table-column--selection {
      .cell {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;

        &:before {
          content: "\9009\62e9";
          display: flex;
          width: 100%;
          height: 100%;
          color: #333333;
          align-items: center;
          justify-content: center;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          white-space: nowrap;
        }
      }
    }

    .slot {
      display: flex;
      justify-content: center;
      align-items: center;

      .el-button {
        padding: 0 0.2rem;
      }
    }

    &::before {
      content: "";
      display: none;
    }

    .el-table__header-wrapper {
      .el-checkbox {
        display: none;
      }

      .el-checkbox__inner {
        // position: absolute;
        // left: 0;
        // top: 100px;
      }
    }

    .el-table-column--selection {
      .is-checked {
        .el-checkbox__inner {
          width: 0.18rem;
          height: 0.18rem;
          background: #2e8ae6;
          border-radius: 0.04rem;

          &::after {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(45deg) scaleY(1);
          }
        }
      }

      .el-checkbox__inner {
        width: 18px;
        height: 18px;
        background: #eeeeee;
        border-radius: 4px;

        &::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          //transform: translate(-50%, -50%) rotate(45deg) scaleY(1);
        }
      }
    }

    .el-table__body tr:hover > td {
      background: #e0eefb !important;
    }

    th {
      height: 0.46rem;
      font-size: 0.14rem;
      font-weight: 400;
      text-align: center;
      //color: #595959;
      line-height: 0.22rem;
    }

    td {
      font-size: 0.14rem;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: center;
      color: #333;
      line-height: 0.22rem;
      padding: 0;
      height: 0.46rem;
    }

    td,
    th {
      text-align: center !important;
    }
  }
}
</style>
