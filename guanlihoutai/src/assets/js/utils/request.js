/**
 * 功能描述：基于 axios 带统一封装的请求接口
 * 使用方法：
 * 注意事项：
 * 引入来源：
 * 作用：在使用 axios 时，对接口做一些统一封装
 * Create by YaoQiao on 2018/10/15
 */

'use strict';

import * as axios from 'axios';
// import qs from 'qs';

// let newAxios = axios.create();
let newAxios = axios;

/* 过滤请求 */
newAxios.interceptors.request.use((config) => {
  // 判断请求类型
  if (config.method === 'post') {
    // let data = qs.parse(config.data);
    if (config.data instanceof FormData) {
      console.log(config);
      config.headers = {
        'Content-Type': 'multipart/form-data' // 之前说的以表单传数据的格式来传递fromdata
      };
      console.log('---->', config);
      config.data.append('visitSiteId', 25);
    }
    else {
      config.data = { // 统一添加访问站点id
        visitSiteId: 25,
        ...config.data
      };
    }
  }
  else if (config.method === 'put') {
    config.data = {
      visitSiteId: 25, // 统一添加访问站点id
      ...config.data
    };
  }
  else if (config.method === 'get') {
    config.params = {
      visitSiteId: 25, // 统一添加访问站点id
      ...config.params
    };
  }

  config.withCredentials = true;

  return config;
}, (err) => {
  return Promise.reject(err);
});

/* 过滤响应 */
newAxios.interceptors.response.use((response) => {
  // 当且仅当jwt处理的token为false时，才提示用户重新登录，
  // 正常情况不会返回jwtToken
  if (response.data.jwtToken === false) {
    // localStorage.clear();
    // window.location.reload();
  }
  else {
    return response;
  }
}, (err) => {
  return Promise.reject(err);
});

export default newAxios;
