/**
 * 功能描述：举报功能
 * 使用方法:
 * 注意事件：
 * 引入来源：comm.func , comm.light, $.topTip comm.textChange.js作用：
 *
 * Created by QiaoLiang on 2016-5-9.
 */

module.report= function(obj){
	var apply= {
		cfg: {
			wordTotal: 100, //字符总数
			choicesURL: PC_CALL+"customer/report/reportReasonList/",
			createURL: PC_CALL+"customer/report/create/"
		},	
		opt: {
			refType: 0,
			refId: 0,
			reviewId: 0,	
			zIndex: 9, //层级
			backgroundOpacity: 70, //背景透明度
			backgroundColor: "#000000" //背景颜色 
		},	
		init: function(obj){
			var _this= this;
			$.extend(_this.opt, obj);
			
			//遮罩结构居中 
			comm.LightBox.show(_this.opt.backgroundOpacity, _this.opt.backgroundColor);
			var bodyContainer = $("body");
            bodyContainer.append(this.template());
            bodyContainer.css({"overflow":"hidden"});
			comm.setCenter($(_this.el.window));
			
			//初始化事件
			_this.eventCenter.init(_this);
		},
		el: {
			window: "#moduleReport",
			checkBoxClass: ".Ev-ClickCheckBox",
			checkBoxStatusData: "data-checkBox",
			closeWindow: ".Ev-ClickCloseWindow",
			reportReasonText: ".reportReason",
			submit: ".Ev-ClickSubmit",
			listPlace: "#reportList"
		},
		template: function(){
			return '<div id="moduleReport" class="report_wrap" style="position:absolute;z-index:'+this.opt.zIndex+'">'+
			    '<div class="report_main">'+
		        '<div class="repTit clearFloat">'+
		            '<p>请选择举报原因</p>'+
		            '<div class="Ev-ClickCloseWindow"><a href="javascript:;"><img class="turn" src="//modules.allinmd.cn/report/imgs/repBut.png" alt=""></a></div>'+
		        '</div>'+
		        '<div class="repMid">'+
		            '<ul id="reportList">'+
		            	
		            '</ul>'+
		            '<div class="repTextar">'+
		                '<textarea max='+this.cfg.wordTotal+' class="reportReason" placeholder="描述其他举报原因"></textarea>'+
		            '</div>'+
		        '</div>'+
		        '<div class="repBot clearFloat">'+
		            '<div class="repBotLef Ev-ClickSubmit" data-lock="true"><a href="javascript:;">确定</a></div>'+
		            '<div class="repBotRig Ev-ClickCloseWindow"><a href="javascript:;">取消</a></div>'+
		        '</div>'+
		    '</div>'+
		'</div>';
		},
		eventCenter: {
			init: function(t){ 
				var _this= this; 
				_this.listItems(t);
				_this.textAreaWordTotal(t);
				_this.submitIsActive(t);
				_this.closeWindow(t);
				_this.submit(t);
			},
			//举报列表
			listItems: function(t){
				function subTemplate(i,kv){
					return '<li class="clearFloat">'+
		                '<div class="Ev-ClickCheckBox" data-checkBox="false" data-value="'+i+'"><a href="javascript:;"><img src="//modules.allinmd.cn/report/imgs/rep01.png" alt=""></a></div>'+
		                '<p>'+kv+'</p>'+
		            '</li>';
				}
				
				function succ(result){
					var html="";
					if(result.responseObject){
						var data= result.responseObject.responseData;
						$.each(data,function(i,el){
							html+= subTemplate(i,el);	
						});
					}else{
						html= "暂无数据";
					}
					var upT= this.currObj;
					$(upT.el.listPlace).append(html);
					upT.eventCenter.toggleCheckbox(upT);
				}
				
				var promise= $.ajax({url: t.cfg.choicesURL,type:"get",data:{},currObj:t});
				promise.done(succ);
			},
			//字符总数
			textAreaWordTotal: function(t){
				var _this= this;
				$(t.el.reportReasonText).on("input", function(){
					comm.textChange({"$tex":$(this),"noTop":1});
				});
			},
			toggleCheckbox: function(t){ //切换复选框
				$(t.el.checkBoxClass).on("click",function(){
					if($(".Ev-ClickSubmit").attr("data-status") == "prohibitionAgainSubmit"){ return false; }
						
					var imgSrc,tempStatus,status= $(this).attr(t.el.checkBoxStatusData);
					if(status === "false"){
						imgSrc= "//modules.allinmd.cn/report/imgs/rep02.png";
						tempStatus= true;
					}else{
						imgSrc= "//modules.allinmd.cn/report/imgs/rep01.png";
						tempStatus= false;
					}
					
					$(this).attr(t.el.checkBoxStatusData, tempStatus);
					$("img", this).attr("src", imgSrc);
					
					//统计数目 决定是否允许提交按钮 前提是不在提交状态中....
					var total= t.eventCenter.getCheckBoxValue(t).length;
					if(total > 0) {
						$(".Ev-ClickSubmit").addClass("repBotLefActive").attr("data-lock", "false");
					}else{
						$(".Ev-ClickSubmit").removeClass("repBotLefActive").attr("data-lock", "true");
					}
				});
			},
			getCheckBoxValue: function(t){ //返回数组
				var checked= [], checkBox= $(t.el.checkBoxClass);
				$.each(checkBox, function(i, el){
					if($(this).attr("data-checkbox") === "true"){
						checked.push($(this).attr("data-value"));
					}
				});
				return checked.join(",");
			},
			submitIsActive: function(t){
				$(t.el.reportReasonText).on("input", function(){
					var total= comm.getByteLen($.trim($(this).val()));
					if(total > 0) {
						$(".Ev-ClickSubmit").addClass("repBotLefActive").attr("data-lock", "false");
					}else{
						$(".Ev-ClickSubmit").removeClass("repBotLefActive").attr("data-lock", "true");
					}
				});
			},
			closeWindow: function(t){ //关闭窗口
				$(t.el.closeWindow).on("click", function(){
					comm.LightBox.hide();
					$("body").css({"overflow":"auto"});
					$(t.el.window).remove();
					if($(this).hasClass("repBotRig")){//取消
						//事件埋点
						comm.creatEvent({
							triggerType:"全站功能按钮点击",
							keyword:"终端页举报取消",
							actionId:45,
							refType: t.opt.refType,
							refId: t.opt.refId
						});
					}else{
						//事件埋点
						comm.creatEvent({
							triggerType:"全站功能按钮点击",
							keyword:"终端页举报关闭",
							actionId:43,
							refType: t.opt.refType,
							refId: t.opt.refId
						});
					}
				});
			},
			submit: function(t){ //提交信息
				var _this= this;
				$(t.el.submit).on("click", function(){
					if($(this).attr("data-lock") === "false"){
						$(this).removeClass("repBotLefActive").attr("data-lock", "true").attr("data-status", "prohibitionAgainSubmit");
						$(t.el.reportReasonText).attr("readonly","readonly");
						
						function succ(result){
							var t= this.currObj;
							$.topTip({
								mark: "success",
								showTime: 3,
								content: "我们已收到您的举报内容，将会尽快处理，感谢您对唯医的支持！",
								callback: function(){
									$(t.el.closeWindow).trigger("click");
								}
							});
						}
						
						var dataParams= {};
						dataParams.paramJson = $.toJSON({
								resourceType: t.opt.refType, 
								resourceId: t.opt.refId,
								reviewId: t.opt.reviewId,
								reportReason: t.eventCenter.getCheckBoxValue(t),
								visitSiteId: 1,
								dataFlag: 2,
								reportContent: $(t.el.reportReasonText).val(), 
								isValid: 1  
						});
						
						$.ajax({url:t.cfg.createURL,type:"post",data:dataParams,currObj:t}).done(succ);
						
					}
				});
			}
		}
	};
	
	apply.init(obj);
};
//var total= comm.getByteLen($(this).val());
//
//if(total >= t.cfg.wordTotal){
//	$(this).val(comm.getStrByteLen($(this).val(), t.cfg.wordTotal));
//}