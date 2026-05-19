

/**
 * 文本相似度对比
 * @param s 文本1
 * @param t 文本2
 * @param f 小数位精确度，默认2位
 * @returns {string|number|*} 百分数前的数值，最大100. 比如 ：90.32
 */
export const similar = (s, t, f) => {
  if (!s || !t) {
    return 0
  }
  var l = s.length > t.length ? s.length : t.length
  var n = s.length
  var m = t.length
  var d = []
  f = f || 3
  var min = function (a, b, c) {
    return a < b ? (a < c ? a : c) : (b < c ? b : c)
  }
  var i, j, si, tj, cost
  if (n === 0) return m
  if (m === 0) return n
  for (i = 0; i <= n; i++) {
    d[i] = []
    d[i][0] = i
  }
  for (j = 0; j <= m; j++) {
    d[0][j] = j
  }
  for (i = 1; i <= n; i++) {
    si = s.charAt(i - 1)
    for (j = 1; j <= m; j++) {
      tj = t.charAt(j - 1)
      if (si === tj) {
        cost = 0
      } else {
        cost = 1
      }
      d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
    }
  }
  let res = (1 - d[n][m] / l)
  return +res.toFixed(f)
}

// 生成随机数
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 从数组中随机选取多个元素
export const getRandomArrayElements = (arr, count) => {
  count = count < arr.length ? count : arr.length
  var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

// 获取元素在document(或者指定某个父级)上的offset相关值的累加（offsetTop，offsetLeft ...）
export const getOffSetValue = (el, vName, fEl = null) => {
  let val = el[vName] || 0
  // console.log(el, val)
  if (el.parentElement && el.parentElement != fEl) {
    return getOffSetValue(el.parentElement, vName, fEl) + val
  } else {
    return val
  }
}

// 返回x,y点与x轴形成的角度
export const getRotate = (x, y) => {
  let rotate = Math.atan2(y, x) * 180 / Math.PI
  if (rotate < 0) {
    rotate = 360 + rotate
  }
  return rotate
}

// px转rem
export const pxToRem = (v, convertV = 100) => {
  return +(v / convertV).toFixed(2)
}

// rem转px
export const remToPx = (v, convertV = 100) => {
  return +(v * convertV).toFixed(0)
}

/**
 * 计算某个点旋转后的坐标
 *
 * @param point  旋转的点 {x,y}
 * @param angle 旋转的角度
 * @param originPoint 基于哪个点旋转，默认值左上角原点{x: 0, y: 0}
 * @returns {{x: number, y: number}}
 */
export const  rotatePoint = (point, angle, originPoint = {x: 0, y: 0}) => {
  const cosA = Math.cos(angle * Math.PI / 180);
  const sinA = Math.sin(angle * Math.PI / 180);
  const rx = originPoint.x + (point.x - originPoint.x) * cosA - (point.y - originPoint.y) * sinA;
  const ry = originPoint.y + (point.x - originPoint.x) * sinA + (point.y - originPoint.y) * cosA;
  return { x: rx, y: ry };
}

// 节流
export const throttle = function (foo, timeout = 500) {
  let flag = false
  return () => {
    if (flag) {
      return
    }
    flag = true
    foo(...arguments)
    setTimeout(() => {
      flag = false
    }, timeout);
  }
}

// 防抖
export const antiShake = function (foo, timeout = 500) {
  let timeObj = null
  return () => {
    clearTimeout(timeObj)
    timeObj = setTimeout(() => {
      foo(...arguments)
    }, timeout);
  }
}

// 将base64转换为blob
export const dataURLtoBlob = function (dataurl) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// 将blob转换为file
export const blobToFile = function (theBlob, fileName) {
   theBlob.lastModifiedDate = new Date();  // 文件最后的修改日期
   theBlob.name = fileName;                // 文件名
   return new File([theBlob], fileName, {type: theBlob.type, lastModified: Date.now()});
}

// 下载Base64
export const downloadBase64 = function (base64, fileName) {
  let aTag = document.createElement('a');
  aTag.download = fileName;
  aTag.href = base64;
  aTag.click();
}

// 下载文件
export const downloadFile = function (fileOrUrl, fileName) {
  let aTag = document.createElement('a');
  aTag.download = fileName;
  if (typeof fileOrUrl == 'string') {
    aTag.href = fileOrUrl;
    aTag.click();
  } else {
    let href = URL.createObjectURL(fileOrUrl); //获取url
    aTag.href = href;
    aTag.click();
    URL.revokeObjectURL(href); //释放url
  }
}
