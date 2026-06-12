<template>
  <backstage-dialog class="fingerprint" @update:show="update" :show="show" title='录入指纹信息' @save="save">
    <div class="content_box">
      <div class="tips">
        点击下方开始录入指纹
      </div>
      <div class="list_box">
        <div class="itme">
          <span>第一次</span>
          <div>

            <img v-if="count >= 1" src="@/assets/img/backstage/fingerprint/2.png">
            <img v-else src="@/assets/img/backstage/fingerprint/1.png">
          </div>
        </div>
        <div class="itme">
          <span>第二次</span>
          <div>
            <img v-if="count >= 2" src="@/assets/img/backstage/fingerprint/2.png">
            <img v-else src="@/assets/img/backstage/fingerprint/1.png">
          </div>
        </div>
        <div class="itme">
          <span>第三次</span>
          <div>
            <img v-if="count >= 3" src="@/assets/img/backstage/fingerprint/2.png">
            <img v-else src="@/assets/img/backstage/fingerprint/1.png">
          </div>
        </div>
      </div>
      <div class="success">
        <div :style="count >= 1 ? {} : { opacity: 0 }">
          <img src="@/assets/img/backstage/fingerprint/success.png"/>
          录入成功。
        </div>
        <div :style="count >= 2 ? {} : { opacity: 0 }">
          <img src="@/assets/img/backstage/fingerprint/success.png"/>
          录入成功。
        </div>
        <div :style="count >= 3 ? {} : { opacity: 0 }">
          <img src="@/assets/img/backstage/fingerprint/success.png"/>
          录入成功。
        </div>
        <!-- <div>
            <img src="@/assets/img/backstage/fingerprint/fail.png" />
            录入失败。
        </div> -->
      </div>
      <button v-if="curStatus == 1" @click="start">开始录入</button>
      <div class="order" v-else-if="curStatus == 2">
        第{{ count + 1 }}次录入中，请按压指纹采集器...
      </div>
      <div class="order" v-else-if="curStatus == 3">
        录入完成！
      </div>
    </div>
  </backstage-dialog>
</template>

<script>

let timer = null;

export default {
  props: ['show', 'fingerPrint',],
  model: {
    prop: 'fingerPrint',
    event: 'change'
  },
  watch: {
    show(nvl) {
      if (nvl) {
        this.curStatus = 1,
            this.isFirst = true,
            this.count = 0,
            this.fingerList = []
      }
    }
  },
  data() {
    return {
      curStatus: 1,
      isFirst: true,
      count: 0,
      fingerList: [],

    }
  },
  methods: {
    update(value) {
      this.$emit('update:show', value)
    },
    // 是否连接到设备
    start() {
      if (!FingerprintObj || !JSON.parse(FingerprintObj.OpenDevice()).success) {
        //this.$refs.message.messagePopup(true,false,'没有连接到设备，请检查')
        this.$message({
          type: 'error',
          message: '没有连接到设备，请检查'
        })
        return;
      }
      this.curStatus = 2;
      //this.$refs.message.messagePopup(true,true,"设备已打开，请按指纹设备！");
      this.$message({
        type: 'success',
        message: '设备已打开，请按指纹设备！'
      })
      clearInterval(timer);
      timer = null;
      this.setAn();

    },
    // 截取字符串
    getFileName(data) {
      return data.substring(0, data.indexOf("."));
    },
    // 匹配指纹
    setAn() {
      this.count = 0;
      this.fingerList = [];
      try {
        timer = setInterval(() => {
          const result = FingerprintObj && JSON.parse(FingerprintObj.GetImage());
          if (result.success == false) {
            return;
          }
          this.count++;
          if (this.count < 3) {
            this.$message({
              type: 'success',
              message: `录入指纹成功，还需录入${3 - this.count}次`
            })
            return;
          }
          const fileName = this.getFileName(result.data.filePath)
          this.fingerList.push(fileName);
          clearInterval(timer);
          // this.$post('/api/System/setmenfprint', { fileName: fileName, uid: this.userInfo.id }).then(res => {

          //     if (res.data.code == 200) {

          //         this.$message({
          //             type: 'success',
          //             message: ',录入成功,正在返回...！'
          //         })
          //         this.curStatus = 3
          //         setTimeout(() => {
          //             this.$router.go(-1);
          //         }, 1000)
          //     } else {
          //         this.curStatus = 1;
          //     }
          // })
          this.curStatus = 3
          setTimeout(() => {
            this.curStatus = 1
          }, 1000);

        }, 1000)
      } catch (error) {
        console.error(error);
        this.$message({
          type: 'error',
          message: '没有连接到设备，请检查！'
        })
      }
    },
    save() {
      if (this.curStatus == 2) {
        this.$message.error('录入中不能保存！')
        return
      }
      this.$emit('change', this.fingerList)

    },
    beforeDestroy() {

      clearInterval(timer);
      timer = null;
    }
  },
}

</script>
<style lang="less" scoped>
.fingerprint {
  z-index: 1000;

  .dialog-box {
    width: 1000px;
    height: 680px;

    .content_box {
      height: 570px;
      border-top: 1px solid #dddddd;
      box-sizing: border-box;
      padding-top: 65px;


      .tips {
        text-align: center;
        font-size: 20px;
        color: #333333;

      }

      .list_box {
        width: 670px;
        height: 220px;
        display: flex;
        justify-content: space-between;
        margin: 54px auto 0;

        .itme {
          width: 180px;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;

          span {
            font-size: 16px;
            color: #333333;
          }

          div {
            width: 180px;
            height: 180px;
            background: #ffffff;
            border: 1px solid #e6e6e6;
            border-radius: 6px;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              display: block;
              width: 90px;
              height: 140px;
            }
          }
        }
      }

      .success {
        width: 670px;
        display: flex;
        justify-content: space-between;
        margin: 16px auto 0;

        div {
          width: 33.3%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #333;

          img {
            display: block;
            width: 16px;
            height: 16px;
            margin-right: 8px;
          }
        }
      }

      button {
        display: block;
        width: 100px;
        height: 40px;
        background: #2e8ae6;
        border-radius: 6px;
        margin: 50px auto 0;
        font-size: 16px;
        color: #ffffff;
      }

      .order {
        font-size: 14px;
        text-align: center;
        color: #333333;
        margin-top: 30px;
      }

    }
  }
}
</style>
