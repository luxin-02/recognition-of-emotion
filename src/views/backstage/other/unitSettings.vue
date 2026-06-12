<template>
    <div class="box">
        <span class="title-box">单位介绍及位置</span>
        <div class="name-num_box">
            <span>单位名称:</span>
            <input type="text">
            <span>单位人数:</span>
            <input type="text" class="num">
            <span>人</span>
        </div>
        <div class="position">
            <span>所在位置:</span>
            <div>
                <selectVue :options="provinceList" :value="provinceVal" label="name" ItemValue="id"
                    @changeValue="changeProvince">
                </selectVue>
            </div>
            <div>
                <selectVue :options="marketList" :value="marketVal" label="name" ItemValue="id" @changeValue="changeMarket">
                </selectVue>
            </div>
            <div>
                <selectVue :options="countyList" :value="countyVal" label="name" ItemValue="id" @changeValue="changeCounty">
                </selectVue>
            </div>
            <input type="text">
        </div>
        <div class="brief-introduction">
            <span>单位简介:</span>
            <textarea></textarea>
        </div>
        <div class="line"></div>
        <div class="logo">
            <span>标志/LOGO：</span>
            <div class="logo-img">
                <img :src="logoUrl" alt="" v-if="logoUrl">
                <span v-else>暂无图片</span>
            </div>
            <div class="upload">
                <div class="el-upload__tip">说明：上传图片格式为.jpg或.png，建议尺寸不超过260px*40px。</div>
                <el-upload class="uploader" action="" :show-file-list="false" :auto-upload="false" :on-change="logoUpload">
                    <el-button size="small">本地上传</el-button>
                </el-upload>
            </div>
        </div>
        <div class="unit-img">
            <span>单位照片：</span>
            <div class="img-box">
                <div class="img-list">
                    <span>封面照片一</span>
                    <div class="img-content">
                        <img :src="imgUrl" alt="" v-if="imgUrl">
                        <span v-else>暂无图片</span>
                    </div>
                </div>
                <div class="img-list">
                    <span>封面照片二</span>
                    <div class="img-content">
                        <img :src="imgUrl2" alt="" v-if="imgUrl2">
                        <span v-else>暂无图片</span>
                    </div>

                </div>
            </div>
            <div class="unit-upload">

                <div class="el-upload__tip">说明：上传图片格式为.jpg或.png，建议尺寸不超过260px*40px。</div>
                <div class="upload-btn">
                    <el-upload class="uploader" action="" :show-file-list="false" :auto-upload="false"
                        :on-change="imgUpload">
                        <el-button size="small">上传图片一</el-button>
                    </el-upload>
                    <el-upload class="uploader" action="" :show-file-list="false" :auto-upload="false"
                        :on-change="img2Upload">
                        <el-button size="small">上传图片二</el-button>
                    </el-upload>
                </div>


            </div>
        </div>
        <div class="line" style="margin-top: 30px;"></div>
        <div class="footer">
            <button>保存</button>
        </div>
    </div>
</template>

<script>
import getBase64 from "@/utils/base64";
export default {
    data() {
        return {
            //省份
            provinceList: [
                { name: 'hn', id: 1 },
                { name: 'gz', id: 2 },
                { name: 'fj', id: 3 },
                { name: 'sh', id: 4 },
                { name: 'bj', id: 5 },
            ],
            provinceVal: '',
            //市
            marketList: [
                { name: 'cs', id: 1 },
                { name: 'gz', id: 2 },
                { name: 'tj', id: 3 },
                { name: 'sh', id: 4 },
                { name: 'bj', id: 5 },
            ],
            marketVal: '',
            // 县
            countyList: [
                { name: 'hn', id: 1 },
                { name: 'hd', id: 2 },
                { name: 'hy', id: 3 },
                { name: 'qd', id: 4 },
                { name: 'ly', id: 5 },
            ],
            countyVal: '',
            //logo
            logoUrl: '',
            //封面图片
            imgUrl: '',
            imgUrl2: '',
        };
    },

    computed: {}, 

    watch: {},

    methods: {
        changeProvince(val) {
            this.provinceVal = val
        },
        changeMarket(val) {
            this.marketVal = val
        },
        changeCounty(val) {
            this.countyVal = val
        },
        logoUpload(file) {
            console.log(file);
            const isJPG = file.raw.type === "image/jpeg";
            const isPNG = file.raw.type === "image/png";
            //const isLt2M = file.raw.size / 1024 / 1024 < 2;
            if (!isPNG && !isJPG) {
                this.$message.error("上传图片只能是 JPG/PNG 格式!");
                return false;
            }
            else if (isPNG || isJPG) {
                getBase64(file.raw).then(url => {
                    this.logoUrl = url;
                }); //图片的url
            }
        },
        imgUpload(file) {
            console.log(file);
            const isJPG = file.raw.type === "image/jpeg";
            const isPNG = file.raw.type === "image/png";
            //const isLt2M = file.raw.size / 1024 / 1024 < 2;
            if (!isPNG && !isJPG) {
                this.$message.error("上传图片只能是 JPG/PNG 格式!");
                return false;
            }
            else if (isPNG || isJPG) {
                getBase64(file.raw).then(url => {
                    this.imgUrl = url;
                }); //图片的url
            }
        },
        img2Upload(file) {
            console.log(file);
            const isJPG = file.raw.type === "image/jpeg";
            const isPNG = file.raw.type === "image/png";
            //const isLt2M = file.raw.size / 1024 / 1024 < 2;
            if (!isPNG && !isJPG) {
                this.$message.error("上传图片只能是 JPG/PNG 格式!");
                return false;
            }
            else if (isPNG || isJPG) {
                getBase64(file.raw).then(url => {
                    this.imgUrl2 = url;
                }); //图片的url
            }
        },
    },


    mounted() { },

    created() { },

}

</script>
<style lang='less' scoped>
.box {
    width: 100%;
    height: 100%;
    position: relative;
    padding-top: 25px;
    box-sizing: border-box;

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

        >span {
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
    .footer{
        height: 110px;
        width: 100%;
        box-sizing: border-box;
        padding: 19px 0 0 123px;
        button{
            display: block;
            width: 200px;
            height: 40px;
            background: #2e8ae6;
            border-radius: 6px;
            font-size: 16px;
            color: #ffffff;
            
        }
    }
}</style>