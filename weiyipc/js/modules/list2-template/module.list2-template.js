//针对回复列表模板
module.list2Template= {
	nullData: function(desc,desc2,desc3){ //无数据时
		return '<section class="al-contentItem hide ev-noContent" style="display:block;margin-top: 0px;">'+
			'<article class="al-noFansTips '+(desc3!==undefined?'al-noFollowTag':'')+'">'+
		        '<p>'+desc+'</p>'+
		        (desc2!==undefined ? '<p>'+desc2+'</p>' :'')+
		        (desc3!==undefined ? desc3 :'')+
	        '</article>'+
        '</section>';
	},
	deleteTips: function(desc){ //删除提示
		return '<div class="al-deletePopBox ev-delTips" style="">'+
				'<div class="al-systemMes_deletePrompt">'+
		        '<header>'+
		            '<span>删除评论</span>'+
		            '<p class="al-deletePromptClose ev-delCancel"></p>'+
		        '</header>'+
		        '<section class="al-systemMes_deleteMain">'+
		            '<figure>'+
		                '<i></i><span>确定删除该条'+desc+'吗？</span>'+
		                '<span>删除后将无法恢复</span>'+
		            '</figure>'+
		        '</section>'+
		        '<footer class="al-systemMes_deleteFooter">'+
		            '<span class="ev-delSure">确定</span>'+
		            '<span class="deleteFooter_cancel ev-delCancel">取消</span>'+
		        '</footer>'+
		    '</div>'+
		'</div>';
	},
	detailNullData: function(v){
		var str = '';
		if(v=='eBook'){
			str = '暂无评论，快说出您的看法';
		}else{
			str = '暂无评论，快“加入讨论”参与进来~';
		}
		return '<section class="al-commentAll_body">'+
        	'<p>'+str+'</p>'+
        '</section>';
	},
	friendCircleNullData: function(){ //朋友圈无数据
		return '<section class="al-contentItem">'+
		       '<header class="al-contentItemTitle">'+
		        '<h2>朋友圈</h2>'+
		    '</header>'+
		    '<section class="al-contentComment al-noFollowTips">'+
		        '<img src="//img10.allinmd.cn/v3/friends/no_follow_tips.png" alt="">'+
		    '</section>'+
		'</section>';
	},
	quote: function(kv){ //引用
		return '<section class="al-linkCase"><span style="color:#555;font-size:14px;">引用'+this.helpers.typeConvertWord(kv.refQuoteType)+'</span><a style="font-size:14px;" href="'+kv.refQuoteUrl+'">《'+kv.refQuoteName+'》</a></section>';
	},
	video: function(kv){ //只有一个视频时,不存在图片
		if(kv.videoState == 1){
			return '<section style="margin-top:10px;" class="al-commentVideoPart ev-imgAfter-video">'+
					'<figure class="al-commentVideoItem">'+
					'<img src="//img10.allinmd.cn/default/qiniu296_196.jpg" alt="">'+
				'</figure>'+
			'</section>';
		}else if(kv.videoState == 2){
			return '<section class="al-commentVideoPart ev-imgAfter-video" data-videoSrc="'+kv.videoSrcUrl+'">'+
			    	'<figure class="al-commentVideoItem">'+
					 '<img src="'+kv.videoLogoUrl+'" alt="">'+
				 	 '<i class="al-contentVideoBtn">'+
				 	 	'<img src="//img10.allinmd.cn/v3/common/icon/video_btn.png" alt="">'+
				 	 '</i>'+
				'</figure>'+
			'</section>';
		} else if (kv.videoState == 4) {
			return '<section style="margin-top:10px;" class="al-commentVideoPart ev-imgAfter-video">'+
				'<figure class="al-commentVideoItem">'+
				'<img src="//img10.allinmd.cn/default/qiniuFailing296_196.png" alt="">'+
				'</figure>'+
				'</section>';
		} else if(kv.imgArr&&kv.imgArr.length>0){ //动态/朋友圈资源视频
			return '<section class="al-commentVideoPart ev-imgAfter-video">'+
			    	'<figure class="al-commentVideoItem">'+
			    	'<a href="'+kv.refUrl+'" target="_blank">'+
					 '<img src="'+kv.imgArr[0].videoAttUrl+'" alt="">'+
				 	 '<i class="al-contentVideoBtn">'+
				 	 	'<img src="//img10.allinmd.cn/v3/common/icon/video_btn.png" alt="">'+
				 	 '</i>'+
				 	'</a>'+
				'</figure>'+
			'</section>';
		}else{
			return '';
		}
	},
	videoExistImgs: function(kv){ //存在图片时
		if(kv.videoState == 1){
			return '<section style="margin-right:5px;" class="al-commentVideoPart ev-imgAfter-video">'+
					'<figure>'+
					'<img style="width:240px;height:160px;" src="//img10.allinmd.cn/default/qiniu196_196.jpg" alt="">'+
				'</figure>'+
			'</section>';
		}else if(kv.videoState == 2){
			return '<section class="al-commentVideoPart ev-imgAfter-video" style="margin-right: 5px;" data-videoSrc="'+kv.videoSrcUrl+'">'+
			    	'<figure style="position:relative;">'+
					 '<img style="width:240px;height:160px;" src="'+kv.videoLogoUrl+'" alt="">'+
				 	 '<i style="width: 50px;height: 50px;position: absolute;margin-left: -25px;margin-top: -25px;top: 50%;left: 50%;">'+
				 	 	'<img src="//img10.allinmd.cn/v3/common/icon/video_btn.png" alt="">'+
				 	 '</i>'+
				'</figure>'+
			'</section>';
		}else if (kv.videoState == 4) {
			return '<section style="margin-top:10px;" class="al-commentVideoPart ev-imgAfter-video">'+
				'<figure class="al-commentVideoItem">'+
				'<img src="//img10.allinmd.cn/default/qiniuFailing296_196.png" alt="">'+
				'</figure>'+
				'</section>';
		} else{
			return '';
		}
	},
	reviewImgWrap: function(kv){ //回复中图片列表
		return '<section class="al-contentImagePart ev-reviewImgWrap viewBigImgDemo" reviewId="'+kv.id+'"></section>';
	},
	reviewActivityImg: function(kv){ //只针对活动
		if(kv.activity){ //只针对资源文库时的单张图+链接
			return '<figure class="al-commentVideoItem" style="width: 500px;height: 218px;">'+
				'<a href="'+kv.activity.activityUrl+'" target="_blank"><img src="'+kv.activity.activityPicUrl+'" alt="'+kv.activity.activityName+'"></a>'+
			'</figure>';
		}else{
			return '';
		}
	},
	reviewOneImg: function(kv, isResource){
		if(isResource){ //只针对资源文库时的单张图+链接
			if(kv.tpl_Path==286){
				return '<figure class="al-commentVideoItem" style="max-width:200px;max-height:300px;">'+
					'<img src="'+kv.imgArr[0].docAttUrl+'" alt="">'+
					'</figure>';
			}
			return '<figure class="al-commentVideoItem" style="max-width:200px;max-height:300px;">'+
				'<a href="'+kv.refUrl+'" target="_blank"><img src="'+kv.imgArr[0].docAttUrl+'" alt=""></a>'+
			'</figure>';
		}

		return '<figure class="al-commentVideoItem">'+
				'<img src="'+(this.resPicType(kv))+'" alt="">'+
			'</figure>';
	},
	resPicType: function(kv){ //图片类型
		if(kv.attUrl){
			return kv.attUrl;
		}

		if(kv.topicAttUrl){
			return kv.topicAttUrl;
		}

		if(kv.videoAttUrl){
			return kv.videoAttUrl;
		}

		if(kv.docAttUrl){
			return kv.docAttUrl;
		}
	},
	reviewImg: function(kv){ //回复列表图片
		return '<figure class="al-contentImgBox" style="width: 240px;height: 160px;">'+
    	  '<img src="'+(this.resPicType(kv))+'" alt="">'+
       '</figure>';
	},
	reviewImgMore: function(kv){ //回复列表中图片更多时
		return '<figure class="al-contentImgBox" style="width: 240px;height: 160px;">'+
			'<img src="'+(this.resPicType(kv))+'" alt="">'+
				'<i class="al-contentImgMaskBg"></i>'+
			'<i class="al-contentImgMask">更多</i>'+
		'</figure>';
	},
	//回复列表 非查看对话中的 -区分场景
	review: function(kv){
		var personalHomeUrl= '/pages/personal/others_contribution.html?cid='+kv.customerId;
		if(kv.scene=="myReview"){ //我的回复与我的收藏
			personalHomeUrl= '/pages/personal/personal_index.html';
		}else if(kv.scene=="reviewMy"){
			personalHomeUrl= '/pages/personal/others_contribution.html?cid='+kv.customerId;
		}else if(kv.isSelf){
			personalHomeUrl= '/pages/personal/personal_index.html';
		}else if(kv.scene=="terminal"){
            if(kv.customerId==$("#sesCustomerId").val()){
                personalHomeUrl= '/pages/personal/personal_index.html';
			}else{
                personalHomeUrl = '/pages/personal/others_contribution.html?cid='+kv.customerId;
			}
		}
		if(kv.customerId==$("#sesCustomerId").val()){
			personalHomeUrl="/pages/personal/personal_contribution.html";
		}
		var  hostStr = '';
		if(parseInt(kv.reviewType,10)===1){
			if(kv.scene==='terminal'&&kv.refCustomerIdStr&&kv.refCustomerIdStr.indexOf(""+kv.customerId)>-1){
                hostStr = '<b class="al-floorHost"></b>';
			}
		}
		var teacherStr = '';
		if(kv.teacherInfo){
			teacherStr = 'data-vipState="'+kv.teacherInfo.vipState+'" data-studentNum="'+kv.teacherInfo.studentNum+'" data-teacher="'+kv.teacherInfo.teacher+'" data-teacherReply="'+kv.teacherInfo.teacherReply+'"';
		}
		return '<section class="al-contentComment al-contentItem Ev-mesListBox" data-flag="1" data-mesId="'+kv.messageId+'" data-ReUrl="'+(kv.refUrl?kv.refUrl:1)+'" data-reviewId="'+kv.id+'">'+
			'<figure class="al-contentCommentUserImg">'+
				(function(kv){
					return '<a href="'+personalHomeUrl+'" target="_blank">'+
                	'<img src="'+kv.logoUrl+'" alt="">'+
                	(kv.isRead==0?'<i class="al-contentCommentTips"></i>':'')+'</a>';
				})(kv)+
            '</figure>'+
	        '<section class="al-contentCommentMain">'+
	            '<article class="al-contentCommentItem">'+
	                '<article  class="al-contentCommentItemTitle">'+
	                    '<a '+teacherStr+'class="al-contentCommentUserName ev-reviewUsername '+(kv.scene=="reviewMy"?'Ev-mesPersonalCenter':'')+
	                    '" href="'+personalHomeUrl+'" data-perCenter="/pages/personal/others_contribution.html?cid='+kv.customerId+'" target="_blank">'+comm.getStrLen(kv.username,24)+
		                    '<i class="al-vipUser"></i>'+
            hostStr+
	                    '</a>'+
	                    	(kv.scene!='terminal'?'<span>'+(kv.opId==2?'分享':'评论了')+'</span>':'')+
	                    '<p class="al-contentCommentTime">'+kv.publishTime+'</p>'+
	                    (kv.scene!='terminal'?'':'<p class="al-doctorTitle">'+kv.medicalTitle+' '+kv.company+'</p>')+
	                '</article>'+
	            '</article>'+
	            (function(kv,_this){ //终端页 |区域
	            	if(kv.scene=="terminal"){
	            		return _this.reviewHandlerTerminal(kv);
	            	}else{
	            		return '';
	            	}
	            })(kv,this)+
	            (function(kv,_this){ //主内容区域
	            	if(kv.scene!=""){
						if(kv.tpl_Path==286||kv.reviewType==17){//书籍进入书籍主页，打开评论tab,并定位
							return '<p class="al-contentCommentText ev-videoAfter-content" srcHref="/pages/eBook/eBook_details.html?bId='+kv.refId+'&reviewId='+kv.id+'">'+kv.reviewContent+'</p>';
						}else{
							if(kv.opId==2){
								return '<p class="al-contentCommentText ev-videoAfter-content">'+kv.refUsername+': '+kv.reviewContent+'</p>';
							}
							return '<p class="al-contentCommentText ev-videoAfter-content">'+kv.reviewContent+'</p>';
						}
	            	}

	            	if(kv.resourceIsValid==1){
	            		if(kv.reviewContent== "该条评论已被作者删除"){
	            			return '<p class="al-contentCommentText ev-videoAfter-content" style="font-size:16px;color:#aaaaaa;">该条评论已被作者删除</p>';//'+kv.reviewContent+'
	            		}else{
							if(kv.tpl_Path==286||kv.reviewType==17){
								return '<p class="al-contentCommentText ev-videoAfter-content" srcHref="/pages/eBook/eBook_details.html?bId='+kv.bId+'&reviewId='+kv.id+'">'+kv.reviewContent+'</p>';
							}else{
								return '<p class="al-contentCommentText ev-videoAfter-content">'+kv.reviewContent+'</p>';
							}

	            		}
	            	}else if(kv.resourceIsValid!=1 && kv.refType==8){
	            		return '<p class="al-contentCommentText ev-videoAfter-content" style="font-size:16px;color:#aaaaaa;">该条评论已被作者删除</p>';
	            	}else if(kv.resourceIsValid!=1 && kv.refType!=8){

	            		//是否有效（0-无效;1-有效；2-系统屏蔽；3-用户删除)
	            		if(kv.resourceIsValid==3){
	            			return '<p class="al-contentCommentText ev-videoAfter-content" style="font-size:16px;color:#aaaaaa;">该'+_this.helpers.typeConvertWord(kv)+'已被作者删除</p>';
	            		}else{
	            			return '<p class="al-contentCommentText ev-videoAfter-content" style="font-size:16px;color:#aaaaaa;">该'+_this.helpers.typeConvertWord(kv)+'已被系统屏蔽</p>';
	            		}
	            	}else{
	            		return '';
	            	}
	            })(kv,this)+
	            (function(_this,kv){ //灰色父级区域
	            	if(kv.scene=="terminal"){ return '';}

	            	var temp= _this.reviewHandler(kv);
	            	if(temp!=''){
	            		return '<article class="al-contentMyComment">'+temp+'</article>';
	            	}
	            	return temp;
	            })(this,kv)+
			this.social(kv)+
	        '</section>'+
	   '</section>';
	},
	social: function(kv){
		var html='';
		if(kv.refType==8 || kv.scene!=""){
			switch(kv.reviewStatus){
			case 1:
				if(kv.tpl_Path==286||kv.reviewType==17){
					html='<article class="al-contentCommentOtherMsg ev-socialOper">'+
						(kv.opId==2?'':'<i class="ev-delete"><i class="al-commentDeleteBtn">删除</i></i>')+
                        '</article>';
				}else{
                    html= '<article class="al-contentCommentOtherMsg ev-socialOper">'+
                        (kv.opId==2?'':'<i class="ev-delete"><i class="al-commentDeleteBtn">删除</i></i>')+
                        '<a href="javascript:void(0)" class="al-coomentWatchBtn ev-viewDialog" style="display:none;">查看讨论</a>'+
                        '<span class="ev-review"><i class="al-commentBtn"></i><b>评论</b><i style="width:11px;'+(kv.reviewNum<=0?'display:none;':'')+'">'+kv.reviewNum+'</i></span>'+
                        '<span class="ev-prefer">'+
                        '<span vns-social-toggle-default><i class="al-likeBtn"></i>'+
                        '<i vns-social-toggle-total style="margin-left:5px;width: 0px;'+(kv.preferNum<=0?'display:none;':'')+'">'+kv.preferNum+'</i></span> '+
                        '<span vns-social-toggle-activation class="active"><i class="al-likeBtn"></i>'+
                        '<i vns-social-toggle-total style="margin-left:5px;width: 0px;'+(kv.preferNum<=0?'display:none;':'')+'">'+kv.preferNum+'</i></span>'+
                        '</span>'+
                        '<span class="ev-collection">'+
                        '<span vns-social-toggle-default><i class="al-collectBtn"></i>'+
                        '<i vns-social-toggle-total style="margin-left:5px;width: 0px;'+(kv.collectNum<=0?'display:none;':'')+'">'+kv.collectNum+'</i></span>'+
                        '<span vns-social-toggle-activation class="active"><i class="al-collectBtn"></i>'+
                        '<i vns-social-toggle-total style="margin-left:5px;width: 0px;'+(kv.collectNum<=0?'display:none;':'')+'">'+kv.collectNum+'</i></span>'+
                        '</span>'+
                        '<span class="ev-share"><i class="al-shareBtn"></i><b>分享</b></span>'+
                        '</article>';
				}

	            break;
			case 0:
			case 3:
			default:
				html= '';
			}
		}else{
	        switch(kv.resourceIsValid){
	            case 1:
                    if(kv.tpl_Path==286||kv.reviewType==17){
                        html='<article class="al-contentCommentOtherMsg ev-socialOper">'+
                            (kv.opId==2?'':'<i class="ev-delete"><i class="al-commentDeleteBtn">删除</i></i>')+
                            '</article>';
                    }else {
                        html = '<article class="al-contentCommentOtherMsg ev-socialOper">' +
                            (kv.opId==2?'':'<i class="ev-delete"><i class="al-commentDeleteBtn">删除</i></i>') +
                            '<a href="javascript:void(0)" class="al-coomentWatchBtn ev-viewDialog" style="display:none;">查看讨论</a>' +
                            '<span class="ev-review"><i class="al-commentBtn"></i><b>评论</b><i style="width:11px;' + (kv.reviewNum <= 0 ? 'display:none;' : '') + '">' + kv.reviewNum + '</i></span>' +
                            '<span class="ev-prefer">' +
                            '<span vns-social-toggle-default><i class="al-likeBtn"></i>' +
                            '<i vns-social-toggle-total style="margin-left:5px;width: 0px;' + (kv.preferNum <= 0 ? 'display:none;' : '') + '">' + kv.preferNum + '</i></span>' +
                            '<span vns-social-toggle-activation class="active"><i class="al-likeBtn"></i>' +
                            '<i vns-social-toggle-total style="margin-left:5px;width: 0px;' + (kv.preferNum <= 0 ? 'display:none;' : '') + '">' + kv.preferNum + '</i></span>' +
                            '</span>' +
                            '<span class="ev-collection">' +
                            '<span vns-social-toggle-default><i class="al-collectBtn"></i>' +
                            '<i vns-social-toggle-total style="margin-left:5px;width: 0px;' + (kv.collectNum <= 0 ? 'display:none;' : '') + '">' + kv.collectNum + '</i></span>' +
                            '<span vns-social-toggle-activation class="active"><i class="al-collectBtn"></i>' +
                            '<i vns-social-toggle-total style="margin-left:5px;width: 0px;' + (kv.collectNum <= 0 ? 'display:none;' : '') + '">' + kv.collectNum + '</i></span>' +
                            '</span>' +
                            '<span class="ev-share"><i class="al-shareBtn"></i><b>分享</b></span>' +
                            '</article>';
                    }
	                break;
	            case 0:
	            case 3:
	            default:
	                html= '';
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
    reviewHandlerTerminal: function(kv){//终端页父回复 形式|
		if(kv.scene=="terminal"){ //如果没有回复，获取引用,都不存在空
			kv.refName= this.convertVideoWord(kv.refName);
			if(kv.parentId != 0){
				return '<figure class="al-commentOthers">'+
	            	'<figcaption>'+
	            	kv.refUsername+'：'+
	            	'<span>'+this.helpers.isAngleQuotes(kv,kv.refName)+'</span>'+
	            	'</figcaption>'+
	        	'</figure>';
			}else{
				return '';
			}
		}
    },
	reviewHandler: function(kv){
		if(kv.opId==2)return '';
		if(kv.resourceIsValid !=1 && kv.scene==''){ return ''}
		kv.refName= this.convertVideoWord(kv.refName);
		var _s = this.helpers.youOrMe(kv.uid, kv.refCustomerId, kv);
		var _t = this.helpers.typeConvertWord(kv, kv.tpl_Path);
		var _n = this.helpers.isAngleQuotes(kv, kv.refName);
		var html= '';
		if(kv.ref && kv.ref.isValid==1){ //用于回复我的
			if(kv.parentId==0){
				if(kv.refName== '该条评论已被作者删除'){
					html= '<a href="javascript:;" style="font-size:16px;color:#aaaaaa;">该'+this.helpers.typeConvertWord(kv,kv.tpl_Path)+'已被作者删除</a>';
				}else{

					if(kv.tpl_Path==286||kv.reviewType==17){//'&reviewId='+kv.id+
						html = '<a target="_blank" href="/pages/eBook/eBook_details.html?bId='+kv.bId+'">' + (_s!=""?_s + _t + '：':"") + _n + '</a>';
					}else {
						html = '<a target="_blank" href="' + kv.refUrlPc + '">' + _s + _t + '：' + _n + '</a>';
					}
				}
			}else{
				if(kv.refName== '该条评论已被作者删除'){
					html= '<a href="javascript:;" style="font-size:16px;color:#aaaaaa;">该条评论已被作者删除</a>';
				}else {
					if (kv.tpl_Path == 286 || kv.reviewType == 17) {// '&reviewId=' + kv.id +
						html = '<a target="_blank" href="/pages/eBook/eBook_details.html?bId=' + kv.bId +'">' +(_s!=""?_s + _t + '：':"") + _n  + '</a>';
					} else {
						html = '<a target="_blank" href="' + kv.refUrlPc + '">' +  _s + _t + '：' + _n  + '</a>';
					}
				}
			}
		}else{ //用于动态 及消息评论我的/终端页回复列表
			if(kv.parentId==0){
				if(kv.resourceIsValid !=1){
					if(kv.messageId){ //消息时
						if(kv.refName.indexOf('被作者删除')>-1||kv.refName.indexOf('管理员屏蔽')>-1){
							html= '<a href="javascript:;" style="font-size:16px;color:#aaaaaa;">'+kv.refName+'</a>';
						}else{
							if(kv.tpl_Path==286||kv.reviewType==17){
								html = '<a target="_blank" href="/pages/eBook/eBook_details.html?bId='+kv.bId+'">' + (_s!=""?_s + _t + '：':"") + _n  + '</a>';
							}else {
								html= '<a target="_blank" href="javascript:;">'+this.helpers.youOrMe(kv.uid,kv.refCustomerId,kv)+this.helpers.typeConvertWord(parseInt(kv.reviewType),kv.tpl_Path)+'：'+this.helpers.isAngleQuotes(parseInt(kv.reviewType),kv.refName)+'</a>';
							}
						}
					}else{
						if(kv.refName.indexOf('被作者删除')>0){
							html= '<a href="javascript:;" style="font-size:16px;color:#aaaaaa;">该'+this.helpers.typeConvertWord(kv,kv.tpl_Path)+'已被作者删除</a>';
						}else{
							//html= '<a href="javascript:;">'+this.helpers.youOrMe(kv.uid,kv.refCustomerId,kv)+this.helpers.typeConvertWord(parseInt(kv.reviewType))+'：'+this.helpers.isAngleQuotes(parseInt(kv.reviewType),kv.refName)+'</a>';
							var desc='已被作者删除';
							if(kv.resourceIsValid !=3){
								desc= '已被系统屏蔽';
							}
							html= '<a href="javascript:;" style="font-size:16px;color:#aaaaaa;">该'+this.helpers.typeConvertWord(kv,kv.tpl_Path)+desc+'</a>';
						}
					}
				}else{
					if(kv.scene=='terminal'){
						html= ''; //如果是终端页，父id0不显示;
					}else{
						if(kv.tpl_Path==286||kv.reviewType==17){
							html = '<a target="_blank" href="/pages/eBook/eBook_details.html?bId='+kv.bId+'">' + (_s!=""?_s + _t + '：':"") + _n  + '</a>';
						}else {
							html = '<a target="_blank" href="' + (kv.refUrlPc?kv.refUrlPc:'javascript:;') + '">' + this.helpers.youOrMe(kv.uid, kv.refCustomerId, kv) + this.helpers.typeConvertWord(parseInt(kv.reviewType), kv.tpl_Path) + '：' + this.helpers.isAngleQuotes(parseInt(kv.reviewType), kv.refName) + '</a>';
						}
					}
				}
			}else{
				if(kv.refName== '该条评论已被作者删除' || kv.refName=='该评论已被作者删除'){
					html= '<a href="javascript:;" style="font-size:16px;color:#aaaaaa;">该条评论已被作者删除</a>';
				}else{
					if(kv.scene=='terminal'){
						html= '<a href="javascript:;">'+this.helpers.youOrMe(kv.uid,kv.refCustomerId,kv)+this.helpers.typeConvertWord(parseInt(kv.reviewType),kv.tpl_Path)+'：'+this.helpers.isAngleQuotes(kv,kv.refName)+'</a>';
					}else{
						if(location.pathname=== "/pages/message/message_main.html"){//消息评论我的
							if(kv.uid!=kv.refCustomerId){
								kv.reviewType=kv.refType;
								kv.refName=kv.reviewContent;
							}
							var _typeConvertWord = this.helpers.typeConvertWord(parseInt(kv.reviewType),kv.tpl_Path);
							html= '<a target="_blank" href="'+(kv.refUrlPc?kv.refUrlPc:'javascript:;')+'">'+this.helpers.youOrMe(kv.uid,kv.refCustomerId,kv)+_typeConvertWord+'：'+(_typeConvertWord=='评论'?"":"《")+kv.refName+(_typeConvertWord=='评论'?"":"》")+'</a>';
						}else {
							html = '<a target="_blank" href="' + (kv.refUrlPc?kv.refUrlPc:'javascript:;') + '">' + this.helpers.youOrMe(kv.uid, kv.refCustomerId, kv) + this.helpers.typeConvertWord(kv, kv.tpl_Path) + '：' + this.helpers.isAngleQuotes(kv, kv.refName) + '</a>';
						}
					}
				}
			}
		}
		return html;
	},
	//视频图片 引用组装
	videoPicQuote_Sub: function(tempHtml, data, scene){ //元素, 数据 视频图片引用处理  元素全部依赖上面的模板  结构不同采用scene表示: 1评论列表  非1为查看对话  默认为1
		if(data.resourceIsValid !=1 && data.scene==""){ return ''} //资源类 信息状态判定
		if(data.reviewStatus!=1 && data.scene != ""){ return '' } //评论类 信息状态判定

		if(!data.videoIsExist && !data.imgIsExist && !data.quoteIsExist){ return ''}

		if(!scene) scene=1;

		//只存在视频，不存在图片时 /视频部分 加在内容之后,目前只支持一个
		if(data.videoIsExist && !data.imgIsExist){
			if(scene === 1){
				tempHtml.find(".ev-videoAfter-content").after(module.list2Template.video(data));
			}else{
				tempHtml.find(".ev-videoAfter-content").parent().after(module.list2Template.video(data));
			}

			tempHtml.find('.ev-imgAfter-video').on('click',function(){ //视频播放
				if($(this).attr('data-videoSrc')){
					module.backgroundVideo({videoSrc:$(this).attr('data-videoSrc')});
				}
			});
		}

		//只存在图片不存在视频时 /图片部分 加在视频之后
		if(!data.videoIsExist && data.imgIsExist){
			var imgsLen= data.imgsArr.length;
			tempHtml.find('.ev-videoAfter-content').after(module.list2Template.reviewImgWrap(data));

			if(imgsLen>1 && imgsLen !=3){
				for(var x=0; x<imgsLen;x++ ){ //子集里的区别只有图 attUrl
					if(x==3 && imgsLen>4){ //更多
						tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewImgMore(data.imgsArr[x]));
						break;
					}else{
						tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewImg(data.imgsArr[x]));
					};
				}

				$(tempHtml.find(".viewBigImgDemo").children()[2]).css('margin-top','5px');
				$(tempHtml.find(".viewBigImgDemo").children()[3]).css('margin-top','5px');
			}else if(imgsLen==3){
				tempHtml.find('.al-contentImagePart').removeClass('al-contentImagePart');
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewOneImg(data.imgsArr[0]));
				$(tempHtml.find(".viewBigImgDemo").children()[0]).css('float','left');

				tempHtml.find('.ev-reviewImgWrap')
						.append(module.list2Template.reviewImg(data.imgsArr[1]));
				tempHtml.find('.ev-reviewImgWrap')
						.append(module.list2Template.reviewImg(data.imgsArr[2]));

				$(tempHtml.find('.viewBigImgDemo figure')[0]).removeClass('al-commentVideoItem').removeAttr('style').css({'float':'left'}).find('img').css({'height':'218px','width':'327px'});
				$(tempHtml.find('.viewBigImgDemo figure')[1])
						  .removeClass('al-contentImgBox').removeAttr('style')
						  .css({'float':'left'}).find('img')
						  .css({'height':'106px','width':'160px','padding-left':'5px'});
				$(tempHtml.find('.viewBigImgDemo figure')[2])
						  .removeClass('al-contentImgBox').removeAttr('style')
						  .find('img')
						  .css({'height':'106px','width':'160px','padding-left':'5px','margin-top':'4px'});
			}else if(imgsLen==1){
				tempHtml.find('.al-contentImagePart').removeClass('al-contentImagePart');
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewOneImg(data.imgsArr[0]));
			}

			tempHtml.find('.viewBigImgDemo figure').on('click',function(){
				module.viewBigImgAll({
					container: $(this).parent(),
					index:$(this).index()
				});
			});
		}

		//当存在视频及图片时
		if(data.videoIsExist && data.imgIsExist){
			var imgsLen= data.imgsArr.length;
			switch(imgsLen){
			case 1:
				tempHtml.find('.ev-videoAfter-content').after(module.list2Template.reviewImgWrap(data));
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.videoExistImgs(data));
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewImg(data.imgsArr[0]));
				break;
			case 2:
				tempHtml.find(".ev-videoAfter-content").after(module.list2Template.video(data));
				tempHtml.find('.ev-imgAfter-video').append(module.list2Template.reviewImgWrap(data));
				tempHtml.find('.al-commentVideoItem').css('float','left');

				for(var x=0; x<imgsLen;x++ ){ //子集里的区别只有图 attUrl
					tempHtml.find('.ev-reviewImgWrap')
							.append(module.list2Template.reviewImg(data.imgsArr[x]))
							.addClass('show_three')
							.css({'margin-top':'0px','padding-left':'5px'});
				}

				$(tempHtml.find('.show_three').children()[0]).css({'height':'106px','width':'160px'});
				$(tempHtml.find('.show_three').children()[1]).css({'height':'106px','width':'160px','margin-top':'5px'});
				break;
			case 3:
				tempHtml.find('.ev-videoAfter-content').after(module.list2Template.reviewImgWrap(data));
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.videoExistImgs(data)).css({'width':'500px'});
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewImg(data.imgsArr[0]));
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewImg(data.imgsArr[1]));
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewImg(data.imgsArr[2]));

				$(tempHtml.find('.ev-reviewImgWrap').children()[2]).css({'margin-top':'4px'});
				$(tempHtml.find('.ev-reviewImgWrap').children()[3]).css({'margin-top':'4px'});
				break;
			default: //多张时
				tempHtml.find('.ev-videoAfter-content').after(module.list2Template.reviewImgWrap(data));
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.videoExistImgs(data)).css({'width':'500px'});
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewImg(data.imgsArr[0]));
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewImg(data.imgsArr[1]));
				tempHtml.find('.ev-reviewImgWrap').append(module.list2Template.reviewImgMore(data.imgsArr[2]));

				$(tempHtml.find('.ev-reviewImgWrap').children()[2]).css({'margin-top':'4px'});
				$(tempHtml.find('.ev-reviewImgWrap').children()[3]).css({'margin-top':'4px'});
			}

			//图片
			tempHtml.find('.viewBigImgDemo>figure').on('click',function(){
				if($(this).parent().hasClass('show_three')){//防止1视2图时结构
					module.viewBigImgAll({container: $(this).parent(), index: $(this).index()});
				}else{
					module.viewBigImgAll({container: $(this).parent(), index: $(this).index()-1});
				}
				return false;
			});

			//视频
			tempHtml.find('.ev-imgAfter-video').on('click',function(e){ //视频播放
				var r=/img05/g; //防止1视2图时结构
				if(!r.test(e.target.src) && $(this).attr('data-videoSrc')){
					module.backgroundVideo({videoSrc:$(this).attr('data-videoSrc')});
				}
			});
		}

		//引用部分 虽然是个数组，目前只支持一个
		if(data.quoteIsExist&&data.refQuoteName){
			var findEle= '';
			if(tempHtml.find('.ev-reviewImgWrap').length !==0){
				findEle= '.ev-reviewImgWrap';
			}else if(tempHtml.find('.ev-reviewImgWrap').length ===0){
				if(tempHtml.find('.ev-imgAfter-video').length !== 0){
					findEle= '.ev-imgAfter-video';
				}else{
					findEle= '.ev-videoAfter-content';
				}
			}

			tempHtml.find(findEle).after(module.list2Template.quote(data));
		}
		//tempHtml.find('.ev-videoAfter-content').expandShrink({len:250}); //内容字数
	},
	socialSuite_bindEvents: function(tempHtml, data, callback, type){
		if(data.resourceIsValid !=1 && data.reviewStatus==undefined){ return ''} //只针对资源 为无效时
		if(data.reviewStatus!=1 && data.refType==8){ return ''} //只针对回复 为无效时

		if(!type) type= 8;

		if(data.parentId !==0 ){
			socialViewDialog({
				reviewId: data.id,
				refId: data.refId,
				$dialogEle: tempHtml.find('.ev-viewDialog')
			});

			tempHtml.find('.ev-viewDialog').show();
		}

		tempHtml.find(".ev-videoAfter-content").expandShrink({len:124});

		tempHtml.find(".ev-review").on('click',function(){
			user.login({
				callback: function () {
					if(tempHtml.find('form').length===0){
						module.reviewBox({
							context: tempHtml,
							reviewId: data.id,
							refId: data.refId,
							reviewUsername: tempHtml.find(".ev-reviewUsername").text(),
							type: data.reviewType,
							callback:function () {  // 评论成功回调 刷新
								window.location.reload();
							}
						});
					}else{
						tempHtml.find('form').show();
					}
				},
				scene: privilegeSceneConst.eSceneTypeReview
			});

		});

		var WXTitle,WXContent, SinaTitle, SinaContent, QQTitle, QQContent;
		function getTypeDesc(refType,tplPath){
            var refTypeDesc= ''; //类型描述
            switch(parseInt(refType)){
                case 1: refTypeDesc="视频"; break;
                case 2:
					if(tplPath==286){
						refTypeDesc="书籍";
					}else{
						refTypeDesc="文库";
					}
					 break;
                case 4: refTypeDesc="话题"; break;
                case 7: refTypeDesc="病例"; break;
                case 8: refTypeDesc="评论"; break;
                case 16: refTypeDesc="活动"; break;
                default: refTypeDesc="活动";
            }
            return refTypeDesc;
        }
		var refType= parseInt(data.refType);
		if(isNaN(refType) && data.scene != '') { refType=8; } //在场景回复中未加入refType=8的值

		data.reviewContent= data.reviewContent.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "");
		switch(refType){ //发布1247 未用微信
         case 8:
             if(data.parentId==0){ //回复发布
                 QQTitle= "["+data.username+"]回复《"+data.refName+"》";
                 QQContent= data.reviewContent;
                 WXTitle = "["+data.username+"]回复了["+getTypeDesc(data.reviewType,data.tpl_Path)+"]《"+data.refName+"》";
                 WXContent = data.reviewContent;
                 SinaTitle= "["+data.username+"]回复了["+getTypeDesc(data.reviewType,data.tpl_Path)+"]《"+data.refName+"》，点击链接查看详情：";
                 SinaContent= "["+data.username+"]回复了["+getTypeDesc(data.reviewType,data.tpl_Path)+"]《"+data.refName+"》，点击链接查看详情：";
             }else{ //回复评论
                 QQTitle= "["+data.username+"]回复["+data.refUsername+"]";
                 QQContent= data.reviewContent;
                 WXTitle = "["+data.username+"]回复["+data.refUsername+"]"+data.reviewContent;
                 WXContent = '';
                 SinaTitle= "["+data.username+"]回复["+data.refUsername+"]"+data.reviewContent+'，点击链接查看详情：';
                 SinaContent= "["+data.username+"]回复["+data.refUsername+"]"+data.reviewContent+'，点击链接查看详情：';
             }
             break; //parentId 0 [回复者姓名]回复了[资源类型]《title》 parentId !=0 [回复者姓名]回复[原回复作者]"回复内容"
         default:
		}

		module.share({
			container:tempHtml.find(".ev-share"),//存放分享组件的父级
	        type:data.onlyAllinCircle?4:1,//默认为1  1：社交分享  2：页面左下角全站分享,3.终端页面的固定分享,4.终端评论,消息分享
	        url:data.refUrlPc,//分享链接， 默认取当前页链接
	        title:QQTitle,//分享标题
	        shareTrend:1,//0:不需要站内动态分享  1：需要站内动态分享
	        trendUrl:PC_CALL+"reprint/create/",//分享到站内动态的接口
	        data:{customerId: data.customerId, reprintType: refType, refId: data.id},//分享到站内动态的接口参数
	        callback:function(){},//分享到站内动态成功后回调函数
	        pic:data.refLogoUrl,//分享图片
	        sinaTitle:SinaTitle,//新浪分享标题     不传的话取上面传的title值
	        sinaSummary:SinaContent,//新浪分享描述
	        qqTitle:QQTitle,//qq好友分享标题     不传的话取上面传的title值
	        qqSummary:QQContent,//qq好友分享描述
	        qqZoneTitle:QQTitle,//qq空间分享标题  不传的话取上面传的title值
	        qqZoneSummary:QQContent//qq空间分享描述
	    });


		function socialShowHideNum(tempHtml){
			var vstt_Arr= tempHtml.find('[vns-social-toggle-total]');
			for(var x=0;x<vstt_Arr.length;x++){
				if(tempHtml.find(vstt_Arr[x]).text()>0){
					tempHtml.find(vstt_Arr[x]).show();
				}else{
					tempHtml.find(vstt_Arr[x]).hide();
				}
			}
		}
		//if($('#sesAuth').val()==1||$('#sesAuth').val()==2){//认证权限
			tempHtml.find('.ev-prefer').VNS_SocialToggle({
				$UI_Obj: {},
				AJAX_Obj_Params: {
					create: {
						refId:data.id,
						refCustomerId:data.refCustomerId,
						usefulType:type,
						upDownType:1
					},
					cancel: {
						refId:data.id,
						refCustomerId:data.refCustomerId,
						usefulType:type,
						upDownType:0
					}
				},
				Action_State: data.preferState,
				Action_Type: 'prefer',
				AJAX_Obj_Callback: {
					create: {
						success: function(){
							socialShowHideNum(tempHtml);
							//事件埋点
							comm.creatEvent({
								triggerType:"点赞",
								keyword:data.customerId,
								actionId:75
							});
						}
					},
					cancel: {
						success: function(){
							socialShowHideNum(tempHtml);
						}
					}
				}
			});
			tempHtml.find('.ev-collection').VNS_SocialToggle({
				$UI_Obj: {},
				AJAX_Obj_Params: {
					create: {
						trendsId: data.trendsId,
						refId:data.id,
						refCustomerId:data.refCustomerId,
						usefulType:undefined,
						collectionType: type
					},
					cancel: {
						trendsId: data.trendsId,
						refId:data.id,
						refCustomerId:data.refCustomerId,
						usefulType:undefined,
						collectionType: type
					}
				},
				Action_State: data.collectState,
				Action_Type: 'collection',
				AJAX_Obj_Callback: {
					create: {
						success: function(){
							socialShowHideNum(tempHtml);
						}
					},
					cancel: {
						success: function(){
							socialShowHideNum(tempHtml);
						}
					}
				}
			});
		//}else{
		//	tempHtml.find('.ev-prefer').on('click',function(){
		//		user.login({
		//			scene: privilegeSceneConst.eSceneTypeCollect,
		//			callback:function(){}
		//		})
		//	});
		//	tempHtml.find('.ev-collection').on('click',function(){
		//		user.login({
		//			scene: privilegeSceneConst.eSceneTypeCollect,
		//			callback:function(){}
		//		})
		//	});
		//}


		//
		if( (data.scene != 'terminal' && data.isSelf)){
			tempHtml.find('.ev-delete').VNS_SocialDelete({
				$UI_Obj:{},
				AJAX_Obj_Params: {id:data.id},
				Action_Type: type,
				Oper_Boo_Mouse: {
					state: true,
					ele:tempHtml
				},
				AJAX_Obj_Callback: {
					success: function(){
						callback.Delete && callback.Delete();
					}
				}
				,makeSurePopup:true			//新增删除评论确认弹层
			});
		}else if( data.scene == 'terminal' && data.customerId== $("#sesCustomerId").val()){ //终端页删除只移除自身
			tempHtml.find('.ev-delete').VNS_SocialDelete({
				$UI_Obj:{},
				AJAX_Obj_Params: {id:data.id},
				Action_Type: type,
				Oper_Boo_Mouse: {
					state: true,
					ele:tempHtml
				},
				AJAX_Obj_Callback: {
					success: function(){
						if(tempHtml.parent().children().length ==1){
							tempHtml.parent().html(module.list2Template.detailNullData());
						}else{
							tempHtml.remove();
						}
					}
				}
				,makeSurePopup:true			//新增删除评论确认弹层
			});
		}else{
			tempHtml.find('.ev-delete').hide();
		}
	},
	helpers: {
		typeConvertWord: function(type,tpl_Path){ //kv
			if(typeof type != "number"){
				if(type.parentId==0){
					type= parseInt(type.reviewType);
				}else{
					type= 8;
				}
			}
			var word= '';
			switch(type){
			case 1: word= '视频'; break;
			case 2:
				if(tpl_Path==286){
					word= '书籍';
				}else if(tpl_Path==287){
					word= '文章';
				}else{
					word= '文库';
				}

				break;
			case 4: word= '话题'; break;
			case 7: word= '病例'; break;
			case 8: word= '评论'; break;
			case 17:word = "书籍";break;
			case 18:word ='文章';break;
			case 19:word ="电子书视频";break;
			default:
			}
			return word;
		},
		youOrMe: function(uid,cid,kv){
			var desc= '';
			if(uid==cid){desc= '我的';}else {
				desc= comm.getStrLen(kv.refUsername,24)+'的'}
			if(location.pathname=== "/pages/message/message_main.html"){ //消息场景中全是我的
				desc= '我的';
			}
			if(desc=='的')desc="";//如果refUserName=''
			if(kv.tpl_Path==286&&kv.refUsername=="唯医小编")desc="";
			return desc;
		},
		isAngleQuotes: function(type,refName){
			if(typeof type != "number"){
				if(type.parentId==0){
					type= parseInt(type.reviewType);
				}else{
					type= 8;
				}
			}
			var word= '';
			switch(type){
			case 1:
			case 2:
			case 4:
			case 7: word= '《'+refName+'》'; break;
			case 8: word= $("<p>"+refName+"</p>").text(); break;
			default: word= $("<p>"+refName+"</p>").text();
			}
			return word;
		}
	}


};
