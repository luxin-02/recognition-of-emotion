import Vue from 'vue'
import Popup from "./index.vue";
import {isString} from "@/utils/type";

let createMount = (opts) => {
    let mountNode = document.createElement('div')
    document.body.appendChild(mountNode)
    const confirmObj = Vue.extend(Popup)
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


Confirm.asyncShow = function (opt) {
    let options = isString(opt) ? {
        title: '提示',
        content: opt,

    } : {...opt}
    return new Promise((resolve) => {
        createMount({
                ...options,
                saveFoo: () => {

                    resolve(true)

                },
                cancelFoo: () => {

                    resolve(false)

                }
            },
        )

    })

}

export default Confirm