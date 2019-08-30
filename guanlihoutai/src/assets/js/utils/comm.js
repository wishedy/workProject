/**
 * Created by FE on 2018/7/9.
 * comm 公共方法
 */
import {Loading} from 'element-ui';
import axios from './request';
import apiUrl from '@/api/apiUrlConfig.js';

const comm = {
  axios: axios,
  axiosCancel: null,
  sendAxios(api, params) {
    if (!params) {
      params = {};
    }
    if (apiUrl[api].type.toLowerCase() === 'get') {
      return axios.get(apiUrl[api].url, {
        params: params,
        cancelToken: new axios.CancelToken((c) => {
          this.axiosCancel = c;
        })
      }).then(function(res) {
        return res.data.responseObject;
      });
    }
    else {
      return axios({
        method: apiUrl[api].type,
        url: apiUrl[api].url,
        data: params,
        cancelToken: new axios.CancelToken((c) => {
          this.axiosCancel = c;
        })
      })
        .then(function(res) {
          return res.data.responseObject;
        });
    }
  },
  downloadFileAxios(api, params) {
    if (!params) {
      params = {};
    }
    if (apiUrl[api].type.toLowerCase() === 'get') {
      return axios.get(apiUrl[api].url, {
        params: params,
        headers: {'ms-type': 'application/vnd.ms-excel'},
        responseType: 'blob',
        cancelToken: new axios.CancelToken((c) => {
          this.axiosCancel = c;
        })
      }).then(function(res) {
        return res.data;
      });
    }
    else {
      return axios({
        method: apiUrl[api].type,
        url: apiUrl[api].url,
        data: params,
        headers: {'ms-type': 'application/vnd.ms-excel'},
        responseType: 'blob',
        cancelToken: new axios.CancelToken((c) => {
          this.axiosCancel = c;
        })
      }).then(function(res) {
        return res.data;
      });
    }
  },
  downloadFileHandle(res, fileName) {
    let downloadElement = document.createElement('a');
    let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
    let href = window.URL.createObjectURL(blob);
    downloadElement.href = href;
    downloadElement.download = fileName + '.xlsx';
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    window.URL.revokeObjectURL(href);
  },
  openLoading(text) {
    this.loading = Loading.service({
      lock: true,
      text: text,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
  },
  closeLoading() {
    if (this.loading) this.loading.close();
  },
  goBack(step) {
    this.closeLoading();
    this.axiosCancel && this.axiosCancel();
    if (step !== undefined) window.history.go(step);
  },
  // 参数:字符 字符串截取分隔符 截取分隔符类型 返回分隔类型
  cutLine(srcStr, cutType, type, callType) {
    let oneStep = [];
    if (srcStr && srcStr.lastIndexOf(cutType) > -1) {
      oneStep = srcStr.split(cutType);
    }
    else {
      oneStep.push(srcStr);
    }
    let str = '';

    for (let i = 0; i < oneStep.length; i++) {
      if (oneStep[i]) {
        if (oneStep[i].split(type)[1]) {
          str += oneStep[i].split(type)[1] + callType;
        }
        else {
          str += oneStep[i] + callType;
        }
      }
    }
    return str.substring(0, str.length - 1);
  },
  /*
   * 截取字符长度
   * 调用方法 getStrByteLen(字符串,截取长度) //长度需要转换成字节即一个汉字两个字节
   * */
  getStrLen(str, len) {
    let newStr = '';
    let newLength = 0;
    if (!str) { // 如果不存在
      return '';
    }
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 128) {
        newLength += 2;
      }
      else {
        newLength++;
      }
      if (newLength <= len) {
        newStr = newStr.concat(str[i]);
      }
      else {
        break;
      }
    }
    if (newLength > len) {
      newStr = newStr + '...';
    }
    return newStr;
  },
  /* 截取字符串长度，不带... */
  getStrLen2(str, len) {
    let newStr = '';
    let newLength = 0;
    if (!str) { // 如果不存在
      return '';
    }
    for (let i = 0; i <= str.length; i++) {
      if (str.charCodeAt(i) > 128) {
        newLength += 2;
      }
      else {
        newLength++;
      }
      if (newLength <= len) {
        newStr = newStr.concat(str[i]);
      }
      else {
        break;
      }
    }
    return newStr;
  },
  // 获取字符长度  区分中英文
  getByteLen(str) {
    let newLength = 0;
    if (!str) { // 如果不存在
      return 0;
    }
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 128) {
        newLength += 2;
      }
      else {
        newLength++;
      }
    }
    return newLength;
  },
  // 截取链接参数的函数
  getpara(symbol) {
    const _this = this;
    let url = document.URL;
    let param = {};
    let str, item;
    if (url.lastIndexOf(symbol || '?') > 0) {
      str = url.substring(url.lastIndexOf(symbol || '?') + 1, url.length);
      let arr = str.split('&');
      for (let i = 0; i < arr.length; i++) {
        item = arr[i].split('=');
        param[item[0]] = _this.htmlToString(decodeURIComponent(item[1]));
      }
    }
    return param;
  },
  // 展示时把html标签转换成字符串显示
  htmlToString(str) {
    /* eslint-disable */
    let rstStr = (str + '').replace(/[<>&]/g, function(c) {
      return {'<': '&lt;', '>': '&gt;', '&': '&amp;'}[c];
    });
    let tempArr = rstStr.split('\&lt\;\/a\&gt\;&lt\;a');
    if (tempArr.length >= 2) {
      rstStr = tempArr.map(function(d, index) {
        let s = d.replace(/\&lt\;a[\s]*href\=\'?(\S*)\'?\&gt\;([\S\s]*)/gi, '<a href=\'$1\'>$2');
        s = s.replace(/[\s]*href\=\'?(\S*)\'?\&gt\;([\S\s]*)&lt\;\/a\&gt\;/gi, '<a href=\'$1\'>$2</a>');
        s = s.replace(/[\s]*href\=\'?(\S*)\'?\&gt\;([\S\s]*)/gi, '<a href=\'$1\'>$2</a>');
        return s;
      }).join();
    }
    else {
      rstStr = (rstStr + '').replace(/\&lt\;a[\s]*href\=\'?(\S*)\'?\&gt\;([\S\s]*)\&lt\;\/a\&gt\;/gi, '<a href=\'$1\'>$2</a>');
    }
    rstStr = rstStr.replace(/@@/g, '@');
    return rstStr;
    /* eslint-disable */
  },
  // 空对象判断方法
  isEmptyObject(obj) {
    for (let n in obj) {
      return false;
    }
    return true;
  },
  isNumber(val) {
    if (!/^[1-9]\d*$/.test(val)) return false;
    return true;
  },
  // 是否为正整数
  isPositiveInteger(val) {
    return /^[0-9]*[1-9][0-9]*$/.test(val);
  },
  toRawType(val) {
    return Object.prototype.toString.call(val).slice(8, -1);
  },
  clearUndefinedAndSpace(val) {
    if (val === undefined || val === null) return '';
    return val.trim();
  },
  // 判断返回对象responseData
  hasResponseData(r) {
    if (r && r.responseObject && r.responseObject.responseData && !this.isEmptyObject(r.responseObject.responseData)) {
      return true;
    }
    return false;
  },
  // 深拷贝数组
  deepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
  },
  checkInvalid(val) { // 张恒2019/2/13/16:39
    if (((typeof val === 'string') && (val.length == 0)) || (val == undefined) || (val == 'undefined') || (val == 'null') || (typeof val === 'undefined') || (typeof val === 'null') || (val == null)) {
      return true;
    }
    else {
      return false;
    }
  }
};

export default comm;
