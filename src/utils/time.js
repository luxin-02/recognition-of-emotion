/**
 * 1.时间格式
 * @param {*} date 13位的时间戳
 * @param {*} format
 * @returns String
 */
export const formatDate = (date, format = "yyyy-MM-dd hh:mm:ss") => {
  date = new Date(date);
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      let str = o[k] + "";
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
      );
    }
  }
  return format;
};

/**
 * 根据生日计算当前年龄
 * @param {*} date 13位的时间戳
 * @returns Number
 */
export const birthdayToAge = function (date) {
  var nowDate = new Date();
  var nowYear = nowDate.getFullYear();
  var nowMonth = nowDate.getMonth();
  var nowDay = nowDate.getDate();
  var yourDate = new Date(date);
  var yourYear = yourDate.getFullYear();
  var yourMonth = yourDate.getMonth();
  var yourDay = yourDate.getDate();
  var yourAge = 0;
  if (nowYear > yourYear) {
    yourAge = nowYear - yourYear - 1;
    if (yourMonth < nowMonth || (yourMonth == nowMonth && yourDay <= nowDay)) {
      yourAge++;
    }
  }
  return yourAge;
};

/**
 * 根据年龄计算大概生日(1月1号)
 * @param {*} age 年龄
 * @returns Data对象
 */
export const ageToBirthday = function (age) {
  let nowDate = new Date();
  let birthday = new Date(`${nowDate.getFullYear() - age}/01/01`);
  return birthday;
};

/**
 * @summary 将秒数按格式转换为时分秒
 * @param {int} time 秒数
 * @param {string} sFormat 格式，默认：HH:mm:ss
 * @return {string} 时间字符串
 * @example
 * timeMat(66); // '01:06'
 * timeMat(6666); // '01:51:06'
 * timeMat(66, 'HH小时mm分钟ss秒'); // '01分钟06秒'
 * timeMat(6666, 'mm分钟ss秒'); // '111分钟06秒'
 */
export const formatTime = function (time, sFormat = "HH:mm:ss") {
  let timeV = +time;
  if (isNaN(timeV)) {
    return "";
  }
  if (sFormat.indexOf("H") >= 0) {
    let hour = Math.floor(timeV / 3600);
    timeV = timeV % 3600;
    if (hour <= 0) {
      if (sFormat.indexOf("HHH") >= 0) {
        sFormat = sFormat.replace(/H+/, "00");
      } else {
        sFormat = sFormat.replace(/H[^ms]*/, "");
      }
    } else if (sFormat.indexOf("HH") >= 0) {
      sFormat = sFormat.replace(/H*/, hour.toString().padStart(2, "0"));
    } else {
      sFormat = sFormat.replace(/H+/, hour.toString());
    }
  }
  if (sFormat.indexOf("m") >= 0) {
    let minute = Math.floor(timeV / 60);
    timeV = timeV % 60;
    if (minute <= 0) {
      if (sFormat.indexOf("mmm") >= 0) {
        sFormat = sFormat.replace(/m+/, "00");
      } else {
        sFormat = sFormat.replace(/m[^Hs]*/, "");
      }
    } else if (sFormat.indexOf("mm") >= 0) {
      sFormat = sFormat.replace(/m+/, minute.toString().padStart(2, "0"));
    } else {
      sFormat = sFormat.replace(/m+/, minute.toString());
    }
  }
  if (sFormat.indexOf("s") >= 0) {
    let second = Math.floor(timeV);
    if (sFormat.indexOf("ss") >= 0) {
      sFormat = sFormat.replace(/s+/, second.toString().padStart(2, "0"));
    } else {
      sFormat = sFormat.replace(/s+/, second.toString());
    }
  }
  return sFormat;
};

/**
 * @summary 根据时间及格式获取时间的字符串
 * @param {number} iDate 时间
 * @param {string} sFormat 格式，默认：yyyy-MM-dd HH:mm:ss
 * @return {string} 格式化后的日期字符串
 * @example
 *    formatDate(new Date(),'yyyy-MM-dd HH:mm:ss SSS');// 2017-6-6 11:11:11
 */
export const formatDate2 = (iDate, sFormat = "yyyy-MM-dd HH:mm:ss") => {
  if (!iDate) {
    return "";
  }
  let dDate = new Date(iDate);
  let year = dDate.getFullYear(); // 年
  let month = dDate.getMonth() + 1; // 月
  if (month < 10) {
    month = "0" + month;
  }
  let date = dDate.getDate(); // 日
  if (date < 10) {
    date = "0" + date;
  }
  let hour = dDate.getHours(); // 时
  if (hour < 10) {
    hour = "0" + hour;
  }
  let hour12 = +hour < 12 ? +hour : +hour - 12;
  if (hour12 < 10) {
    hour12 = "0" + hour12;
  }
  let minute = dDate.getMinutes(); // 分
  if (minute < 10) {
    minute = "0" + minute;
  }
  let second = dDate.getSeconds(); // 秒
  if (second < 10) {
    second = "0" + second;
  }
  let millisecond = dDate.getMilliseconds(); // 毫秒
  if (sFormat.indexOf("yyyy") >= 0) {
    sFormat = sFormat.replace("yyyy", year + "");
  }
  if (sFormat.indexOf("MM") >= 0) {
    sFormat = sFormat.replace("MM", month + "");
  }
  if (sFormat.indexOf("dd") >= 0) {
    sFormat = sFormat.replace("dd", date + "");
  }
  if (sFormat.indexOf("HH") >= 0) {
    sFormat = sFormat.replace("HH", hour + "");
  }
  if (sFormat.indexOf("hh") >= 0) {
    sFormat = sFormat.replace("hh", hour12 + "");
  }
  if (sFormat.indexOf("mm") >= 0) {
    sFormat = sFormat.replace("mm", minute + "");
  }
  if (sFormat.indexOf("ss") >= 0) {
    sFormat = sFormat.replace("ss", second + "");
  }
  if (sFormat.indexOf("SSS") >= 0) {
    sFormat = sFormat.replace("SSS", millisecond + "");
  }
  return sFormat;
};

/**
 * 获取时间戳(默认10位)
 * @param {*} date
 * @returns Number
 */
export const getTime = function (date, length = 10) {
  if (!date) {
    return "";
  }
  if (date instanceof Date) {
    return +date.getTime().toString().slice(0, length);
  }
  return +new Date(date).getTime().toString().slice(0, length);
};
