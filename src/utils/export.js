import docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import JSZipUtils from "jszip-utils";
import { saveAs } from "file-saver";
import JSZip from "jszip";

const ImageModule = require("docxtemplater-image-module-free");

/**
 * 根据模板导出Word文件
 * @param {*} docxsrc 模板路径
 * @param {*} fullData 模板数据
 * @param {*} docxName 导出名称
 */
export const exportWord = (docxsrc, fullData, docxName, config) => {
  action(docxsrc, fullData, config).then((out) => {
    // 将目标文件对象保存为目标类型的文件，并命名
    saveAs(out, docxName + ".docx");
  });
};

/**
 * 根据模板导出Word文件，并打包成zip
 * @param {*} docxsrc 模板路径
 * @param {*} dataList 模板数据集[{ itsname: 'word文件名', }]
 * @param {*} zipName 导出压缩包名称
 */
export const exportWordZip = (docxsrc = "", dataList, zipName, config) => {
  const promises = [];
  const zips = new JSZip();

  dataList.forEach((fullData, index) => {
    if (dataList[index].docxsrc) {
      promises.push(action(dataList[index].docxsrc, fullData, config));
    } else {
      promises.push(action(docxsrc, fullData, config));
    }
  });

  Promise.all(promises).then((outArr) => {
    outArr.forEach((out, index) => {
      let fileName = dataList[index].itsname + ".docx";
      // 添至zip集合中
      zips.file(fileName, out, { binary: true });
    });

    zips.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, zipName);
    });
  });
};

function base64DataURLToArrayBuffer(dataURL) {
  const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/;
  if (!base64Regex.test(dataURL)) {
    return false;
  }
  const stringBase64 = dataURL.replace(base64Regex, "");
  let binaryString;
  if (typeof window !== "undefined") {
    binaryString = window.atob(stringBase64);
  } else {
    binaryString = new Buffer(stringBase64, "base64").toString("binary");
  }
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    const ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes.buffer;
}

function action(docxsrc, fullData, config) {
  config = Object.assign(
    {
      imgSize: [600, 300],
      otherSize: {},
    },
    config
  );
  return new Promise((resolver, reject) => {
    // 读取并获得模板文件的二进制内容
    JSZipUtils.getBinaryContent(docxsrc, function (error, content) {
      // exportTemplate.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
      // 抛出异常
      if (error) {
        throw error;
      }

      // 图片处理
      let opts = {};
      opts.centered = true; // 图片居中，在word模板中定义方式为{%%image}
      opts.fileType = "docx";
      opts.getImage = function (chartId) {
        return base64DataURLToArrayBuffer(chartId);
      };
      let imgW = config.imgSize[0] || config.imgSize;
      let imgH = config.imgSize[1] || imgW;
      // opts.getSize = function (chartId) {
      opts.getSize = function (img, tagValue, tagName) {
        // let activeSize = config.otherSize[chartId];
        let activeSize = config.otherSize[tagName];

        return activeSize ? activeSize : [imgW, imgH];
      };

      let imageModule = new ImageModule(opts);
      // 创建一个PizZip实例，内容为模板的内容
      let zip = new PizZip(content);
      // 创建并加载docxtemplater实例对象
      let doc = new docxtemplater();
      doc.attachModule(imageModule);
      doc.loadZip(zip);

      // 设置模板变量的值
      doc.setData(fullData);

      try {
        // 用模板变量的值替换所有模板变量
        doc.render();
      } catch (error) {
        // 抛出异常
        let e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties: error.properties,
        };
        throw error;
      }
      // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
      let out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      resolver(out);
    });
  });
}
