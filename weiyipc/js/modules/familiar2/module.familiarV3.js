/**
 * 功能描述：您可能认识的人
 * 使用方法：module.familiar(obj);
 *                  必要参数：obj.container  列表容器
 *                  			  obj.toggleData 切换数据
 *                  				obj.uid 当前人id
 *
 * 注意事件：
 * 引入来源：无
 *
 * Created by QiaoLiang on 2015-03-30.
 */

module.familiarV3 = function(obj){
var controller = {
		config : {
			pageSize : 5
		},
		path : {
			list : PC_CALL+"customer/recommendCustomerFirst/json_list/", //可能认识的人列表及追加一条关注数据
			createFollow : PC_CALL+"customer/follow_people/create/", //创建关注
		},
		picStyle : {
			follow: "//modules.allinmd.cn/familiar/images/ygz_but.png",
			mutual : "//modules.allinmd.cn/familiar/images/xhgz_but.png"
		},
		el : {},
		template : {
			list : function(dataJson){
				var t = controller;
				var html = "",kv = {};
				for(var i=0;i<dataJson.length;i++){
					kv = t.comm.adapter(dataJson[i]);
					html+= '<div class="al-discover_knowZj">'+
	                    '<a href="'+kv.usernameUrl+'" class=""><img src="'+kv.logoUrl+'" /></a>'+
	                    '<figure class="al-discover_ZjDetail">'+
	                        '<a href="'+kv.usernameUrl+'" class="active">'+kv.nickname+'</a>'+
	                        '<p>'+kv.medicalTitle+
	                        	'<i class="followEvent cursor" data-cid="'+kv.customerId+'" data-relationship="'+kv.relationship+'"><img src="//img10.allinmd.cn/v3/friends/friends_follow.png" alt=""></i>'+
	                        '</p>'+
	                        '<p>'+kv.company+'</p>'+
	                    '</figure>'+
                    '</div>';
				}
				return html; 
			}
		},
		opts : {
			changeVal : 0,
			count : 0,
			uid: 0
		},
		init : function(obj){//初始化 
			var t = this;
			$.extend(t.opts,obj);
			var params = {};
			
			params.paramJson = $.toJSON({
				dataFlag: 2,
				customerId:t.opts.uid,
				firstResult : t.opts.changeVal,
				maxResult : t.config.pageSize
			});
			
			//改变取值位置
			t.opts.changeVal = t.opts.changeVal+t.config.pageSize;
			
			t.comm.ajaxSend(t.path.list,params,t.dataCtrl);
			
		},
		dataCtrl : function(data,action){ //action区分是重新排列还是追加
			var t = controller;
			var html = t.template.list(data);
			if(action==="reset") $(t.opts.container).html(html);
				else $(t.opts.container).append(html);
			
			//关系 (1-未关注，2-已关注，3-粉丝，4-相互关注)
			$(".followEvent").on("click",function(){
				var t = controller;
				var _this = this;
//				user.login({
//					callback:function(){ 
						if(parseInt($(_this).attr("data-relationship"))===3){
							$("img",_this).attr("src",t.picStyle.mutual);
						}else{
							$("img",_this).attr("src",t.picStyle.follow);
						}
						
						t.tempSaveEl = $(_this).parents("li");
						
						//发送关注请求
						t.comm.onlyAjax(t.path.createFollow, {paramJson:$.toJSON({dataFlag:2,refId:$(_this).attr("data-cid")})});
						
//					},
//					scene:privilegeSceneConst.eSceneTypeAttention
//				});	
			});
			
		},
		comm : {
			count : function(){ //如果当前改变的值大于等于统计数
				var t= controller;
				if(t.opts.changeVal >= t.opts.count) t.opts.changeVal=0;
			},
			adapter : function(kv){
				return {
					usernameUrl: "/pages/personal/others_contribution.html?cid="+kv.recommend_customer.recommendCustomerId,
					customerId : kv.recommend_customer.recommendCustomerId,
					relationship : kv.recommend_customer.relationship!==""?kv.recommend_customer.relationship:"//modules.allinmd.cn/familiar/images/user_img65.png",
					logoUrl : kv.recommend_customer.recommendLogoSpec,
					nickname : kv.recommend_customer.recommendLastName+kv.recommend_customer.recommendFirstName,
					company : kv.recommend_customer.recommendHospital,
					medicalTitle: kv.recommend_customer.recommendMedicalTitle
				};
			},
			onlyAjax : function(url,params){
				$.ajax({
					url:url,
					type:"POST",
					data:params
				});
			},
			ajaxSend : function(url,params,callback,callbackAction){
				var t= controller;
				$.ajax({
					url : url,
					type : "POST",
					data : params, 
					dataType : "json",
					success : function(data){
						if( !(!$.isEmptyObject(data) && data.responseObject.responseStatus && data.responseObject.responseData.data_rows>0) ){
							t.opts.count = data.responseObject.responseData.data_rows;  //取出总记录数
							callback(data.responseObject.responseData.data_list,callbackAction);
							if(t.opts.count<t.config.pageSize)	 $(t.opts.toggleData).hide();
						}else{
							$(t.opts.container).html('<section class="al-noFollowTips">'+
		                    	'<a href="/pages/personal/customerInfo.html">'+
		                    		'<img src="//img10.allinmd.cn/v3/friends/msg_no_perfect.png" alt="">'+
		                    	'</a>'+	
		                    '</section>');
						}
					}
				});
			}
		}
	};
	
	return controller.init(obj);
};
