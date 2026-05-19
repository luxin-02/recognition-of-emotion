import { formatDate, formatTime } from './time';

export default {
  install(app, option) {

    // 时间日期格式化
    app.filter("formatDate", function (date, format) {
      return formatDate(date, format);
    });

    // 将秒数按格式转换为时分秒
    app.filter("formatTime", function (time, sFormat) {
      return formatTime(time, sFormat);
    });

  }
}
