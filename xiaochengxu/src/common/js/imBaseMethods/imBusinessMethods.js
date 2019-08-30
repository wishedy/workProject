/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/13.
 */


import ImBaseMethods from "./imBaseMethods";
import FileReaderBaseMethods from "common/js/util/fileReader";

import {readonly, autobind} from "core-decorators";

export default class ImBusinessMethods extends ImBaseMethods {
  constructor(nim) {
    super(nim);
    this.nim = nim;
  }


  /**
   * 发送单张图片消息
   *
   *
   *    param {
   *        file: _file,     文件对象
   *       to: this.targetData.account,   接收方ID
   *       custom: JSON.stringify({             自定义消息体
   *         cType: "1",
   *         cId: this.doctorCustomerId,
   *         mType: "1",
   *         conId: this.orderSourceId
   *       }),
   *       isPushable: true,                    是否推送
   *       needPushNick: false,             推送是否带用户名
   *       pushContent: `患者<${this.userData.nick ? this.userData.nick : ""}>向您发送了一张图片，点击查看详情`,        推送内容
   *       pushPayload: JSON.stringify({      推送载荷
   *         account: "0_" + this.caseId,
   *         type: "1"
   *       }),
   *       progressCallback:(obj){} 上传过程回调
   *       sendSuccessCallback(msg){}  发送完成回调
   * }
   * @return {null}
   */
  @readonly
  sendImageMessage(param) {
    this.previewFile({
      type: "image",
      file: param.file.path
    }).then(data => {
      return this.sendFileMessage({
        to: param.to,
        file: data,
        type: "image",
        custom: param.custom,
        isPushable: param.isPushable || true,
        isUnreadable: param.isUnreadable || true,
        needPushNick: param.needPushNick || false,
        pushContent: param.pushContent || "",
        pushPayload: param.pushPayload || "",
      })
    }).then(msg => {
      param.sendSuccessCallback && param.sendSuccessCallback(msg);
    });
  }

  /**
   * 发送单个视频消息
   *    param {
   *        file: _file,     文件对象
   *       to: this.targetData.account,   接收方ID
   *       custom: JSON.stringify({             自定义消息体
   *         cType: "1",
   *         cId: this.doctorCustomerId,
   *         mType: "1",
   *         conId: this.orderSourceId
   *       }),
   *       isPushable: true,                    是否推送
   *       needPushNick: false,             推送是否带用户名
   *       pushContent: `患者<${this.userData.nick ? this.userData.nick : ""}>向您发送了一张图片，点击查看详情`,        推送内容
   *       pushPayload: JSON.stringify({      推送载荷
   *         account: "0_" + this.caseId,
   *         type: "1"
   *       }),
   *       progressCallback:(obj){} 上传过程回调
   *       sendSuccessCallback(msg){}  发送完成回调
   * }
   * @return {null}
   */
  @readonly
  sendVideoMessage(param) {

    this.previewFile({
      type: "video",
      file: param.file
    }).then(file => {
      console.log(file)
      return this.sendFileMessage({
        to: param.to,
        file: file,
        type: "video",
        custom: param.custom,
        isPushable: param.isPushable || true,
        isUnreadable: param.isUnreadable || true,
        needPushNick: param.needPushNick || false,
        pushContent: param.pushContent || "",
        pushPayload: param.pushPayload || "",
      })
    }).then(msg => {
      param.sendSuccessCallback && param.sendSuccessCallback(msg);
    });
  }

  /**
   * 发送单个视频消息
   *
   *
   *    param {
   *        file: _file,     文件对象
   *       to: this.targetData.account,   接收方ID
   *       custom: JSON.stringify({             自定义消息体
   *         cType: "1",
   *         cId: this.doctorCustomerId,
   *         mType: "1",
   *         conId: this.orderSourceId
   *       }),
   *       isPushable: true,                    是否推送
   *       needPushNick: false,             推送是否带用户名
   *       pushContent: `患者<${this.userData.nick ? this.userData.nick : ""}>向您发送了一张图片，点击查看详情`,        推送内容
   *       pushPayload: JSON.stringify({      推送载荷
   *         account: "0_" + this.caseId,
   *         type: "1"
   *       }),
   *       progressCallback:(obj){} 上传过程回调
   *       sendSuccessCallback(msg){}  发送完成回调
   * }
   * @return {null}
   */
  @readonly
  sendPdfMessage(param) {
    let fileReader = new FileReaderBaseMethods();

    fileReader.getBase64Url(param.file).then(base64 => {
      fileReader = null;
      return this.previewFile({
        type: "file",
        dataURL: base64,
        progressCallback: obj => {
          param.progressCallback && param.progressCallback(obj);
        }
      })
    }).then(file => {
      file = Object.assign(file, {
        fileName: param.file.name,
      });
      file.name = param.file.name;
      file.ext = "pdf";
      return this.sendFileMessage({
        to: param.to,
        file: file,
        type: "file",
        custom: param.custom,
        isPushable: param.isPushable || true,
        isUnreadable: param.isUnreadable || true,
        needPushNick: param.needPushNick || false,
        pushContent: param.pushContent || "",
        pushPayload: param.pushPayload || "",
      })
    }).then(msg => {
      param.sendSuccessCallback && param.sendSuccessCallback(msg);
    });
  }

  /**
   * 发送图集消息
   *
   *
   *    param {
   *        list: _file,     文件对象数组，为input选中的多个图片对象
   *       to: this.targetData.account,   接收方ID
   *       custom: JSON.stringify({             自定义消息体
   *         cType: "1",
   *         cId: this.doctorCustomerId,
   *         mType: "38",
   *         conId: this.orderSourceId
   *       }),
   *       isPushable: true,                    是否推送
   *       needPushNick: false,             推送是否带用户名
   *       pushContent: `患者<${this.userData.nick ? this.userData.nick : ""}>向您发送了一张图片，点击查看详情`,        推送内容
   *       pushPayload: JSON.stringify({      推送载荷
   *         account: "0_" + this.caseId,
   *         type: "1"
   *       }),
   *       progressCallback:(obj){} 上传过程回调
   *       sendSuccessCallback(msg){}  发送完成回调
   * }
   * @return {null}
   */

  @autobind
  sendMulitpleImage(param) {
    let promises = [];
    Array.from(param.list).forEach((element, index) => {
      promises.push(
        this.previewFile({
          type: "image",
          file: element.path
        })
      );
    });

    Promise.all(promises).then(result => {

      return this.sendCustomMessage({
        to: param.to,
        custom: param.custom,
        isPushable: param.isPushable || true,
        isUnreadable: param.isUnreadable || true,
        needPushNick: param.needPushNick || false,
        pushContent: param.pushContent || "",
        pushPayload: param.pushPayload || "",
        content: JSON.stringify({
          type: "multipleImage",
          data: {
            list: result
          }
        })
      })
    }).then(msg => {
      param.sendSuccessCallback && param.sendSuccessCallback(msg);
    });
  }

/**
 * 撤回消息
 *
 *
 imBaseMethods.deleteMessageSendTip({
  msg,  需撤回的消息
  to: this.targetData.account,
  custom: JSON.stringify({
  cType: "0",
  cId: this.cId,
  mType: "37",
  conId: this.orderSourceId,
  patientName: this.patientName,
  idClient: msg.idClient
}),
content: JSON.stringify({
  type: "deleteMsgTips",
  data: {
    from: this.patientName || "患者",
    deleteMsg: msg || {}
  }
}),
  deleteFailCallback: err => {
      this.toastControl(`您只能撤回${_DeleteTimeLimit}内的消息`)
},
  deleteSuccessCallback: msg => {
      this.checkMsg(msg);
      this.sendMessageSuccess(msg);
      console.log(`撤回消息提示--发送成功`);
    }
})
   * }
 * @return {null}
 */
  @autobind
  deleteMessageSendTip(param) {
    this.deleteMessage({
      msg: param.msg
    }).then(() => {
      this.sendCustomMessage({
        to: param.to,
        isUnreadable:false,
        custom: param.custom,
        content: param.content
      }).then(msg => {
        if (msg) {
          param.deleteSuccessCallback && param.deleteSuccessCallback(msg);
        }
      })
    }).catch(err => {
      if (parseInt(err.code) === 508) {
        param.deleteFailCallback && param.deleteFailCallback(err);
      }
    })
  }
}
