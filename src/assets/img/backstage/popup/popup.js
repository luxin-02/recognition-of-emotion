import Vue from 'vue'
import Popup from "./Popup.vue";

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

Confirm.asyncShow = (content) => {

  return new Promise((resolve, reject) => {
    Confirm({
      content,
      saveFoo: () => { resolve(true) },
      cancelFoo: () => { resolve(false) }
    })
  })

}

Confirm.install = app => {
  app.prototype.$backstagePopup = Confirm
  app.component('backstage-popup', Popup)
}
export default Confirm