<!--

import RecursiveList from '@/components/backstage/RecursiveList.vue';

-->
<template>
  <div class="class-box">
    <div class="title-box">部门/班级列表及管理操作</div>

    <!-- 增删改 -->
    <div class="add-del_change">
      <buttonVue
        v-auth="'deptoradmin/add'"
        type="add"
        text="新增"
        @clickBtn="openAddDept"
      ></buttonVue>
      <buttonVue
        v-auth="'deptoradmin/edit'"
        type="update"
        text="编辑"
        @clickBtn="openEditDept"
      ></buttonVue>
      <buttonVue
        v-auth="'deptoradmin/del'"
        type="remove"
        @clickBtn="removeSelectDept"
        text="删除"
      ></buttonVue>
    </div>
    <div class="total">当前列表共有数据：{{ total }}条</div>
    <div class="table">
      <div class="table_title">
        <div class="table_title_col col_1">部门/班级名称</div>
        <div class="table_title_col col_2">指定管理员</div>
        <div class="table_title_col col_3">部门等级</div>
      </div>

      <div class="list_warp">
        <RecursiveList :items="deptList">
          <template v-slot="{ item }">
            <div
              v-if="item.level == 0"
              @click="selectRow = item"
              :class="selectRow.id == item.id ? 'selected_row' : ''"
              class="admin_row"
            >
              <div class="admin_row_col">
                <img src="@/assets/img/backstage/dept/admin_icon.png" />
                <span>{{ item.class_name }}</span>
              </div>
              <div class="admin_row_col">
                <span>{{ item.to_users }}</span>
              </div>
              <div class="admin_row_col">
                <span>{{ item.to_depts }}</span>
              </div>
            </div>
            <div
              v-else
              class="row"
              @click="changeSelectRow(item)"
              :class="selectRow.id == item.id ? 'selected_row' : ''"
              :style="{ marginLeft: pxToRem(60 * item.level) + 'rem' }"
            >
              <div
                class="row_col"
                :style="{
                  width: auto,
                  minWidth: pxToRem(700 - item.level * 60) + 'rem',
                }"
              >
                <div
                  @click="changeSelectItem(item)"
                  :class="item.check ? 'select' : ''"
                  class="check"
                  :style="{
                    backgroundColor: item.check
                      ? colors[item.level - 1]
                      : 'rgba(0,0,0,0)',
                  }"
                ></div>
                <span>{{ item.class_name }}</span>
              </div>
              <div class="row_col">
                <span>{{ item.to_users }}</span>
              </div>
              <div class="row_col">
                <div
                  class="level_label"
                  :style="{ backgroundColor: colors[item.level - 1] }"
                >
                  管理员({{ item.level + 1 }}级)
                </div>
              </div>
              <div :style="{ height: getHeight(item) }" class="line"></div>
            </div>
          </template>
        </RecursiveList>
      </div>
    </div>

    <backstage-dialog
      :show.sync="dialogShow"
      title="编辑部门/班级信息"
      @save="saveEdit"
    >
      <div class="title-box margin_bottom_0">
        <span>部门/班级名称：</span>
        <input maxlength="16" type="text" v-model="editForm.class_name" />
      </div>
      <!-- 最顶级不能编辑 ！-->
      <div class="add-admin" v-if="selectRow.id != 1">
        <span>上级部门/班级：</span>
        <div class="add-select">
          <cascaderVue
            placeholder="管理部门"
            :checkStrictly="true"
            :options="this.deptList"
            v-model="editForm.pid"
            label="class_name"
            ItemValue="id"
          ></cascaderVue>
          <!-- <cascaderVue></cascaderVue> -->
          <!-- <selectVue :options="deptList" v-model="activeSelectManagerUser" label="other_name" ItemValue="id">

          </selectVue> -->
        </div>
      </div>
      <div class="title-box margin_top_14" v-if="selectRow.id != 1">
        <span style="opacity: 0"></span>
        <div class="tips">当前层级：{{ selectRowAllName }}</div>
      </div>

      <div class="add-admin">
        <span>添加管理员：</span>
        <div class="add-select">
          <selectVue
            :options="marginUserList"
            v-model="activeSelectManagerUser"
            label="other_name"
            ItemValue="id"
            :disabled="selectRow.level == 0"
          >
          </selectVue>
        </div>
        <button @click="addMangerInEditForm">确定添加</button>
      </div>

      <div class="title-box margin_top_14">
        <span style="opacity: 0"></span>
        <div class="tips">
          注：需先在“用户管理”模块内，创建对应的管理员资料，才能在此处选择添加。
        </div>
      </div>

      <div class="title-box align_items_start" style="margin-top: 0.1rem">
        <span>已有管理员：</span>
        <div
          class="tips line_height_38"
          v-if="editForm.marginUserList.length == 0"
        >
          未添加
        </div>
        <div v-else class="select_manager_box">
          <div class="item" v-for="(item, i) in editForm.marginUserList">
            {{ item.other_name }}
            <div
              class="close"
              v-if="selectRow.level != 0"
              @click="editForm.marginUserList.splice(i, 1)"
            ></div>
          </div>
        </div>
      </div>
    </backstage-dialog>

    <backstage-dialog
      :show.sync="isShowAddWindows"
      title="新增下级部门/班级"
      @save="saveAdd"
    >
      <div class="title-box">
        <span>上级部门/班级：</span>
        <div class="text">
          {{ selectRowAllName }}{{ selectRowAllName ? "/" : ""
          }}{{ this.selectRow.class_name }}
        </div>
      </div>
      <div class="title-box">
        <span>部门/班级名称：</span>
        <input maxlength="16" type="text" v-model="addForm.class_name" />
      </div>
      <div class="add-admin">
        <span>添加管理员：</span>
        <div class="add-select">
          <selectVue
            :options="marginUserList"
            v-model="activeSelectManagerUser"
            label="other_name"
            ItemValue="id"
          >
          </selectVue>
        </div>
        <button @click="addMangerInAddForm">确定添加</button>
      </div>
      <div class="title-box margin_bottom_35 margin_top_14">
        <span style="opacity: 0">部门/班级名称：</span>
        <div class="tips">
          注：需先在“用户管理”模块内，创建对应的管理员资料，才能在此处选择添加。如暂时不想设定管理员，可选择“暂不设置”。
        </div>
      </div>
      <div class="title-box align_items_start">
        <span>已有管理员：</span>
        <div
          class="tips line_height_38"
          v-if="addForm.marginUserList.length == 0"
        >
          未添加
        </div>
        <div v-else class="select_manager_box">
          <div class="item" v-for="(item, i) in addForm.marginUserList">
            {{ item.other_name }}
            <div
              class="close"
              @click="addForm.marginUserList.splice(i, 1)"
            ></div>
          </div>
        </div>
      </div>
    </backstage-dialog>
  </div>
</template>

<script>
import {
  deptApiList,
  deptApiAdd,
  deptApiManager,
  deptApiEdit,
  deptApiDel,
} from "@/server/api/dept";
import { userBackApiList } from "@/server/api/user";
import { pxToRem } from "@/utils/number";

export default {
  data() {
    return {
      total: 0,
      colors: [
        "#FF9500",
        "#1BC7BA",
        "#2E8AE6",
        "#FF6161",
        "#14C76A",
        "#7C50D6",
        "#18B6C9",
        "#8EBF13",
        "#FF5A00",
        "#F7D208",

        "#B22DFF",
        "#C7C21B",
        "#81E62E",
        "#A478FF",
        "#C77314",
        "#BF1385",
        "#FF61B5",
        "#2EE6DF",
        "#68B0FF",
        "#FFB668",
      ],
      //管理员用户列表
      marginUserList: [],
      //当前选中的管理员
      activeSelectManagerUser: null,

      /**
       * 部门数据列表
       */
      deptList: [],
      isShowAddWindows: false,
      //添加表单
      addForm: {
        marginUserList: [],
        class_name: "",
      },

      //修改表单
      editForm: {
        class_name: "",
        pid: "",
        marginUserList: [],
      },
      //选中的部门id
      selectRow: {},
      // 编辑弹框
      dialogShow: false,
      //提示弹框
      popupShow: false,
    };
  },
  computed: {
    selectRowAllName() {
      let array = [];
      if (this.selectRow.id) {
        array = this.findParentNodes((node) => {
          return this.selectRow.id == node.id;
        }, this.deptList[0]);
      }

      return array.map((v) => v.class_name).join("/");
    },
  },
  methods: {
    //获取rem转换
    pxToRem,
    getHeight(item) {
      if (item.brother_deep <= 1) {
        if (item.level == 1 && item.i == 0) {
          return pxToRem(25) + "rem";
        }
        let num = 25 + (item.level == 1 ? 25 : 0) + (item.i == 0 ? 0 : 25);
        if (item.level == 1) {
          num -= 30;
        }

        return pxToRem(num) + "rem";
      } else {
        let num = item.brother_deep;
        return pxToRem(num * 50 - 5) + "rem";
      }
    },
    async deptApiList() {
      const res = await deptApiList();
      if (res.data.code == 200) {
        this.total = this.traverseTree(
          res.data.data[0],
          (node, i, parent, count) => {
            node.check = false;
            node.countData = count;
            node.i = i;
            node.parent = parent;
            node.disabled = false;
            if (parent && i > 0) {
              let brother = parent.children[i - 1];
              node.brother_deep = brother.countData;
            } else {
              node.brother_deep = 0;
            }
          }
        );

        this.deptList = res.data.data;
        this.selectRow = this.deptList[0];
      }
    },
    changeSelectItem(item) {
      let res = this.findTreeNode(this.deptList, (activeNode) => {
        return item.id == activeNode.id && item.id != undefined;
      });

      res.check = !res.check;

      function forParent(res) {
        if (res.parent) {
          res.parent.check = false;
          forParent(res.parent);
        }
      }

      if (res.check) {
        this.traverseTree(res, (node, i, parent, count) => {
          node.check = true;
        });
      } else {
        this.traverseTree(res, (node, i, parent, count) => {
          node.check = false;
        });
        forParent(res);
      }
    },
    async getManagerList() {
      const res = await userBackApiList({ page: 1, page_size: 9999, role: 2 });
      if (res.data.code == 200) {
        this.marginUserList = res.data.data.data.map((v) => {
          return { ...v, other_name: `${v.nickname}(${v.username})` };
        });
      }
    },
    addMangerInAddForm() {
      if (!this.activeSelectManagerUser) {
        return;
      }
      let flag = this.addForm.marginUserList.find(
        (v) => v.id == this.activeSelectManagerUser
      );
      if (!flag) {
        let find = this.marginUserList.find(
          (v) => v.id == this.activeSelectManagerUser
        );
        this.addForm.marginUserList.push(find);
        return;
      } else {
        this.$message.error("管理员已存在！");
      }
    },
    addMangerInEditForm() {
      if (!this.activeSelectManagerUser) {
        return;
      }
      console.log(this.editForm.marginUserList);
      let flag = this.editForm.marginUserList.find(
        (v) => v.id == this.activeSelectManagerUser
      );
      if (!flag) {
        let find = this.marginUserList.find(
          (v) => v.id == this.activeSelectManagerUser
        );

        this.editForm.marginUserList.push(find);
        return;
      } else {
        this.$message.error("管理员已存在！");
      }
    },
    async removeSelectDept() {
      let list = [];

      this.traverseTree(this.deptList[0], (node) => {
        node.check ? list.push(node) : "";
      });

      if (list.length == 0) {
        this.$message.error("请勾选你要删除的（部门/班级）");
        return;
      }
      const flag = await this.$backstagePopup.asyncShow(
        "删除（部门/班级）将删除该（部门/班级）下的所有普通用户账号，要继续吗？"
      );
      if (flag) {
        const res = deptApiDel({ ids: list.map((v) => v.id).join(",") });
        if ((await res).data.code == 200) {
          this.$message.success("删除成功");
          this.deptApiList();
        }
      }
    },
    async openEditDept() {
      this.activeSelectManagerUser = null;
      if (!this.selectRow.id) {
        this.$message.error("请选择部门");
        return;
      }
      // if (this.selectRow.level == 0) {
      //   this.$message.error("顶级部门不可编辑");
      //   return;
      // }

      const res = await deptApiManager({
        dept_id: this.selectRow.id,
      });
      this.editForm.class_name = this.selectRow.class_name;
      this.editForm.pid = this.findParentNodes(
        (node) => node.id == this.selectRow.id,
        this.deptList[0]
      ).map((v) => v.id);

      if (res.data.code == 200) {
        this.editForm.marginUserList = res.data.data.map((v) => {
          return {
            ...v,
            other_name: `${v.nickname}(${v.username})`,
            id: v.user_id,
          };
        });

        this.dialogShow = true;
      }
    },
    async openAddDept() {
      if (this.selectRow.level >= 9)
        return this.$message.error("部门/班级层级已达上限！");
      //打开时清空数据
      this.addForm = {
        marginUserList: [],
        class_name: "",
      };

      this.isShowAddWindows = true;
    },
    //添加保存
    async saveAdd() {
      //参数
      let params = {
        pid: this.selectRow.id,
        class_name: this.addForm.class_name.trim(),
        state: 1,
        uids: this.addForm.marginUserList.map((v) => v.id).join(","),
      };
      //效验
      const validate = () => {
        if (!this.selectRow.id) {
          this.$message.error("请选择上级！");
          return false;
        }
        if (!this.selectRow.id) {
          this.$message.error("请选择上级！");
          return false;
        }

        if (params.class_name.length == 0) {
          this.$message.error("请输入名称！");
          return false;
        }

        return true;
      };

      //判断效验是否通过
      let flag = validate();
      if (flag) {
        //发送接口
        const res = await deptApiAdd(params);

        if (res.data.code == 200) {
          //刷新数据
          this.deptApiList();

          //保存数据
          this.$message.success("保存成功！");
        }
      }
    },

    //保存部门操作
    async saveEdit() {
      //参数
      let params = {
        id: this.selectRow.id,
        class_name: this.editForm.class_name.trim(),
        uids: this.editForm.marginUserList.map((v) => v.id).join(","),
        pid: this.editForm.pid,
      };
      //效验
      const validate = (params) => {
        if (params.class_name.length == 0) {
          this.$message.error("请输入名称！");
          return false;
        }

        if (params.pid == params.id) {
          this.$message.error("上级不能选择自身！");
          return false;
        }

        return true;
      };

      //判断pid是否是数组 如果是数组的话取最后一个的值
      if (Array.isArray(params.pid) && params.pid.length > 0) {
        params.pid = params.pid[params.pid.length - 1];
      }

      //判断效验是否通过
      let flag = validate(params);

      if (flag) {
        //发送接口
        const res = await deptApiEdit(params);
        if (res.data.code == 200) {
          //刷新数据
          this.deptApiList();
          //保存数据
          this.$message.success("保存成功！");
        }
      }
    },

    //用于遍历树结构
    /**
     *
     * @param node
     * @param Function callback
     */
    traverseTree(node, callback, i = 0, parent = null) {
      let count = 1;
      // 遍历子节点
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          count += this.traverseTree(node.children[i], callback, i, node);
        }
      }

      if (callback instanceof Function) {
        if (callback.length == 1) {
          callback ? callback(node) : "";
        }

        if (callback.length == 2) {
          callback ? callback(node, i) : "";
        }

        if (callback.length == 3) {
          callback ? callback(node, i, parent) : "";
        }
        if (callback.length == 4) {
          callback ? callback(node, i, parent, count) : "";
        }
      }

      return count;
    },

    /**
     * 遍历字节点查找数据
     * @param {*} treeData  树数据
     * @param {Function} compare  比较方法
     * @returns
     */
    findTreeNode(treeData, compare) {
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

    /**
     *
     * @param {*} compare  查找的节点
     * @param {*} tree 数
     * @returns
     */
    findParentNodes(compare, tree) {
      let path = [];

      function findPath(currentNode, currentPath) {
        if (compare ? compare(currentNode) : false) {
          path = currentPath.slice();
          return;
        }

        if (currentNode.children) {
          for (let i = 0; i < currentNode.children.length; i++) {
            const child = currentNode.children[i];
            findPath(child, [...currentPath, currentNode]);
          }
        }
      }

      findPath(tree, []);

      return path;
    },

    changeSelectRow(item) {
      this.selectRow = item;
      this.traverseTree(this.deptList[0], (node) => {
        node.disabled = false;
      });
      let activeNode = this.findTreeNode(
        this.deptList[0],
        (node) => node.id == this.selectRow.id
      );
      this.traverseTree(activeNode, (node) => {
        node.disabled = true;
      });
    },
  },
  mounted() {
    console.log(this.selectRow.level);
  },
  created() {
    this.deptApiList();
    this.getManagerList();
  },
};
</script>
<style lang="less" scoped>
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

  .search-bpx {
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
    height: 40px;
    display: flex;

    margin-top: 25px;

    ::v-deep {
      button {
        margin-right: 10px;
      }
    }
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

    .table_title {
      width: 1560px;
      display: flex;

      .table_title_col {
        font-size: 16px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: center;
        color: #313131;
        line-height: 40px;
        border-radius: 6px;

        &:nth-child(1) {
          width: 658px;
          height: 40px;
          background: rgba(238, 238, 238, 0.5);
          //border: 1px solid #e6e6e6;
          //border-radius: 6px;
        }

        &:nth-child(2) {
          width: 600px;
          height: 40px;
          background: rgba(238, 238, 238, 0.5);
          //border: 1px solid #e6e6e6;
          //border-radius: 6px;
        }

        &:nth-child(3) {
          width: 300px;
          height: 40px;
          background: rgba(238, 238, 238, 0.5);
          //border: 1px solid #e6e6e6;
          //border-radius: 6px;
        }
      }
    }

    .list_warp {
      width: 100%;
      height: 700px;
      overflow-y: scroll;
      overflow-x: hidden;
      position: relative;

      &::-webkit-scrollbar-thumb {
        background-color: #eee;
      }

      .admin_row {
        width: 100%;
        height: 40px;
        background: rgba(238, 238, 238, 0.5);
        border-radius: 6px;
        box-sizing: border-box;
        padding-left: 20px;
        display: flex;
        margin-top: 10px;

        .admin_row_col {
          font-size: 16px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: center;
          color: #313131;
          line-height: 40px;

          img {
            width: 16px;
            height: 16px;
            margin-right: 12px;
          }

          &:nth-child(1) {
            width: 642px;
            display: flex;
            align-items: center;
          }

          &:nth-child(2) {
            width: 600px;
          }

          &:nth-child(3) {
            width: 300px;
          }
        }
      }

      .row {
        height: 40px;
        background: rgba(238, 238, 238, 0.5);
        border-radius: 6px;
        margin-top: 10px;

        display: flex;
        position: relative;

        .line {
          width: 35px;
          height: 25px;
          border-bottom: 1px #ddd dashed;
          border-left: 1px #ddd dashed;
          position: absolute;
          left: -35px;
          bottom: 20px;
        }

        .level_label {
          width: 120px;
          height: 24px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: left;
          color: #ffffff;
          line-height: 32px;
        }

        .row_col {
          display: flex;
          align-items: center;
          position: relative;
          z-index: 2;
          background: rgba(238, 238, 238, 0.5);

          &:nth-child(1) {
            font-size: 16px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #313131;
            line-height: 32px;
            box-sizing: border-box;
            padding-left: 15px;
            span {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .check {
              width: 16px;
              height: 16px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 12px;
              background-image: url("@/assets/img/backstage/icon/no_check.png");
              background-size: 100% 100%;
              border-radius: 4px;
              &::before {
                content: "";
                display: block;
                width: 12px;
                height: 12px;
                background-image: url("@/assets/img/backstage/icon/success_check.png");
                opacity: 0;
                background-size: 100% 100%;
              }

              &.select {
                background-image: none;

                &::before {
                  opacity: 1;
                }
              }
            }
          }

          &:nth-child(2) {
            width: 600px;
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #313131;
            line-height: 40px;
            width: 600px;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          &:nth-child(3) {
            width: 300px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }

      .selected_row {
        background: #e0eefb;
        border: 1px solid #2e8ae6;
        border-radius: 6px;
      }
    }
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
      }
    }
  }

  /deep/ .dialog-mask {
    .dialog-box {
      width: 840px;
      height: 480px;

      .content-box {
        height: 370px;
        border-top: 1px solid #dddddd;
        box-sizing: border-box;
        padding: 35px 0 0 85px;

        span {
          font-size: 14px;
          color: #333333;
          line-height: 38px;
        }

        .title-box {
          display: flex;
          align-items: center;

          &.align_items_start {
            align-items: flex-start;
          }

          > span {
            width: 100px;
            white-space: nowrap;
          }

          &:nth-child(1) {
            margin-bottom: 22px;
          }

          &.margin_bottom_35 {
            margin-bottom: 35px;
          }

          &.margin_top_14 {
            margin-top: 14px;
          }

          &.margin_bottom_0 {
            margin-bottom: 0;
          }

          input {
            width: 550px;
            height: 38px;
            background: #ffffff;
            border: 1px solid #e6e6e6;
            border-radius: 4px;
            outline: none;
            padding: 10px 0 10px 10px;
            box-sizing: border-box;
            font-size: 14px;
            margin-left: 19px;
          }

          .text {
            width: 600px;
            height: auto;
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #000000;

            margin-left: 19px;
          }

          .tips {
            width: 540px;
            opacity: 0.7;
            font-size: 13px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #333333;
            line-height: 20px;
            margin-left: 32px;

            &.line_height_38 {
              line-height: 38px;
            }
          }

          .select_manager_box {
            width: 600px;
            display: flex;
            flex-wrap: wrap;
            max-height: 100px;
            overflow-y: scroll;
            margin-left: 19px;

            .item {
              min-width: 130px;
              height: 38px;
              background: #ffffff;
              border: 1px solid #e6e6e6;
              border-radius: 4px;
              font-size: 14px;
              font-family: Microsoft YaHei, Microsoft YaHei-Regular;
              font-weight: 400;
              text-align: left;
              color: #333333;
              box-sizing: border-box;
              padding-left: 10px;
              padding-right: 38px;
              display: flex;
              align-items: center;

              position: relative;

              margin-bottom: 10px;
              margin-right: 10px;

              .close {
                width: 10px;
                height: 38px;
                position: absolute;
                right: 14px;

                &::before,
                &::after {
                  content: "";
                  display: block;
                  width: 10px;
                  height: 1px;
                  background-color: #777777;
                  position: absolute;
                  transform-origin: center center;
                }

                &::before {
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%) rotate(45deg);
                }

                &::after {
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%) rotate(-45deg);
                }
              }
            }
          }
        }

        .add-admin {
          display: flex;
          align-items: center;
          margin-top: 20px;

          > span {
            width: 100px;
            white-space: nowrap;
          }

          .add-select {
            width: 240px;
            height: 38px;
            background: #ffffff;
            //border: 1px solid #e6e6e6;
            border-radius: 4px;
            box-sizing: border-box;
            margin-left: 19px;
          }

          button {
            display: block;
            width: 80px;
            height: 38px;
            background: #2e8ae6;
            border-radius: 6px;
            margin-left: 10px;
            font-size: 14px;
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
