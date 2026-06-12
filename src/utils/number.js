/**
 * 1.随机数
 * @param {Number} min 最小数
 * @param {Number} max 最大数
 * @returns Number
 */
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 2.px转rem
 * @param {Number} min px单位的值
 * @param {Number} max 转换成rem比列的值
 * @returns Number
 */
export const pxToRem = (v, convertV = 100) => {
  return Math.round((v / convertV) * 1000000) / 1000000;
};

/**
 * 3.rem转px
 * @param {Number} min rem单位的值
 * @param {Number} max 转换成px比列的值
 * @returns Number
 */
export const remToPx = (v, convertV = 100) => {
  return Math.round(parseFloat(v) * convertV);
};

// 4.缩放比列
export const proportion = () => {
  let innerWidth = window.innerWidth;
  return Math.floor((1920 / window.innerWidth) * 1000000) / 1000000;
};

// 从数组中随机选取多个元素
export const getRandomArrayElements = (arr, count) => {
  count = count < arr.length ? count : arr.length;
  var shuffled = arr.slice(0),
    i = arr.length,
    min = i - count,
    temp,
    index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
};