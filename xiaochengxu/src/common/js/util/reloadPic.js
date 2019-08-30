import util from "./util";

export default function reloadFiles(param) {
  const xhr = util.httpEnv() + "/mcall/customer/patient/case/attachment/v1/createPicture/";
  class reloadFiles {
    constructor() {
      this.init()
    }
    init() {
      param.uploadBefor()
      const uploadTask = wx.uploadFile({
        url: xhr,
        filePath: param.param,
        name: "file",
        formData: {
          caseCategoryId: "1", //	string	是	上传的图片的资料类型（treatmentId）		1-X光片
          imageType: "1", //	string	是	资源类型		1-上传资料图片
          // caseAttSource: "17",
          visitSiteId: "24"
        },
        success: function (res) {
          var _data = JSON.parse(res.data);
          //   if (typeof upLoadIndex !== "undefined") {
          //       _this.imgUrl[upLoadIndex].imgId = _data.responseObject.responsePk;
          //       _this.imgUrl[upLoadIndex].uploading = false;
          //       _this.imgUrl[upLoadIndex].fail = false;
          //       _this.imgUrl[upLoadIndex].finish = true;
          //   } else {
          //       _this.imgUrl[0].imgId = _data.responseObject.responsePk;
          //       _this.imgUrl[0].uploading = false;
          //       _this.imgUrl[0].fail = false;
          //       _this.imgUrl[0].finish = true;
          //   }
          if (_data.responseObject.responsePk>0) {
            
            param.uploadDoneFn({
              imgId: _data.responseObject.responsePk,
              uploading: false,
              fail: false,
              finish: true
            })
          }else{
            param.uploadDoneFn({
              imgId: _data.responseObject.responsePk,
              uploading: false,
              fail: true,
              finish: true
            })
          }
          //ID存储
          var value = wx.getStorageSync("attIds");
          if (value != "") {
            let _keys = value + "," + _data.responseObject.responsePk;
            wx.setStorageSync("attIds", _keys);
          } else {
            wx.setStorageSync("attIds", _data.responseObject.responsePk);
          }
        },
        fail: function (err) {
          //微信接口调用失败
          //   _this.imgUrl[0].uploading = false;
          //   _this.imgUrl[0].fail = true;     //上传失败标识
          //   _this.imgUrl[0].finish = true;
          param.uploadDoneFn({
            imgId: '',
            uploading: false,
            fail: true,
            finish: true
          })
        },
        complete: function () {
          //微信接口调用结束
          //    _this.setScene("0");
        }
      });
      //上传进度
      // uploadTask.onProgressUpdate(res => {
      //     // console.log("上传进度", res.progress);
      //     // console.log("已经上传的数据长度", res.totalBytesSent);
      //     // console.log("预期需要上传的数据总长度", res.totalBytesExpectedToSend);
      // });
    }
  }
  new reloadFiles(param)
}
