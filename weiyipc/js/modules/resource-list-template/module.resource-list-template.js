/**
 * 功能描述：   资源列表模板
 * 使用方法:    module.resourceListTemplate({tempName : "resource"})({
                   resType:'',//资源类型传数字  1-视频，2-文库，3-会议，4-话题 ,7-病例,
                   isNew:0,//传0或1 最新标识
                   isHost:0,//传0或1 最热标识
                   cancelText:'取消收藏',//是否需要取消类的按钮
                   resId:'',//资源id
                   resName:'',//标题
                   resContent:'',//内容
                   userName:'',//作者
                   reviewNum:'',//观看数
                   resPic:'',//缩略图
                   playNum:'',//视频的时长   有值才传
                   resUrl:''//资源链接
 *             })
 * 注意事件：
 * 引入来源：  作用：所有的资源列表类型都可用
 *
 * Created by LiChunHui on 2016/7/27.
 */
module.resourceListTemplate=function(obj){
    var template = {
        use : function(obj){
            var str = obj.tempName,len = str.indexOf(">");
            if(len > -1) return this[str.substring(0,len)][str.substring(len+1)];
            else return this[str];
        },
        cutAuthName:function(str){
            return comm.getStrByteLen(str,24);
        },
        resource : function(obj){ //常规
            var t = this;
            var kv = $.extend(kv,obj);
            var refIdStr = "";
            var playIcon='';
            var nameNum=46;//标题截取的字符
            var contentNum=96;//内容截取的字符
            resPic=kv.resPic;//缩略图
            switch(kv.resType){
            case 1://视频
                refIdStr = 'videoId="'+ kv.resId +'"';
                playIcon='<i class="al-contentVideoBtn">'+
                '<img src="/images/img10/v3/common/icon/video_btn.png" alt="">'+
                '</i><i class="al-contentVideoTime">'+kv.playNum+'</i>';
                break;
            case 2://文库
                refIdStr = 'docId="'+ kv.resId +'"';
                break;
            case 4://话题
                refIdStr = 'topicId="'+ kv.resId +'"';
                kv.resName=kv.resName?kv.resName:'话题医起聊';
                break;
            case 7://病例
                refIdStr = 'caseId="'+ kv.resId +'" "';
                break;
            }
            function scoreDom(s,scoreNum){
                var score='';
                if(scoreNum<10)return '';
                var num = parseInt(s);
                var flot =(s-num)*100+"%";
                if(num==0){
                    score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li><li></li><li></li><li></li></ul></div>';
                }else if(num==1){
                    score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li><li></li><li></li></ul></div>';
                }else if(num==2){
                    score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li><li></li></ul></div>';
                }else if(num==3){
                    score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li></ul></div>';
                }else if(num==4){
                    score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li></ul></div>';
                }else if(num>=5){
                    score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li></ul></div>';
                }
                return score;
            }
            if(resPic){//有图时
                var clk = '';
                if( kv.resourceIsValid != 1 && comm.browser.msie){
                    clk = 'onclick="return false"';
                }
                if(kv.resType==17){
                    picBox = '<figure class="al-contentImgBox" style="width:92px;">' +
                        '<a  style="width:92px;" target="_blank" href="' + (kv.resourceIsValid == 1 ? kv.resUrl : 'javascript:;') + '"'+clk+'>' +
                        '<img src="' + resPic + '" alt=""  style="width:92px;">' +
                        '</a>' +
                        '</figure>';
                }else {
                    picBox = '<figure class="al-contentImgBox">' +
                        (kv.resType == 4 && kv.topicMask ? '<i class="al-mark al_imgMark"><img src="//img10.allinmd.cn/v3/common/icon/mark_topic.png" alt=""/></i>' : '') +
                        '<a  target="_blank" href="' + (kv.resourceIsValid == 1 ? kv.resUrl : 'javascript:;') + '"'+clk+'>' +
                        '<img src="' + resPic + '" alt=""/>' +
                        playIcon +
                        '</a>' +
                        '</figure>';
                }
            }else{//无图
                picBox="";
                nameNum=70;
                contentNum=86;
            }
            resName=comm.getStrByteLen(kv.resName,nameNum);//标题
            resContent=comm.getStrByteLen(kv.resContent.replace(/<br>/g,""),contentNum);//内容
            userName=kv.userName;//作者
            reviewNum=kv.reviewNum;//观看数

            //是否有效（0-无效;1-有效；2-系统屏蔽；3-用户删除)
            function getTypeDesc(refType){
                var refTypeDesc= ''; //类型描述
                switch(parseInt(refType)){
                    case 1: refTypeDesc="视频"; break;
                    case 2:
                        if(kv.tplPath==286){
                            refTypeDesc="书籍";
                        }else{
                            refTypeDesc="文库";
                        } break;
                    case 4: refTypeDesc="话题"; break;
                    case 7: refTypeDesc="病例"; break;
                    case 8: refTypeDesc="评论"; break;
                    case 16: refTypeDesc="活动"; break;
                    case 17: refTypeDesc='书籍';break;
                    default: refTypeDesc="活动";
                }
                return refTypeDesc;
            }
            var activityTag="";
            if(kv.isShowActivityTag){//活动资源标识
                var color=kv.activityTagColor;
                activityTag='<span class="al-contentActivityTag" style="border-color:'+color+';color:'+color+'">'+kv.activityTagName+'</span>';
                //activityTag='<span class="al-contentActivityTag" style="border-color:red;color:red">万例挑一</span>';
            }
            if(kv.resourceIsValid==1){
            return '<section class="'+(resPic?'al-tableBox':'al-contentInALine')+' ev-resourceList">'+scoreDom(kv.score,kv.scoreNum)+
                (resPic?'<div class="al-tableBoxInnerWrap">':'')+
                '<article class="al-contentText" '+(kv.resType==17?' style="width:538px;"':"")+'>'+
                (!picBox&&kv.resType==4&&kv.topicMask?'<i class="al-mark"><img src="//img10.allinmd.cn/v3/common/icon/mark_topic.png" alt=""/></i>':'')+
                '<a target="_blank" href="'+kv.resUrl+'" class="al-contentTitle"><span>'+symbolToString(resName)+'</span></a>'+
                '<p class="al-contentMainText">'+
                '<span>'+symbolToString(resContent)+'</span>'+
                '</p>'+
                '<p class="al-contentOtherMsg">'+activityTag+
                (kv.isNew&&kv.resType!=17?'<span class="al-contentNewest" style="color: #9bcc4e;border: 1px solid #9bcc4e;">最新</span>':'')+
                (kv.isHost&&kv.resType!=17?'<span class="al-contentHotest" style="color: #9bcc4e;border: 1px solid #9bcc4e;">最热</span>':'')+
                (kv.resType==17?"":
                    (function(){
                    var str='';
                    if(userName){
                        str+='      <span class="al-contentAuthorBox"><i class="al-contentAuthor'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>'+template.cutAuthName(userName)+'</span>';
                    }
                    return str;
                }())
                )+
                '<span><i class="al-contentWatchedNum"></i>'+reviewNum+'</span>'+
                (kv.cancelText?'<span class="ev-wrapSocial"><span class="al-contentDelete ev-collection" vns-social-follow-already>'+kv.cancelText+'</span></span>':'')+
                '</p>'+
                '</article>'+
                picBox+
                (resPic?'</div>':'')+
                '</section>';
            }else if(kv.resourceIsValid==2){
            	return '<section class="'+(resPic?'al-tableBox':'al-contentInALine')+' ev-resourceList">'+
                    (resPic?'<div class="al-tableBoxInnerWrap">':'')+
	                '<article class="al-contentText">'+
	                (!picBox&&kv.resType==4&&kv.topicMask?'<i class="al-mark"><img src="//img10.allinmd.cn/v3/common/icon/mark_topic.png" alt=""/></i>':'')+
	                '<a target="_blank" href="javscript:void(0);" onclick="return false;" class="al-contentTitle"><span>'+symbolToString(resName)+'</span></a>'+
	                '<p class="al-contentMainText">'+
	                '<span style="font-size:16px;color:#aaaaaa;">该'+getTypeDesc(kv.resType)+'已被系统屏蔽</span>'+
	                '</p>'+
	                '<p class="al-contentOtherMsg">'+activityTag+
	                (kv.isNew?'<span class="al-contentNewest" style="color: #9bcc4e;border: 1px solid #9bcc4e;">最新</span>':'')+
	                (kv.isHost?'<span class="al-contentHotest" style="color: #9bcc4e;border: 1px solid #9bcc4e;">最热</span>':'')+
                    (function(){
                        var str='';
                        if(userName){
                            str+='      <span class="al-contentAuthorBox"><i class="al-contentAuthor'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>'+template.cutAuthName(userName)+'</span>';
                        }
                        return str;
                    }())+
	                '<span><i class="al-contentWatchedNum"></i>'+reviewNum+'</span>'+
	                (kv.cancelText?'<span class="ev-wrapSocial"><span class="al-contentDelete ev-collection" vns-social-follow-already>'+kv.cancelText+'</span></span>':'')+
	                '</p>'+
	                '</article>'+
	                picBox+
                    (resPic?'</div>':'')+
                '</section>';
            }else if(kv.resourceIsValid==3){
            	return '<section class="'+(resPic?'al-tableBox':'al-contentInALine')+' ev-resourceList">'+
                 (resPic?'<div class="al-tableBoxInnerWrap">':'')+
                '<article class="al-contentText">'+
                (!picBox&&kv.resType==4&&kv.topicMask?'<i class="al-mark"><img src="//img10.allinmd.cn/v3/common/icon/mark_topic.png" alt=""/></i>':'')+
                '<a target="_blank" href="javascript:void(0);" onclick="return false;" class="al-contentTitle"><span>'+symbolToString(resName)+'</span></a>'+
                '<p class="al-contentMainText">'+
                '<span style="font-size:16px;color:#aaaaaa;">该'+getTypeDesc(kv.resType)+'已被用户删除</span>'+
                '</p>'+
                '<p class="al-contentOtherMsg">'+activityTag+
                (kv.isNew?'<span class="al-contentNewest" style="color: #9bcc4e;border: 1px solid #9bcc4e;">最新</span>':'')+
                (kv.isHost?'<span class="al-contentHotest" style="color: #9bcc4e;border: 1px solid #9bcc4e;">最热</span>':'')+
                    (function(){
                        var str='';
                        if(userName){
                            str+='      <span class="al-contentAuthorBox"><i class="al-contentAuthor'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>'+template.cutAuthName(userName)+'</span>';
                        }
                        return str;
                    }())+
                '<span><i class="al-contentWatchedNum"></i>'+reviewNum+'</span>'+
                (kv.cancelText?'<span class="ev-wrapSocial"><span class="al-contentDelete ev-collection" vns-social-follow-already>'+kv.cancelText+'</span></span>':'')+
                '</p>'+
                '</article>'+
                picBox+
                (resPic?'</div>':'')+
            '</section>';
            	
//            	return '<section class="al-contentInALine ev-resourceList">'+
//                	'<article class="al-contentText">该资源已被用户删除</article>'+
//                '</section>';
            }else{
            	return '<section class="'+(resPic?'al-tableBox':'al-contentInALine')+' ev-resourceList">'+
                (resPic?'<div class="al-tableBoxInnerWrap">':'')+
                '<article class="al-contentText">'+
                (!picBox&&kv.resType==4&&kv.topicMask?'<i class="al-mark"><img src="//img10.allinmd.cn/v3/common/icon/mark_topic.png" alt=""/></i>':'')+
                '<a target="_blank" href="javascript:void(0);" onclick="return false;" class="al-contentTitle"><span>'+symbolToString(resName)+'</span></a>'+
                '<p class="al-contentMainText">'+
                '<span style="font-size:16px;color:#aaaaaa;">该'+getTypeDesc(kv.resType)+'已被系统屏蔽</span>'+
                '</p>'+
                '<p class="al-contentOtherMsg">'+activityTag+
                (kv.isNew?'<span class="al-contentNewest" style="color: #9bcc4e;border: 1px solid #9bcc4e;">最新</span>':'')+
                (kv.isHost?'<span class="al-contentHotest" style="color: #9bcc4e;border: 1px solid #9bcc4e;">最热</span>':'')+
                    (function(){
                        var str='';
                        if(userName){
                            str+='      <span class="al-contentAuthorBox"><i class="al-contentAuthor'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>'+template.cutAuthName(userName)+'</span>';
                        }
                        return str;
                    }())+
                '<span><i class="al-contentWatchedNum"></i>'+reviewNum+'</span>'+
                (kv.cancelText?'<span class="ev-wrapSocial"><span class="al-contentDelete ev-collection" vns-social-follow-already>'+kv.cancelText+'</span></span>':'')+
                '</p>'+
                '</article>'+
                picBox+
                (resPic?'</div>':'')+
            '</section>';
            }
        },
        review:function(obj){
            var t = this;
            var kv = $.extend(kv,obj);
            resCid=kv.resCid;
            resName=comm.getStrByteLen(kv.resName,50);//标题
            resContent=kv.resContent;//回复的内容
            userName=kv.userName;//作者
            resPic=kv.resPic;//缩略图
            resDate=comm.date.diffDay_one(kv.resDate,comm.date.local_time());
            if(kv.state!==1&&kv.state!==2){//未认证
                vipIcon='';
            }else{
                vipIcon='<i class="al-vipUser"></i>';
            }
            return '<section class="al-contentComment">'+
            '<figure class="al-contentCommentUserImg">'+
            '<a href="'+(resCid!=0?'/pages/personal/others_contribution.html?cid='+resCid:'javascript:;')+'" target="_blank">'+
            '<img src="'+kv.logoUrl+'" alt="">'+
            '<i class="al-contentCommentTips"></i>'+
            '</a>'+
            '</figure>'+
            '<section class="al-contentCommentMain">'+
            '<article class="al-contentCommentItem">'+
            '<article class="al-contentCommentItemTitle">'+
            '<a href="'+(resCid!=0?'/pages/personal/others_contribution.html?cid='+resCid:'javascript:;')+'" target="_blank" class="al-contentCommentUserName">'+template.cutAuthName(userName)+vipIcon+'</a>'+
            '<span>评论了</span>'+
            '<p class="al-contentCommentTime">'+resDate+'</p>'+
            '</article>'+
            '</article>'+
            '<p class="al-contentCommentText ev-reviewContent">'+resContent+
            '</p>'+
            '<article class="al-contentMyComment">'+
            '<a href="'+kv.resUrl+'">'+resName+
            '</a>'+
            '</article>'+
            '</section>'+
            '</section>'
        },
        //长条形的用户列表
        userList:function(obj){
            var t = this;
            var kv = $.extend(kv,obj);
            var cid=kv.cid;
            var customerId=kv.customerId;//本人id
            var userName=kv.userName;
            var orgFlag=kv.followOrgFlag;//该条数据是否是组织
            if(kv.state!==2&&kv.state!==7&&kv.state!==8&&kv.state!==9){//未认证
                vipIcon='';
            }else{
                if(orgFlag){
                    vipIcon='';
                }else{
                    vipIcon='<i class="al-vipUser"></i>';
                }
            }
            var medicalTitle=kv.medicalTitle;//职称
            var company=kv.company;//医院
            var contribuNum=kv.contribuNum?kv.contribuNum:0;//贡献值
            var reviewNum=kv.reviewNum?kv.reviewNum:0;//评论数
            var fansNum=kv.fansNum?kv.fansNum:0;//粉丝数
            var relationship=kv.relationship?kv.relationship:0;//关注关系
            var html='<section class="al-doctorRecommend">'+
            '<figure class="al-doctorImg">'+    //"/pages/personal/others_contribution.html?cid=\"'+cid+\"
            '<a class="ev-sRList" href='+(orgFlag?"/pages/channel/organization-home.html?cid="+cid:(cid==customerId?"/pages/personal/personal_contribution.html?cid="+cid:"/pages/personal/others_contribution.html?cid="+cid))+' target="_blank" data-id="'+cid+'" data-type="9"><img src="'+kv.logoUrl+'">'+(kv.tips?'<i class="al-newNumTips"></i>':'')+'</a>'+
            '</figure>'+
            '<article class="al-doctorMsg">'+
            '<figcaption class="al-doctorMsgContent">'+
            '<a class="ev-sRList" href='+(orgFlag?"/pages/channel/organization-home.html?cid="+cid:(cid==customerId?"/pages/personal/personal_contribution.html?cid="+cid:"/pages/personal/others_contribution.html?cid="+cid))+' target="_blank" data-id="'+cid+'" data-type="9" '+(orgFlag?' style="color: #FB875A;"':'')+'>'+template.cutAuthName(userName)+'</a>'+vipIcon+''+
            '<p>'+(medicalTitle?'<span class="al-doctorJob">'+medicalTitle+'</span>':'')+
            '<span class="al-doctorHospital">'+symbolToString(company)+'</span></p>'+
            '<p>'+
            '<span class="'+(orgFlag?'hide':'')+'">贡献值<i>'+contribuNum+'</i></span>'+
            '<b class="al-hrLine" '+(orgFlag?' style="display:none;"':'')+'></b>'+
            '<span class="'+(orgFlag?'hide':'')+'">评论<i>'+reviewNum+'</i></span>'+
            '<b class="al-hrLine" '+(orgFlag?' style="display:none;"':'')+'></b>'+
            '<span>粉丝<i>'+fansNum+'</i></span>'+
            '</p>'+
            '</figcaption>'+
                (cid==customerId?"":'<a href="javascript:;" class="al-followBtn ev-followBtn">')+
            '</a>'+
            '</article>'+
            '</section>';

            var temp;
            if(cid == $("#sesCustomerId").val() || !kv.state || cid === null){
                temp = $(html);
            }else{
                temp = $(html);
                temp.find(".ev-followBtn").follow({fStatus:relationship,classStyle:"gz_but",fId:cid?cid:"",picStyle:4,canToggle:false,
                    fansRelationship:kv.fansRelationship?kv.fansRelationship:""});
            };

            return temp;
        },
        //方形医师列表
        squUserList:function(obj){
            var kv = $.extend(kv,obj);
            var cid=kv.cid;
            var customerId=kv.customerId;//本人id
            var userName=comm.getStrByteLen(kv.userName,18);
            var medicalTitle=kv.medicalTitle?kv.medicalTitle:"&nbsp;";//职称
            var company=kv.company;//医院
            var contribuNum=kv.contribuNum?kv.contribuNum:0;//贡献值
            var reviewNum=kv.reviewNum?kv.reviewNum:0;//评论数
            var fansNum=kv.fansNum?kv.fansNum:0;//粉丝数
            var relationship=kv.relationship?kv.relationship:0;//关注关系
            var html='<section class="al-mesMainR">'+
            '<a href="/pages/personal/others_contribution.html?cid='+cid+'" target="_blank"><img src="'+kv.logoUrl+'" alt="" /></a>'+
            '<p class="al-mesMainR-userName"><a href="/pages/personal/others_contribution.html?cid='+cid+'" target="_blank">'+userName+'</a></p>'+
            '<span class="al-mesMainR-userTitle" style="display:inline-block; height:15px;">'+medicalTitle+'</span>'+
            '<p class="al-mesMainR-userUnit">'+symbolToString(company)+'</p>'+
            '<ul>'+
            '<li>'+
            '<a href="javascript:void(0);">贡献</a>'+
            '<span>'+contribuNum+'</span>'+
            '</li>'+
            '<b class="al-hrLine"></b>'+
            '<li>'+
            '<a href="javascript:void(0);">评论</a>'+
            '<span>'+reviewNum+'</span>'+
            '</li>'+
            '<b class="al-hrLine"></b>'+
            '<li>'+
            '<a href="javascript:void(0);">粉丝</a>'+
            '<span>'+fansNum+'</span>'+
            '</li>'+
            '</ul>'+
            '<a href="javascript:;" class="al-followBtn ev-followBtn"></a>'+
            '</section>';
            var temp;
            if(cid == $("#sesCustomerId").val() || !kv.state || cid === null){
                temp = $(html);
            }else{
                temp = $(html);
                temp.find(".ev-followBtn").follow({fStatus:relationship,classStyle:"gz_but",fId:cid?cid:"",picStyle:7,canToggle:false});
            };

            return temp;
        },
        //标签列表
        tagList:function(kv){
        	return '<article class="al-personalFollowTagItem">'+
	            '<h2 class="al-personalFollowTagTitle"><a target="_blank" href="/pages/discover/discover_tagSubject.html#tId='+kv.tagId+'">'+kv.tagName+'</a></h2>'+
	            '<span class="al-personalFollowTagNums">'+kv.tagRefNum+'个资源<span class="ev-wrapSocial"><b vns-social-follow-already>取消关注</b></span></span>'+
	        '</article>';
        }

    };

    return template.use(obj);
};
