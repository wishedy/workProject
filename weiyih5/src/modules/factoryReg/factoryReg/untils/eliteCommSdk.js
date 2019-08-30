import comm from 'static/js/comm.js';
import app from 'static/js/comm.app.js';
import TempCache from "static/js/tempcache.js"
class Elite{
    constructor(){
        let _this=this;
        _this.mockUrl='';//关注按钮
        _this.endStr = '/';
        _this.memberList = `${_this.mockUrl}/mcall/organization/getV2MemberPager${_this.endStr}`;
        _this.introduction = `${_this.mockUrl}/mcall/organization/getIntroductionPager${_this.endStr}`;
        _this.report = `${_this.mockUrl}/mcall/eliteOrg/getDocList${_this.endStr}`;
        _this.liveList = `${_this.mockUrl}/mcall/eliteOrg/getIndexLiveList${_this.endStr}`;
        _this.indexLiveList = `${_this.mockUrl}/mcall/eliteOrg/getLiveList${_this.endStr}`;
        _this.recommend = `${_this.mockUrl}/mcall/eliteOrg/getRandomMember${_this.endStr}`;
        _this.indexReport = `${_this.mockUrl}/mcall/eliteOrg/getIndexDocList${_this.endStr}`;
        _this.indexConferenceList = `${_this.mockUrl}/mcall/eliteOrg/getIndexConList${_this.endStr}`;
        _this.conferenceList = `${_this.mockUrl}/mcall/eliteOrg/getConList${_this.endStr}`;
        _this.dynamic = `${_this.mockUrl}/mcall/eliteOrg/getNewsList${_this.endStr}`;
        _this.bannerList = `${_this.mockUrl}/mcall/eliteOrg/getTitleBar${_this.endStr}`;
        _this.followed = `${_this.mockUrl}/mcall/customer/follow/people/create${_this.endStr}`;
        _this.openPersonal = _this.openPersonal.bind(_this);
        _this.checkApp = _this.checkApp.bind(_this);
        _this.checkUserId = _this.checkUserId.bind(_this);
        _this.openLiveTerminal = _this.openLiveTerminal.bind(_this);
        _this.openMeeting = _this.openMeeting.bind(_this);
        _this.openUrl = _this.openUrl.bind(_this);
        _this.jumpMemberList = _this.jumpMemberList.bind(_this);
        _this.openLiveTerminal = _this.openLiveTerminal.bind(_this);
        _this.openNews = _this.openNews.bind(_this);
        _this.setTitle = _this.setTitle.bind(_this);
        _this.openBanner = _this.openBanner.bind(_this);
        _this.trackAction = _this.trackAction.bind(_this);
        _this.wakeup = _this.wakeup.bind(_this);
        _this.checkApp();
        _this.checkUserId();
    }
    trackAction(config){
        let browseType = 389;
        let routerName = location.href.split("#/")[1];
        switch (routerName) {
            case 'home':
                browseType = 389;
                break;
            case 'conference':
                browseType = 392;
                break;
            case 'group':
                browseType = 390;
                break;
            case 'member':
                browseType = 364;
                break;
            case 'organization':
                browseType = 391;
                break;
            case 'academic':
                browseType = 393;
                break;
            case 'face':
                browseType = 394;
                break;
        }
        if(!isNaN(config.index)){
            comm.creatEvent({
                triggerType:config.browseName,
                triggerName:config.actionName,
                keyword:config.keyWord,
                actionId:config.actionId,
                locationId:config.index,
                refId:config.refId,
                browType:browseType
            });
        }else{
            console.log('发送数据');
            comm.creatEvent({
                triggerType:config.browseName,
                triggerName:config.actionName,
                keyword:config.keyWord,
                actionId:config.actionId,
                refId:config.refId,
                browType:browseType
            });
        }

    }
    openUrl(url){
        if(!comm.checkInvalid(url)){
            if(g_sps){
                g_sps.jump(null,url);
            }else{
                window.location.href=url;
            }
        }
    }
    openLiveTerminal(config){//打开直播终端页
        let _this = this;
        if(_this.appPort){
            appjs&&appjs.gotoEliteClubBroadcastVC(
                $.toJSON({
                    columnId:'1553136536872',
                    broadcastStartTime:config.liveStartTime,
                    authority:config.authority,
                    liveId:config.liveId,
                    boradcastUserId:config.boradcastUserId,
                    boradcastRoomNum:config.boradcastRoomNum,
                    boradcastAuthcode:config.boradcastAuthcode,
                    boradcastLiveId:config.boradcastLiveId,
                    boradcastRecoderId:config.boradcastRecoderId,
                    broadcastNameString:config.broadcastNameString,
                    broadcastType:config.liveState
                })
            );
        }else{
            let liveJson={
                id:config.id,
                userId:config.userId,
                playBack:config.playBackId,
                authcode:config.authcode,
                conSubId:config.id,
                startTime:config.startTime,
                conSubRoom:config.conSubRoom,
                liveId:config.liveId,
                authority:config.authority,
                liveState:config.liveState,
                title:config.title
            };
            let createUrl = (data)=>{
                let liveUrl = '';
                switch (parseInt(liveJson.liveState)) {
                    case 1://预告
                        comm.alertBox({
                            title: "直播将于" + data.startTime + "开始",
                            ensure: "知道了",
                            ensureCallback:function(){
                                $('.al-alertModalMask').remove();
                            }
                        });
                        break;
                    case 2://直播中
                        liveUrl = '/pages/conference/conference_live.html?conSubId=' + data.conSubId +'&userId='+data.userId+'&roomId=' + data.conSubRoom + '&back=0&recordId='+data.playBack+'&liveId='+data.liveId+'&authority='+data.authority+'&title='+data.title;
                        break;
                    case 3://直播结束
                        comm.alertBox({
                            title: "直播已结束",
                            ensure: "知道了",
                            ensureCallback:function(){
                                $('.al-alertModalMask').remove();
                            }
                        });
                        break;
                    case 4://回播
                        liveUrl = '/pages/conference/conference_live.html?conSubId=' + data.conSubId + '&userId='+data.userId+'&roomId=' + data.conSubRoom + '&back=1&recordId='+data.playBack+'&liveId='+data.liveId+'&authority='+data.authority+'&title='+data.title;
                        break;
                }
                return liveUrl;
            };
            console.log(createUrl(liveJson));
            _this.openUrl(createUrl(liveJson));
        }
    }
    setTitle(config){
        let _this = this;
        if(_this.appPort){
            appjs&&appjs.updateTitle(config.title);
        }
        document.title = config.seoTitle
    }
    openDoc(config){//打开文库终端页
        let _this = this;
        if(_this.appPort){
            appjs.gotoTerminalDetailVC($.toJSON({
                "resourceId": config.detailInfo.docId,
                "resourceType": '2',
                "tplPath": 'm.allinmd.cn'
            }))
        }else{
            _this.openUrl(config.linkUrl);
        }
    }
    openBanner(config){
        let _this = this;
        switch (parseInt(config.resourceType,10)) {
            case 1://单篇内容-视频
            case 2://单篇内容-文库
            case 7://单篇内容-病例
            case 16://专题
            case 17://活动
                _this.openUrl(config.h5Url);
                break;
            case 3://骨科会议
                _this.openMeeting(config);//resourceId
                break;
            case 11://菁英汇直播//id=>resourceId
                let liveJson = {
                    id:config.id,
                    playBackId:config.boradcastRecoderId,
                    authcode:config.boradcastAuthcode ,
                    conSubRoom:config.boradcastRoomNum,
                    liveId:config.liveId,
                    authority:config.authority,
                    userId:config.boradcastUserId,
                    liveState:config.liveState,
                    startTime:config.formatStartTime
                };
                _this.openLiveTerminal(liveJson);
                break;
            case 12://锦囊
                _this.openUrl(`//m.allinmd.cn/dist/commShare.html?brochureId=${config.resourceId}`);
                break;
            case 13://个人主页//cid=>resourceId
                _this.openPersonal({
                    cid:config.resourceId
                });
                break;
            case 14://课程resourceId
                _this.openUrl(`//m.allinmd.cn/dist/surgicalLecture.html#/courseProduce?courseId=${config.resourceId}&columnId=${config.columnId}&customerId=${_this.cid}`);
                break;
            case 15://栏目resourceId
                switch (parseInt(config.columnType,10)) {
                    case 1:
                        _this.openUrl(`//m.allinmd.cn/dist/surgicalLecture.html#/surgicalLecture?columnId=${config.columnId}`);
                        break;
                    case 2:
                        _this.openUrl(`https://m.allinmd.cn/dist/surgicalLecture.html#/surgicalPractice?columnId=${config.columnId}`);
                        break;
                    case 3:
                        break
                }
                break;
            case 18://链接跳转',
                _this.openUrl(config.linkUrl);
                break;
            default:
                break;
        }


    }
    openNews(config){
        let _this = this;
        _this.openUrl(config.linkUrl);
    }
    openPersonal(config){//打开个人中心
        let _this = this;
        if(parseInt(config.cid,10)>100){
            if(_this.appPort){
                appjs&&appjs.gotoPersonalCenter($.toJSON({
                    customerId:config.cid
                }));
            }else{
                if(parseInt(config.cid,10)===parseInt(_this.cid,10)){
                    _this.openUrl('/dist/personal/personal_index.html');
                }else{
                    _this.openUrl('//m.allinmd.cn/dist/personal/others_index.html?cid='+config.cid);
                    //g_sps.jump(null,);
                }
            }
        }
    }
    wakeup(config){//唤醒app
        let t=this;
        if(t.appPort){
            return false
        }else{
            console.log(config.type);
            let androidParam = `{scene:3,type:${config.type},organizationId:14}`;
            let iosParam = `scene=terminalPage&index=${config.type}&organizationId=14`;
            $(".al-appWakeUpFigure").remove();
            let callAppOptions = {
                ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                android: "allin://com.allin.social:75235?data="+androidParam,
                ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                runAtOnce: false
            };
            app.appWakeUp("figure",callAppOptions);//下载app层
            if(comm.getpara().isOldAPP){
                $(".al-appWakeUpFigure").remove();
            }else {
                $(".al-appWakeUpImg figcaption").hide().find("h2").text('加入中国骨科菁英会').next().text('获取更多精彩内容').parent().show();
            }

        }
    }
    openMeeting(config){//打开会议终端页
        let _this = this;
        if(_this.appPort){
            appjs&&appjs.gotoConferenceDetailInfoVC($.toJSON({
                meetId:config.conId,
                meetName:config.conName
            }));
        }else{
            _this.openUrl(`//m.allinmd.cn/dist/conference/meeting_detail.html?conId=${config.conId}`);
        }
    }
    jumpMemberList(config){
        let _this = this;
        if(_this.appPort){
            appjs&&appjs.goOrganizationMember($.toJSON({
                organizationId:14
            }));
        }else{
            config.callBack&&config.callBack();
        }
    }
    checkUserId(){
        let _this = this;
        let userId = TempCache.getItem('userId');
        if(comm.checkInvalid(userId)){
            _this.userId = 0;
        }else{
            _this.userId = userId;
        }
    }
    checkApp(){
        let _this = this;
        if(!(typeof appjs == "undefined" || appjs == null || appjs == "")){
            _this.appPort = true;
        }else{
            _this.appPort = false;
        }
    }
}
export default new Elite();