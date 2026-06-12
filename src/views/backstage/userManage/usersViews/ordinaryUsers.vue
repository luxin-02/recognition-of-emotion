<template>
  <div class="ordinaryUsers">
    <div class="title-box">普通用户列表</div>
    <!-- 搜索 -->
    <div class="search-box">
      <div class="search-input">
        <inputVue v-model="searchName" placeholder="搜索关键字"></inputVue>
      </div>
      <div class="search-sex">
        <selectVue
          :options="searchSexList"
          v-model="page.sex"
          label="name"
          ItemValue="id"
          placeholder="性别"
        >
        </selectVue>
      </div>
      <div class="search-class">
        <cascaderVue
          placeholder="所在部门/班级"
          :options="this.deptList"
          v-model="page.class_id"
          label="class_name"
          ItemValue="id"
        ></cascaderVue>
      </div>
      <div class="search-state">
        <selectVue
          :options="searchStateList"
          v-model="page.state"
          label="name"
          ItemValue="id"
          placeholder="账号状态"
        >
        </selectVue>
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
        text="新增"
        v-auth="'normaluserlist/add'"
        @clickBtn="openAddUser"
      ></buttonVue>
      <buttonVue
        text="导入"
        v-auth="'normaluserlist/import'"
        backgroundColor="#8962D9"
        :iconUrl="require('@/assets/img/backstage/assembly/import.png')"
        iconSize="16,14"
        @clickBtn="importUser"
      >
      </buttonVue>
      <buttonVue
        text="修改"
        v-auth="'normaluserlist/edit'"
        @clickBtn="openEditUser"
      ></buttonVue>
      <buttonVue
        text="删除"
        v-auth="'normaluserlist/del'"
        @clickBtn="userBackApiMoveRecycle"
      ></buttonVue>
      <buttonVue
        text="处理申诉"
        v-auth="'normaluserlist/appeal'"
        backgroundColor="#ffaf00"
        :iconUrl="require('@/assets/img/backstage/assembly/appeal.png')"
        buttonSize="130,40"
        @clickBtn="openAppeal"
      >
      </buttonVue>
      <buttonVue
        text="重置密码"
        v-auth="'normaluserlist/resetpwd'"
        backgroundColor="#14C76A"
        type="reset"
        buttonSize="130,40"
        @clickBtn="userBackApiResetPassword"
      >
      </buttonVue>

      <buttonVue
        v-if="true"
        text="用户档案"
        backgroundColor="#8ebf13"
        type="record"
        buttonSize="130,40"
        @click="toDangan()"
      >
      </buttonVue>
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

        <template v-slot:deptname="row">
          {{ row.row.class_name }}
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

        <template v-slot:state="row">
          <div
            :style="
              row.row.state == 1
                ? { color: '#333' }
                : row.row.state == 3
                ? { color: '#F26F61' }
                : { color: '#F26F61' }
            "
          >
            {{
              row.row.state == 1
                ? "正常"
                : row.row.state == 3
                ? "密码申诉"
                : "账号异常"
            }}
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

    <backstage-dialog
      :isSaveLoading="isSaveLoading"
      :isAutoSaveClose="false"
      class="edit"
      :show.sync="addAndEditShow"
      :title="addAndEditType == 0 ? '新增用户信息' : '编辑用户信息'"
      @save="save"
      @cancel="cancel"
    >
      <div class="scroll">
        <div class="title">注册账号设置</div>
        <div class="register">
          <span>* 账号：</span>
          <input
            type="text"
            maxlength="20"
            :disabled="addAndEditType == 1 ? true : false"
            v-model="addAndEditObj.username"
          />

          <span>* 密码：</span>
          <div class="paw">
            <input
              maxlength="16"
              type="password"
              v-model="addAndEditObj.password"
            />
            <button @click="addAndEditObj.password = '12345'">默认</button>
          </div>
        </div>
        <div class="illustrate">
          说明：账号注册后不允许修改，密码可修改。 默认密码 12345
        </div>
        <div class="title">个人资料信息</div>
        <div class="name_age_sex">
          <span>* 姓名：</span>
          <input
            style="margin-left: 0.2rem; width: 2.10rem"
            type="text"
            maxlength="16"
            v-model="addAndEditObj.nickname"
          />
          <span>* 年龄：</span>
          <input
            type="number"
            v-model="addAndEditObj.birthdate"
            @keydown="onKeydown"
          />
          <span>* 性别：</span>
          <!-- <input type="text" v-model="addAndEditObj.sex" /> -->
          <div class="sex_box">
            <selectVue
              :options="searchSexList"
              v-model="addAndEditObj.sex"
              label="name"
              ItemValue="name"
            >
            </selectVue>
          </div>
        </div>
        <div class="unit">
          <span>单位：</span>
          <input type="text" v-model="addAndEditObj.unit" />
        </div>
        <div class="depart">
          <span>* 部门班级：</span>
          <div class="class_sele" style="margin-left: 0">
            <cascaderVue
              placeholder="所在部门/班级"
              :options="this.deptList"
              v-model="addAndEditObj.class_id"
              label="class_name"
              ItemValue="id"
            ></cascaderVue>
          </div>
          <span style="margin-left: 0">* 编号：</span>
          <input
            style="width: 1.1rem"
            maxlength="16"
            type="text"
            v-model="addAndEditObj.studentID"
          />
        </div>
        <div class="phone_career">
          <span>电话：</span>
          <input maxlength="16" type="text" v-model="addAndEditObj.phone" />
          <span>职业：</span>
          <input type="text" v-model="addAndEditObj.occupation" />
        </div>
        <div class="address">
          <span>住址：</span>
          <textarea v-model="addAndEditObj.location"></textarea>
        </div>
        <div
          class="title"
          v-if="
            $store.getters['isOpenFingerprint'] || $store.getters['isOpenFace']
          "
        >
          其它登录凭证：<span>(设备支持时有此功能)</span>
        </div>
        <div class="face_fingerprint" v-if="$store.getters['isOpenFace']">
          <span>人脸：</span>

          <el-image
            class="images"
            :src="addAndEditObj.face_img"
            alt="请录入人脸"
          >
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
                  addAndEditObj.face
                    ? require('@/assets/img/backstage/assembly/checked.png')
                    : require('@/assets/img/backstage/assembly/deny.png')
                "
              />
              {{
                addAndEditObj.face
                  ? " 用户已录入人脸信息，可用于登录。"
                  : "用户未录入人脸信息，不可用于登录。"
              }}
            </div>
            <button @click="faceShow = true">
              {{ addAndEditObj.face ? "重新录入" : "录入人脸" }}
            </button>
          </div>
        </div>
        <div
          class="face_fingerprint"
          v-if="$store.getters['isOpenFingerprint']"
        >
          <span>指纹：</span>
          <div class="fingerprint_img" style="box-sizing: border-box">
            <img
              :src="
                addAndEditObj.fingerprint
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
                  addAndEditObj.fingerprint
                    ? require('@/assets/img/backstage/assembly/checked.png')
                    : require('@/assets/img/backstage/assembly/deny.png')
                "
              />
              {{
                addAndEditObj.fingerprint
                  ? " 用户已录入指纹信息，可用于登录。"
                  : "用户未录入指纹信息，不可用于登录。"
              }}
            </div>
            <button @click="fingerprintShow = true">指纹录入</button>
          </div>
        </div>
      </div>
    </backstage-dialog>
    <!-- 录入人脸 -->
    <theFaceInput
      :face.sync="addAndEditObj.face"
      :faceImg.sync="addAndEditObj.face_img"
      :show.sync="faceShow"
    >
    </theFaceInput>
    <!-- 录入指纹 -->
    <theFingerPrintInput
      v-model="addAndEditObj.fingerprint"
      :show.sync="fingerprintShow"
    ></theFingerPrintInput>
    <!-- 密码申诉 -->
    <backstage-dialog
      :isCloseCancel="false"
      class="appeal"
      saveImgUrl=""
      cancelImgUrl=""
      cancelContent="不同意"
      saveContent="同意并重置为默认密码"
      :show.sync="appealShow"
      title="账号申诉处理"
      @save="optionsAppeal(true)"
      @cancel="optionsAppeal(false)"
    >
      <div class="content_box">
        <div class="user_account">
          <div>
            <span>用户账号：</span>
            <span style="margin-left: 0.29rem">{{
              activeAppealUser.username
            }}</span>
          </div>
          <div>
            <img src="@/assets/img/backstage/assembly/appeal2.png" alt="" />
            <span style="opacity: 0.7; color: #ff9500">密码申诉中</span>
          </div>
        </div>
        <div class="class_box">
          <span>部门/班级：</span>
          <span>{{ activeAppealUser.class_name }}</span>
        </div>
        <div class="class_box">
          <span>用户姓名：</span>
          <span>{{ activeAppealUser.nickname }}</span>
        </div>
        <div class="class_box">
          <span>人员性别：</span>
          <span>{{ activeAppealUser.sex }}</span>
        </div>
        <div class="class_box">
          <span>实际年龄：</span>
          <span>{{ activeAppealUser.birthdate }}</span>
        </div>
        <div class="reason">
          <span>申诉理由：</span>
          <textarea v-model="activeAppealUser.reason"></textarea>
        </div>
      </div>
    </backstage-dialog>
    <!-- 导入 -->
    <backstage-dialog
      class="import_box"
      :isSaveLoading="uploading"
      :isAutoSaveClose="false"
      :show.sync="importShow"
      title="用户批量导入"
      @save="userBackApiImport"
    >
      <div class="content_box">
        <span>用户模版：</span>
        <div class="download_template">
          <a :href="$ip + '/static/backend/auto_user_layout2.xlsx'"
            >2025年用户模版.xls</a
          >
          <a
            class="error"
            :href="$ip + exportUserErrorPath"
            v-if="exportUserErrorPath"
            >点击下载错误原因
          </a>
          <button>
            <a :href="$ip + '/static/backend/auto_user_layout2.xlsx'"></a>
            <img
              src="@/assets/img/backstage/assembly/importDownload.png"
              alt=""
            />
            下载
          </button>
        </div>
        <span style="margin-top: 0.29rem">导入批量文件</span>
        <div class="schedule">
          <UploadButton
            accept=".xlsx, .xls, application/vnd.ms-excel, application/vnd.open"
            @change="changeUpload"
            class="upload"
          ></UploadButton>
          <div class="click_schedule">
            <img src="@/assets/img/backstage/assembly/upload.png" alt="" />
            <a href="javascript:;">点击导入文件（只能上传.xls文件）</a>
          </div>
          <el-progress
            :class="importProgress == 100 ? 'success_progress' : ''"
            :percentage="importProgress"
          ></el-progress>
          <!-- <span v-if="importProgress < 100">文件上传中...</span> -->
        </div>
      </div>
    </backstage-dialog>

    <userDangan
      ref="userDangan"
      :userId="activeRow"
      :DanganShow.sync="DanganShow"
      v-if="DanganShow"
    ></userDangan>
  </div>
</template>

<script>
import { deptApiList } from "@/server/api/dept";
import { fileApiExcel } from "@/server/api/file";
import { trimStringProperties, copyNonEmptyProperties } from "@/utils/object";
import {
  userBackApiList,
  userBackApiResetPassword,
  userBackApiMoveRecycle,
  userNormalerBackApiAdd,
  userBackApiDetails,
  userNormalerBackApiEdit,
  userBackApiComplaints,
  userBackApiImport,
} from "@/server/api/user";
import theFaceInput from "../components/theFaceInput.vue";
import theFingerPrintInput from "../components/theFingerPrintInput.vue";
import userDangan from "../theUserProfile/index.vue";

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
  components: { theFaceInput, theFingerPrintInput, userDangan },
  async created() {
    const deptRes = await deptApiList();
    if (deptRes.data.code == 200) {
      deptRes.data.data[0].disabled = true;
      this.deptList = deptRes.data.data[0].children;
    }

    this.getTableList();
  },
  data() {
    return {
      role: 3, //默认角色
      searchName: "", //搜索的名称 点击搜索的时候会赋值给page
      deptList: [], //部门列表
      activeRow: null,
      activeAppealUser: {}, //需要处理申诉的用户
      uploadFile: "",
      uploading: false, //批量导入用户锁定
      exportUserErrorPath: "", //批量导入用户错误原因路径
      DanganShow: false,
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
      // 导入
      importShow: false,
      // 导入进度
      importProgress: 0,
      //密码申诉
      appealShow: false,
      // 申诉原因

      // 录入指纹
      fingerprintShow: false,
      // 录入人脸
      faceShow: false,
      // 编辑弹框
      addAndEditShow: false,
      // 新增编辑用户信息
      addAndEditObj: {
        username: "",
        password: "",
        nickname: "",
        birthdate: 0,
        sex: "",
        unit: "",
        studentID: "",
        phone: "",
        occupation: "",
        location: "", //住址
        class_id: [],
        face_img: "",
        fingerprint: "", //指纹
        face: "",
      },

      addAndEditType: -1, //-1 没有选择 0新增 1 编辑
      //保存锁定
      isSaveLoading: false,

      //男女
      searchSexList: [
        { name: "男", id: "男" },
        { name: "女", id: "女" },
      ],

      // 状态
      searchStateList: [
        { name: "正常", id: "1" },
        // { name: "账号异常", id: "2" },
        { name: "密码申诉", id: "3" },
      ],
      // 表格数据
      tableConfig: {
        // 是否有选择按框
        isSelect: true,
        //高亮行
        currentRow: "",
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
            label: "用户头像姓名",
            slotName: "nickname",
            type: "slot",
            width: 300,
          },
          {
            label: "所在部门/班级",
            type: "slot",
            slotName: "deptname",
            width: 200,
          },
          { label: "性别", prop: "sex" },
          {
            label: "年龄",
            prop: "birthdate",
          },
          {
            label: "注册账号",
            prop: "username",
            width: 300,
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
            label: "账号状态",
            type: "slot",
            slotName: "state",
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
    async changeUpload(file) {
      this.importProgress = 0;
      await this.$nextTick();
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });

      function isExcelFile(file) {
        // 获取文件名
        const fileName = file.name;
        // 判断文件扩展名是否为 .xlsx 或 .xls
        const fileExt = fileName.split(".").pop();
        return fileExt === "xlsx" || fileExt === "xls";
      }

      let flag = isExcelFile(file);
      if (flag) {
        this.uploadFile = file;
        this.importProgress = 100;
      } else {
        this.uploadFile = "";
        this.importProgress = 0;
        this.$message.error("请选择xlsx文件");
      }
    },
    async userBackApiImport() {
      if (!this.uploadFile) {
        this.$message.error("请选择批量上传模板");
      }

      this.uploading = true;
      this.exportUserErrorPath = "";

      try {
        const fileRes = await fileApiExcel(this.uploadFile);

        if (fileRes.data.code != 200) {
          return;
        }
        let path = fileRes.data.data;

        const res = await userBackApiImport({ file_path: path });

        if (res.data.code == 200) {
          if (res.data.data) {
            this.$message.success("导入失败");
            this.exportUserErrorPath = res.data.data;
          } else {
            // this.$message.success(res.data.msg);
            this.$message.success({
              message: res.data.msg,
              duration: 3000,
            });
            this.importShow = false;

            this.getTableList();
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.uploading = false;
      }
    },

    //重置密码
    async userBackApiResetPassword() {
      if (!this.selectIds) {
        this.$message.error("请勾选需要重置密码的用户！");
        return;
      }
      let flag = await this.$backstagePopup.asyncShow(
        `正在将选中用户的登录密码重置为默认密码（<span style="color:#2E8AE6">12345</span>），确定要继续吗？`
      );
      if (flag) {
        const res = await userBackApiResetPassword({ uid: this.selectIds });
        if (res.data.code == 200) {
          this.$message.success("重置成功！");
          this.getTableList();
        }
      }
    },
    //删除用户
    async userBackApiMoveRecycle() {
      if (!this.selectIds) {
        this.$message.error("请勾选需要删除的用户！");
        return;
      }
      let flag = await this.$backstagePopup.asyncShow(
        `是否删除选中的普通用户账号？`
      );
      if (flag) {
        const res = await userBackApiMoveRecycle({ uid: this.selectIds });
        if (res.data.code == 200) {
          this.$message.success("删除成功！");
          this.getTableList();
        }
      }
    },
    //新增或者修改用户
    async save() {
      //锁定保存操作

      try {
        this.isSaveLoading = true;

        if (this.addAndEditType == 0) {
          await this.saveAddUser();
        } else {
          await this.saveEditUser();
        }
      } catch (error) {
        console.error(error);
        //解锁
        this.isSaveLoading = false;
      }

      //解锁
      this.isSaveLoading = false;
    },
    //保存创建用户
    async saveAddUser() {
      let params = { ...this.addAndEditObj };
      //判断class_id是否是数组 如果是数组的话取最后一个的值
      if (Array.isArray(params.class_id) && params.class_id.length > 0) {
        params.class_id = params.class_id[params.class_id.length - 1];
      }
      //判断fingerprint是否是数组 如果是数组的话取最后一个的值
      if (Array.isArray(params.fingerprint) && params.fingerprint.length > 0) {
        params.fingerprint = params.fingerprint[params.fingerprint.length - 1];
      }

      //去掉字符串左右空格
      params = trimStringProperties(params);

      //验证新增用户数据是否正常
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

        if (params.class_id == "") {
          this.$message.error("请选择所在部门/班级");
          return false;
        }

        if (params.studentID == "") {
          this.$message.error("请输入编号");
          return false;
        }

        return true;
      };

      let flag = validity(params);

      if (!flag) {
        return;
      }
      //将年龄转成出生日期
      params.date_of_birth = this.$getTime(
        convertAgeToDate(parseInt(params.birthdate))
      );

      const res = await userNormalerBackApiAdd(params);
      if (res.data.code == 200) {
        this.addAndEditShow = false;
        this.$message.success("新增成功");
        //刷新数据
        this.getTableList();
      }
    },
    //保存修改用户
    async saveEditUser() {
      let params = { ...this.addAndEditObj };
      //判断class_id是否是数组 如果是数组的话取最后一个的值
      if (Array.isArray(params.class_id) && params.class_id.length > 0) {
        params.class_id = params.class_id[params.class_id.length - 1];
      }
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

        if (params.class_id == "") {
          this.$message.error("请选择所在部门/班级");
          return false;
        }

        if (params.studentID == "") {
          this.$message.error("请输入编号");
          return false;
        }

        return true;
      };

      let flag = validity(params);

      if (!flag) {
        return;
      }

      params.date_of_birth = this.$getTime(
        convertAgeToDate(parseInt(params.birthdate))
      );

      const res = await userNormalerBackApiEdit(params);

      if (res.data.code == 200) {
        this.addAndEditShow = false;
        this.$message.success("修改成功");
        //刷新数据
        this.getTableList();
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
      this.tableConfig.tableData = [];
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
    currentChange(row) {
      this.activeRow = row;
    },
    openAddUser() {
      this.addAndEditType = 0;
      this.addAndEditObj = {
        username: "",
        password: "",
        nickname: "",
        birthdate: 0,
        sex: "",
        unit: "",
        studentID: "",
        phone: "",
        occupation: "",
        location: "", //住址
        class_id: [],
        face_img: "",
        fingerprint: "", //指纹
        face: "",
      };
      this.addAndEditShow = true;
    },

    //修改
    async openEditUser() {
      if (!this.activeRow) {
        this.$message.error("请选择需要修改的行！");
        return;
      }

      let addAndEditObj = {
        username: "",
        password: "",
        nickname: "",
        birthdate: 0,
        sex: "",
        unit: "",
        studentID: "",
        phone: "",
        occupation: "",
        location: "", //住址
        class_id: [],
        face_img: "",
        fingerprint: "", //指纹
        face: "",
      };

      const res = await userBackApiDetails({ uid: this.activeRow.id });
      if (res.data.code == 200) {
        addAndEditObj = copyNonEmptyProperties(addAndEditObj, res.data.data);
        let object = res.data.data;
        addAndEditObj.password = "";
        addAndEditObj.uid = this.activeRow.id;
        //部门数组赋值包括其父亲

        let classid = res.data.data.depts.length
          ? res.data.data.depts[0].id
          : "";
        let parent = this.findParentNodes(
          (node) => node.id == classid,
          this.deptList[0]
        ).map((v) => v.id);
        parent.push(classid);
        addAndEditObj.class_id = parent;
        this.addAndEditObj = addAndEditObj;

        this.addAndEditType = 1;
        this.addAndEditShow = true;
      }
    },

    // 导入
    importUser() {
      this.uploading = false;
      this.importProgress = 0;
      this.uploadFile = false;
      this.importShow = true;
      this.exportUserErrorPath = "";
    },

    //申诉
    async openAppeal() {
      if (!this.activeRow) {
        this.$message.error("请选择需要处理的用户！");
        return;
      }

      if (this.activeRow.state != 3) {
        this.$message.error("该用户不属于申诉状态！");
        return;
      }

      let uid = this.activeRow.id;

      const res = await userBackApiComplaints({ uid });

      if (res.data.code == 200) {
        this.appealShow = true;
        this.activeAppealUser = res.data.data;
        this.activeAppealUser.class_name = this.activeRow.class_name;
      }
    },
    //是否同意
    async optionsAppeal(flag) {
      let uid = this.activeRow.id;

      const res = await userBackApiComplaints({ uid, opinion: flag ? 1 : 2 });
      if (res.data.code == 200) {
        this.$message.success("处理成功！");
        this.getTableList();
        return;
      }
    },

    cancel() {},

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

    toDangan() {
      if (!this.activeRow) {
        this.$message.error("请选择用户！");
        return;
      }
      this.DanganShow = true;
      // this.$router.push({ path: "/dangan", query: { id: this.activeRow.id } });
    },
  },
};
</script>
<style lang="less" scoped>
.ordinaryUsers {
  .title-box {
    font-size: 16px;
    color: #313131;
    margin-top: 24px;
  }

  .search-box {
    width: 1115px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 18px;

    .search-input {
      width: 315px;
      height: 40px;
    }

    .search-sex {
      width: 160px;
      height: 40px;
    }

    .search-class {
      width: 240px;
      height: 40px;
    }

    .search-state {
      width: 160px;
      height: 40px;
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
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: left;
    color: #333333;

    ::v-deep {
      .el-table__row .el-table__cell {
        height: 52px;
        padding: 0;
      }

      .cell {
        text-align: center;
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
      margin-left: 16px;
    }

    .text {
      color: #333333;
      font-size: 16px;
      margin: 0 34px 0 10px;
    }
  }

  ::v-deep .sex_box {
    .el-select {
      .el-input {
        .el-input__inner {
          width: 150px !important;
          height: 38px !important;
          margin-left: 0;
        }
      }
    }
  }
  ::v-deep .class_sele {
    .selectTool {
      width: 470px;
    }
  }
}
</style>
