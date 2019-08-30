import Vue from 'vue';
import BaseConfirmComponent from './BaseConfirm.vue';

const BaseConfirmConstructor = Vue.extend(BaseConfirmComponent);
const BaseConfirm = (obj) => {
  const ConfirmInstance = new BaseConfirmConstructor({
    data: {
      type: obj.type,
      btnName: obj.btnName,
      title: obj.title,
      content: obj.content,
      done: obj.done,
      cancel: obj.cancel
    }
  });

  ConfirmInstance.vm = ConfirmInstance.$mount(); // 挂载但是并未插入dom，是一个完整的Vue实例
  ConfirmInstance.vm.visible = true;
  ConfirmInstance.dom = ConfirmInstance.vm.$el;
  if (document.getElementById('allin_confirm')) {
    document.getElementById('app').children[1].removeChild(document.getElementById('allin_confirm'));
  }
  document.getElementById('app').children[1].appendChild(ConfirmInstance.dom);
  return ConfirmInstance.vm;
};

export default{
  install: Vue => {
    Vue.prototype.$allin_confirm = BaseConfirm; // 将BaseConfirm组件暴露出去，并挂载在Vue的prototype上
  }
};
