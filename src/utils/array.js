/**
 * 数组对象去重
 * @param {Array} arr 数组
 * @param {String} atr 对象的属性值
 * @returns Array
 */
export const removingDuplicate = (arr = [], atr = '') => {
  let result = []; // 用于存储唯一对象的属性atr的值的数组result
  // 数据双重循环
  arr.forEach( (a) => {
    // 判断数组result中是否有都与属性atr的值不一样
    let check = result.every( (b) => {
      return a[atr] !== b[atr];
    })
    // 不一样则推入数组result中
    check ? result.push(a) : ''
  })
  return result;
};

/**
* 从数组中随机选取多个元素
* @param {Array} arr 数组
* @param {Number} count 选取元素数量
* @returns Array
*/
export const getRandomArrayElements = (arr = [], count = 0) => {
  count = count < arr.length ? count : arr.length; // 元素的数量超出数组arr的长度则为数组arr的长度
  const result = []; // 用于存储随机元素的数组result
  // 数据循环
  for (let i = 0; i < count; i++) {
    // 循环抽取数组arr中的随机元素
    const randomIndex = Math.floor(Math.random() * arr.length);
    // 将其在数组arr中删除
    const item = arr.splice(randomIndex, 1)[0];
    // 把它推入数组result中
    result.push(item);
  }
  return result;
}