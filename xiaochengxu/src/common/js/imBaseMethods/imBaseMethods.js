/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/2/27.
 */

export default class ImBaseMethods {
  constructor(nim) {
    this.nim = nim || {};
  }

  getMessageList(param) {
    return new Promise((resolve, reject) => {
      this.nim.getHistoryMsgs({
        scene: "p2p",
        beginTime: param.beginTime || 0,
        endTime: param.endTime || 0,
        to: param.target,
        limit: param.limit,
        reverse: param.reverse || false,
        done(error, obj) {
          if (!error) {
            resolve(obj)
          } else {
            reject(error);
          }
        }
      })
    });
  }

  sendMessage(param) {
    return new Promise((resolve, reject) => {
      this.nim.sendText({
        scene: "p2p",
        to: param.target,
        text: param.sendContent,
        custom: param.custom,
        isPushable: param.isPushable || true,
        isUnreadable: param.isUnreadable || true,
        needPushNick: param.needPushNick || false,
        pushContent: param.pushContent || "",
        pushPayload: param.pushPayload || "",
        // yidunEnable: true,
        // antiSpamContent: JSON.stringify({'type':1,"data":param.sendContent}),
        done(error, obj) {
          if (!error) {
            resolve(obj);
          } else {
            reject(error, obj);
          }
        }
      });
    });
  }

  sendCustomMessage(param) {

    return new Promise((resolve, reject) => {
      this.nim.sendCustomMsg({
        scene: "p2p",
        to: param.to,
        custom: param.custom,
        content: param.content,
        isPushable: param.isPushable || false,
        isUnreadable: param.isUnreadable,
        needPushNick: param.needPushNick || false,
        pushContent: param.pushContent || "",
        pushPayload: param.pushPayload || "",
        done(error, msg) {
          console.log(error)
          if (!error) {
            resolve(msg)
          } else {
            reject(error, msg);
          }
        }
      });
    });

  }

  previewFile(param) {
    return new Promise((resolve, reject) => {
      this.nim.previewFile({
        type: param.type,
        wxFilePath: param.file,
        uploadprogress(obj) {
          console.log("文件总大小: " + obj.total + "bytes");
          console.log("已经上传的大小: " + obj.loaded + "bytes");
          console.log("上传进度: " + obj.percentage);
          console.log("上传进度文本: " + obj.percentageText);
          param.progressCallback && param.progressCallback(obj);
        },
        done(error, file) {
          if (!error) {
            console.log("上传文件成功");
            console.log(file);
            resolve(file);
          } else {
            console.log("上传文件失败");
            reject(error, file);
          }
        }
      });
    })
  }

  sendFileMessage(param) {
    return new Promise((resolve, reject) => {
      this.nim.sendFile({
        scene: "p2p",
        to: param.to,
        custom: param.custom,
        file: param.file,
        type: param.type,
        isPushable: param.isPushable || false,
        isUnreadable: param.isUnreadable || false,
        needPushNick: param.needPushNick || false,
        pushContent: param.pushContent || "",
        pushPayload: param.pushPayload || "",
        done(err, msg) {
          if (!err) {
            resolve(msg);
          } else {
            reject(err, msg)
          }
        }
      })
    })
  }

  deleteMessage(param) {
    return new Promise((resolve, reject) => {
      this.nim.deleteMsg({
        msg: param.msg,
        done(error) {
          console.log(error)
          if (!error) {
            resolve();
          } else {
            reject(error);
          }
        }
      })
    });

  }

  transformTimeStamp(time) {
    if (!time) {
      return "";
    }
    let format = num => {
      return num > 9 ? num : "0" + num;
    };
    let normalTime = time => {
      let d = new Date(time);
      let obj = {
        y: d.getFullYear(),
        m: format(d.getMonth() + 1),
        dd: format(d.getDate()),
        h: format(d.getHours()),
        mm: format(d.getMinutes())
      };
      return obj;
    };
    let result = "";
    let now = new Date().getTime(),
      day1 =
        normalTime(time).y +
        "-" +
        normalTime(time).m +
        "-" +
        normalTime(time).dd,
      day2 =
        normalTime(now).y +
        "-" +
        normalTime(now).m +
        "-" +
        normalTime(now).dd;
    if (day1 === day2) {
      result = normalTime(time).h + ":" + normalTime(time).mm;
    } else if (normalTime(time).y === normalTime(now).y) {
      result =
        normalTime(time).m +
        "-" +
        normalTime(time).dd +
        "  " +
        normalTime(time).h +
        ":" +
        normalTime(time).mm;
    } else if (normalTime(time).y !== normalTime(now).y) {
      result =
        normalTime(time).y +
        "-" +
        normalTime(time).m +
        "-" +
        normalTime(time).dd +
        "  " +
        normalTime(time).h +
        ":" +
        normalTime(time).mm;
    }
    return result;
  }
}
