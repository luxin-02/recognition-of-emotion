<template>
  <div class="class-box">
    <div class="title-box">咨询师账号列表</div>
    <!-- 搜索 -->

    <div class="add-del_change">
      <buttonVue
        v-auth="'role/edit'"
        @click="openEdit"
        buttonSize="130,40"
        type="add"
        text="修改权限"
      ></buttonVue>

    </div>
    <div class="total">当前列表共有数据：{{ total }}条</div>
    <div class="table">
      <tableVue
        @currentChange="currentChange"
        :tableConfig="tableConfig"
        ref="tableRef"
      >
        <template v-slot:deptname="row">
          {{ row.row.deptname == null ? "--" : row.row.deptname }}
        </template>
      </tableVue>
    </div>
    <div class="footer">

      <!-- 分页 -->
      <pageVue
        class="page"
        :current-page="page.page"
        @change="getTableList"
        :pageSize="page.page_size"
        :goPage="true"
        :total="total"
      ></pageVue>
    </div>

    <backstage-dialog
      class="edit_warp"
      :show.sync="showEdit"
      title='修改角色权限'
      @save="save"
      @cancel="cancel"
    >
      <div class="list">
        <div
          class="item_warp"
          v-for="(node, i) in  authList"
        >
          <div class="title_row">{{ node.group_name }}</div>
          <div class="core_list">
            <RecursiveList :items="node.children">
              <template v-slot="{ item }">
                <div
                  :style="{ marginLeft: pxToRem(52 * item.level) + 'rem' }"
                  class="row"
                >
                  <div
                    @click="changeSelectItem(item)"
                    class="check "
                    :class="item.check == 1 ? 'success' : ''"
                  ></div>
                  <div class="text">{{ item.title }} </div>
                </div>
              </template>
            </RecursiveList>
          </div>
        </div>

      </div>

    </backstage-dialog>
  </div>
</template>
    
<script>
import {pxToRem} from '@/utils/number';
import { roleApiList, roleGruntApiList, userGruntApiList, roleGruntApiEdit } from '@/server/api/role'

export default {
  data () {
    return {
      //角色权限列表
      authList: [

      ],
      //当前用户可以看到的权限列表
      menuList: [],
      //当前选中行
      activeRow: null,
      showEdit: false,
      //提示弹框0
      popupShow: false,
      //表格配置项
      tableConfig: {
        currentRow: '',
        // 资源分类列表
        tableData: [

        ],

        // 每一列的标题
        headerTitle: [
          {
            label: "序号",
            type: "function",
            callback: (row) => {
              let page = this.page.page;
              return row.index + 1 + page * this.page.page_size - this.page.page_size;
            },
          },
          { label: "角色名称", prop: "name" },

          {
            label: "角色分配", type: "function",
            callback: (row) => {
              return row.is_set == 0 ? '未设定权限' : row.is_set == 1 ? '设定部分权限' : '设定所有权限'
            },
          },

          /* {
            label: "日期",
            prop: "deleteTime",
            type: "function",
            callback: (row) => {
              return formatDate(new Date(row.addTime * 1000));
            },
          }, */


        ],
      },
      // 当前分页
      page: {
        page: 1,
        page_size: 10,

      },
      total: 0,
      // 是否全选

    };
  },

  created () {
    //获取角色列表
    this.getTableList();
    //获取当前用户可以看到的权限菜单
    this.getCurrentUserMenuList();
  },

  methods: {
    //当前rem配置方法
    pxToRem,

    //保存
    async save () {

      let list = [];
      for (const item of this.authList) {
        this.traverseTree(item, (node) => {
          if (node.id) {
            list.push({
              check: node.check,
              id: node.id,
            })
          }
        })

      }

      // list.map(v => {
      //     if (v.id == 5) {
      //         console.log(v.id)
      //     }

      // })

      try {
        const res = await roleGruntApiEdit({
          rule: this.activeRow.id,
          auth: JSON.stringify(list)
        });

        if (res.data.code == 200) {
          this.$message.success('保存成功！')
        }

      } catch (error) {
        console.error(error)
      }

    },
    //取消
    cancel () { },
    //获取角色列表
    async getTableList (page) {
      if (page) {
        this.page.page = page;
      }
      const res = await roleApiList(this.page)
      //请求成功
      if (res.data.code == 200) {
        this.tableConfig.tableData = res.data.data.data;
        this.total = res.data.data.total;
      }

    },
    //获取当前用户可以配置的权限列表
    async getCurrentUserMenuList () {
      let username = this.$store.getters.userInfo.username;
      const res = await userGruntApiList({ username });
      if (res.data.code == 200) {
        this.menuList = res.data.data.filter(v => { return v.group_name })
      }
    },
    //当前页change
    currentChange (row) {
      this.activeRow = row
    },

    //打开修改角色权限弹出
    async openEdit () {

      //判断是否有选中行
      if (!this.activeRow) {
        this.$message.error('请选择！')
        return
      }
      //获取当前角色的权限，和该登录用户可以操控的权限进行比对
      const res = await roleGruntApiList({
        rule: this.activeRow.id
      })

      if (res.data.code != 200) {
        return
      }
      let roleMenuList = res.data.data
      this.showEdit = true;

      let list = JSON.parse(JSON.stringify(this.menuList))
      let that = this;

      //遍历树结构
      for (const node of list) {
        this.traverseTree(node, (zNode) => {
          const result = this.findTreeNode({ children: roleMenuList }, (activeNode) => {
            return zNode.id == activeNode.id && zNode.id != undefined
          });
          // console.log(result)
          // console.log(zNode)
          if (result) {

            zNode.check = result.check == 1 ? 1 : 0;
          } else {
            zNode.check = 0;
          }
        })



      }

      that.authList = list;

    },
    changeSelectItem (item) {
      // console.log(item)
      // item.check = 0;
      // console.log(this.authList)


      let res = this.findTreeNode(this.authList, (activeNode) => {
        return item.id == activeNode.id && item.id != undefined
      });

      res.check = res.check ? 0 : 1;

    },

    //用于遍历树结构
    /**
     *
     * @param node
     * @param Function callback
     */
    traverseTree (node, callback, i = 0, parent = null) {
      let count = 1
      // 遍历子节点
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          count += this.traverseTree(node.children[i], callback, i, node);

        }
      }

      if (callback instanceof Function) {

        if (callback.length == 1) {
          callback ? callback(node) : '';
        }

        if (callback.length == 2) {
          callback ? callback(node, i) : '';
        }

        if (callback.length == 3) {
          callback ? callback(node, i, parent) : '';
        }
        if (callback.length == 4) {
          callback ? callback(node, i, parent, count) : '';
        }

      }

      return count
    },
    /**
     * 遍历字节点查找数据
     * @param {*} treeData  树数据
     * @param {Function} compare  比较方法
     * @returns
     */
    findTreeNode (treeData, compare) {
      if (treeData instanceof Array) {
        treeData.children = treeData;
      }
      let flag = compare ? compare(treeData) : false;

      if (flag) {
        return treeData;
      }

      for (let child of treeData.children || []) {
        const result = this.findTreeNode(child, compare);
        if (result) {
          return result;
        }
      }

      return null;
    },

  },

}

</script>
<style lang='less' scoped>
.edit_warp {
  ::v-deep {
    .dialog-box {
      width: 877px;
      height: 750px;

      .content-box {
        height: 640px;
        border-top: 1px solid #dddddd;
        box-sizing: border-box;
        overflow-y: scroll;

        .list {
          width: 100%;
          box-sizing: border-box;
          padding: 26px 45px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;

          .item_warp {
            width: 370px;
            min-height: 380px;
            border: 1px solid #e6e6e6;
            border-radius: 6px;
            margin-bottom: 10px;
            box-sizing: border-box;

            .title_row {
              width: 370px;
              height: 40px;
              background: #2e8ae6;
              border-radius: 6px 6px 0px 0px;
              font-size: 16px;
              font-family: Microsoft YaHei, Microsoft YaHei-Regular;
              font-weight: 400;
              text-align: left;
              color: #ffffff;
              line-height: 32px;
              box-sizing: border-box;
              padding-left: 15px;
            }

            .core_list {
              padding: 10px;
              padding-bottom: 60px;

              .row {
                max-width: 350px;
                height: 40px;
                background: #f6f6f6;
                border: 1px solid #e6e6e6;
                border-radius: 6px;
                display: flex;
                box-sizing: border-box;
                padding-left: 15px;
                display: flex;
                align-items: center;
                margin-top: 10px;

                .check {
                  width: 16px;
                  height: 16px;
                  margin-right: 20px;
                  background-image: url("@/assets/img/backstage/icon/no_check.png");
                  background-size: 100% 100%;
                  display: flex;
                  justify-content: center;
                  align-items: center;

                  &::before {
                    content: "";
                    display: block;
                    width: 10px;
                    height: 10px;
                    background-image: url("@/assets/img/backstage/icon/success_check.png");
                    background-size: 100% 100%;
                    opacity: 0;
                  }

                  &.success {
                    &::before {
                      opacity: 1;
                    }

                    background-image: none;
                    background-color: #ff9500;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.class-box {
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 24px;
  box-sizing: border-box;

  .title-box {
    font-size: 16px;
    color: #313131;
  }

  .search-box {
    width: 905px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 23px;

    .search-input {
      width: 315px;
      height: 40px;
    }

    .startAndendData {
      width: 350px;
      height: 40px;
    }
  }

  .add-del_change {
    width: 690px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    margin-top: 25px;
  }

  .total {
    width: 300px;
    font-size: 16px;
    text-align: right;
    margin-top: -20px;
    float: right;
  }

  .table {
    margin-top: 30px;
    width: 1560px;
    height: 630px;
    border-bottom: 1px solid #dddddd;
  }

  .footer {
    height: 80px;
    display: flex;
    align-items: center;

    .allSelectBtn {
      margin-left: 10px;
    }

    .text {
      color: #333333;
      font-size: 16px;
      margin: 0 34px 0 10px;
    }
  }

  /deep/ .popup-mask {
    .content-box {
      display: flex;
      justify-content: center;
      align-items: center;

      .my-popup-box {
        width: 256px;
        color: #333333;
        line-height: 32px;
        text-align: center;
        font-size: 16px;

        span {
          color: #2e8ae6;
        }
      }
    }
  }
}
</style>