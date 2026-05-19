import { Message } from "element-ui";
import "./assets/init.scss";

// 重新封装 Message
const MyMessage = (options, time = 1000) => {
  let config = {
    message: "",
    duration: time,
    type: "",
  };
  if (typeof options === "string") {
    options = {
      message: options,
    };
  }
  Object.assign(config, options);
  Message({
    message: config.message,
    duration: config.duration,
    customClass: "my-message" + (config.type ? " " + config.type : ""),
    type: config.type,
    offset: 80,
  });
};

MyMessage.success = (options, time) => {
  if (typeof options === "string") {
    options = {
      message: options,
    };
  }
  options.type = "success";
  MyMessage(options, time);
};

MyMessage.error = (options, time) => {
  if (typeof options === "string") {
    options = {
      message: options,
    };
  }
  options.type = "error";
  MyMessage(options, time);
};

export default MyMessage;
