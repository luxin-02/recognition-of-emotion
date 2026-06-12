import store from "@/store"

export default {
  install (app, option) {

    /**
     * 权限指令注册 v-auth='权限标识通过vueX进行匹配'
     */
    app.directive('auth', {
      bind (el, binding, vnode) {
        let key = binding.value;

        //查找缓存是否拥有权限
        let flag = store.state.user.authList.some(v => v == key);

        //没有权限的话进行隐藏操作
        if (!(flag)) {
          // 创建一个注释元素
          const comment = document.createComment(' ');
          // 设置value值
          Object.defineProperty(comment, 'setAttribute', {
            value: () => undefined,
          });
          // 用注释节点替换 当前页面元素  
          vnode.elm = comment;
          // 下面作为初始化操作 赋值为空
          vnode.text = ' ';
          vnode.isComment = true;
          vnode.context = undefined;
          vnode.tag = undefined;
          vnode.data.directives = undefined;

          // 判断当前元素是否是组件  如果是组件的话也替换成 注释元素
          if (vnode.componentInstance) {
            vnode.componentInstance.$el = comment;
          }

          // 判断当前元素是否是文档节点或者是文档碎片节点 
          if (el.parentNode) {
            // 从 DOM 树中删除 node 节点，除非它已经被删除了。
            el.parentNode.replaceChild(comment, el);
          }
        }
      },
    })

    // 弹窗移动指令  示例：<div v-move="'.title'"><div class="title">头部(按下可拖动)</div><div>主体</div></div>
    app.directive('move', {
      bind (el, binding, vnode, prevVnode) {
        // console.log('mounted');
        // console.log(el, binding, vnode, prevVnode)

        let dialogBox = el,
          dialogHead = binding.value ? el.querySelector(binding.value) : el
        // console.log(dialogBox, dialogHead)
        if (!dialogHead) {
          console.error('未找到 ' + (binding.value) + ' 对应的元素', el, binding, vnode, prevVnode)
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

          function onDragging (e) {
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

          function onDragEnd () {
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
      bind: function (el, binding, vnode, prevVnode) {
        let timeObj = null

        let timeout = binding.arg ? +binding.arg : 500
        timeout = isNaN(timeout) ? 500 : timeout

        let eventList = Object.keys(binding.modifiers)
        if (eventList.length <= 0) {
          eventList.push('click')
        }
        eventList.forEach((event) => {
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
      bind: function (el, binding, vnode, prevVnode) {
        let flag = false

        let timeout = binding.arg ? +binding.arg : 500
        timeout = isNaN(timeout) ? 500 : timeout

        let eventList = Object.keys(binding.modifiers)
        if (eventList.length <= 0) {
          eventList.push('click')
        }
        eventList.forEach((event) => {
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
    })

  }
}
