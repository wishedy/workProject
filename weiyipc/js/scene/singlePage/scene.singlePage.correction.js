/**
 * 功能描述：纠错功能
 * 使用方法:
 * 注意事件：
 * 引入来源：comm.func $.topTip作用：
 *
 * Created by QiaoLiang on 2016-5-9.
 */

module.correction= function(obj){
	var apply= {
		cfg: {
			itemCount: 9, //标记最多增加条数
			wordTotal: 1000, //1000个汉字
			correctionURL: PC_CALL+"customer/correct/create/"
		},	
		init: function(obj){
			var _this= this;
			$.extend(_this.opt, obj);
			_this.eventCenter.init(_this);
		},
		opt: {
			incrementItems: null,
			submit: null,
			itemSign: null,
			originText: null, //
			adviceText: null,
			markCount: ".Ev-itemMark",
			refType: 0,
			refId: 0
		},
		template: function(num){
			return '<dl class="correAll Ev-itemMark">'+
		                '<dt>纠错'+num+'</dt>'+
		                '<dd class="clearFloat">'+
		                    '<p>原文内容</p>'+
		                    '<textarea max='+this.cfg.wordTotal+' name=""></textarea>'+
		                '</dd>'+
		                '<dd class="clearFloat">'+
		                    '<p>建议修改</p>'+
		                    '<textarea max='+this.cfg.wordTotal+' name=""></textarea>'+
		                '</dd>'+
		            '</dl>'+
		           '<div class="correAllBot">&nbsp;</div>';
		},
		eventCenter: {
			init: function(t){
				var _this= this;
				_this.textAreaWordTotal(t);
				_this.submit(t);
				_this.incrementItems(t);
			},
			//字符总数
			textAreaWordTotal: function(t){
				var _this= this;
				$("textarea").on("input", function(){
					_this.originAndAdvice(t);
					
					comm.textChange({"$tex":$(this),"noTop":1});
				});
			},
			//来源与建议都不为空时开启激活状态
			originAndAdvice: function(t){
				var originTextLen= comm.getByteLen($.trim(t.opt.originText.val()));
				var adviceTextLen= comm.getByteLen($.trim(t.opt.adviceText.val()));
				if(originTextLen >0 && adviceTextLen >0){ 
					t.opt.submit.addClass("correBtnActive").attr("data-lock", "false");
				}else{ 
					t.opt.submit.removeClass("correBtnActive").attr("data-lock", "true"); 
				};
			},
			submit: function(t){
				t.opt.submit.on("click",function(){
					if($(this).attr("data-lock") === "false"){
						$(this).removeClass("correBtnActive").attr("data-lock", "true").attr("data-status","prohibitionAllOP"); 
						$("textarea").attr("readonly","readonly");
						
						function succ(result){
							$.topTip({
								mark: "success",
								showTime: 3,
								content: "我们已收到您的纠错内容，将会尽快处理，感谢您对唯医的支持！",
								callback: function(){
									location.href= document.referrer;
								}
							});
						}
						
						//获取纠错数据
						var correctionArr= [];
						$.each($(t.opt.markCount),function(i, el){
							var origin= $(el).find("textarea").eq(0).val();
							var advice= $(el).find("textarea").eq(1).val();
							correctionArr.push({
								 correctContentOrigin: origin,
								 correctContentSuggest: advice
							});
						});
						
						var dataParams= {};
						dataParams.paramJson= $.toJSON({
							resourceType: t.opt.refType,
							resourceId: t.opt.refId,
							visitSiteId: 1, 
							reviewId: 0, 
							dataFlag: 2,
							isValid: 1,
							correction: JSON.stringify(correctionArr) 
						});

						$.ajax({url:t.cfg.correctionURL,data:dataParams,type:"post"}).done(succ);
					}
				});
			},
			//增加条项
			incrementItems: function(t){
				var _this= this;
				t.opt.incrementItems.on("click", function(){
					if(t.opt.submit.attr("data-status") == "prohibitionAllOP"){ return false;}//禁止增项
					
					var count= $(t.opt.markCount).length;
					if(count < t.cfg.itemCount){
						var numArr= [,"二","三","四","五","六","七","八","九"];
						t.opt.itemSign.before(t.template(numArr[count]));
						
						_this.textAreaWordTotal(t);
						
						//如果到达总数移动增项功能
						if(count == t.cfg.itemCount-1){
							t.opt.itemSign.remove(); 
						}
					}
				});
			}
		}
	};
	
	apply.init(obj);
}

$(function(){
	//get
	var obj= {
		incrementItems: $(".Ev-incrementItems"),	
		itemSign : $(".Ev-itemSign"),
		submit: $(".Ev-submit"),
		originText: $(".Ev-oneOrigin"),
		adviceText: $(".Ev-oneAdvice"),
		refType: comm.getpara().refType,
		refId: comm.getpara().refId
	}
	
	if( obj.refType === undefined || obj.refId === undefined ){
		location.href= "/";
	}
	
	module.correction(obj);
});