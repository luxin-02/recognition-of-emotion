//1.图片文件转base64
export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
          resolve(fileReader.result);
      }
      if (file) {
          fileReader.readAsDataURL(file);
      }
  })
}
// 实例
// getBase64.then((data)=>{
//   console.log(data);
// })

/**
* 2.将base64转换为blob
* @param {*} dataurl base64
* @returns Blob
*/
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

/**
* 3.将blob转换为file
* @param {*} theBlob blob
* @param {*} fileName 文件名称  '1.png'
* @returns File
*/
export const blobToFile = function (theBlob, fileName) {
  theBlob.lastModifiedDate = new Date();  // 文件最后的修改日期
  theBlob.name = fileName;                // 文件名
  return new File([theBlob], fileName, { type: theBlob.type, lastModified: Date.now() });
}

/**
* 4.将base64转换为file
* @param {*} dataurl base64
* @param {*} fileName 文件名称  '1.png'
* @returns File
*/
export const base64ToFile = function (dataurl, fileName) {
  return blobToFile(dataURLtoBlob(dataurl), fileName)
}

/**
* 下载Base64
* @param {*} base64 Base64
* @param {*} fileName 文件名称
*/
export const downloadBase64 = function (base64, fileName) {
  let aTag = document.createElement('a');
  aTag.download = fileName;
  aTag.href = base64;
  aTag.click();
}

/**
* 下载文件
* @param {*} fileOrUrl url
* @param {*} fileName 文件名称
*/
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
