<template>
  <div class="consultant">
    <div class="title-box">咨询师账号列表</div>
    <!-- 搜索 -->
    <div class="search-box">
      <div class="search-input">
        <inputVue v-model="searchName" placeholder="搜索关键字"></inputVue>
      </div>
      <div class="search-class">
        <selectVue
          :options="tagList"
          v-model="page.label"
          label="title"
          ItemValue="id"
          placeholder="按标签筛选"
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
      <buttonVue text="新增" @clickBtn="openAddUser"></buttonVue>

      <buttonVue text="修改" @clickBtn="openEditUser"></buttonVue>
      <buttonVue text="删除" @clickBtn="delUser"></buttonVue>

      <buttonVue
        text="咨询师排班"
        backgroundColor="#FFAF00"
        buttonSize="140,40"
        @clickBtn="consultantScheduling"
      ></buttonVue>
    </div>
    <div class="total">当前列表共有数据：{{ page.total }}条</div>

    <div class="table">
      <tableVue
        :loading="loading.table"
        @currentChange="
          (row) => {
            activeRow = row;
          }
        "
        :tableConfig="tableConfig"
        ref="tableRef"
        @changeSelect="changeSelect"
      >
        <template v-slot:nickname="row">
          <!-- <img src="@/assets/img/搜索.png" style="width: 0.34rem;height: 0.34rem; border-radius:50%" alt=""> -->
          {{ row.row.nickname }}
        </template>

        <template v-slot:face="row">
          <img
            :src="
              row.row.face
                ? require('@/assets/img/backstage/assembly/checked.png')
                : require('@/assets/img/backstage/assembly/unChecked.png')
            "
            style="width: 0.16rem; height: 0.16rem"
            alt=""
          />
        </template>

        <template v-slot:fingerprint="row">
          <img
            :src="
              row.row.fingerprint
                ? require('@/assets/img/backstage/assembly/checked.png')
                : require('@/assets/img/backstage/assembly/unChecked.png')
            "
            style="width: 0.16rem; height: 0.16rem"
            alt=""
          />
        </template>

        <template #level="{ row }">
          <div class="level_row">
            <img
              v-if="item"
              v-for="(item, i) in row.tags"
              :src="$ip + item.img_url"
            />
          </div>
        </template>

        <template v-slot:scheduling="{ row }">
          <div
            :style="
              row.is_working == 1
                ? {
                    background: '#d1f4f1',
                    color: '#1BC7BA',
                    border: '1px solid #1bc7ba',
                    width: '1.2rem',
                    height: '0.28rem',
                  }
                : {
                    background: 'rgba(255,234,204,0.50)',
                    color: '#ff9500',
                    border: '1px solid #ff9500',
                    width: '1.2rem',
                    height: '0.28rem',
                  }
            "
          >
            {{ row.is_working == 1 ? "已排班" : "未排班" }}
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

    <!-- 咨询师新增 -->
    <backstage-dialog
      :is-save-loading="loading.add"
      :isAutoSaveClose="false"
      class="edit_consultant"
      :show.sync="addFormShow"
      title="新增咨询师信息"
      @save="save"
    >
      <div class="scroll">
        <div class="title">咨询师注册账号</div>
        <div class="register">
          <span>账号：</span>
          <input type="text" v-model="addUserEditForm.username" />

          <span>密码：</span>
          <div class="paw">
            <input type="password" v-model="addUserEditForm.password" />
            <button @click="addUserEditForm.password = '12345'">默认</button>
          </div>
        </div>
        <div class="illustrate">说明：账号注册后不允许修改，密码可修改。</div>
        <div class="title">咨询师个人资料</div>
        <div class="name_age_sex">
          <span>姓名：</span>
          <input
            style="width: 1.5rem"
            type="text"
            v-model="addUserEditForm.nickname"
            maxlength="11"
          />
          <span>职位：</span>
          <input
            style="margin-left: 0.06rem"
            type="text"
            v-model="addUserEditForm.occupation"
            maxlength="12"
          />
          <span>从业工龄：</span>
          <input type="text" v-model="addUserEditForm.position" />
          <span>性别：</span>
          <!-- <input type="text" v-model="addUserEditForm.sex" /> -->

          <div style="width: 1rem" class="sex_wrap">
            <selectVue
              :options="searchSexList"
              v-model="addUserEditForm.sex"
              label="name"
              ItemValue="id"
              placeholder="性别"
            >
            </selectVue>
          </div>
        </div>
        <div class="introduction">
          <span>简介：</span>
          <textarea v-model="addUserEditForm.remark"></textarea>
        </div>
        <div class="user_img">
          <span>用户照片：</span>
          <div class="img_box">
            <img
              style="width: 3rem; height: 3rem"
              :src="$ip + addUserEditForm.avatar"
              alt=""
              v-if="addUserEditForm.avatar"
            />
            <span v-else>暂无图片</span>
          </div>
          <div class="upload">
            <div class="el-upload__tip">
              说明：上传图片格式为.jpg或.png，建议尺寸不小于300px*300px。
            </div>
            <el-upload
              v-loading="loading.file"
              :accept="'.png,.jpg,.jpeg'"
              class="uploader"
              action=""
              :show-file-list="false"
              :auto-upload="false"
              :on-change="consultantUpload"
            >
              <el-button size="small">本地上传</el-button>
            </el-upload>
          </div>
        </div>
        <div class="add-label">
          <span>添加标签：</span>
          <div class="add-select">
            <selectVue
              :options="addTagList"
              v-model="addUserEditForm.activeSelectLabel"
              label="title"
              ItemValue="id"
            >
            </selectVue>
          </div>
          <button @click="selectLabel">确定添加</button>
        </div>
        <div class="notes-box">
          注：请根据咨询师专业或擅长技能选择对应的标签。
        </div>
        <div class="label-list">
          <span>已有标签：</span>
          <div class="label-list_box">
            <div v-for="(item, i) in addUserEditForm.labels">
              {{ item.title }}

              <img
                @click="addUserEditForm.labels.splice(i, 1)"
                src="@/assets/img/backstage/assembly/fork.png"
                alt=""
              />
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

          <el-image
            class="images fingerprint_img"
            :src="addUserEditForm.face_img"
            alt="请录入人脸"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="face_fingerprint_btn">
            <div class="enter_or_not">
              <img
                :src="
                  addUserEditForm.face
                    ? require('@/assets/img/backstage/assembly/checked.png')
                    : require('@/assets/img/backstage/assembly/deny.png')
                "
              />
              {{
                addUserEditForm.face
                  ? " 用户已录入人脸信息，可用于登录。"
                  : "用户未录入人脸信息，不可用于登录。"
              }}
            </div>
            <button @click="faceShow = true">
              {{ addUserEditForm.face ? "重新录入" : "录入人脸部" }}
            </button>
          </div>
        </div>
        <div class="face_fingerprint" v-if="$store.getters.isOpenFingerprint">
          <span>指纹：</span>
          <div class="fingerprint_img">
            <img
              :src="
                addUserEditForm.fingerprint
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
                  addUserEditForm.fingerprint
                    ? require('@/assets/img/backstage/assembly/checked.png')
                    : require('@/assets/img/backstage/assembly/deny.png')
                "
              />
              {{
                addUserEditForm.fingerprint
                  ? " 用户已录入指纹信息，可用于登录。"
                  : "用户未录入指纹信息，不可用于登录。"
              }}
            </div>
            <button @click="fingerprintShow = true">指纹录入</button>
          </div>
        </div>
      </div>
    </backstage-dialog>

    <!-- 咨询师修改 -->
    <backstage-dialog
      :is-save-loading="loading.edit"
      :isAutoSaveClose="false"
      class="edit_consultant"
      :show.sync="editConsultantShow"
      title="编辑咨询师信息"
      @save="editUser"
    >
      <div class="scroll">
        <div class="title">咨询师注册账号</div>
        <div class="register">
          <span>账号：</span>
          <input
            :disabled="true"
            type="text"
            v-model="addUserEditForm.username"
          />

          <span>密码：</span>
          <div class="paw">
            <input type="password" v-model="addUserEditForm.password" />
            <button @click="addUserEditForm.password = '12345'">默认</button>
          </div>
        </div>
        <div class="illustrate">说明：账号注册后不允许修改，密码可修改。</div>
        <div class="title">咨询师个人资料</div>
        <div class="name_age_sex">
          <span>姓名：</span>
          <input
            style="width: 1.5rem"
            type="text"
            v-model="addUserEditForm.nickname"
          />
          <span>职位：</span>
          <input
            type="text"
            style="margin-left: 0.06rem"
            v-model="addUserEditForm.occupation"
          />
          <span>从业工龄：</span>
          <input type="text" v-model="addUserEditForm.position" />
          <span>性别：</span>
          <!-- <input type="text" v-model="addUserEditForm.sex" /> -->
          <div style="width: 1rem" class="sex_wrap">
            <selectVue
              :options="searchSexList"
              v-model="addUserEditForm.sex"
              label="name"
              ItemValue="id"
              placeholder="性别"
            >
            </selectVue>
          </div>
        </div>
        <div class="introduction">
          <span>简介：</span>
          <textarea v-model="addUserEditForm.remark"></textarea>
        </div>
        <div class="user_img">
          <span>用户照片：</span>
          <div class="img_box">
            <img
              style="width: 3rem; height: 3rem"
              :src="$ip + addUserEditForm.avatar"
              alt=""
              v-if="addUserEditForm.avatar"
            />
            <span v-else>暂无图片</span>
          </div>
          <div class="upload">
            <div class="el-upload__tip">
              说明：上传图片格式为.jpg或.png，建议尺寸不小于300px*300px。
            </div>
            <el-upload
              v-loading="loading.file"
              :accept="'.png,.jpg,.jpeg'"
              class="uploader"
              action=""
              :show-file-list="false"
              :auto-upload="false"
              :on-change="consultantUpload"
            >
              <el-button size="small">本地上传</el-button>
            </el-upload>
          </div>
        </div>
        <div class="add-label">
          <span>添加标签：</span>
          <div class="add-select">
            <selectVue
              :options="addTagList"
              v-model="addUserEditForm.activeSelectLabel"
              label="title"
              ItemValue="id"
            >
            </selectVue>
          </div>
          <button @click="selectLabel">确定添加</button>
        </div>
        <div class="notes-box">
          注：请根据咨询师专业或擅长技能选择对应的标签。
        </div>
        <div class="label-list">
          <span>已有标签：</span>
          <div class="label-list_box">
            <div v-for="(item, i) in addUserEditForm.labels">
              {{ item.title }}

              <img
                @click="addUserEditForm.labels.splice(i, 1)"
                src="@/assets/img/backstage/assembly/fork.png"
                alt=""
              />
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

          <el-image
            class="images fingerprint_img"
            :src="addUserEditForm.face_img"
            alt="请录入人脸"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="face_fingerprint_btn">
            <div class="enter_or_not">
              <img
                :src="
                  addUserEditForm.face
                    ? require('@/assets/img/backstage/assembly/checked.png')
                    : require('@/assets/img/backstage/assembly/deny.png')
                "
              />
              {{
                addUserEditForm.face
                  ? " 用户已录入人脸信息，可用于登录。"
                  : "用户未录入人脸信息，不可用于登录。"
              }}
            </div>
            <button @click="faceShow = true">
              {{ addUserEditForm.face ? "重新录入" : "录入人脸部" }}
            </button>
          </div>
        </div>
        <div class="face_fingerprint" v-if="$store.getters.isOpenFingerprint">
          <span>指纹：</span>
          <div class="fingerprint_img">
            <img
              :src="
                addUserEditForm.fingerprint
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
                  addUserEditForm.fingerprint
                    ? require('@/assets/img/backstage/assembly/checked.png')
                    : require('@/assets/img/backstage/assembly/deny.png')
                "
              />
              {{
                addUserEditForm.fingerprint
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
      :face.sync="addUserEditForm.face"
      :faceImg.sync="addUserEditForm.face_img"
      :show.sync="faceShow"
    ></theFaceInput>
    <!-- 录入指纹 -->
    <theFingerPrintInput
      v-model="addUserEditForm.fingerprint"
      :show.sync="fingerprintShow"
    ></theFingerPrintInput>

    <!-- 咨询师排班 -->
    <backstage-dialog
      :isbtn="false"
      class="consultant_scheduling"
      :show.sync="consultantSchedulingShow"
      title="咨询师排班设定"
    >
      <div class="scroll">
        <div class="scheduling_obj">
          <h3>排班对象：</h3>
          <span>{{ activeRow ? activeRow.nickname : "" }}</span>
        </div>
        <div class="scheduling_date">
          <span>日期：</span>
          <DateVue
            :picker-options="startPickerOptions"
            v-model="scheduleForm.start_time"
          />
          <div class="divider">~</div>
          <DateVue
            :picker-options="endDatePickerOptions"
            v-model="scheduleForm.end_time"
          />
        </div>
        <div class="scheduling_am_pm">
          <span>上午：</span>
          <selectVue
            :options="am"
            label="name"
            ItemValue="id"
            v-model="scheduleForm.am_start_time"
          >
          </selectVue>
          <div class="divider">~</div>
          <selectVue
            :options="am"
            label="name"
            ItemValue="id"
            v-model="scheduleForm.am_end_time"
          >
          </selectVue>
          <span>下午：</span>
          <selectVue
            :options="pm"
            label="name"
            ItemValue="id"
            v-model="scheduleForm.pm_start_time"
          >
          </selectVue>
          <div class="divider">~</div>
          <selectVue
            :options="pm"
            label="name"
            ItemValue="id"
            v-model="scheduleForm.pm_end_time"
          >
          </selectVue>
          <button v-loading="loading.schedule" @click="schedulingForm">
            批量排班
          </button>
        </div>
        <div class="stop_scheduling_title">
          <div></div>
          <span>已排班情况</span>
          <div></div>
        </div>
        <div class="stop_scheduling_content">
          <div class="content_left" v-loading="loading.month">
            <div class="content_left_top">
              <img
                style="cursor: pointer"
                @click="getPreviousOrNextMonthDate(true)"
                src="@/assets/img/backstage/assembly/left.png"
              />
              <span>{{ monthStr }}</span>
              <img
                style="cursor: pointer"
                @click="getPreviousOrNextMonthDate(false)"
                src="@/assets/img/backstage/assembly/right.png"
              />
            </div>
            <div class="day_list">
              <template v-if="monthDetails.dayList.length">
                <div
                  class="item"
                  v-for="(item, i) in monthDetails.dayList[0].week == 0
                    ? monthDetails.dayList[0].week
                    : monthDetails.dayList[0].week - 1"
                  :key="i"
                ></div>
              </template>

              <div
                class="item"
                @click="selectDate(item)"
                :class="[
                  item.isWorker ? 'work' : '',
                  item.date == activeSelectDay.date ? 'select' : '',
                ]"
                v-for="(item, i) in monthDetails.dayList"
                :key="i"
              >
                {{ item.day }}
              </div>
            </div>
          </div>
          <div class="content_right">
            <div class="content_right_top">
              排班日期：{{ activeSelectDateStr }}
              <button
                @click="removeWork(activeSelectDay)"
                v-if="activeSelectDay.isWorker"
              >
                删除排班
              </button>
            </div>

            <div class="scheduling_date_details">
              <div class="content_right_list">
                <div
                  class="i"
                  v-if="
                    isTimeRangeOverlap(
                      activeSelectDay.am_start_time,
                      activeSelectDay.am_end_time,
                      8,
                      9
                    )
                  "
                >
                  8:00-9:00
                  <img
                    v-if="activeSelectDay.hours.some((v) => v == 8)"
                    src="@/assets/img/backstage/assembly/checked.png"
                  />
                </div>
                <div
                  class="i"
                  v-if="
                    isTimeRangeOverlap(
                      activeSelectDay.am_start_time,
                      activeSelectDay.am_end_time,
                      9,
                      10
                    )
                  "
                >
                  9:00-10:00
                  <img
                    v-if="activeSelectDay.hours.some((v) => v == 9)"
                    src="@/assets/img/backstage/assembly/checked.png"
                  />
                </div>
                <div
                  class="i"
                  v-if="
                    isTimeRangeOverlap(
                      activeSelectDay.am_start_time,
                      activeSelectDay.am_end_time,
                      10,
                      11
                    )
                  "
                >
                  10:00-11:00
                  <img
                    v-if="activeSelectDay.hours.some((v) => v == 10)"
                    src="@/assets/img/backstage/assembly/checked.png"
                  />
                </div>
                <div
                  class="i"
                  v-if="
                    isTimeRangeOverlap(
                      activeSelectDay.am_start_time,
                      activeSelectDay.am_end_time,
                      11,
                      12
                    )
                  "
                >
                  11:00-12:00
                  <img
                    v-if="activeSelectDay.hours.some((v) => v == 11)"
                    src="@/assets/img/backstage/assembly/checked.png"
                  />
                </div>
                <div
                  class="i"
                  v-if="
                    isTimeRangeOverlap(
                      activeSelectDay.pm_start_time,
                      activeSelectDay.pm_end_time,
                      14,
                      15
                    )
                  "
                >
                  14:00-15:00
                  <img
                    v-if="activeSelectDay.hours.some((v) => v == 12)"
                    src="@/assets/img/backstage/assembly/checked.png"
                  />
                </div>
                <div
                  class="i"
                  v-if="
                    isTimeRangeOverlap(
                      activeSelectDay.pm_start_time,
                      activeSelectDay.pm_end_time,
                      15,
                      16
                    )
                  "
                >
                  15:00-16:00
                  <img
                    v-if="activeSelectDay.hours.some((v) => v == 15)"
                    src="@/assets/img/backstage/assembly/checked.png"
                  />
                </div>
                <div
                  class="i"
                  v-if="
                    isTimeRangeOverlap(
                      activeSelectDay.pm_start_time,
                      activeSelectDay.pm_end_time,
                      16,
                      17
                    )
                  "
                >
                  16:00-17:00
                  <img
                    v-if="activeSelectDay.hours.some((v) => v == 16)"
                    src="@/assets/img/backstage/assembly/checked.png"
                  />
                </div>

                <div
                  class="i"
                  v-if="
                    isTimeRangeOverlap(
                      activeSelectDay.pm_start_time,
                      activeSelectDay.pm_end_time,
                      17,
                      18
                    )
                  "
                >
                  17:00-18:00
                  <img
                    v-if="activeSelectDay.hours.some((v) => v == 17)"
                    src="@/assets/img/backstage/assembly/checked.png"
                  />
                </div>
              </div>
              <div class="tips_box">
                <img src="@/assets/img/backstage/assembly/checked.png" />
                <span>表示已被用户预约，已预约的排期无法删除。</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </backstage-dialog>
  </div>
</template>

<script>
import {
  userBackApiDetails,
  userBackApiList,
  userBackApiMoveRecycle,
} from "@/server/api/user";
import {
  ConsultantApiGetLabels,
  ConsultantApiAddConsultant,
  ConsultantApiEditConsultant,
} from "@/server/api/consultant";
import { fileApiImage } from "@/server/api/file";
import theFaceInput from "@/views/backstage/userManage/components/theFaceInput.vue";
import theFingerPrintInput from "@/views/backstage/userManage/components/theFingerPrintInput.vue";
import { copyNonEmptyProperties } from "@/utils/object";
import DateVue from "@/components/backstage/DateVue.vue";
import { formatDate2 } from "@/utils/time";
import {
  workDayApiBatchadd,
  workDayApiList,
  workDayApiRemove,
} from "@/server/api/workday";

function getMonthDates(currentDate) {
  const year = currentDate.getFullYear(); // 获取当前年份
  const month = currentDate.getMonth(); // 获取当前月份

  const firstDay = new Date(year, month, 1); // 当月第一天
  const lastDay = new Date(year, month + 1, 0); // 当月最后一天

  const dates = [];
  for (let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
    dates.push(new Date(year, month, i));
  }

  return dates;
}

function compareDate(date, date2) {
  let day1 = parseInt(date.getTime() / 1000 / 60 / 60 / 24);

  let day2 = parseInt(date2.getTime() / 1000 / 60 / 60 / 24);
  return day1 > day2 ? 1 : day1 == day2 ? 0 : -1;
}

function isTimeRangeOverlap(start1, end1, start2, end2) {
  // 判断是否重合
  if (start1 <= end2 && start2 <= end1) {
    return true; // 重合
  } else {
    return false; // 不重合
  }
}

export default {
  components: { DateVue, theFingerPrintInput, theFaceInput },
  data() {
    return {
      startPickerOptions: {
        disabledDate(time) {
          const today = new Date(); // 获取当前日期
          today.setHours(0, 0, 0, 0); // 将时间部分设置为0，只保留日期部分

          return time.getTime() < today.getTime(); // 禁用过去的日期
        },
      },
      searchName: "",
      addFormShow: false,
      role: 4,
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
        label: "",
      },
      loading: {
        file: false,
        add: false,
        edit: false,
        schedule: false,
        month: false,
        table: false,
      },
      addUserEditForm: {
        username: "",
        password: "",
        nickname: "",
        sex: "",
        labels: [],
        activeSelectLabel: "",
        remark: "",
        position: 0,
        avatar: "",
        face: "",
        face_img: "",
        fingerprint: "",
        occupation: "",
      },
      activeRow: null,
      //咨询师
      // 编辑
      editConsultantShow: false,
      //排班
      consultantSchedulingShow: false,
      scheduleForm: {
        start_time: "",
        end_time: "",
        am_start_time: "",
        am_end_time: "",
        pm_start_time: "",
        pm_end_time: "",
      },
      monthDetails: {
        date: new Date(),
        dayList: [],
      },
      activeSelectDay: {
        date: "",
        isWorker: false,
        hours: [],
      },
      searchSexList: [
        { name: "男", id: "男" },
        { name: "女", id: "女" },
      ],

      //上午
      am: [
        // {name: '6时', id: 6},
        // {name: '7时', id: 7},
        { name: "8时", id: 8 },
        { name: "9时", id: 9 },
        { name: "10时", id: 10 },
        { name: "11时", id: 11 },
        { name: "12时", id: 12 },
      ],
      pm: [
        // {name: '12时', id: 12},
        // {name: '13时', id: 13},
        { name: "14时", id: 14 },
        { name: "15时", id: 15 },
        { name: "16时", id: 16 },
        { name: "17时", id: 17 },
        // {name: '18时', id: 18},
      ],
      // 录入指纹
      fingerprintShow: false,
      // 录入人脸
      faceShow: false,
      tagList: [],
      tagMap: [],
      // 表格数据
      tableConfig: {
        // 是否有选择按框
        currentRow: "",
        isSelect: true,
        // 资源分类列表
        tableData: [],
        // 每一列的标题
        headerTitle: [
          {
            label: "序号",
            type: "function",
            callback: (row) => {
              let page = this.page.page <= 0 ? 1 : this.page.page;
              return row.index + 1 + page * 9 - 9;
            },
            width: 60,
          },
          {
            label: "用户姓名",
            slotName: "nickname",
            type: "slot",
          },

          { label: "性别", prop: "sex" },

          {
            label: "工龄",
            prop: "position",
          },
          {
            label: "注册账号",
            prop: "username",
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
            label: "咨询师标签",
            type: "slot",
            slotName: "level",
            width: 200,
          },

          {
            label: "排班情况",
            type: "slot",
            slotName: "scheduling",
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
    };
  },

  computed: {
    //组合属性用于监听搜索参数自动查询
    combinedProperties() {
      return (
        this.page.sex +
        this.page.class_id +
        this.page.state +
        this.page.nickname +
        this.page.label
      );
    },
    addTagList() {
      return this.tagList.filter((v) => {
        return !this.addUserEditForm.labels.some((v2) => v.id == v2.id);
      });
    },
    endDatePickerOptions() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      return {
        disabledDate(date) {
          let date1 = new Date();
          date1.setDate(date1.getDate() - 1);

          if (date.getTime() < date1.getTime()) {
            return true;
          }
          if (that.scheduleForm.start_time) {
            return (
              compareDate(new Date(that.scheduleForm.start_time), date) > 0
            );
          }
          return false;
        },
      };
    },
    monthStr() {
      return formatDate2(this.monthDetails.date, "yyyy年MM月");
    },
    activeSelectDateStr() {
      return this.activeSelectDay.date
        ? formatDate2(this.activeSelectDay.date, "yyyy年MM月dd日")
        : "请选择日期";
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
    "scheduleForm.start_time"(nvl) {
      if (nvl && this.scheduleForm.end_time) {
        let end_date = new Date(this.scheduleForm.end_time); //结束时间
        let start_date = new Date(nvl);
        if (compareDate(start_date, end_date) >= 1) {
          this.scheduleForm.end_time = "";
        }
      }
    },
  },

  methods: {
    isTimeRangeOverlap,
    async removeWork(activeSelectDay) {
      if (activeSelectDay.hours.length) {
        this.$message.error("该时间段已经有用户预约无法删除！");
        return;
      }
      try {
        const res = await workDayApiRemove({ id: activeSelectDay.id });
        if (res.data.code == this.$global.successCode) {
          this.activeSelectDay = this.$options.data().activeSelectDay;
          this.$message.success("删除成功");
          this.getMonthData();
          return;
        }
      } catch (e) {
        console.error(e);
      } finally {
      }
    },
    getPreviousOrNextMonthDate(isPreviousMonth) {
      let date = this.monthDetails.date;

      const year = date.getFullYear(); // 获取年份
      const month = date.getMonth(); // 获取月份

      let newYear, newMonth;
      if (isPreviousMonth) {
        // 上一个月
        newYear = month === 0 ? year - 1 : year;
        newMonth = month === 0 ? 11 : month - 1;
      } else {
        // 下一个月
        newYear = month === 11 ? year + 1 : year;
        newMonth = month === 11 ? 0 : month + 1;
      }

      this.monthDetails.date = new Date(newYear, newMonth, 1);
      this.monthDetails.dayList = [];
      this.getMonthData();
    },
    async schedulingForm() {
      let scheduleForm = { ...this.scheduleForm };
      if (!scheduleForm.start_time) {
        this.$message.error("请选择开始日期");
        return;
      }

      if (!scheduleForm.end_time) {
        this.$message.error("请选择结束日期");
        return;
      }
      if (!scheduleForm.am_start_time) {
        this.$message.error("请选择上午开始时间");
        return;
      }
      if (!scheduleForm.am_end_time) {
        this.$message.error("请选择上午结束时间");
        return;
      }
      if (scheduleForm.am_end_time < scheduleForm.am_start_time) {
        this.$message.error("上午结束不能小于开始时间");

        return;
      }
      if (!scheduleForm.pm_start_time) {
        this.$message.error("请选择下午开始时间");
        return;
      }
      if (!scheduleForm.pm_end_time) {
        this.$message.error("请选择下午结束时间");
        return;
      }
      if (scheduleForm.pm_end_time < scheduleForm.pm_start_time) {
        this.$message.error("下午结束不能小于开始时间");

        return;
      }
      try {
        this.loading.schedule = true;

        scheduleForm.start_time = formatDate2(
          scheduleForm.start_time,
          "yyyy-MM-dd"
        );

        scheduleForm.end_time = formatDate2(
          scheduleForm.end_time,
          "yyyy-MM-dd"
        );

        const res = await workDayApiBatchadd({ ...scheduleForm });
        if (res.data.code == this.$global.successCode) {
          this.$message.success("操作成功");
          this.getTableList();
        }
        await this.getMonthData();
      } catch (e) {
        console.error(e);
      } finally {
        this.loading.schedule = false;
      }
    },

    selectDate(item) {
      this.activeSelectDay = { ...item };
    },
    // 新增
    openAddUser() {
      this.addUserEditForm = this.$options.data().addUserEditForm;

      this.addFormShow = true;
    },
    //修改
    async openEditUser() {
      if (!this.activeRow) {
        this.$message.error("请选择需要修改的行！");
        return;
      }

      let addUserEditForm = this.$options.data().addUserEditForm;

      const res = await userBackApiDetails({ uid: this.activeRow.id });
      if (res.data.code == 200) {
        console.log(res);
        addUserEditForm = copyNonEmptyProperties(
          addUserEditForm,
          res.data.data
        );
        addUserEditForm.password = "";
        addUserEditForm.uid = this.activeRow.id;

        addUserEditForm.labels = this.activeRow.tags;

        this.addUserEditForm = addUserEditForm;
        this.editConsultantShow = true;
      }
    },

    //编辑
    async editUser() {
      //验证新增数据是否正常
      let params = { ...this.addUserEditForm };
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

        if (params.position < 0) {
          this.$message.error("请输入正确的工龄！");
          return false;
        }

        if (params.labels.length == 0) {
          this.$message.error("请选择标签！");
          return false;
        }

        return true;
      };
      let flag = validity(params);

      if (!flag) {
        return;
      }

      try {
        this.loading.edit = true;

        const res = await ConsultantApiEditConsultant({
          ...params,
          consultant_tag: params.labels.map((v) => v.id).join(","),
        });

        if (res.data.code == this.$global.successCode) {
          this.$message.success("修改成功");
          this.editConsultantShow = false;
          this.getTableList();
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading.edit = false;
      }
    },
    // 排班
    async consultantScheduling() {
      if (!this.activeRow) {
        this.$message.error("请选择需要排班的咨询师！");
        return;
      }
      this.monthDetails = this.$options.data().monthDetails;
      this.scheduleForm = this.$options.data().scheduleForm;

      this.scheduleForm.uid = this.activeRow.id;
      await this.getMonthData();

      this.consultantSchedulingShow = true;
    },
    async getMonthData() {
      let month = formatDate2(this.monthDetails.date, "yyyy-MM");
      try {
        this.loading.month = true;
        const res = await workDayApiList({
          uid: this.scheduleForm.uid,
          month,
        });
        if (res.data.code == this.$global.successCode) {
          let list = res.data.data;

          this.monthDetails.dayList = getMonthDates(this.monthDetails.date).map(
            (v) => {
              let str = formatDate2(v, "yyyy-MM-dd");
              let find = list.find((v) => v.work_day == str);
              return {
                date: v,
                week: v.getDay(),
                isWorker: find ? true : false,
                str,
                isSelect: false,
                day: v.getDate() < 0 ? "0" + v.getDate() : v.getDate(),
                pm_start_time: find ? parseInt(find.pm_start_time) : "",
                pm_end_time: find ? parseInt(find.pm_end_time) : "",
                am_end_time: find ? parseInt(find.am_end_time) : "",
                am_start_time: find ? parseInt(find.am_start_time) : "",
                hours: find && find.hours ? find.hours.split(",") : [],
                id: find ? find.id : "",
              };
            }
          );

          console.log(this.monthDetails.dayList);
        }
        console.log(res);
      } catch (e) {
        console.error(e);
      } finally {
        this.loading.month = false;
      }
    },

    // 删除
    async delUser() {
      if (!this.selectIds) {
        this.$message.error("请勾选需要删除的用户！");
        return;
      }

      let flag = await this.$backstagePopup.asyncShow(
        `是否删除选中的咨询师账号？`
      );
      if (flag) {
        const res = await userBackApiMoveRecycle({ uid: this.selectIds });
        if (res.data.code == 200) {
          this.$message.success("删除成功！");
          this.getTableList();
        }
      }
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

    //咨询师
    //上传用户头像
    async consultantUpload(file, isEdit) {
      console.log(file);
      const isJPG = file.raw.type === "image/jpeg";
      const isPNG = file.raw.type === "image/png";
      //const isLt2M = file.raw.size / 1024 / 1024 < 2;
      if (!isPNG && !isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
        return false;
      } else if (isPNG || isJPG) {
        const file1 = await this.$imgCutting.asyncShowByFile(file.raw);

        this.loading.file = true;

        try {
          const res = await fileApiImage(file);
          this.addUserEditForm.avatar = res.data.data;
        } catch (e) {
          console.error(e);
        } finally {
          this.loading.file = false;
        }
      }
    },
    //选择标签
    selectLabel() {
      if (!this.addUserEditForm.activeSelectLabel) {
        this.$message.error("请选择标签！");
        return;
      }
      if (this.addUserEditForm.labels.length >= 5) {
        this.$message.error("标签数量不能大于五个");
        return;
      }

      let find = this.tagList.find((v) => {
        return v.id == this.addUserEditForm.activeSelectLabel;
      });

      if (find) {
        this.addUserEditForm.labels.push(find);
      }

      this.addUserEditForm.activeSelectLabel = "";
    },
    //选择开始日期

    //新增操作操作
    async save() {
      //验证新增数据是否正常
      let params = { ...this.addUserEditForm };
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

        if (params.position < 0) {
          this.$message.error("请输入正确的工龄！");
          return false;
        }

        if (params.labels.length == 0) {
          this.$message.error("请选择标签！");
          return false;
        }

        //判断fingerprint是否是数组 如果是数组的话取最后一个的值
        if (
          Array.isArray(params.fingerprint) &&
          params.fingerprint.length > 0
        ) {
          params.fingerprint =
            params.fingerprint[params.fingerprint.length - 1];
        }

        return true;
      };
      let flag = validity(params);

      if (!flag) {
        return;
      }

      try {
        this.loading.add = true;

        const res = await ConsultantApiAddConsultant({
          ...params,
          consultant_tag: params.labels.map((v) => v.id).join(","),
        });

        if (res.data.code == this.$global.successCode) {
          this.$message.success("添加成功");
          this.addFormShow = false;
          this.getTableList();
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading.add = false;
      }
    },

    reset() {
      this.searchName = "";
      this.page = this.$options.data().page;
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
      // if (Array.isArray(params.class_id) && params.class_id.length > 0) {
      //   params.class_id = params.class_id[params.class_id.length - 1];
      // }

      try {
        this.loading.table = true;

        const res = await userBackApiList(params);
        if (res.data.code == 200) {
          this.page.page = res.data.data.current_page;
          this.page.total = res.data.data.total;
          this.tableConfig.tableData = res.data.data.data.map((v) => {
            return {
              ...v,
              tags: v.consultant_tag.split(",").map((item) => {
                return this.tagMap[item];
              }),
            };
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading.table = false;
      }
    },
  },

  async created() {
    const res = await ConsultantApiGetLabels();
    if (res.data.code == this.$global.successCode) {
      this.tagList = res.data.data;
      this.tagMap = [];
      this.tagList.map((v) => {
        this.tagMap[v.id] = v;
      });
    }
    this.getTableList();
  },
};
</script>
<style lang="less" scoped>
.scheduling_date_details {
  height: 258px;
  height: 258px;
  background: rgba(238, 238, 238, 0.2);
  border: 1px solid #e6e6e6;
  border-radius: 0px 0px 4px 4px;
}

.consultant {
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

    /deep/ .el-select {
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

    .level_row {
      display: flex;
      align-items: center;

      img {
        width: 26px;
        height: 26px;
        margin-right: 10px;
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

.day_list {
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  width: 340px;
  height: 258px;
  background: rgba(238, 238, 238, 0.2);
  border: 1px solid #e6e6e6;
  border-radius: 0px 0px 4px 4px;
  flex-wrap: wrap;
  box-sizing: border-box;

  .item {
    width: 36px;
    height: 36px;
    background: rgba(190, 218, 245, 0);
    border-radius: 4px;
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: left;
    color: #333333;
    cursor: pointer;
    margin-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    margin-top: 10px;

    &.work {
      background: #bedaf5;
    }

    &.select {
      width: 36px;
      height: 36px;
      background: #2e8ae6;
      border-radius: 4px;

      color: #ffffff;
    }
  }
}
.sex_wrap {
  ::v-deep {
    .el-select {
      width: 100px !important;
      .el-input {
        width: 100px !important;
        .el-input__inner {
          width: 100px !important;
          height: 38px !important;
          margin-left: 0;
          padding-right: 10px;
        }
      }
      .el-input__suffix-inner {
        display: none !important;
      }
    }
    .sele {
      right: -5px;
    }
  }
}
</style>
