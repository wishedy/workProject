/**
 * 功能描述：表单校验规则库
 * 使用方法：配合 element-ui 的 rules 使用
 * 注意事项：需配合 element-ui 的 form 使用
 * 引入来源：
 * 作用：校验表单
 * Create by YaoQiao on 2018/9/29
 */

'use strict';

export default {
  // 全空格校验，如果为全空格
  fullSpanceVaild: (rule, value, callback) => {
    if (value.trim() === '') {
      callback(new Error('值不能全为空'));
    }
    else {
      callback();
    }
  }, // 校验是否为正整数
  isPositiveInteger: (rule, value, callback) => {
    if (/^[0-9]*[1-9][0-9]*$/.test(value) && value !== '0') {
      callback();
    }
    else {
      callback(new Error('必须为正整数'));
    }
  },
  liveCustomerIdList: (rule, value, callback) => {
    if (value.indexOf('，') > -1) {
      callback(new Error('请使用半角逗号分隔'));
      return false;
    }
    if (value.indexOf(',') > -1) {
      let vals = value.split(',');
      for (let i = 0; i < vals.length; i++) {
        const valueElement = vals[i];
        if (!/\d{13}/.test(valueElement)) {
          callback(new Error('请输入正确的直播用户Id，多个用户Id之间使用逗号分隔'));
          return false;
        }
      }
      callback();
    }
    else {
      if (!/\d{13}/.test(value)) {
        callback(new Error('请输入正确的直播用户Id，多个用户Id之间使用逗号分隔'));
        return false;
      }
      else {
        callback();
      }
    }
  }
};
