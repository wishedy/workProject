//小程序公用方法提取

class MiniCommon {
  constructor() {}

  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            resolve(res);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          // console.log(err)
          reject(err);
        }
      })
    });
  }

  getUserInfo(param) {

    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        timeout: param.timeout||10000,
        withCredentials: param.withCredentials||false,
        success: (res) => {
          // console.log('getUserInfoSuccess: ' + JSON.stringify(res));
          resolve(res);
        },
        fail: (err) => {
          // console.log('getUserInfoError: ' + JSON.stringify(err));
          reject(err);
        }
      });
    });
  }
}

export default new MiniCommon();
