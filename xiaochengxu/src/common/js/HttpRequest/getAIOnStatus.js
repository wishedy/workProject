/**
 * Desc: get AI小程序状态
 * Usage:
 * Notify:
 * Depend:
 * Create by JK on 2018/9/21.
 */

import util from 'common/js/util/util';
const XHRhttp = util.httpEnv() + '/mcall/log/patient/keyword/v1/update/';

import ajax from 'common/js/util/ajax';
// import { resolve } from 'dns';
// import { rejects } from 'assert';

export default function getAIStatus(param) {
  const _default = {}
  const data = Object.assign(_default, param);

  return new Promise((resolve, reject) => {
    ajax({
      url: XHRhttp,
      methods: 'POST',
      data,
      done(data) {
        resolve(data)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}
