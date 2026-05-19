import * as wsdeviceData from "@/mixins/wsdeviceData";
import store from "@/store";

/**
 * 描述：处理单车设备数据(心率、圈数)数据
 */

const bicycleConfig = {
  perimeter: 1.85, // 轮子的周长(m)
  cal: 150, // 每公里消耗的卡路里(cal)
};

const rackObj = {
  rackKeyArr: [], // 可用设备编号
  rackKeyObj: {},
  rackArrSetFoo: null,
};

wsdeviceData.addCallbackFn((data) => {
  if (data.type != "data") {
    console.log("游戏数据", data);
    return;
  }
  let dataObj = data.data;
  rackObj.rackKeyObj[dataObj.RackName] = true;

  if (rackObj.rackArrSetFoo) {
    rackObj.rackArrSetFoo(data);
    rackObj.rackArrSetFoo = null;
    rackObj.rackKeyObj = {};
    setTimeout(() => {
      rackObj.rackArrSetFoo = rackSetArr;
    }, 2000);
  }
});
setTimeout(() => {
  rackObj.rackArrSetFoo = rackSetArr;
}, 2000);

/**检测可用设备编号 */
function rackSetArr() {
  let keyArr = [];
  for (let key in rackObj.rackKeyObj) {
    keyArr.push(key);
  }
  keyArr.sort((a, b) => a - b);
  rackObj.rackKeyArr = keyArr;
  if (
    keyArr.length == 1 &&
    keyArr.indexOf(store.getters.deviceConfig.rackName) == -1 &&
    store.getters.deviceConfig.rackName != "00"
  ) {
    console.log("未找到默认设备编号，自动切换设备编号为" + keyArr[0]);
    // 设置默认设备
    store.commit("UPDATE_DEVICE_CONFIG", {
      rackName: keyArr[0],
    });
  }
}

export default {
  data() {
    return {
      // 单车状态
      bicycleDevice: {
        wsState: 0,
        timeObj: null,
      },
      // 处理后的数据
      bicycleData: {
        // 心率
        heart: 0,
        heartMax: 0,
        heartAvg: 0,
        spO2: 0,

        // 圈数
        circle: 0,
        // 路程(m)
        distance: 0,
        // 速度(km/h)
        speed: 0,
        speedMax: 0,
        speedAvg: 0, // 平均速度(根据路程与时间计算所得)
        // 消耗的卡路里
        cal: 0,
        // 骑行时间（s)
        circleTime: 0,
      },
      // 原始数据
      bicycleOriginal: {
        Heart: 0,
        Circle: 0,
        Frequency: 0,
        // 计算数据
        oldCircle: 0,
        CircleArr: [],
        heartArr: [],
        timeNum: 0,
        startCircle: false,
        startCircleTime: null,
      },
      // 单车游戏返回的数据（单车游戏结束后更新）
      bicycleGameData: {
        TypeID: "", //    "0"
        Heart: "", //    "0"
        Time: "", //    "01:22:64"
        Data: "", //    "49"
        Kcal: "", //    "4.4"
        Ranking: "", //    "0"
        Map: "", //    "1"
        Circle: "", //    "250"
        MODE: "", //    "2" （为1时为多人模式）
        Rank: "", //    "0"
        Distance: "", //    "0"
        RackName: "", //    "UnKnown"
        endDate: null, // 游戏结束时间  Date对象
      },
      bicycleGameEndLastTime: null, // 最新的单车游戏结束时间（只记录最新的那个，用于判断单车游戏的进行，当前电脑未参与或者是当主机的情况下，bicycleGameData不会更新，所以用此字段判断进行了单车游戏）
      // 多设备数据
      otherBicycleObj: {
        // '01': {
        //   bicycleData: {},
        //   bicycleOriginal: {},
        //   bicycleGameData: {},
        // },
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    wsdeviceData.openService();
    wsdeviceData.addCallbackFn(this.getBicycleData);
    this.bicycleDevice.timeObj = setInterval(() => {
      this.bicycleDevice.wsState = wsdeviceData.wsInfo.state;
    }, 100);
  },
  beforeDestroy() {
    wsdeviceData.removeCallbackFn(this.getBicycleData);
    wsdeviceData.closeService();
    clearInterval(this.bicycleDevice.timeObj);
  },
  methods: {
    /** 开始圈数 */
    startCircle() {
      this.bicycleOriginal.startCircle = true;
      this.bicycleOriginal.startCircleTime = new Date();
      this.bicycleOriginal.oldCircle = 0;
      this.bicycleOriginal.CircleArr = [];
      this.bicycleOriginal.heartArr = [];
      this.bicycleData.circle = 0;
      this.bicycleData.distance = 0;
      this.bicycleData.speed = 0;
      this.bicycleData.speedMax = 0;
      this.bicycleData.speedAvg = 0;
      this.bicycleData.cal = 0;
      this.bicycleData.circleTime = 0;

      for (let key in this.otherBicycleObj) {
        let _bicycleObj = this.otherBicycleObj[key];

        _bicycleObj.bicycleOriginal.startCircle = true;
        _bicycleObj.bicycleOriginal.startCircleTime = new Date();
        _bicycleObj.bicycleOriginal.oldCircle = 0;
        _bicycleObj.bicycleOriginal.CircleArr = [];
        _bicycleObj.bicycleOriginal.heartArr = [];
        _bicycleObj.bicycleData.circle = 0;
        _bicycleObj.bicycleData.distance = 0;
        _bicycleObj.bicycleData.speed = 0;
        _bicycleObj.bicycleData.speedMax = 0;
        _bicycleObj.bicycleData.speedAvg = 0;
        _bicycleObj.bicycleData.cal = 0;
        _bicycleObj.bicycleData.circleTime = 0;
      }
    },
    /** 停止圈数 */
    stopCircle() {
      this.bicycleOriginal.startCircle = false;

      for (let key in this.otherBicycleObj) {
        let _bicycleObj = this.otherBicycleObj[key];

        _bicycleObj.bicycleOriginal.startCircle = false;
      }
    },
    /** 获取设备可用编号 */
    getRackKeyArr() {
      return [...rackObj.rackKeyArr];
    },
    getBicycleData(data) {
      // console.log(JSON.stringify(data))
      let _this = this;
      let dataObj = data.data;

      let objRackName =
        dataObj.RackName && dataObj.RackName != "UnKnown"
          ? dataObj.RackName
          : this.$store.getters.deviceConfig.rackName;

      if (!(objRackName in this.otherBicycleObj)) {
        this.otherBicycleObj[objRackName] = {
          bicycleData: JSON.parse(JSON.stringify(this.bicycleData)),
          bicycleOriginal: JSON.parse(JSON.stringify(this.bicycleOriginal)),
          bicycleGameData: JSON.parse(JSON.stringify(this.bicycleGameData)),
        };
      }

      classStatistics(this.otherBicycleObj[objRackName]);
      if (this.$store.getters.deviceConfig.rackName == objRackName) {
        // 是当前编号的数据
        Object.assign(
          this.bicycleData,
          this.otherBicycleObj[objRackName].bicycleData
        );
        Object.assign(
          this.bicycleOriginal,
          this.otherBicycleObj[objRackName].bicycleOriginal
        );
        if (data.type == "result") {
          this.bicycleGameData =
            this.otherBicycleObj[objRackName].bicycleGameData;
          // console.log('当前设备的游戏数据', this.bicycleGameData)
        }
      }

      /**根据编号分类统计数据 */
      function classStatistics(_bicycleObj) {
        let bData = _bicycleObj.bicycleData,
          bOriginal = _bicycleObj.bicycleOriginal;

        if (data.type == "data") {
          setDate();
        } else if (data.type == "result") {
          setGameDate();
        }

        /** 心率单车数据 */
        function setDate() {
          // console.log(dataObj)
          heartData();
          timeDate();
          countCircle();

          bOriginal.Heart = +dataObj.Heart;
          bOriginal.Circle = +dataObj.Circle;
          bOriginal.Frequency = +dataObj.Frequency;
        }

        /** 游戏数据 */
        function setGameDate() {
          _bicycleObj.bicycleGameData = Object.assign(
            {
              endDate: new Date(),
            },
            dataObj
          );
          _this.bicycleGameEndLastTime = new Date();
          // console.log('游戏数据:', _bicycleObj.bicycleGameData)
        }

        function heartData() {
          bData.heart = +dataObj.Heart;
          bData.heartMax = Math.max(bData.heartMax, bData.heart);

          bOriginal.heartArr.push(bData.heart);
          if (bOriginal.heartArr.length > 30) {
            bOriginal.heartArr.shift();
          }
          if (bOriginal.heartArr.length < 10) {
            bData.heartAvg = bData.heart;
          } else {
            bData.heartAvg = getAvg(bOriginal.heartArr);
          }

          if (bData.heart < 30) {
            bData.spO2 = 0;
          }
        }
        function timeDate() {
          if (bOriginal.timeNum % 50 == 0 && bData.heart >= 30) {
            bData.spO2 = getRandomInt(97, 99);
          }
          bOriginal.timeNum++;

          if (bOriginal.timeNum > 1000) {
            bOriginal.timeNum = 0;
          }
        }
        function countCircle() {
          let circle = +dataObj.Circle;

          if (!bOriginal.startCircle) {
            return;
          }

          if (!bOriginal.oldCircle) {
            bOriginal.oldCircle = circle;
          }

          bData.circleTime = +(
            (new Date() - bOriginal.startCircleTime) /
            1000
          ).toFixed(0);

          bData.circle +=
            circle > bOriginal.oldCircle ? circle - bOriginal.oldCircle : 0;
          bData.distance = +(bData.circle * bicycleConfig.perimeter).toFixed(0);

          bData.cal = +((bData.distance / 1000) * bicycleConfig.cal).toFixed(0);

          bOriginal.oldCircle = circle;

          bOriginal.CircleArr.push({
            time: new Date(),
            num: bData.circle,
          });
          if (bOriginal.CircleArr.length < 20) {
            return;
          }
          if (bOriginal.CircleArr.length > 30) {
            bOriginal.CircleArr.shift();
          }

          let sCircle =
              bOriginal.CircleArr[bOriginal.CircleArr.length - 1].num -
              bOriginal.CircleArr[0].num,
            sTime =
              bOriginal.CircleArr[bOriginal.CircleArr.length - 1].time -
              bOriginal.CircleArr[0].time;
          let speed = +(
            (sCircle * bicycleConfig.perimeter) /
            (sTime / 1000)
          ).toFixed(1); // m/s
          bData.speed = +(speed * 3.6).toFixed(1); // km/h
          bData.speedMax = Math.max(bData.speedMax, bData.speed);
          if (bData.circleTime > 0) {
            let speedAvg = +(bData.distance / bData.circleTime); // m/s
            bData.speedAvg = +(speedAvg * 3.6).toFixed(1); // km/h
          }
        }

        /**获取随机数 */
        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        /**计算平均值 */
        function getAvg(arr, flength = 0) {
          if (arr.length == 0) {
            return 0;
          }
          let sum = arr.reduce((acc, val) => acc + val, 0);
          return +(sum / arr.length).toFixed(flength);
        }
      }
    },
  },
};
