/**
 * 描述：处理脉搏心率设备的全局变量 window.pluseDevice
 * 用法：
 *  1.引入：import deviceData from '@/mixins/deviceData.js'
 *  2.引用：mixins: [deviceData],
 */
export default {
  data() {
    return {
      pluseDevice: {
        spo2: null, //  实时血氧 值: 0到127
        mspo2: null, // 平均血氧 值: 0到127
        maxspo2: null, // 最大血氧 值: 0到127
        minspo2: null, // 最小血氧 值: 0到127
        spo2Arr: [], // 血氧的数据集合

        hrt: null, //  实时心率 值: 0到255
        mhrt: null, // 平均心率 值: 0到255
        maxhrt: null, // 最大心率 值: 0到255
        minhrt: null, // 最小心率 值: 0到255
        hrtArr: [], // 心率的数据集合

        nn: null, // 实时心动周期 值 实际操作值最大241
        mnn: null, // 平均心动周期 值 实际操作值最大241
        maxnn: null, // 最大心动周期 值 实际操作值最大241
        minnn: null, // 最小心动周期 值 实际操作值最大241
        nnArr: [], // 心动周期的数据集合

        pl: null, // 实时血流灌注指数 实际操作值最大29
        mpl: null, // 平均血流灌注指数 实际操作值最大29
        maxpl: null, // 最大血流灌注指数 实际操作值最大29
        minpl: null, // 最小血流灌注指数 实际操作值最大29
        plArr: [], // 血流灌注指数的数据集合

        sdnn: null, // 全部窦性心博RR间期（简称RR间期）的标准差
        rmssd: null, // 全部相邻NN间期长度之差的均方根值
        sdsd: null, // 相邻NN间期差值（长度差异）的标准差
        cv: null, // 心率变异系数，是标准差与均值之比
        pnn50: null, // 相邻NN间期差值大于50毫秒的百分比

        pleth: null, // 脉搏容积波 值 0到100
        plethArr: [], // 脉搏容积波的数据集合

        hrtChartArr: [], // hrt直方图的数据
        spo2ChartArr: [], // 血氧图的数据
        plethChartArr: [], // 脉搏容积波图的数据
        nnChartArr: [], // 心动周期散点图的数据

        battery: null, // 电量
        fingerOff: true, // 松开手指

        prevHrt: null, //上一次心率
        prevSpo2: null, //上一次血氧
        prevNn: null, //上一次心动周期的赋值
        prevPl: null, //上一次血流灌注指数
      },
      pluseTimer: null, //心率定时器
      windowKey: 'pluseDevice', //数据绑定到window上的属性名
    };
  },
  methods: {
    /**重置设备记录数据 */
    pluseDataInit() {
      Object.assign(this.pluseDevice, {
        spo2: null, //  实时血氧 值: 0到127
        mspo2: null, // 平均血氧 值: 0到127
        maxspo2: null, // 最大血氧 值: 0到127
        minspo2: null, // 最小血氧 值: 0到127
        spo2Arr: [], // 血氧的数据集合

        hrt: null, //  实时心率 值: 0到255
        mhrt: null, // 平均心率 值: 0到255
        maxhrt: null, // 最大心率 值: 0到255
        minhrt: null, // 最小心率 值: 0到255
        hrtArr: [], // 心率的数据集合

        nn: null, // 实时心动周期 值 实际操作值最大241
        mnn: null, // 平均心动周期 值 实际操作值最大241
        maxnn: null, // 最大心动周期 值 实际操作值最大241
        minnn: null, // 最小心动周期 值 实际操作值最大241
        nnArr: [], // 心动周期的数据集合

        pl: null, // 实时血流灌注指数 实际操作值最大29
        mpl: null, // 平均血流灌注指数 实际操作值最大29
        maxpl: null, // 最大血流灌注指数 实际操作值最大29
        minpl: null, // 最小血流灌注指数 实际操作值最大29
        plArr: [], // 血流灌注指数的数据集合

        sdnn: null, // 全部窦性心博RR间期（简称RR间期）的标准差
        rmssd: null, // 全部相邻NN间期长度之差的均方根值
        sdsd: null, // 相邻NN间期差值（长度差异）的标准差
        cv: null, // 心率变异系数，是标准差与均值之比
        pnn50: null, // 相邻NN间期差值大于50毫秒的百分比

        pleth: null, // 脉搏容积波 值 0到100
        plethArr: [], // 脉搏容积波的数据集合

        hrtChartArr: [], // hrt直方图的数据
        spo2ChartArr: [], // 血氧图的数据
        plethChartArr: [], // 脉搏容积波图的数据
        nnChartArr: [], // 心动周期散点图的数据

        battery: null, // 电量
        fingerOff: true, // 松开手指

        prevHrt: null, //上一次心率
        prevSpo2: null, //上一次血氧
        prevNn: null, //上一次心动周期的赋值
        prevPl: null, //上一次血流灌注指数
      });
    },

    // 累加
    sumArr(values) {
      values = values.reduce(function (prev, cur, index, array) {
        return prev + cur;
      });
      return values;
    },

    // 两个值累加
    sumTwoValue(x, y) {
      return x + y;
    },

    // 值的平方
    squareTwoValue(x) {
      return x * x;
    },

    // 相邻nn值的差
    rrspaceVlaue(arr) {
      var x = [];
      for (let i = 0; i < arr.length - 1; i++) {
        x.push(Math.abs(arr[i + 1]) - arr[i]);
      }
      return x;
    },

    // 相邻值的差与nn标准差
    rrspaceNnValue(arr, max, min) {
      let space = (max - min) / arr.length - 1;
      var x = [];
      for (let i = 0; i < arr.length - 1; i++) {
        x.push(Math.abs(arr[i + 1]) - arr[i] - space);
      }
      return x;
    },

    // 一维数组变为二维数组
    arrTrans(num, arr) {
      const newArr = [];
      while (arr.length > 0) {
        newArr.push(arr.splice(0, num));
      }
      return newArr;
    },

    // 差值占比
    precentNn(arr, range) {
      let array = arr.filter((x) => {
        return Number(x) >= Number(range);
      });
      return (array.length / arr.length).toFixed(2);
    },

    // 计算bar的数目
    calcBar(arr) {
      let array = [0, 0, 0, 0, 0, 0, 0];
      if (arr.length > 0) {
        arr.forEach((item) => {
          switch (true) {
            case item < 20:
              array[0]++;
              break;
            case item < 40:
              array[1]++;
              break;
            case item < 60:
              array[2]++;
              break;
            case item < 80:
              array[3]++;
              break;
            case item < 100:
              array[4]++;
              break;
            case item < 120:
              array[5]++;
              break;
            default:
              array[6]++;
          }
        });
      }
      return array;
    },

    // 心率设备定时200秒一次
    pluseCount() {
      clearInterval(this.pluseTimer);
      this.pluseTimer = setInterval(() => {
        let obj = "";
        obj = FingerprintObj.GetData2();
        if (obj) {
          obj = JSON.parse(obj);
          if (obj.success) {
            obj = obj.data;
          }
        }
        if (obj.rrInterval && obj.rrInterval > 0) {
          // 硬件数据的复制
          this.pluseDevice.hrt = obj.pulseRateReal;
          this.pluseDevice.spo2 = obj.spO2SatReal;
          this.pluseDevice.pleth = obj.plethWave;
          this.pluseDevice.nn = obj.rrInterval;
          this.pluseDevice.pl = obj.perfuIndexReal;
          this.pluseDevice.battery = obj.battery;
          this.pluseDevice.fingerOff = false;

          // 只算5分钟的数值
          if (this.pluseDevice.hrtArr.length >= 250) {
            this.pluseDevice.hrtArr = this.pluseDevice.hrtArr.slice(1);
            this.pluseDevice.spo2Arr = this.pluseDevice.spo2Arr.slice(1);
            this.pluseDevice.plethArr = this.pluseDevice.plethArr.slice(1);
            this.pluseDevice.nnArr = this.pluseDevice.nnArr.slice(1);
            this.pluseDevice.plArr = this.pluseDevice.hrtArr.slice(1);
          }

          this.pluseDevice.hrtArr.push(this.pluseDevice.hrt); //心率的数据集合
          this.pluseDevice.spo2Arr.push(this.pluseDevice.spo2); //血氧的数据集合
          this.pluseDevice.plethArr.push(this.pluseDevice.pleth); //脉搏容积波的数据集合
          this.pluseDevice.nnArr.push(this.pluseDevice.nn); //心动周期的数据集合
          this.pluseDevice.plArr.push(this.pluseDevice.pl); //血流灌注指数的数据集合

          if (this.pluseDevice.hrtArr.length > 2) {
            // 心率 血氧 心动周期 血流灌注指数 的平均数 数组累加值➗数组长度
            let meanHrt = Math.round(
              this.sumArr(this.pluseDevice.hrtArr) /
                this.pluseDevice.hrtArr.length
            );
            this.pluseDevice.mhrt = meanHrt; // 平均心率
            let meanSpo2 = Math.round(
              this.sumArr(this.pluseDevice.spo2Arr) /
                this.pluseDevice.spo2Arr.length
            );
            this.pluseDevice.mspo2 = meanSpo2; // 平均血氧
            let meanNn = Math.round(
              this.sumArr(this.pluseDevice.nnArr) /
                this.pluseDevice.nnArr.length
            );
            this.pluseDevice.mnn = meanNn; // 平均心动周期
            let meanPl = Math.round(
              this.sumArr(this.pluseDevice.plArr) /
                this.pluseDevice.plArr.length
            );
            this.pluseDevice.mpl = meanPl; // 平均血流灌注指数

            this.pluseDevice.maxhrt = Math.max(
              this.pluseDevice.prevHrt,
              this.pluseDevice.maxhrt
            ); // 最大心率
            this.pluseDevice.minhrt = Math.min(
              this.pluseDevice.prevHrt,
              this.pluseDevice.minhrt != null
                ? this.pluseDevice.minhrt
                : this.pluseDevice.hrt
            ); // 最小心率
            this.pluseDevice.maxspo2 = Math.max(
              this.pluseDevice.prevSpo2,
              this.pluseDevice.maxspo2
            ); // 最大血氧
            this.pluseDevice.minspo2 = Math.min(
              this.pluseDevice.prevSpo2,
              this.pluseDevice.minspo2 != null
                ? this.pluseDevice.minspo2
                : this.pluseDevice.spo2
            ); // 最小血氧
            this.pluseDevice.maxnn = Math.max(
              this.pluseDevice.prevNn,
              this.pluseDevice.maxnn
            ); // 心动周期最大值
            this.pluseDevice.minnn = Math.min(
              this.pluseDevice.prevNn,
              this.pluseDevice.minnn != null
                ? this.pluseDevice.minnn
                : this.pluseDevice.nn
            ); // 心动周期最小值
            this.pluseDevice.maxpl = Math.max(
              this.pluseDevice.prevPl,
              this.pluseDevice.maxpl
            ); // 血流灌注指数最大值
            this.pluseDevice.minpl = Math.min(
              this.pluseDevice.prevPl,
              this.pluseDevice.minpl != null
                ? this.pluseDevice.minpl
                : this.pluseDevice.pl
            ); // 血流灌注指数最小值

            let meanDis = this.pluseDevice.nnArr.map((x) => {
              return Math.abs(x - meanNn);
            }); // 心动周期的值 与 心动周期的平均值 的数组
            let offsetDis = this.rrspaceVlaue(this.pluseDevice.nnArr); // 心动周期的后一个数值 与 心动周期的前一个数值 的数组
            let ofRRDis = this.rrspaceNnValue(
              this.pluseDevice.nnArr,
              this.pluseDevice.maxnn,
              this.pluseDevice.minnn
            ); // 心动周期的后一个数值 、 心动周期的前一个数值 与 心动周期之前的差值 的数组
            let meanVariance =
              meanDis.map(this.squareTwoValue).reduce(this.sumTwoValue) /
              this.pluseDevice.nnArr.length; //方差
            this.pluseDevice.sdnn = Math.sqrt(meanVariance).toFixed(2); // 全部窦性心博RR间期（简称RR间期）的标准差
            let offsetVariance =
              ofRRDis.map(this.squareTwoValue).reduce(this.sumTwoValue) /
              this.pluseDevice.nnArr.length; //值之间的偏差的方差
            this.pluseDevice.rmssd = Math.sqrt(offsetVariance).toFixed(2); // 全部相邻NN间期长度之差的均方根值
            let ofVariance =
              offsetDis.map(this.squareTwoValue).reduce(this.sumTwoValue) /
              this.pluseDevice.nnArr.length; //值之间的偏差与平均值的偏差的方差
            this.pluseDevice.sdsd = Math.sqrt(ofVariance).toFixed(2); //相邻NN间期差值（长度差异）的标准差

            this.pluseDevice.cv = (this.pluseDevice.sdnn / meanNn).toFixed(2); // 心率变异系数，是标准差与均值之比

            this.pluseDevice.pnn50 = this.precentNn(meanDis, 12); // 相邻NN间期差值大于50的百分比
          }

          this.pluseDevice.prevHrt = this.pluseDevice.hrt; //上一次心率
          this.pluseDevice.prevSpo2 = this.pluseDevice.spo2; //上一次血氧
          this.pluseDevice.prevNn = this.pluseDevice.nn; //上一次心动周期的赋值
          this.pluseDevice.prevPl = this.pluseDevice.pl; //上一次血流灌注指数

          // 画图的心率的数据集合 == hrt直方图的数据
          let randomHrtNum = Math.round(Math.random() * 40 + 60);
          let chartHrt = JSON.parse(JSON.stringify(this.pluseDevice.hrtArr));
          if (chartHrt.length > randomHrtNum) {
            chartHrt = chartHrt.slice(-randomHrtNum);
          }
          this.pluseDevice.hrtChartArr = this.calcBar(chartHrt);

          // 画图的血氧和脉率容积波的数据集合的
          if (this.pluseDevice.spo2ChartArr.length > 26) {
            this.pluseDevice.spo2ChartArr = [];
          }
          if (this.pluseDevice.plethChartArr.length > 26) {
            this.pluseDevice.plethChartArr = [];
          }
          this.pluseDevice.spo2ChartArr.push(this.pluseDevice.spo2);
          this.pluseDevice.plethChartArr.push(this.pluseDevice.pleth);

          // 画图的心动周期的数据集合 == rr散点图的数据
          let chartRr = this.pluseDevice.nnArr.map((x) => {
            return x * 5;
          });
          this.pluseDevice.nnChartArr = this.arrTrans(2, chartRr);
        } else {
          let array = [
            "spo2Arr",
            "hrtArr",
            "nnArr",
            "plArr",
            "plethArr",
            "hrtChartArr",
            "spo2ChartArr",
            "plethChartArr",
            "nnChartArr",
          ];
          for (const key in this.pluseDevice) {
            if (array.indexOf(key) > -1 || key == "fingerOff") {
              if (key == "fingerOff") {
                this.pluseDevice[key] = true;
              } else {
                this.pluseDevice[key] = [];
              }
            } else {
              this.pluseDevice[key] = null;
            }
          }
        }

        window[this.windowKey] = this.pluseDevice;
      }, 200);
    },
  },
  mounted() {
    if ("FingerprintObj" in window) {
      FingerprintObj.GetData2();
      setTimeout(() => {
        this.pluseCount();
      }, 1000);
    }
  },
  beforeDestroy() {
    clearInterval(this.pluseTimer);
  },
};
