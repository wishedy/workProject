import TipMessageComponent from './Message.vue';

const TipMessage = {};

// 注册Toast
TipMessage.install = function(Vue) {
  // 生成一个Vue的子类
  // 同时这个子类也就是组件
  const ToastConstructor = Vue.extend(TipMessageComponent);
  // 生成一个该子类的实例
  const instance = new ToastConstructor();

  // 将这个实例挂载在我创建的div上
  // 并将此div加入全局挂载点内部
  // instance.$mount(document.createElement('div'))
  // document.body.appendChild(instance.$el)

  // 通过Vue的原型注册一个方法
  // 让所有实例共享这个方法
  /**
   * 全局消息提示
   * @param visible 是否可见
   * @param type 消息类型
   * @param msg 消息内容
   * @param appendClassPlace 追加位置，暂只支持class
   * @param duration  消失时间，如果为0，则不消失
   */
  Vue.prototype.$tipMessage = (visible, type, msg, appendClassPlace, duration = 1500) => {
    switch (type) {
      case 'info':
        instance.type.isInfo = true;
        break;
      default:
        break;
    }

    instance.$mount(document.createElement('div'));
    document.querySelector('.' + [appendClassPlace]).appendChild(instance.$el);
    instance.message = msg;
    instance.visible = visible;

    if (visible && duration > 0) {
      setTimeout(() => {
        instance.visible = false;
        instance.message = '';
      }, duration);
    }
  };
};

export default TipMessage;
