import Vue from "vue";
const $ = require('jquery');
let arthas_monitor_report = require('@allin/arthas_monitor_report');

function formatComponentName(vm) {
    if (vm.$root === vm) return 'root';
    let name = vm._isVue ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag) : vm.name;
    return (name ? 'component <' + name + '>' : 'anonymous component') + (vm._isVue && vm.$options && vm.$options.__file ? ' at ' + (vm.$options && vm.$options.__file) : '');
}

Vue.config.errorHandler = function (err, vm, info) {
    console.error(err) ;
    // handle error
    // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
    // 只在 2.2.0+ 可用
    let componentName = formatComponentName(vm);
    let propsData = vm.$options && vm.$options.propsData;
    //程序启动 token请填写站点siteid
    arthas_monitor_report.init({
        token: '21',
    });
    arthas_monitor_report.initVueErrorHandle(err,{
        metaData: {
            componentName: componentName,
            propsData: JSON.stringify(propsData),
            info: info
        }
    });
}
