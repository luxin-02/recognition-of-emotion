
// 图片懒加载
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      // 如果图片元素进入视口(交叉比例大于 threshold)
      if (entry.isIntersecting) {
        // 获取当前图片元素
        const image = entry.target;
        // 设置图片的src属性，触发图片加载
        image.src = image.dataset.src;
        // 加载完成后，不再观察该图片
        observer.unobserve(image);
      }
    });
  },
  { threshold: 0.2 },
);

export default {
  install(app, option) {
    // 指令测试
    app.directive('demo', {
      /**只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。 */
      bind: function (el, binding, vnode, oldVnode) {
        console.log('bind');
        console.log(el, binding, vnode, oldVnode)
      },
      /**被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。 */
      inserted: function (el, binding, vnode, oldVnode) {
        console.log('inserted');
        console.log(el, binding, vnode, oldVnode)
      },
      /**所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。
       * 但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。 
       */
      update: function (el, binding, vnode, oldVnode) {
        console.log('update');
        console.log(el, binding, vnode, oldVnode)
      },
      /**指令所在组件的 VNode 及其子 VNode 全部更新后调用。 */
      componentUpdated: function (el, binding, vnode, oldVnode) {
        console.log('componentUpdated');
        console.log(el, binding, vnode, oldVnode)
      },
      /**只调用一次，指令与元素解绑时调用。 */
      unbind: function (el, binding, vnode, oldVnode) {
        console.log('unbind');
        console.log(el, binding, vnode, oldVnode)
      }
      /**
       * el: 指令所绑定的元素，可以用来直接操作 DOM。
       * binding: 一个对象，包含以下 property：
       *    name: 指令名，不包括 v- 前缀。
       *    value: 指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
       *    oldValue: 指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
       *    expression: 字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
       *    arg: 传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
       *    modifiers: 一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。
       * vnode: Vue 编译生成的虚拟节点。移步 VNode API 来了解更多详情。
       * oldVnode: 上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。
       */
    })

    // 弹窗移动指令  示例：<div v-move="'.title'"><div class="title">头部(按下可拖动)</div><div>主体</div></div>
    app.directive('move', {
      bind(el, binding, vnode, oldVnode) {
        // console.log('mounted');
        // console.log(el, binding, vnode, oldVnode)

        let dialogBox = el,
          dialogHead = binding.value ? el.querySelector(binding.value) : el
        // console.log(dialogBox, dialogHead)
        if (!dialogHead) {
          console.error('未找到 ' +  (binding.value) + ' 对应的元素', el, binding, vnode, oldVnode)
          return
        }
        
        dialogHead.addEventListener('mousedown', move);
        dialogHead.addEventListener('touchstart', move);

        function move (e) {
          let innerWidth = window.innerWidth,
              innerHeight = window.innerHeight
          let proportion = 1920 / innerWidth;
          //获取需要移动的弹窗
          let eTarget = dialogBox;

          if (e.type === 'touchstart') {
            e.clientX = e.touches[0].clientX;
            e.clientY = e.touches[0].clientY;
          }

          const disX = e.clientX - eTarget.offsetLeft;
          const disY = e.clientY - eTarget.offsetTop;

          document.addEventListener('mousemove', onDragging);
          document.addEventListener('mouseup', onDragEnd);
          document.addEventListener('touchmove', onDragging, { passive: false });//触摸屏移动
          document.addEventListener('touchend', onDragEnd);

          function onDragging(e) {
            if (e.cancelable) { // 判断是否可取消事件
              e.preventDefault(); // 阻止默认行为
            }
            if (e.type === 'touchmove') {
              e.clientX = e.touches[0].clientX;
              e.clientY = e.touches[0].clientY;
            }
            let clientX = e.clientX,
                clientY = e.clientY
            
            // 防止出边界
            if (clientX < 20) {
              clientX = 20
            } else if (clientX > innerWidth - 20) {
              clientX = innerWidth - 20
            }
            if (clientY < 20) {
              clientY = 20
            } else if (clientY > innerHeight - 20) {
              clientY = innerHeight - 20
            }

            // 计算
            var l = (clientX - disX) * proportion / 100;
            var t = (clientY - disY) * proportion / 100;

            eTarget.style.left = l + "rem";
            eTarget.style.top = t + "rem";
          }

          function onDragEnd() {
            document.removeEventListener('mousemove', onDragging);
            document.removeEventListener('touchmove', onDragging);
            document.removeEventListener('touchend', onDragEnd);
            document.removeEventListener('mouseup', onDragEnd);
          }
        }
        
      }
    })

    // 防抖指令  示例：<div v-antiShake:500.click="(e)=>{foo(e)}"></div>
    app.directive('antiShake', {
      bind: function (el, binding, vnode, oldVnode) {
        let timeObj = null

        let timeout = binding.arg ? +binding.arg : 500
        timeout = isNaN(timeout) ? 500 : timeout

        let eventList = Object.keys(binding.modifiers)
        if (eventList.length <= 0) {
          eventList.push('click')
        }
        eventList.forEach((event)=>{
          el.addEventListener(event, foo);
        })
        
        function foo () {
          clearTimeout(timeObj)
          timeObj = setTimeout(() => {
            binding.value(...arguments)
          }, timeout);
        }
      },
    })

    // 节流指令  示例：<div v-throttle:500.click="(e)=>{foo(e)}"></div>
    app.directive('throttle', {
      bind: function (el, binding, vnode, oldVnode) {
        let flag = false

        let timeout = binding.arg ? +binding.arg : 500
        timeout = isNaN(timeout) ? 500 : timeout

        let eventList = Object.keys(binding.modifiers)
        if (eventList.length <= 0) {
          eventList.push('click')
        }
        eventList.forEach((event)=>{
          el.addEventListener(event, foo);
        })

        function foo () {
          if (flag) {
            return
          }
          flag = true
          binding.value(...arguments)
          setTimeout(() => {
            flag = false
          }, timeout);
        }
      },
    }),

    // 图片懒加载  示例：<img v-lazyImg :data-src="imgUrl" />
    app.directive('lazyImg', {
      bind: function (el, binding, vnode, oldVnode) {
        observer.observe(el);
      },
      componentUpdated: function (el, binding, vnode, oldVnode) {
        if (vnode.data.attrs["data-src"] != oldVnode.data.attrs["data-src"]) {
          observer.observe(el);
        }
      },
      unbind: function (el, binding, vnode, oldVnode) {
        observer.unobserve(el);
      }
    })

  }
}
