/**
 * 功能描述：转发 收藏 赞头像列表 
 * 场景：个人首页点击转发 收藏 赞
 * 使用方法：$(el).faceList({});
 * 								obj.num 当前数量
 * 								obj.list 数据列表 {logoUrl : 头像}
 *                              obj.type 类型 praise-赞、forward-转发、collect-收藏
 *                              obj.action 动作 确定还是取消
 *                              
 *                              消失未做
 *                              
 * 				   可选参数 : obj.liNum 几条数据
 * 								 obj.width 宽度 
 * 								 obj.height 高度  
 * 
 *                              
 * 逻辑：当赞触发，列表显示
 * 					如果当前是赞列表，取消赞，赞列表清空当前人头像，如果未点取消赞，而点其它收藏等，则不触发任何动作
 * 
 * Created by QiaoLiang on 2015-04-01.
 */
;(function($){
	$.fn.faceList = function(obj){
		var controller = {
			path : {},
			opts : {
				width : 367, //宽度
				height : 51, //高度
				liNum : 7, //列出头像数目
				list : {}  //列出头像信息
			},
			template : {
				main : function(kv){ //主结构
					var html = '<div class="face-list" data-type="'+kv.type+'">'+ 
					 '<div class="face_list_l font_yahei">'+
				        '<div class="face_list_num">'+kv.num+'</div>'+
				        '<div class="face_list_icon"><img src="//plugins.allinmd.cn/face-list/images/'+kv.type+'.png"/></div>'+
				    '</div>'+
				    '<div class="face_list_r" style="width:'+kv.width+'px;height:'+kv.height+'px">'+
				        '<ul class="face-list-data">'+
				        '</ul>'+
				    '</div>'+
				    '<div class="clear"></div>'+
					'</div>' ;
					return html;
				},
				li : function(kv){
					return '<li><a class="name-card" customerId="'+kv.customerId+'" href="/pages/personal/home.html?cid='+kv.customerId+'"><img src="'+(kv.logoUrl===""?"//plugins.allinmd.cn/face-list/images/user_img65.png":kv.logoUrl)+'"/></a></li>';
				}
			},
			init : function(obj,_this){
				var t = this;
				if(!obj.type){ console.log("期待参数不足！请参阅plugin.face-list.js"); return false;}
				$.extend(t.opts,obj);
				
				//存在则重置，不存在则追加
				var html = "";
				var len = t.fn.listLen(t.opts.liNum,t.opts.list.length); //计算应该显示几条
				if($(".face-list",_this).length>0){//存在
					//取出当前显示的类型
					var currType = $(".face-list",_this).attr("data-type");
					if(t.opts.type === currType && !t.opts.action){ //存在元素与触发相等且动作为假
						$(".face-list",_this).animate({height:0},500,function(){
							$(".face-list",_this).remove();
						});
					}else if(t.opts.type !== currType && t.opts.action){ //存在元素与触发不相等时且动作为真
						$(".face-list").attr("data-type",t.opts.type); //修改类型
						$(".face_list_icon>img",_this).attr("src","//plugins.allinmd.cn/face-list/images/"+t.opts.type+".png");
						$(".face_list_num").text(t.opts.num);
						
						for(var i=0;i<len;i++){ 
							html += t.template.li({logoUrl:t.opts.list[i].logoUrl,customerId:t.opts.list[i].customerId});
						}
						
						$(".face-list-data",_this).html(html).animate({
							width:t.opts.width
						},1000);
					}
					return false;
				}else if($(".face-list",_this).length===0 && t.opts.action){ //不存在且为动作为真时
					$(_this).append(t.template.main({num:t.opts.num,type:t.opts.type,width:t.opts.width,height:t.opts.height}));
					
					for(var i=0;i<len;i++){ 
						html += t.template.li({logoUrl:t.opts.list[i].logoUrl,customerId:t.opts.list[i].customerId});
					}
					
					$(".face-list-data",_this).html(html).animate({
						width:t.opts.width
					},1000);
					
					//引入名片
					module.nameCard({
		                selector:".name-card"
		            });
				}else{ //不处理
					return false;
				}
			},
			fn : {
				listLen : function(a,b){
					if(b === undefined) return 0;
					return a>b?b:a;
				}
			}
				
		};
		controller.init(obj,this)
		return this;
	}
})(jQuery);