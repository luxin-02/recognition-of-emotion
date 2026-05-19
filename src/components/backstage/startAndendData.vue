<template>
  <div class="block">
    <el-date-picker
      v-model="startData"
      type="date"
      :placeholder="startPlaceholder"
      value-format="yyyy-MM-dd"
      @focus="isFocus = false"
      @blur="isFocus = true"
    >
    </el-date-picker>
    <img
      src="@/assets/img/backstage/assembly/select.png"
      alt=""
      class="sele"
      :style="isFocus ? 'transform:rotate(0deg)' : 'transform:rotate(180deg)'"
    />

    <img
      src="@/assets/img/backstage/assembly/separate.png"
      alt=""
      class="separate"
    />

    <el-date-picker
      v-model="endData"
      type="date"
      :placeholder="endPlaceholder"
      value-format="yyyy-MM-dd"
      @focus="isFocus2 = false"
      @blur="isFocus2 = true"
    >
    </el-date-picker>
    <img
      src="@/assets/img/backstage/assembly/select.png"
      alt=""
      class="sele2"
      :style="isFocus2 ? 'transform:rotate(0deg)' : 'transform:rotate(180deg)'"
    />
  </div>
</template>

<script>
const formatDateYYYYMMDDHMS = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const house = date.getHours();
  const minute = date.getMinutes();

  return year + "-" + month + "-" + day + " " + house + ":" + minute;
};
export default {
  data() {
    return {
      startData: "",
      endData: "",
      isFocus: true,
      isFocus2: true,
    };
  },
  //开始时间戳，结束时间戳，开始提示文字，结束提示文字
  props: ["startTime", "endTime", "startPlaceholder", "endPlaceholder"],
  computed: {},
  watch: {
    startTime(n_val) {
      this.startData = n_val;
    },
    endTime(n_val) {
      this.endData = n_val;
    },
    startData(newVal) {
      this.$emit("changeStartData", newVal);

      this.$emit("update:startTime", newVal);
    },
    endData(newVal) {
      let time = new Date(newVal);
      time.setHours(23, 59, 59);
      let str = formatDateYYYYMMDDHMS(time);
      if (this.startData && this.endData) {
        if (this.startData > this.endData) {
          this.$message.error("结束时间不能小于开始时间");
          this.endData = "";
          return;
        }

        this.$emit("changeEndData", str);
        this.$emit("update:endTime", str);
      } else if (this.endData && !this.startData) {
        this.$emit("changeEndData", str);
        this.$emit("update:endTime", str);
      }
    },
  },

  methods: {},

  mounted() {},

  created() {},
};
</script>
<style lang="less" scoped>
.block {
  width: 100%;
  height: 100%;
  border: 1px solid #e6e6e6;
  background: #eeeeee;
  border-radius: 6px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  position: relative;

  /deep/ .el-date-editor {
    width: 173px;

    //background: #eeeeee;
    .el-input__inner {
      background: #eeeeee;
      border: none;
      outline: none;
      padding: 0 0 0 55px;
      font-size: 16px;
      color: #000000;
    }

    &:nth-of-type(1) .el-input__inner {
      background-image: url("~@/assets/img/backstage/assembly/data.png");
      background-size: 0.16rem 0.16rem;
      background-repeat: no-repeat;
      background-position: 0.12rem center;
    }

    .el-input__prefix {
      display: none;
    }

    .el-input__suffix {
      display: none;
    }
  }

  .sele {
    display: block;
    width: 8px;
    height: 4px;
    position: absolute;
    left: 164px;
  }

  .sele2 {
    display: block;
    width: 8px;
    height: 4px;
    position: absolute;
    right: 16px;
  }

  .separate {
    position: absolute;
    display: block;
    width: 2px;
    height: 10px;
    left: 188px;
    z-index: 10;
  }
}
</style>
