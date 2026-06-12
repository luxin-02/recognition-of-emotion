<template>
  <div class="administrators">
    <div class="title-box">管理员账号列表</div>
    <!-- 搜索 -->
    <div class="search-box">
      <div class="search-input">
        <inputVue v-model="searchName" placeholder="搜索关键字"></inputVue>
      </div>
      <div class="search-class">
        <!-- <selectVue :options="searchClassList" :value="getObj.classVal" label="name" ItemValue="id"
            placeholder="管理部门" @changeValue="searchClass">
        </selectVue> -->

        <cascaderVue
          placeholder="管理部门"
          :options="this.deptList"
          v-model="page.class_id"
          label="class_name"
          ItemValue="id"
        ></cascaderVue>
      </div>

      <buttonVue
        text="搜索"
        @clickBtn="
          () => {
            page.nickname = searchName;
          }
        "
      ></buttonVue>
      <buttonVue text="重置" @clickBtn="reset"></buttonVue>
    </div>
    <!-- 增删改 -->
    <div class="add-del_change">
      <buttonVue
        v-auth="'adminlist/add'"
        text="新增"
        @clickBtn="openAddUser"
      ></buttonVue>

      <buttonVue
        v-auth="'adminlist/edit'"
        text="修改"
        @clickBtn="openEditUser"
      ></buttonVue>
      <buttonVue
        v-auth="'adminlist/del'"
        text="删除"
        @clickBtn="delUser"
      ></buttonVue>

      <buttonVue
        v-auth="'adminlist/remove'"
        text="移除管理权限"
        backgroundColor="#FFAF00"
        buttonSize="140,40"
        @clickBtn="permissions"
      ></buttonVue>
    </div>
    <div class="total">当前列表共有数据：{{ page.total }}条</div>

    <div class="table" v-loading="tableLoading">
      <tableVue
        @currentChange="currentChange"
        :tableConfig="tableConfig"
        ref="tableRef"
        @changeSelect="changeSelect"
      >
        <template v-slot:nickname="row">
          <!-- <img src="@/assets/img/搜索.png" style="width: 0.34rem;height: 0.34rem; border-radius:50%" alt=""> -->
          <div class="nickname_row">
            <el-image class="header_img" :src="$ip + row.row.avatar"></el-image>
            <div class="nick_name_text">{{ row.row.nickname }}</div>
          </div>
        </template>

        <template v-slot:face="row">
          <div class="center">
            <img
              :src="
                row.row.face
                  ? require('@/assets/img/backstage/assembly/checked.png')
                  : require('@/assets/img/backstage/assembly/unChecked.png')
              "
              style="width: 0.16rem; height: 0.16rem"
              alt=""
            />
          </div>
        </template>

        <template v-slot:fingerprint="row">
          <div class="center">
            <img
              :src="
                row.row.fingerprint
                  ? require('@/assets/img/backstage/assembly/checked.png')
                  : require('@/assets/img/backstage/assembly/unChecked.png')
              "
              style="width: 0.16rem; height: 0.16rem"
              alt=""
            />
          </div>
        </template>

        <template v-slot:privilegeLevel="row">
          <div class="center">
            <div :style="getStyle(row.row.power_level)">
              {{
                row.row.power_level != ""
                  ? row.row.power_level == "超级管理员"
                    ? "超级管理员"
                    : `管理员（${row.row.power_level}级）`
                  : "暂未分配管理班级"
              }}
            </div>
          </div>
        </template>
      </tableVue>
    </div>

    <div class="footer">
      <!-- 全选 -->
      <checkboxVue
        class="allSelectBtn"
        :propsValue="allSelect"
        @returnValue="allSelect = $event"
      ></checkboxVue>

      <div class="text">全选本页</div>

      <!-- 分页 -->
      <pageVue
        class="page"
        :current-page="page.page"
        @change="getTableList"
        :pageSize="page.page_size"
        :goPage="true"
        :total="page.total"
        @pageBtnChange="getTableList"
      ></pageVue>
    </div>

    <!-- 新增管理员 -->
    <backstage-dialog
      :isAutoSaveClose="false"
      class="admin_box"
      :show.sync="adminShow"
      title="新增管理员信息"
      @save="saveAddManager"
    >
      <div class="content_box">
        <div class="select" @click="clickExistingOrNew(1)">
          <img
            :src="
              existingOrNew == 1
                ? require('@/assets/img/backstage/other/check.png')
                : require('@/assets/img/backstage/other/unCheck.png')
            "
            alt=""
          />
          <span>从现有用户列表中选择</span>
        </div>
        <div class="existing">
          <span>选择部门：</span>
          <cascaderVue
            placeholder="选择部门"
            :options="this.deptList"
            v-model="addMarginDeptIdList"
            label="class_name"
            ItemValue="id"
          ></cascaderVue>
          <!-- <selectVue :options="addAdminClass" :value="addAdminVal" label="name" ItemValue="id" placeholder="班级"
              @changeValue="changeAddAdminClass">
          </selectVue> -->
          <span style="margin-left: 0.37rem">选择用户：</span>
          <selectVue
            v-model="activeAddUserId"
            :options="addMarginUserList"
            label="nickname"
            ItemValue="id"
            placeholder="用户"
          >
          </selectVue>
        </div>
        <div class="select" @click="clickExistingOrNew(2)">
          <img
            :src="
              existingOrNew == 2
                ? require('@/assets/img/backstage/other/check.png')
                : require('@/assets/img/backstage/other/unCheck.png')
            "
            alt=""
          />
          <span>建立一个新的账户</span>
        </div>
        <div class="new_box">
          <div class="register_paw">
            <div class="register">
              <span>账号：</span>
              <input
                maxlength="20"
                type="text"
                v-model="addAdminObj.username"
              />

              <span>密码：</span>
              <div class="paw">
                <input
                  maxlength="16"
                  type="password"
                  v-model="addAdminObj.password"
                />
                <button @click="addAdminObj.password = '12345'">默认</button>
              </div>
            </div>
          </div>

          <div class="illustrate">
            说明：账号注册后不允许修改，密码可修改。 默认密码 12345
          </div>
          <div class="name_age_sex">
            <span>姓名：</span>
            <input type="text" v-model="addAdminObj.nickname" />
            <span>年龄：</span>
            <input
              type="number"
              v-model="addAdminObj.birthdate"
              @keydown="onKeydown"
            />
            <span>性别：</span>
            <!-- <input type="text" v-model="addAdminObj.sex" /> -->
            <selectVue
              :options="searchSexList"
              v-model="addAdminObj.sex"
              label="name"
              ItemValue="id"
              placeholder="性别"
            >
            </selectVue>
          </div>
          <div class="not_supertube" @click="is_system = !is_system">
            <img
              :src="
                is_system
                  ? require('@/assets/img/backstage/other/cancel.png')
                  : require('@/assets/img/backstage/other/unCancel.png')
              "
              alt=""
            />
            <span>给予超级管理员权限</span>
          </div>
        </div>
      </div>
    </backstage-dialog>
    <!-- 编辑管理员 -->
    <backstage-dialog
      class="edit_admin"
      :isAutoSaveClose="false"
      :show.sync="editAdminShow"
      title="编辑管理员信息"
      @save="saveEditUser"
    >
      <div class="scroll">
        <div class="register">
          <span>账号：</span>
          <input
            type="text"
            maxlength="20"
            :disabled="true"
            v-model="editObj.username"
          />

          <span>密码：</span>
          <div class="paw">
            <input maxlength="16" type="password" v-model="editObj.password" />
            <button @click="editObj.password = '12345'">默认</button>
          </div>
        </div>
        <div class="name_age_sex">
          <span>姓名：</span>
          <input type="text" maxlength="16" v-model="editObj.nickname" />
          <span>年龄：</span>
          <input
            type="number"
            v-model="editObj.birthdate"
            @keydown="onKeydown"
          />
          <span>性别：</span>
          <!-- <input type="text" v-model="editObj.sex" /> -->
          <selectVue
            :options="searchSexList"
            v-model="editObj.sex"
            label="name"
            ItemValue="id"
            placeholder="性别"
          >
          </selectVue>
        </div>
        <div class="manage_class">
          <span>管理班级/部门：</span>
          <div class="class_box">
            <span>{{ editObj.depts.map((v) => v.class_name).join(",") }}</span>
            <div>
              (如需修改所管班级，请到“部门/班级管理”模块内为管理员重新指定。)
            </div>
          </div>
        </div>

        <div
          class="title"
          v-if="$store.getters.isOpenFingerprint || $store.getters.isOpenFace"
        >
          其它登录凭证：<span>(设备支持时有此功能)</span>
        </div>
        <div class="face_fingerprint" v-if="$store.getters.isOpenFace">
          <span>人脸：</span>

          <el-image class="images" :src="editObj.face_img" alt="请录入人脸">
            <div
              slot="error"
              class="image-slot"
              style="box-sizing: border-box; border-radius: 0.05rem"
            >
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="face_fingerprint_btn">
            <div class="enter_or_not">
              <img
                :src="
                  editObj.face
                    ? require('@/assets/img/backstage/assembly/checked.png')
                    : require('@/assets/img/backstage/assembly/deny.png')
                "
              />
              {{
                editObj.face
                  ? " 用户已录入人脸信息，可用于登录。"
                  : "用户未录入人脸信息，不可用于登录。"
              }}
            </div>
            <button @click="faceShow = true">
              {{ editObj.face ? "重新录入" : "录入人脸部" }}
            </button>
          </div>
        </div>
        <div class="face_fingerprint" v-if="$store.getters.isOpenFingerprint">
          <span>指纹：</span>
          <div class="fingerprint_img" style="box-sizing: border-box">
            <img
              :src="
                editObj.fingerprint
                  ? require('@/assets/img/backstage/fingerprint/2.png')
                  : require('@/assets/img/backstage/fingerprint/1.png')
              "
              alt=""
            />
          </div>
          <div class="face_fingerprint_btn">
            <div class="enter_or_not">
              <img
                :src="
                  editObj.fingerprint
                    ? require('@/assets/img/backstage/assembly/checked.png')
                    : require('@/assets/img/backstage/assembly/deny.png')
                "
              />
              {{
                editObj.fingerprint
                  ? " 用户已录入指纹信息，可用于登录。"
                  : "用户未录入指纹信息，不可用于登录。"
              }}
            </div>
            <button @click="fingerprintShow = true">指纹录入</button>
          </div>
        </div>
        <div
          class="not_supertube"
          style="display: flex; align-items: center; margin-top: 0.1rem"
          @click="is_system = !is_system"
        >
          <img
            :src="
              is_system
                ? require('@/assets/img/backstage/other/cancel.png')
                : require('@/assets/img/backstage/other/unCancel.png')
            "
            alt=""
          />
          &nbsp; &nbsp;
          <span>给予超级管理员权限</span>
        </div>
      </div>
    </backstage-dialog>
    <!-- 录入人脸 -->
    <theFaceInput
      :face.sync="editObj.face"
      :faceImg.sync="editObj.face_img"
      :show.sync="faceShow"
    >
    </theFaceInput>
    <!-- 录入指纹 -->
    <theFingerPrintInput
      v-model="editObj.fingerprint"
      :show.sync="fingerprintShow"
    ></theFingerPrintInput>

    <!-- 移除管理员权限 -->
    <backstage-popup
      class="remove_permissions"
      :show.sync="removePermissionsShow"
      title="操作提示"
      @save="removePermissionsSub"
    >
      <div class="tips">请选择要移入的部门/班级</div>
      <cascaderVue
        placeholder="管理部门"
        :options="this.deptList.length ? this.deptList[0].children : []"
        v-model="moveDeptId"
        label="class_name"
        ItemValue="id"
      >
      </cascaderVue>
    </backstage-popup>
  </div>
</template>

<script>
import { deptApiList } from "@/server/api/dept";
import { trimStringProperties, copyNonEmptyProperties } from "@/utils/object";
import {
  userManagerBackApiAdd,
  userBackApiList,
  userManagerBackApiEdit,
  userManagerBackApiDel,
  userBackApiMoveRecycle,
  userBackApiDetails,
} from "@/server/api/user";
import theFaceInput from "../components/theFaceInput.vue";
import theFingerPrintInput from "../components/theFingerPrintInput.vue";

function convertAgeToDate(age) {
  let currentDate = new Date(); // 获取当前日期
  let year = currentDate.getFullYear() - age; // 减去年龄得到出生年份
  // var month = currentDate.getMonth() + 1; // 获取当前月份
  // var day = currentDate.getDate(); // 获取当前日期

  // 格式化日期字符串
  let formattedDate = year + "-" + "01" + "-" + "01";

  return formattedDate;
}

export default {
  components: { theFaceInput, theFingerPrintInput },
  async created() {
    const deptRes = await deptApiList();
    if (deptRes.data.code == 200) {
      this.deptList = deptRes.data.data;
    }

    this.getTableList();
  },
  data() {
    return {
      role: 2, //默认角色
      //添加管理员筛选部门的id
      addMarginDeptIdList: [],
      //通过添加管理员筛选部门的id所获取的用户列表
      addMarginUserList: [],
      //添加管理员选择用户的id
      activeAddUserId: "",
      faceShow: false,
      fingerprintShow: false,
      searchName: "",
      deptList: [], //部门列表
      activeRow: null, //选中行

      //移除权限确认
      removePermissionsShow: false,
      // 编辑管理员
      editAdminShow: false,
      // 新增编辑用户信息
      editObj: {
        username: "",
        password: "",
        nickname: "",
        age: 0,
        sex: "",
        face_img: "",
        fingerprint: "", //指纹
        face: "",
        depts: [],
      },
      //是否显示新增管理员
      adminShow: false,
      //选择新增还是现有的管理员
      existingOrNew: 1,
      //新增管理员 选择新增信息
      addAdminObj: {
        username: "",
        password: "",
        nickname: "",
        birthdate: 0,
        sex: "",
      },
      searchSexList: [
        { name: "男", id: "男" },
        { name: "女", id: "女" },
      ],
      //是否勾选超管
      is_system: false,

      //移除管理员权限修改的部门
      moveDeptId: [],

      // 表格数据
      tableConfig: {
        //高亮行
        currentRow: "",
        // 是否有选择按框
        isSelect: true,
        // 资源分类列表
        tableData: [],
        // 每一列的标题
        headerTitle: [
          {
            label: "序号",
            type: "function",
            callback: (row) => {
              let page = this.page.page;
              return (
                row.index + 1 + page * this.page.page_size - this.page.page_size
              );
            },
            width: 80,
          },
          {
            label: "管理员姓名及头像",
            slotName: "nickname",
            type: "slot",
            width: 300,
          },

          {
            label: "管理员账号",
            prop: "username",
            width: 300,
          },

          {
            label: "管理部门",
            type: "function",
            callback: (row) => {
              return row.depts
                ? row.depts.map((v) => v.class_name).join(",")
                : "";
            },
            width: 200,
          },
          {
            label: "人脸凭证",
            type: "slot",
            slotName: "face",
          },
          {
            label: "指纹凭证",
            type: "slot",
            slotName: "fingerprint",
          },

          {
            label: "权限等级",
            type: "slot",
            slotName: "privilegeLevel",
          },

          /* {
            label: "日期",
            prop: "deleteTime",
            type: "function",
            callback: (row) => {
              return formatDate(new Date(row.addTime * 1000));
            },
          }, */

          /* {
            label: "操作",
            type: "slot",
            className: "operate",
          }, */
        ],
      },
      page: {
        // 当前分页
        page: 1,
        // 总分页数
        page_size: 10,
        // 总条数
        total: 0,
        nickname: "",
        class_id: "",
        sex: "",
        state: "",
      },
      // 选择的个数
      selectCount: 0,
      // 选择的id
      selectIds: "",
      // 是否全选
      allSelect: false,

      tableLoading: false,
    };
  },

  computed: {
    //组合属性用于监听搜索参数自动查询
    combinedProperties() {
      return (
        this.page.sex +
        this.page.class_id +
        this.page.state +
        this.page.nickname
      );
    },
  },

  mounted() {
    console.log(this.$store.getters.isOpenFingerprint);
  },

  watch: {
    allSelect(newAllSelect) {
      if (newAllSelect) {
        // 获取表格dom
        const tableDom = this.$refs.tableRef;
        // 全选功能
        this.tableConfig.tableData.forEach((item) => {
          tableDom.$children[0].toggleRowSelection(item, true);
        });
      } else {
        // 获取表格dom
        const tableDom = this.$refs.tableRef;
        // 全选功能
        tableDom.$children[0].clearSelection();
      }
    },
    combinedProperties() {
      this.getTableList();
    },
    //监听添加选择部门更新选择用户列表
    async addMarginDeptIdList(nvl) {
      this.addMarginUserList = [];
      //添加管理员选择用户的id
      this.activeAddUserId = "";
      if (nvl.length == 0) {
        return;
      }
      let last = nvl.length - 1;

      const res = await userBackApiList({
        page: 1,
        role: 3,
        // 总分页数
        page_size: 9999,
        class_id: nvl[last],
      });

      if (res.data.code == 200) {
        this.addMarginUserList = res.data.data.data;
      }
    },
  },

  methods: {
    onKeydown(e) {
      let key = e.key;
      if (key === "+" || key === "-") {
        e.returnValue = false;
      } else {
        e.returnValue = true;
      }
    },
    getStyle(level) {
      if (level == "" || level == "超级管理员") {
        return "";
      }
      let styles = [
        {
          background: "rgba(255,234,204,0.50)",
          color: "#ff9500",
          border: "1px solid #ff9500",
          width: "1.2rem",
          height: "0.28rem",
        },
        {
          background: "#d1f4f1",
          color: "#1BC7BA",
          border: "1px solid #1bc7ba",
          width: "1.2rem",
          height: "0.28rem",
        },
      ];
      let i = parseInt(level) % styles.length;

      return styles[i];
    },

    currentChange(row) {
      this.activeRow = row;
    },
    //保存添加管理员
    async saveAddManager() {
      let is_system = this.is_system ? 1 : 0;
      let params = {};
      if (this.existingOrNew == 1) {
        if (this.activeAddUserId == "") {
          this.$message.error("请选择用户！");
          return;
        }
        params = {
          uid: this.activeAddUserId,
          is_new_user: 0,
          is_system: is_system,
        };
      } else {
        params = { ...this.addAdminObj, is_system, is_new_user: 1 };
        //去掉字符串左右空格
        params = trimStringProperties(params);

        //验证新增管理员数据是否正常
        const validity = (params) => {
          if (params.username == "") {
            this.$message.error("请输入账号！");
            return false;
          }
          if (params.password == "") {
            this.$message.error("请输入密码！");
            return false;
          }
          if (params.nickname == "") {
            this.$message.error("请输入姓名！");
            return false;
          }
          if (params.sex == "" || (params.sex != "男" && params.sex != "女")) {
            this.$message.error("请输入正确的性别！");
            return false;
          }

          if (params.birthdate < 0) {
            this.$message.error("请输入正确的年龄！");
            return false;
          }

          return true;
        };
        let flag = validity(params);

        if (!flag) {
          return;
        }
      }

      //将年龄转成出生日期
      params.date_of_birth = this.$getTime(
        convertAgeToDate(parseInt(params.birthdate))
      );

      const res = await userManagerBackApiAdd(params);

      if (res.data.code == 200) {
        this.$message.success("添加成功！");
        this.getTableList();
        this.adminShow = false;
      }
    },
    async getTableList(page) {
      if (page) {
        this.page.page = page;
      }
      const params = {
        ...this.page,
        role: this.role,
      };

      //判断class_id是否是数组 如果是数组的话取最后一个的值
      if (Array.isArray(params.class_id) && params.class_id.length > 0) {
        params.class_id = params.class_id[params.class_id.length - 1];
      }
      this.tableLoading = true;
      try {
        const res = await userBackApiList(params);
        if (res.data.code == 200) {
          this.page.page = res.data.data.current_page;
          this.page.total = res.data.data.total;
          this.tableConfig.tableData = res.data.data.data;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.tableLoading = false;
      }
    },

    // 移除权限
    async permissions() {
      if (!this.selectIds) {
        this.$message.error("请勾选用户！");
        return;
      }
      this.removePermissionsShow = await this.$backstagePopup.asyncShow(
        "移除管理员权限，会将当前账号变为普通用户等级，确定继续吗？"
      );
    },

    async removePermissionsSub() {
      let params = {
        uid: this.selectIds,
        class_id: this.moveDeptId,
      };
      //判断class_id是否是数组 如果是数组的话取最后一个的值
      if (Array.isArray(params.class_id) && params.class_id.length > 0) {
        params.class_id = params.class_id[params.class_id.length - 1];
      }
      if (params.class_id.length == 0) {
        this.$message.error("请选择移入部门！");
        return;
      }

      const res = await userManagerBackApiDel(params);
      if (res.data.code == 200) {
        this.$message.success("移除成功！");
        this.getTableList();
      }
    },

    //新增管理员 选择现有还是新增
    clickExistingOrNew(val) {
      this.existingOrNew = val;
    },

    //新增
    openAddUser() {
      //重置属性
      this.addMarginDeptIdList = [];

      this.addMarginUserList = [];

      this.activeAddUserId = "";
      this.is_system = false;
      this.addAdminObj = {
        username: "",
        password: "",
        nickname: "",
        age: 0,
        sex: "",
      };

      this.adminShow = true;
    },
    //修改
    async openEditUser() {
      if (!this.activeRow) {
        this.$message.error("请选择需要修改的行！");
        return;
      }

      let editObj = {
        username: "",
        password: "",
        nickname: "",
        birthdate: "",
        sex: "",
        face_img: "",
        fingerprint: "", //指纹
        face: "",
      };

      const res = await userBackApiDetails({ uid: this.activeRow.id });
      if (res.data.code == 200) {
        editObj = copyNonEmptyProperties(editObj, res.data.data);
        editObj.password = "";
        editObj.uid = this.activeRow.id;
        //部门数组赋值包括其父亲
        editObj.depts = this.activeRow.depts;
        this.editObj = editObj;
        this.editAdminShow = true;
        this.is_system = res.data.data.role == 1 ? true : false;
      }
    },

    async saveEditUser() {
      let is_system = this.is_system ? 1 : 0;
      let params = { ...this.editObj, is_system };

      //判断fingerprint是否是数组 如果是数组的话取最后一个的值
      if (Array.isArray(params.fingerprint) && params.fingerprint.length > 0) {
        params.fingerprint = params.fingerprint[params.fingerprint.length - 1];
      }
      //去掉字符串左右空格
      params = trimStringProperties(params);
      //验证用户数据是否正常
      const validity = (params) => {
        if (params.username == "") {
          this.$message.error("请输入账号！");
          return false;
        }

        if (params.nickname == "") {
          this.$message.error("请输入姓名！");
          return false;
        }
        if (params.sex == "" || (params.sex != "男" && params.sex != "女")) {
          this.$message.error("请输入正确的性别！");
          return false;
        }

        if (params.birthdate < 0) {
          this.$message.error("请输入正确的年龄！");
          return false;
        }

        return true;
      };

      let flag = validity(params);
      if (!flag) {
        return;
      }

      delete params.depts;

      //将年龄转成出生日期
      params.date_of_birth = this.$getTime(
        convertAgeToDate(parseInt(params.birthdate))
      );
      // params.fingerprint = "";
      const res = await userManagerBackApiEdit(params);
      if (res.data.code == 200) {
        this.editAdminShow = false;
        this.$message.success("修改成功");
        //刷新数据
        this.getTableList();
      }
    },

    // 删除
    async delUser() {
      if (!this.selectIds) {
        this.$message.error("请勾选需要删除的用户！");
        return;
      }

      let flag = await this.$backstagePopup.asyncShow(
        `是否删除选中的管理员账号？`
      );
      if (flag) {
        const res = await userBackApiMoveRecycle({ uid: this.selectIds });
        if (res.data.code == 200) {
          this.$message.success("删除成功！");
          this.getTableList();
        }
      }
    },

    //操作
    save() {
      console.log("确定");
    },
    cancel() {
      console.log("取消");
    },

    reset() {
      this.searchName = "";
      this.page = {
        // 当前分页
        page: 1,
        // 总分页数
        page_size: 10,
        // 总条数
        total: 0,
        nickname: "",
        class_id: "",
        sex: "",
        state: "",
      };
    },

    // 选择项发生改变时
    changeSelect(changeValue) {
      console.log(changeValue);
      let strArr = [];
      if (changeValue.length !== 0) {
        for (let i = 0; i < changeValue.length; i++) {
          strArr.push(changeValue[i].id);
        }
      }
      this.selectCount = changeValue.length;
      if (changeValue.length == 0) {
        this.allSelect = false;
      } else if (changeValue.length == this.tableConfig.tableData.length) {
        this.allSelect = true;
      }
      this.selectIds = strArr.join(",");
    },
    // 清空已选择项
    clearSelect() {
      this.allSelect = !this.allSelect;
      /* if (!this.allSelect) {
        //获取表格dom;
        const tableDom = this.$refs.tableRef;
        // 全选功能
        tableDom.$children[0].clearSelection();
      } */
    },
  },
};
</script>
<style lang="less" scoped>
.administrators {
  .title-box {
    font-size: 16px;
    color: #313131;
    margin-top: 24px;
  }

  .search-box {
    height: 40px;
    display: flex;
    align-items: center;
    margin-top: 18px;

    .search-input {
      width: 315px;
      height: 40px;
      margin-right: 10px;
    }

    .search-class {
      width: 240px;
      height: 40px;
      margin-right: 10px;
    }

    button {
      margin-right: 10px;
    }

    /deep/ .el-select,
    /deep/ .el-cascader {
      .el-input__inner {
        background: #eeeeee;
        border: 1px solid #e6e6e6;
        border-radius: 6px;
      }

      .el-select-dropdown {
        left: 0px !important;
      }
    }
  }
  .name_age_sex {
    width: 150px;
    > span {
      white-space: nowrap;
    }
    ::v-deep {
      .el-select {
        width: 150px !important;
        .el-input {
          width: 150px !important;
          .el-input__inner {
            width: 150px !important;
            height: 38px !important;
            margin-left: 0;
          }
        }
      }
    }
  }
  .add-del_change {
    //width: 710px;
    height: 40px;
    display: flex;
    //justify-content: space-between;
    margin-top: 25px;

    button {
      margin-right: 10px;
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
    margin-top: 25px;
    width: 1560px;
    height: 557px;
    border-bottom: 1px solid #dddddd;

    ::v-deep {
      .el-table__row .el-table__cell {
        height: 52px;
        padding: 0;
      }

      .cell {
        overflow: hidden;

        text-align: center;

        > div {
          overflow: hidden;
          width: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .center {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .error {
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: left;
      color: #f26f61;
    }

    .nickname_row {
      display: flex;

      align-items: center;
      width: 100%;
      box-sizing: border-box;
      padding-left: 50px;

      .nick_name_text {
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: left;
        color: #333333;
        width: 50%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        margin-left: 14px;
      }

      .header_img {
        width: 34px;
        height: 34px;
        border-radius: 50%;
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
}
</style>
