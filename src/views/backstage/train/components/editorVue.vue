<template>
  <div class="editor">

    <div style="border: 1px solid #ccc; height: 100%;border-radius: 4px">
      <!-- 工具栏 -->
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig"/>
      <!-- 编辑器 -->
      <Editor style="height: 70%; font-size: 0.16rem;" :defaultConfig="editorConfig" v-model="html" @onChange="onChange"
              @onCreated="onCreated"/>
    </div>
  </div>
</template>

<script>
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";

export default {
  name: "editorVue",
  components: {Editor, Toolbar},
  props: {
    content: {
      type: String,
      default: '',
    },

  },
  data() {
    return {
      editor: null,
      html: '',
      toolbarConfig: {
        /* 显示哪些菜单，如何排序、分组 */
        toolbarKeys: [
          'headerSelect',
          // '|', 
          'bold',
          'underline',
          'italic',
          'color',
          'bgColor',
          // '|', 
          'indent',  // 增加缩进
          'delIndent',  // 减少缩进
          'justifyLeft',  // 左对齐
          'justifyRight',  // 右对齐
          'justifyCenter',  // 居中
          'justifyJustify',  // 两端对齐
          // '|', 
          'fontSize',
          'fontFamily',
          'lineHeight',
          // '|', 
          'bulletedList',
          'numberedList',
          'todo',
          'insertLink',
          'insertTable',
          // '|', 
          'codeBlock',
          'divider',
          'uploadImage',
          'undo',
          'redo',
        ],
        // excludeKeys: [ ], /* 隐藏哪些菜单 */ 
      },

      editorConfig: {
        placeholder: "请输入内容",
        MENU_CONF: {
          // 配置上传图片
          uploadImage: {
            customUpload: this.uploaadImg,
            allowedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
          },
        },
      },
    };
  },
  watch: {
    content: {
      immediate: true,
      deep: true,
      handler(val) {
        // console.log(val);

        if (val == '') {
          this.html = val;
        }
        this.html = val;
      },

    }
  },
  methods: {
    uploaadImg(file, insertFn) {
      this.$emit('uploadImg', file, insertFn)
    },
    onCreated(editor) {
      this.editor = Object.seal(editor);
      this.editor.focus(true)
    },
    onChange(editor) {
      let data = editor.getHtml() // onChange 时获取编辑器最新内容
      this.$emit('changeData', data)
    },
  },
  created() {
    this.html = this.content;

  },
  mounted() {

  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁 editor
  },
};
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="less" scoped>
.editor {
  width: 100%;
  height: 100%;
}
</style>
