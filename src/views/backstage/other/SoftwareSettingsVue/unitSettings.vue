<template>
  <div class="box">
    <!-- <span class="title-box">单位介绍及位置</span> -->
    <div class="name-num_box">
      <span>单位名称:</span>
      <input type="text" v-model="system.unit" placeholder="请输入单位名称" />
      <span>单位人数:</span>
      <input
        type="text"
        class="num"
        v-model="system.unit_number"
        placeholder="请输入单位人数"
      />
      <span>人</span>
    </div>
    <div class="websit_and_phone">
      <span>官方网站:</span>
      <input type="text" v-model="system.website" placeholder="请输入网址" />
      <span>单位电话:</span>
      <input
        type="text"
        class="num"
        v-model="system.phone"
        placeholder="请输入号码"
      />
    </div>
    <div class="position">
      <span>所在位置:</span>
      <div>
        <selectVue
          :options="provinceList"
          :value="provinceid"
          label="title"
          ItemValue="provinceId"
          placeholder="选择省"
          @changeValue="changeProvince"
        >
        </selectVue>
      </div>
      <div>
        <selectVue
          :options="cityList"
          :value="cityid"
          label="title"
          ItemValue="cityId"
          @changeValue="changeMarket"
          placeholder="选择市"
        >
        </selectVue>
      </div>
      <div>
        <selectVue
          :options="areaList"
          :value="areaid"
          label="title"
          ItemValue="areaId"
          @changeValue="changeCounty"
          placeholder="选择区域"
        >
        </selectVue>
      </div>
      <input type="text" v-model="system.addr" placeholder="请输入详细地址" />
    </div>

    <div class="brief-introduction">
      <span>单位简介:</span>
      <textarea v-model="system.text" placeholder="请输入单位简介"></textarea>
    </div>
    <div class="line"></div>
    <div class="logo">
      <span>标志/LOGO：</span>
      <div class="logo-img">
        <img :src="$ip + system.logo" alt="" v-if="system.logo" />
        <span v-else>暂无图片</span>
      </div>
      <div class="upload">
        <div class="el-upload__tip">
          说明：上传图片格式为.jpg或.png，建议尺寸不超过260px*40px。
        </div>
        <el-upload
          class="uploader"
          action=""
          :show-file-list="false"
          :auto-upload="false"
          :on-change="
            (file, fileList) => {
              imgUpload(file, fileList, 1);
            }
          "
        >
          <el-button size="small">本地上传</el-button>
        </el-upload>
      </div>
    </div>
    <div class="unit-img" v-show="false">
      <span>单位照片：</span>
      <div class="img-box">
        <div class="img-list">
          <span>封面照片一</span>
          <div class="img-content">
            <img
              :src="$ip + system.cover_photo1"
              alt=""
              v-if="system.cover_photo1"
            />
            <span v-else>暂无图片</span>
          </div>
        </div>
        <div class="img-list">
          <span>封面照片二</span>
          <div class="img-content">
            <img
              :src="$ip + system.cover_photo2"
              alt=""
              v-if="system.cover_photo2"
            />
            <span v-else>暂无图片</span>
          </div>
        </div>
      </div>
      <div class="unit-upload">
        <div class="el-upload__tip">
          说明：上传图片格式为.jpg或.png，建议尺寸不超过300px*170px。
        </div>
        <div class="upload-btn">
          <el-upload
            class="uploader"
            action=""
            :show-file-list="false"
            :auto-upload="false"
            :on-change="
              (file, fileList) => {
                imgUpload(file, fileList, 2);
              }
            "
          >
            <el-button size="small">上传图片一</el-button>
          </el-upload>
          <el-upload
            class="uploader"
            action=""
            :show-file-list="false"
            :auto-upload="false"
            :on-change="
              (file, fileList) => {
                imgUpload(file, fileList, 3);
              }
            "
          >
            <el-button size="small">上传图片二</el-button>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="line" style="margin-top: 30px"></div>
    <div class="footer">
      <button @click="sub">保存</button>
    </div>
  </div>
</template>

<script>
import {
  provinceApi,
  cityApi,
  areaApi,
  unitsettingApiSave,
  frontApiSettingInfoWithoutLogin,
} from "@/server/api/system"; //省市区、保存接口
import { userAvatorFrontApiEdit } from "@/server/api/user"; //上传图片接口
export default {
  data() {
    return {
      //省份
      provinceList: [],
      provinceid: "",
      //市
      cityList: [
        { name: "cs", id: 1 },
        { name: "gz", id: 2 },
        { name: "tj", id: 3 },
        { name: "sh", id: 4 },
        { name: "bj", id: 5 },
      ],
      cityid: "",
      // 县
      areaList: [
        { name: "hn", id: 1 },
        { name: "hd", id: 2 },
        { name: "hy", id: 3 },
        { name: "qd", id: 4 },
        { name: "ly", id: 5 },
      ],
      areaid: "",
      //logo
      logoUrl: "",
      //封面图片
      imgUrl: "",
      imgUrl2: "",
      system: {},
    };
  },

  watch: {},

  methods: {
    //获取省市区
    async getProvinceCityArea() {
      const { data } = await provinceApi();
      if (data.code == 200) {
        this.provinceList = data.data;
        this.provinceid = this.system.province;
        // 判断是否有省，有才获取下一级
        if (!this.provinceid) {
          return;
        }
        const res = await cityApi({ provinceid: this.provinceid });
        //console.log(res);
        if (res.data.code == 200) {
          this.cityList = res.data.data;
          this.cityid = this.system.city;
          // 判断是否有市，有才获取下一级
          if (!this.cityid) {
            return;
          }
          const { data: result } = await areaApi({
            provinceid: this.provinceid,
            cityid: this.cityid,
          });
          if (result.code == 200) {
            this.areaList = result.data;
            this.areaid = this.system.area;
          }
        }
      }
      // console.log(data);
    },
    //改变省
    async changeProvince(val) {
      this.provinceid = val;
      const res = await cityApi({ provinceid: this.provinceid });
      //console.log(res);
      if (res.data.code == 200) {
        this.cityList = res.data.data;
        this.cityid = "";
        this.areaList = [];
        this.areaid = "";
      }
    },
    //改变市
    async changeMarket(val) {
      this.cityid = val;
      const { data: result } = await areaApi({
        provinceid: this.provinceid,
        cityid: this.cityid,
      });
      if (result.code == 200) {
        this.areaList = result.data;
        this.areaid = "";
      }
    },
    //改变区域
    changeCounty(val) {
      this.areaid = val;
    },
    //上传logo、封面照片
    async imgUpload(file, fileList, num) {
      console.log(file, fileList, num);
      const isJPG = file.raw.type === "image/jpeg";
      const isPNG = file.raw.type === "image/png";
      //const isLt2M = file.raw.size / 1024 / 1024 < 2;
      if (!isPNG && !isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
        return false;
      } else if (isPNG || isJPG) {
        let h = 0;
        let w = 0;
        if (num == 1) {
          w = 260;
          h = 40;
        } else if (num == 2) {
          w = 100;
          h = 100;
        } else {
          w = 400;
          h = 240;
        }
        const file2 = await this.$imgCutting.asyncShowByFile(file.raw, w, h);
        this.imageToBinary(file2, num);
        //console.log(file2);
      }
    },
    //上传图片转成二进制然后走接口 参数1 file文件 参数2 用来判断是哪张图片
    async imageToBinary(file, num) {
      // console.log(file,num);
      let params = {
        file_upload: file,
      };
      const f = new FormData();
      Object.keys(params).forEach((k) => f.append(k, params[k]));
      const { data } = await userAvatorFrontApiEdit(f);
      //console.log(data);
      if (data.code == 200) {
        if (num == 1) {
          //logo
          this.system.logo = data.data;
        } else if (num == 2) {
          //封面1
          this.system.cover_photo1 = data.data;
        } else {
          //封面2
          this.system.cover_photo2 = data.data;
        }
      }
    },
    //保存
    async sub() {
      const params = {
        name: this.system.name,
        unit: this.system.unit,
        province: this.provinceid,
        city: this.cityid,
        area: this.areaid,
        addr: this.system.addr,
        unit_number: this.system.unit_number,
        text: this.system.text,
        logo: this.system.logo,
        cover_photo1: this.system.cover_photo1,
        cover_photo2: this.system.cover_photo2,
        phone: this.system.phone,
        website: this.system.website,
      };
      const { data } = await unitsettingApiSave(params);
      //console.log(data);
      if (data.code == 200) {
        this.$message.success(data.msg);
        this.getInitSet();
      }
    },
    // 获取初始设置
    async getInitSet() {
      const { data } = await frontApiSettingInfoWithoutLogin({
        version: this.version,
      });
      //console.log(data);
      if (data.code == 200) {
        //把设置存入vuex
        this.$store.commit("UPDATE_SYS_INFO", data.data);
      }
    },
  },

  mounted() {},

  created() {
    this.getProvinceCityArea();
    this.system = JSON.parse(JSON.stringify(this.$store.getters.sysInfo));
    //console.log(this.system);
  },
};
</script>
<style lang="less" scoped>
.box {
  width: 100%;
  //height: 100%;
  position: relative;
  padding-top: 29px;
  box-sizing: border-box;
  margin-bottom: 30px;
  span {
    display: block;
    color: #333333;
    font-size: 16px;
  }

  .title-box {
    margin-bottom: 28px;
  }

  .name-num_box {
    width: 1095px;
    height: 40px;
    display: flex;
    align-items: center;
    position: relative;
    box-sizing: border-box;
    span {
      margin-right: 26px;

      &:nth-of-type(2) {
        margin: 0 20px 0 22px;
      }

      &:nth-of-type(3) {
        margin: 0;
        position: absolute;
        right: 11px;
      }
    }

    input {
      width: 700px;
      height: 40px;
      background: #eeeeee;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      font-size: 14px;
    }

    .num {
      width: 190px;
    }
  }
  .websit_and_phone {
    width: 1095px;
    height: 40px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    margin-top: 20px;
    span {
      margin-right: 26px;

      &:nth-of-type(2) {
        margin: 0 20px 0 22px;
      }
    }
    input {
      width: 445px;
      height: 40px;
      background: #eeeeee;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      font-size: 14px;
    }
  }
  .position {
    width: 1095px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    box-sizing: border-box;

    span {
      margin-right: 20px;
    }

    div {
      width: 150px;
      height: 40px;

      /deep/ .el-select {
        .el-input__inner {
          background: #eeeeee;
          border: 1px solid #e6e6e6;
          border-radius: 4px;
          color: #333333;
          font-size: 14px;
        }

        .el-select-dropdown {
          left: 0px !important;
        }
      }
    }

    input {
      width: 520px;
      height: 40px;
      background: #eeeeee;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      font-size: 14px;
    }
  }

  .brief-introduction {
    width: 1095px;
    display: flex;
    margin: 20px 0 30px 0;
    box-sizing: border-box;
    span {
      margin-right: 26px;
      line-height: 35px;
    }

    textarea {
      width: 1000px;
      height: 154px;
      background: #eeeeee;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      padding: 15px;
      box-sizing: border-box;
      font-size: 14px;
    }
  }

  .line {
    height: 1px;
    background: #dddddd;
  }

  .logo {
    display: flex;
    margin-top: 30px;
    box-sizing: border-box;
    span {
      margin-right: 25px;
      line-height: 35px;
    }

    .logo-img {
      width: 260px;
      height: 146px;
      background: #eeeeee;
      border: 1px solid #dddddd;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        display: block;
        width: 260px;
        height: 42px;
      }

      span {
        opacity: 0.5;
        font-size: 14px;
        color: #333333;
      }
    }

    .upload {
      margin-left: 20px;

      .el-upload__tip {
        font-size: 14px;
        color: #333333;
        margin: 0 0 19px 0;
      }

      .uploader {
        width: 120px;
        height: 40px;

        /deep/ .el-upload {
          display: block;
          width: 120px;
          height: 40px;

          button {
            display: block;
            width: 120px;
            height: 40px;
            background: #2e8ae6;
            border-radius: 6px;
            font-size: 16px;
            color: #ffffff;
          }
        }
      }
    }
  }

  .unit-img {
    display: flex;
    margin-top: 30px;
    box-sizing: border-box;

    > span {
      margin-right: 45px;
      //line-height: 35px;
    }

    .img-box {
      width: 530px;
      display: flex;
      justify-content: space-between;

      .img-list {
        width: 260px;

        .img-content {
          width: 260px;
          height: 146px;
          background: #eeeeee;
          border: 1px solid #e6e6e6;
          border-radius: 4px;
          margin-top: 20px;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 4px;
          }

          span {
            opacity: 0.5;
            font-size: 14px;
            color: #333333;
          }
        }
      }
    }

    .unit-upload {
      margin: 35px 0 0 20px;

      .el-upload__tip {
        font-size: 14px;
        color: #333333;
        //margin: 0 0 19px 0;
      }

      .upload-btn {
        display: flex;
        width: 260px;
        height: 40px;
        justify-content: space-between;
        margin-top: 20px;
        .uploader {
          width: 120px;
          height: 40px;

          /deep/ .el-upload {
            display: block;
            width: 120px;
            height: 40px;

            button {
              display: block;
              width: 120px;
              height: 40px;
              background: #2e8ae6;
              border-radius: 6px;
              font-size: 16px;
              color: #ffffff;
            }
          }
        }
      }
    }
  }
  .footer {
    //height: 110px;
    width: 100%;
    box-sizing: border-box;
    padding: 19px 0 0 123px;
    button {
      display: block;
      width: 200px;
      height: 40px;
      background: #2e8ae6;
      border-radius: 6px;
      font-size: 16px;
      color: #ffffff;
    }
  }
}
</style>
