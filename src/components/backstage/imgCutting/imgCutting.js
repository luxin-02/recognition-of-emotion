import Vue from 'vue'
import ImgCutting from "./ImgCutting.vue";

let createMount = (opts) => {
    let mountNode = document.createElement('div')
    document.body.appendChild(mountNode)
    const confirmObj = Vue.extend(ImgCutting)
    let popupMessage = new confirmObj({
        propsData: {
            ...opts,
            show: true,
            remove() {
                setTimeout(() => {
                    popupMessage.$destroy()
                    popupMessage.$el.remove();
                }, 1000);
            }
        },
    });
    return popupMessage.$mount(mountNode);
}

function Confirm(options = {}) {
    let $inst = createMount(options)
    return $inst
}

Confirm.asyncShow = (file, width, height) => {
    return new Promise((resolve, reject) => {
        Confirm({
            img: file,
            cropWidth: width,
            cropHeight: height,
            saveFoo: (data) => {
                resolve(data)
            },
            cancelFoo: () => {
                reject('用户取消裁剪')
            }
        })
    })

}

Confirm.asyncShowByFile = (file, width, height) => {
    return new Promise((resolve, reject) => {
        Confirm({
            img: file,
            cropWidth: width,
            cropHeight: height,
            saveFoo: async (data) => {

                try {
                    let file = await base64ToFile(data)
                    resolve(file)
                } catch (e) {
                    console.error(e)
                }


            },
            cancelFoo: () => {
                reject('用户取消裁剪')
            }
        })
    })

}

Confirm.install = app => {
    app.prototype.$imgCutting = Confirm
    // app.component('img-cutting', ImgCutting)
}

/**
 *base64,转file
 * @param base64
 * @param fileName
 * @returns {File}
 */

export function base64ToFile(base64, fileName) {
    let blob = dataURLtoBlob(base64)
    return blobToFile(blob, fileName)
}


//2,再将blob转换为file
function blobToFile(theBlob, fileName) {
    theBlob.lastModifiedDate = new Date();  // 文件最后的修改日期
    theBlob.name = fileName;                // 文件名
    return new File([theBlob], fileName, {type: theBlob.type, lastModified: Date.now()});
}

export const dataURLtoBlob = function (dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}
export default Confirm