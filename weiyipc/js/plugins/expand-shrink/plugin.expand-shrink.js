/**
 * 功能描述：展开收起 字符数控制
 * 使用方法：$("el").expandShrink({})
 *					 可选参数：参照下方len 基础数据
 *                              
 * 注意事件：
 * 
 * Created by QiaoLiang on 2015-04-07
 */

;(function($){
	$.fn.expandShrink = function(obj){
		var controller = {
			opts : {
				len : 22, 
				el : null,
				parent : null
			},
			init : function(obj){
				var t = this;
				$.extend(t.opts,obj);
				t.opts.el.html(t.wordLen(t.opts.el.html(), t.opts.len)).find(".expandOrShrink").on("click",function(){
					var pathName=location.pathname;
					if($(this).text()=== (t.opts.en?"Full Text":"展开")){
						$(this).text(t.opts.en?"Half Text":"收起");
						$(".expandShrink-hideWord",this.parentNode).show(); 
						$(".expandShrink-dot",this.parentNode).hide();
						if(/pages\/channel\/conference\/meeting_/.test(pathName)){
							var refId=$(this).parents('li').attr('data-conid');
							comm.creatEvent({
								triggerName:'展开',
								triggerType:"功能按钮",
								keyword:'',
								refId:refId,
								refType:'会议',
								actionId:11024
							});
						}else {
							if($("#resourceType").val()==1&&t.opts.el.parents("figure").hasClass("al-textDetailsBox")){//视频终端页简介展开按钮点击
                                comm.creatEvent({
                                    triggerType:"终端页功能",
                                    keyword:"展开",
                                    actionId:11051
                                });
							}else{
                                //事件埋点
                                comm.creatEvent({
                                    triggerType:"展开",
                                    keyword:"展开",
                                    actionId:77
                                });
							}

						}
						t.opts.fullCallback&& t.opts.fullCallback();//展开回调
					}else{
						$(this).text(t.opts.en?"Full Text":"展开");
						$(".expandShrink-hideWord",this.parentNode).hide(); 
						$(".expandShrink-dot",this.parentNode).show();
						if(/pages\/channel\/conference\/meeting_/.test(pathName)){
							refId=$(this).parents('li').attr('data-conid');
							comm.creatEvent({
								triggerName:'收起',
								triggerType:"功能按钮",
								keyword:'',
								refId:refId,
								refType:'会议',
								actionId:11025
							});
						}else {
							//事件埋点
							comm.creatEvent({
								triggerType:"收起",
								keyword:"收起",
								actionId:78
							});
						}
						t.opts.halfCallback&& t.opts.halfCallback();//收起回调
					}
				});
			},
			wordLen : function(str,len){//文字长度
				if(!str){ return str;}
				var t=this;
				var count = 0; //计数
				var strings = ""; //拼接字符串
				
				var regExp= /<a href=.*<\/a>/g;
				var alink_Arr= str.match(regExp); 
				str= str.split(str.match(regExp)).join('');
				for(var i=0;i<str.length;i++){
					if(str.charCodeAt(i)>128) count+=2;
						else count+=1;
					if(count>len){
						strings += "<span class=\"expandShrink-dot\">......</span><span class=\"expandShrink-hideWord\" style=\"display:none;\">"+str.substr(i)+"</span><span class=\"al-contentCollapse expandOrShrink cursor\">"+(t.opts.en?"Full Text":"展开")+"</span>";
						break;
					}else{
						strings += str.substr(i,1);
					}
				}
				if(/<span class=\"al-contentCollapse expandOrShrink cursor\">展开<\/span>/g.test(strings)){
					var tempArr= strings.split('</span><span class=\"al-contentCollapse expandOrShrink cursor\">展开</span>');
					return tempArr.join('')+ (alink_Arr==null?'':alink_Arr.toString())+'</span><span class=\"al-contentCollapse expandOrShrink cursor\">展开</span>';
				}else{
					return strings + (alink_Arr==null?'':alink_Arr.toString());
				}
			}
		}
		
		obj.el = this;
		controller.init(obj);
		return this;
	}
})(jQuery);