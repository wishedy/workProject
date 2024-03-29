<template>
  <div class="markdown-editor-box">
    <link rel="stylesheet" href="/static/editor.md/css/editormd.min.css">

    <link rel="stylesheet" href="/static/editor.md/css/editormd.preview.min.css" />
    <div :id="editorId"></div>
  </div>
</template>

<script>
import scriptjs from 'scriptjs';
import { defaultConfig } from './editorConfig';
export default {
  name: 'editorMd',
  props: {
    editorId: {
      'type': String,
      'default': 'markdown-editor'
    },

    content: '',
    onchange: { // 内容改变时回调，返回（html, markdown, text）
      type: Function
    },
    config: { // 编辑器配置
      type: Object
    },
    initData: {
      'type': String
    },
    initDataDelay: {
      'type': Number, // 延迟初始化数据时间，单位毫秒
      'default': 0
    }
  },
  data: function() {
    return {
      editor: {},
      timer: null,
      doc: {},
      jsLoadOver: false
    };
  },
  methods: {
    fetchScript: function(url) {
      return new Promise((resolve) => {
        scriptjs(url, () => {
          resolve();
        });
      });
    },
    getConfig: function() {
      return { ...defaultConfig, ...this.config };
    },
    getEditor: function() {
      return this.editor;
    },
    getDoc: function() {
      return this.doc;
    },
    watch: function() {
      return this.editor.watch();
    },
    unwatch: function() {
      return this.editor.unwatch();
    },
    previewing: function() {
      return this.editor.previewing();
    },
    getHTML: function() {
      return this.editor.getHTML();
    },
    getMarkdown: function() {
      return this.editor.getMarkdown();
    },
    setMarkdown: function(markdown) {
      return this.editor.setMarkdown(markdown);
    },
    init(id) {
      let vm = this;
      let editor = this.editor;
      if (editor.goEdit) {
        editor.goEdit = false;
      }
      else {
        editor.isEditing = false;
      }
      vm.initEditor(this.content);
    },
    initEditor: function(markdown) {
      let vm = this;
      let config = vm.getConfig();
      if (markdown) {
        config.markdown = markdown;
      }
      (async() => {
        await vm.fetchScript('/static/editor.md/jquery.min.js');
        await vm.fetchScript('/static/editor.md/editormd.min.js');
        vm.jsLoadOver = true;
        vm.$nextTick(() => {
          vm.editor = window.editormd(vm.editorId, config);
          vm.editor.on('load', () => {
            setTimeout(() => { // hack bug: 一个页面多个编辑器只能初始化其中一个数据问题
              vm.initData && vm.editor.setMarkdown(vm.initData);
            }, vm.initDataDelay);
          });
          vm.onchange && vm.editor.on('change', () => {
            let html = vm.editor.getPreviewedHTML();
            if (html) {
              vm.onchange({
                markdown: vm.editor.getMarkdown(),
                html: html,
                text: window.$(html).text()
              });
            }
          });
        });
      })();
    }
  },
  mounted: function() {
    let vm = this;
    let docId = vm.$router.currentRoute.name;
    vm.init(docId);
    vm.timer = setInterval(function() {
      if (vm.editor && vm.jsLoadOver) {
        try {
          vm.watch();
          vm.previewing();
          vm.previewing();
          window.clearInterval(vm.timer);
          vm.timer = null;
        }
        catch (e) {
        }
      }
    }, 80);
  },
  destroyed: function() {
    let vm = this;
    if (vm.timer != null) {
      window.clearInterval(vm.timer);
      vm.timer = null;
    }
  }
};
</script>

<style scoped>

</style>
