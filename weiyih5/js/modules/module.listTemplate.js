module.listTemplate = {
    notLoginTemplate: function(){
        return '<section class="al-noLoginTips ev-noLogin" style="">'+
            '<figure>'+
                '<img src="//img50.allinmd.cn/pages/personal/no_login.png" alt="">'+
            '</figure>'+
        '</section>';
    },
    nullDataTemplate: function() { //没有更多显示
        return '<section class="al-personalContributionOver">' +
            '<span>~</span>没有更多了<span>~</span>' +
            '</section>';
    },
    noReviewTemplate: function() { //无评论提示
        return '<section class="al-picListnoContentTips">' +
            '<figure>' +
            '<img src="//img50.allinmd.cn/pages/personal/no_comment.png" alt="">' +
            '</figure>' +
            '</section>';
    },
    contributionTemplate: function(kv) { //全部贡献
        return '<section class="al-contentPartModule">' +
            '<section class="al-tableBox">' +
            '<article class="al-contentText">' +
            '<a href="javascript:void(0)" class="al-contentTitle"><span>喵喵</span></a>' +
            '<p class="al-contentOtherMsg">' +
            '<span class="al-contentNewest">最新</span>' +
            '<span class="al-contentWatchedNum"><i class="icon-contentAuthor"></i>喵咪咪咪</span>' +
            '<span class="al-contentLikeNum"><i class="icon-likeNum"></i>233</span>' +
            '<span class="al-contentDelete">x</span>' +
            '</p>' +
            '</article>' +
            '<figure class="al-contentImgBox">' +
            '<a href="javascript:void(0)"><img src="//img50.allinmd.cn/pages/default/content_img.jpg" alt=""></a>' +
            '<i class="al-videoPlayBtn">' +
            '<img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">' +
            '</i>' +
            '<span class="al-videoTime">00:00</span>' +
            '</figure>' +
            '</section>' +
            '</section>';
    },
    itemReview: function(kv, scene) {
        if(kv.refType==18||kv.refType==17){return "";}
        return '<section class="al-commentItem">' +
            '<figure class="al-commentUserImg">' +
            '<a href="'+(kv.customerId&&kv.customerId!=0?'/pages/personal/others_contribution.html?cid=' + kv.customerId :'javascript:;')+ '"><img src="' + kv.logoUrl + '" alt=""></a>' +
            '</figure>' +
            '<article class="al-commentContent">' +
            '<h2 class="al-commentUserName">' +
            '<a href="'+(kv.customerId&&kv.customerId!=0?'/pages/personal/others_contribution.html?cid=' + kv.customerId :'javascript:;')+ '">' + kv.username + '</a>' +
            (function(kv){
                if(kv.refType==16){
                    return '<span class="al-commentShareTips">分享活动</span>';
                }else if(kv.refType!=16 && kv.opId !=2){
                    return '';
                }else if(kv.refType!=16 && kv.opId==2){
                    return '<span class="al-commentShareTips">分享</span>';
                }
            })(kv)+
            '<span class="al-commentTime">' + kv.publishTime + '</span>' +
            '</h2>' +
             //lichunhui 修改 评论已删除或被屏蔽不显示正文
            this.content(kv)+    //评论内容
            ((kv.reviewStatus==2||kv.reviewStatus==3)?'':
            this.itemReviewQuote(kv) +  // 引用资源
            this.itemParentReview(kv)) + // 被评论的评论

            ((/personal_collection/.test(window.location.href)||kv.tplPath==286)?"":this.social(scene,kv))+            //收藏不加交互部分
            '</article>' +
        '</section>';

    },
    content: function(kv){
        var html='';
        //if(kv.content && kv.content.indexOf("</a>")>0){
        //    var result=[];
        //    var tempArr= kv.content.match(/(<a(.)*)(.|\r\n|\n)*?<\/a>/gi).join("").split("><");
        //    for(var x= 0,len=tempArr.length;x<len;x++){
        //        if(len-1==x){
        //            result.push("<i "+tempArr[x].substr(0,tempArr[x].length-4)+"</i>");
        //        }else{
        //            result.push("<i "+tempArr[x].substr(2,tempArr[x].length-5)+"</i>");
        //        }
        //    }
        //    result= kv.content.substr(0,kv.content.indexOf("<a"))+result.join("");
        //    kv.content= result;
        //}
        kv.content = kv.content!=undefined?kv.content.replace(/<(\/*?[b-z].*?)>/g,"&lt;$1&gt;").replace(/&lt;br\/&gt;/g,'<br/>'):"";//[^(<\/a(.*href="?.*"?))]/

        var desc,refType= parseInt(kv.resourceType);
        switch(refType){
            case 1: desc="视频"; break;
            case 2:
                if(kv.tplPath==286){
                    desc = "书籍";
                }else {
                    desc = "文章";
                }break;
            case 4: desc="话题"; break;
            case 7: desc="病例"; break;
            default: desc= "评论";
        }

        if(kv.parentId==0||kv.parentId==undefined){//直接对资源评论
	        html= '<a href="'+(kv.resourceIsValid==1?this.contentOrDisCuss(kv):'javascript:;')+'">' + //
		        '<p class="al-commentContentText" style="word-break: break-all;">' +
                    (function(kv){
                        if(kv.opId==2 && kv.refType!=16){
                            //if( !(/[0-9]/.test(window.location.href)) ){ //非终端页
                                if(kv.resourceIsValid==1){
                                    if(kv.refType!=8){
                                        // if((kv.tplPath==286||kv.tplPath==287)&&(kv.parentUsername=="唯医小编"||kv.parentUsername==""))return '《'+kv.content+'》';
                                        if(kv.tplPath==286||kv.tplPath==287)return '《'+kv.content+'》';
                                        return kv.parentUsername+": 《"+kv.content+"》";
                                    }else{
                                        return kv.parentUsername+": "+kv.content;
                                    }
                                }else if(kv.resourceIsValid==0){
                                    return '<article class="al-commentShareContent"><span>该' + desc + '已被系统屏蔽</span></article>';
                                }else if(kv.resourceIsValid==3){
                                    return '<article class="al-commentShareContent"><span>该' + desc + '已被作者删除</span></article>';
                                }else if(kv.resourceIsValid==2){
                                    return '<article class="al-commentShareContent"><span>该' + desc + '已被系统屏蔽</span></article>';
                                }

                            //}
                        }else if(kv.refType == 8){
                            if(kv.content == '该条评论已被作者删除'){
                                return '<span style="color:#aaaaaa;">该条评论已被作者删除</span>';
                            }else{
                                //lichunhui update 无评论内容不显示影像两个字
                                return kv.content;
                                //return module.listTemplate.convertVideoWord(kv.content);
                            }
                        }else{
                            return '<a class="itemsRefUrl" href="' + kv.refUrl + '">' + kv.content + '</a>';
                        }
                    })(kv)+
		        ' </p>' +
		        '</a>';
            //lichunhui 修改 评论已删除或被屏蔽不显示正文
            if(!(kv.reviewStatus==2||kv.reviewStatus==3)){
                html += this.itemReviewVideoPic(kv); // 评论图片或视频

                if(!(kv.opId==2 && kv.refType!=16)){//分享的资源被屏蔽或删除不显示下面的dom结构
                    switch(kv.resourceIsValid){
                        case 1:

                            break;

                        case 0: html += '<article class="al-commentShareContent"><span>该' + desc + '已被系统屏蔽</span></article>'; break;
                        case 3: html += '<article class="al-commentShareContent"><span>该' + desc + '已被作者删除</span></article>'; break;
                        default: html= '';
                    }
                }

            }

        }else{//对评论的评论
            html= '<a href="'+this.contentOrDisCuss(kv)+'">' + //
                '<p class="al-commentContentText" style="word-break: break-all;">' +
                (function(kv){
                    if(kv.opId==2 && kv.refType!=16){
                        return kv.parentUsername+": "+module.listTemplate.convertVideoWord(kv.content);
                    }else if(kv.refType == 8){
                        if(kv.content == '该条评论已被作者删除'){
                            return '<span style="color:#aaaaaa;">该条评论已被作者删除</span>';
                        }else{
                            //lichunhui update 无评论内容不显示影像两个字
                            return kv.content;
                            //return module.listTemplate.convertVideoWord(kv.content);
                        }
                    }else{
                        return '<a class="itemsRefUrl" href="' + kv.refUrl + '">' + module.listTemplate.convertVideoWord(kv.content) + '</a>';
                    }
                })(kv)+
                ' </p>' +
                '</a>';
            //lichunhui 修改 评论已删除或被屏蔽不显示正文
            if(!(kv.reviewStatus==2||kv.reviewStatus==3)) {
                html += this.itemReviewVideoPic(kv); // 评论图片或视频
            }
        }
        return html;

    },
    convertVideoWord: function(str){ //转成【影像】文字
        if(/\[影像\]/.test(str) || str==""){
            return '【影像】';
        }else{
            return str;
        }
    },
    social: function(scene,kv){
        var html='';
        var attrLogoUrl="";
        var attLogo = kv.attachment_Arr;
        var len = attLogo!=undefined?attLogo.length:0;
        switch(kv.refType){
            case 1://视频
                if(len>0){
                    attrLogoUrl= attLogo[0].videoAttUrl;
                }
                break;
            case 2://文库
                attrLogoUrl = attLogo;
                break;
            case 4://话题
                if(len>0){
                    attrLogoUrl= attLogo[0].topicAttUrl;
                }
                break;
            case 7://病例
                if(len>0){
                    attrLogoUrl= attLogo[0].attUrl;
                }
                break;
            case 8://讨论
                if(len>0){
                    attrLogoUrl= attLogo[0].attUrl;
                }
                break;
            case 16://分享的活动
                attrLogoUrl= kv.activity.activityPicUrl;
                break;
            default:
        }
        if(attrLogoUrl==""){
            attrLogoUrl="https:/image/allin_logo.png";
        }

        var refUrl=kv.refUrl;

        if(kv.refType==8){ //评论时
            if(kv.parentId!=0){//回复评论
                if(kv.tplPath==286){
                    refUrl='/pages/eBook/eBook_details.html?bId='+kv.refId+'&reviewId='+kv.id;
                }else {
                    refUrl = 'https:/pages/personal/details_discuss.html?refCustomerId=' + kv.refCustomerId + '&refId=' + kv.refId + '&refType=' + kv.resourceType + '&reviewId=' + kv.id + '&refName=' + kv.refName + '&refUrl=' + kv.refUrl;
                }
            }else{//回复资源
                if(kv.tplPath==286){
                    refUrl= '/pages/eBook/eBook_details.html?bId='+kv.refId+'&reviewId='+kv.id;
                }else {
                    refUrl = 'https:/pages/personal/details_content.html?refCustomerId=' + kv.refCustomerId + '&refId=' + kv.refId + '&refType=' + kv.resourceType + '&reviewId=' + kv.id + '&refName=' + kv.refName + '&refUrl=' + kv.refUrl;
                }
            }
        }else if(kv.refType==16){
            refUrl=kv.activity.activityUrl;
        }

        if(kv.refType==16){ //活动 只有分享
            html=  '<section class="al-commentOtherMsg">' +
                (scene === "personalAction" || scene==="collectReview" ? "" : '<span class="al-myCommentDelete ev-reviewDelete" data-reviewid="' + kv.id + '"><i class="icon-delete"></i>删除</span>') +
                '<figure class="al-commentShare ev-shareAndCollect">···' +
                '<section class="al-commentShareBtn">' +
                    '<p class="al-commentShareSns ev-share icon-commentShare" data-resourceType="'+kv.resourceType+'" data-parentId="'+kv.parentId+'" data-username="'+kv.username+'" data-parentUsername="'+kv.parentUsername+'" data-refId="'+kv.id+'" data-refCustomerId="'+kv.refCustomerId+'" data-refType="'+kv.refType+'" data-title="'+ kv.refName +'"  data-url="'+refUrl+'" data-pic="'+attrLogoUrl+'" data-desc="'+ $("<p>"+htmlToString(kv.content)+"</p>").text() +'" data-opId="'+kv.opId+'">分享</p>' +
                '</section>' +
                '</figure>' +
            '</section>';
        }else{//非活动
            switch(kv.resourceIsValid){
                case 1:
                    html=  '<section class="al-commentOtherMsg">' +
                        (scene === "personalAction" || scene==="collectReview" ? "" : '<span class="al-myCommentDelete ev-reviewDelete" data-reviewid="' + kv.id + '"><i class="icon-delete"></i>删除</span>') +
                        '<span class="ev-review" data-username="' + kv.username + '" data-parentId="' + (kv.refType==8?kv.id:0) + '" data-refType="' + kv.resourceType + '" data-refId="' + kv.refId + '"><i class="icon-commentNum"></i><span class="ev-reviewNum" style="margin-left: 0;">' + (kv.reviewNum==0?'评论':kv.reviewNum) + '</span></span>' +
                        '<span class="al-commentLikeNum '+(kv.preferState==1?'al-timelineContentLiked':'')+' ev-prefer" data-reviewType="' + kv.refType +'" data-preferState="' + kv.preferState + '" data-refId="' + kv.id + '" data-customerId="' + kv.customerId + '"><i class="icon-commentLikeNum"></i><span class="ev-preferNum" style="margin-left: 0;">' + (kv.preferNum==0?'点赞':kv.preferNum) + '</span></span>' +
                        '<figure class="al-commentShare ev-shareAndCollect">···' +
                            '<section class="al-commentShareBtn">' +
                                '<p class="al-commentShareSns ev-share icon-commentShare" data-resourceType="'+kv.resourceType+'" data-parentId="'+kv.parentId+'" data-username="'+kv.username+'" data-parentUsername="'+kv.parentUsername+'" data-refId="'+kv.id+'" data-refCustomerId="'+kv.refCustomerId+'" data-refType="'+kv.refType+'" data-title="'+ kv.refName +'"  data-url="'+refUrl+'" data-pic="'+attrLogoUrl+'" data-desc="'+ $("<p>"+htmlToString(kv.content)+"</p>").text() +'" data-opId="'+kv.opId+'">分享</p>' +
                                '<p class="al-commentCollection ev-collect icon-commentCollect '+(kv.collectState==1?'icon-commentCollected':'')+'" data-refType="' + kv.refType + '" data-refId="' + kv.id + '" data-refCustomerId="'+ kv.refCustomerId +'" data-state="' + kv.collectState + '">收藏</p>' +
                            '</section>' +
                        '</figure>' +
                    '</section>';
                    break;
                case 0:
                case 3:
                default:
                    html= '';
            }
        }
        return html;
    },
    itemParentReview: function(kv) {
        //如果为分享时不允许出现父级
        if(kv.refType!=16 && kv.opId==2) return '';

        if(kv.parentId==0){
            if(/friends_circle/.test(window.location.href)){
                if(kv.resourceIsValid!=1){
                    return '';
                }
            }else{
                if(kv.resourceIsValid !=1 || kv.opId==2){
                    return '';
                }
            }
        }
        if(!kv.parentContent) return '';

        kv.parentContent= module.listTemplate.convertVideoWord(kv.parentContent);

        //if(kv.parentContent.indexOf("</a>")>0){
        //    var result=[];
        //    var tempArr= kv.parentContent.match(/(<a(.)*)(.|\r\n|\n)*?<\/a>/gi).join("").split("><");
        //    for(var x= 0,len=tempArr.length;x<len;x++){
        //        if(len-1==x){
        //            result.push("<i "+tempArr[x].substr(0,tempArr[x].length-4)+"</i>");
        //        }else{
        //            result.push("<i "+tempArr[x].substr(2,tempArr[x].length-5)+"</i>");
        //        }
        //    }
        //    result= kv.parentContent.substr(0,kv.parentContent.indexOf("<a"))+result.join("");
        //    kv.parentContent= result;
        //}
        kv.parentContent = kv.parentContent.replace(/<(\/*?[b-z].*?)>/g,"&lt;$1&gt;").replace(/&lt;br\/&gt;/g,'<br/>');
        if(kv.refType==8){

            if(kv.parentId == 0) {

                var desc='';
                var refType= parseInt(kv.resourceType);
                switch(refType){
                    case 1: desc="视频"; break;
                    case 2:
                        if(kv.tplPath==286){
                            desc = "书籍";
                        }else {
                            desc = "文章";
                        }
                        break;
                    case 4: desc="话题"; break;
                    case 7: desc="病例"; break;
                    default:
                }
                if(kv.parentAuth){
                    kv.parentUsername= kv.parentAuth.lastName+kv.parentAuth.firstName;
                }

                //判断非trends数据返回，用于我的回复等
                if(kv.parentData){ //非我的回复 动态类
                    switch(refType){
                        case 1: kv.parentContent= kv.parentData.videoName; break;
                        case 2: kv.parentContent= kv.parentData.docName; break;
                        case 4: kv.parentContent= kv.parentData.topicName; break;
                        case 7: kv.parentContent= kv.parentData.caseName; break;
                        default:
                    }
                    kv.parentUsername= kv.parentAuth.lastName+kv.parentAuth.firstName;
                    kv.trendsValid= kv.parentData.isValid;
                }

                if(kv.trendsValid==1){
                    if(kv.tplPath==286){
                        return '<article class="al-commentShareContent">' +
                            '<a href="/pages/eBook/eBook_details.html?bId='+kv.refId+'"><span>' +(kv.parentUsername !== ''&&kv.parentUsername!="唯医小编" ? (kv.parentUsername + ':《 ' + kv.refName.cutString(22) + '》') : '《'+ kv.refName.cutString(26)+'》')+'</span></a>' +
                            '</article>';
                    }
                    return '<article class="al-commentShareContent">' +
                        '<a href="'+kv.refUrl+'"><span>'+(kv.parentUsername !== '' ? kv.parentUsername + ':《 ' + kv.refName.cutString(22) + '》' : ''+ kv.refName.cutString(26))+'</span></a>' +
                    '</article>';
                }else{
                    return '<article class="al-commentShareContent">' +
                        '<span>该' + desc + '已被作者删除</span>' +
                    '</article>';
                }
            }
            if(kv.parentContent == '该条评论已被作者删除'){
                return '<article class="al-commentShareContent">' +
                    '<span>' + kv.parentContent + '</span>' +
                '</article>';
            }else{
                if(kv.tplPath==286){
                    return '<article class="al-commentShareContent">' +
                        '<a href="/pages/eBook/eBook_details.html?bId='+kv.refId+'"><span>'+(kv.parentUsername !== '' ? kv.parentUsername +': ' : '')+kv.parentContent+'</span></a>' +
                        '</article>';
                }
                return '<article class="al-commentShareContent">' +
                    '<a href="/pages/personal/details_discuss.html?refCustomerId='+kv.refCustomerId+'&refId=' + kv.refId + '&refType=' + kv.resourceType + '&reviewId=' + kv.id +'&refName=' + kv.refName + '&refUrl=' + kv.refUrl + '">' + //A标回复时非终端页跳上下文
                        '<span>' + (kv.parentUsername !== '' ? kv.parentUsername +': ' : '')+kv.parentContent+ '</span>' +
                    '</a>' +
                '</article>';
            }
        }else{
            return '<article class="al-commentShareContent">' +
                '<a href="' + kv.parentRefUrl + '"><span>' + (kv.parentUsername !== '' ? kv.parentUsername + ': ' : '') + kv.parentContent + '</span></a>' +
            '</article>';
        }
    },
    contentOrDisCuss: function(kv){
        if(kv.refType!=16 && kv.opId==2){ //分享场景时
            if(kv.refType==8){ //评论时
                if(kv.tplPath==286){
                    return '/pages/eBook/eBook_details.html?bId='+kv.refId+'&reviewId='+kv.id;
                }
                return '/pages/personal/details_discuss.html?refCustomerId='+kv.refCustomerId+'&refId=' + kv.refId + '&refType=' + kv.resourceType + '&reviewId=' + kv.id +'&refName=' + kv.refName + '&refUrl=' + kv.refUrl;
            }else{ //直接去资源页
                if(kv.tplPath==286){
                    return '/pages/eBook/eBook_details.html?bId='+kv.refId;
                }
                return kv.refUrl;
            }
        }else if(kv.parentId!=0){
            if(kv.tplPath==286){
                return '/pages/eBook/eBook_details.html?bId='+kv.refId+'&reviewId='+kv.id;
            }else if(kv.opId==0){   //opId为0，发布资源
                return kv.refUrl;
            }
            return '/pages/personal/details_discuss.html?refCustomerId='+kv.refCustomerId+'&refId=' + kv.refId + '&refType=' + kv.resourceType + '&reviewId=' + kv.id +'&refName=' + kv.refName + '&refUrl=' + kv.refUrl;
        }else{
            if(kv.tplPath==286){
                return '/pages/eBook/eBook_details.html?bId='+kv.refId+'&reviewId='+kv.id;
            }
            return '/pages/personal/details_content.html?refCustomerId='+kv.refCustomerId+'&refId=' + kv.refId + '&refType=' + kv.resourceType + '&reviewId=' + kv.id +'&refName=' + kv.refName + '&refUrl=' + kv.refUrl;
        }
    },
    itemReviewQuote: function(kv) {

        if(kv.parentId==0){

            if (kv.resourceIsValid != 1) {
                return '';
            }

            if (kv.trendsValid != 1) return '';

            if (!kv.quoteUrl) return '';
            var word = "",
                html = '<a href="' + kv.quoteUrl + '">《<span>' + kv.refQuoteName + '</span>》</a>';

            switch (kv.resourceType) {
                case 1:
                    word = "视频";
                    break;
                case 2:
                    if(kv.tplPath==286){
                        desc = "书籍";
                    }else {
                        desc = "文章";
                    }
                    break;
                case 4:
                    word = "话题";
                    break;
                case 7:
                    word = "病例";
                    break;
                default:
                    word = "评论";
                    html = '<a href="' + kv.quoteUrl + '"><span>' + kv.refQuoteName + '</span></a>';
            }
            return '<p class="al-commentContentQuote">引用' + word + '：' + html + '</p>';
        }else{
            return '';
        }

    },
    itemReviewVideoPic: function(kv) {
        //debugger;
        if(kv.refType==16){
            return '<section class="al-commentContentImgPart">' +
                '<figure class="al-commentContentImg" style="width:90%;height: 4.5rem;">' +
                '<a href="'+kv.activity.activityUrl+'"><img src="' + kv.activity.activityPicUrl + '" alt=""></a>' +
                '</figure>'+
            '</section>';
        }

        if(kv.trendsValid !=1 && kv.refType!=8){
            return '';
        }
        //文库类型只会存在一个缩略图 ,直接输出
        if (kv.refType === 2) {
            if(!kv.attachment_Arr){
                return '';
            }else{
                return '<section class="al-commentContentImgPart ev-picList">' +
                    '<figure class="al-commentContentImg">' +
                    '<img src="' + kv.attachment_Arr + '" alt="">' +
                    '</figure>'+
                '</section>';
            }
        }

        var resultHtml= '', videoHtml='', picHtml= '';
        //视频
        if (kv.videoLogoUrl){
            if(kv.videoState == 1){
                videoHtml= '<section style="margin-top: 10px;" class="al-commentVideoPart">'+
                    '<figure class="al-commentVideoItem">'+
                    '<img src="//img10.allinmd.cn/default/qiniu296_196.jpg" alt="">'+
                    '</figure>'+
                '</section>';
            //}else if(kv.videoState == 2){debugger;
            } else if (kv.videoState == 4) {
                videoHtml= '<section style="margin-top: 10px;" class="al-commentVideoPart">'+
                    '<figure class="al-commentVideoItem">'+
                    '<img src="//img50.allinmd.cn/case/videoFailing.png" alt="">'+
                    '</figure>'+
                    '</section>';
            }else if(kv.videoState == 2 || kv.videoState==undefined){//视频资源有的没有qiniu解码状态返回
                videoHtml= '<figure class="al-commentContentVideo'+(kv.videoSrcUrl==''?'':' ev-video')+'" '+(kv.videoSrcUrl==''?'':'data-videoSrc="'+ kv.videoSrcUrl+'"')+'>' +
                    '<img class="al-commentContentVideoImg notShow" src="' + kv.videoLogoUrl + '" alt="视频缩略图" />' +
                    '<i class="al-commentContentVideoBtn"><img class="notShow" src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt=""></i>' +
                    (kv.playTime!=''?'<span class="al-commentContentVideoTime">' + kv.playTime + '</span>':'')+
                '</figure>';
            }
        }

        //图片
        var data = kv.attachment_Arr;
        var len = data!=undefined?data.length:0;

        //根据类型取图
        var attrLogoUrl='';
        var attWidth="attWidth";attHeight="attHeight";
        var width = parseInt($(window).width()*0.9);
        var h = parseInt(width*0.639);
        switch(kv.refType){
            case 1: attrLogoUrl= 'videoAttUrl'; break;
            case 4: attrLogoUrl= "topicAttUrl"; break;
            case 7: attrLogoUrl= "attUrl"; break;
            case 8: attrLogoUrl= "attUrl"; attWidth="originalAttWidth";attHeight="originalAttHeight";break;
            default:
        }
        if (len === 0){
            picHtml= '';
        }else{
            var wrapHtml = $('<section><section class="al-commentContentImgPart ev-picList"></section></section>');
            switch(len){
                case 1:
                    wrapHtml.find('.ev-picList').append('<figure class="al-commentContentVideo" >' +
                        '<img src="' + data[0][attrLogoUrl] + '" alt="" attWidth="'+(data[0][attWidth]!=""?data[0][attWidth]:width)+'" attHeight = "'+(data[0][attHeight]!=""?data[0][attHeight]:h)+'">' +
                        '</figure>');
                    break;
                case 3:
                    wrapHtml.find('.ev-picList').html('<figure class="al-commentContentImg" style="position: relative;display: inline-block;width: 4.8rem;height: 3.2rem;float: left;" >' +
                        '<img class="al-commentContentVideoImg" src="' + data[0][attrLogoUrl] + '" attWidth="'+(data[0][attWidth]!=""?data[0][attWidth]:width)+'" attHeight = "'+(data[0][attHeight]!=""?data[0][attHeight]:h)+'" />' +
                    '</figure>'+
                    '<figure class="al-commentContentImg" style="width: 2.46667rem;height: 1.56333rem;" ><img src="' + data[1][attrLogoUrl] + '" alt="" attWidth="'+(data[1][attWidth]!=""?data[1][attWidth]:width)+'" attHeight = "'+(data[1][attHeight]!=""?data[1][attHeight]:h)+'"></figure>'+
                    '<figure class="al-commentContentImg" style="width: 2.46667rem;height: 1.63333rem;padding-top: 0.13333rem;" ><img src="' + data[2][attrLogoUrl] + '" alt="" attWidth="'+(data[2][attWidth]!=""?data[2][attWidth]:width)+'" attHeight = "'+(data[2][attHeight]!=""?data[2][attHeight]:h)+'"></figure>');
                    break;
                default:
                    for (var x = 0,z=data.length>4?4:data.length; x<z; x++) {
                        wrapHtml.find('.ev-picList').append('<figure class="al-commentContentImg">' +
                            '<img src="' + data[x][attrLogoUrl] + '" alt=""  attWidth="'+(data[x][attWidth]!=""?data[x][attWidth]:width)+'" attHeight = "'+(data[x][attHeight]!=""?data[x][attHeight]:h)+'">' +
                            '</figure>');
                    }
            }
            picHtml= wrapHtml.html();
        }

        //当视频与图片都存在时结合
        if(videoHtml=='' && picHtml!=''){
            resultHtml= picHtml;
        }else if(picHtml=='' && videoHtml != ''){
            resultHtml= videoHtml;
        }else if(picHtml!='' && videoHtml != ''){

            //获取len设置的图片长度，因为视频只能存在一个，所以直接将视频置前
            var tempVideoHtml= '';
            if(kv.videoState == 1){
                tempVideoHtml= '<section style="margin-top: 10px;" class="al-commentVideoPart" style="">'+
                    '<figure class="al-commentVideoItem" style="display: block;float: left;width: 3.6rem;height: 2.4rem;padding-top: 0.13333rem;padding-right: 0.13333rem;box-sizing: border-box;">'+
                    '<img src="//img10.allinmd.cn/default/qiniu296_196.jpg" style="width: 100%;height: 100%;vertical-align: top;" alt="">'+
                    '</figure>'+
                '</section>';
            }else if(kv.videoState == 2){
                tempVideoHtml= '<figure class="al-commentContentImg ev-video" data-videoSrc="' + kv.videoSrcUrl + '" style="position: relative;display: inline-block;">' +
                    '<img class="al-commentContentVideoImg notShow" src="' + kv.videoLogoUrl + '" alt="视频缩略图" />' +
                    '<i class="al-commentContentVideoBtn" style="width: 0.66667rem;height: 0.66667rem;border-radius: 50%;background-color: #ffffff;position: absolute;left: 50%;top: 50%;margin-left: -0.33333rem;margin-top: -0.33333rem;"><img class="notShow" src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt=""></i>' +
                    '<span class="al-commentContentVideoTime" style="background-color: transparent;background-image: -webkit-linear-gradient(left, transparent, rgba(0, 0, 0, 0.3));background-image: linear-gradient(to right,transparent, rgba(0, 0, 0, 0.3));padding: 0.13333rem;padding-left: 0.8rem;position: absolute;right: 0.13333rem;bottom: 0;color: #fff;">' +
                    kv.playTime +
                    '</span>' +
                '</figure>';
            }else if (kv.videoState == 4) {
                tempVideoHtml= '<section style="margin-top: 10px;" class="al-commentVideoPart" style="">'+
                    '<figure class="al-commentVideoItem" style="display: block;float: left;width: 3.6rem;height: 2.4rem;padding-top: 0.13333rem;padding-right: 0.13333rem;box-sizing: border-box;">'+
                    '<img src="//img50.allinmd.cn/case/videoFailing.jpg" style="width: 100%;height: 100%;vertical-align: top;" alt="">'+
                    '</figure>'+
                    '</section>';
            }

           switch(len){
               case 1:
                   wrapHtml.find('.ev-picList').html(tempVideoHtml+
                       '<figure class="al-commentContentImg" ><img src="' + data[0][attrLogoUrl] + '" alt="" attWidth="'+(data[0][attWidth]!=""?data[0][attWidth]:width)+'" attHeight = "'+(data[0][attHeight]!=""?data[0][attHeight]:h)+'"></figure>');
                   break;
               case 2:
                   //视频为大图
                   if(kv.videoState == 1){
                       tempVideoHtml= '<section style="margin-top: 10px;" class="al-commentVideoPart" style="position: relative;display: inline-block;width: 4.8rem;height: 3.2rem;float: left;">'+
                           '<figure class="al-commentVideoItem" style="display: block;float: left;width: 4.8rem;height: 3.2rem;padding-top: 0.13333rem;padding-right: 0.13333rem;box-sizing: border-box;">'+
                           '<img src="//img10.allinmd.cn/default/qiniu296_196.jpg" style="width: 100%;height: 100%;vertical-align: top;" alt="">'+
                           '</figure>'+
                           '</section>';
                   }else if(kv.videoState == 2){
                       tempVideoHtml= '<figure class="al-commentContentImg ev-video" data-videoSrc="' + kv.videoSrcUrl + '" style="position: relative;display: inline-block;width: 4.8rem;height: 3.2rem;float: left;">' +
                           '<img class="al-commentContentVideoImg notShow" src="' + kv.videoLogoUrl + '" alt="视频缩略图" />' +
                           '<i class="al-commentContentVideoBtn" style="width: 0.66667rem;height: 0.66667rem;border-radius: 50%;background-color: #ffffff;position: absolute;left: 50%;top: 50%;margin-left: -0.33333rem;margin-top: -0.33333rem;"><img class="notShow" src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt=""></i>' +
                           '<span class="al-commentContentVideoTime" style="background-color: transparent;background-image: -webkit-linear-gradient(left, transparent, rgba(0, 0, 0, 0.3));background-image: linear-gradient(to right,transparent, rgba(0, 0, 0, 0.3));padding: 0.13333rem;padding-left: 0.8rem;position: absolute;right: 0.13333rem;bottom: 0;color: #fff;">' +
                           kv.playTime +
                           '</span>' +
                           '</figure>';
                   }else if (kv.videoState ==4){
                       tempVideoHtml= '<section style="margin-top: 10px;" class="al-commentVideoPart" style="position: relative;display: inline-block;width: 4.8rem;height: 3.2rem;float: left;">'+
                           '<figure class="al-commentVideoItem" style="display: block;float: left;width: 4.8rem;height: 3.2rem;padding-top: 0.13333rem;padding-right: 0.13333rem;box-sizing: border-box;">'+
                           '<img src="//img50.allinmd.cn/case/videoFailing.jpg" style="width: 100%;height: 100%;vertical-align: top;" alt="">'+
                           '</figure>'+
                           '</section>';
                   }

                   wrapHtml.find('.ev-picList').html(tempVideoHtml+
                   '<figure class="al-commentContentImg" style="width: 2.46667rem;height: 1.56333rem;"><img src="' + data[0][attrLogoUrl] + '" alt="" attWidth="'+(data[0][attWidth]!=""?data[0][attWidth]:width)+'" attHeight = "'+(data[0][attHeight]!=""?data[0][attHeight]:h)+'"></figure>'+
                   '<figure class="al-commentContentImg" style="width: 2.46667rem;height: 1.63333rem;padding-top: 0.13333rem;"><img src="' + data[1][attrLogoUrl] + '" alt="" attWidth="'+(data[1][attWidth]!=""?data[1][attWidth]:width)+'" attHeight = "'+(data[1][attHeight]!=""?data[1][attHeight]:h)+'"></figure>');
                   break;
               default:
                   wrapHtml.find('.ev-picList').html(tempVideoHtml+
                   '<figure class="al-commentContentImg"><img src="' + data[0][attrLogoUrl] + '" alt=""  attWidth="'+(data[0][attWidth]!=""?data[0][attWidth]:width)+'" attHeight = "'+(data[0][attHeight]!=""?data[0][attHeight]:h)+'"></figure>'+
                   '<figure class="al-commentContentImg"><img src="' + data[1][attrLogoUrl] + '" alt="" attWidth="'+(data[1][attWidth]!=""?data[1][attWidth]:width)+'" attHeight = "'+(data[1][attHeight]!=""?data[1][attHeight]:h)+'"></figure>'+
                   '<figure class="al-commentContentImg"><img src="' + data[2][attrLogoUrl] + '" alt="" attWidth="'+(data[2][attWidth]!=""?data[2][attWidth]:width)+'" attHeight = "'+(data[2][attHeight]!=""?data[2][attHeight]:h)+'"></figure>');
           }
            resultHtml= wrapHtml.html();
        }

        return resultHtml;

    },
    nothingReview: function() {
        return '<section class="al-noContentTips">' +
            '<figure>' +
            '<img src="//img50.allinmd.cn/pages/personal/no_comment_content.png" alt="暂无数据"/>' +
            '</figure>' +
            '</section>';
    },
    scoreDom:function(s,scoreNum){
        var score="";
        if(scoreNum<10){return ""}
        var num = parseInt(s);
        var flot =(s-num)*100+"%";
        if(num==0){
            score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b style="width:'+flot+'"></b></li><li></li><li></li><li></li><li></li></ul></div>';
        }else if(num==1){
            score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b style="width:'+flot+'"></b></li><li></li><li></li><li></li></ul></div>';
        }else if(num==2){
            score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b style="width:'+flot+'"></b></li><li></li><li></li></ul></div>';
        }else if(num==3){
            score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+'"></b></li><li></li></ul></div>';
        }else if(num==4){
            score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+'"></b></li></ul></div>';
        }else if(num==5){
            score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li></ul></div>';
        }
        return score;
    },
    commonList: function(kv, isSelf) {
        var videoPlayHtml = '';
        var _actTitle ='';
        if (kv.refType == 1) {
            videoPlayHtml = '<i class="al-videoPlayBtn">' +
                '<img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">' +
                '</i>' +
                '<span class="al-videoTime">' + kv.playTime + '</span>';
        }
        if(kv.isShowActivityTag==1){
            var _color = kv.activityTagColor;
            _actTitle = '<span style="color:'+_color+';border:1px solid '+_color+';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;">'+kv.activityTagName+'</span>';
        }
	    var desc,refType= parseInt(kv.resourceType);
	    switch(refType){
		    case 1: desc="视频"; break;
		    case 2: if(kv.tplPath==286){
                desc = "书籍";
            }else {
                desc = "文章";
            }
                break;
		    case 4: desc="话题"; break;
		    case 7: desc="病例"; break;
		    default: desc= "评论";
	    }

        var picHtml = '';
        if (kv.picLogo !== "") {
            var picLogo='';
            switch(kv.refType){
                case 1: picLogo= !kv.picLogo?'':kv.picLogo;  break;
                case 2: picLogo= !kv.picLogo?'':kv.picLogo; break;
                case 4: picLogo= !kv.picLogo?'':kv.picLogo; break;
                case 7: picLogo= !kv.picLogo?'':kv.picLogo; break;
                default:
            }

            if(picLogo!==''){
                picHtml = '<figure class="al-contentImgBox">' +
                '<a href="' + kv.refUrl + '">' +
                '<img src="' + picLogo + '" alt="' + kv.title + '">' +
                '</a>' +
                videoPlayHtml +
                '</figure>';
            }
        }

        return '<section class="al-contentPartModule">' +this.scoreDom(kv.score,kv.scoreNum)+
            '<section class="al-tableBox">' +
	        (function (kv) {
		        var html="";
		        switch(parseInt(kv.resourceIsValid)){
			        case 1:
				       html= '<article class="al-contentText">' +
				        '<a href="' + kv.refUrl + '" class="al-contentTitle"><span>' + (refType==4&&kv.title==""?"话题医起聊":kv.title) + '</span></a>' +
				        '<p class="al-contentOtherMsg">' +_actTitle+
					        //'<span class="al-contentNewest">最新</span>'+
				        //(!isSelf?'<span class="icon-contentAuthor">'+ kv.author +'</span>':'' )+ //作者
				        '<span class="icon-contentWatchedNum">'+kv.browseNum+'</span>' +
				        '<span class="icon-tagComment">'+kv.reviewNum+'</span>'+
				        '<span class="icon-likeNum">'+kv.preferNum+'</span>' +
					        //'<span class="al-contentDelete">x</span>'+
				        '</p>' +
				        '</article>' +
				        picHtml;
				        break;

			        case 0: html +=
                        '<a href="' + kv.refUrl + '" class="al-contentTitle">'+
                        '<article><span>该' + desc + '已被系统屏蔽</span></article>'+// class="al-commentShareContent"
                        '<p class="al-contentOtherMsg">' +_actTitle+
                        '<span class="al-contentAuthor icon-contentAuthor">' + kv.author + '</span>' +
                        '<span class="icon-contentWatchedNum">' + kv.browseNum + '</span>' +
                        '<span class="icon-tagComment">' + kv.reviewNum + '</span>' +
                        '</p></a>';
                        break;
                    case 2: html =
                        '<a href="' + kv.refUrl + '" class="al-contentTitle">'+
                        '<article><span>该' + desc + '已被用户删除</span></article>' +// class="al-commentShareContent"
                        '<p class="al-contentOtherMsg">' +_actTitle+
                        '<span class="al-contentAuthor icon-contentAuthor">' + kv.author + '</span>' +
                        '<span class="icon-contentWatchedNum">' + kv.browseNum + '</span>' +
                        '<span class="icon-tagComment">' + kv.reviewNum + '</span>' +
                        '</p></a>';
                        break;
			        case 3: html += '<a href="' + kv.refUrl + '" class="al-contentTitle">'+
                        '<article><span>该' + desc + '已被作者删除</span></article>'+// class="al-commentShareContent"
                        '<p class="al-contentOtherMsg">' +_actTitle+
                        '<span class="al-contentAuthor icon-contentAuthor">' + kv.author + '</span>' +
                        '<span class="icon-contentWatchedNum">' + kv.browseNum + '</span>' +
                        '<span class="icon-tagComment">' + kv.reviewNum + '</span>' +
                        '</p></a>';
                        break;
			        default: html= '';
		        }
		        return html;
	        })(kv) +

            '</section>' +
        '</section>';
    },
    contributionNullData: function() { //贡献无数据时本人
        return '<section class="al-personalContributionNone">' +
            '<img src="//img50.allinmd.cn/pages/personal/no_contribution.png" alt="">' +
            '<button class="al-personalPushContribution">去发布</button>' +
            '</section>';
    },
    contributionNullDataOther: function() { //贡献无数据时他人
        return '<section class="al-othersActiveNone">' +
            '<img src="//img50.allinmd.cn/pages/personal/others_no_contribution.png" alt="">' +
            '</section>';
    },
    actionNullData: function() { //暂无动态
        return '<section class="al-personalActiveNone">' +
            '<img src="//img50.allinmd.cn/pages/personal/no_active.png" alt="">' +
            '</section>'
    },
    friendCircleNullData: function() { //朋友圈无数据
        return '<section class="al-noFriendsTips">' +
            '<article>' +
            '<p>关注其他医师，才能看到Ta的</p>' +
            '<p>最新发布 最新评论</p>' +
            '</article>' +
            '</section>';
    },
    friendCircleNullDataTitle: function() { //标题
        return '<h2 class="al-commentRecommend">' +
            '<i class="icon-recommend"></i>为你推荐' +
            '</h2>'
    },
    shareAndCollect: function() { //分享与收藏
        return '<section class="al-commentShareBtn" style="display: block;">' +
            '<p class="al-commentShareSns"><i class="icon-commentShare"></i>分享</p>' +
            '<p class="al-commentCollection"><i class="icon-commentCollect"></i>收藏</p>' +
            '</section>';
    },
    collect: function() { //收藏
        return '<section class="al-commentShareBtn al-commentHasCollected" style="display: block;">' +
            '<p class="al-commentCollection"><i class="icon-commentCollect"></i>收藏</p>' +
            '</section>';
    }

};
