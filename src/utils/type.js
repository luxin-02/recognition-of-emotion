
/**
 * 判断是否为String
 * @param {*} val 
 */
export const isString = function (val) {
  return Object.prototype.toString.call(val) == '[object String]'
};

/**
 * 判断是否为Array
 * @param {*} val 
 */
export const isArray = function (val) {
  return val instanceof Array
}

/**
 * 判断是否为File
 * @param {*} val 
 */
export const isFile = function (file) {
  return file instanceof File;
}

/**
 * 判断是否为Null
 * @param {*} val 
 */
export const isNull = function (value) {
  if (value == "" || value == null || value == undefined || (isArray(value) ? value.length == 0 : false)) {
      return true
  } else {
      return false;
  }
}

/**
 * 判断是否为Base64
 * @param {*} val 
 */
export const isBase64 = function (str) {
  const regex = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
  return regex.test(str);
}

/**
 * 判断是否为Date
 * @param {*} val 
 */
export const isDate = function (date) {
  return date instanceof Date
}
