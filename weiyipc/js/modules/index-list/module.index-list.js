/**
 * @name:       refType资源类型，attLength图片数量，默认传1，activity是否有活动【最新，最热，获奖等】
 * @desc:
 * @example:
 * @depend:
 * @date: 2016/7/28
 * @author: sunhaibin
 */
module.indexListTem={
    //发现按类型搜索列表
    cutAuthName:function(str){
        return comm.getStrByteLen(str,30);
    },
    byTypeList:function(kv,refType){//按类型
        var t = this;
        var hasImg=false;
        var activityTag="";
        if(kv.attUrl!=""&&kv.attUrl!==undefined){
            hasImg = true;
        }
        if(kv.isShowActivityTag){//活动资源标识
            var color=kv.activityTagColor;
            activityTag='<span class="al-contentActivityTag" style="border-color:'+color+';color:'+color+'">'+kv.activityTagName+'</span>';
            //activityTag='<span class="al-contentActivityTag" style="border-color:red;color:red">万例挑一</span>';
        }
        var score="";
        if(kv.scoreNum>9){
            var s=kv.score;
            var num = parseInt(s);
            var flot =(s-num)*100+"%";
            if(num==0){
                score='<div class="al-resourceTypeBox"><ul class="al-littleScoreStarBox"><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li><li></li><li></li><li></li></ul></div>';
            }else if(num==1){
                score='<div class="al-resourceTypeBox"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li><li></li><li></li></ul></div>';
            }else if(num==2){
                score='<div class="al-resourceTypeBox"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li><li></li></ul></div>';
            }else if(num==3){
                score='<div class="al-resourceTypeBox"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li></ul></div>';
            }else if(num==4){
                score='<div class="al-resourceTypeBox"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li></ul></div>';
            }else if(num>=5){
                score='<div class="al-resourceTypeBox"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li></ul></div>';
            }
        }
        var toBeOrNot ='<div style="margin-top:20px;">';
        if(hasImg==true&&kv.resDesc==""){//有图没有描述
            toBeOrNot = '<p></p><div>';
        }else if(kv.resDesc!==''&& !$.isEmptyObject(kv.resDesc)){//不管有无图片，有描述
            toBeOrNot =' <p>'+symbolToString(comm.getStrByteLen(kv.resDesc.replace(/<br>/g,""),90))+'</p><div>';//comm.getStrLen(kv.resName,(hasImg==true?44:88))
        }
        if(refType=="4"){//话题
            kv.resName=kv.resName?kv.resName:'话题医起聊';
        }
        var html=  ' <section class="al-disMajorMainBox_body">'+score+
                    '<section class="al-disMajorMainBox_body_innerWrap">'+
                   '     <figure class="al-disMajorMainBox_bodyText '+((kv.attUrl==""||kv.attUrl==undefined)?"noAttImg":"")+'">'+
                   '     <h2><a href="'+kv.resUrl+'" target="_blank">'+symbolToString(kv.resName)+'</a></h2>'+
                        toBeOrNot+activityTag+
            (function(){
                var str='';
                if(kv.resAuthor){
                    str+='      <span><i class="user'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>'+t.cutAuthName(kv.resAuthor)+'</span>';
                }
                return str;
            }())+
                   ' <span><i class="read"></i>'+kv.resWatchCount.toW()+'</span>'+
                   ' <span><i class="comment"></i>'+kv.commentNum.toW()+'</span>'+
                   ' </div>'+
                   ' </figure>'+
            ((kv.attUrl==""||kv.attUrl==undefined)?"":
                       ' <figure class="al-disMajorMainBox_bodyImg">'+
                       '     <a href="'+kv.resUrl+'" target="_blank"><img src="'+kv.attUrl.split('|')[0]+'" alt=""/>'+
                        (refType==1?'<b></b> <span>'+kv.playTime+'</span></a>':"")+
                       ' </figure>')+

                       ' </section></section>';
        return html;
    },
    //首页推荐四种资源列表
    list:function(kv){
        var t = this;
        var _act="";//获奖>参赛>最热>最新>pdf refType  resUrl  resName resDesc isAward isAttend isNew tplPath resAuthor resWatchCount attUrl playTime
        var activityTag="";
        if(kv.isAward==1){
            _act='<span class="al-contentAward">获奖</span>';
        }else if(kv.isAttend==1){
            _act='<span class="al-contentJoin">参赛</span>';
        }else if(kv.isHot==1){
            _act = '<span class="al-contentHotest">最热</span>';
        }else if(kv.isNew==1){
            _act ='<span class="al-contentNewest">最新</span>';
        }else if(kv.tplPath==31||kv.tplPath==32||kv.tplPath==127){
            _act='<span class="al-contentPdf">PDF</span>';
        }
        if(kv.isShowActivityTag){//活动资源标识
            var color=kv.activityTagColor;
            activityTag='<span class="al-contentActivityTag" style="border-color:'+color+';color:'+color+'">'+kv.activityTagName+'</span>';
            //activityTag='<span class="al-contentActivityTag" style="border-color:red;color:red">万例挑一</span>';
        }
        var score="";
        if(kv.scoreNum>9){
            var s=kv.score;
            var num = parseInt(s);
            var flot =(s-num)*100+"%";
            if(num==0){
                score='<ul class="al-littleScoreStarBox"><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li><li></li><li></li><li></li></ul>';
            }else if(num==1){
                score='<ul class="al-littleScoreStarBox"><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li><li></li><li></li></ul>';
            }else if(num==2){
                score='<ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li><li></li></ul>';
            }else if(num==3){
                score='<ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li></ul>';
            }else if(num==4){
                score='<ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li></ul>';
            }else if(num>=5){
                score='<ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li></ul>';
            }
        }

        var type='al-libraryType';var name="病例";
        switch(parseInt(kv.refType)){
            case 1:
                if(kv.videoType==1){
                    type='al-surgeryVideo';name='手术视频';
                }else{
                    type='al-videoType';name='视频';
                }
                break;
            case 2:
                type='al-libraryType';var name="文库";break;
            case 4:
                type='al-topicType';var name="话题";break;
            default:
                type='al-caseType';var name="病例";break;
        }
        var stickIconHtml="";
        if(kv.stickIconFlag){
            stickIconHtml="<i class='stickIcon'></i>";//只有首页才有
        }
        if(parseInt(kv.refType)===1){//视频
            html=   '<section class="al-tableBox ev_flow">'+
                '<div class="al-resourceTypeBox">'+stickIconHtml+score+'<span class="'+type+'"><i></i>'+name+'</span></div>' +
                    '<div class="al-tableBoxInnerWrap">'+
                    '      <article class="al-contentText" style="height:128px;position:relative;">'+
                    '      <a href="'+kv.resUrl+'" class="al-contentTitle" target="_blank">'+comm.getStrByteLen(kv.resName,44)+'</a>'+
                    '  <p class="al-contentMainText">'+
                (kv.resDesc.length>0?comm.getStrByteLen(kv.resDesc.replace(/<br>/g,""),90):'')+
                    '  </p>'+
                    '  <p class="al-contentOtherMsg" style="position:absolute;bottom:0;left:0;width:438px;">'+
                    activityTag+_act+
                          (function(){
                              var str='';
                              if(kv.resAuthor){
                                  str+='      <span><i class="al-contentAuthor'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>'+t.cutAuthName(kv.resAuthor)+'</span>';
                              }
                              return str;
                          }())+
                    '      <span><i class="al-contentWatchedNum"></i>'+kv.resWatchCount.toW()+'</span>'+
                    '       <span class="al-unlikeBtn" itemType="'+kv.refType+'" itemId="'+kv.id+'"></span>'+
                    '  </p>'+
                    '  </article>'+
                    '  <figure class="al-contentImgBox">'+
                    '      <a href="'+kv.resUrl+'"  target="_blank">'+
                    '      <img class="lazyImg" src="/images/img10/default/loading/225_150.jpg" data-original="'+(kv.attUrl[0]==undefined?"/images/img10/default/loading/225_150.jpg":kv.attUrl[0])+'" alt="">'+
                    '      <i class="al-contentVideoBtn">'+
                    '      <img class="ev_vBtn" src="/images/img10/v3/common/icon/video_btn.png" alt="">'+
                    '      </i>'+
                    '      <i class="al-contentVideoTime">'+kv.playTime+'</i>'+
                    '  </a>'+
                    '  </figure>'+
                    '</div>'+
                '  </section>';
        }else{//非视频
            var itemId='';
            switch(parseInt(kv.refType)){
                case 2:
                    itemId='docId';break;
                case 4:
                    itemId='topicId';kv.resName=kv.resName?kv.resName:'话题医起聊';break;
                case 7:
                    itemId='caseId';break;
            }
            if(itemId==='caseId'||itemId==='topicId'){
                switch (parseInt(kv.attLength,10)){
                    case 1:
                        html=   '<section class="al-tableBox ev_flow">'+
                            '<div class="al-resourceTypeBox">'+stickIconHtml+score+'<span class="'+type+'"><i></i>'+name+'</span></div>' +
                            '<div class="al-tableBoxInnerWrap">'+
                            '      <article class="al-contentText" style="height:128px;position:relative;">'+
                            '      <a href="'+kv.resUrl+'" class="al-contentTitle"  target="_blank">'+comm.getStrByteLen(kv.resName,44)+'</a>'+
                            '  <p class="al-contentMainText">'+
                            comm.getStrByteLen(kv.resDesc.replace(/<br>/g,""),90)+
                            '  </p>'+
                            //'  <p class="al-contentOtherMsg" '+(kv.resDesc==""?'style="margin-top:80px;"':'')+'>'+
                            '  <p class="al-contentOtherMsg" style="position:absolute;bottom:0;left:0;width:438px;">'+
                            activityTag+_act+
                            (function(){
                                var str='';
                                if(kv.resAuthor){
                                    str+='      <span><i class="al-contentAuthor'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>'+t.cutAuthName(kv.resAuthor)+'</span>';
                                }
                                return str;
                            }())+
                            '      <span><i class="al-contentWatchedNum"></i>'+kv.resWatchCount.toW()+'</span>'+
                            '       <span class="al-unlikeBtn" itemType="'+kv.refType+'" itemId="'+kv.id+'"></span>'+
                            '  </p>'+
                            '  </article>'+
                            '  <figure class="al-contentImgBox" '+itemId+'="'+kv.id+'">'+
                            '      <a href="'+kv.resUrl+'">'+
                            //'      <img src="'+kv.attUrl[0]+'" alt="">'+
                            '      <img class="lazyImg"  src="/images/img10/default/loading/225_150.jpg" data-original="'+(kv.attUrl[0].split("&").length>0?kv.attUrl[0].split("&")[0]:kv.attUrl[0])+'" alt="">'+
                            ((kv.attUrl[0].split("&").length>0&&kv.attUrl[0].split("&")[1])?('<i class="al-contentVideoBtn"><img src="/images/img10/v3/common/icon/video_btn.png" alt=""></i><i class="al-contentVideoTime">'+kv.attUrl[0].split("&")[1]+'</i>'):"")+
                            '  </a>'+
                            '  </figure>'+
                            '</div>'+
                            '  </section>';
                            break;
                    case 2:
                        html =' <section class="al-contentInALine ev_flow">'+
                            '<div class="al-resourceTypeBox">'+stickIconHtml+score+'<span class="'+type+'"><i></i>'+name+'</span></div>' +
                                '      <article class="al-contentText">'+
                                '      <a href="'+kv.resUrl+'" class="al-contentTitle"  target="_blank">'+comm.getStrByteLen(kv.resName,50)+'</a>'+
                                '  <p class="al-contentMainText">  '+comm.getStrByteLen(kv.resDesc.replace(/<br>/g,""),80)+'  </p>'+
                                '  <figure class="al-contentImgBox al-contentImgList al-contentImgList-two" '+itemId+'="'+kv.id+'">'+
                                '      <a href="'+((kv.attUrl[0].split("&").length>0&&kv.attUrl[0].split("&")[1])?kv.resUrl:"javascript:void(0)")+'"  class="al-contentImgListItem">'+
                                //'      <img src="'+kv.attUrl[0]+'" alt="">'+
                                '      <img  class="lazyImg" src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl[0]+'" alt="">'+
                            ((kv.attUrl[0].split("&").length>0&&kv.attUrl[0].split("&")[1])?('<i class="al-contentVideoBtn"><img src="/images/img10/v3/common/icon/video_btn.png" alt=""></i><i class="al-contentVideoTime">'+kv.attUrl[0].split("&")[1]+'</i>'):"")+
                                '      </a>'+
                                '      <a href="'+((kv.attUrl[1].split("&").length>0&&kv.attUrl[1].split("&")[1])?kv.resUrl:"javascript:void(0)")+'"  class="al-contentImgListItem">'+
                                //'      <img src="'+kv.attUrl[1]+'" alt="">'+
                            '      <img class="lazyImg"  src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl[1]+'" alt="">'+
                            ((kv.attUrl[1].split("&").length>0&&kv.attUrl[1].split("&")[1])?('<i class="al-contentVideoBtn"><img src="/images/img10/v3/common/icon/video_btn.png" alt=""></i><i class="al-contentVideoTime">'+kv.attUrl[1].split("&")[1]+'</i>'):"")+
                            '      </a>'+
                                '      </figure>'+
                                '      <p class="al-contentOtherMsg">'+
                                activityTag+_act+
                                    (function(){
                                        var str='';
                                        if(kv.resAuthor){
                                            str+='      <span><i class="al-contentAuthor'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>'+t.cutAuthName(kv.resAuthor)+'</span>';
                                        }
                                        return str;
                                    }())+
                                '       <span><i class="al-contentWatchedNum"></i>'+kv.resWatchCount.toW()+'</span>'+
                            '       <span class="al-unlikeBtn" itemType="'+kv.refType+'" itemId="'+kv.id+'"></span>'+
                                '  </p>'+
                                '  </article>'+
                                '  </section>';

                        break;
                    case 0:
                        html= ' <section class="al-contentInALine ev_flow">'+
                            '<div class="al-resourceTypeBox">'+stickIconHtml+score+'<span class="'+type+'"><i></i>'+name+'</span></div>' +
                            '      <article class="al-contentText">'+
                            '      <a href="'+kv.resUrl+'" class="al-contentTitle"  target="_blank">'+comm.getStrByteLen(kv.resName,50)+'</a>'+
                            '       <p class="al-contentMainText">'+comm.getStrByteLen(kv.resDesc.replace(/<br>/g,""),80) +'</p>'+
                            '      <p class="al-contentOtherMsg">'+
                            activityTag+_act+
                            (function(){
                                var str='';
                                if(kv.resAuthor){
                                    str+='      <span><i class="al-contentAuthor'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>'+t.cutAuthName(kv.resAuthor)+'</span>';
                                }
                                return str;
                            }())+
                            '   <span><i class="al-contentWatchedNum"></i>'+kv.resWatchCount.toW()+'</span>'+
                            '       <span class="al-unlikeBtn" itemType="'+kv.refType+'" itemId="'+kv.id+'"></span>'+
                            '      </p>'+
                            '      </article>'+
                            '      </section>';
                        break;
                    case 3://3个图片
                         html=' <section class="al-contentInALine ev_flow">'+
                             '<div class="al-resourceTypeBox">'+stickIconHtml+score+'<span class="'+type+'"><i></i>'+name+'</span></div>' +
                                '       <article class="al-contentText">'+
                                '       <a href="'+kv.resUrl+'" class="al-contentTitle"  target="_blank">'+comm.getStrByteLen(kv.resName,50)+'</a>'+
                                '       <p class="al-contentMainText">'+comm.getStrByteLen(kv.resDesc.replace(/<br>/g,""),80) +'</p>'+
                                '      <figure class="al-contentImgBox al-contentImgList al-contentImgList-three" '+itemId+'="'+kv.id+'">'+
                                '       <a href="'+((kv.attUrl[0].split("&").length>0&&kv.attUrl[0].split("&")[1])?kv.resUrl:"javascript:void(0)")+'"  class="al-contentImgListItem">'+
                                //'       <img src="'+kv.attUrl[0]+'" alt="">'+
                             '      <img class="lazyImg"  src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl[0]+'" alt="">'+
                             ((kv.attUrl[0].split("&").length>0&&kv.attUrl[0].split("&")[1])?('<i class="al-contentVideoBtn"><img src="/images/img10/v3/common/icon/video_btn.png" alt=""></i><i class="al-contentVideoTime">'+kv.attUrl[0].split("&")[1]+'</i>'):"")+
                                '       </a>'+
                                '       <a href="'+((kv.attUrl[1].split("&").length>0&&kv.attUrl[1].split("&")[1])?kv.resUrl:"javascript:void(0)")+'"  class="al-contentImgListItem">'+
                                //'       <img src="'+kv.attUrl[1]+'" alt="">'+
                             '      <img class="lazyImg"  src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl[1]+'" alt="">'+
                             ((kv.attUrl[1].split("&").length>0&&kv.attUrl[1].split("&")[1])?('<i class="al-contentVideoBtn"><img src="/images/img10/v3/common/icon/video_btn.png" alt=""></i><i class="al-contentVideoTime">'+kv.attUrl[1].split("&")[1]+'</i>'):"")+
                             '       </a>'+
                                '       <a href="'+((kv.attUrl[2].split("&").length>0&&kv.attUrl[2].split("&")[1])?kv.resUrl:"javascript:void(0)")+'"  class="al-contentImgListItem">'+
                                //'       <img src="'+kv.attUrl[2]+'" alt="">'+
                             '      <img class="lazyImg"  src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl[2]+'" alt="">'+
                             ((kv.attUrl[2].split("&").length>0&&kv.attUrl[2].split("&")[1])?('<i class="al-contentVideoBtn"><img src="/images/img10/v3/common/icon/video_btn.png" alt=""></i><i class="al-contentVideoTime">'+kv.attUrl[2].split("&")[1]+'</i>'):"")+
                             '   </i>'+
                                '   </a>'+
                                '   </figure>'+
                                '   <p class="al-contentOtherMsg">'+
                                activityTag+_act+
                             (function(){
                                 var str='';
                                 if(kv.resAuthor){
                                     str+='      <span><i class="al-contentAuthor'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>'+t.cutAuthName(kv.resAuthor)+'</span>';
                                 }
                                 return str;
                             }())+
                                '   <span><i class="al-contentWatchedNum"></i>'+kv.resWatchCount.toW()+'</span>'+
                             '       <span class="al-unlikeBtn" itemType="'+kv.refType+'" itemId="'+kv.id+'"></span>'+
                                '   </p>'+
                                '   </article>'+
                                '   </section>';
                        break;
                    default :
                        html= ' <section class="al-contentInALine ev_flow">'+
                            '<div class="al-resourceTypeBox">'+stickIconHtml+score+'<span class="'+type+'"><i></i>'+name+'</span></div>' +
                                '      <article class="al-contentText">'+
                                '      <a href="'+kv.resUrl+'" class="al-contentTitle"  target="_blank">'+comm.getStrByteLen(kv.resName,50)+'</a>'+
                                '      <p class="al-contentMainText">'+comm.getStrByteLen(kv.resDesc.replace(/<br>/g,""),80)+' </p>'+
                                '  <figure class="al-contentImgBox al-contentImgList al-contentImgList-three" '+itemId+'="'+kv.id+'">'+
                                '      <a href="'+((kv.attUrl[0].split("&").length>0&&kv.attUrl[0].split("&")[1])?kv.resUrl:"javascript:void(0)")+'"  class="al-contentImgListItem">'+
                                //'      <img src="'+kv.attUrl[0]+'" alt="">'+
                            '      <img class="lazyImg"  src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl[0]+'" alt="">'+
                            ((kv.attUrl[0].split("&").length>0&&kv.attUrl[0].split("&")[1])?('<i class="al-contentVideoBtn"><img src="/images/img10/v3/common/icon/video_btn.png" alt=""></i><i class="al-contentVideoTime">'+kv.attUrl[0].split("&")[1]+'</i>'):"")+
                                '      </a>'+
                                '      <a href="'+((kv.attUrl[1].split("&").length>0&&kv.attUrl[1].split("&")[1])?kv.resUrl:"javascript:void(0)")+'"  class="al-contentImgListItem">'+
                                //'      <img src="'+kv.attUrl[1]+'" alt="">'+
                            '      <img class="lazyImg"  src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl[1]+'" alt="">'+
                            ((kv.attUrl[1].split("&").length>0&&kv.attUrl[1].split("&")[1])?('<i class="al-contentVideoBtn"><img src="/images/img10/v3/common/icon/video_btn.png" alt=""></i><i class="al-contentVideoTime">'+kv.attUrl[1].split("&")[1]+'</i>'):"")+
                                '      </a>'+
                                '      <a href="'+((kv.attUrl[2].split("&").length>0&&kv.attUrl[2].split("&")[1])?kv.resUrl:"javascript:void(0)")+'"  class="al-contentImgListItem">'+
                                //'      <img src="'+kv.attUrl[2]+'" alt="">'+
                            '      <img class="lazyImg"  src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl[2]+'" alt="">'+
                            ((kv.attUrl[2].split("&").length>0&&kv.attUrl[2].split("&")[1])?('<i class="al-contentVideoBtn"><img src="/images/img10/v3/common/icon/video_btn.png" alt=""></i><i class="al-contentVideoTime">'+kv.attUrl[2].split("&")[1]+'</i>'):"")+
                                '<i class="al-contentImgMaskBg"></i>'+
                            '      <i class="al-contentImgMask">'+
                                '      还有<span>'+(kv.attLength-3)+'</span>张<b></b>'+
                                '  </i>'+
                                '  </a>'+
                                '  </figure>'+
                                '  <p class="al-contentOtherMsg">'+
                                activityTag+_act+
                            (function(){
                                var str='';
                                if(kv.resAuthor){
                                    str+='      <span><i class="al-contentAuthor'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>'+t.cutAuthName(kv.resAuthor)+'</span>';
                                }
                                return str;
                            }())+
                                '  <span><i class="al-contentWatchedNum"></i>'+kv.resWatchCount.toW()+'</span>'+
                            '       <span class="al-unlikeBtn" itemType="'+kv.refType+'" itemId="'+kv.id+'"></span>'+
                                '  </p>'+
                                '  </article>'+
                                '  </section>';

                }
            }else{
                switch(kv.attLength){
                    case 1:
                        html=   '<section class="al-tableBox ev_flow">'+
                            '<div class="al-resourceTypeBox">'+stickIconHtml+score+'<span class="'+type+'"><i></i>'+name+'</span></div>' +
                            '<div class="al-tableBoxInnerWrap">'+
                            '      <article class="al-contentText"  style="height:128px;position:relative;">'+
                            '      <a href="'+kv.resUrl+'" class="al-contentTitle"  target="_blank">'+comm.getStrByteLen(kv.resName,44)+'</a>'+
                            '  <p class="al-contentMainText">'+
                            comm.getStrByteLen(kv.resDesc.replace(/<br>/g,""),90)+
                            '  </p>'+
                            '  <p class="al-contentOtherMsg"  style="position:absolute;bottom:0;left:0;width:438px;">'+
                            activityTag+_act+
                            (function(){
                                var str='';
                                if(kv.resAuthor){
                                    str+='      <span><i class="al-contentAuthor'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>'+comm.getStrByteLen(kv.resAuthor,24)+'</span>';
                                }
                                return str;
                            }())+
                            '      <span><i class="al-contentWatchedNum"></i>'+kv.resWatchCount.toW()+'</span>'+
                            '       <span class="al-unlikeBtn" itemType="'+kv.refType+'" itemId="'+kv.id+'"></span>'+
                            '  </p>'+
                            '  </article>'+
                            '  <figure class="al-contentImgBox" '+itemId+'="'+kv.id+'">'+
                            '      <a href="'+kv.resUrl+'">'+
                            //'      <img src="'+kv.attUrl[0]+'" alt="">'+
                            '      <img class="lazyImg"  src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl[0]+'" alt="">'+
                            (kv.playTime!=0?('<i class="al-contentVideoBtn"><img src="/images/img10/v3/common/icon/video_btn.png" alt=""></i><i class="al-contentVideoTime">'+kv.playTime+'</i>'):"")+
                            '  </a>'+
                            '  </figure>'+
                                '</div>'+
                            '  </section>';
                        break;
                    case 2:
                        html =' <section class="al-contentInALine ev_flow">'+
                            '<div class="al-resourceTypeBox">'+stickIconHtml+score+'<span class="'+type+'"><i></i>'+name+'</span></div>' +
                            '      <article class="al-contentText">'+
                            '      <a href="'+kv.resUrl+'" class="al-contentTitle"  target="_blank">'+comm.getStrByteLen(kv.resName,50)+'</a>'+
                            '  <p class="al-contentMainText">  '+comm.getStrByteLen(kv.resDesc.replace(/<br>/g,""),80)+'  </p>'+
                            '  <figure class="al-contentImgBox al-contentImgList al-contentImgList-two" '+itemId+'="'+kv.id+'">'+
                            '      <a href="javascript:void(0)"  class="al-contentImgListItem">'+
                            //'      <img src="'+kv.attUrl[0]+'" alt="">'+
                            '      <img class="lazyImg"  src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl[0]+'" alt="">'+
                            '      </a>'+
                            '      <a href="javascript:void(0)"  class="al-contentImgListItem">'+
                            //'      <img src="'+kv.attUrl[1]+'" alt="">'+
                            '      <img class="lazyImg"  src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl[1]+'" alt="">'+
                            '      </a>'+
                            '      </figure>'+
                            '      <p class="al-contentOtherMsg">'+
                             activityTag+ _act+
                            (function(){
                                var str='';
                                if(kv.resAuthor){
                                    str+='      <span><i class="al-contentAuthor'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>'+t.cutAuthName(kv.resAuthor)+'</span>';
                                }
                                return str;
                            }())+
                            '       <span><i class="al-contentWatchedNum"></i>'+kv.resWatchCount.toW()+'</span>'+
                            '       <span class="al-unlikeBtn" itemType="'+kv.refType+'" itemId="'+kv.id+'"></span>'+
                            '  </p>'+
                            '  </article>'+
                            '  </section>';

                        break;
                    case 3://3个图片
                        html=' <section class="al-contentInALine ev_flow">'+
                            '<div class="al-resourceTypeBox">'+stickIconHtml+score+'<span class="'+type+'"><i></i>'+name+'</span></div>' +
                            '       <article class="al-contentText">'+
                            '       <a href="'+kv.resUrl+'" class="al-contentTitle"  target="_blank">'+comm.getStrByteLen(kv.resName,50)+'</a>'+
                            '       <p class="al-contentMainText">'+comm.getStrByteLen(kv.resDesc.replace(/<br>/g,""),80) +'</p>'+
                            '      <figure class="al-contentImgBox al-contentImgList al-contentImgList-three" '+itemId+'="'+kv.id+'">'+
                            '       <a href="javascript:void(0)"  class="al-contentImgListItem">'+
                            //'       <img src="'+kv.attUrl[0]+'" alt="">'+
                            '      <img class="lazyImg"  src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl[0]+'" alt="">'+
                            '       </a>'+
                            '       <a href="javascript:void(0)"  class="al-contentImgListItem">'+
                            //'       <img src="'+kv.attUrl[1]+'" alt="">'+
                            '      <img class="lazyImg"  src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl[1]+'" alt="">'+
                            '       </a>'+
                            '       <a href="javascript:void(0)"  class="al-contentImgListItem">'+
                            //'       <img src="'+kv.attUrl[2]+'" alt="">'+
                            '      <img class="lazyImg"  src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl[2]+'" alt="">'+
                            '   </i>'+
                            '   </a>'+
                            '   </figure>'+
                            '   <p class="al-contentOtherMsg">'+
                        activityTag+_act+
                            (function(){
                                var str='';
                                if(kv.resAuthor){
                                    str+='      <span><i class="al-contentAuthor'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>'+t.cutAuthName(kv.resAuthor)+'</span>';
                                }
                                return str;
                            }())+
                            '   <span><i class="al-contentWatchedNum"></i>'+kv.resWatchCount.toW()+'</span>'+
                            '       <span class="al-unlikeBtn" itemType="'+kv.refType+'" itemId="'+kv.id+'"></span>'+
                            '   </p>'+
                            '   </article>'+
                            '   </section>';

                        break;
                    case 0:
                        html= ' <section class="al-contentInALine ev_flow">'+
                            '<div class="al-resourceTypeBox">'+stickIconHtml+score+'<span class="'+type+'"><i></i>'+name+'</span></div>' +
                            '      <article class="al-contentText">'+
                            '      <a href="'+kv.resUrl+'" class="al-contentTitle" target="_blank">'+comm.getStrByteLen(kv.resName,50)+'</a>'+
                            '       <p class="al-contentMainText">'+comm.getStrByteLen(kv.resDesc.replace(/<br>/g,""),80) +'</p>'+
                            '      <p class="al-contentOtherMsg">'+
                        activityTag+_act+
                            (function(){
                                var str='';
                                if(kv.resAuthor){
                                    str+='      <span><i class="al-contentAuthor'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>'+t.cutAuthName(kv.resAuthor)+'</span>';
                                }
                                return str;
                            }())+
                            '   <span><i class="al-contentWatchedNum"></i>'+kv.resWatchCount.toW()+'</span>'+
                            '       <span class="al-unlikeBtn" itemType="'+kv.refType+'" itemId="'+kv.id+'"></span>'+
                            '      </p>'+
                            '      </article>'+
                            '      </section>';
                        break;
                    default :
                        html= ' <section class="al-contentInALine ev_flow">'+
                            '<div class="al-resourceTypeBox">'+stickIconHtml+score+'<span class="'+type+'"><i></i>'+name+'</span></div>' +
                            '      <article class="al-contentText">'+
                            '      <a href="'+kv.resUrl+'" class="al-contentTitle"  target="_blank">'+comm.getStrByteLen(kv.resName,50)+'</a>'+
                            '      <p class="al-contentMainText">'+comm.getStrByteLen(kv.resDesc.replace(/<br>/g,""),80)+' </p>'+
                            '  <figure class="al-contentImgBox al-contentImgList al-contentImgList-three" '+itemId+'="'+kv.id+'">'+
                            '      <a href="javascript:void(0)"  class="al-contentImgListItem">'+
                            //'      <img src="'+kv.attUrl[0]+'" alt="">'+
                            '      <img class="lazyImg"  src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl[0]+'" alt="">'+
                            '      </a>'+
                            '      <a href="javascript:void(0)"  class="al-contentImgListItem">'+
                            //'      <img src="'+kv.attUrl[1]+'" alt="">'+
                            '      <img class="lazyImg"  src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl[1]+'" alt="">'+
                            '      </a>'+
                            '      <a href="javascript:void(0)"  class="al-contentImgListItem">'+
                            //'      <img src="'+kv.attUrl[2]+'" alt="">'+
                            '      <img class="lazyImg"  src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl[2]+'" alt="">'+
                        '<i class="al-contentImgMaskBg"></i>'+
                        '      <i class="al-contentImgMask">'+
                            '      还有<span>'+(kv.attLength-3)+'</span>张<b></b>'+
                            '  </i>'+
                            '  </a>'+
                            '  </figure>'+
                            '  <p class="al-contentOtherMsg">'+
                        activityTag+_act+
                            (function(){
                                var str='';
                                if(kv.resAuthor){
                                    str+='      <span><i class="al-contentAuthor'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>'+t.cutAuthName(kv.resAuthor)+'</span>';
                                }
                                return str;
                            }())+
                            '  <span><i class="al-contentWatchedNum"></i>'+kv.resWatchCount.toW()+'</span>'+
                            '       <span class="al-unlikeBtn" itemType="'+kv.refType+'" itemId="'+kv.id+'"></span>'+
                            '  </p>'+
                            '  </article>'+
                            '  </section>';
                }
            }

        }
        return html;
    },
    //专辑  标签视频列表
    tagVideoList:function(kv){  //resUrl  attUrl playTime resName itemType
         var  html= ' <section class="al-videoAlbumItem ev_operate" itemId="'+kv.itemId+'" itemType="'+kv.itemType+'">'+
                '      <figure class="al-videoAlbumImg">'+
                '      <a href="'+kv.resUrl+'" target="_blank">'+
                '      <img class="lazyImg" src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl.split('|')[0]+'" alt="">'+
             (kv.itemType==1?
                 ('      <i class="al-contentVideoBtn">'+
                '      <img src="/images/img10/v3/common/icon/video_btn.png" alt="">'+
                '      </i>'+
                '      <i class="al-contentVideoTime">'+kv.playTime+'</i>'):"")+
                '  </a>'+
                '  </figure>'+
                '  <figcaption class="al-videoAlbumTitle">'+
                '      <a href="'+kv.resUrl+'" target="_blank">'+comm.getStrLen(kv.resName,46)+'</a>'+
                '      </figcaption>'+
                '      </section>';
        return html;
    },
    //topN列表 attUrl resUrl resName resDesc
    topNList:function(kv){
         var  html= ' <section class="al-videoAlbumRankItem ev_operate" itemId="'+kv.itemId+'" itemType="'+kv.itemType+'">'+
                '      <figure class="al-videoAlbumRankImg">'+
                '      <img class="lazyImg" src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl+'" alt="">'+
                '      </figure>'+
                '      <figcaption class="al-videoAlbumRankMsg">'+
                '      <a href="'+kv.resUrl+'"  target="_blank">'+kv.resName+'</a>'+
                '  <p>'+kv.resDesc.replace(/<br>/g,"")+'</p>'+
                '  </figcaption>'+
                '  </section>';
        return html;
    },
    //推荐医师列表
    docRecommendList:function(data_list,loginCallback,indexOnClose){
        var arr=[];
        var html='';
        var logoUrl,resDoctor,resMedicalTitle,resCompany,id,state,relation,dataStat;
        $.each(data_list,function(i,ele){
            id=ele.customerId;
            logoUrl=ele.logoUrl;
            state =ele.state?ele.state:2;
            resDoctor = ele.customerName;
            resMedicalTitle=ele.medicalTitle;
            resCompany=ele.company;
            relation =ele.relationship;
            html= ' <section class="al-doctorRecommend">'+
                  '      <figure class="al-doctorImg">'+

                  '      <a href="/pages/personal/others_contribution.html?cid='+id+'" target="_blank" class="ev_operate" itemId="'+id+'" userName="'+resDoctor+'"><img src="'+logoUrl+'" alt=""></a>'+
                  '      </figure>'+
                  '      <article class="al-doctorMsg">'+
                  '      <figcaption class="al-doctorMsgContent">'+
                  '      <a href="/pages/personal/others_contribution.html?cid='+id+'" target="_blank" class="ev_operate" itemId="'+id+'" userName="'+resDoctor+'">'+resDoctor+(state>=1?'<i class="al-vipUser"></i>':'')+'</a>'+
                  '  <p>'+(resMedicalTitle!=""?'<span class="al-doctorJob">'+resMedicalTitle+'</span>':"")+
                  '      <span class="al-doctorHospital">'+resCompany+'</span></p>'+
                  '  </figcaption>'+
                  '  <div class="al-followBtn"></div>'+
                  '      </article>'+
                  '      </section>';

            var tep = $(html);
            tep.find('.al-followBtn').follow({fId:id,fStatus:relation,picStyle:4,canToggle:false,indexLogined:loginCallback,indexOnClose:indexOnClose});
            arr.push(tep);
        });
        return arr;
    },
    //某人浏览了
    someoneBrowse:function(kv){
        //userIcon userName resName resAuthor browserNum isAward isAttend isHot isNew tplPath
        var _act="";//获奖>参赛>最热>最新>pdf
        if(kv.isAward===1){
            _act='<span class="al-contentAward">获奖</span>';
        }else if(kv.isAttend===1){
            _act='<span class="al-contentJoin">参赛</span>';
        }else if(kv.isHot===1){
            _act = '<span class="al-contentHotest">最热</span>';
        }else if(kv.isNew==1){
            _act ='<span class="al-contentNewest">最新</span>';
        }else if(kv.tplPath===31||kv.tplPath===32||kv.tplPath===127){
            _act='<span class="al-contentPdf">PDF</span>';
        }
        var html= '<section class="al-tableBox">'+
                  '     <article class="al-contentText">'+
                  '     <p class="al-contentReaded">'+
                  '     <i><img src="'+kv.userIcon+'" alt=""></i>'+
                  '     <strong><a href="/pages/personal/personal_index.html?cid='+kv.customerId+'">'+kv.userName+'</strong>'+
                  '     <span>浏览了</span>'+
                  '     </p>'+
                  '     <p class="al-contentMainText">'+
              '         <a href="'+kv.resUrl+'" target="_blank">+kv.resName+</a>'+
                  ' </p>'+
                  ' <p class="al-contentOtherMsg">'+
                  _act+
            (function(){
                var str='';
                if(kv.resAuthor){
                    str+='      <span><i class="al-contentAuthor'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>'+t.cutAuthName(kv.resAuthor)+'</span>';
                }
                return str;
            }())+
                  ' <span><i class="al-contentWatchedNum"></i>'+kv.browserNum.toW()+'</span>'+
                  ' </p>'+
                  ' </article>'+
                  ' <figure class="al-contentImgBox">'+
                  '     <a href="'+kv.resUrl+'" target="_blank">'+
                  '     <img src="'+kv.attUrl+'" alt="">'+
            (kv.playTime!=0?'<i class="al-contentVideoBtn"><img src="//img10.allinmd.cn/v3/common/icon/video_btn.png" alt=""></i><i class="al-contentVideoTime">'+kv.playTime+'</i>':'')+                  ' </a>'+
                  ' </figure>'+
                  ' </section>';
        return html;
    },
    //会议
    conferenceList:function(kv){
        //resUrl attUrl  startTime endTime conPlace
        var html= ' <section class="al-contentInALine ev_operate" itemId="'+kv.itemId+'" itemType="'+kv.itemType+'" index="'+kv.index+'">'+
                  '      <article class="al-contentText">'+
                  '         <a href="'+kv.resUrl+'" class="al-contentTitle">'+kv.resName+'</a>'+
                  '      <figure class="al-contentImgBox al-contentImgList-one">'+
                  '      <a href="'+kv.resUrl+'" target="_blank">'+
                  '      <img class="lazyImg" src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl+'" alt="">'+
                  '      <i class="al-mark">'+
                  '      <img src="//img10.allinmd.cn/v3/common/icon/mark_meeting.png" alt="">'+
                  '      </i>'+
                  '      </a>'+
                  '      </figure>'+
                  '      <p class="al-contentOtherMsg">'+
                  '      <span><i class="al-contentTime"></i>'+comm.date.dateJoint(kv.startTime,kv.endTime,'/','-')+'</span>'+              //2016-06-07/07-07
                  '  <span><i class="al-contentPlace"></i>'+kv.place+'</span>'+
                  '  </p>'+
                  '  </article>'+
                  '  </section>';
        return html;

    },
    release:function(kv){
        //resUrl attUrl  startTime endTime conPlace
        var html= ' <section class="al-contentInALine ev_operate" itemId="'+kv.itemId+'" itemType="'+kv.itemType+'" index="'+kv.index+'">'+
            '      <article class="al-contentText">'+
            '         <a href="'+kv.resUrl+'" class="al-contentTitle" target="_blank">'+kv.resName+'</a>'+
            '      <figure class="al-contentImgBox al-contentImgList-one">'+
            '      <a href="'+kv.resUrl+'" target="_blank">'+
            '      <img class="lazyImg" src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl+'" alt="">'+
            //'      <i class="al-mark">'+
            //'      <img src="//img10.allinmd.cn/v3/common/icon/mark_spread.png" alt="">'+
            //'      </i>'+
            '      </a>'+
            '      </figure>'+
            '  </article>'+
            '  </section>';
        return html;

    },
    //活动
    activityList:function(kv){
        //resUrl attUrl resName
        var html= ' <section class="al-contentInALine ev_operate" itemId="'+kv.itemId+'" itemType="'+kv.itemType+'" index="'+kv.index+'">'+
                  '  <article class="al-contentText">'+
                  '  <figure class="al-contentImgBox al-contentImgList-one">'+
                  '  <a href="'+kv.resUrl+'">'+
                  '  <img class="lazyImg" src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl+'" alt="">'+
                  '  <i class="al-mark">'+
                  '  <img src="//img10.allinmd.cn/v3/common/icon/mark_spread.png" alt="">'+
                  '  </i>'+
                  '  </a>'+
                  '  </figure>'+
                  '  <p class="al-contentMainText" style="margin:26px 0 0 0;">'+
                  '  <a href="'+kv.resUrl+'">'+kv.resName+'</a>'+
                  '  <a href="'+kv.resUrl+'" class="al-followBtn">'+
                  '  <img src="//img10.allinmd.cn/v3/common/icon/icon_join.png" alt="">'+
                  '  </a>'+
                  '  </p>'+
                  '  </article>'+
                  '  </section>';
        return html;
    },
    //专题
    special:function(kv){
        //resUrl attUrl resName
        var html= ' <section class="al-contentInALine ev_operate" itemId="'+kv.itemId+'" itemType="'+kv.itemType+'" index="'+kv.index+'">'+
            '  <article class="al-contentText">'+
            '  <figure class="al-contentImgBox al-contentImgList-one">'+
            '  <a href="'+kv.resUrl+'">'+
            '  <img class="lazyImg" src="/images/img10/default/loading/225_150.jpg" data-original="'+kv.attUrl+'" alt="">'+
            '  </a>'+
            '  </figure>'+
            '  <p class="al-contentMainText" style="margin:26px 0 0 0;">'+
            '  <a href="'+kv.resUrl+'">'+kv.resName+'</a>'+
            '  </p>'+
            '  </article>'+
            '  </section>';
        return html;
    },
    //动态，朋友圈
    friendCircleList:function(kv){
        //customerId  userName  publishTime resName resUrl
        var tName=kv.trendName;
        if(!/了/.test(tName)){
            tName = kv.trendName+'了';
        }
        var html="";
        if(kv.resourceValid!="0"){
            html = '<article class="al-activeItem">'+
                '<p>' +
                '<a href="/pages/personal/others_contribution.html?cid='+kv.customerId+'"" class="al-activeItemAuthor" target="_blank">'+comm.getStrLen(kv.userName,10)+'</a>' +
                '<em class="al-activeItemName">'+tName+'</em> ' +
                '<span class="al-activeItemTime">'+comm.date.diffDay_one(kv.publishTime,comm.date.local_time())+'</span>' +
                '</p>'+
                '<a href="'+kv.resUrl+'" class="al-activeItemLink"  target="_blank" style="word-break:break-all;">'+comm.getStrLen(kv.resName,50)+'</a>'+
                '</article>';
        }

        return html;
    }
};