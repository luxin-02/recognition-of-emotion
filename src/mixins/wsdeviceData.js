/**
 * 连接单车WebSocket，用于获取单车设备数据
 */
const wsObj = {
  state: 0, // 连接状态(0:断开  1:连接中  2:连接成功)
  hostname: "127.0.0.1", // 连接地址
  port: "7655", // 连接端口号
  service: null, // webSocket对象
  callbackFnArr: [], // 获取到数据之后的回调
};

let openServiceNum = 0; // 调用次数(用于mixins的beforeDestroy，当所有相关的组件关闭之后，才关闭连接)

if (process.env.NODE_ENV === "development") {
  // wsObj.hostname = "192.168.2.168";
}

/**开启连接 */
export function openService() {
  if (wsObj.state > 0) {
    openServiceNum++;
    return;
  }
  wsObj.state = 1;
  connect();

  function connect() {
    if (wsObj.service) {
      return;
    }

    console.log("尝试连接设备服务中...");

    wsObj.service = new WebSocket(`ws://${wsObj.hostname}:${wsObj.port}`);

    // 连接打开时触发
    wsObj.service.addEventListener("open", (event) => {
      console.log("设备服务连接成功", event);
      wsObj.state = 2;
    });

    // 接收到服务器消息时触发
    wsObj.service.addEventListener("message", (event) => {
      // console.log('收到服务器消息：', event.data);
      let data = null;

      let obj = JSON.parse(JSON.parse(event.data).data).data;
      try {
        data = obj;
      } catch (error) {
        console.error(error);
      }
      // console.log('收到服务器消息：', data);
      if (wsObj.callbackFnArr.length > 0) {
        wsObj.callbackFnArr.forEach((callbackFn) => {
          callbackFn(data);
        });
      }
    });

    // 连接关闭时触发
    wsObj.service.addEventListener("close", (event) => {
      console.log('设备服务断开', event);
      wsObj.service = null;

      if (wsObj.state > 0) {
        console.log("异常断开，稍后将尝试重连");
        wsObj.state = 1;
        setTimeout(() => {
          connect();
        }, 5000);
      }
    });

    // 发生错误时触发
    wsObj.service.addEventListener("error", (event) => {
      console.error("设备服务错误：", event);
    });
  }
}

/**
 * 切换连接
 * @param {*} newIp 连接地址
 * @param {*} newPort 端口号
 */
export function switchService(newIp = wsObj.hostname, newPort = wsObj.port) {
  if (wsObj.hostname == newIp && wsObj.port == newPort) {
    console.log('连接配置未发生变化，无需切换')
    return
  }
  wsObj.hostname = newIp
  wsObj.port = newPort
  if (wsObj.state != 0) {
    let oldData = {
      openServiceNum: openServiceNum,
    }
    wsObj.state = 0;
    if (wsObj.service) {
      console.log('正在关闭原有服务')
      wsObj.service.close();
    }
    
    setTimeout(() => {
      console.log('切换成功，正在重启服务')
      openService()
      openServiceNum = oldData.openServiceNum // 恢复之前的连接信息
    }, 200);
  } else {
    console.log('切换成功')
  }
}

/**发送消息 */
export function sendMsg(msg) {
  if (wsObj.state != 2) {
    return;
  }
  wsObj.service.send(msg);
}

/**添加数据获取回调 */
export function addCallbackFn(callbackFn) {
  wsObj.callbackFnArr.push(callbackFn);
}

/**删除数据获取回调 */
export function removeCallbackFn(callbackFn) {
  let delIndex = wsObj.callbackFnArr.indexOf(callbackFn);
  if (delIndex > -1) {
    wsObj.callbackFnArr.splice(delIndex, 1);
  }
}

/**
 * 断开连接
 * @param {*} isClose 是否强制断开连接（将直接断开连接，停止所有相关数据的更新）
 */
export function closeService(isClose = false) {
  if (!isClose && openServiceNum > 0) {
    openServiceNum--;
    return;
  }

  wsObj.state = 0;
  // wsObj.callbackFnArr = [];
  if (wsObj.service) {
    wsObj.service.close();
  }
}

/**连接信息 */
export const wsInfo = Object.create(Object.prototype, {
  state: {
    get: function () {
      return wsObj.state;
    },
    set: function () {},
  },
  hostname: {
    get: function () {
      return wsObj.hostname;
    },
    set: function () {},
  },
  port: {
    get: function () {
      return wsObj.port;
    },
    set: function () {},
  },
  callbackFnLength: {
    get: function () {
      return wsObj.callbackFnArr.length;
    },
    set: function () {},
  },
});

let seekHostIp = ""; // 查找到的主机ip
/**
 * 获取主机ip
 * @param {*} callbackFn 回调函数，返回主机ip
 */
export function getHostIp(callbackFn = () => {}) {
  let wd = "";
  let arr = [];
  try {
    wd = /([0-9]{1,3}(\.[0-9]{1,3}){2})\./.exec(FingerprintObj.getLocalIp())[0];
  } catch (error) {
    return;
  }
  if (seekHostIp) {
    callbackFn(seekHostIp);
    return;
  }
  // 遍历当前网段所有ip，尝试连接webSocket
  for (let i = 2; i <= 255; i++) {
    seek(i);
  }
  function seek(num) {
    try {
      let socketObj = new WebSocket(`ws://${wd}${num}:${wsObj.port}`);
      arr.push(socketObj);
      socketObj.addEventListener("open", () => {
        // 找到主机
        seekHostIp = wd + num;
        closeAll();
        console.clear(); // 清空控制台
        console.log("找到主机ip:" + seekHostIp);
        callbackFn(seekHostIp);
        //this.$store.commit('IS_USER',false)
      });
    } catch (error) {}
  }
  /**关闭所有连接的webSocket */
  function closeAll() {
    arr.forEach((item) => {
      try {
        item.close();
      } catch (error) {}
    });
  }
}
