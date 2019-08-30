/**
 * 功能描述：关注
 * 使用方法：$("el").follow({fId:"关注人ID",fStatus:"关系状态"});
 * 				  必要参数：obj.fid //关注人id
 * 								obj.fStatus //与关注人的关注关系
 * 
 * 				   可选参数 : obj.el 存放需要计数的元素
* 							obj.picStyle 图片样式显示风格
 * 							obj.canToggle 是否可以直接再次点击取消关注【默认可以】
 *                              
 * 注意事件：
 * 引入来源：权限控制 user.login({})
 * 
 * Created by QiaoLiang on 2014.
 */

;(function($){
	$.fn.extend({
		"follow" :  function(options){
			var _this = this;
            var f = $.extend({
				//个人首页 fn 
				fn : null,
				//存放关注计数元素
				el : null,
				//组件存放位置
				followPlace : null,
				//执行某个事件 例个人首页，用于点击关注同时刷新关注时，调用外部刷新事件 outEvElName 为元素事件名称
				outEvElName : null,
					//及需要触发的事件
					outEv : null,
				//关注状态 
				fStatus : 1,		//relationship 1 未关注，2 已关注 3 粉丝 4 相互关注
				//样式
				classStyle : "",
				//是否认证
				isValid : true,
				//关注地址
				createURL : PC_CALL+"customer/follow_people/create/",
				//取消关注地址
				cancelURL : PC_CALL+"customer/follow_people/delete/",
				//发送方式
				type : "post",
				//被关注人id
				fId : 0, 
				//图片样式 1 名片 2 主页与首页场景 3组织 4新版粉丝关注赞 6新版他人主页的关注状态,7推荐专家
				picStyle : 1,
				//可以原地点击取消
				canToggle:true,
				needSure:0,//需要确认弹窗
				name:"",//用户名
                fansRelationship:""//全部粉丝判断

			},options);
			//
			var p = {};
			p = {
				el : f.el,
				fId : f.fId,
				cId : f.cId,
				fStatus : f.fStatus,
				fn : f.fn,
				evEl : f.outEvElName,
				ev : f.outEv,
				isValid : f.isValid,
				
				//状态
				add : "add",
				reAdd : "reAdd",
				remove : "remove",
				rtsp : "rtsp",
                fansRelationship:f.fansRelationship
			};

			var m = {};
			m = {
				init : function(){
					var t = this;
					var arrPicSrc = t.picStyle();
					//choose template
					switch(parseInt(p.fStatus)){
						case 1:
							template = t.template(arrPicSrc.addPic,p.add);
							break;
						case 2:
							template = t.template(arrPicSrc.reAddPic,p.reAdd);
							break;
						case 3:
							template = t.template(arrPicSrc.addPic,p.add);
							break;
						case 4:
							template = t.template(arrPicSrc.rtspPic,p.rtsp);
							break;
						default:
							template = t.template(arrPicSrc.addPic,p.add);
					}
					
					var fp = null;
					if(f.followPlace===null){
						fp = _this;
					}else{
						fp = _this.find(f.followPlace);
					}
					var _followDom = fp.append(template).find("span:last");
					_followDom.on("click",function(e){
						e.stopPropagation();
						if(($(this).attr('data-stat')=='reAdd'||$(this).attr('data-stat')=='rtsp')&& f.canToggle==false){	//如果不可取消关注，并且是已关注或相互关注状态，return false
							return false;
						}else{
							var iThis = $(this);
							user.login({
								callback:function(){
									if(p.el === null){
										t.elNull(iThis ,t,arrPicSrc,p.fansRelationship?"4":p.fStatus);
									}else{
										t.elNotNull(iThis ,t,arrPicSrc,p.el,p.fansRelationship?"4":p.fStatus);
										particularPage.customer();
									}
									if($('.al-index-mesMainR').length){//&&$('.al-index-mesMainR').is(':hidden')
										f.indexLogined&& f.indexLogined();//首页登录后回调
									}
								},
								scene:privilegeSceneConst.eSceneTypeAttention,
								p:p,
								t:t,
								particularPage:particularPage,
								iThis:iThis,
								onAuthCancel:function(){
									f.indexLogined&& f.indexLogined();//首页登录后回调
								},
								privCheckFailed:function() {

								},
								onClose:function(){
									f.indexOnClose&& f.indexOnClose();//首页取消登录回调
								}
							});
						}
					});
					if(f.canToggle===true){	//可以原位置取消加划过事件
						_followDom.hover(function(){
							t.hoverPic($(this),p.reAdd,p.remove,arrPicSrc.removePic,p.rtsp,p.remove,arrPicSrc.removePic);
						},function(){
							t.hoverPic($(this),p.remove,p.reAdd,arrPicSrc.reAddPic,p.remove,p.rtsp,arrPicSrc.rtspPic);
						});
					}

				},
				template : function(picSrc,status){
					return "<span class='"+f.classStyle+"' style='cursor:pointer;' data-stat='"+status+"' data-refid='"+
					p.fId+"'><img src='"+picSrc+"'></span>";
				},
				ajaxSend : function(url,fId,cBack,failBack){
					var params = {
                        refId : fId,
                        dataFlag : 2
					};
                    if (location.href.indexOf("organization")>-1&&(f.picStyle==2||f.picStyle==3)){//判断组织的关注
                        params.followType=2;
					}
					$.ajax({
						url : url,
						type : f.type,
						data : {paramJson:$.toJSON(params)},
						success:function (res) {
							if(res&&res.responseObject.responseStatus){//关注状态返回成功
								cBack&&cBack();
							}else{
                                failBack&&failBack();
							}
                        }
					});
				},
				togglePic : function(el,stat,picSrc){
					el.attr("data-stat",stat);
					el.find("img").attr("src",picSrc);
				},
				hoverPic : function(_this,rA,rm,picSrc,rtsp,rm2,otherPicsrc){
					var dataStat = _this.attr("data-stat");
					if(dataStat==rA && p.fStatus!=4){
						_this.attr("data-stat",rm);
						_this.find("img").attr("src",picSrc);
					}
					if((dataStat==rtsp && p.fStatus==4) || (dataStat==rA && p.fStatus==4) || (dataStat==rtsp && p.fStatus==3)){
						_this.attr("data-stat",rm2);
						_this.find("img").attr("src",otherPicsrc);
					}
				},
				elNull : function(_this,t,arrPicSrc,fStatus){
					var dataStat = _this.attr("data-stat");
					if(dataStat==p.remove || dataStat==p.reAdd){
						if(f.canToggle===true){
							if(f.needSure){//需要确认弹窗
								$.makeSurePopup({
									  title:"取消关注",//弹窗标题
									  content01:"确定取消对"+ f.name +"的关注吗？",//弹窗内容字体会加粗 (可不传)
									  content:"将不能及时收到Ta的动态更新",//弹窗内容f.name
									  //url:"",//ajax请求接口（可不传，不传就不发请求）
									  //param:"",//ajax请求参数(可不传)
									  //toJSON:1,//传参是否为paramJSPN 0或1，默认为1
									  callback:function(){
										  comm.LightBox.hideloading();
										  t.ajaxSend(f.cancelURL,p.fId);
										  t.togglePic(_this,p.add,arrPicSrc.addPic);
										  //事件埋点
										  comm.creatEvent({
											  triggerType:"取消关注",
											  pushMessageId:p.fId,
											  actionId:69
										  });
									  },//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
									  error:function(){}//ajax请求失败后执行的方法(可不传)
							    });
							}else{
								t.ajaxSend(f.cancelURL,p.fId);
								t.togglePic(_this,p.add,arrPicSrc.addPic);
							}

						}
					}else if(dataStat==p.add){
						if(fStatus==3 || fStatus==4){
							t.ajaxSend(f.createURL,p.fId);
							t.togglePic(_this,p.rtsp,arrPicSrc.rtspPic);
						}else{
							if(p.fId==$('#sesCustomerId').val()){
								_this.parents('.al-doctorRecommend').find('a').attr('href','/pages/personal/personal_contribution.html?cid='+ p.fId);
								_this.remove();
							}else{
								//判断组织页面的关注成功再进行替换
								if (location.href.indexOf("organization")>-1){
									var cBack=function(){
                                        t.togglePic(_this,p.reAdd,arrPicSrc.reAddPic);
									};
									var failBack=function(){
                                        comm.surePop({
                                            icon:0, //需要图标吗
                                            title:'关注失败，请刷新后重试！'
                                        });
									};
                                    t.ajaxSend(f.createURL,p.fId,cBack,failBack);
								}else{
                                    t.ajaxSend(f.createURL,p.fId);
                                    t.togglePic(_this,p.reAdd,arrPicSrc.reAddPic);
								}

							}
						}
						//事件埋点
						comm.creatEvent({
							triggerType:"关注",
							pushMessageId:p.fId,
							actionId:4
						});
					}
				},
				elNotNull : function(_this,t,arrPicSrc,numEl,fStatus){
					var dataStat = _this.attr("data-stat");
					if(dataStat==p.remove || dataStat==p.reAdd){
						if(parseInt(numEl.text())>0&& f.canToggle===true){
							numEl.html(parseInt(numEl.text())-1);
							t.ajaxSend(f.cancelURL,p.fId);
							t.togglePic(_this,p.add,arrPicSrc.addPic);
						}
					}else if(dataStat==p.add){
						if(fStatus==3 || fStatus==4){
							numEl.html(parseInt(numEl.text())+1);
							t.ajaxSend(f.createURL,p.fId);
							t.togglePic(_this,p.reAdd,arrPicSrc.rtspPic);
						}else{
							numEl.html(parseInt(numEl.text())+1);
							t.ajaxSend(f.createURL,p.fId);
							t.togglePic(_this,p.reAdd,arrPicSrc.reAddPic);
						}
					}
				},
				picStyle : function(){
					switch(f.picStyle){
					case 2 :
						picSrc = {
							addPic : "//plugins.allinmd.cn/follow/image/add_110.png",
							reAddPic : "//plugins.allinmd.cn/follow/image/ygz_110.png",
							removePic : "//plugins.allinmd.cn/follow/image/qx_110.png",
							rtspPic : "//plugins.allinmd.cn/follow/image/xh_110.png"
						};
						break;
					case 3:
						picSrc = {
							addPic : "//plugins.allinmd.cn/follow/image/add_88.png",
							reAddPic : "//plugins.allinmd.cn/follow/image/ygz_88.png",
							removePic : "//plugins.allinmd.cn/follow/image/qx_88.png"
							//rtspPic : ""
							};
						break;
					case 4://新版粉丝，关注，赞
						picSrc = {
							addPic : "//img10.allinmd.cn/v3/common/followBtn/docList_followBtn.png",
							reAddPic : "//img10.allinmd.cn/v3/common/followBtn/docList_followedBtn.png",
							removePic : "//img10.allinmd.cn/v3/common/followBtn/docList_followedBtn.png",
							rtspPic : "//img10.allinmd.cn/v3/common/followBtn/docList_eachFollowBtn.png"
						};
						break;
					case 5://可能认识的人
						picSrc = {
							addPic : "//plugins.allinmd.cn/follow/image/follow_btn_66.png",
							reAddPic : "//plugins.allinmd.cn/follow/image/followed_btn_66.png",
							removePic : "",
							rtspPic : "//plugins.allinmd.cn/follow/image/double_followed_66.png"
						};
						break;
					case 6://新版他人主页的关注状态
						picSrc = {
							addPic : "//img10.allinmd.cn/v3/common/followBtn/index_follow.png",
							reAddPic : "//img10.allinmd.cn/v3/common/followBtn/index_followed.png",
							removePic : "//img10.allinmd.cn/v3/common/followBtn/index_followed.png",
							rtspPic : "//img10.allinmd.cn/v3/common/followBtn/index_eachFollow.png"
						};
						break;
					case 7://新版无粉丝，无关注，无赞（推荐专家）
							picSrc = {
								addPic : "//img10.allinmd.cn/v3/common/followBtn/doctorRecommend_follow.png",
								reAddPic : "//img10.allinmd.cn/v3/common/followBtn/doctorRecommend_followed.png",
								removePic : "//img10.allinmd.cn/v3/common/followBtn/doctorRecommend_followed.png",
								rtspPic : "//img10.allinmd.cn/v3/common/followBtn/doctorRecommend_eachFollow.png"
							};
							break;
					case 8://搜索结果页 全部里的医师
							picSrc = {
								addPic : "//img10.allinmd.cn/v3/common/followBtn/search_followBtn.png",
								reAddPic : "//img10.allinmd.cn/v3/common/followBtn/search_followedBtn.png",
								removePic : "//img10.allinmd.cn/v3/common/followBtn/search_followedBtn.png",
								rtspPic : "//img10.allinmd.cn/v3/common/followBtn/search_eachFollowBtn.png"
							};
							break;
					default :
						picSrc = {
							addPic : "//plugins.allinmd.cn/follow/image/add_86.png",
							reAddPic : "//plugins.allinmd.cn/follow/image/ygz_86.png",
							removePic : "//plugins.allinmd.cn/follow/image/qx_86.png",
							rtspPic : "//plugins.allinmd.cn/follow/image/xh_86.png"
						};
					}
					return picSrc;
				}
			};
			
			//特殊页面调用
			var particularPage = {};
			particularPage = {
					customer : function(){
						//调用进度条
						if(p.fn !== null){
							p.fn();
						}
						//调用局部刷新关注
//						if(p.evEl != null && p.ev != null){
//							$(p.evEl).trigger(p.ev);
//						};
					}
			};

			m.init();
			
			return _this;
		},
		followTag:function(opt){//新增关注标签方法
			var _t = this;
			var _o = $.extend({
				createUrl:PC_CALL+'customer/follow_resource/createFollowResource/',
				deleteUrl:PC_CALL+"customer/follow_resource/delete3/"
			},opt);
			var ctrl = {
				init:function(){
					var t=this;
					t.checkLogin();
				},
				checkLogin:function(){
					var t=this;
					_t.on('click',function(e){
						user.login({
							callback:function(){
								t.addFollow();
							},
							scene:privilegeSceneConst.eSceneTypeAttention
						});
						e.preventDefault();
						return false;
					});
				},
				addFollow:function(){
					var t=this;
					if(_o.canToggle==true){	//如果可以取消关注
						if(_t.attr('isFollow')==0){		//isFollow==0，未关注
							t.createFollow();
						}else{		//点击取消关注
							if(_o.needSure){
								$.makeSurePopup({
									title:"取消关注",//弹窗标题
									content01:"确定取消关注吗？",//弹窗内容字体会加粗 (可不传)
									content:"将不再推荐此标签的相关资源",//弹窗内容f.name
									//url:"",//ajax请求接口（可不传，不传就不发请求）
									//param:"",//ajax请求参数(可不传)
									//toJSON:1,//传参是否为paramJSPN 0或1，默认为1
									callback:function(){
										t.deleteFollow();
									},//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
									error:function(){}//ajax请求失败后执行的方法(可不传)
								});
							}else{
								t.deleteFollow();
							}
						}
					}else{//不能原地取消关注，
						if(_t.attr('isFollow')==0){
							t.createFollow();
						}
					}
				},
				createFollow:function(){
					var t=this;
					var param = {
						refId:_o.refId?_o.refId:_t.attr('tagId'),
						refName:_o.refName?_o.refName:_t.attr('tagName'),
						customerId:$('#sesCustomerId').val(),
						followType:_o.followType
					};
					$.ajax({
					    url: _o.createUrl,
					    type:"post",
					    data:{paramJson: $.toJSON(param)},
					    dataType:'json',
						success:function(d){
							if(d&& d.responseObject.responseStatus){
								_t.attr('isFollow',1);
								_t.addClass('followedBtn').removeClass('followBtn');
								_o.addSuc&&_o.addSuc();
							}
						}
					});
					//事件埋点
					comm.creatEvent({
						triggerType:"关注",
						pushMessageId:param.refId,
						actionId:7
					});
				},
				deleteFollow:function(){
					var t=this;
					var param = {
						refId:_o.refId?_o.refId:_t.attr('tagId'),
						customerId:$('#sesCustomerId').val(),
						followType:_o.followType
					};
					$.ajax({
						url: _o.deleteUrl,
						type:"post",
						data:{paramJson: $.toJSON(param)},
						dataType:'json',
						success:function(d){
							if(d&& d.responseObject.responseStatus){
								_t.attr('isFollow',0);
								_t.addClass('followBtn').removeClass('followedBtn');
								_o.delSuc&&_o.delSuc();
							}
						}
					});
					//事件埋点
					comm.creatEvent({
						triggerType:"取消关注",
						pushMessageId:param.refId,
						actionId:69
					});
				}
			};
			ctrl.init();
			return _t;
		}
	});
})(jQuery);
