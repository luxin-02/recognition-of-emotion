/**
* 1.深复制
* @param {*} obj 对象
* @returns Object
*/
export const deepClone = (obj) => {
  if (obj === null) return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (typeof obj !== "object") return obj;
  let cloneObj = new obj.constructor();
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key]);
    }
  }
  return cloneObj;
}

/**
 * 将第二个对象的非空属性拷贝给第一个对象所拥有的非空属性：
 * @param {*} sourceObj  第一个参数
 * @param {*} targetObj  第二个参数
 * @returns
 */
export function copyNonEmptyProperties (sourceObj, targetObj) {
  for (let prop in targetObj) {
    if (targetObj.hasOwnProperty(prop) && sourceObj.hasOwnProperty(prop) && targetObj[prop] !== null && targetObj[prop] !== undefined && targetObj[prop] !== '') {
      sourceObj[prop] = targetObj[prop];
    }
  }
  return sourceObj;
}

/**
 * 通过data对象快速生成FormData对象
 * @param {*} data
 * @returns
 */
export function createFormData (data) {
  // 创建一个空的 FormData 对象
  var formData = new FormData();
  // 遍历对象的属性，并将其添加到 FormData
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      formData.append(key, data[key]);
    }
  }
  // 返回 FormData 对象
  return formData;
}

/**
 * 遍历对象 如果属性值是字符串类型，则去掉左右空格
 * @param {Object} obj
 * @returns
 */
 export function trimStringProperties(obj) {
  // 遍历对象的属性
  for (let prop in obj) {
      if (typeof obj[prop] === 'string') {
          // 如果属性值是字符串类型，则去掉左右空格
          obj[prop] = obj[prop].trim();
      }
  }
  return obj;
}