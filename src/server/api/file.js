import { post } from "@/server/axios";

/**
 * 查找file对象
 * @param {*} obj
 * @returns
 */
function findFileProperty(obj) {
  // 检查对象本身是否为 File 对象
  if (obj instanceof File) {
    return obj;
  }

  // 遍历对象的所有属性
  for (let key in obj) {
    // 检查属性值是否为 File 对象
    if (obj[key] instanceof File) {
      return obj[key]; // 如果是，则返回该属性值
    }
    // 如果属性值是对象，则递归调用 findFileProperty 继续查找
    if (typeof obj[key] === "object" && obj[key] !== null) {
      const file = findFileProperty(obj[key]);
      // 如果找到了文件属性，则返回该属性值
      if (file instanceof File) {
        return file;
      }
    }
  }
  // 如果没有找到文件属性，则返回 null
  return null;
}

//没有file文件
class notFindFileError extends Error {
  constructor(message) {
    super(message);
    this.name = "CustomError";
  }
}

//上传excel文件
export function fileApiExcel(params) {
  if (params instanceof FormData) {
    return post("/backend/uploadfile/files", params);
  }

  let file = findFileProperty(params);
  if (file) {
    const formData = new FormData();
    formData.append("file_upload", file);
    return post("/backend/uploadfile/files", formData);
  } else {
    throw new notFindFileError("not find file error");
  }
}

//上传图片文件
export function fileApiImage(params) {
  if (params instanceof FormData) {
    return post("/backend/uploadfile/photo", params);
  }

  let file = findFileProperty(params);
  if (file) {
    const formData = new FormData();
    formData.append("file_upload", file);
    return post("/backend/uploadfile/photo", formData);
  } else {
    throw new notFindFileError("not find file error");
  }
}

//上传音频文件
export function fileApiMusic(params) {
  if (params instanceof FormData) {
    return post("/backend/uploadfile/wav", params);
  }

  let file = findFileProperty(params);
  if (file) {
    const formData = new FormData();
    formData.append("file_upload", file);
    return post("/backend/uploadfile/wav", formData);
  } else {
    throw new notFindFileError("not find file error");
  }
}

//图片转base64
export function fileApiImageToBase64(params) {
  return post("/api/Report/imgToBase64", params);
}
