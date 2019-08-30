import comm from 'static/js/comm.js';
import TempCache from 'static/js/tempcache.js';
import commPopup from 'static/js/commPopup.js';
class AlLiveSdk {
     constructor(){
         let _this = this;
         _this.regionEmotion = "//img50.allinmd.cn/v3/conference/ccEmotion/";
         _this.initThirdPartySdk = _this.initThirdPartySdk.bind(_this);
         _this.addLiveSdk = _this.addLiveSdk.bind(_this);
         _this.startLive = _this.startLive.bind(_this);
         _this.analysisMsg = _this.analysisMsg.bind(_this);
         _this.checkSpeakers = _this.checkSpeakers.bind(_this);
         _this.checkSpeakerName = _this.checkSpeakerName.bind(_this);
         _this.getUserId = _this.getUserId.bind(_this);
         _this.onLineHandle = _this.onLineHandle.bind(_this);
     }
    addLiveSdk(linkUrl){
         let liveScriptElement = document.createElement("script");//创建新的script节点
         liveScriptElement.setAttribute("type", "text/javascript");
         liveScriptElement.setAttribute("src", linkUrl);
         document.body.appendChild(liveScriptElement);//添加到body节点的末尾
     }
    analysisMsg(msg){
        let _this = this;
        let str = '';
        let lastResult = '';
        // console.log(msg,t.data);

        if ((msg.indexOf("[") > -1) && (msg.indexOf("]") > -1)) {
            str = msg.replace(/\[/g, '[]').replace(/\[\]/g, '&').replace(/\]/g, '[]').replace(/\[\]/g, '&');
            let dataList = str.split('&');
            for (let num = 0; num < dataList.length; num++) {
                let item = dataList[num];
                if (item.length) {
                    if ((item.indexOf("em") > -1) || (item.indexOf("em2") > -1) ) {
                        let imgNum = item.split("_")[1];
                        imgNum = (parseInt(imgNum,10)<10)?'0'+parseInt(imgNum,10):imgNum;
                        if((item.indexOf("em2") > -1) ){
                            lastResult += '<img src="' + _this.regionEmotion+imgNum+".png" + '"/>';

                        }else{
                            lastResult += '<img src="' + _this.regionEmotion+imgNum+".gif" + '"/>';
                        }

                    } else {
                        lastResult += item;
                    }
                }
            }
        } else {
            lastResult = msg;
        }
        return lastResult;
    }
    initThirdPartySdk(config){
         let _this = this;
         _this.addLiveSdk(config.liveScriptSrc);
    }
    getUserId(userId){
        let timestamp = Date.parse(new Date());

        if(comm.checkInvalid(userId)){
            userId = 'Y'+timestamp;
        }
        return userId;
    }
    startLive(config){
         let _this = this;
         let checkDocument = (opt)=>{
             let documentMode = opt&&opt.template&&((parseInt(opt.template.type,10)===4)||(parseInt(opt.template.type,10)===5));
             if(documentMode){
                 //含有文档模式
                 console.log(config.successCallBack);
                 config.successCallBack&&config.successCallBack(1);
             }else{
                 //不含文档模式
                 config.successCallBack&&config.successCallBack(0);
             }
         };
         let sdkTimer = setInterval(()=>{
             switch (parseInt(config.liveType)) {
                 case 0:
                     if(DWLive){
                         DWLive.init(config);
                         DWLive.onLoginSuccess = function(opt){
                             console.log('直播登陆成功');

                             checkDocument(opt);
                         };
                         clearInterval(sdkTimer);
                     }
                     break;
                 case 1:
                     if($.DW){
                         let backConfig = {
                             userId: config.userid,
                             roomId: config.roomid,
                             liveId: config.liveId,
                             viewername: config.viewername,
                             viewertoken: config.token,
                             recordId: config.recordId
                         };
                         $.DW.config(backConfig);
                         window.on_cc_login_success = function(opt){
                             console.log('回播登陆成功');
                             checkDocument(opt);
                         };
                         clearInterval(sdkTimer);
                     }
                     break;
             }

         },200);
    }

    sendMsg(msg){
        if(!comm.checkInvalid(msg)){
            //公聊
            //alert(TempCache.getItem("trueName")+"这是缓存取得");
            let username = TempCache.getItem("trueName");
            if(comm.checkInvalid(username)){
                username = '游客';
            }
            let lastMsg  = username+":"+msg;
            if(msg.length>260){
                commPopup.popup('聊天不能超过260个字符！');
                return false;
            }else{
                console.log(lastMsg);
                DWLive.sendPublicChatMsg(lastMsg);
            }

            //$(".qa_list_content").animate({scrollTop: '1000000px'}, 400);
            //$(".chat-msg-list1").animate({scrollTop: '1000000px'}, 400);
        }
    }
    receiveMsg(config){
         if(DWLive){
             DWLive.onPublicChatMessage = function (msg) {
                 //三端可以相互接收消息，web端目前可以是表情和文本，app是文本，
                 let  talkUserId =TempCache.getItem("userId");
                 let resourceMsg = JSON.parse(msg);
                 if(resourceMsg.userrole==='publisher'){
                     resourceMsg.msgType = 2;//主讲发布的消息
                 }else if(resourceMsg.userrole==='teacher'){
                     resourceMsg.msgType = 5;//助教发布的消息
                 }else{
                     if(resourceMsg.userid==talkUserId){
                         resourceMsg.msgType = 0;//我说的
                     }else{
                         resourceMsg.msgType = 1;//别人说的
                     }
                 }
                 config.callBack&&config.callBack(resourceMsg);
             };
             DWLive.onPrivateAnswer = function (msg) {
                 let resourceMsg = JSON.parse(msg);
                 resourceMsg.msgType = 4;
                 config.callBack&&config.callBack(resourceMsg);
             };
             DWLive.onPrivateChatMessage = function (msg) {
                 let resourceMsg = JSON.parse(msg);
                 resourceMsg.msgType = 3;
                 config.callBack&&config.callBack(resourceMsg);
             };

         }

    }
    onLineHandle(config){
         if(DWLive){
             DWLive.onKickOut = function(){
                 config.onKickOut&&config.onKickOut();
             };
             DWLive.onLiveEnd = function(){
                 config.onLiveEnd&&config.onLiveEnd();
             };
         }
    }
    checkSpeakerName(name){
        return comm.checkInvalid(name)?'游客':name;
    }
    checkSpeakers(msg){
         let _this = this;
        let itemClassName = '';
        let talkerName = '';
        let to = '';
        let allMsg = msg.msg.split(":");
        let teacherName = '';
        let localUserName = TempCache.getItem("trueName");
        let username = _this.checkSpeakerName(localUserName);
        switch (msg.msgType){
            case 0://我说的
                itemClassName = 'al-single-me';
                talkerName = username+'(我)';
                break;
            case 1://别人说的
                itemClassName = 'al-single-other';
                talkerName = _this.checkSpeakerName(allMsg[0]);
                break;
            case 2://讲师说的
                itemClassName = 'al-single-teacher';
                talkerName = _this.checkSpeakerName(msg.username)+'(主讲)';
                break;
            case 5://讲师说的
                itemClassName = 'al-single-teacher';
                talkerName = _this.checkSpeakerName(msg.username)+'(嘉宾)';
                break;
            case 3://我对讲师说的
                to = '对';
                itemClassName = 'al-single-talk';
                talkerName = username+'(我)';
                teacherName = _this.checkSpeakerName(msg.tousername)+'(主讲)';
                break;
            case 4://讲师对我说的
                to = '对';
                itemClassName = 'al-single-talk';
                teacherName = username+'(我)';
                talkerName = _this.checkSpeakerName(msg.fromusername)+'(主讲)';
                break;
        }
        return {
            msgClassName:itemClassName,
            speakers:talkerName+to+teacherName+'&nbsp;说：'
        };
    }
}
export default  new AlLiveSdk();