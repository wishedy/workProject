/**
 * @Desc：ajax请求封装
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Qiangkailiang on 17/7/14.
 */

export default function ajax(param) {
  let session_id = wx.getStorageSync('JSESSIONID'), header;//本地取存储的sessionID
  if (session_id != "" && session_id != null) {
    header = {
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': 'JSESSIONID=' + session_id
    }
  } else {
    header = {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }


  wx.request({
    url: param.url,
    data: "paramJson=" + JSON.stringify(param.data),
    header: header,
    method: param.method || "POST",
    dataType: param.dataType || "json",
    success(res) {
      param.done(res.data);
    },
    complete() {

    },
    fail(err) {
      // wx.hideLoading();
      param.fail && param.fail(err)
    }
  })
};

