/*
* Created by ZhangHongda on 2018.11.15.
*
* 添加异常监控的方法
* */
import Vue from "vue";

let arthas_monitor_report = require('@allin/arthas_monitor_report');

function formatComponentName(vm) {
    if (vm.$root === vm) return 'root';

    var name = vm._isVue ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag) : vm.name;
    return (name ? 'component <' + name + '>' : 'anonymous component') + (vm._isVue && vm.$options && vm.$options.__file ? ' at ' + (vm.$options && vm.$options.__file) : '');

}

Vue.config.errorHandler = function (err, vm, info) {
    console.error(err) ;
    // handle error
    // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
    // 只在 2.2.0+ 可用
    var componentName = formatComponentName(vm);
    var propsData = vm.$options && vm.$options.propsData;
    /**
     * @description 配置项
     * token: '2', //必填,请根据具体站点传入siteId
     * limitTime:3000,   //相同异常日志发送最小间隔，即相同异常数据最快每3s发送一次
     *  checkImgSetIntervalTime: 10000, // 检查新增图片的间隔时间,默认10s
     *   transferSizeNum: 1024  //多大的图片算是大图标准 单位为kb 默认1兆
     */
    arthas_monitor_report.init({
        token: '2',
    });
    arthas_monitor_report.initVueErrorHandle(err,
        {
            metaData:
                {
                    componentName: componentName,
                    propsData: JSON.stringify(propsData),
                    info: info
                }
        });
}